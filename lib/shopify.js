/* ============================================================================
   Page Forge — Shopify Admin API (MULTI-NEGOZIO)
   Legge una lista di store da SHOPIFY_STORES (JSON). Ogni funzione riceve lo
   store scelto. Cache token per-store. Fallback alle vecchie variabili singole.
   ========================================================================== */

const VERSION = () => process.env.SHOPIFY_API_VERSION || "2025-10";

/* Lista store: da SHOPIFY_STORES (JSON array) oppure fallback single-store. */
export function getStores() {
  const raw = process.env.SHOPIFY_STORES;
  if (raw) {
    try {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) {
        const stores = arr.map((s, i) => ({
          id: s.id || ("store" + (i + 1)),
          name: s.name || s.shop || ("Store " + (i + 1)),
          shop: s.shop,
          client_id: s.client_id,
          client_secret: s.client_secret,
        })).filter((s) => s.shop && s.client_id && s.client_secret);
        if (stores.length) return stores;
      }
    } catch (e) { /* formato non valido: uso il fallback */ }
  }
  if (process.env.SHOPIFY_SHOP && process.env.SHOPIFY_CLIENT_ID && process.env.SHOPIFY_CLIENT_SECRET) {
    return [{
      id: "default", name: "Store",
      shop: process.env.SHOPIFY_SHOP,
      client_id: process.env.SHOPIFY_CLIENT_ID,
      client_secret: process.env.SHOPIFY_CLIENT_SECRET,
    }];
  }
  return [];
}

export function getStore(id) {
  const stores = getStores();
  if (!stores.length) throw new Error("Nessuno store configurato (imposta SHOPIFY_STORES su Vercel).");
  if (!id) return stores[0];
  const s = stores.find((x) => x.id === id);
  if (!s) throw new Error("Store non trovato: " + id);
  return s;
}

const _tokens = new Map(); // shop -> { token, exp }

export async function getToken(store) {
  const now = Date.now();
  const cached = _tokens.get(store.shop);
  if (cached && now < cached.exp) return cached.token;

  const res = await fetch(`https://${store.shop}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ client_id: store.client_id, client_secret: store.client_secret, grant_type: "client_credentials" }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.access_token) {
    throw new Error("Token Shopify fallito (" + store.name + "): " + (data.error_description || data.error || JSON.stringify(data).slice(0, 200)));
  }
  const ttl = (data.expires_in ? data.expires_in : 72000) * 1000;
  _tokens.set(store.shop, { token: data.access_token, exp: now + ttl - 60000 });
  return data.access_token;
}

export async function gql(store, query, variables) {
  const token = await getToken(store);
  const res = await fetch(`https://${store.shop}/admin/api/${VERSION()}/graphql.json`, {
    method: "POST",
    headers: { "content-type": "application/json", "X-Shopify-Access-Token": token },
    body: JSON.stringify({ query, variables: variables || {} }),
  });
  const data = await res.json().catch(() => ({}));
  if (data.errors) throw new Error("GraphQL: " + JSON.stringify(data.errors).slice(0, 400));
  return data.data;
}

export async function getMainTheme(store) {
  const d = await gql(store, `{ themes(first: 20) { nodes { id name role } } }`);
  const nodes = (d && d.themes && d.themes.nodes) || [];
  const main = nodes.find((t) => t.role === "MAIN") || nodes[0];
  if (!main) throw new Error("Nessun tema trovato");
  return main;
}

export async function readThemeFile(store, themeId, filename) {
  const d = await gql(store,
    `query($id: ID!, $files: [String!]) {
      theme(id: $id) { files(filenames: $files, first: 1) { nodes { filename body { ... on OnlineStoreThemeFileBodyText { content } } } } }
    }`,
    { id: themeId, files: [filename] }
  );
  const node = d && d.theme && d.theme.files && d.theme.files.nodes && d.theme.files.nodes[0];
  const content = node && node.body && node.body.content;
  return content || null;
}

export async function upsertFiles(store, themeId, files) {
  const input = files.map((f) => ({ filename: f.filename, body: { type: "TEXT", value: f.value } }));
  const d = await gql(store,
    `mutation($files: [OnlineStoreThemeFilesUpsertFileInput!]!, $themeId: ID!) {
      themeFilesUpsert(files: $files, themeId: $themeId) {
        upsertedThemeFiles { filename }
        userErrors { field message }
      }
    }`,
    { files: input, themeId }
  );
  const r = d.themeFilesUpsert;
  if (r.userErrors && r.userErrors.length) throw new Error("Upsert: " + JSON.stringify(r.userErrors).slice(0, 400));
  return r.upsertedThemeFiles.map((f) => f.filename);
}

export async function listProducts(store, limit) {
  const d = await gql(store,
    `query($n: Int!) { products(first: $n, sortKey: UPDATED_AT, reverse: true) {
      nodes { id title handle templateSuffix featuredImage { url } } } }`,
    { n: Math.min(Math.max(limit || 30, 1), 100) }
  );
  return (d && d.products && d.products.nodes) || [];
}

export async function setProductTemplate(store, productId, suffix) {
  const d = await gql(store,
    `mutation($product: ProductUpdateInput!) {
      productUpdate(product: $product) { product { id templateSuffix } userErrors { field message } }
    }`,
    { product: { id: productId, templateSuffix: suffix } }
  );
  const r = d.productUpdate;
  if (r.userErrors && r.userErrors.length) throw new Error("Assegnazione: " + JSON.stringify(r.userErrors).slice(0, 400));
  return r.product;
}

export function adminThemeEditorUrl(store, themeId, filename) {
  const numeric = String(themeId).split("/").pop();
  const shopName = (store.shop || "").replace(".myshopify.com", "");
  return `https://admin.shopify.com/store/${shopName}/themes/${numeric}/editor`;
}
