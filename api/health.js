import { getStores, getToken, getMainTheme } from "../lib/shopify.js";

export default async function handler(req, res) {
  const out = { ok: true, env: {}, stores: [] };
  out.env.SHOPIFY_STORES = process.env.SHOPIFY_STORES ? "impostato" : "(non impostato — uso variabili singole)";
  out.env.SHOPIFY_API_VERSION = process.env.SHOPIFY_API_VERSION || "2025-10 (default)";
  out.env.ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY ? "impostato (AI attiva)" : "(mancante — userà il parser)";
  out.env.APP_PASSWORD = process.env.APP_PASSWORD ? "impostato" : "(nessuna — tool aperto)";

  const stores = getStores();
  if (!stores.length) { out.ok = false; out.error = "Nessuno store configurato"; return res.status(200).json(out); }

  for (const s of stores) {
    const row = { id: s.id, name: s.name, shop: s.shop };
    try { await getToken(s); row.token = "OK"; }
    catch (e) { row.token = "FAIL: " + e.message; out.ok = false; out.stores.push(row); continue; }
    try { const t = await getMainTheme(s); row.theme = "OK: " + t.name + " (" + t.role + ")"; }
    catch (e) { row.theme = "FAIL: " + e.message; out.ok = false; }
    out.stores.push(row);
  }
  res.status(200).json(out);
}
