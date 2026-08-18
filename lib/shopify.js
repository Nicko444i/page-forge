/* ============================================================================
   Page Forge — Shopify Admin API
   Token (client credentials, con cache) + GraphQL + operazioni tema/prodotti.
   ========================================================================== */

const SHOP = () => process.env.SHOPIFY_SHOP;
const VERSION = () => process.env.SHOPIFY_API_VERSION || "2025-10";

let _token = null;
let _tokenExp = 0;

export async function getToken() {
  const now = Date.now();
  if (_token && now < _tokenExp) return _token;
  const shop = SHOP();
  const id = process.env.SHOPIFY_CLIENT_ID;
  const secret = process.env.SHOPIFY_CLIENT_SECRET;
  if (!shop || !id || !secret) throw new Error("Config mancante: SHOPIFY_SHOP / SHOPIFY_CLIENT_ID / SHOPIFY_CLIENT_SECRET");

  const res = await fetch(`https://${shop}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ client_id: id, client_secret: secret, grant_type: "client_credentials" }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.access_token) {
    throw new Error("Token Shopify fallito: " + (data.error_description || data.error || JSON.stringify(data).slice(0, 200)));
  }
  _token = data.access_token;
  const ttl = (data.expires_in ? data.expires_in : 72000) * 1000; // default 20h
  _tokenExp = now + ttl - 60000;
  return _token;
}

export async function gql(query, variables) {
  const token = await getToken();
  const res = await fetch(`https://${SHOP()}/admin/api/${VERSION()}/graphql.json`, {
    method: "POST",
    headers: { "content-type": "application/json", "X-Shopify-Access-Token": token },
    body: JSON.stringify({ query, variables: variables || {} }),
  });
  const data = await res.json().catch(() => ({}));
  if (data.errors) throw new Error("GraphQL: " + JSON.stringify(data.errors).slice(0, 400));
  return data.data;
}

export async function getMainTheme() {
  const d = await gql(`{ themes(first: 20) { nodes { id name role } } }`);
  const nodes = (d && d.themes && d.themes.nodes) || [];
  const main = nodes.find((t) => t.role === "MAIN") || nodes[0];
  if (!main) throw new Error("Nessun tema trovato");
  return main; // { id, name, role }
}

export async function readThemeFile(themeId, filename) {
  const d = await gql(
    `query($id: ID!, $files: [String!]) {
      theme(id: $id) { files(filenames: $files, first: 1) { nodes { filename body { ... on OnlineStoreThemeFileBodyText { content } } } } }
    }`,
    { id: themeId, files: [filename] }
  );
  const node = d && d.theme && d.theme.files && d.theme.files.nodes && d.theme.files.nodes[0];
  const content = node && node.body && node.body.content;
  return content || null;
}

export async function upsertFiles(themeId, files) {
  // files: [{ filename, value }]
  const input = files.map((f) => ({ filename: f.filename, body: { type: "TEXT", value: f.value } }));
  const d = await gql(
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

export async function listProducts(limit) {
  const d = await gql(
    `query($n: Int!) { products(first: $n, sortKey: UPDATED_AT, reverse: true) {
      nodes { id title handle templateSuffix featuredImage { url } } } }`,
    { n: Math.min(Math.max(limit || 30, 1), 100) }
  );
  return (d && d.products && d.products.nodes) || [];
}

export async function setProductTemplate(productId, suffix) {
  const d = await gql(
    `mutation($product: ProductUpdateInput!) {
      productUpdate(product: $product) {
        product { id templateSuffix }
        userErrors { field message }
      }
    }`,
    { product: { id: productId, templateSuffix: suffix } }
  );
  const r = d.productUpdate;
  if (r.userErrors && r.userErrors.length) throw new Error("Assegnazione: " + JSON.stringify(r.userErrors).slice(0, 400));
  return r.product;
}

export function adminThemeEditorUrl(themeId, filename) {
  const numeric = String(themeId).split("/").pop();
  const shopName = (SHOP() || "").replace(".myshopify.com", "");
  return `https://admin.shopify.com/store/${shopName}/themes/${numeric}/editor`;
}
