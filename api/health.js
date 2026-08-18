import { getToken, getMainTheme } from "../lib/shopify.js";

export default async function handler(req, res) {
  const out = { ok: true, env: {}, checks: {} };
  out.env.SHOPIFY_SHOP = process.env.SHOPIFY_SHOP || "(mancante)";
  out.env.SHOPIFY_CLIENT_ID = process.env.SHOPIFY_CLIENT_ID ? "impostato" : "(mancante)";
  out.env.SHOPIFY_CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET ? "impostato" : "(mancante)";
  out.env.SHOPIFY_API_VERSION = process.env.SHOPIFY_API_VERSION || "2025-10 (default)";
  out.env.ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY ? "impostato (AI attiva)" : "(mancante — userà il parser)";
  out.env.APP_PASSWORD = process.env.APP_PASSWORD ? "impostato" : "(nessuna — tool aperto)";

  try { await getToken(); out.checks.token = "OK"; }
  catch (e) { out.ok = false; out.checks.token = "FAIL: " + e.message; return res.status(200).json(out); }

  try { const t = await getMainTheme(); out.checks.theme = "OK: " + t.name + " (" + t.role + ")"; }
  catch (e) { out.ok = false; out.checks.theme = "FAIL: " + e.message; }

  res.status(200).json(out);
}
