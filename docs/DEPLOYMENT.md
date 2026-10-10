# Publication package

Live deployment: https://proof-graph-blue.vercel.app

Public repository: https://github.com/chapaevv123/ProofGraph

## Public runtime

The Vite application is read-only in the browser. It needs no private key, wallet login, backend, or production environment variable. It queries the anonymous Tiramisu RPC directly; the endpoint passed a browser-origin CORS preflight. Writes remain in local owner-controlled scripts.

Optional: a server-side Arkiv access key may improve quota later, but it must never be exposed as a VITE-prefixed browser variable. V1 deliberately uses the public endpoint and receipt-backed fallback.

## GitHub publication state

The public repository exists and local main tracks origin/main. Future critical publication fixes use ordinary commits and git push origin main; never force-push submission history.

## Vercel publication state

The public Vercel deployment is live. It uses Vite, npm run build, and dist, with no production environment variables. Verify it in a logged-out browser after any future critical fix.

Do not run local write scripts in Vercel. Never upload .env or PRIVATE_KEY.
