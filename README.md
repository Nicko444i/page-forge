# Page Forge — backend

Genera una product page (da script o da idea con AI) e la installa nel tema Shopify
(crea sempre un template nuovo, mai sovrascrive il default; opzionalmente lo assegna a un prodotto).

## Struttura
- `index.html` — l'interfaccia (servita su `/`)
- `api/generate.js` — script/idea → UPS + anteprima
- `api/products.js` — lista prodotti
- `api/install.js` — crea template + sezioni nel tema, opzionale assegnazione
- `api/health.js` — diagnostica (apri `/api/health` dopo il deploy)
- `lib/` — motore UPS, AI, Shopify, auth

## Variabili d'ambiente (da impostare su Vercel)
| Nome | Cosa | Obbligatoria |
|---|---|---|
| `SHOPIFY_SHOP` | dominio `.myshopify.com` | sì |
| `SHOPIFY_CLIENT_ID` | Client ID della custom app | sì |
| `SHOPIFY_CLIENT_SECRET` | Client secret della custom app | sì |
| `SHOPIFY_API_VERSION` | es. `2025-10` (default se vuoto) | no |
| `ANTHROPIC_API_KEY` | chiave AI (console.anthropic.com). Senza, usa il parser | no |
| `ANTHROPIC_MODEL` | modello (default `claude-sonnet-4-5`) | no |
| `APP_PASSWORD` | password per proteggere il tool | consigliata |

## Deploy (sintesi — la guida dettagliata è in chat)
1. Metti questa cartella in un repository GitHub (o caricala su Vercel).
2. Su Vercel: New Project → importa il repo.
3. Framework preset: **Other** (nessun build).
4. Aggiungi le variabili d'ambiente sopra.
5. Deploy.
6. Apri `https://IL-TUO-PROGETTO.vercel.app/api/health` per verificare che token e tema rispondano `OK`.
7. Apri `https://IL-TUO-PROGETTO.vercel.app/` per usare il tool.

## Note
- Nessuna dipendenza npm: usa `fetch` nativo (Node 18+).
- Il token Shopify viene generato e rinnovato da solo (client credentials, ~24h).
- L'install legge `templates/product.json` del tema per preservare il buy box.
