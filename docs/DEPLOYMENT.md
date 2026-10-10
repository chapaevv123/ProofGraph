# Publication package

## Public runtime

The Vite application is read-only in the browser. It needs no private key, wallet login, backend, or production environment variable. It queries the anonymous Tiramisu RPC directly; the endpoint passed a browser-origin CORS preflight. Writes remain in local owner-controlled scripts.

Optional: a server-side Arkiv access key may improve quota later, but it must never be exposed as a VITE-prefixed browser variable. V1 deliberately uses the public endpoint and receipt-backed fallback.

## GitHub owner actions

1. Create an empty public GitHub repository named ProofGraph.
2. From this directory, review and create the first commit:

       git add .
       git commit -m "feat: build ProofGraph Arkiv demo"

3. Add the repository URL and push:

       git remote add origin https://github.com/OWNER/ProofGraph.git
       git branch -M main
       git push -u origin main

4. Replace the README's pending repository label with the real URL.

## Vercel owner actions

1. Import the public GitHub repository into Vercel.
2. Confirm framework preset Vite, build command npm run build, and output directory dist. vercel.json already declares these.
3. Add no environment variables for the public read-only deployment.
4. Deploy, open the URL in a logged-out/private browser, and verify Discover, proof detail, Challenges, Why Arkiv, and an explorer link.
5. Replace the README and submission draft pending deployment field with the real URL.

CLI alternative after Vercel authentication:

    npx vercel
    npx vercel --prod

Do not run local write scripts in Vercel. Never upload .env or PRIVATE_KEY.
