import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js";

const video = document.querySelector("#webcam");
const previewVideo = document.querySelector("#webcamPreview");
const threeCanvas = document.querySelector("#threeScene");
const canvas = document.querySelector("#overlay");
const scoreEl = document.querySelector("#score");
const statusText = document.querySelector("#statusText");
const startButton = document.querySelector("#startButton");
const moveState = document.querySelector("#moveState");
const characterGrid = document.querySelector("#characterGrid");
const previewMascot = document.querySelector("#previewMascot");
const enemyNameEl = document.querySelector("#enemyName");
const energyText = document.querySelector("#energyText");
const energyBar = document.querySelector("#energyBar");
const questionText = document.querySelector("#questionText");
const answerGrid = document.querySelector("#answerGrid");
const skillHint = document.querySelector("#skillHint");
const markerStatus = document.querySelector("#markerStatus");
const markerReadout = document.querySelector("#markerReadout");
const goIntroButton = document.querySelector("#goIntroButton");
const goSelectButton = document.querySelector("#goSelectButton");
const confirmCharacterButton = document.querySelector("#confirmCharacterButton");
const openQuestionButton = document.querySelector("#openQuestionButton");
const backToGameButton = document.querySelector("#backToGameButton");
const roundText = document.querySelector("#roundText");
const enemyHud = document.querySelector("#enemyHud");
const enemyHudName = document.querySelector("#enemyHudName");
const enemyPortrait = document.querySelector("#enemyPortrait");
const enemyHpBar = document.querySelector("#enemyHpBar");
const heroHealth = document.querySelector("#heroHealth");
const heroHpBar = document.querySelector("#heroHpBar");
const heroHpText = document.querySelector("#heroHpText");
const gameToast = document.querySelector("#gameToast");
const victoryKicker = document.querySelector("#victoryScreen .screen-kicker");
const victoryTitle = document.querySelector("#victoryScreen h1");
const victoryText = document.querySelector("#victoryText");
const restartButton = document.querySelector("#restartButton");
const comboText = document.querySelector("#comboText");
const timerText = document.querySelector("#timerText");
const phaseText = document.querySelector("#phaseText");
const bossWarning = document.querySelector("#bossWarning");
const bossWarningName = document.querySelector("#bossWarningName");
const screenFlash = document.querySelector("#screenFlash");
const ctx = canvas.getContext("2d");

const FALLBACK_CHARACTERS = [
  {
    id: "gratitude",
    name: "\u611f\u6069\u4fe0",
    virtue: "\u611f\u6069",
    color: "#ff8fa3",
    image: "./assets/gratitude.png",
  },
  {
    id: "goal",
    name: "\u76ee\u6a19\u4fe0",
    virtue: "\u76ee\u6a19",
    color: "#ff4b35",
    image: "./assets/goal.png",
  },
  {
    id: "communication",
    name: "\u4ea4\u6d41\u4fe0",
    virtue: "\u4ea4\u6d41",
    color: "#f6b85b",
    image: "./assets/communication.png",
  },
  {
    id: "challenge",
    name: "\u6311\u6230\u4fe0",
    virtue: "\u6311\u6230",
    color: "#1f77d0",
    image: "./assets/challenge.png",
  },
  {
    id: "explore",
    name: "\u63a2\u7d22\u4fe0",
    virtue: "\u63a2\u7d22",
    color: "#12a5d8",
    image: "./assets/explore.png",
  },
];
const CHARACTERS = window.POSITIVE_HEROES || FALLBACK_CHARACTERS;

const ENEMIES = [
  {
    id: "comfort",
    name: "\u5b89\u8212\u602a",
    image: "./assets/comfort-monster.png",
    x: -2.8,
  },
  {
    id: "lonely",
    name: "\u5b64\u884c\u7378",
    image: "./assets/lonely-beast.png",
    x: -1.4,
  },
  {
    id: "reject",
    name: "\u62d2\u7d55\u9f8d",
    image: "./assets/reject-dragon.png",
    x: 0,
  },
  {
    id: "lost",
    name: "\u8ff7\u5931\u72d0",
    image: "./assets/lost-fox.png",
    x: 1.4,
  },
  {
    id: "entitled",
    name: "\u7406\u6240\u7576\u733f",
    image: "./assets/entitled-ape.png",
    x: 2.8,
  },
];

const QUESTIONS = [
  {
    text: "\u670b\u53cb\u4e0d\u9858\u610f\u8ddf\u4f60\u5408\u4f5c\u6642\uff0c\u600e\u6a23\u505a\u6700\u6b63\u5411\uff1f",
    answers: [
      "\u5148\u807d\u4ed6\u7684\u60f3\u6cd5\uff0c\u518d\u4e00\u8d77\u627e\u65b9\u6cd5",
      "\u7acb\u5373\u653e\u68c4\u5408\u4f5c",
      "\u53ea\u8cac\u602a\u5c0d\u65b9",
      "\u6545\u610f\u4e0d\u7406\u6703\u4ed6",
    ],
    correct: 0,
  },
  {
    text: "\u5982\u679c\u4eca\u5929\u5931\u6557\u4e86\uff0c\u4e0b\u4e00\u6b65\u53ef\u4ee5\u600e\u6a23\uff1f",
    answers: [
      "\u627e\u51fa\u53ef\u4ee5\u6539\u9032\u7684\u4e00\u9ede",
      "\u8a8d\u5b9a\u81ea\u5df1\u6c38\u9060\u505a\u4e0d\u5230",
      "\u628a\u60c5\u7dd2\u767c\u6d29\u5728\u5225\u4eba\u8eab\u4e0a",
      "\u4e0d\u518d\u5617\u8a66\u4efb\u4f55\u65b0\u4e8b\u60c5",
    ],
    correct: 0,
  },
  {
    text: "\u770b\u898b\u540c\u5b78\u5e6b\u5fd9\u6642\uff0c\u54ea\u4e00\u53e5\u6700\u80fd\u8868\u9054\u611f\u6069\uff1f",
    answers: [
      "\u8b1d\u8b1d\u4f60\uff0c\u4f60\u7684\u5e6b\u5fd9\u5c0d\u6211\u5f88\u91cd\u8981",
      "\u9019\u662f\u4f60\u61c9\u8a72\u505a\u7684",
      "\u6211\u4e0d\u9700\u8981\u8aaa\u8b1d\u8b1d",
      "\u4e0b\u6b21\u624d\u518d\u7b97",
    ],
    correct: 0,
  },
  {
    text: "\u8a02\u7acb\u76ee\u6a19\u6642\uff0c\u54ea\u4e00\u500b\u505a\u6cd5\u6bd4\u8f03\u597d\uff1f",
    answers: [
      "\u5b9a\u4e00\u500b\u5177\u9ad4\u3001\u53ef\u884c\u7684\u5c0f\u6b65\u9a5f",
      "\u53ea\u8aaa\u300c\u6211\u8981\u8b8a\u5f97\u5f88\u5f37\u300d",
      "\u4e0d\u7528\u8a08\u5283\uff0c\u7b49\u5fc3\u60c5\u597d\u518d\u505a",
      "\u76ee\u6a19\u8d8a\u6a21\u7cca\u8d8a\u597d",
    ],
    correct: 0,
  },
  {
    text: "\u9047\u5230\u65b0\u6311\u6230\u6642\uff0c\u54ea\u500b\u60f3\u6cd5\u6700\u6709\u52a9\u6210\u9577\uff1f",
    answers: [
      "\u6211\u53ef\u4ee5\u5148\u5617\u8a66\uff0c\u518d\u5f9e\u7d93\u9a57\u4e2d\u5b78\u7fd2",
      "\u6211\u4e00\u5b9a\u505a\u4e0d\u5230",
      "\u53ea\u505a\u5df2\u7d93\u6703\u7684\u4e8b",
      "\u9047\u5230\u56f0\u96e3\u5c31\u602a\u5225\u4eba",
    ],
    correct: 0,
  },
];

const ENERGY_REQUIRED = 3;
const HERO_MAX_HP = 3;
const STAR_SPAWN_INTERVAL = 5000;
const MARKER_GRID_SIZE = 4;
const MARKER_SCAN_SIZE = 112;
const MARKER_PATTERNS = [
  { letter: "A", bits: "1000011001010001" },
  { letter: "B", bits: "1100101000110101" },
  { letter: "C", bits: "1010001111000111" },
  { letter: "D", bits: "1110010110000011" },
];

const POSE_CONNECTIONS = [
  [11, 12],
  [11, 13],
  [13, 15],
  [12, 14],
  [14, 16],
  [11, 23],
  [12, 24],
  [23, 24],
  [23, 25],
  [25, 27],
  [24, 26],
  [26, 28],
];

const WORLD = {
  width: 9.0,
  height: 4.6,
  floorY: -1.35,
};
const PLAYER_Z = 2.05;
const ENEMY_Z = -4.65;
const PROJECTILE_END_Z = 4.05;
const PLAYER_X_LIMIT = 3.85;
const POSE_CONTROL_RANGE = 0.28;
const STAR_LANE_X_LIMIT = 3.15;
const STAR_LANE_Z_SPREAD = 0.1;

let landmarker;
let drawingUtils;
let visionTasks;
let running = false;
let lastVideoTime = -1;
let score = 0;
let lastJumpAt = 0;
let targetPoint = { x: 0.72, y: 0.48 };
let smoothed = { x: 0.5, y: 0.58, tilt: 0, jump: 0 };
let scene;
let camera3D;
let renderer;
let avatar3D;
let target3D;
let bodyParts;
let arena;
let targetPulse = 0;
let targetActive = true;
let clock;
let avatarPose = { x: 0, y: WORLD.floorY + 0.9, z: PLAYER_Z };
let selectedCharacter = null;
let textureLoader;
let mascotMesh;
let mascotGlow;
let legacyRoot;
let legacyAvatarParts = [];
let saberGroup;
let saberBlade;
let saberGlow;
let enemyGroup;
let enemyMeshes = [];
let skillBeams = [];
let enemyProjectiles = [];
let starPickup;
let starActive = false;
let lastStarSpawnAt = 0;
let currentEnemyIndex = 0;
let energy = 0;
let heroHp = HERO_MAX_HP;
let currentQuestionIndex = 0;
let skillReady = false;
let missionFailed = false;
let lastSkillAt = 0;
let lastEnemyShotAt = 0;
let keyboardDodgeX = 0;
let keyboardInput = { left: false, right: false };
let poseCenterX = null;
let markerCanvas;
let markerCtx;
let markerCandidate = null;
let markerStableCount = 0;
let lastMarkerAnswerAt = 0;
let poseFrameSkip = 0;
let dodgeState = "idle";
let dodgeTimeout = null;
let dodgeRetryTimeout = null;
let dodgeAttemptId = 0;
let lastRightWristX = null;
let lastSlashAt = 0;
let audioContext = null;
let masterGain = null;
let ambientOscillators = [];
let bgmTimer = null;
let bgmStep = 0;
let bgmMode = "mission";
let audioUnlockBound = false;
let toastTimer = null;
let enemyHp = 100;
let combo = 0;
let roundDeadline = 0;
let bossWarningTimer = null;
let battleIntroTimers = [];

function setStatus(message) {
  statusText.textContent = message;
}

function showToast(message, kind = "") {
  if (!gameToast) return;

  gameToast.textContent = message;
  gameToast.classList.remove("is-danger", "is-success");
  if (kind) {
    gameToast.classList.add(`is-${kind}`);
  }
  gameToast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    gameToast.classList.remove("is-visible");
  }, 1500);
}

function flashScreen(kind = "hit") {
  if (!screenFlash) return;

  screenFlash.classList.remove("is-hit", "is-good", "is-super");
  screenFlash.classList.add(`is-${kind}`);
  window.setTimeout(() => {
    screenFlash.classList.remove(`is-${kind}`);
  }, 260);
}

