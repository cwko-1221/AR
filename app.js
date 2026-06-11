import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js";

const video = document.querySelector("#webcam");
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
    ],
    correct: 0,
  },
  {
    text: "\u5982\u679c\u4eca\u5929\u5931\u6557\u4e86\uff0c\u4e0b\u4e00\u6b65\u53ef\u4ee5\u600e\u6a23\uff1f",
    answers: [
      "\u627e\u51fa\u53ef\u4ee5\u6539\u9032\u7684\u4e00\u9ede",
      "\u8a8d\u5b9a\u81ea\u5df1\u6c38\u9060\u505a\u4e0d\u5230",
      "\u628a\u60c5\u7dd2\u767c\u6d29\u5728\u5225\u4eba\u8eab\u4e0a",
    ],
    correct: 0,
  },
  {
    text: "\u770b\u898b\u540c\u5b78\u5e6b\u5fd9\u6642\uff0c\u54ea\u4e00\u53e5\u6700\u80fd\u8868\u9054\u611f\u6069\uff1f",
    answers: [
      "\u8b1d\u8b1d\u4f60\uff0c\u4f60\u7684\u5e6b\u5fd9\u5c0d\u6211\u5f88\u91cd\u8981",
      "\u9019\u662f\u4f60\u61c9\u8a72\u505a\u7684",
      "\u6211\u4e0d\u9700\u8981\u8aaa\u8b1d\u8b1d",
    ],
    correct: 0,
  },
  {
    text: "\u8a02\u7acb\u76ee\u6a19\u6642\uff0c\u54ea\u4e00\u500b\u505a\u6cd5\u6bd4\u8f03\u597d\uff1f",
    answers: [
      "\u5b9a\u4e00\u500b\u5177\u9ad4\u3001\u53ef\u884c\u7684\u5c0f\u6b65\u9a5f",
      "\u53ea\u8aaa\u300c\u6211\u8981\u8b8a\u5f97\u5f88\u5f37\u300d",
      "\u4e0d\u7528\u8a08\u5283\uff0c\u7b49\u5fc3\u60c5\u597d\u518d\u505a",
    ],
    correct: 0,
  },
  {
    text: "\u9047\u5230\u65b0\u6311\u6230\u6642\uff0c\u54ea\u500b\u60f3\u6cd5\u6700\u6709\u52a9\u6210\u9577\uff1f",
    answers: [
      "\u6211\u53ef\u4ee5\u5148\u5617\u8a66\uff0c\u518d\u5f9e\u7d93\u9a57\u4e2d\u5b78\u7fd2",
      "\u6211\u4e00\u5b9a\u505a\u4e0d\u5230",
      "\u53ea\u505a\u5df2\u7d93\u6703\u7684\u4e8b",
    ],
    correct: 0,
  },
];

const ENERGY_REQUIRED = 3;

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
  width: 7.2,
  height: 4.2,
  floorY: -1.35,
};

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
let avatarPose = { x: 0, y: WORLD.floorY + 0.9, z: 0.2 };
let selectedCharacter = null;
let textureLoader;
let mascotMesh;
let mascotGlow;
let legacyRoot;
let legacyAvatarParts = [];
let enemyGroup;
let enemyMeshes = [];
let skillBeams = [];
let currentEnemyIndex = 0;
let energy = 0;
let currentQuestionIndex = 0;
let skillReady = false;
let lastSkillAt = 0;

