// Lista dei negozi configurati (solo id + nome, NESSUN segreto).
import { getStores } from "../lib/shopify.js";
import { checkAuth } from "../lib/auth.js";

export default async function handler(req, res) {
  if (!checkAuth(req, res)) return;
  try {
    const stores = getStores().map((s) => ({ id: s.id, name: s.name, shop: s.shop }));
    res.status(200).json({ stores });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
