export function checkAuth(req, res) {
  const pw = process.env.APP_PASSWORD;
  if (!pw) return true; // nessuna password impostata = aperto
  const given = req.headers["x-app-password"];
  if (given === pw) return true;
  res.status(401).json({ error: "Password mancante o errata." });
  return false;
}

export function readBody(req) {
  if (!req.body) return {};
  if (typeof req.body === "string") { try { return JSON.parse(req.body); } catch { return {}; } }
  return req.body;
}