function setStatus(message) {
  statusText.textContent = message;
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
        color.rgb = pow(color.rgb, vec3(0.78)) * 1.32;
        color.rgb = mix(color.rgb, vec3(1.0), 0.08);
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

function updateMissionUI() {
  const enemy = ENEMIES[currentEnemyIndex];
  const question = QUESTIONS[currentQuestionIndex % QUESTIONS.length];

  enemyNameEl.textContent = enemy ? enemy.name : "\u5df2\u5b8c\u6210";
  energyText.textContent = `${energy} / ${ENERGY_REQUIRED}`;
  questionText.textContent = enemy
    ? question.text
    : "\u6240\u6709\u24618\u7269\u5df2\u88ab\u64ca\u6557\uff01\u4f60\u5df2\u5b8c\u6210\u6b63\u5411\u6311\u6230\u3002";
  document.body.classList.toggle("skill-ready", skillReady);

  energyBar.querySelectorAll("span").forEach((cell, index) => {
    cell.classList.toggle("is-filled", index < energy);
  });

  answerGrid.innerHTML = "";

  if (!enemy) {
    skillHint.textContent = "\u6311\u6230\u5b8c\u6210\uff01";
    return;
  }

  question.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = answer;
    button.addEventListener("click", () => answerQuestion(index));
    answerGrid.append(button);
  });

  skillHint.textContent = skillReady
    ? "\u80fd\u91cf\u5df2\u6eff\uff01\u5728\u93e1\u982d\u524d\u96d9\u624b\u8209\u9ad8\uff0c\u91cb\u653e\u6b63\u5411\u6280\u80fd\u3002"
    : "\u7b54\u5c0d\u984c\u76ee\u5132\u80fd\uff0c\u6eff\u80fd\u91cf\u5f8c\u96d9\u624b\u8209\u9ad8\u91cb\u653e\u6280\u80fd\u3002";
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
    setStatus("\u7b54\u5c0d\u4e86\uff01\u80fd\u91cf\u4e0a\u5347\u3002");
  } else {
    setStatus("\u518d\u60f3\u4e00\u60f3\uff1a\u6b63\u5411\u505a\u6cd5\u901a\u5e38\u6703\u5305\u542b\u8046\u807d\u3001\u5617\u8a66\u548c\u611f\u6069\u3002");
  }

  currentQuestionIndex += 1;
  window.setTimeout(updateMissionUI, 850);
}

function selectCharacter(character) {
  selectedCharacter = character;
  previewMascot.src = character.image;
  startButton.disabled = false;
  startButton.textContent = "\u958b\u59cb\u904a\u6232";
  document.body.classList.add("has-character");
  setStatus(`${character.name} ready. Press Start camera, then move your body to collect light cores.`);

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
      opacity: 0.22,
      depthWrite: false,
    }),
  );
  mascotMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1.85, 1.85),
    new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 }),
  );
  mascotGlow.position.set(0, 0.1, -0.04);
  mascotMesh.position.set(0, 0.1, 0.05);
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

function createEnemyLine() {
  const group = new THREE.Group();

  ENEMIES.forEach((enemy, index) => {
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1.15, 1.15),
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 }),
    );
    const halo = new THREE.Mesh(
      new THREE.CircleGeometry(0.72, 40),
      new THREE.MeshBasicMaterial({
        color: 0xff6b6b,
        transparent: true,
        opacity: 0.12,
        depthWrite: false,
      }),
    );
    const slot = new THREE.Group();

    mesh.position.z = 0.04;
    halo.position.z = 0;
    slot.position.set(enemy.x, WORLD.floorY + 1.15, -2.15);
    slot.scale.setScalar(index === currentEnemyIndex ? 1.22 : 0.82);
    slot.add(halo, mesh);
    group.add(slot);
    enemyMeshes.push({ slot, mesh, halo, defeated: false });

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

function refreshEnemies() {
  enemyMeshes.forEach((enemy, index) => {
    const isCurrent = index === currentEnemyIndex && !enemy.defeated;
    enemy.slot.visible = !enemy.defeated;
    enemy.slot.scale.setScalar(isCurrent ? 1.22 : 0.82);
    enemy.halo.material.opacity = isCurrent ? 0.24 : 0.08;
  });
}

function triggerSkill() {
  const enemy = enemyMeshes[currentEnemyIndex];

  if (!skillReady || !enemy || enemy.defeated || performance.now() - lastSkillAt < 1200) return;

  lastSkillAt = performance.now();
  createSkillBeam(enemy.slot);
  enemy.defeated = true;
  enemy.slot.userData.defeat = 1;
  energy = 0;
  skillReady = false;
  score += 5;
  scoreEl.textContent = String(score);
  setStatus("\u6b63\u5411\u6280\u80fd\u767c\u52d5\uff01\u64ca\u6557\u4e86\u7576\u524d\u24618\u7269\u3002");

  window.setTimeout(() => {
    currentEnemyIndex += 1;
    refreshEnemies();
    updateMissionUI();
  }, 650);
}

