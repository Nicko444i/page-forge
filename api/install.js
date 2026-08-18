import { coerceUPS, buildSectionFiles, mergeTemplate, slugify } from "../lib/engine.js";
import { getMainTheme, readThemeFile, upsertFiles, setProductTemplate, adminThemeEditorUrl } from "../lib/shopify.js";
import { checkAuth, readBody } from "../lib/auth.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Usa POST" });
  if (!checkAuth(req, res)) return;

  const b = readBody(req);
  if (!b.ups) return res.status(400).json({ error: "Manca lo UPS (genera prima la pagina)." });

  try {
    const ups = coerceUPS(b.ups, b.name);
    const slug = slugify(b.templateName || ups.meta.slug);
    const templateFilename = "templates/product." + slug + ".json";

    // 1) sezioni + css dal motore
    const adapter = buildSectionFiles(ups);

    // 2) tema principale
    const theme = await getMainTheme();

    // 3) leggo il product.json di default per preservare il buy box del tema (Shrine, ecc.)
    let existing = null;
    try {
      const raw = await readThemeFile(theme.id, "templates/product.json");
      if (raw) existing = JSON.parse(raw);
    } catch (e) { existing = null; }

    // 4) merge (mai sovrascrivo il default: creo un template NUOVO e separato)
    const merged = mergeTemplate(adapter, existing, b.buyBoxName);

    // 5) upsert: sezioni + css + il nuovo template
    const files = Object.entries(adapter.files).map(([filename, value]) => ({ filename, value }));
    files.push({ filename: templateFilename, value: JSON.stringify(merged.template, null, 2) });
    const written = await upsertFiles(theme.id, files);

    // 6) assegnazione (solo se richiesta e con prodotto scelto)
    let assigned = false;
    if (b.assign && b.productId) {
      await setProductTemplate(b.productId, slug);
      assigned = true;
    }

    res.status(200).json({
      ok: true,
      theme: theme.name,
      templateFilename,
      slug,
      mode: merged.mode,
      assigned,
      written,
      warnings: merged.warnings,
      editorUrl: adminThemeEditorUrl(theme.id, templateFilename),
    });
  } catch (e) {
    res.status(500).json({ error: "Installazione fallita: " + e.message });
  }
}
