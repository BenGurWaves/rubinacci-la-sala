# Maison Rubinacci · La Stoffa

A digital atelier for Rubinacci, the Neapolitan tailoring house founded in 1932.

The site is a single bolt of indigo Neapolitan wool, 540 centimetres long, marked in tailor's chalk with the eight pattern pieces of the unstructured jacket. The visitor drifts along the cloth from selvedge to selvedge.

## Run locally
```bash
python3 -m http.server 5311
# then open http://localhost:5311
```

No build step. One CDN font (Bodoni Moda variable). Everything else is hand-drawn SVG and a small Canvas for the chalk dust.

## Navigate
- **drag** the cloth horizontally
- **wheel** (vertical or horizontal)
- **← / →** arrow keys
- **1–8** jump to a piece
- **Home / End** ride to the first / last piece
- **click a tape-measure mark** at the bottom

## Files
- `index.html` — the bolt, the tape-measure rail, the prose stage, the loader, the chalk cursor
- `style.css` — Capri Indaco palette, Bodoni Moda solo-typeface system, mobile-perfect breakpoints
- `script.js` — drift physics, piece-development logic, dispersion typography, chalk-dust canvas, loader sequence
- `PROJECT_NOTES.md` — concept, signature audit, anti-pattern audit, palette, typography, lessons applied