function createFloor() {
  const grid = new THREE.GridHelper(9, 18, 0x6effb6, 0x24443a);
  grid.position.y = WORLD.floorY;
  grid.material.transparent = true;
  grid.material.opacity = 0.34;

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(12, 7),
    new THREE.ShadowMaterial({ color: 0x000000, opacity: 0.32 }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = WORLD.floorY - 0.02;
  floor.receiveShadow = true;

  return { grid, floor };
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
    new THREE.PlaneGeometry(7.2, 3.6),
    new THREE.MeshBasicMaterial({
      color: 0x123b35,
      transparent: true,
      opacity: 0.16,
      side: THREE.DoubleSide,
    }),
  );
  const outerRing = new THREE.Mesh(new THREE.TorusGeometry(2.6, 0.015, 10, 96), ringMaterial);
  const innerRing = new THREE.Mesh(new THREE.TorusGeometry(1.55, 0.012, 10, 96), goldMaterial);
  const leftPillar = new THREE.Mesh(new THREE.BoxGeometry(0.16, 2.4, 0.16), ringMaterial);
  const rightPillar = leftPillar.clone();
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

  backPanel.position.set(0, 0.38, -3.35);
  outerRing.position.set(0, 0.38, -3.25);
  innerRing.position.set(0, 0.38, -3.2);
  leftPillar.position.set(-3.4, 0, -2.55);
  rightPillar.position.set(3.4, 0, -2.55);
  leftPillar.rotation.z = -0.12;
  rightPillar.rotation.z = 0.12;

  group.add(backPanel, outerRing, innerRing, leftPillar, rightPillar, particles);

  return { group, outerRing, innerRing, leftPillar, rightPillar, particles };
}

function initThree() {
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x07100d, 6, 14);
  textureLoader = new THREE.TextureLoader();

  camera3D = new THREE.PerspectiveCamera(43, 1, 0.1, 100);
  camera3D.position.set(0, 1.2, 7.6);
  camera3D.lookAt(0, 0.1, 0);

  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    canvas: threeCanvas,
  });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const hemisphere = new THREE.HemisphereLight(0xcaf7ff, 0x103829, 1.9);
  const key = new THREE.DirectionalLight(0xffffff, 2.4);
  key.position.set(-2.4, 4.2, 4.5);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);

  const floor = createFloor();
  arena = createArena();
  const avatar = createAvatar();
  enemyGroup = createEnemyLine();
  target3D = createTarget();
  avatar3D = avatar.root;
  bodyParts = avatar.parts;

  scene.add(hemisphere, key, arena.group, enemyGroup, floor.grid, floor.floor, avatar3D, target3D);
  moveTarget();
  refreshEnemies();
  updateMissionUI();
  clock = new THREE.Clock();
  resizeCanvases();
  document.body.classList.add("webgl-ready");
  animateThree();
}

function resizeCanvases() {
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
  setStatus("Loading pose tracking model...");
  const { DrawingUtils, FilesetResolver, PoseLandmarker, wasmUrl } = await loadVisionTasks();
  const fileset = await FilesetResolver.forVisionTasks(wasmUrl);

  landmarker = await PoseLandmarker.createFromOptions(fileset, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task",
      delegate: "GPU",
    },
    runningMode: "VIDEO",
    numPoses: 1,
    minPoseDetectionConfidence: 0.5,
    minPosePresenceConfidence: 0.5,
    minTrackingConfidence: 0.5,
  });

  drawingUtils = new DrawingUtils(ctx);
}

