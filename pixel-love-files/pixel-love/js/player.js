/* ════════════════════════════════════════════════════
   player.js  —  Music Player Logic
   Handles: play/pause, track loading, progress,
   volume, equalizer animation, loop, prev/next
   ════════════════════════════════════════════════════ */

/* ── STATE ── */
let currentTrack  = 0;
let isPlaying     = false;
let isLooping     = false;
let progress      = 0;
let duration      = 180;
let progressTimer = null;
let eqRunning     = false;
const audio       = new Audio();
audio.volume = 0.7; // Default volume
/* ══════════════════════════════════════════════════
   TRACK LOADING
══════════════════════════════════════════════════ */
function loadTrack(idx) {
  currentTrack = idx;
  const track  = playlist[idx];

  document.getElementById('trackName').textContent   = track.title;
  document.getElementById('trackArtist').textContent = '~ ' + track.artist + ' ~';
  document.getElementById('favBadge').style.display  = track.fav ? 'inline-block' : 'none';

  // Reset progress (simulate random song length)
  progress = 0;
  duration = 150 + Math.floor(Math.random() * 60);
  updateProgress();
  updatePlaylistActive();
  updateDots();

  // Redraw vinyl with new track colors
  if (track.src){
      audio.src = track.src;
      if (isPlaying) {
        audio.play();
      }
  }
  drawAlbumArt(track, isPlaying);

  // Restart progress timer if already playing
  if (isPlaying) {
    startProgressTimer();
    startEq();
  }
}

/* ══════════════════════════════════════════════════
   PLAY / PAUSE
══════════════════════════════════════════════════ */
function togglePlay() {
  isPlaying = !isPlaying;
  const btn = document.getElementById('playBtn');

  if (isPlaying) {
    btn.textContent = '❚❚ PAUSE';
    if (audio.src) audio.play();
    startProgressTimer();
    startEq();
    drawAlbumArt(playlist[currentTrack], true);
    spawnFloatingHearts();
  } else {
    btn.textContent = '▶ PLAY';
    audio.pause();
    clearInterval(progressTimer);
    stopEq();
    drawAlbumArt(playlist[currentTrack], false);
  }
}

function startProgressTimer() {
  clearInterval(progressTimer);

  // Use real audio duration once metadata loads
  audio.addEventListener('loadedmetadata', () => {
    duration = Math.floor(audio.duration);
    updateProgress();
  }, { once: true });

  // Auto-advance when song ends
  audio.addEventListener('ended', () => {
    if (isLooping) { audio.currentTime = 0; audio.play(); }
    else nextTrack();
  }, { once: true });

  progressTimer = setInterval(() => {
    if (!audio.src) return;
    progress = Math.floor(audio.currentTime);
    duration = Math.floor(audio.duration) || duration;
    updateProgress();
  }, 500);
}

/* ══════════════════════════════════════════════════
   PROGRESS BAR
══════════════════════════════════════════════════ */
function updateProgress() {
  const pct = (progress / duration) * 100;
  document.getElementById('progressFill').style.width = pct + '%';
  document.getElementById('currentTime').textContent  = formatTime(progress);
  document.getElementById('totalTime').textContent    = formatTime(duration);
}

function seekTo(e) {
  const el  = document.getElementById('progressTrack');
  const rect = el.getBoundingClientRect();
  const pct  = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  progress = Math.floor(pct * duration);
  if (audio.src) audio.currentTime = progress;
  updateProgress();
}

function formatTime(s) {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

/* ══════════════════════════════════════════════════
   PREV / NEXT / LOOP
══════════════════════════════════════════════════ */
function prevTrack() {
  if (progress > 5) { progress = 0; updateProgress(); return; }
  loadTrack((currentTrack - 1 + playlist.length) % playlist.length);
}

function nextTrack() {
  loadTrack((currentTrack + 1) % playlist.length);
}

function toggleLoop() {
  isLooping = !isLooping;
  const btn = document.getElementById('loopBtn');
  btn.style.color      = isLooping ? 'var(--pink-deep)' : '';
  btn.style.background = isLooping ? 'var(--pink-pale)' : '';
  btn.style.borderColor= isLooping ? 'var(--pink-deep)' : '';
}

/* ══════════════════════════════════════════════════
   VOLUME
══════════════════════════════════════════════════ */
function setVolume(v) {
  document.getElementById('volDisplay').textContent = v;
  audio.volume = v / 100;
}

/* ══════════════════════════════════════════════════
   EQUALIZER BARS
══════════════════════════════════════════════════ */
function startEq() {
  if (eqRunning) return;
  eqRunning = true;
  const bars = document.querySelectorAll('.eq-bar');

  (function animate() {
    if (!isPlaying) { eqRunning = false; return; }
    bars.forEach(b => {
      b.style.height = (Math.random() * 22 + 4) + 'px';
    });
    setTimeout(animate, 110);
  })();
}

function stopEq() {
  eqRunning = false;
  document.querySelectorAll('.eq-bar').forEach(b => b.style.height = '4px');
}

/* ══════════════════════════════════════════════════
   PLAYLIST DOM
══════════════════════════════════════════════════ */
function buildPlaylist() {
  const list = document.getElementById('playlistList');
  list.innerHTML = '';

  playlist.forEach((t, i) => {
    const el = document.createElement('div');
    el.className = 'playlist-item' + (i === currentTrack ? ' active' : '');
    el.id        = `pitem-${i}`;
    el.innerHTML = `
      <span class="item-num">${String(i + 1).padStart(2, '0')}</span>
      ${t.fav ? '<span class="item-fav">♡</span>' : ''}
      <span class="item-text">
        ${t.title}
        <span class="item-artist-small">— ${t.artist}</span>
      </span>
    `;
    el.onclick = () => { loadTrack(i); if (!isPlaying) togglePlay(); };
    list.appendChild(el);
  });
}

function updatePlaylistActive() {
  playlist.forEach((_, i) => {
    const el = document.getElementById(`pitem-${i}`);
    if (el) el.className = 'playlist-item' + (i === currentTrack ? ' active' : '');
  });
}

/* ══════════════════════════════════════════════════
   FOOTER DOTS
══════════════════════════════════════════════════ */
let currentDot = 0;
let dotTimer   = null;

function startDotAnim() {
  dotTimer = setInterval(() => {
    document.getElementById(`dot${currentDot}`).classList.remove('active');
    currentDot = (currentDot + 1) % 5;
    document.getElementById(`dot${currentDot}`).classList.add('active');
  }, 600);
}

function updateDots() {
  for (let i = 0; i < 5; i++)
    document.getElementById(`dot${i}`).classList.remove('active');
  document.getElementById(`dot${currentTrack % 5}`).classList.add('active');
}
