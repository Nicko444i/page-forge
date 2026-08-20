/* ============================================================================
   Page Forge — Cervello (API Anthropic)
   Due usi: strutturare uno script in UPS, e scrivere la copy da un'idea.
   Se ANTHROPIC_API_KEY manca, queste funzioni lanciano: il chiamante ripiega
   sul parser deterministico.
   ========================================================================== */

const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5";

const TYPES_DOC = `Allowed section types: hero, product_core, benefits, reviews, faq, rich_text, cta_banner.
Rules:
- Include exactly ONE "product_core" (buy box anchor, empty settings), right after the hero.
- Feature list under a heading => "benefits" blocks [{icon,title,text}]. The "icon" MUST be a single real emoji CHARACTER (e.g. 💧, ⚡, 🧼, 🔌, 🎯), never the emoji's name (not "droplet") and never a shortcode (not ":droplet:").
- Testimonials => "reviews" blocks [{author,rating(1-5),text}].
- Q/A pairs => "faq" blocks [{question,answer}].
- Long prose => "rich_text" {heading, body}.
- Opening headline/tagline => "hero" {eyebrow?,headline,subhead?,align,cta_label?}.
- Closing call to action => "cta_banner" {headline,subtext?,button_label?}.
- richtext fields use ONLY <p><br><strong><em><a><ul><ol><li>.
- Output shape:
{"ups_version":"1.0","meta":{"name":"...","slug":"...","source_language":"en","sources":["ai"]},"design":{"style_preset":"editorial","source":"ai"},"sections":[...]}
Return ONLY valid JSON. No markdown, no code fences, no prose.`;

const EXTRACTOR_SYSTEM = `You convert raw product-page text into a Universal Page Schema (UPS) JSON object.
${TYPES_DOC}
- Do NOT invent facts. Light rephrasing only. Keep it faithful and concise.
- Pick design.style_preset in [editorial,bold,minimal]; if unsure use "editorial".`;

const COPYWRITER_SYSTEM = `You are a senior DTC ecommerce copywriter. From a short product brief you write a COMPLETE, high-converting product page and output it directly as a Universal Page Schema (UPS) JSON object.
Voice: calm, precise, authoritative, founder-sharing — never hypey, never "guru", never clickbait. Old-money restraint.
Write these sections in this order: hero (eyebrow, strong headline, subhead), product_core, benefits (3-4 concrete benefits), rich_text (a short product story/description), faq (3-4 real questions a buyer would ask), reviews (2-3 EXAMPLE testimonials), cta_banner.
IMPORTANT about reviews: authors must be generic like "Verified customer" and the text must read as an EXAMPLE the merchant will replace with real reviews. Never fabricate specific real-sounding named people as if they were genuine customers.
Only use facts present in the brief; do not invent claims, ingredients, certifications, or numbers that aren't given.
${TYPES_DOC}`;

function extractJson(text) {
  let t = (text || "").trim().replace(/^```(json)?/i, "").replace(/```$/i, "").trim();
  const a = t.indexOf("{"), b = t.lastIndexOf("}");
  if (a === -1 || b === -1) throw new Error("AI: nessun JSON valido in risposta");
  return JSON.parse(t.slice(a, b + 1));
}

async function callAnthropic(system, userContent, maxTokens) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error("no-anthropic-key");
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 45000);
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: MODEL, max_tokens: maxTokens, system, messages: [{ role: "user", content: userContent }] }),
      signal: ctrl.signal,
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error("AI HTTP " + res.status + ": " + body.slice(0, 300));
    }
    const data = await res.json();
    return (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n");
  } finally { clearTimeout(timer); }
}

async function withRepair(system, userContent, maxTokens) {
  const out = await callAnthropic(system, userContent, maxTokens);
  try { return extractJson(out); }
  catch (e) {
    const repair = await callAnthropic(system, userContent + "\n\n(Your previous reply was not valid JSON. Return ONLY the corrected complete JSON.)", maxTokens);
    return extractJson(repair);
  }
}

export async function extractUPSFromScript(script, name) {
  const user = "Product name: " + (name || "Product") + "\n\nProduct page text:\n" + script;
  return withRepair(EXTRACTOR_SYSTEM, user, 16000);
}

export async function writeUPSFromIdea(brief) {
  const b = brief || {};
  const lines = [
    "Product name: " + (b.name || "Product"),
    b.category ? "Category / what it is: " + b.category : "",
    b.audience ? "Target audience: " + b.audience : "",
    b.tone ? "Tone: " + b.tone : "",
    b.claims ? "Key claims / facts (use ONLY these): " + b.claims : "",
    b.guarantee ? "Guarantee / risk reversal: " + b.guarantee : "",
    b.extra ? "Extra notes: " + b.extra : "",
  ].filter(Boolean).join("\n");
  return withRepair(COPYWRITER_SYSTEM, "Write the full product page for this brief:\n" + lines, 16000);
}
