// =========================================
// Blockzone.io – Main Script
// =========================================

// ---- Game Mode Data ----
const GAME_MODES = [
  {
    id: "survival",
    name: "Survival",
    icon: "⛏️",
    desc: "Mine, build, and survive against mobs.",
    players: 1284,
    accent: "#4caf50",
    tag: "popular",
  },
  {
    id: "creative",
    name: "Creative",
    icon: "🎨",
    desc: "Build anything with unlimited blocks.",
    players: 892,
    accent: "#2196f3",
    tag: "popular",
  },
  {
    id: "bedwars",
    name: "BedWars",
    icon: "🛏️",
    desc: "Defend your bed, destroy others.",
    players: 763,
    accent: "#e94560",
    tag: "popular",
  },
  {
    id: "skywars",
    name: "SkyWars",
    icon: "☁️",
    desc: "Fight on floating islands to be the last one standing.",
    players: 541,
    accent: "#00bcd4",
    tag: null,
  },
  {
    id: "oneblock",
    name: "One Block",
    icon: "🧱",
    desc: "Start with a single block. What can you build?",
    players: 428,
    accent: "#ff9800",
    tag: null,
  },
  {
    id: "tntrun",
    name: "TNT Run",
    icon: "💣",
    desc: "Run before the floor explodes under you!",
    players: 312,
    accent: "#f44336",
    tag: null,
  },
  {
    id: "doodlecube",
    name: "Doodle Cube",
    icon: "🖌️",
    desc: "Draw in 3D blocks and let others guess.",
    players: 267,
    accent: "#9c27b0",
    tag: "new",
  },
  {
    id: "skyrace",
    name: "Sky Race",
    icon: "🏁",
    desc: "Race across sky bridges to the finish line.",
    players: 198,
    accent: "#ff5722",
    tag: "new",
  },
  {
    id: "parkour",
    name: "Parkour",
    icon: "🏃",
    desc: "Jump your way through challenging courses.",
    players: 350,
    accent: "#8bc34a",
    tag: "new",
  },
  {
    id: "deathrun",
    name: "Death Run",
    icon: "💀",
    desc: "Survive traps set by the Death player.",
    players: 145,
    accent: "#607d8b",
    tag: null,
  },
  {
    id: "capture",
    name: "Capture the Flag",
    icon: "🚩",
    desc: "Team up and steal the enemy's flag.",
    players: 231,
    accent: "#03a9f4",
    tag: null,
  },
  {
    id: "zombies",
    name: "Zombies",
    icon: "🧟",
    desc: "Survive endless waves of block zombies.",
    players: 182,
    accent: "#795548",
    tag: null,
  },
];

// ---- Random Usernames ----
const ADJ = ["Blocky","Pixel","Cubic","Neon","Swift","Shadow","Iron","Golden","Sky","Lava","Frost","Cyber","Turbo","Mighty","Silent"];
const NOUNS = ["Builder","Warrior","Miner","Dragon","Wolf","Panda","Knight","Gamer","Ninja","Creeper","Hero","Legend","Storm","Phantom","Blaze"];

