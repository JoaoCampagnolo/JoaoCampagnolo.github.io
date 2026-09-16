# João Campagnolo

Personal portfolio, built with HTML, CSS and JavaScript. GitHub Pages publishes the root of `main` to https://www.joaocampagnolo.com/.

## Preview and edit

Serve this folder with `python -m http.server 8001 --bind 127.0.0.1` and open http://127.0.0.1:8001/. The homepage is `index.html`, its theme is `styles.css`, and `site.js` handles the optional colour preference. The PhD page also uses `projects/phd.css`.

The publication list intentionally retains both manuscripts in preparation. Panumateket links to its existing independent app.

The homepage presents research, publications, background, then independent projects. Contact links appear at both ends. Its overlapping name is accessible live text styled with CSS, so it remains sharp at any screen size. Supporting text uses locally hosted DM Sans; its Open Font License is included in `assets/fonts/DM-Sans-OFL.txt`.

## Jitterpedia

Jitterpedia is a separate Sites app at https://jitterpedia.pogagnolo.chatgpt.site/. Its standalone source checkout is `jitterpedia-app/` (ignored by this repository, with its own Git history and hosting repository). Its `.openai/hosting.json` is the hosting source of truth. Keep that checkout when moving this development workspace.

The legacy URL `projects/jitterpedia.html` directs visitors to the new app. If the old browser has pending ratings, it first offers their CSV export; browser storage cannot be read across domains. `projects/jitterpedia-data.js` preserves the original source export.

The Jitterpedia collection and submission form support public access without accounts. Only its owner approval page requires sign-in. The portfolio redesign remains on its review branch until published through GitHub Pages.

## Assets

`images/jitterpedia-wordmark.png` is an original generated wordmark. Its exact generation prompt and the product-image source manifest live in the Jitterpedia app's `public/assets/` directory. No product label was generated or recoloured.
