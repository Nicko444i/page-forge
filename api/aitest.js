// Diagnostica AI: prova più modelli e riporta quale funziona.
// Apri /api/aitest dopo il deploy e incolla l'output. Nessun segreto viene mostrato.

export default async function handler(req, res) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return res.status(200).json({ keyPresent: false, note: "ANTHROPIC_API_KEY mancante su Vercel" });

  const candidates = [...new Set([
    process.env.ANTHROPIC_MODEL,
    "claude-sonnet-4-5",
    "claude-sonnet-4-5-20250929",
    "claude-sonnet-4-20250514",
    "claude-3-5-sonnet-latest",
    "claude-haiku-4-5-20251001",
  ].filter(Boolean))];

  const results = [];
  for (const model of candidates) {
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
        body: JSON.stringify({ model, max_tokens: 10, messages: [{ role: "user", content: "Say OK" }] }),
      });
      const status = r.status;
      let snippet = "";
      try {
        const j = await r.json();
        snippet = status === 200
          ? "REPLY: " + ((j.content && j.content[0] && j.content[0].text) || "").slice(0, 40)
          : "ERR: " + ((j.error && j.error.message) || JSON.stringify(j)).slice(0, 140);
      } catch (e) { snippet = "(risposta non leggibile)"; }
      results.push({ model, status, ok: status === 200, snippet });
    } catch (e) {
      results.push({ model, error: String(e.message || e).slice(0, 140) });
    }
  }

  const working = results.filter((r) => r.ok).map((r) => r.model);
  res.status(200).json({
    keyPresent: true,
    defaultModel: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5 (default nel codice)",
    workingModels: working,
    results,
  });
}
