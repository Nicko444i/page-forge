import { parseScriptToUPS, coerceUPS, previewHTML } from "../lib/engine.js";
import { extractUPSFromScript, writeUPSFromIdea } from "../lib/ai.js";
import { checkAuth, readBody } from "../lib/auth.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Usa POST" });
  if (!checkAuth(req, res)) return;

  const b = readBody(req);
  const mode = b.mode || "script";
  const name = b.name || "";
  const styleOverride = b.style && b.style !== "auto" ? b.style : null;

  let ups = null;
  let engine = "parser";

  try {
    if (mode === "idea") {
      // La generazione da idea richiede l'AI (un parser non inventa copy).
      ups = await writeUPSFromIdea(b.brief || { name });
      engine = "ai";
    } else {
      const script = b.script || "";
      if (!script.trim()) return res.status(400).json({ error: "Script vuoto." });
      try { ups = await extractUPSFromScript(script, name); engine = "ai"; }
      catch (e) {
        if (e.message === "no-anthropic-key") { ups = parseScriptToUPS(script, name); engine = "parser"; }
        else { ups = parseScriptToUPS(script, name); engine = "parser-fallback"; }
      }
    }
  } catch (e) {
    if (mode === "idea" && String(e.message).includes("no-anthropic-key"))
      return res.status(400).json({ error: "La generazione da idea richiede una chiave Anthropic (ANTHROPIC_API_KEY). Usa 'Script' oppure imposta la chiave su Vercel." });
    return res.status(500).json({ error: "Generazione fallita: " + e.message });
  }

  ups = coerceUPS(ups, name);
  if (styleOverride) ups.design.style_preset = styleOverride;

  const preview = previewHTML(ups);
  res.status(200).json({ ups, preview, engine });
}
