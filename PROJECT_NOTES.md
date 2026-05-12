# Maison Rubinacci · La Stoffa

## Brand truth
Founded 1932 in Naples by Gennaro Rubinacci as *London House*. Renamed *Rubinacci* in 1963. The maison's defining gesture is the **unstructured Neapolitan jacket** — soft shoulder, no canvas in the chest, no padding, the *spalla camicia* (shirt-shoulder) gathered at the head. The work IS the cloth and the chalk.

## Radical metaphor (one sentence)
> *You are the tailor's hand reading a bolt of indigo Neapolitan cloth — drifting along the workbench from selvedge to selvedge, where every chalk mark unfurls a chapter of the maison.*

## Five references (current award-winning landscape, 2024–2026)
1. **Maison Margiela archive (digital lookbooks)** — naked SVG line-work as fashion grammar.
2. **Mr Porter's *The Journal* longreads** — editorial restraint with hairline rules and italic captions.
3. **Lemaire SS24 micro-site** — a single horizontal traversal as the entire site.
4. **Rick Owens *Tecuatl* show book** — chalk-on-paper aesthetic, no photographs.
5. **Acne Studios FW25 lookbook** — typography-as-architecture, single typeface.

## New spatial grammar — *La Stoffa*
A single bolt of indigo wool, 540 cm long, rendered as a 5400×1080 SVG. The visitor drifts horizontally (drag, wheel, arrow, rail-click). Eight tailor's pattern pieces are inscribed in chalk hairline at composed cm-positions:

| Cm  | Ord  | Piece                | Translation |
|-----|------|----------------------|-------------|
| 048 | I    | Il Davanti           | the front panel |
| 118 | II   | Il Dietro            | the back, single vent |
| 208 | III  | La Manica            | the soft set-in sleeve, *spalla camicia* |
| 280 | IV   | Il Bavero            | the wide notch lapel |
| 335 | V    | Il Collo             | the under-collar, in melton |
| 388 | VI   | Il Polso             | the working buttonhole, four-on-one |
| 448 | VII  | La Spalla Camicia    | the unmade shoulder; the maison signature |
| 514 | VIII | La Fodera            | the half-canvas, Bemberg seta |

The bolt ends with a chalk monogram **M·R · since MCMXXXII** at the right selvedge, and a quiet invitation to the atelier at Via Filangieri.

## Signature elements audit
- **Radical Metaphor** — the bolt of cloth; the user is the tailor's hand.
- **New Spatial Grammar** — *La Stoffa* (horizontal drape traversal, no scroll, no nav, no grid).
- **Living Texture** — SVG diagonal twill weave + indigo gradient + foxing (static fractalNoise) + slow conic silk-sheen sweep (38s loop). Never flat.
- **Custom Cursor** — *La Calcatura* — a tailor's chalk that tilts, leaves a low-opacity dust trace (Canvas, destination-out fade per frame), and snaps into a marking-tilt during drag.
- **Elegant Loader** — a single chalk line drawn 0 → 540 cm with a tape-measure readout, finished by *"The cloth is being laid out for marking."* — no spinner, no progress bar.
- **Typography as Architecture** — a single typeface (**Bodoni Moda variable**, optical sizes, italic, tabular figures). Pattern titles are inscribed *on* the cloth, rotated to match its drape. The chapter line uses word-locked dispersion typography (per-letter blur-fade, never breaks mid-word — Lesson #86).
- **Poetic Transitions** — the bolt eases with a critically-damped spring; pieces *develop* as they enter range (chalk strokes appear, ticks settle, grain-line arrows drift in); the prose disperses + arrives per letter.
- **Reactive Environment** — drag velocity sags the bolt's Y position (drape physics); near-pieces preview their titles before activation; the rail's pin-gold marker shows the current cm.
- **Bespoke Interactions** — drag-to-drift, wheel, arrows, number keys 1–8 jump to pieces, rail-click. Everything snap-eased to the nearest piece on pointer-up.
- **Mobile Perfection** — touch-action: none on stage, drag pointer events, frame trimmed to two corners on phones, prose left-aligned, rail labels suppressed except active.

## Anti-pattern audit (zero infractions)
- No hero · No footer · No sidebar · No hamburger · No grid · No cards · No scroll-snap · No lorem · No generic transitions · No stock assets.

## Palette — Capri Indaco · Tela e Spilla
- Tela `#F1ECE2` · chalked paper
- Gesso `#FAF6EC` · fresh chalk (only stroke colour)
- Filo Indaco `#1C2945` · Neapolitan indigo wool, mid
- Filo Notte `#0F1626` · roller deep
- Filo Indaco-Soft `#243556` · warp highlight
- Spilla d'Oro `#B89766` · the gold pin (active rail mark, hover accents only)
- Seta Rubino `#6E1F22` · silk lining; appears only inside La Fodera's pad-stitching
- Carbone `#2F2C28` · pencil graphite

## Typography
**Bodoni Moda** variable — single typeface, no companion sans, no mono. Italic for titles + body, roman for the M·R cipher, small-caps for surtitles, tabular figures for the cm readout. Radical solo-typeface restraint, fresh against the log (which has Cormorant solo and Instrument Serif solo elsewhere — but not Bodoni).

## Interaction — *La Calcatura*
- Cursor is a tailor's chalk (white triangular SVG, drop-shadow halo) angled at -22°.
- On drag the chalk tilts to -32° and scales 1.1× (it is *marking*).
- Movement deposits sub-pixel dust circles at low opacity (~0.10); a destination-out fade (~0.06 alpha/frame) dries the trail to a hairline ghost so the workbench stays clean.

## Loader — *Tagliare il Filo*
A single chalk line draws across the bolt at ease-out cubic, tape-measure ticks every 60 cm, the cm counter rolls 000 → 540, then the cloth settles and the bolt is centred on Piece I.

## Tech notes
- Pure HTML / CSS / JS. No frameworks, no libraries, no build step.
- One Google Fonts request (Bodoni Moda).
- All visuals SVG (one inline 5400×1080 bolt) + a hairline Canvas for the chalk dust.
- Drape: simple eased target spring on cm; drag velocity → small Y sag; sheen band CSS-keyframed.
- Word-locked dispersion typography (Lesson #86).
- Touch-action: none on stage; pointer events for unified mouse/touch.

## Pre-delivery
- Engine: PASSED
- All Signatures: YES
- Anti-Patterns: 0
