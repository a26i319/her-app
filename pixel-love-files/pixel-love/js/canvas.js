/* ════════════════════════════════════════════════════
   canvas.js  —  All Canvas API Rendering
   · Background scene (stars, hearts, sakura, fireflies)
   · Album art / vinyl animation
   · Pixel pet companion
   ════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════════════
   1. BACKGROUND CANVAS
   Renders a soft pink-and-white animated night scene:
   floating hearts, twinkling stars, sakura petals,
   glowing fireflies.
══════════════════════════════════════════════════ */
function initBgCanvas() {
  const canvas = document.getElementById('bgCanvas');
  const ctx    = canvas.getContext('2d');
  let W, H;

  // ── particle arrays ──
  const stars     = [];
  const hearts    = [];
  const petals    = [];
  const fireflies = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Seed stars
  for (let i = 0; i < 70; i++) {
    stars.push({
      x:       Math.random() * 3000,
      y:       Math.random() * 3000,
      r:       Math.random() * 1.5 + 0.5,
      twinkle: Math.random() * Math.PI * 2,
      speed:   Math.random() * 0.025 + 0.008,
    });
  }

  // Seed floating hearts
  for (let i = 0; i < 14; i++) {
    hearts.push({
      x:     Math.random() * 3000,
      y:     Math.random() * 3000,
      size:  Math.random() * 12 + 5,
      speed: Math.random() * 0.28 + 0.08,
      drift: (Math.random() - 0.5) * 0.35,
      alpha: Math.random() * 0.25 + 0.06,   // soft — won't overpower white bg
      phase: Math.random() * Math.PI * 2,
    });
  }

  // Seed sakura petals
  for (let i = 0; i < 22; i++) {
    petals.push({
      x:        Math.random() * 3000,
      y:        Math.random() * 3000,
      rx:       Math.random() * 6 + 3,
      ry:       Math.random() * 4 + 2,
      vx:       (Math.random() - 0.5) * 0.55,
      vy:       Math.random() * 0.45 + 0.12,
      rot:      Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.04,
      alpha:    Math.random() * 0.45 + 0.15,
    });
  }

  // Seed fireflies / glowing dots
  for (let i = 0; i < 16; i++) {
    fireflies.push({
      x:     Math.random() * 3000,
      y:     Math.random() * 3000,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.022 + 0.01,
      r:     Math.random() * 2 + 1,
      vx:    (Math.random() - 0.5) * 0.28,
      vy:    (Math.random() - 0.5) * 0.2,
    });
  }

  /* Draw a pixel heart (filled) centered at cx,cy */
  function drawHeart(ctx, cx, cy, size) {
    ctx.save();
    ctx.translate(cx, cy);
    const s = size / 12;
    ctx.beginPath();
    ctx.moveTo(0, -s * 3);
    ctx.bezierCurveTo( s * 5, -s * 7,  s * 10, -s * 2, 0,  s * 4);
    ctx.bezierCurveTo(-s * 10, -s * 2, -s * 5, -s * 7, 0, -s * 3);
    ctx.fill();
    ctx.restore();
  }

  function frame() {
    ctx.clearRect(0, 0, W, H);

    // Soft pink-to-white gradient background
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0,   '#fff5f8');
    grad.addColorStop(0.4, '#fce4ec');
    grad.addColorStop(0.7, '#fff0f5');
    grad.addColorStop(1,   '#fce4ec');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // ── Stars (tiny pink specks) ──
    stars.forEach(s => {
      s.twinkle += s.speed;
      const alpha = 0.25 + 0.35 * Math.abs(Math.sin(s.twinkle));
      ctx.fillStyle = `rgba(214, 51, 132, ${alpha})`;
      const sx = s.x % W;
      const sy = s.y % H;
      const sz = Math.ceil(s.r * 2);
      ctx.fillRect(Math.round(sx), Math.round(sy), sz, sz);
    });

    // ── Fireflies (soft pink glows) ──
    fireflies.forEach(f => {
      f.phase += f.speed;
      f.x = (f.x + f.vx + W) % W;
      f.y = (f.y + f.vy + H) % H;
      const alpha = 0.18 + 0.28 * Math.abs(Math.sin(f.phase));
      ctx.fillStyle = `rgba(233, 30, 140, ${alpha})`;
      ctx.fillRect(Math.round(f.x), Math.round(f.y), f.r * 2, f.r * 2);
    });

    // ── Floating hearts ──
    hearts.forEach(h => {
      h.y = (h.y - h.speed + H) % H;
      h.x = (h.x + h.drift + W) % W;
      h.phase += 0.018;
      const alpha = h.alpha * (0.6 + 0.4 * Math.sin(h.phase));
      ctx.fillStyle = `rgba(240, 98, 146, ${alpha})`;
      drawHeart(ctx, h.x, h.y, h.size);
    });

    // ── Sakura petals ──
    petals.forEach(p => {
      p.x   = (p.x + p.vx + W) % W;
      p.y   = (p.y + p.vy + H) % H;
      p.rot += p.rotSpeed;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = `rgba(252, 228, 236, ${p.alpha + 0.2})`;
      ctx.strokeStyle = `rgba(240, 98, 146, ${p.alpha * 0.6})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.rx, p.ry, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    });

    requestAnimationFrame(frame);
  }

  frame();
}

/* ══════════════════════════════════════════════════
   2. ALBUM ART CANVAS
   Draws an animated vinyl record with track colors.
   Called by player.js whenever the track changes.
══════════════════════════════════════════════════ */
let albumAnimId  = null;
let albumAngle   = 0;

/**
 * Start drawing the vinyl record for the given track.
 * @param {Object} track  — item from the playlist array
 * @param {boolean} playing — whether it should spin
 */
function drawAlbumArt(track, playing) {
  const canvas = document.getElementById('albumCanvas');
  const ctx    = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  if (albumAnimId) cancelAnimationFrame(albumAnimId);

  function frame() {
    ctx.clearRect(0, 0, W, H);

    ctx.save();
    ctx.translate(W / 2, H / 2);
    if (playing) albumAngle += 0.008;
    ctx.rotate(albumAngle);

    // Outer vinyl disc
    ctx.beginPath();
    ctx.arc(0, 0, 50, 0, Math.PI * 2);
    ctx.fillStyle = '#fff0f5';
    ctx.fill();

    // Groove rings
    for (let r = 47; r > 20; r -= 4) {
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(214, 51, 132, ${0.06 + (47 - r) * 0.007})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Center label with track's color
    const labelGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, 20);
    labelGrad.addColorStop(0, track.accent);
    labelGrad.addColorStop(1, track.color);
    ctx.beginPath();
    ctx.arc(0, 0, 20, 0, Math.PI * 2);
    ctx.fillStyle = labelGrad;
    ctx.fill();

    // Center hole
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // Tiny heart on label
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.font = '9px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('♡', 0, 0);

    ctx.restore();

    // Soft pink glow on top
    const glow = ctx.createRadialGradient(W/2, H/2, 18, W/2, H/2, 55);
    glow.addColorStop(0, 'transparent');
    glow.addColorStop(1, `${track.color}22`);
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    albumAnimId = requestAnimationFrame(frame);
  }

  frame();
}

/* ══════════════════════════════════════════════════
   3. PIXEL PET COMPANION
   A cute bobbing pixel cat drawn on a 48×48 canvas.
══════════════════════════════════════════════════ */
let petBobDir = 1;
let petBobY   = 0;

function initPet() {
  const canvas = document.getElementById('petCanvas');
  const ctx    = canvas.getContext('2d');

  function drawPet() {
    ctx.clearRect(0, 0, 48, 48);

    // Bobbing animation
    petBobY += petBobDir * 0.28;
    if (petBobY > 4 || petBobY < 0) petBobDir *= -1;
    const y = Math.round(petBobY);

    // Body
    ctx.fillStyle = '#fce4ec';
    ctx.fillRect(12, 16 + y, 24, 20);
    // Head
    ctx.fillRect(10, 8 + y, 28, 18);

    // Ears (outer)
    ctx.fillStyle = '#f06292';
    ctx.fillRect(10, 4 + y, 8, 8);
    ctx.fillRect(30, 4 + y, 8, 8);
    // Ears (inner)
    ctx.fillStyle = '#fce4ec';
    ctx.fillRect(12, 6 + y, 4, 4);
    ctx.fillRect(32, 6 + y, 4, 4);

    // Eyes
    ctx.fillStyle = '#c2185b';
    ctx.fillRect(14, 16 + y, 4, 4);
    ctx.fillRect(30, 16 + y, 4, 4);
    // Eye shine
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(15, 17 + y, 2, 2);
    ctx.fillRect(31, 17 + y, 2, 2);

    // Blush
    ctx.fillStyle = 'rgba(240, 98, 146, 0.45)';
    ctx.fillRect(11, 20 + y, 5, 3);
    ctx.fillRect(32, 20 + y, 5, 3);

    // Mouth
    ctx.fillStyle = '#e91e8c';
    ctx.fillRect(22, 22 + y, 4, 2);

    // Heart on tummy
    ctx.fillStyle = '#f06292';
    ctx.fillRect(20, 28 + y, 8, 6);
    ctx.fillRect(17, 26 + y, 6, 4);
    ctx.fillRect(27, 26 + y, 6, 4);

    // Tail
    ctx.fillStyle = '#f8bbd9';
    ctx.fillRect(34, 26 + y, 6, 10);
    ctx.fillRect(36, 36 + y, 6, 4);

    requestAnimationFrame(drawPet);
  }

  drawPet();
}
