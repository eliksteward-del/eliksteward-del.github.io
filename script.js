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

const DEFAULT_GAME_MODE_ID = "survival";
const STORAGE_KEYS = {
  theme: "bz-theme",
  lastSession: "bz-last-session",
  userSession: "bz-user-session",
  pendingOAuth: "bz-pending-oauth",
};

const OAUTH_CONFIG = {
  github: {
    label: "GitHub",
    clientId: "",
    authorizeUrl: "https://github.com/login/oauth/authorize",
    scope: "read:user user:email",
    extraParams: {
      allow_signup: "true",
    },
  },
  figma: {
    label: "Figma",
    clientId: "",
    authorizeUrl: "https://www.figma.com/oauth",
    scope: "file_read",
    extraParams: {
      response_type: "code",
    },
  },
};

const SOCIAL_PLACEHOLDERS = {
  google: "Google login is not wired up yet.",
  discord: "Discord login is not wired up yet.",
  microsoft: "Microsoft login is not wired up yet.",
  apple: "Apple login is not wired up yet.",
};

const appState = {
  selectedGame: null,
  activeInviteLink: "",
};

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

function getGameById(id) {
  return GAME_MODES.find((game) => game.id === id) || GAME_MODES.find((game) => game.id === DEFAULT_GAME_MODE_ID) || GAME_MODES[0];
}

function getSelectedGame() {
  return appState.selectedGame || getGameById(DEFAULT_GAME_MODE_ID);
}

function getOAuthRedirectUri() {
  return `${window.location.origin}${window.location.pathname}`;
}

function generateLobbyCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

function createStateToken(provider) {
  const randomPart = window.crypto?.randomUUID ? window.crypto.randomUUID() : Math.random().toString(36).slice(2);
  return `${provider}:${randomPart}`;
}

function getStoredJson(key) {
  const rawValue = localStorage.getItem(key);
  if (!rawValue) return null;

  try {
    return JSON.parse(rawValue);
  } catch (error) {
    localStorage.removeItem(key);
    return null;
  }
}

function buildInviteLink(session) {
  const inviteUrl = new URL(window.location.href);
  inviteUrl.searchParams.set("lobby", session.code);
  inviteUrl.searchParams.set("game", session.gameId);
  return inviteUrl.toString();
}

function setLoginStatus(message, tone = "") {
  const statusEl = document.getElementById("loginStatus");
  if (!statusEl) return;
  statusEl.textContent = message;
  statusEl.className = "login-status";
  if (tone) statusEl.classList.add(tone);
}

function renderSessionStatus(session) {
  const panel = document.getElementById("sessionStatus");
  const title = document.getElementById("sessionStatusTitle");
  const text = document.getElementById("sessionStatusText");
  const copyBtn = document.getElementById("copyInviteBtn");

  if (!panel || !title || !text || !copyBtn) return;

  if (!session) {
    panel.hidden = true;
    copyBtn.hidden = true;
    appState.activeInviteLink = "";
    return;
  }

  panel.hidden = false;
  title.textContent = session.type === "create-lobby" ? `Lobby ${session.code} created` : `${session.gameName} quick play ready`;
  text.textContent = session.type === "create-lobby"
    ? `${session.username} can share lobby ${session.code} to invite friends to ${session.gameName}.`
    : `${session.username} joined ${session.gameName} quick play. Match code: ${session.code}.`;

  appState.activeInviteLink = session.type === "create-lobby" ? buildInviteLink(session) : "";
  copyBtn.hidden = !appState.activeInviteLink;
}

function saveSession(session) {
  localStorage.setItem(STORAGE_KEYS.lastSession, JSON.stringify(session));
  renderSessionStatus(session);
}

function ensureUsername() {
  const input = document.getElementById("usernameInput");
  if (!input) return randomUsername();

  const current = input.value.trim();
  if (current) return current;

  const generated = randomUsername();
  input.value = generated;
  setLoginStatus(`Using random username ${generated}.`, "info");
  return generated;
}

function launchSession(type, game = getSelectedGame()) {
  const username = ensureUsername();
  const session = {
    type,
    username,
    gameId: game.id,
    gameName: game.name,
    code: generateLobbyCode(),
    createdAt: new Date().toISOString(),
  };

  saveSession(session);
  closeModal("gameModeModal");
  setLoginStatus(
    type === "create-lobby"
      ? `Lobby ${session.code} is ready for ${game.name}.`
      : `Quick play connected for ${game.name} as ${username}.`,
    "success"
  );
}