function showBossWarning(enemy) {
  if (!bossWarning || !enemy) return;

  bossWarningName.textContent = enemy.name;
  bossWarning.classList.add("is-visible");
  window.clearTimeout(bossWarningTimer);
  bossWarningTimer = window.setTimeout(() => {
    bossWarning.classList.remove("is-visible");
  }, 1700);
}

function resetRoundTimer() {
  roundDeadline = performance.now() + 45000;
  if (timerText) {
    timerText.textContent = "45";
  }
}

function updatePhase(label) {
  if (phaseText) {
    phaseText.textContent = label;
  }
}

function setView(view) {
  document.body.classList.remove("view-start", "view-intro", "view-select", "view-game", "view-question", "view-victory");
  document.body.classList.add(`view-${view}`);
  window.requestAnimationFrame(resizeCanvases);

  if (view === "game") {
    playAlarm();
    updatePhase(skillReady ? "STRIKE" : "BATTLE");
    setStatus(
      skillReady
        ? "\u5145\u80fd 100%\uff01\u63e1\u7dca\u5b57\u6bcd\u5361\uff0c\u5c0d\u8457 Webcam \u63ee\u51fa\u5149\u528d\u65ac\u64ca\u3002"
        : "\u602a\u7378\u9396\u5b9a\uff01\u6b63\u5411\u4fe0\uff0c\u8acb\u5de6\u53f3\u79fb\u52d5\u907f\u958b\u653b\u64ca\u3002",
    );
    showToast(skillReady ? "\u5145\u80fd 100%：\u63ee\u528d\u65ac\u64ca" : "\u602a\u7378\u9396\u5b9a", skillReady ? "success" : "");
  }

  if (view === "question") {
    updatePhase("SCAN");
    setStatus("\u8acb\u8209\u8d77\u6b63\u78ba\u7684 A/B/C/D \u5b57\u6bcd\u5361\uff0c\u6216\u6309\u756b\u9762\u7b54\u6848\u6383\u63cf\u3002");
    showToast("\u6383\u63cf\u5b57\u6bcd\u5361\u5145\u80fd", "");
  }

  if (view === "victory") {
    updatePhase("CLEAR");
    playVictory();
    showToast("\u4efb\u52d9\u5b8c\u6210", "success");
  }
}

function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioContext.createGain();
    masterGain.gain.value = 0.95;
    masterGain.connect(audioContext.destination);
  }

  return audioContext;
}

function playTone(frequency, duration = 0.18, type = "sine", volume = 0.08) {
  try {
    const context = getAudioContext();
    if (context.state !== "running") return;

    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gain.gain.value = volume;
    oscillator.connect(gain);
    gain.connect(masterGain || context.destination);
    oscillator.start();
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration);
    oscillator.stop(context.currentTime + duration);
  } catch (error) {
    // Audio is optional for kiosk environments with stricter browser policies.
  }
}

function playSequence(notes, type = "sine", volume = 0.08) {
  notes.forEach(([frequency, delay, duration]) => {
    window.setTimeout(() => playTone(frequency, duration, type, volume), delay);
  });
}

function playNoise(duration = 0.05, volume = 0.025) {
  try {
    const context = getAudioContext();
    if (context.state !== "running") return;

    const sampleRate = context.sampleRate;
    const buffer = context.createBuffer(1, Math.floor(sampleRate * duration), sampleRate);
    const data = buffer.getChannelData(0);

    for (let index = 0; index < data.length; index += 1) {
      data[index] = (Math.random() * 2 - 1) * (1 - index / data.length);
    }

    const noise = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();
    filter.type = "highpass";
    filter.frequency.value = 1800;
    gain.gain.value = volume;
    noise.buffer = buffer;
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain || context.destination);
    noise.start();
  } catch (error) {
    // Percussion noise is optional.
  }
}

function playAlarm() {
  playSequence(
    [
      [392, 0, 0.1],
      [262, 120, 0.12],
      [392, 260, 0.1],
    ],
    "square",
    0.045,
  );
}

function playCharge(level) {
  playSequence(
    [
      [420 + level * 150, 0, 0.12],
      [620 + level * 180, 110, 0.18],
      [880 + level * 190, 250, 0.24],
      [1180 + level * 130, 470, 0.28],
    ],
    "sawtooth",
    0.095,
  );
}

function playDangerStart() {
  playSequence(
    [
      [92, 0, 0.22],
      [138, 190, 0.16],
      [92, 370, 0.22],
      [740, 620, 0.08],
      [880, 720, 0.08],
      [988, 820, 0.12],
    ],
    "sawtooth",
    0.1,
  );
  window.setTimeout(() => playNoise(0.18, 0.06), 130);
  window.setTimeout(() => playNoise(0.22, 0.07), 520);
}

function playWrong() {
  playSequence(
    [
      [180, 0, 0.12],
      [116, 110, 0.18],
    ],
    "sawtooth",
    0.075,
  );
}

function playEnemyShot() {
  playTone(164, 0.16, "sawtooth", 0.075);
  window.setTimeout(() => playTone(246, 0.12, "square", 0.06), 70);
  window.setTimeout(() => playNoise(0.08, 0.042), 120);
}

function playAttackHit() {
  playSequence(
    [
      [130, 0, 0.16],
      [82, 130, 0.18],
      [58, 280, 0.22],
    ],
    "sawtooth",
    0.09,
  );
  window.setTimeout(() => playNoise(0.16, 0.08), 40);
}

function playSelectSound() {
  playSequence(
    [
      [520, 0, 0.08],
      [760, 80, 0.11],
    ],
    "triangle",
    0.05,
  );
}

function playSlashSound() {
  playSequence(
    [
      [280, 0, 0.09],
      [740, 45, 0.18],
      [980, 140, 0.16],
    ],
    "sawtooth",
    0.08,
  );
}

function playVictory() {
  playSequence(
    [
      [523, 0, 0.12],
      [659, 130, 0.12],
      [784, 260, 0.12],
      [1046, 420, 0.28],
    ],
    "triangle",
    0.075,
  );
}

function scheduleBackgroundMusic() {
  if (bgmTimer) return;

  const missionPulse = [220, 220, 233, 220, 196, 196, 208, 196, 175, 175, 196, 208, 233, 220, 196, 165];
  const missionBass = [55, 55, 65, 58, 55, 55, 73, 65];
  const dangerPulse = [165, 175, 165, 196, 165, 208, 196, 175, 155, 165, 175, 196, 208, 233, 220, 196];
  const dangerBass = [49, 49, 55, 49, 58, 55, 49, 46];
  const sting = [880, 932, 784, 740, 988, 1046];

  const tick = () => {
    const context = getAudioContext();
    if (context.state !== "running") {
      bgmTimer = null;
      return;
    }

    const isDanger = bgmMode === "danger";
    const pulse = isDanger ? dangerPulse : missionPulse;
    const bass = isDanger ? dangerBass : missionBass;
    const step = bgmStep % pulse.length;
    const isDownbeat = step % 4 === 0;
    const tempo = isDanger ? 230 : 310;

    playTone(pulse[step], isDownbeat ? 0.2 : 0.1, "sawtooth", isDownbeat ? 0.09 : 0.058);

    if (step % 2 === 0) {
      playTone(bass[Math.floor(step / 2) % bass.length], isDanger ? 0.24 : 0.2, "square", isDanger ? 0.08 : 0.06);
      playNoise(isDanger ? 0.06 : 0.045, isDanger ? 0.046 : 0.032);
    }

    if (step % (isDanger ? 4 : 8) === (isDanger ? 3 : 6)) {
      playTone(sting[Math.floor(bgmStep / 4) % sting.length], 0.08, "triangle", isDanger ? 0.052 : 0.038);
    }

    bgmStep += 1;
    bgmTimer = window.setTimeout(tick, tempo);
  };

  tick();
}

function setMusicMode(mode) {
  bgmMode = mode;
  bgmStep = 0;
}

async function unlockAudioContext() {
  try {
    const context = getAudioContext();
    if (context.state === "suspended") {
      await context.resume();
    }

    return context.state === "running";
  } catch (error) {
    return false;
  }
}

function bindAudioUnlock() {
  if (audioUnlockBound) return;
  audioUnlockBound = true;

  const unlock = () => {
    startAmbientAudio();
  };

  ["pointerdown", "click", "keydown", "touchstart"].forEach((eventName) => {
    window.addEventListener(eventName, unlock, { passive: true });
  });
}

async function startAmbientAudio() {
  try {
    const isUnlocked = await unlockAudioContext();
    if (!isUnlocked) {
      bindAudioUnlock();
      return;
    }

    const context = getAudioContext();

    if (!ambientOscillators.length) {
      [55, 82, 110].forEach((frequency, index) => {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.type = index === 0 ? "sine" : index === 1 ? "triangle" : "sawtooth";
        oscillator.frequency.value = frequency;
        gain.gain.value = index === 0 ? 0.032 : index === 1 ? 0.018 : 0.012;
        oscillator.connect(gain);
        gain.connect(masterGain || context.destination);
        oscillator.start();
        ambientOscillators.push(oscillator);
      });
    }

    scheduleBackgroundMusic();
  } catch (error) {
    // Ambient audio is optional.
  }
}

async function loadVisionTasks() {
  if (visionTasks) return visionTasks;

  const candidates = [
    {
      moduleUrl: "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision",
      wasmUrl: "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm",
    },
    {
      moduleUrl: "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.21",
      wasmUrl: "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.21/wasm",
    },
    {
      moduleUrl: "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.20",
      wasmUrl: "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.20/wasm",
    },
    {
      moduleUrl: "https://unpkg.com/@mediapipe/tasks-vision",
      wasmUrl: "https://unpkg.com/@mediapipe/tasks-vision/wasm",
    },
  ];

  const errors = [];

  for (const candidate of candidates) {
    try {
      const module = await import(candidate.moduleUrl);
      const api = module.default || module;

      if (api.DrawingUtils && api.FilesetResolver && api.PoseLandmarker) {
        visionTasks = { ...api, wasmUrl: candidate.wasmUrl };
        return visionTasks;
      }
    } catch (error) {
      errors.push(`${candidate.moduleUrl}: ${error.message}`);
    }
  }

  throw new Error(`Could not load MediaPipe Tasks Vision. ${errors.join(" | ")}`);
}

