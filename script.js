/* ──────────────────────────────────────────────────────────────────────
   Maison Rubinacci · La Stoffa
   The bolt drifts on drag / wheel / arrow / rail-click.
   Pattern pieces "develop" as they enter the viewport.
   The cursor is a tailor's chalk that leaves dust.
   ──────────────────────────────────────────────────────────────────── */

(() => {
  'use strict';

  /* ─── Bolt geometry ─────────────────────────────────────────────────── */
  const BOLT_CM = 540;
  const BOLT_VB_W = 5400;     // SVG viewBox width
  const BOLT_VB_H = 1080;
  const PX_PER_CM = BOLT_VB_W / BOLT_CM; // 10

  /* ─── The eight pieces, in cm position order ────────────────────────── */
  // cm here = the centre of each piece's outline in the SVG's bolt coordinate
  // (1 cm = 10 viewBox units; bolt is 540 cm wide). These values position both
  // the rail tick and the visible-centre when the visitor jumps to a piece.
  const PIECES = [
    { key:'davanti', cm: 22,
      ord:'I',  title:'Il Davanti',    sub:'— the front panel',
      prose:'Gennaro cuts the front in one pass: no canvas in the chest, no padding in the shoulder. The cloth is asked to remember a body, not to forget it.' },
    { key:'dietro',  cm: 75,
      ord:'II', title:'Il Dietro',     sub:'— the back, single vent',
      prose:'A single vent for a man who walks. The back is read as one panel, the centre seam laid with a two-inch overlap, the way Naples has cut since 1932.' },
    { key:'manica',  cm:131,
      ord:'III',title:'La Manica',     sub:'— spalla camicia, soft sleeve-head',
      prose:'The sleeve is gathered at the head like the shoulder of a shirt. The mappina, they call it — the small ripples — are inscribed in chalk, never pressed away.' },
    { key:'bavero',  cm:196,
      ord:'IV', title:'Il Bavero',     sub:'— the wide notch lapel',
      prose:'The lapel is broad and rolls of its own accord. Pad-stitched by hand, in seta, so the leaf curves softly toward the third button — never lies flat against the chest.' },
    { key:'collo',   cm:253,
      ord:'V',  title:'Il Collo',      sub:'— the under-collar, in melton',
      prose:'The under-collar is felted melton, attached by hand in two-millimetre felling stitches. It is what makes the collar sit on the neck without command.' },
    { key:'polso',   cm:302,
      ord:'VI', title:'Il Polso',      sub:'— working buttonhole, four-on-one',
      prose:'Four buttons at the cuff, the last two kissing. Every buttonhole opens; we know of no maison signature less negotiable than this one.' },
    { key:'spalla',  cm:387,
      ord:'VII',title:'La Spalla Camicia', sub:'— the unmade shoulder; the maison signature',
      prose:'The shoulder is the soul of the Neapolitan jacket. We refuse pad and shoulder-iron alike — the cloth ripples a little, like a shirt-shoulder, and so the wearer does too.' },
    { key:'fodera',  cm:498,
      ord:'VIII', title:'La Fodera',   sub:'— the half-canvas, Bemberg seta',
      prose:'A half-canvas of horsehair to the chest only, then Bemberg silk for the rest. The jacket is built to be carried, not to carry itself.' },
  ];

  /* ─── Element references ────────────────────────────────────────────── */
  const $ = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));

  const stage     = $('#stage');
  const bolt      = $('#bolt');
  const cloth     = $('#cloth-shell');
  const proseLine = $('#prose-line');
  const proseCite = $('#prose-cite');
  const prosePiece= $('#prose-piece');
  const railMarks = $('#rail-marks');
  const railNum   = $('#rail-cm-num');
  const invitation= $('#invitation');
  const cipher    = document.getElementById('cipher');
  const chalk     = $('#chalk');
  const dustCanvas= $('#dust');
  const dustCtx   = dustCanvas.getContext('2d');
  const pieces    = $$('.piece');

  /* ─── Loader sequence ───────────────────────────────────────────────── */
  function runLoader () {
    const loaderChalk = document.getElementById('loader-chalk');
    const loaderTicks = document.getElementById('loader-ticks');
    const cmNum = document.getElementById('loader-cm-num');

    // build a few ticks across the line
    for (let cm = 0; cm <= 540; cm += 60) {
      const x = (cm / 540) * 1080;
      const t = document.createElementNS('http://www.w3.org/2000/svg','line');
      t.setAttribute('x1', x); t.setAttribute('x2', x);
      t.setAttribute('y1', 36); t.setAttribute('y2', 44);
      t.setAttribute('stroke', 'rgba(241,236,226,0.35)');
      t.setAttribute('stroke-width', '0.6');
      loaderTicks.appendChild(t);
    }

    const D = 2200; // ms
    const start = performance.now();
    const targetX = 1080;
    function tick (now) {
      const t = Math.min((now - start) / D, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      loaderChalk.setAttribute('x2', String(eased * targetX));
      cmNum.textContent = Math.round(eased * 540).toString().padStart(3,'0');
      if (t < 1) requestAnimationFrame(tick);
      else finish();
    }
    requestAnimationFrame(tick);

    function finish () {
      // settle pause, then reveal
      setTimeout(() => {
        document.body.classList.remove('is-loading');
        // start at piece I after a short breath
        setTimeout(() => goToCm(PIECES[0].cm, true), 380);
      }, 520);
    }
  }

  /* ─── Drift (the bolt's horizontal position, in cm 0..540) ──────────── */
  // The bolt is wider than the viewport. We translate it horizontally so that
  // the active cm position sits centred in the viewport.
  let cm = 0;        // visible-centre cm
  let cmTarget = 0;  // target cm (eased toward)
  let dragVelocity = 0;

  function clampCm (v) { return Math.max(0, Math.min(BOLT_CM, v)); }

  function applyTransform () {
    // The SVG natural-render width depends on viewport height (height:100%).
    // To centre cm position c, we want the SVG's pixel-x at (c * px-per-cm-actual)
    // to align with viewport centre.
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const renderedWidth = (vh / BOLT_VB_H) * BOLT_VB_W; // px
    const pxPerCm = renderedWidth / BOLT_CM;
    const targetXatCenter = cm * pxPerCm;
    let translate = vw / 2 - targetXatCenter;

    // Light drape: if drag is fast, the bolt sags slightly.
    const sag = Math.min(Math.abs(dragVelocity) * 0.8, 14);
    const sagY = -sag * 0.5; // bolt rises a little on fast drag
    bolt.style.transform = `translate3d(${translate.toFixed(2)}px, ${sagY.toFixed(2)}px, 0)`;
    bolt.style.width = renderedWidth + 'px';
  }

  // Spring-ease cm toward cmTarget
  function rafTick () {
    const ease = 0.085;
    const dCm = cmTarget - cm;
    cm += dCm * ease;
    dragVelocity *= 0.86;
    if (Math.abs(dCm) < 0.01) cm = cmTarget;
    applyTransform();
    updateActivePiece();
    updateRailCursor();
    requestAnimationFrame(rafTick);
  }

  /* ─── Active piece + prose ──────────────────────────────────────────── */
  let activeIdx = -1;

  function updateActivePiece () {
    // distance-based: the piece nearest cm becomes active; near-by pieces "develop"
    let bestIdx = 0, bestDist = Infinity;
    PIECES.forEach((p, i) => {
      const d = Math.abs(p.cm - cm);
      if (d < bestDist) { bestDist = d; bestIdx = i; }
    });
    pieces.forEach((g, i) => {
      const d = Math.abs(PIECES[i].cm - cm);
      g.classList.toggle('is-on', d < 28);
      g.classList.toggle('is-near', d >= 28 && d < 60);
    });
    if (bestIdx !== activeIdx) {
      activeIdx = bestIdx;
      announcePiece(PIECES[bestIdx]);
    }
    // cipher reveals only near the very end of the bolt
    if (cipher) cipher.classList.toggle('is-on', cm > 528);
    // invitation appears only at the very last cm (the maison's seal)
    if (invitation) invitation.classList.toggle('is-on', cm > 535.5);
    // active class on rail chapter marks
    $$('.rail-chapter').forEach((el, i) => el.classList.toggle('is-active', i === bestIdx));
    // numeric readout
    railNum.textContent = Math.round(cm).toString().padStart(3,'0');
  }

  function announcePiece (p) {
    prosePiece.textContent = `${p.ord} · ${p.title}`;
    proseCite.textContent  = `— ${p.sub}`;
    setProseLine(proseLine, p.prose);
  }

  // word-locked dispersion (Lesson #86): split into words, then letters per word
  function setProseLine (el, str) {
    el.classList.remove('is-in');
    let gi = 0;
    el.innerHTML = str.split(/(\s+)/).map(part => {
      if (/^\s+$/.test(part)) return '<span class="ws">\u00A0</span>';
      const inner = [...part].map(ch => {
        const html = `<span class="ltr" style="--li:${gi}">${ch === ' ' ? '\u00A0' : ch}</span>`;
        gi += 1;
        return html;
      }).join('');
      return `<span class="word">${inner}</span>`;
    }).join('');
    // arrive on the next tick
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('is-in')));
  }

  /* ─── Rail (tape measure) ───────────────────────────────────────────── */
  let railCursor;
  function buildRail () {
    // cm marks: minor every 10cm, major every 50cm, chapter at piece positions
    const frag = document.createDocumentFragment();
    for (let c = 0; c <= BOLT_CM; c += 10) {
      const li = document.createElement('li');
      li.className = (c % 50 === 0) ? 'major' : 'minor';
      li.style.left = `${(c / BOLT_CM) * 100}%`;
      frag.appendChild(li);
    }
    PIECES.forEach((p, i) => {
      const li = document.createElement('li');
      li.className = 'chapter rail-chapter';
      li.style.left = `${(p.cm / BOLT_CM) * 100}%`;
      li.dataset.label = `${p.ord} · ${p.title}`;
      li.dataset.ord   = p.ord;
      li.dataset.idx   = i;
      li.addEventListener('click', () => goToCm(p.cm));
      frag.appendChild(li);
    });
    railMarks.appendChild(frag);
    railCursor = document.createElement('div');
    railCursor.id = 'rail-cursor';
    railMarks.appendChild(railCursor);
  }
  function updateRailCursor () {
    if (!railCursor) return;
    railCursor.style.transform = `translateX(${(cm / BOLT_CM) * railMarks.clientWidth}px)`;
  }

  /* ─── Navigation ────────────────────────────────────────────────────── */
  function goToCm (target, instant=false) {
    cmTarget = clampCm(target);
    if (instant) cm = cmTarget;
  }
  function nudgeCm (delta) {
    cmTarget = clampCm(cmTarget + delta);
  }
  function snapToNearest () {
    let best = PIECES[0].cm, bd = Infinity;
    PIECES.forEach(p => { const d = Math.abs(p.cm - cmTarget); if (d < bd) { bd = d; best = p.cm; }});
    if (bd < 24) cmTarget = best;
  }

  // wheel: horizontal-or-vertical wheel both drive the cm
  let wheelLast = 0;
  window.addEventListener('wheel', (e) => {
    e.preventDefault();
    const now = performance.now();
    const dt = Math.min(Math.max(now - wheelLast, 8), 60);
    wheelLast = now;
    const d = (Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY);
    nudgeCm(d * 0.16);
    dragVelocity = d;
  }, { passive: false });

  // keyboard
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'PageDown') { nudgeCm(20); e.preventDefault(); }
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { nudgeCm(-20); e.preventDefault(); }
    else if (e.key === 'Home') goToCm(PIECES[0].cm);
    else if (e.key === 'End')  goToCm(PIECES[PIECES.length-1].cm);
    else if (e.key === 'Escape') goToCm(PIECES[0].cm);
    else if (e.key >= '1' && e.key <= '8') {
      const i = parseInt(e.key, 10) - 1;
      if (PIECES[i]) goToCm(PIECES[i].cm);
    }
  });

  // pointer drag
  let dragging = false, dragStartX = 0, dragStartCm = 0, lastMoveX = 0, lastMoveT = 0;
  stage.addEventListener('pointerdown', (e) => {
    if (e.target.closest('a, .rail-chapter, #invitation a')) return;
    dragging = true;
    dragStartX = e.clientX;
    dragStartCm = cmTarget;
    lastMoveX = e.clientX; lastMoveT = performance.now();
    stage.setPointerCapture(e.pointerId);
    chalk.classList.add('is-mark');
  });
  stage.addEventListener('pointermove', (e) => {
    moveChalk(e.clientX, e.clientY);
    spawnDust(e.clientX, e.clientY);
    if (!dragging) return;
    const vw = window.innerWidth, vh = window.innerHeight;
    const renderedWidth = (vh / BOLT_VB_H) * BOLT_VB_W;
    const pxPerCm = renderedWidth / BOLT_CM;
    const dx = e.clientX - dragStartX;
    cmTarget = clampCm(dragStartCm - dx / pxPerCm);
    const now = performance.now();
    dragVelocity = (e.clientX - lastMoveX) / Math.max(now - lastMoveT, 8) * -16;
    lastMoveX = e.clientX; lastMoveT = now;
  });
  stage.addEventListener('pointerup', (e) => {
    if (!dragging) return;
    dragging = false;
    chalk.classList.remove('is-mark');
    snapToNearest();
  });
  stage.addEventListener('pointercancel', () => { dragging = false; chalk.classList.remove('is-mark'); });
  stage.addEventListener('pointerleave', () => { chalk.classList.add('is-hidden'); });
  stage.addEventListener('pointerenter', () => { chalk.classList.remove('is-hidden'); });

  // touch is pointer events; ensure scroll never hijacks
  stage.style.touchAction = 'none';

  /* ─── Chalk cursor + dust trail ─────────────────────────────────────── */
  function moveChalk (x, y) {
    chalk.style.setProperty('--cx', `${x - 4}px`);
    chalk.style.setProperty('--cy', `${y - 18}px`);
    chalk.style.transform = `translate3d(${x - 4}px, ${y - 18}px, 0) rotate(-22deg)`;
  }
  function fitDust () {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    dustCanvas.width = innerWidth * dpr;
    dustCanvas.height = innerHeight * dpr;
    dustCanvas.style.width = innerWidth + 'px';
    dustCanvas.style.height = innerHeight + 'px';
    dustCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  fitDust();
  window.addEventListener('resize', () => { fitDust(); applyTransform(); });

  function spawnDust (x, y) {
    // very low opacity, very narrow line: a barely-there hairline (Lesson #62)
    dustCtx.fillStyle = 'rgba(250,246,236,0.10)';
    for (let i = 0; i < 2; i++) {
      const r = Math.random() * 0.9 + 0.2;
      const ox = (Math.random() - 0.5) * 6;
      const oy = (Math.random() - 0.5) * 6;
      dustCtx.beginPath();
      dustCtx.arc(x + ox, y + oy, r, 0, Math.PI * 2);
      dustCtx.fill();
    }
  }

  function fadeDust () {
    // aggressive fade so the chalk dust dries fast
    dustCtx.globalCompositeOperation = 'destination-out';
    dustCtx.fillStyle = 'rgba(0,0,0,0.06)';
    dustCtx.fillRect(0, 0, innerWidth, innerHeight);
    dustCtx.globalCompositeOperation = 'source-over';
    requestAnimationFrame(fadeDust);
  }
  fadeDust();

  /* ─── Mouse parallax (bolt drifts ±10px against cursor for living drape) */
  // Already incorporated: drag velocity creates Y sag in applyTransform.
  // For an additional gentle parallax independent of drag, we'd compete with
  // the drag transform — keep this restrained.

  /* ─── Boot ──────────────────────────────────────────────────────────── */
  buildRail();
  applyTransform();
  rafTick();
  runLoader();

  // hide chalk on outside-window
  document.addEventListener('mouseleave', () => chalk.classList.add('is-hidden'));
  document.addEventListener('mouseenter', () => chalk.classList.remove('is-hidden'));
})();
