/* ════════════════════════════════════════════════════
   app.js  —  App Orchestration
   Boot sequence, start screen, typewriter dialogue,
   floating hearts, pixel pet interactions.
   ════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════════════
   BOOT SEQUENCE
   Animates the loading bar, then reveals the
   Press Start screen.
══════════════════════════════════════════════════ */
(function boot() {
  const bar  = document.getElementById('bootBar');
  const txt  = document.getElementById('bootText');

  const bootMessages = [
    "Loading memories",
    "Warming up pixels",
    "Tuning frequencies",
    "Adding pink  ♡",
    "Ready!",
  ];

  let pct = 0;

  const iv = setInterval(() => {
    pct += Math.random() * 18 + 4;
    if (pct > 100) pct = 100;

    bar.style.width = pct + '%';

    const mi = Math.min(Math.floor(pct / 25), bootMessages.length - 1);
    txt.innerHTML = bootMessages[mi] + '<span class="boot-blink">_</span>';

    if (pct >= 100) {
      clearInterval(iv);
      setTimeout(() => {
        document.getElementById('bootScreen').style.display = 'none';

        const ss = document.getElementById('startScreen');
        ss.style.display = 'flex';

        // Start background canvas now so it's visible behind the start screen
        initBgCanvas();
      }, 500);
    }
  }, 120);
})();

/* ══════════════════════════════════════════════════
   START APP
   Called when the player presses the Start button.
══════════════════════════════════════════════════ */
function startApp() {
  document.getElementById('startScreen').style.display = 'none';

  const mainApp = document.getElementById('mainApp');
  mainApp.style.display = 'flex';

  // Initialise all subsystems
  buildPlaylist();
  loadTrack(0);
  initAlbumCanvas();
  initPet();
  startDotAnim();
  typeMessage();
}

/* ══════════════════════════════════════════════════
   ALBUM CANVAS INIT
   Just kicks off the idle (non-spinning) vinyl.
══════════════════════════════════════════════════ */
function initAlbumCanvas() {
  drawAlbumArt(playlist[0], false);
}

/* ══════════════════════════════════════════════════
   TYPEWRITER DIALOGUE
   Cycles through the messages array with a
   character-by-character typing effect.
══════════════════════════════════════════════════ */
let msgIndex       = 0;
let typewriterTimer = null;

function typeMessage() {
  const el  = document.getElementById('dialogueText');
  const msg = messages[msgIndex % messages.length];
  msgIndex++;
  el.textContent = '';
  let i = 0;

  clearInterval(typewriterTimer);
  typewriterTimer = setInterval(() => {
    el.textContent += msg[i];
    i++;
    if (i >= msg.length) {
      clearInterval(typewriterTimer);
      setTimeout(typeMessage, 4500);   // pause before next message
    }
  }, 55);
}

/* ══════════════════════════════════════════════════
   FLOATING HEARTS  (CSS-based)
   Spawns emoji hearts that float upward and fade.
   Called on play and on pet click.
══════════════════════════════════════════════════ */
function spawnFloatingHearts() {
  const emojis = ['♡', '💗', '🌸', '💖', '✦'];

  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      const h = document.createElement('div');
      h.className   = 'float-heart';
      h.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      h.style.left  = (15 + Math.random() * 70) + 'vw';
      h.style.bottom = '20px';
      h.style.fontSize = (14 + Math.random() * 14) + 'px';
      document.body.appendChild(h);
      setTimeout(() => h.remove(), 2100);
    }, i * 180);
  }
}

/* ══════════════════════════════════════════════════
   PIXEL PET  —  Click Handler
   Shows a random speech bubble and spawns hearts.
══════════════════════════════════════════════════ */
function petClicked() {
  const bubble = document.getElementById('petBubble');
  bubble.textContent = petSayings[Math.floor(Math.random() * petSayings.length)];
  bubble.classList.add('show');
  spawnFloatingHearts();
  setTimeout(() => bubble.classList.remove('show'), 2500);
}
