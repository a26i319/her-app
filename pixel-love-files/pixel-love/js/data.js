/* ════════════════════════════════════════════════════
   data.js  —  Playlist & Dialogue Data
   ════════════════════════════════════════════════════

   HOW TO ADD REAL AUDIO:
   Add a `src` property to each track pointing to an
   .mp3 / .ogg URL or a local file path, e.g.:
     src: "music/lofi-dream.mp3"

   Then in player.js, load it with:
     audio.src = track.src;
     audio.play();
   ════════════════════════════════════════════════════ */

const playlist = [
  {
    title:  "Sakura",
    artist: "Eshan Kesari",
    fav:    true,
    color:  "#f06292",   // album art dominant color
    accent: "#ce93d8",   // album art accent ring
    src: "./pixel-love-files/pixel-love/music/Sakura.mp3"
  },
  {
    title:  "Min Ma Shi lo Ma Phit Bu Thi Lr",
    artist: "Moh Moh",
    fav:    false,
    color:  "#e91e8c",
    accent: "#f8bbd9",
    src: "./pixel-love-files/pixel-love/music/minmashilomaphit.mp3"
  },
  {
    title:  "Min Shi Tae Nay Yar",
    artist: "Wyne Su Khaing Thein",
    fav:    true,
    color:  "#d63384",
    accent: "#ff69b4",
    src: "./pixel-love-files/pixel-love/music/minshitae.mp3"
  },
  {
    title:  "Chit Nay P",
    artist: "Oak Soe Khant",
    fav:    false,
    color:  "#c2185b",
    accent: "#f48fb1",
    src: "./pixel-love-files/pixel-love/music/chitnayp.mp3"
  },
  {
    title:  "Moonlit Garden",
    artist: "Pixel Romance",
    fav:    false,
    color:  "#ad1457",
    accent: "#e8c7f0",
    // src: "music/moonlit-garden.mp3"
  },
  {
    title:  "Due Htout P",
    artist: "Y Wine",
    fav:    true,
    color:  "#e91e8c",
    accent: "#fce4ec",
    src: "./pixel-love-files/pixel-love/music/duehtoutp.mp3"
  },
];

/* Romantic typewriter messages shown in the dialogue box */
const messages = [
  "I'm also sorry for yesterday... but I hope we can make more happy memories together! ♡",
  "Will you be forgiven? I promise to be the best pixel pet I can be! 🌸",
  "You make ordinary moments feel magical. ♡",
  "Every song reminds me of you, somehow...",
  "This playlist was made just for you ♡",
  "You are my favorite song on repeat 🌸",
  "Thank you for existing in my world ♡",
  "Like a save point — you're my safe place.",
  "Press ♡ to save this feeling forever.",
  "You're the melody I never want to end.",
  "Even pixels feel softer around you 🌸",
  "You're my favorite chapter, always. ♡",
];

/* Pixel pet speech bubbles */
const petSayings = [
  "(＾▽＾) ♡ u!",
  "uwu music~",
  "(｡♡‿♡｡)",
  "♡ so cozy~",
  "( •ᴗ•) ♡",
  "nyan~ ♡",
  "🌸 cute!",
];
