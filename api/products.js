import { listProducts } from "../lib/shopify.js";
import { checkAuth } from "../lib/auth.js";

export default async function handler(req, res) {
  if (!checkAuth(req, res)) return;
  try {
    const nodes = await listProducts(50);
    const products = nodes.map((p) => ({
      id: p.id,
      title: p.title,
      handle: p.handle,
      template: p.templateSuffix || "default",
      image: (p.featuredImage && p.featuredImage.url) || null,
    }));
    res.status(200).json({ products });
  } catch (e) {
    res.status(500).json({ error: "Lista prodotti fallita: " + e.message });
  }
}
