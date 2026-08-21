import { coerceUPS, slugify } from "../lib/engine.js";
import { buildShrineTemplate } from "../lib/shrine.js";
import { getStore, getMainTheme, readThemeFile, upsertFiles, setProductTemplate, adminThemeEditorUrl } from "../lib/shopify.js";
import { checkAuth, readBody } from "../lib/auth.js";

// I template JSON di Shopify possono contenere commenti /* */ e //: JSON.parse no.
function stripJsonComments(s) {
  return String(s || "").replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Usa POST" });
  if (!checkAuth(req, res)) return;

  const b = readBody(req);
  if (!b.ups) return res.status(400).json({ error: "Manca lo UPS (genera prima la pagina)." });

  try {
    const store = getStore(b.store);
    const ups = coerceUPS(b.ups, b.name);
    const slug = slugify(b.templateName || ups.meta.slug);
    const templateFilename = "templates/product." + slug + ".json";

    const theme = await getMainTheme(store);

    let mainSection = null;
    const warnings = [];
    try {
      const raw = await readThemeFile(store, theme.id, "templates/product.json");
      if (raw) {
        const parsed = JSON.parse(stripJsonComments(raw));
        if (parsed && parsed.sections && parsed.sections.main) mainSection = parsed.sections.main;
      }
    } catch (e) {
      warnings.push("Lettura product.json fallita (" + e.message + "): buy box non preservato.");
    }
    if (!mainSection) {
      warnings.push("Buy box del tema non trovato: uso un main-product base. Verifica l'add-to-cart nell'editor.");
      mainSection = { type: "main-product", settings: {} };
    }

    const template = buildShrineTemplate(ups, mainSection);
    const files = [{ filename: templateFilename, value: JSON.stringify(template, null, 2) }];
    const written = await upsertFiles(store, theme.id, files);

    let assigned = false;
    if (b.assign && b.productId) { await setProductTemplate(store, b.productId, slug); assigned = true; }

    res.status(200).json({
      ok: true, store: { id: store.id, name: store.name }, theme: theme.name,
      templateFilename, slug, mode: "shrine-native",
      assigned, written, warnings, editorUrl: adminThemeEditorUrl(store, theme.id, templateFilename),
    });
  } catch (e) {
    res.status(500).json({ error: "Installazione fallita: " + e.message });
  }
}