function beginOAuthLogin(provider) {
  const config = OAUTH_CONFIG[provider];
  if (!config) return;

  if (!config.clientId) {
    setLoginStatus(`${config.label} login is ready, but I still need the ${config.label} client ID.`, "warning");
    return;
  }

  const state = createStateToken(provider);
  localStorage.setItem(STORAGE_KEYS.pendingOAuth, JSON.stringify({ provider, state }));

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: getOAuthRedirectUri(),
    scope: config.scope,
    state,
  });

  Object.entries(config.extraParams || {}).forEach(([key, value]) => {
    params.set(key, value);
  });

  window.location.assign(`${config.authorizeUrl}?${params.toString()}`);
}

function completeOAuthLogin(provider) {
  const config = OAUTH_CONFIG[provider];
  const username = `${config.label}Player`;
  const userSession = {
    provider,
    username,
    connectedAt: new Date().toISOString(),
  };

  localStorage.setItem(STORAGE_KEYS.userSession, JSON.stringify(userSession));
  document.getElementById("usernameInput").value = username;
  setLoginStatus(`Signed in with ${config.label}.`, "success");
}

function clearOAuthParams() {
  const nextUrl = new URL(window.location.href);
  nextUrl.searchParams.delete("code");
  nextUrl.searchParams.delete("state");
  nextUrl.searchParams.delete("error");
  nextUrl.searchParams.delete("error_description");
  window.history.replaceState({}, document.title, nextUrl.toString());
}

function handleOAuthCallback() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  const state = params.get("state");
  const error = params.get("error");
  const pending = getStoredJson(STORAGE_KEYS.pendingOAuth);

  if (error) {
    setLoginStatus("OAuth sign-in was cancelled or failed.", "warning");
    localStorage.removeItem(STORAGE_KEYS.pendingOAuth);
    clearOAuthParams();
    return;
  }

  if (!code || !state || !pending) return;

  if (pending.state !== state || !OAUTH_CONFIG[pending.provider]) {
    setLoginStatus("OAuth sign-in could not be verified.", "error");
    localStorage.removeItem(STORAGE_KEYS.pendingOAuth);
    clearOAuthParams();
    return;
  }

  localStorage.removeItem(STORAGE_KEYS.pendingOAuth);
  completeOAuthLogin(pending.provider);
  clearOAuthParams();
}

function loadStoredUserSession() {
  const userSession = getStoredJson(STORAGE_KEYS.userSession);
  if (!userSession) return;

  document.getElementById("usernameInput").value = userSession.username;
  const providerLabel = OAUTH_CONFIG[userSession.provider]?.label || userSession.provider;
  setLoginStatus(`Signed in with ${providerLabel}.`, "success");
}

function loadSavedSession() {
  const session = getStoredJson(STORAGE_KEYS.lastSession);
  if (!session) return;
  renderSessionStatus(session);
}

async function copyInviteLink() {
  if (!appState.activeInviteLink) return;

  try {
    await navigator.clipboard.writeText(appState.activeInviteLink);
    setLoginStatus("Invite link copied.", "success");
  } catch (error) {
    window.prompt("Copy this invite link:", appState.activeInviteLink);
  }
}

function wireSocialButtons() {
  Object.entries(SOCIAL_PLACEHOLDERS).forEach(([provider, message]) => {
    const button = document.getElementById(`${provider}LoginBtn`);
    if (!button) return;
    button.addEventListener("click", () => setLoginStatus(message, "warning"));
  });

  document.getElementById("githubLoginBtn").addEventListener("click", () => beginOAuthLogin("github"));
  document.getElementById("figmaLoginBtn").addEventListener("click", () => beginOAuthLogin("figma"));
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
  appState.selectedGame = game;
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
  localStorage.setItem(STORAGE_KEYS.theme, value);
}

function loadTheme() {
  const saved = localStorage.getItem(STORAGE_KEYS.theme) || "dark";
  const sel = document.getElementById("themeSelect");
  if (sel) sel.value = saved;
  changeTheme(saved);
}

// ---- Play Button ----
document.getElementById("playBtn").addEventListener("click", () => {
  launchSession("quick-play", getSelectedGame());
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

document.getElementById("modalQuickPlayBtn").addEventListener("click", () => {
  launchSession("quick-play", getSelectedGame());
});

document.getElementById("modalCreateLobbyBtn").addEventListener("click", () => {
  launchSession("create-lobby", getSelectedGame());
});

document.getElementById("copyInviteBtn").addEventListener("click", () => {
  copyInviteLink();
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
    localStorage.setItem(STORAGE_KEYS.theme, "neon");
    e.target.value = "";
    alert("🌈 NEON MODE UNLOCKED!");
  }
});

// ---- Init ----
buildGameGrid();
animatePlayerCount();
loadTheme();
wireSocialButtons();
handleOAuthCallback();
loadStoredUserSession();
loadSavedSession();