function createMascotMaterial(texture) {
  return new THREE.ShaderMaterial({
    uniforms: {
      map: { value: texture },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D map;
      varying vec2 vUv;
      void main() {
        vec4 color = texture2D(map, vUv);
        float whiteBackground = step(0.9, color.r) * step(0.9, color.g) * step(0.9, color.b);
        float colorSpread = max(max(abs(color.r - color.g), abs(color.r - color.b)), abs(color.g - color.b));
        if (whiteBackground > 0.5 && colorSpread < 0.1) discard;
        color.rgb = pow(color.rgb, vec3(0.68)) * 1.48;
        color.rgb = mix(color.rgb, vec3(1.0), 0.12);
        gl_FragColor = color;
      }
    `,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
}

function updateMascotTexture(character) {
  if (!mascotMesh || !textureLoader || !character) return;

  textureLoader.load(character.image, (texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    if (mascotMesh.material) {
      mascotMesh.material.dispose();
    }

    mascotMesh.material = createMascotMaterial(texture);
    mascotMesh.visible = true;
  });
}

function updateGameHUD() {
  const enemy = ENEMIES[currentEnemyIndex];
  if (roundText) {
    roundText.textContent = `${Math.min(currentEnemyIndex + 1, ENEMIES.length)} / ${ENEMIES.length}`;
  }
  if (comboText) {
    comboText.textContent = `x${combo}`;
  }
  if (enemyHud) {
    enemyHud.hidden = !enemy;
  }
  if (enemyHudName) {
    enemyHudName.textContent = enemy ? enemy.name : "\u5df2\u5b8c\u6210";
  }
  if (enemyPortrait && enemy) {
    enemyPortrait.src = enemy.image;
  }
  if (enemyHpBar) {
    enemyHpBar.style.width = `${enemy ? enemyHp : 0}%`;
  }
  updateHeroHUD();
}

function updateHeroHUD() {
  if (!heroHpBar || !heroHpText) return;

  const hp = clamp(heroHp, 0, HERO_MAX_HP);
  heroHpBar.style.width = `${(hp / HERO_MAX_HP) * 100}%`;
  heroHpText.textContent = `${hp} / ${HERO_MAX_HP}`;
  heroHealth?.classList.toggle("is-danger", hp <= 1);
}

function failMission() {
  if (missionFailed) return;

  missionFailed = true;
  dodgeState = "failed";
  skillReady = false;
  clearDodgeTimeout();
  clearEnemyProjectiles();
  clearStarPickup();
  setMusicMode("danger");
  updatePhase("FAILED");
  updateHeroHUD();
  flashScreen("hit");
  playWrong();
  showToast("\u4efb\u52d9\u5931\u6557\uff01\u6b63\u5411\u4fe0\u88ab\u64ca\u4e2d 3 \u6b21", "danger");
  setStatus("\u6b63\u5411\u4fe0\u88ab\u64ca\u4e2d 3 \u6b21\uff0c\u4efb\u52d9\u5931\u6557\u3002\u8acb\u518d\u6311\u6230\u4e00\u6b21\uff01");
  if (victoryKicker) {
    victoryKicker.textContent = "MISSION FAILED";
  }
  if (victoryTitle) {
    victoryTitle.textContent = "\u4efb\u52d9\u5931\u6557";
  }
  if (victoryText) {
    victoryText.textContent = "\u6b63\u5411\u4fe0\u88ab\u64ca\u4e2d 3 \u6b21\uff0c\u4efb\u52d9\u5931\u6557\u3002\u4e0b\u6b21\u8a18\u5f97\u5de6\u53f3\u79fb\u52d5\u8eb2\u958b\u653b\u64ca\uff0c\u62fe\u5230\u661f\u661f\u624d\u7b54\u984c\u5145\u80fd\uff01";
  }
  document.body.classList.add("mission-failed");
  setView("victory");
}

function updateMissionUI() {
  const enemy = ENEMIES[currentEnemyIndex];
  const question = QUESTIONS[currentQuestionIndex % QUESTIONS.length];

  updateGameHUD();
  enemyNameEl.textContent = enemy ? enemy.name : "\u5df2\u5b8c\u6210";
  energyText.textContent = `${energy} / ${ENERGY_REQUIRED}`;
  questionText.textContent = enemy
    ? question.text
    : "\u6240\u6709\u602a\u7378\u5df2\u88ab\u64ca\u6557\uff01\u4f60\u5df2\u5b8c\u6210\u6b63\u5411\u6311\u6230\u3002";
  document.body.classList.toggle("skill-ready", skillReady);

  energyBar.querySelectorAll("span").forEach((cell, index) => {
    cell.classList.toggle("is-filled", index < energy);
  });
  updateSaber();

  answerGrid.innerHTML = "";
  updateMarkerStatus("\u8acb\u628a A/B/C/D Marker \u5361\u653e\u5165 Webcam \u4e2d\u592e\u6846\u3002", "");

  if (!enemy) {
    skillHint.textContent = "\u6311\u6230\u5b8c\u6210\uff01";
    if (victoryKicker) {
      victoryKicker.textContent = "VICTORY";
    }
    if (victoryTitle) {
      victoryTitle.textContent = "\u6b63\u5411\u80fd\u91cf\u5168\u90e8\u89e3\u653e";
    }
    if (victoryText) {
      victoryText.textContent = `\u4f60\u64ca\u3680\u4e86 ${ENEMIES.length} \u96bb\u602a\u7378\uff0c\u7e3d\u5206 ${score}\uff01`;
    }
    setView("victory");
    return;
  }

  if (skillReady) {
    questionText.textContent = "\u5145\u80fd 100%\uff01\u8acb\u56de\u5230\u5834\u666f\uff0c\u63e1\u7dca\u5b57\u6bcd\u5361\u5411\u602a\u7378\u63ee\u528d\u3002";
    skillHint.textContent = "\u5149\u528d\u5df2\u5b8c\u6210\u5145\u80fd\uff1a\u5728 Webcam \u524d\u5feb\u901f\u6a6b\u63ee\u53f3\u624b\uff0c\u6216\u96d9\u624b\u8209\u9ad8\u91cb\u653e\u7d42\u7d50\u6280\u80fd\u3002";
    return;
  }

  question.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = `${String.fromCharCode(65 + index)}. ${answer}`;
    button.addEventListener("click", () => answerQuestion(index));
    answerGrid.append(button);
  });

  skillHint.textContent = skillReady
    ? "\u5145\u80fd 100%\uff01\u56de\u5230\u5834\u666f\u63ee\u52d5\u5b57\u6bcd\u5361\uff0c\u91cb\u653e\u5149\u528d\u65ac\u64ca\u3002"
    : "\u628a A/B/C/D Marker \u5361\u653e\u5230 Webcam \u4e2d\u592e\u6846\uff0c\u7cfb\u7d71\u6383\u5230\u5f8c\u6703\u81ea\u52d5\u7b54\u984c\u5145\u80fd\u3002";
}

function answerQuestion(answerIndex) {
  if (!ENEMIES[currentEnemyIndex]) return;

  const question = QUESTIONS[currentQuestionIndex % QUESTIONS.length];
  const buttons = answerGrid.querySelectorAll("button");
  const isCorrect = answerIndex === question.correct;

  buttons.forEach((button, index) => {
    button.disabled = true;
    button.classList.toggle("is-correct", index === question.correct);
    button.classList.toggle("is-wrong", index === answerIndex && !isCorrect);
  });

  if (isCorrect) {
    energy = clamp(energy + 1, 0, ENERGY_REQUIRED);
    skillReady = energy >= ENERGY_REQUIRED;
    enemyHp = skillReady ? 18 : 100 - energy * 24;
    combo += 1;
    currentQuestionIndex += 1;
    playCharge(energy);
    updateGameHUD();
    updateSaber();
    createChargeBurst(energy);
    flashScreen(skillReady ? "super" : "good");
    showToast(skillReady ? "\u5145\u80fd 100%\uff01" : `\u5145\u80fd ${Math.round((energy / ENERGY_REQUIRED) * 100)}%`, "success");
    setStatus(
      skillReady
        ? "\u5145\u80fd 100%\uff01\u5149\u528d\u5df2\u89e3\u653e\uff0c\u56de\u5230\u5834\u666f\u6e96\u5099\u65ac\u64ca\u3002"
        : "\u6383\u63cf\u6210\u529f\uff01\u5149\u528d\u5145\u80fd\u4e0a\u5347\u3002",
    );
    document.body.classList.add("charge-cinematic");
    setView("game");
    updatePhase(skillReady ? "100%" : "CHARGE");
    window.setTimeout(() => {
      document.body.classList.remove("charge-cinematic");
      updateMissionUI();
      if (!skillReady && ENEMIES[currentEnemyIndex]) {
        startDodgeChallenge(850);
      }
    }, skillReady ? 2600 : 2300);
  } else {
    combo = 0;
    updateGameHUD();
    playWrong();
    flashScreen("hit");
    showToast("\u6f0f\u96fb\uff01\u8acb\u88dc\u7b54\u6b63\u78ba\u5b57\u6bcd", "danger");
    setStatus("\u5149\u528d\u6f0f\u96fb\uff01\u8acb\u88dc\u7b54\u6b63\u78ba\u5b57\u6bcd\u624d\u80fd\u7e7c\u7e8c\u5145\u80fd\u3002");
  }

  if (!isCorrect) {
    window.setTimeout(updateMissionUI, 1100);
  }
}

function updateMarkerStatus(message, kind = "") {
  if (markerStatus) {
    markerStatus.textContent = message;
    markerStatus.classList.toggle("is-detecting", kind === "detecting");
    markerStatus.classList.toggle("is-success", kind === "success");
    markerStatus.classList.toggle("is-danger", kind === "danger");
  }
  if (markerReadout) {
    markerReadout.textContent = kind === "success" ? message : "Marker";
    markerReadout.classList.toggle("is-success", kind === "success");
  }
}

function ensureMarkerCanvas() {
  if (!markerCanvas) {
    markerCanvas = document.createElement("canvas");
    markerCanvas.width = MARKER_SCAN_SIZE;
    markerCanvas.height = MARKER_SCAN_SIZE;
    markerCtx = markerCanvas.getContext("2d", { willReadFrequently: true });
  }
  return Boolean(markerCtx);
}

function averageMarkerCellDarkness(imageData, cellX, cellY) {
  const cellSize = MARKER_SCAN_SIZE / MARKER_GRID_SIZE;
  const margin = cellSize * 0.22;
  const startX = Math.floor(cellX * cellSize + margin);
  const endX = Math.floor((cellX + 1) * cellSize - margin);
  const startY = Math.floor(cellY * cellSize + margin);
  const endY = Math.floor((cellY + 1) * cellSize - margin);
  let total = 0;
  let samples = 0;

  for (let y = startY; y < endY; y += 1) {
    for (let x = startX; x < endX; x += 1) {
      const index = (y * MARKER_SCAN_SIZE + x) * 4;
      const r = imageData.data[index];
      const g = imageData.data[index + 1];
      const b = imageData.data[index + 2];
      total += 1 - (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
      samples += 1;
    }
  }

  return samples ? total / samples : 0;
}

function decodeMarkerBits() {
  if (!running || !ensureMarkerCanvas() || video.readyState < 2 || !video.videoWidth || !video.videoHeight) {
    return null;
  }

  const videoAspect = video.videoWidth / video.videoHeight;
  const containerAspect = 16 / 9;
  let sourceSize;
  if (videoAspect < containerAspect) {
    sourceSize = video.videoWidth * 0.42;
  } else {
    sourceSize = video.videoHeight * (16 / 9) * 0.42;
  }
  const sourceX = (video.videoWidth - sourceSize) / 2;
  const sourceY = (video.videoHeight - sourceSize) / 2;
  markerCtx.save();
  markerCtx.translate(MARKER_SCAN_SIZE, 0);
  markerCtx.scale(-1, 1);
  markerCtx.drawImage(video, sourceX, sourceY, sourceSize, sourceSize, 0, 0, MARKER_SCAN_SIZE, MARKER_SCAN_SIZE);
  markerCtx.restore();

  const imageData = markerCtx.getImageData(0, 0, MARKER_SCAN_SIZE, MARKER_SCAN_SIZE);
  const darkness = [];
  for (let y = 0; y < MARKER_GRID_SIZE; y += 1) {
    for (let x = 0; x < MARKER_GRID_SIZE; x += 1) {
      darkness.push(averageMarkerCellDarkness(imageData, x, y));
    }
  }

  const minDark = Math.min(...darkness);
  const maxDark = Math.max(...darkness);
  const contrast = maxDark - minDark;
  if (contrast < 30) return null;

  const threshold = (minDark + maxDark) / 2;
  const bits = darkness.map((value) => (value > threshold ? "1" : "0")).join("");
  let best = null;

  MARKER_PATTERNS.forEach((pattern, answerIndex) => {
    let distance = 0;
    for (let index = 0; index < bits.length; index += 1) {
      if (bits[index] !== pattern.bits[index]) distance += 1;
    }
    if (!best || distance < best.distance) {
      best = { answerIndex, letter: pattern.letter, distance, contrast };
    }
  });

  if (!best || best.distance > 2) return null;
  return best;
}

function scanAnswerMarker() {
  if (!document.body.classList.contains("view-question") || skillReady || !ENEMIES[currentEnemyIndex]) {
    markerCandidate = null;
    markerStableCount = 0;
    return;
  }

  const result = decodeMarkerBits();
  if (!result) {
    markerCandidate = null;
    markerStableCount = 0;
    updateMarkerStatus("\u672a\u6383\u5230 Marker\uff1a\u8acb\u628a\u5361\u7247\u653e\u6eff Webcam \u4e2d\u592e\u6846\u3002", "detecting");
    return;
  }

  if (markerCandidate === result.letter) {
    markerStableCount += 1;
  } else {
    markerCandidate = result.letter;
    markerStableCount = 1;
  }

  updateMarkerStatus(`\u6383\u63cf\u4e2d\uff1a${result.letter}`, "detecting");

  if (markerStableCount < 5 || performance.now() - lastMarkerAnswerAt < 1400) return;

  lastMarkerAnswerAt = performance.now();
  markerStableCount = 0;
  markerCandidate = null;
  updateMarkerStatus(`\u5df2\u8b80\u53d6 ${result.letter}`, "success");
  answerQuestion(result.answerIndex);
}

function selectCharacter(character) {
  selectedCharacter = character;
  previewMascot.src = character.image;
  startButton.disabled = false;
  startButton.textContent = "\u555f\u52d5 Webcam";
  document.body.classList.add("has-character");
  playSelectSound();
  setStatus(`${character.name} \u6e96\u5099\u5c31\u7dd2\uff1a\u8acb\u5148\u78ba\u8a8d\u89d2\u8272\uff0c\u518d\u958b\u59cb\u6311\u6230\u3002`);

  document.querySelectorAll(".character-card").forEach((card) => {
    card.classList.toggle("is-selected", card.dataset.character === character.id);
  });

  if (legacyRoot) {
    legacyRoot.visible = false;
  }

  updateMascotTexture(character);
}

function renderCharacterSelect() {
  characterGrid.innerHTML = "";

  CHARACTERS.forEach((character) => {
    const button = document.createElement("button");
    const image = document.createElement("img");
    const name = document.createElement("span");
    const virtue = document.createElement("small");

    button.type = "button";
    button.className = "character-card";
    button.dataset.character = character.id;
    button.style.setProperty("--hero-color", character.color);
    image.src = character.image;
    image.alt = character.name;
    name.textContent = character.name;
    virtue.textContent = character.virtue;
    button.append(image, name, virtue);
    button.addEventListener("click", () => selectCharacter(character));
    characterGrid.append(button);
  });
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function lerp(from, to, speed) {
  return from + (to - from) * speed;
}

function normalizedToWorld(point) {
  return {
    x: (point.x - 0.5) * WORLD.width,
    y: (0.58 - point.y) * WORLD.height,
  };
}

function createMaterial(color, roughness = 0.55, metalness = 0.08) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness,
    metalness,
  });
}

function makeCapsule(radius, length, color) {
  const geometry = new THREE.CapsuleGeometry(radius, length, 10, 20);
  const mesh = new THREE.Mesh(geometry, createMaterial(color));
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function createAvatar() {
  const root = new THREE.Group();
  legacyRoot = new THREE.Group();
  const torso = makeCapsule(0.34, 0.75, 0x49e6ff);
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.31, 32, 20),
    createMaterial(0xffc857, 0.48, 0.04),
  );
  const leftArm = makeCapsule(0.09, 0.64, 0x7affbf);
  const rightArm = makeCapsule(0.09, 0.64, 0x7affbf);
  const leftLeg = makeCapsule(0.12, 0.72, 0x4d7cff);
  const rightLeg = makeCapsule(0.12, 0.72, 0x4d7cff);
  const leftEar = new THREE.Mesh(new THREE.SphereGeometry(0.11, 18, 14), createMaterial(0x57c7ff));
  const rightEar = leftEar.clone();
  const visor = new THREE.Mesh(
    new THREE.BoxGeometry(0.36, 0.08, 0.035),
    new THREE.MeshStandardMaterial({
      color: 0x05231a,
      emissive: 0x6effb6,
      emissiveIntensity: 0.2,
      roughness: 0.24,
    }),
  );
  const antenna = new THREE.Mesh(
    new THREE.CylinderGeometry(0.014, 0.014, 0.28, 10),
    new THREE.MeshBasicMaterial({ color: 0xd8ffee }),
  );
  const antennaDot = new THREE.Mesh(
    new THREE.SphereGeometry(0.055, 16, 12),
    new THREE.MeshBasicMaterial({ color: 0x6effb6 }),
  );
  const chestCore = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.13, 0),
    new THREE.MeshStandardMaterial({
      color: 0xffd166,
      emissive: 0xffa600,
      emissiveIntensity: 1.1,
      roughness: 0.25,
      metalness: 0.18,
    }),
  );
  const leftHand = new THREE.Mesh(new THREE.SphereGeometry(0.12, 18, 14), createMaterial(0x7affbf));
  const rightHand = leftHand.clone();
  const leftBoot = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.16, 0.24), createMaterial(0x57c7ff));
  const rightBoot = leftBoot.clone();
  const eyeMaterial = createMaterial(0xffffff, 0.25, 0);
  const leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.045, 16, 12), eyeMaterial);
  const rightEye = leftEye.clone();

  torso.position.y = 0.14;
  head.position.y = 0.86;
  leftEar.position.set(-0.28, 0.89, 0.02);
  rightEar.position.set(0.28, 0.89, 0.02);
  visor.position.set(0, 0.9, 0.29);
  antenna.position.set(0, 1.18, 0.02);
  antennaDot.position.set(0, 1.34, 0.02);
  chestCore.position.set(0, 0.27, 0.36);
  chestCore.rotation.z = Math.PI / 4;
  leftArm.position.set(-0.43, 0.26, 0);
  rightArm.position.set(0.43, 0.26, 0);
  leftArm.rotation.z = -0.35;
  rightArm.rotation.z = 0.35;
  leftHand.position.set(-0.62, -0.08, 0.02);
  rightHand.position.set(0.62, -0.08, 0.02);
  leftLeg.position.set(-0.18, -0.62, 0);
  rightLeg.position.set(0.18, -0.62, 0);
  leftLeg.rotation.z = 0.08;
  rightLeg.rotation.z = -0.08;
  leftBoot.position.set(-0.21, -1.04, 0.04);
  rightBoot.position.set(0.21, -1.04, 0.04);
  leftBoot.rotation.z = 0.08;
  rightBoot.rotation.z = -0.08;
  leftEye.position.set(-0.1, 0.91, 0.27);
  rightEye.position.set(0.1, 0.91, 0.27);

  legacyRoot.add(
    torso,
    head,
    leftEar,
    rightEar,
    visor,
    antenna,
    antennaDot,
    chestCore,
    leftArm,
    rightArm,
    leftHand,
    rightHand,
    leftLeg,
    rightLeg,
    leftBoot,
    rightBoot,
    leftEye,
    rightEye,
  );
  mascotGlow = new THREE.Mesh(
    new THREE.CircleGeometry(1.08, 48),
    new THREE.MeshBasicMaterial({
      color: 0xd8ffee,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    }),
  );
  mascotMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1.85, 1.85),
    new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 }),
  );
  mascotGlow.position.set(0, 0.1, -0.04);
  mascotMesh.position.set(0, 0.1, 0.05);
  mascotGlow.visible = false;
  mascotMesh.visible = false;
  if (selectedCharacter) {
    legacyRoot.visible = false;
  }
  legacyAvatarParts = legacyRoot.children;
  root.add(legacyRoot, mascotGlow, mascotMesh);
  root.scale.setScalar(0.9);
  root.position.set(0, WORLD.floorY + 0.9, 0.2);

  return {
    root,
    parts: {
      torso,
      head,
      leftArm,
      rightArm,
      leftLeg,
      rightLeg,
      leftHand,
      rightHand,
      leftBoot,
      rightBoot,
      chestCore,
      antennaDot,
    },
  };
}

function resetGame() {
  clearBattleIntroTimers();
  clearDodgeTimeout();
  clearEnemyProjectiles();
  clearStarPickup();
  setMusicMode("mission");
  document.body.classList.remove("battle-intro", "danger-phase", "enemy-entered", "hero-entered", "charge-cinematic", "mission-failed");
  score = 0;
  currentEnemyIndex = 0;
  currentQuestionIndex = 0;
  energy = 0;
  heroHp = HERO_MAX_HP;
  enemyHp = 100;
  combo = 0;
  skillReady = false;
  missionFailed = false;
  dodgeState = "idle";
  targetActive = true;
  poseCenterX = null;
  lastStarSpawnAt = performance.now();
  if (victoryKicker) {
    victoryKicker.textContent = "VICTORY";
  }
  if (victoryTitle) {
    victoryTitle.textContent = "\u6b63\u5411\u80fd\u91cf\u5168\u90e8\u89e3\u653e";
  }
  scoreEl.textContent = "0";
  enemyMeshes.forEach((enemy, index) => {
    enemy.defeated = false;
    enemy.slot.visible = true;
    enemy.slot.userData.defeat = 1;
    enemy.mesh.material.opacity = 1;
    enemy.halo.material.opacity = index === 0 ? 0.24 : 0.08;
  });
  refreshEnemies();
  updateMissionUI();
  resetRoundTimer();
  setView("select");
}

function createLightsaber() {
  const group = new THREE.Group();
  const hilt = new THREE.Mesh(
    new THREE.CylinderGeometry(0.055, 0.065, 0.38, 16),
    new THREE.MeshStandardMaterial({
      color: 0xc8d5df,
      roughness: 0.35,
      metalness: 0.75,
    }),
  );
  const guard = new THREE.Mesh(
    new THREE.TorusGeometry(0.09, 0.012, 8, 24),
    new THREE.MeshBasicMaterial({ color: 0xffd166 }),
  );

  saberBlade = new THREE.Mesh(
    new THREE.CylinderGeometry(0.035, 0.055, 1, 18),
    new THREE.MeshBasicMaterial({
      color: 0x9fffea,
      transparent: true,
      opacity: 0.0,
      depthWrite: false,
    }),
  );
  saberGlow = new THREE.Mesh(
    new THREE.CylinderGeometry(0.11, 0.14, 1, 18),
    new THREE.MeshBasicMaterial({
      color: 0x6effb6,
      transparent: true,
      opacity: 0.0,
      depthWrite: false,
    }),
  );

  hilt.rotation.z = Math.PI / 2;
  guard.rotation.x = Math.PI / 2;
  saberBlade.position.y = 0.62;
  saberGlow.position.y = 0.62;
  group.add(hilt, guard, saberGlow, saberBlade);
  group.position.set(0.62, 0.1, 0.1);
  group.rotation.z = -0.45;
  group.visible = true;
  updateSaber();
  return group;
}

function updateSaber() {
  if (!saberBlade || !saberGlow) return;

  const level = energy / ENERGY_REQUIRED;
  const bladeLength = 0.2 + level * 1.35;
  const intensity = level > 0 ? 0.42 + level * 0.5 : 0;

  saberBlade.scale.set(1, bladeLength, 1);
  saberGlow.scale.set(1, bladeLength, 1);
  saberBlade.position.y = 0.22 + bladeLength * 0.5;
  saberGlow.position.y = 0.22 + bladeLength * 0.5;
  saberBlade.material.opacity = intensity;
  saberGlow.material.opacity = Math.max(0, intensity - 0.24);
  saberGlow.material.color.setHex(skillReady ? 0xffd166 : 0x6effb6);
}

function createTarget() {
  const group = new THREE.Group();
  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.22, 1),
    new THREE.MeshStandardMaterial({
      color: 0xffd166,
      emissive: 0xffa600,
      emissiveIntensity: 1.2,
      roughness: 0.35,
      metalness: 0.1,
    }),
  );
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.34, 0.018, 10, 48),
    new THREE.MeshBasicMaterial({ color: 0xfff0a3, transparent: true, opacity: 0.75 }),
  );
  const light = new THREE.PointLight(0xffc857, 1.7, 3.2);

  core.castShadow = true;
  ring.rotation.x = Math.PI / 2.8;
  light.position.z = 0.45;
  group.add(core, ring, light);
  return group;
}

function createStarShape(radius = 0.24, innerRadius = 0.11) {
  const shape = new THREE.Shape();

  for (let point = 0; point < 10; point += 1) {
    const angle = -Math.PI / 2 + (point / 10) * Math.PI * 2;
    const r = point % 2 === 0 ? radius : innerRadius;
    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r;

    if (point === 0) {
      shape.moveTo(x, y);
    } else {
      shape.lineTo(x, y);
    }
  }

  shape.closePath();
  return shape;
}

function createStarPickup() {
  const group = new THREE.Group();
  const star = new THREE.Mesh(
    new THREE.ExtrudeGeometry(createStarShape(), { depth: 0.08, bevelEnabled: true, bevelSize: 0.018, bevelThickness: 0.018 }),
    new THREE.MeshStandardMaterial({
      color: 0xffd45f,
      emissive: 0xffa600,
      emissiveIntensity: 1.45,
      roughness: 0.25,
      metalness: 0.18,
    }),
  );
  const glow = new THREE.Mesh(
    new THREE.CircleGeometry(0.58, 48),
    new THREE.MeshBasicMaterial({
      color: 0xffd45f,
      transparent: true,
      opacity: 0.22,
      depthWrite: false,
      side: THREE.DoubleSide,
    }),
  );
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.36, 0.018, 8, 48),
    new THREE.MeshBasicMaterial({
      color: 0xfff1a3,
      transparent: true,
      opacity: 0.78,
      depthWrite: false,
    }),
  );
  const light = new THREE.PointLight(0xffd45f, 2.4, 3.2);

  star.rotation.x = -0.16;
  glow.rotation.x = -Math.PI / 2;
  glow.position.y = -0.18;
  ring.rotation.x = Math.PI / 2;
  light.position.set(0, 0.25, 0.15);
  group.add(glow, star, ring, light);
  group.visible = false;
  return group;
}

function clearStarPickup() {
  starActive = false;
  if (starPickup) {
    starPickup.visible = false;
  }
}

function spawnStarPickup() {
  if (!starPickup || starActive || missionFailed || skillReady || !ENEMIES[currentEnemyIndex]) return;

  const x = -STAR_LANE_X_LIMIT + Math.random() * STAR_LANE_X_LIMIT * 2;
  const z = PLAYER_Z + (Math.random() - 0.5) * STAR_LANE_Z_SPREAD;
  starActive = true;
  starPickup.visible = true;
  starPickup.position.set(x, WORLD.floorY + 0.58, z);
  starPickup.userData.life = 1;
  playCharge(1);
  showToast("\u661f\u661f\u51fa\u73fe\uff01\u62fe\u53d6\u5f8c\u7b54\u984c\u5145\u80fd", "success");
  setStatus("\u5145\u80fd\u661f\u661f\u51fa\u73fe\u5728\u6b63\u5411\u4fe0\u7684\u79fb\u52d5\u8def\u5f91\u4e0a\uff01\u5de6\u53f3\u79fb\u52d5\u53bb\u62fe\u53d6\u661f\u661f\u3002");
}

function openQuestionFromStar() {
  if (!ENEMIES[currentEnemyIndex] || skillReady || missionFailed) return;

  dodgeState = "question";
  clearDodgeTimeout();
  clearEnemyProjectiles();
  clearStarPickup();
  updateMissionUI();
  updatePhase("SCAN");
  setStatus("\u62fe\u5230\u5145\u80fd\u661f\u661f\uff01\u73fe\u5728\u56de\u7b54\u4e00\u984c\u70ba\u5149\u528d\u5145\u80fd\u3002");
  showToast("\u661f\u661f\u5145\u80fd\uff1a\u7b54\u984c\u958b\u59cb", "success");
  setView("question");
}

function updateStarPickup(elapsed) {
  const canSpawn =
    document.body.classList.contains("view-game") &&
    document.body.classList.contains("hero-entered") &&
    dodgeState === "waiting" &&
    !skillReady &&
    !missionFailed &&
    Boolean(ENEMIES[currentEnemyIndex]);

  if (canSpawn && !starActive && performance.now() - lastStarSpawnAt >= STAR_SPAWN_INTERVAL) {
    lastStarSpawnAt = performance.now();
    spawnStarPickup();
  }

  if (!starPickup || !starActive) return;

  starPickup.rotation.y += 0.035;
  starPickup.rotation.z = Math.sin(elapsed * 3.2) * 0.14;
  starPickup.position.y = WORLD.floorY + 0.58 + Math.sin(elapsed * 4.4) * 0.08;
  starPickup.scale.setScalar(1 + Math.sin(elapsed * 6) * 0.08);

  if (dodgeState !== "waiting") return;

  const dx = starPickup.position.x - avatarPose.x;
  const dz = starPickup.position.z - avatarPose.z;
  const collected = Math.hypot(dx, dz) < 0.74;
  if (!collected) return;

  score += 1;
  scoreEl.textContent = String(score);
  flashScreen("good");
  createChargeBurst(Math.max(1, energy + 1));
  openQuestionFromStar();
}

function createEnemyLine() {
  const group = new THREE.Group();

  ENEMIES.forEach((enemy, index) => {
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1.28, 1.28),
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 }),
    );
    const halo = new THREE.Mesh(
      new THREE.CircleGeometry(0.84, 48),
      new THREE.MeshBasicMaterial({
        color: 0xff6b6b,
        transparent: true,
        opacity: 0.12,
        depthWrite: false,
      }),
    );
    halo.visible = false;
    const platform = new THREE.Mesh(
      new THREE.CylinderGeometry(0.62, 0.78, 0.08, 40),
      new THREE.MeshStandardMaterial({
        color: 0x17332f,
        emissive: 0x6effb6,
        emissiveIntensity: 0.18,
        roughness: 0.42,
        metalness: 0.18,
        transparent: true,
        opacity: 0.78,
      }),
    );
    platform.visible = false;
    const slot = new THREE.Group();

    mesh.position.set(0, 0.42, 0.08);
    halo.position.set(0, 0.42, 0);
    platform.position.set(0, -0.28, -0.04);
    slot.position.set(enemy.x, WORLD.floorY + 1.06, -2.25);
    slot.scale.setScalar(index === currentEnemyIndex ? 1.22 : 0.82);
    slot.add(platform, halo, mesh);
    group.add(slot);
    enemyMeshes.push({ slot, mesh, halo, platform, defeated: false });

    textureLoader.load(enemy.image, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      mesh.material = createMascotMaterial(texture);
      mesh.visible = true;
    });
  });

  return group;
}

function createSkillBeam(target) {
  const start = new THREE.Vector3(avatarPose.x, avatarPose.y + 0.25, avatarPose.z);
  const end = target.getWorldPosition(new THREE.Vector3());
  const curve = new THREE.CatmullRomCurve3([
    start,
    new THREE.Vector3((start.x + end.x) / 2, start.y + 0.8, -0.75),
    end,
  ]);
  const beam = new THREE.Mesh(
    new THREE.TubeGeometry(curve, 24, 0.035, 10, false),
    new THREE.MeshBasicMaterial({
      color: 0xffd166,
      transparent: true,
      opacity: 0.95,
    }),
  );

  beam.userData.life = 1;
  scene.add(beam);
  skillBeams.push(beam);
}

function createSlashTrail(target) {
  const center = target.getWorldPosition(new THREE.Vector3());
  const strokes = [
    [
      new THREE.Vector3(center.x - 0.75, center.y - 0.45, center.z + 0.12),
      new THREE.Vector3(center.x, center.y + 0.05, center.z + 0.2),
      new THREE.Vector3(center.x + 0.75, center.y + 0.48, center.z + 0.12),
    ],
    [
      new THREE.Vector3(center.x - 0.62, center.y + 0.42, center.z + 0.1),
      new THREE.Vector3(center.x + 0.04, center.y - 0.02, center.z + 0.22),
      new THREE.Vector3(center.x + 0.62, center.y - 0.38, center.z + 0.1),
    ],
  ];

  strokes.forEach((points, index) => {
    const curve = new THREE.CatmullRomCurve3(points);
    const trail = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 18, index === 0 ? 0.055 : 0.028, 10, false),
      new THREE.MeshBasicMaterial({
        color: index === 0 ? 0xffffff : 0xffd166,
        transparent: true,
        opacity: index === 0 ? 0.95 : 0.82,
        depthWrite: false,
      }),
    );

    trail.userData.life = 1;
    scene.add(trail);
    skillBeams.push(trail);
  });
}

function clearEnemyProjectiles() {
  enemyProjectiles.forEach((projectile) => {
    scene.remove(projectile.group, projectile.warning);
    projectile.group.traverse((child) => {
      if (child.geometry) child.geometry.dispose();
      if (child.material) child.material.dispose();
    });
    if (projectile.warning) {
      projectile.warning.geometry.dispose();
      projectile.warning.material.dispose();
    }
  });
  enemyProjectiles = [];
}

function clearDodgeTimeout() {
  if (dodgeTimeout) {
    window.clearTimeout(dodgeTimeout);
    dodgeTimeout = null;
  }
  if (dodgeRetryTimeout) {
    window.clearTimeout(dodgeRetryTimeout);
    dodgeRetryTimeout = null;
  }
}

function createEnemyProjectile(attemptId = dodgeAttemptId) {
  const enemy = enemyMeshes[currentEnemyIndex];
  if (!scene || !enemy || enemy.defeated || !enemy.slot.visible || attemptId !== dodgeAttemptId) return;

  const enemyPosition = enemy.slot.getWorldPosition(new THREE.Vector3());
  const laneCount = 7;
  const laneIndex = Math.floor(Math.random() * laneCount);
  const laneX = -3.45 + laneIndex * 1.15;
  const start = new THREE.Vector3(enemyPosition.x, enemyPosition.y + 0.26, enemyPosition.z + 0.22);
  const group = new THREE.Group();
  const core = new THREE.Mesh(
    new THREE.SphereGeometry(0.16, 12, 8),
    new THREE.MeshStandardMaterial({
      color: 0xff315f,
      emissive: 0xff174c,
      emissiveIntensity: 1.8,
      roughness: 0.28,
      metalness: 0.1,
    }),
  );
  const glow = new THREE.Mesh(
    new THREE.SphereGeometry(0.32, 12, 8),
    new THREE.MeshBasicMaterial({
      color: 0xff5f7d,
      transparent: true,
      opacity: 0.28,
      depthWrite: false,
    }),
  );
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.24, 0.018, 6, 20),
    new THREE.MeshBasicMaterial({
      color: 0xffd166,
      transparent: true,
      opacity: 0.82,
      depthWrite: false,
    }),
  );
  const warning = new THREE.Mesh(
    new THREE.PlaneGeometry(0.78, PROJECTILE_END_Z - ENEMY_Z - 0.8),
    new THREE.MeshBasicMaterial({
      color: 0xff315f,
      transparent: true,
      opacity: 0.16,
      depthWrite: false,
      side: THREE.DoubleSide,
    }),
  );

  ring.rotation.x = Math.PI / 2;
  warning.rotation.x = -Math.PI / 2;
  warning.position.set(laneX, WORLD.floorY + 0.035, (PROJECTILE_END_Z + ENEMY_Z) * 0.5 + 0.2);
  group.position.copy(start);
  group.add(glow, core, ring);
  scene.add(group, warning);
  enemyProjectiles.push({
    group,
    warning,
    laneX,
    startX: start.x,
    startZ: start.z,
    endZ: PROJECTILE_END_Z,
    z: start.z,
    speed: (0.042 + Math.random() * 0.016) * 60,
    life: 1,
    hit: false,
    scoring: dodgeState === "waiting",
    resolved: false,
    resolveKind: "",
    attemptId,
  });

  playEnemyShot();
}

function startDodgeChallenge(delay = 700) {
  if (!ENEMIES[currentEnemyIndex] || skillReady || missionFailed) return;

  clearDodgeTimeout();
  clearEnemyProjectiles();
  dodgeAttemptId += 1;
  const attemptId = dodgeAttemptId;
  dodgeState = "waiting";
  lastStarSpawnAt = performance.now();
  setView("game");
  updatePhase("DODGE");
  setStatus("\u5148\u9583\u907f\u602a\u7378\u653b\u64ca\uff01\u6bcf 5 \u79d2\u5834\u4e0a\u6703\u51fa\u73fe\u661f\u661f\uff0c\u62fe\u5230\u661f\u661f\u624d\u80fd\u7b54\u984c\u5145\u80fd\u3002");
  showToast("\u8eb2\u653b\u64ca + \u62fe\u661f\u661f\u624d\u7b54\u984c", "danger");

  dodgeTimeout = window.setTimeout(() => {
    if (attemptId !== dodgeAttemptId || dodgeState !== "waiting") return;
    dodgeTimeout = null;
    createEnemyProjectile(attemptId);
  }, delay);
}

function openQuestionAfterDodge(attemptId = dodgeAttemptId) {
  if (attemptId !== dodgeAttemptId) return;
}

function updateEnemyProjectiles(elapsed, dt = 1/60) {
  const canAttack =
    document.body.classList.contains("enemy-entered") &&
    document.body.classList.contains("hero-entered") &&
    dodgeState === "waiting" &&
    !missionFailed &&
    !document.body.classList.contains("view-start") &&
    !document.body.classList.contains("view-intro") &&
    !document.body.classList.contains("view-select") &&
    Boolean(ENEMIES[currentEnemyIndex]);

  if (canAttack && !enemyProjectiles.length && performance.now() - lastEnemyShotAt > 1350) {
    lastEnemyShotAt = performance.now();
    createEnemyProjectile(dodgeAttemptId);
  }

  enemyProjectiles = enemyProjectiles.filter((projectile) => {
    projectile.dt = dt;
    if (projectile.attemptId !== dodgeAttemptId) {
      scene.remove(projectile.group, projectile.warning);
      projectile.group.traverse((child) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) child.material.dispose();
      });
      projectile.warning.geometry.dispose();
      projectile.warning.material.dispose();
      return false;
    }

    if (!projectile.resolved) {
      projectile.z += projectile.speed * projectile.dt;
    }
    const progress = clamp((projectile.z - projectile.startZ) / (projectile.endZ - projectile.startZ), 0, 1);
    const x = lerp(projectile.startX, projectile.laneX, progress);
    const y = WORLD.floorY + 1.12 - progress * 0.22 + Math.sin(elapsed * 8 + progress * 5) * 0.035;

    projectile.group.position.set(x, y, projectile.z);
    projectile.group.rotation.x += 0.06;
    projectile.group.rotation.y += 0.08;
    projectile.group.scale.setScalar((1 + Math.sin(elapsed * 10) * 0.08) * (projectile.resolved ? 1 + (1 - projectile.life) * 0.95 : 1));
    projectile.warning.material.opacity = projectile.resolved ? 0 : Math.max(0, 0.18 * (1 - progress));

    const closeToHero = Math.abs(x - avatarPose.x) < 0.4 && Math.abs(projectile.z - avatarPose.z) < 0.38;
    if (!projectile.hit && closeToHero) {
      projectile.hit = true;
      projectile.resolved = true;
      projectile.resolveKind = "hit";
      projectile.life = 1;
      dodgeState = "idle";
      heroHp = Math.max(0, heroHp - 1);
      score = Math.max(0, score - 1);
      combo = 0;
      scoreEl.textContent = String(score);
      updateGameHUD();
      flashScreen("hit");
      playAttackHit();
      showToast(`\u88ab\u602a\u7378\u653b\u64ca\uff01HP ${heroHp} / ${HERO_MAX_HP}`, "danger");
      setStatus("\u88ab\u64ca\u4e2d\u4e86\uff01\u88ab\u64ca\u4e2d 3 \u6b21\u6703\u4efb\u52d9\u5931\u6557\u3002\u5de6\u53f3\u79fb\u52d5\u9583\u958b\u653b\u64ca\uff0c\u62fe\u661f\u661f\u624d\u80fd\u7b54\u984c\u3002");
      projectile.group.traverse((child) => {
        if (child.material?.emissive) {
          child.material.emissive.setHex(0xffd166);
        }
      });
      const retryAttemptId = projectile.attemptId;
      dodgeRetryTimeout = window.setTimeout(() => {
        if (missionFailed) return;
        if (retryAttemptId === dodgeAttemptId && dodgeState === "idle") {
          startDodgeChallenge(650);
        }
      }, 1050);
      if (heroHp <= 0) {
        window.setTimeout(failMission, 80);
      }
    }

    const reachedEnd = projectile.z > projectile.endZ;
    const dodged = reachedEnd && !projectile.hit && projectile.scoring && dodgeState === "waiting";
    if (!projectile.resolved && reachedEnd) {
      projectile.resolved = true;
      projectile.resolveKind = projectile.hit ? "hit" : dodged ? "dodged" : "missed";
      projectile.life = 1;
      if (dodged) {
        dodgeState = "dodged";
      }
    }

    if (projectile.resolved) {
      projectile.life -= (projectile.resolveKind === "hit" ? 0.075 : 0.055) * projectile.dt * 60;
      projectile.group.traverse((child) => {
        if (child.material && "opacity" in child.material) {
          child.material.transparent = true;
          child.material.opacity = Math.max(0, child.material.opacity * 0.88);
        }
      });

      if (projectile.life > 0) return true;

      scene.remove(projectile.group, projectile.warning);
      projectile.group.traverse((child) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) child.material.dispose();
      });
      projectile.warning.geometry.dispose();
      projectile.warning.material.dispose();
      if (projectile.resolveKind === "dodged") {
        dodgeState = "waiting";
        showToast("\u9583\u907f\u6210\u529f\uff01\u7559\u610f\u661f\u661f", "success");
        setStatus("\u9583\u907f\u6210\u529f\uff01\u7e7c\u7e8c\u79fb\u52d5\u8eb2\u653b\u64ca\uff0c\u5834\u4e0a\u51fa\u73fe\u661f\u661f\u5f8c\u62fe\u53d6\u624d\u6703\u7b54\u984c\u3002");
      }
      return false;
    }

    return true;
  });
}

function refreshEnemies() {
  enemyMeshes.forEach((enemy, index) => {
    const isCurrent = index === currentEnemyIndex && !enemy.defeated;
    enemy.slot.visible = isCurrent;
    enemy.slot.position.x = 0;
    enemy.slot.position.z = ENEMY_Z;
    enemy.slot.scale.setScalar(isCurrent ? 0.98 : 0.08);
    enemy.halo.material.opacity = isCurrent ? 0.26 : 0;
  });
}

function clearBattleIntroTimers() {
  battleIntroTimers.forEach((timer) => window.clearTimeout(timer));
  battleIntroTimers = [];
}

function scheduleBattleIntro(callback, delay) {
  const timer = window.setTimeout(callback, delay);
  battleIntroTimers.push(timer);
}

function prepareBattleEntrance() {
  document.body.classList.add("battle-intro", "danger-phase");
  document.body.classList.remove("hero-entered", "enemy-entered", "charge-cinematic");
  clearEnemyProjectiles();
  clearStarPickup();
  clearDodgeTimeout();
  dodgeState = "idle";
  lastEnemyShotAt = performance.now();
  enemyMeshes.forEach((enemy) => {
    enemy.slot.visible = false;
    enemy.slot.scale.setScalar(0.08);
  });

  if (avatar3D) {
    avatar3D.visible = false;
    avatar3D.scale.setScalar(0.2);
  }
}

function revealCurrentEnemy() {
  const enemy = enemyMeshes[currentEnemyIndex];
  if (!enemy) return;

  enemy.slot.visible = true;
  enemy.slot.position.set(0, WORLD.floorY + 1.28, ENEMY_Z);
  enemy.slot.scale.setScalar(1.18);
  enemy.halo.material.opacity = 0.5;
  document.body.classList.add("enemy-entered");
  showBossWarning(ENEMIES[currentEnemyIndex]);
  flashScreen("hit");
  playAlarm();

  window.setTimeout(() => {
    refreshEnemies();
  }, 620);
}

function revealHero() {
  if (!avatar3D) return;

  avatar3D.visible = true;
  avatar3D.scale.setScalar(1.26);
  poseCenterX = null;
  avatarPose.z = PLAYER_Z;
  avatar3D.position.z = avatarPose.z;
  document.body.classList.add("hero-entered");
  flashScreen("good");
  playCharge(Math.max(1, energy));

  window.setTimeout(() => {
    avatar3D.scale.setScalar(0.92);
  }, 520);
}

function createChargeBurst(level) {
  if (!scene || !avatar3D) return;

  const center = new THREE.Vector3(avatarPose.x, avatarPose.y + 0.45, avatarPose.z + 0.05);
  const ringCount = Math.min(3, Math.max(1, level));

  for (let index = 0; index < ringCount; index += 1) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.55 + index * 0.22, 0.018, 8, 72),
      new THREE.MeshBasicMaterial({
        color: level >= ENERGY_REQUIRED ? 0xffd166 : 0x6effb6,
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
      }),
    );

    ring.position.copy(center);
    ring.rotation.x = Math.PI / 2 + index * 0.38;
    ring.rotation.y = index * 0.32;
    ring.userData.life = 1.25 - index * 0.12;
    scene.add(ring);
    skillBeams.push(ring);
  }

  const burst = new THREE.PointLight(level >= ENERGY_REQUIRED ? 0xffd166 : 0x6effb6, 4.8, 4.5);
  burst.position.copy(center);
  burst.userData.life = 0.8;
  scene.add(burst);
  skillBeams.push(burst);
}

async function beginBattleSequence() {
  clearBattleIntroTimers();
  setMusicMode("danger");
  startAmbientAudio();
  playDangerStart();
  resetRoundTimer();
  prepareBattleEntrance();
  setView("game");
  updatePhase("WARNING");
  setStatus("\u5371\u96aa\u53cd\u61c9\uff01\u602a\u7378\u6b63\u5728\u5165\u4fb5\uff0c\u6e96\u5099\u555f\u52d5 Webcam\u3002");
  showToast("\u5371\u96aa\u97f3\u6a02\u555f\u52d5", "danger");

  startCamera({ silent: true });

  scheduleBattleIntro(() => {
    updatePhase("BOSS");
    setStatus("\u602a\u7378\u767b\u5834\uff01\u8acb\u6e96\u5099\u6b63\u5411\u5149\u528d\u3002");
    revealCurrentEnemy();
  }, 700);

  scheduleBattleIntro(() => {
    updatePhase("HERO");
    setStatus(`${selectedCharacter.name} \u767b\u5834\uff01\u5148\u5de6\u53f3\u79fb\u52d5\u907f\u958b\u602a\u7378\u653b\u64ca\u3002`);
    revealHero();
  }, 2200);

  scheduleBattleIntro(() => {
    updatePhase("DODGE");
    setStatus("\u602a\u7378\u767c\u5c04\u80fd\u91cf\u5f48\uff01\u7528 Webcam \u5de6\u53f3\u79fb\u52d5\u9583\u907f\uff0c\u6c92\u6709\u93e1\u982d\u6642\u53ef\u7528 A/D \u6216\u5de6\u53f3\u9375\u6e2c\u8a66\u3002");
    showToast("\u9583\u907f\u653b\u64ca\uff1a\u5de6\u53f3\u79fb\u52d5", "danger");
  }, 3400);

  scheduleBattleIntro(() => {
    document.body.classList.remove("battle-intro");
    startDodgeChallenge(300);
  }, 4200);
}

function triggerSkill() {
  const enemy = enemyMeshes[currentEnemyIndex];

  if (!skillReady || !enemy || enemy.defeated || performance.now() - lastSkillAt < 1200) return;

  lastSkillAt = performance.now();
  playSlashSound();
  clearEnemyProjectiles();
  clearStarPickup();
  createSkillBeam(enemy.slot);
  createSlashTrail(enemy.slot);
  enemy.defeated = true;
  enemy.slot.userData.defeat = 1;
  enemyHp = 0;
  energy = 0;
  skillReady = false;
  score += 5 + combo;
  combo += 1;
  scoreEl.textContent = String(score);
  updateGameHUD();
  showToast("VICTORY! \u5149\u528d\u65ac\u64ca\u6210\u529f", "success");
  setStatus("VICTORY! \u5149\u528d\u65ac\u64ca\u6210\u529f\uff0c\u602a\u7378\u5316\u70ba\u5149\u9ede\u6d88\u5931\u3002");

  window.setTimeout(() => {
    currentEnemyIndex += 1;
    enemyHp = 100;
    resetRoundTimer();
    clearEnemyProjectiles();
    clearDodgeTimeout();
    dodgeState = "idle";
    lastEnemyShotAt = performance.now();
    refreshEnemies();
    updateMissionUI();
    if (ENEMIES[currentEnemyIndex]) {
      showBossWarning(ENEMIES[currentEnemyIndex]);
      startDodgeChallenge(900);
    }
  }, 650);
}

function createFloor() {
  const group = new THREE.Group();
  const grid = new THREE.GridHelper(10.8, 24, 0x9bffd2, 0x24443a);
  grid.position.y = WORLD.floorY + 0.015;
  grid.material.transparent = true;
  grid.material.opacity = 0.42;

  const floor = new THREE.Mesh(
    new THREE.CylinderGeometry(4.8, 5.35, 0.26, 96),
    new THREE.MeshStandardMaterial({
      color: 0x09201d,
      emissive: 0x0f4d42,
      emissiveIntensity: 0.36,
      roughness: 0.42,
      metalness: 0.16,
      transparent: true,
      opacity: 0.86,
    }),
  );
  floor.position.y = WORLD.floorY - 0.13;
  floor.receiveShadow = true;

  const rim = new THREE.Mesh(
    new THREE.TorusGeometry(4.78, 0.045, 10, 128),
    new THREE.MeshBasicMaterial({
      color: 0x75ffc2,
      transparent: true,
      opacity: 0.44,
      depthWrite: false,
    }),
  );
  rim.rotation.x = Math.PI / 2;
  rim.position.y = WORLD.floorY + 0.035;

  const innerLane = new THREE.Mesh(
    new THREE.TorusGeometry(2.15, 0.018, 8, 96),
    new THREE.MeshBasicMaterial({
      color: 0xffd166,
      transparent: true,
      opacity: 0.28,
      depthWrite: false,
    }),
  );
  innerLane.rotation.x = Math.PI / 2;
  innerLane.position.y = WORLD.floorY + 0.045;

  const runwayMaterial = new THREE.MeshStandardMaterial({
    color: 0x0d3432,
    emissive: 0x1d6b5d,
    emissiveIntensity: 0.22,
    roughness: 0.36,
    metalness: 0.18,
    transparent: true,
    opacity: 0.62,
  });
  const runway = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.04, 5.2), runwayMaterial);
  runway.position.set(0, WORLD.floorY + 0.035, -0.72);
  runway.receiveShadow = true;

  const leftLane = runway.clone();
  const rightLane = runway.clone();
  leftLane.position.x = -2.6;
  rightLane.position.x = 2.6;
  leftLane.scale.x = 0.58;
  rightLane.scale.x = 0.58;

  group.add(floor, grid, rim, innerLane, runway, leftLane, rightLane);

  return { group, grid, floor, rim, innerLane, runway };
}

function createArena() {
  const group = new THREE.Group();
  const ringMaterial = new THREE.MeshBasicMaterial({
    color: 0x6effb6,
    transparent: true,
    opacity: 0.32,
    side: THREE.DoubleSide,
  });
  const goldMaterial = new THREE.MeshBasicMaterial({
    color: 0xffd166,
    transparent: true,
    opacity: 0.22,
    side: THREE.DoubleSide,
  });
  const backPanel = new THREE.Mesh(
    new THREE.PlaneGeometry(8.6, 4.6),
    new THREE.MeshBasicMaterial({
      color: 0x123b35,
      transparent: true,
      opacity: 0.2,
      side: THREE.DoubleSide,
    }),
  );
  const outerRing = new THREE.Mesh(new THREE.TorusGeometry(2.7, 0.045, 16, 128), ringMaterial);
  const innerRing = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.022, 12, 96), goldMaterial);
  const portalCore = new THREE.Mesh(
    new THREE.CircleGeometry(2.18, 96),
    new THREE.MeshBasicMaterial({
      color: 0x1c9a87,
      transparent: true,
      opacity: 0.18,
      depthWrite: false,
      side: THREE.DoubleSide,
    }),
  );
  const leftPillar = new THREE.Mesh(new THREE.BoxGeometry(0.22, 2.8, 0.22), ringMaterial);
  const rightPillar = leftPillar.clone();
  const sideBlockMaterial = new THREE.MeshStandardMaterial({
    color: 0x0f2c2a,
    emissive: 0x1d7a68,
    emissiveIntensity: 0.16,
    roughness: 0.5,
    metalness: 0.2,
    transparent: true,
    opacity: 0.84,
  });
  const sideBlocks = [];
  const centerDisk = new THREE.Mesh(
    new THREE.CylinderGeometry(1.55, 1.85, 0.12, 72),
    new THREE.MeshStandardMaterial({
      color: 0x0d3a35,
      emissive: 0x57c7ff,
      emissiveIntensity: 0.18,
      roughness: 0.35,
      metalness: 0.2,
      transparent: true,
      opacity: 0.62,
    }),
  );
  const crystalMaterial = new THREE.MeshStandardMaterial({
    color: 0x75ffc2,
    emissive: 0x31ff9f,
    emissiveIntensity: 0.9,
    roughness: 0.18,
    metalness: 0.05,
    transparent: true,
    opacity: 0.82,
  });
  const crystals = [];

  [-3.95, -2.85, 2.85, 3.95].forEach((x, index) => {
    const block = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.42, 1.08), sideBlockMaterial.clone());
    block.position.set(x, WORLD.floorY + 0.05, -3.02 + (index % 2) * 0.55);
    block.rotation.y = x < 0 ? -0.18 : 0.18;
    block.castShadow = true;
    block.receiveShadow = true;
    sideBlocks.push(block);
    group.add(block);
  });

  [-3.25, 3.25].forEach((x, index) => {
    const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.3, 0), crystalMaterial.clone());
    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.34, 0.22, 24),
      new THREE.MeshStandardMaterial({
        color: 0x17332f,
        emissive: 0xffd166,
        emissiveIntensity: 0.28,
        roughness: 0.38,
        metalness: 0.18,
      }),
    );
    const crystalGroup = new THREE.Group();
    crystal.position.y = 0.52;
    base.position.y = 0.02;
    crystalGroup.position.set(x, WORLD.floorY + 0.05, -1.9 - index * 0.45);
    crystalGroup.add(base, crystal);
    crystals.push(crystalGroup);
    group.add(crystalGroup);
  });
  const particlesGeometry = new THREE.BufferGeometry();
  const positions = [];

  for (let index = 0; index < 90; index += 1) {
    positions.push(
      (Math.random() - 0.5) * 7.8,
      Math.random() * 3.8 - 0.2,
      -2.9 - Math.random() * 1.6,
    );
  }

  particlesGeometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));

  const particles = new THREE.Points(
    particlesGeometry,
    new THREE.PointsMaterial({
      color: 0xd8ffee,
      size: 0.025,
      transparent: true,
      opacity: 0.68,
      depthWrite: false,
    }),
  );

  backPanel.position.set(0, 0.58, -3.95);
  outerRing.position.set(0, 0.64, -3.82);
  innerRing.position.set(0, 0.64, -3.78);
  portalCore.position.set(0, 0.64, -3.86);
  leftPillar.position.set(-3.9, 0.12, -2.75);
  rightPillar.position.set(3.9, 0.12, -2.75);
  leftPillar.rotation.z = -0.08;
  rightPillar.rotation.z = 0.08;
  centerDisk.position.set(0, WORLD.floorY + 0.04, -0.55);

  group.add(backPanel, portalCore, outerRing, innerRing, leftPillar, rightPillar, centerDisk, particles);

  return { group, outerRing, innerRing, portalCore, leftPillar, rightPillar, centerDisk, crystals, particles, sideBlocks };
}

function initThree() {
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x07100d, 6, 14);
  textureLoader = new THREE.TextureLoader();

  camera3D = new THREE.PerspectiveCamera(54, 1, 0.1, 100);
  camera3D.position.set(0, 5.65, 9.8);
  camera3D.lookAt(0, -0.9, -1.45);

  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: false,
    canvas: threeCanvas,
  });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(1);
  renderer.shadowMap.enabled = false;

  const hemisphere = new THREE.HemisphereLight(0xf0fff9, 0x16463a, 2.75);
  const key = new THREE.DirectionalLight(0xffffff, 3.5);
  key.position.set(-2.8, 5.4, 4.2);
  const rim = new THREE.PointLight(0xffd166, 2.2, 7);
  rim.position.set(2.4, 2.7, 2.6);

  const avatar = createAvatar();
  saberGroup = createLightsaber();
  avatar.root.add(saberGroup);
  enemyGroup = createEnemyLine();
  starPickup = createStarPickup();
  target3D = null;
  avatar3D = avatar.root;
  bodyParts = avatar.parts;

  scene.add(hemisphere, key, rim, enemyGroup, avatar3D, starPickup);
  refreshEnemies();
  updateMissionUI();
  updateGameHUD();
  resetRoundTimer();
  clock = new THREE.Clock();
  resizeCanvases();
  document.body.classList.add("webgl-ready");
  animateThree();
}

function resizeCanvases() {
  if (!renderer || !camera3D) return;

  const rect = canvas.getBoundingClientRect();
  const pixelRatio = window.devicePixelRatio || 1;
  canvas.width = Math.round(rect.width * pixelRatio);
  canvas.height = Math.round(rect.height * pixelRatio);
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

  renderer.setSize(rect.width, rect.height, false);
  camera3D.aspect = rect.width / Math.max(rect.height, 1);
  camera3D.updateProjectionMatrix();
}

async function createLandmarker() {
  setStatus("\u6b63\u5728\u8f09\u5165\u52d5\u4f5c\u8ffd\u8e64\u6a21\u578b...");
  const { DrawingUtils, FilesetResolver, PoseLandmarker, wasmUrl } = await loadVisionTasks();
  const fileset = await FilesetResolver.forVisionTasks(wasmUrl);

  landmarker = await PoseLandmarker.createFromOptions(fileset, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task",
      delegate: "CPU",
    },
    runningMode: "VIDEO",
    numPoses: 1,
    minPoseDetectionConfidence: 0.5,
    minPosePresenceConfidence: 0.5,
    minTrackingConfidence: 0.5,
  });

  drawingUtils = new DrawingUtils(ctx);
}

async function startCamera(options = {}) {
  const silent = options?.silent === true;

  if (!selectedCharacter) {
    setStatus("\u8acb\u5148\u9078\u64c7\u4e00\u4f4d\u6b63\u5411\u4fe0\u3002");
    return false;
  }

  startAmbientAudio();
  if (running) {
    return true;
  }

  startButton.disabled = true;

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "user",
        width: { ideal: 640 },
        height: { ideal: 480 },
      },
      audio: false,
    });

    video.srcObject = stream;
    if (previewVideo) {
      previewVideo.srcObject = stream;
    }
    await video.play();
    if (previewVideo) {
      previewVideo.play().catch(() => {});
    }
    running = true;
    document.body.classList.add("is-playing");
    startButton.textContent = "\u904a\u6232\u9032\u884c\u4e2d";
    resizeCanvases();

    if (!landmarker) {
      try {
        await createLandmarker();
      } catch (trackingError) {
        console.warn(trackingError);
        moveState.textContent = "camera only";
        if (!silent) {
          setStatus("\u5df2\u555f\u52d5 Webcam\uff0c\u52d5\u4f5c\u8ffd\u8e64\u6b63\u5728\u5f8c\u5099\u6a21\u5f0f\u3002");
        }
        setTimeout(predictFrame, 25);
        return true;
      }
    }

    if (!silent) {
      setStatus(`${selectedCharacter.name} \u5df2\u51fa\u52d5\uff01\u8acb\u6309\u300c\u7b54\u984c\u5145\u80fd\u300d\u70ba\u5149\u528d\u5132\u6eff\u80fd\u91cf\u3002`);
    }
    setTimeout(predictFrame, 25);
    return true;
  } catch (error) {
    console.error(error);
    setStatus("\u7121\u6cd5\u555f\u52d5 Webcam\uff1a\u8acb\u5141\u8a31\u76f8\u6a5f\u6b0a\u9650\uff0c\u4e26\u7528 localhost \u6216 HTTPS \u958b\u555f\u9801\u9762\u3002");
    startButton.disabled = !selectedCharacter;
    return false;
  }
}

function getMidpoint(a, b) {
  return {
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
  };
}

function updateAvatar(landmarks) {
  const leftShoulder = landmarks[11];
  const rightShoulder = landmarks[12];
  const leftHip = landmarks[23];
  const rightHip = landmarks[24];
  const leftWrist = landmarks[15];
  const rightWrist = landmarks[16];

  if (!leftShoulder || !rightShoulder || !leftHip || !rightHip) return;

  const shoulders = getMidpoint(leftShoulder, rightShoulder);
  const hips = getMidpoint(leftHip, rightHip);
  const bodyCenter = getMidpoint(shoulders, hips);
  const shoulderTilt = clamp((leftShoulder.y - rightShoulder.y) * 4, -0.65, 0.65);
  const handRaised =
    (leftWrist && leftWrist.y < shoulders.y - 0.12) ||
    (rightWrist && rightWrist.y < shoulders.y - 0.12);
  const bothHandsRaised =
    leftWrist &&
    rightWrist &&
    leftWrist.y < shoulders.y - 0.12 &&
    rightWrist.y < shoulders.y - 0.12;

  const mirroredBodyX = 1 - bodyCenter.x;
  if (poseCenterX === null) {
    poseCenterX = mirroredBodyX;
  }

  smoothed.x = lerp(smoothed.x, mirroredBodyX, 0.48);
  smoothed.y = lerp(smoothed.y, bodyCenter.y + (handRaised ? -0.12 : 0.07), 0.42);
  smoothed.tilt = lerp(smoothed.tilt, shoulderTilt, 0.45);
  smoothed.jump = lerp(smoothed.jump, handRaised ? 1 : 0, 0.55);

  const world = normalizedToWorld(smoothed);
  const relativeBodyX = clamp((smoothed.x - poseCenterX) / POSE_CONTROL_RANGE, -1, 1);
  avatar3D.position.x = relativeBodyX * PLAYER_X_LIMIT;
  avatarPose = {
    x: avatar3D.position.x,
    y: WORLD.floorY + 0.9 + clamp(world.y, -0.25, 1.05),
    z: PLAYER_Z + Math.abs(smoothed.tilt) * 0.18,
  };
  avatar3D.position.y = avatarPose.y;
  avatar3D.position.z = avatarPose.z;
  avatar3D.rotation.y = -smoothed.tilt * 0.8;
  avatar3D.rotation.z = -smoothed.tilt * 0.22;

  bodyParts.leftArm.rotation.z = handRaised ? -1.95 : -0.35 - smoothed.tilt * 0.55;
  bodyParts.rightArm.rotation.z = handRaised ? 1.95 : 0.35 - smoothed.tilt * 0.55;
  bodyParts.leftHand.position.set(-0.62, handRaised ? 0.52 : -0.08, 0.02);
  bodyParts.rightHand.position.set(0.62, handRaised ? 0.52 : -0.08, 0.02);
  bodyParts.leftLeg.rotation.z = 0.08 + smoothed.tilt * 0.24;
  bodyParts.rightLeg.rotation.z = -0.08 + smoothed.tilt * 0.24;
  bodyParts.head.rotation.z = -smoothed.tilt * 0.28;

  if (handRaised && performance.now() - lastJumpAt > 520) {
    lastJumpAt = performance.now();
  }

  const slashSpeed =
    rightWrist && lastRightWristX !== null ? Math.abs((1 - rightWrist.x) - lastRightWristX) : 0;
  if (rightWrist) {
    lastRightWristX = 1 - rightWrist.x;
  }

  if ((bothHandsRaised || slashSpeed > 0.13) && skillReady && performance.now() - lastSlashAt > 900) {
    lastSlashAt = performance.now();
    triggerSkill();
  }

  const action = handRaised
    ? "3D jump"
    : shoulderTilt < -0.22
      ? "3D dash left"
      : shoulderTilt > 0.22
        ? "3D dash right"
        : "3D follow";
  moveState.textContent = action;

}

function moveTarget() {
  targetPoint = {
    x: 0.16 + Math.random() * 0.68,
    y: 0.25 + Math.random() * 0.38,
  };
  const world = normalizedToWorld(targetPoint);
  if (target3D) {
    target3D.position.set(world.x, WORLD.floorY + 1.1 + world.y, -0.25);
    targetPulse = 1;
    targetActive = true;
  }
}

function checkTargetHit() {
  if (!targetActive || !target3D) return;

  const distance = avatar3D.position.distanceTo(target3D.position);

  if (distance > 0.72) return;

  targetActive = false;
  score += 1;
  scoreEl.textContent = String(score);
  targetPulse = 2.5;
  window.setTimeout(moveTarget, 170);
}

function drawPose(landmarks) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Disabled drawing landmarks and connectors for performance and UX
}

function animateThree() {
  const dt = Math.min(clock.getDelta(), 0.1);
  const elapsed = clock.getElapsedTime();
  const jumpArc = Math.max(0, 1 - (performance.now() - lastJumpAt) / 520);
  const hop = Math.sin(jumpArc * Math.PI) * 0.45;
  const hasActiveEnemy = Boolean(ENEMIES[currentEnemyIndex]);
  const keyboardDirection = (keyboardInput.right ? 1 : 0) - (keyboardInput.left ? 1 : 0);

  if (keyboardDirection !== 0) {
    keyboardDodgeX = lerp(keyboardDodgeX, keyboardDirection, 0.32);
    avatarPose.x = clamp(avatarPose.x + keyboardDodgeX * 0.12, -PLAYER_X_LIMIT, PLAYER_X_LIMIT);
    smoothed.tilt = lerp(smoothed.tilt, keyboardDirection * 0.45, 0.2);
    if (!running) {
      moveState.textContent = keyboardDirection < 0 ? "dodge left" : "dodge right";
    }
  } else {
    keyboardDodgeX = lerp(keyboardDodgeX, 0, 0.22);
    if (!running) {
      smoothed.tilt = lerp(smoothed.tilt, 0, 0.08);
    }
  }

  if (timerText && roundDeadline && hasActiveEnemy && !document.body.classList.contains("view-start")) {
    const secondsLeft = Math.max(0, Math.ceil((roundDeadline - performance.now()) / 1000));
    timerText.textContent = String(secondsLeft);
    document.body.classList.toggle("timer-danger", secondsLeft <= 10);

    if (secondsLeft <= 0) {
      combo = 0;
      resetRoundTimer();
      updateGameHUD();
      flashScreen("hit");
      playWrong();
      showToast("\u6642\u9593\u8b66\u5831\uff01Combo \u91cd\u7f6e", "danger");
    }
  }

  if (avatar3D) {
    avatar3D.position.set(avatarPose.x, avatarPose.y + hop * 0.45, avatarPose.z);
    avatar3D.rotation.x = Math.sin(elapsed * 2.4) * 0.035;

    if (mascotMesh?.visible) {
      mascotMesh.rotation.z = -avatar3D.rotation.z * 0.35;
      mascotMesh.scale.setScalar(1 + smoothed.jump * 0.08 + Math.sin(elapsed * 3) * 0.018);
      mascotGlow.scale.setScalar(1 + smoothed.jump * 0.12 + Math.sin(elapsed * 3) * 0.035);
    }

    if (legacyRoot?.visible) {
      bodyParts.torso.scale.y = 1 + smoothed.jump * 0.06;
      bodyParts.chestCore.rotation.y += 0.04;
      bodyParts.antennaDot.scale.setScalar(1 + Math.sin(elapsed * 6) * 0.1);
    }
  }

  skillBeams = skillBeams.filter((beam) => {
    beam.userData.life -= 0.035 * dt * 60;
    if (beam.material) {
      beam.material.opacity = Math.max(0, beam.userData.life);
    }
    if (beam.isLight) {
      beam.intensity = Math.max(0, beam.userData.life) * 5;
    } else {
      beam.scale.setScalar(1 + (1 - beam.userData.life) * 0.8);
    }

    if (beam.userData.life <= 0) {
      scene.remove(beam);
      if (beam.geometry) {
        beam.geometry.dispose();
      }
      if (beam.material) {
        beam.material.dispose();
      }
      return false;
    }

    return true;
  });

  enemyMeshes.forEach((enemy, index) => {
    if (enemy.defeated) {
      enemy.slot.userData.defeat = Math.max(0, (enemy.slot.userData.defeat || 0) - 0.04);
      enemy.slot.scale.multiplyScalar(0.965);
      enemy.slot.position.y += 0.012;
      enemy.mesh.material.opacity = enemy.slot.userData.defeat;
      enemy.halo.material.opacity = enemy.slot.userData.defeat * 0.18;
      enemy.slot.visible = enemy.slot.userData.defeat > 0.03;
      return;
    }

    enemy.slot.position.y = WORLD.floorY + 1.18 + Math.sin(elapsed * 1.7 + index) * 0.08;
    enemy.slot.rotation.z = Math.sin(elapsed * 1.2 + index) * 0.04;
    enemy.platform.rotation.y += index === currentEnemyIndex ? 0.025 : 0.01;
  });

  updateEnemyProjectiles(elapsed, dt);
  updateStarPickup(elapsed);

  renderer.render(scene, camera3D);
  requestAnimationFrame(animateThree);
}

function predictFrame() {
  if (!running) return;

  if (video.currentTime !== lastVideoTime) {
    lastVideoTime = video.currentTime;
    if (landmarker) {
      const results = landmarker.detectForVideo(video, performance.now());
      const landmarks = results.landmarks?.[0];

      if (landmarks) {
        drawPose(landmarks);
        updateAvatar(landmarks);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        moveState.textContent = "searching";
      }
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      moveState.textContent = "camera only";
    }
    scanAnswerMarker();
  }

  setTimeout(predictFrame, 25);
}

startButton.addEventListener("click", startCamera);
window.addEventListener("resize", resizeCanvases);
window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
    keyboardInput.left = true;
  }
  if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
    keyboardInput.right = true;
  }
});
window.addEventListener("keyup", (event) => {
  if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
    keyboardInput.left = false;
  }
  if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
    keyboardInput.right = false;
  }
});
window.addEventListener("positive-hero-selected", (event) => {
  selectCharacter(event.detail);
});
goIntroButton.addEventListener("click", () => {
  startAmbientAudio();
  playSelectSound();
  setView("intro");
});
goSelectButton.addEventListener("click", () => {
  playSelectSound();
  setView("select");
});
confirmCharacterButton.addEventListener("click", () => {
  beginBattleSequence();
});
openQuestionButton.addEventListener("click", () => {
  playSelectSound();
  setView("question");
});
backToGameButton.addEventListener("click", () => setView("game"));
restartButton.addEventListener("click", () => {
  playSelectSound();
  resetGame();
});
window.addEventListener("keydown", (event) => {
  if (event.code === "Space" && skillReady && document.body.classList.contains("view-game")) {
    event.preventDefault();
    triggerSkill();
    return;
  }

  if (!document.body.classList.contains("view-question")) return;

  const key = event.key.toLowerCase();
  const answerIndex = ["a", "b", "c", "d"].indexOf(key);

  if (answerIndex >= 0) {
    answerQuestion(answerIndex);
  }
});
initThree();
startAmbientAudio();

if (window.selectedPositiveHero) {
  selectCharacter(window.selectedPositiveHero);
}