async function startCamera() {
  if (!selectedCharacter) {
    setStatus("Please choose one Positive Hero before starting the camera.");
    return;
  }

  startButton.disabled = true;

  try {
    if (!landmarker) {
      await createLandmarker();
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "user",
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
      audio: false,
    });

    video.srcObject = stream;
    await video.play();
    running = true;
    document.body.classList.add("is-playing");
    startButton.textContent = "\u904a\u6232\u9032\u884c\u4e2d";
    resizeCanvases();
    setStatus(`${selectedCharacter.name} is in play. Move left or right to steer, and raise either hand to jump.`);
    requestAnimationFrame(predictFrame);
  } catch (error) {
    console.error(error);
    setStatus("Could not start webcam. Allow camera permission and open this page from localhost or HTTPS.");
    startButton.disabled = !selectedCharacter;
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

  smoothed.x = lerp(smoothed.x, 1 - bodyCenter.x, 0.22);
  smoothed.y = lerp(smoothed.y, bodyCenter.y + (handRaised ? -0.12 : 0.07), 0.18);
  smoothed.tilt = lerp(smoothed.tilt, shoulderTilt, 0.2);
  smoothed.jump = lerp(smoothed.jump, handRaised ? 1 : 0, 0.26);

  const world = normalizedToWorld(smoothed);
  avatar3D.position.x = clamp(world.x, -3.15, 3.15);
  avatarPose = {
    x: avatar3D.position.x,
    y: WORLD.floorY + 0.9 + clamp(world.y, -0.25, 1.05),
    z: 0.1 + Math.abs(smoothed.tilt) * 0.7,
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

  if (bothHandsRaised && skillReady) {
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

  checkTargetHit();
}

function moveTarget() {
  targetPoint = {
    x: 0.16 + Math.random() * 0.68,
    y: 0.25 + Math.random() * 0.38,
  };
  const world = normalizedToWorld(targetPoint);
  target3D.position.set(world.x, WORLD.floorY + 1.1 + world.y, -0.25);
  targetPulse = 1;
  targetActive = true;
}

function checkTargetHit() {
  if (!targetActive) return;

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
  ctx.save();
  ctx.scale(-1, 1);
  ctx.translate(-canvas.clientWidth, 0);

  drawingUtils.drawConnectors(landmarks, POSE_CONNECTIONS, {
    color: "rgba(110, 255, 182, 0.86)",
    lineWidth: 4,
  });
  drawingUtils.drawLandmarks(landmarks, {
    color: "#ffd166",
    radius: 4,
  });
  ctx.restore();
}

function animateThree() {
  const elapsed = clock.getElapsedTime();
  const jumpArc = Math.max(0, 1 - (performance.now() - lastJumpAt) / 520);
  const hop = Math.sin(jumpArc * Math.PI) * 0.45;

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

  if (target3D) {
    target3D.rotation.y += 0.018;
    target3D.rotation.x = Math.sin(elapsed * 1.8) * 0.32;
    targetPulse = lerp(targetPulse, 1, 0.08);
    target3D.scale.setScalar(1 + Math.sin(elapsed * 5) * 0.05 + targetPulse * 0.06);
  }

  skillBeams = skillBeams.filter((beam) => {
    beam.userData.life -= 0.035;
    beam.material.opacity = Math.max(0, beam.userData.life);
    beam.scale.setScalar(1 + (1 - beam.userData.life) * 0.8);

    if (beam.userData.life <= 0) {
      scene.remove(beam);
      beam.geometry.dispose();
      beam.material.dispose();
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

    enemy.slot.position.y = WORLD.floorY + 1.15 + Math.sin(elapsed * 1.7 + index) * 0.08;
    enemy.slot.rotation.z = Math.sin(elapsed * 1.2 + index) * 0.04;
  });

  if (arena) {
    arena.outerRing.rotation.z += 0.0025;
    arena.innerRing.rotation.z -= 0.0035;
    arena.particles.rotation.y += 0.0008;
    arena.leftPillar.material.opacity = 0.22 + Math.sin(elapsed * 2.2) * 0.08;
    arena.rightPillar.material.opacity = 0.22 + Math.cos(elapsed * 2.2) * 0.08;
  }

  renderer.render(scene, camera3D);
  requestAnimationFrame(animateThree);
}

function predictFrame() {
  if (!running) return;

  if (video.currentTime !== lastVideoTime) {
    lastVideoTime = video.currentTime;
    const results = landmarker.detectForVideo(video, performance.now());
    const landmarks = results.landmarks?.[0];

    if (landmarks) {
      drawPose(landmarks);
      updateAvatar(landmarks);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      moveState.textContent = "searching";
    }
  }

  requestAnimationFrame(predictFrame);
}

startButton.addEventListener("click", startCamera);
window.addEventListener("resize", resizeCanvases);
window.addEventListener("positive-hero-selected", (event) => {
  selectCharacter(event.detail);
});
initThree();

if (window.selectedPositiveHero) {
  selectCharacter(window.selectedPositiveHero);
}