function randomUsername() {
  const adj  = ADJ[Math.floor(Math.random() * ADJ.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num  = Math.floor(Math.random() * 9000) + 1000;
  return `${adj}${noun}${num}`;
}

// ---- Animate Player Count ----
function animatePlayerCount() {
  const el = document.getElementById("playerCount");
  if (!el) return;
  let base = 4500 + Math.floor(Math.random() * 1000);
  setInterval(() => {
    base += Math.floor(Math.random() * 21) - 10;
    if (base < 3000) base = 3000;
    if (base > 9999) base = 9999;
    el.textContent = `🟢 ${base.toLocaleString()}`;
  }, 3000);
}

// ---- Build Game Cards ----
function buildGameGrid() {
  const grid = document.getElementById("gamesGrid");
  if (!grid) return;
  GAME_MODES.forEach((game) => {
    const card = document.createElement("div");
    card.className = "game-card";
    card.style.setProperty("--card-accent", game.accent);
    card.setAttribute("data-id", game.id);

    let tagHTML = "";
    if (game.tag === "popular") tagHTML = `<span class="tag-popular">🔥 Hot</span>`;
    if (game.tag === "new")     tagHTML = `<span class="tag-new">✨ New</span>`;

    card.innerHTML = `
      ${tagHTML}
      <div class="game-icon">${game.icon}</div>
      <div class="game-name">${game.name}</div>
      <div class="game-desc">${game.desc}</div>
      <div class="game-players">🟢 ${game.players.toLocaleString()} playing</div>
    `;

    card.addEventListener("click", () => openGameModal(game));
    grid.appendChild(card);
  });
}

// ---- Open Game Modal ----
function openGameModal(game) {
  document.getElementById("modalGameIcon").textContent   = game.icon;
  document.getElementById("modalGameTitle").textContent  = game.name;
  document.getElementById("modalGameDesc").textContent   = game.desc;
  document.getElementById("modalGamePlayers").textContent = `🟢 ${game.players.toLocaleString()} players online`;
  openModal("gameModeModal");
}

// ---- Modal Helpers ----
function openModal(id) {
  document.getElementById(id).classList.add("open");
}

function closeModal(id) {
  document.getElementById(id).classList.remove("open");
}

// Close modal on overlay click
document.querySelectorAll(".modal-overlay").forEach((overlay) => {
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      overlay.classList.remove("open");
    }
  });
});

// ---- Settings ----
function toggleSetting(btn) {
  const isOn = btn.classList.toggle("active");
  btn.textContent = isOn ? "ON" : "OFF";
}

function changeTheme(value) {
  document.documentElement.setAttribute("data-theme", value === "dark" ? "" : value);
  localStorage.setItem("bz-theme", value);
}

function loadTheme() {
  const saved = localStorage.getItem("bz-theme") || "dark";
  const sel = document.getElementById("themeSelect");
  if (sel) sel.value = saved;
  changeTheme(saved);
}

// ---- Play Button ----
document.getElementById("playBtn").addEventListener("click", () => {
  const username = document.getElementById("usernameInput").value.trim();
  if (!username) {
    const generated = randomUsername();
    document.getElementById("usernameInput").value = generated;
    alert(`No username entered – playing as: ${generated}\n\n(Game launching not yet implemented – this is a UI preview)`);
  } else {
    alert(`Welcome, ${username}!\n\n(Game launching not yet implemented – this is a UI preview)`);
  }
});

// ---- Dice Button ----
document.getElementById("diceBtn").addEventListener("click", () => {
  document.getElementById("usernameInput").value = randomUsername();
});

// ---- Nav Buttons ----
document.getElementById("settingsBtn").addEventListener("click", (e) => {
  e.preventDefault();
  openModal("settingsModal");
});
document.getElementById("updateLogBtn").addEventListener("click", (e) => {
  e.preventDefault();
  openModal("updateLogModal");
});
document.getElementById("friendsBtn").addEventListener("click", (e) => {
  e.preventDefault();
  openModal("friendsModal");
});

// ---- Easter Egg: click logo 5x ----
let logoClicks = 0;
document.getElementById("logo").addEventListener("click", () => {
  logoClicks++;
  if (logoClicks >= 5) {
    logoClicks = 0;
    alert("🎉 Secret found! You clicked the logo 5 times!\n\nType 'blockzone' in the username box for a surprise...");
  }
});

document.getElementById("usernameInput").addEventListener("input", (e) => {
  if (e.target.value.toLowerCase() === "blockzone") {
    document.documentElement.setAttribute("data-theme", "neon");
    document.getElementById("themeSelect").value = "neon";
    localStorage.setItem("bz-theme", "neon");
    e.target.value = "";
    alert("🌈 NEON MODE UNLOCKED!");
  }
});

// ---- Init ----
buildGameGrid();
animatePlayerCount();
loadTheme();
