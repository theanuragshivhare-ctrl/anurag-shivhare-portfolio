import * as THREE from "three";

const $ = (selector) => document.querySelector(selector);
const sceneRoot = $("#scene");
const gameShell = $(".game-shell");
const hud = $("#hud");
const startScreen = $("#start-screen");
const pauseScreen = $("#pause-screen");
const gameOverScreen = $("#game-over-screen");
const highScoreKey = "metro-rush-2-high-score";
const colors = { acid: 0xd7fa70, cyan: 0x78e9f4, orange: 0xff805b, purple: 0x9f8aff };
const laneXs = [-2.1, 0, 2.1];
const state = {
  mode: "ready", lane: 1, distance: 0, coins: 0, score: 0, speed: 19,
  elapsed: 0, spawnTimer: 1.6, jumpTime: 0, slideTime: 0, hitCooldown: 0,
  power: null, powerTime: 0, shield: false, multiplier: 1, magnet: false,
  boostTime: 0, shakeTime: 0, audio: true, lastFrame: 0, runStart: 0
};

let bestScore = readBestScore();
let renderer;
let camera;
let world;
let player;
let playerParts;
let playerTrail;
let roadParts = [];
let buildings = [];
let entities = [];
let particles = [];
let skyStars;
let entityId = 0;
let audioContext;
let toastTimer;
let cameraBaseX = 0;
const skyBase = new THREE.Color(0x10192b);
const skyLate = new THREE.Color(0x291b35);

function readBestScore() {
  try {
    const score = Number(localStorage.getItem(highScoreKey));
    return Number.isSafeInteger(score) && score >= 0 ? score : 0;
  } catch (error) {
    console.warn("Metro Rush could not read the personal best.", error);
    return 0;
  }
}

function saveBestScore(score) {
  try {
    localStorage.setItem(highScoreKey, String(score));
    return true;
  } catch (error) {
    console.warn("Metro Rush could not save the personal best.", error);
    showToast("PERSONAL BEST COULD NOT BE SAVED");
    return false;
  }
}

function initScene() {
  try {
    renderer = new THREE.WebGLRenderer({ antialias: window.devicePixelRatio < 2, alpha: false, powerPreference: "high-performance" });
  } catch (error) {
    sceneRoot.innerHTML = '<p class="webgl-error">This browser could not start the 3D renderer. Try enabling WebGL or using a newer browser.</p>';
    console.error("Metro Rush could not initialize WebGL.", error);
    return false;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.65));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = false;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  sceneRoot.appendChild(renderer.domElement);

  world = new THREE.Scene();
  world.background = new THREE.Color(0x10192b);
  world.fog = new THREE.FogExp2(0x10192b, 0.013);
  camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 180);
  camera.position.set(0, 5.1, 12);
  camera.lookAt(0, 1.05, -8);
  cameraBaseX = camera.position.x;

  world.add(new THREE.HemisphereLight(0x9cc8ff, 0x1c172a, 2.1));
  const moon = new THREE.DirectionalLight(0xc9dcff, 2.7);
  moon.position.set(-7, 13, 2);
  world.add(moon);
  const neonFill = new THREE.PointLight(0x57ddf2, 70, 29, 2);
  neonFill.position.set(5, 4, -18);
  world.add(neonFill);
  const warmFill = new THREE.PointLight(0xff713e, 55, 30, 2);
  warmFill.position.set(-6, 3, -30);
  world.add(warmFill);

  createEnvironment();
  player = createRunner();
  world.add(player.group);
  createStars();
  bindEvents();
  updateBest();
  window.addEventListener("resize", resize, { passive: true });
  renderer.setAnimationLoop(frame);
  return true;
}

function material(color, roughness = 0.68, metalness = 0.1, emissive = 0, emissiveIntensity = 0.5) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness, emissive, emissiveIntensity });
}

function box(width, height, depth, mat, x = 0, y = 0, z = 0) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), mat);
  mesh.position.set(x, y, z);
  mesh.castShadow = false;
  mesh.receiveShadow = false;
  return mesh;
}

function createEnvironment() {
  const groundMat = material(0x121a28, 0.92, 0.05);
  const trackMat = material(0x252e3d, 0.7, 0.22);
  const railMat = material(0x93a5b2, 0.28, 0.82);
  const glowMat = new THREE.MeshBasicMaterial({ color: colors.cyan });
  const sleeperMat = material(0x343847, 0.85, 0.13);
  world.add(box(24, 0.5, 130, groundMat, 0, -0.63, -50));
  world.add(box(7.8, 0.22, 126, trackMat, 0, -0.31, -50));
  for (const x of [-3.12, -1.06, 1.06, 3.12]) {
    const rail = box(0.07, 0.12, 124, railMat, x, -0.12, -50);
    world.add(rail);
  }
  for (let index = 0; index < 32; index += 1) {
    const group = new THREE.Group();
    group.position.z = 12 - index * 4;
    group.add(box(7.1, 0.08, 0.28, sleeperMat, 0, -0.13, 0));
    for (const x of [-2.8, 0, 2.8]) group.add(box(0.028, 0.013, 0.018, glowMat, x, -0.075, 0));
    world.add(group);
    roadParts.push(group);
  }
  for (const x of [-4.2, 4.2]) {
    const railGlow = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.045, 118), glowMat);
    railGlow.position.set(x, -0.04, -50);
    world.add(railGlow);
  }

  const tunnelMat = material(0x1b2533, 0.8, 0.1);
  const tunnelGlow = material(0x31506a, 0.32, 0.48, 0x173343, 1.7);
  for (let segment = 0; segment < 4; segment += 1) {
    const z = -22 - segment * 29;
    const tunnel = new THREE.Group();
    tunnel.position.z = z;
    const arch = new THREE.Mesh(new THREE.TorusGeometry(6.1, 0.28, 6, 20, Math.PI), tunnelMat);
    arch.position.y = 0.5;
    tunnel.add(arch);
    tunnel.add(box(0.4, 5.6, 0.5, tunnelMat, -5.8, 1.3, 0));
    tunnel.add(box(0.4, 5.6, 0.5, tunnelMat, 5.8, 1.3, 0));
    for (const x of [-4.9, 4.9]) tunnel.add(box(0.06, 0.08, 0.25, tunnelGlow, x, 3.7, 0));
    world.add(tunnel);
    buildings.push({ group: tunnel, speed: 1, resetZ: -138, startZ: -22 });
  }

  const bridgeFrame = material(0x273449, 0.46, 0.53);
  const bridgeRail = material(0x526b7a, 0.34, 0.67);
  const bridgeLight = new THREE.MeshBasicMaterial({ color: colors.acid });
  for (const z of [-43, -100]) {
    const bridge = new THREE.Group();
    bridge.position.z = z;
    bridge.add(box(15.5, 0.48, 1.15, bridgeFrame, 0, 5.45, 0));
    bridge.add(box(15.7, 0.11, 0.13, bridgeRail, 0, 5.76, 0.42));
    bridge.add(box(15.7, 0.045, 0.08, bridgeLight, 0, 5.15, 0.54));
    for (const side of [-1, 1]) {
      bridge.add(box(0.34, 2.8, 0.46, bridgeFrame, side * 6.1, 3.85, 0));
      bridge.add(box(1.05, 0.16, 0.6, bridgeRail, side * 6.1, 5.17, 0));
    }
    world.add(bridge);
    buildings.push({ group: bridge, speed: 1, resetZ: -100, startZ: z });
  }

  const buildingMats = [0x20283a, 0x192235, 0x25243a, 0x1a2b38].map((color) => material(color, 0.83, 0.15));
  const windowMats = [0xffcb70, 0x70d9e8, 0xaba0ff].map((color) => new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.67 }));
  for (const side of [-1, 1]) {
    for (let index = 0; index < 13; index += 1) {
      const height = 5 + Math.random() * 13;
      const width = 3 + Math.random() * 3;
      const depth = 5 + Math.random() * 7;
      const group = new THREE.Group();
      group.position.set(side * (8 + Math.random() * 4), height / 2 - 0.2, -index * 10 - 3);
      group.add(box(width, height, depth, buildingMats[(index + (side === 1 ? 1 : 0)) % buildingMats.length]));
      const rows = Math.min(7, Math.floor(height / 1.5));
      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < 2; column += 1) {
          if (Math.random() > 0.35) {
            const windowMesh = box(0.11, 0.32, 0.045, windowMats[Math.floor(Math.random() * windowMats.length)], (column - 0.5) * width * 0.48, -height * 0.38 + row * 1.12, depth / 2 + 0.03);
            group.add(windowMesh);
          }
        }
      }
      world.add(group);
      buildings.push({ group, speed: 1, resetZ: -135, startZ: group.position.z });
    }
  }

  for (const side of [-1, 1]) {
    for (let index = 0; index < 8; index += 1) {
      const pole = new THREE.Group();
      pole.position.set(side * 5.7, 0, -index * 15 - 6);
      pole.add(box(0.12, 4, 0.12, tunnelMat, 0, 1.85, 0));
      pole.add(box(0.75, 0.07, 0.07, tunnelGlow, -side * 0.28, 3.7, 0));
      world.add(pole);
      buildings.push({ group: pole, speed: 1, resetZ: -135, startZ: pole.position.z });
    }
  }
}

function createStars() {
  const starGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(450 * 3);
  for (let i = 0; i < 450; i += 1) {
    positions[i * 3] = (Math.random() - 0.5) * 110;
    positions[i * 3 + 1] = 7 + Math.random() * 32;
    positions[i * 3 + 2] = -10 - Math.random() * 120;
  }
  starGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  skyStars = new THREE.Points(starGeometry, new THREE.PointsMaterial({ color: 0xa2c8fa, size: 0.14, transparent: true, opacity: 0.52, sizeAttenuation: true }));
  world.add(skyStars);
}

function createRunner() {
  const group = new THREE.Group();
  const body = new THREE.Group();
  group.add(body);
  const jacket = material(0x263e53, 0.42, 0.3);
  const jacketBright = material(colors.cyan, 0.3, 0.33, 0x176176, 1.1);
  const dark = material(0x17202c, 0.53, 0.3);
  const skin = material(0xd7a287, 0.72, 0.05);
  const helmet = material(0x253546, 0.24, 0.57);
  const pants = material(0x263343, 0.62, 0.13);
  const shoe = material(0xebf3dd, 0.42, 0.22);
  const torso = box(0.66, 0.78, 0.43, jacket, 0, 1.23, 0);
  body.add(torso);
  body.add(box(0.42, 0.1, 0.45, jacketBright, 0, 0.94, 0));
  body.add(box(0.49, 0.5, 0.27, dark, 0, 1.18, -0.32));
  body.add(box(0.1, 0.65, 0.45, jacketBright, 0.24, 1.24, 0.01));
  body.add(box(0.48, 0.46, 0.48, skin, 0, 1.92, 0));
  body.add(box(0.53, 0.28, 0.53, helmet, 0, 2.13, 0));
  body.add(box(0.48, 0.08, 0.12, jacketBright, 0, 2.05, 0.27));
  body.add(box(0.31, 0.11, 0.08, material(0x10212b, 0.25, 0.5), 0, 1.91, 0.25));
  body.add(box(0.1, 0.48, 0.1, jacket, -0.4, 1.25, 0));
  body.add(box(0.1, 0.48, 0.1, jacket, 0.4, 1.25, 0));

  const leftLeg = new THREE.Group();
  const rightLeg = new THREE.Group();
  leftLeg.position.set(-0.18, 0.88, 0);
  rightLeg.position.set(0.18, 0.88, 0);
  for (const leg of [leftLeg, rightLeg]) {
    leg.add(box(0.22, 0.57, 0.25, pants, 0, -0.27, 0));
    leg.add(box(0.25, 0.14, 0.42, shoe, 0, -0.57, 0.07));
    group.add(leg);
  }
  const leftArm = new THREE.Group();
  const rightArm = new THREE.Group();
  leftArm.position.set(-0.42, 1.55, 0);
  rightArm.position.set(0.42, 1.55, 0);
  for (const arm of [leftArm, rightArm]) {
    arm.add(box(0.15, 0.51, 0.16, jacket, 0, -0.22, 0));
    arm.add(box(0.16, 0.13, 0.16, skin, 0, -0.5, 0));
    body.add(arm);
  }
  const pack = box(0.5, 0.53, 0.24, material(0x172936, 0.46, 0.5), 0, 1.37, -0.34);
  body.add(pack);
  body.add(box(0.4, 0.075, 0.08, jacketBright, 0, 1.45, -0.48));
  const trail = new THREE.Mesh(new THREE.TorusGeometry(0.54, 0.025, 6, 40), new THREE.MeshBasicMaterial({ color: colors.cyan, transparent: true, opacity: 0.65 }));
  trail.rotation.x = Math.PI / 2;
  trail.position.y = 0.07;
  group.add(trail);
  return { group, body, leftLeg, rightLeg, leftArm, rightArm, trail };
}

function bindEvents() {
  $("#start-button").addEventListener("click", startRun);
  $("#restart-button").addEventListener("click", startRun);
  $("#pause-restart-button").addEventListener("click", startRun);
  $("#resume-button").addEventListener("click", resumeRun);
  $("#pause-button").addEventListener("click", togglePause);
  $("#sound-button").addEventListener("click", toggleSound);
  window.addEventListener("keydown", onKeyDown);
  let touchStart = null;
  window.addEventListener("touchstart", (event) => {
    if (event.touches.length !== 1) return;
    touchStart = { x: event.touches[0].clientX, y: event.touches[0].clientY, at: performance.now() };
  }, { passive: true });
  window.addEventListener("touchend", (event) => {
    if (!touchStart || state.mode !== "running" || event.changedTouches.length !== 1) {
      touchStart = null;
      return;
    }
    const dx = event.changedTouches[0].clientX - touchStart.x;
    const dy = event.changedTouches[0].clientY - touchStart.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) > 30) {
      if (Math.abs(dx) > Math.abs(dy)) changeLane(dx < 0 ? -1 : 1);
      else if (dy < 0) jump();
      else slide();
    }
    touchStart = null;
  }, { passive: true });
}

function onKeyDown(event) {
  const key = event.key.toLowerCase();
  if (["arrowleft", "arrowright", "arrowup", "arrowdown", " "].includes(key)) event.preventDefault();
  if (key === "p" || key === "escape") {
    if (state.mode === "running") pauseRun();
    else if (state.mode === "paused") resumeRun();
    return;
  }
  if (state.mode === "ready" && (key === "enter" || key === " ")) {
    startRun();
    return;
  }
  if (state.mode === "over" && (key === "enter" || key === " ")) {
    startRun();
    return;
  }
  if (state.mode !== "running" || event.repeat) return;
  if (key === "a" || key === "arrowleft") changeLane(-1);
  else if (key === "d" || key === "arrowright") changeLane(1);
  else if (key === " " || key === "arrowup" || key === "w") jump();
  else if (key === "arrowdown" || key === "s") slide();
}

function startRun() {
  clearEntities();
  Object.assign(state, {
    mode: "running", lane: 1, distance: 0, coins: 0, score: 0, speed: 19,
    elapsed: 0, spawnTimer: 1.25, jumpTime: 0, slideTime: 0, hitCooldown: 0,
    power: null, powerTime: 0, shield: false, multiplier: 1, magnet: false, boostTime: 0,
    shakeTime: 0, runStart: performance.now()
  });
  player.group.position.set(0, 0, 3);
  player.group.scale.set(1, 1, 1);
  player.body.scale.set(1, 1, 1);
  player.body.position.y = 0;
  hud.hidden = false;
  $("#powerup-display").hidden = true;
  startScreen.classList.add("overlay-hidden");
  pauseScreen.classList.add("overlay-hidden");
  pauseScreen.setAttribute("aria-hidden", "true");
  gameOverScreen.classList.add("overlay-hidden");
  gameOverScreen.setAttribute("aria-hidden", "true");
  $("#pause-button").setAttribute("aria-label", "Pause game");
  updateHUD();
  ensureAudio();
  tone(392, 0.09, "sine", 0.04);
}

function pauseRun() {
  if (state.mode !== "running") return;
  state.mode = "paused";
  pauseScreen.classList.remove("overlay-hidden");
  pauseScreen.setAttribute("aria-hidden", "false");
  $("#pause-button").setAttribute("aria-label", "Resume game");
}

function resumeRun() {
  if (state.mode !== "paused") return;
  state.mode = "running";
  state.lastFrame = performance.now();
  pauseScreen.classList.add("overlay-hidden");
  pauseScreen.setAttribute("aria-hidden", "true");
  $("#pause-button").setAttribute("aria-label", "Pause game");
}

function togglePause() {
  if (state.mode === "running") pauseRun();
  else if (state.mode === "paused") resumeRun();
}

function toggleSound() {
  state.audio = !state.audio;
  $("#sound-icon").textContent = state.audio ? "♪" : "∅";
  $("#sound-button").setAttribute("aria-label", state.audio ? "Turn sound off" : "Turn sound on");
  if (state.audio) {
    ensureAudio();
    tone(660, 0.08, "sine", 0.035);
  }
}

function changeLane(direction) {
  state.lane = THREE.MathUtils.clamp(state.lane + direction, 0, 2);
  tone(230 + state.lane * 55, 0.055, "triangle", 0.018);
}

function jump() {
  if (state.jumpTime > 0 || state.slideTime > 0) return;
  state.jumpTime = 0.78;
  tone(510, 0.11, "triangle", 0.045);
}

function slide() {
  if (state.slideTime > 0) return;
  state.slideTime = 0.68;
}

function spawnEntity(type, lane, z, metadata = {}) {
  const group = new THREE.Group();
  group.position.set(laneXs[lane], 0, z);
  group.userData.id = entityId++;
  group.userData.type = type;
  group.userData.lane = lane;
  group.userData.collected = false;
  if (type === "coin") {
    const coinMaterial = new THREE.MeshStandardMaterial({ color: colors.acid, emissive: 0xb6df40, emissiveIntensity: 2.2, metalness: 0.78, roughness: 0.22 });
    const coin = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.075, 8, 18), coinMaterial);
    coin.position.y = metadata.high ? 1.7 : 0.86;
    group.add(coin);
    const glint = new THREE.Mesh(new THREE.SphereGeometry(0.055, 6, 6), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    glint.position.set(0.03, coin.position.y, 0.06);
    group.add(glint);
    group.userData.high = Boolean(metadata.high);
  } else if (type === "barrier") {
    const barrier = material(0xff785b, 0.42, 0.2, 0x68251d, 1.15);
    group.add(box(1.25, 0.66, 0.48, barrier, 0, 0.38, 0));
    group.add(box(1.35, 0.13, 0.53, material(0xffdfb0, 0.33, 0.18), 0, 0.55, 0));
    for (const x of [-0.47, 0.47]) group.add(box(0.12, 0.83, 0.13, darkMaterial(), x, 0.38, 0.05));
  } else if (type === "sign") {
    const signMat = material(0x9f8aff, 0.35, 0.22, 0x51428a, 1.2);
    group.add(box(1.45, 0.3, 0.35, signMat, 0, 1.95, 0));
    group.add(box(0.09, 0.07, 0.42, material(0xe8e3ff, 0.3, 0.2, 0x7663d0, 1.4), 0, 1.95, 0.05));
    for (const x of [-0.58, 0.58]) group.add(box(0.1, 1.78, 0.11, darkMaterial(), x, 0.94, 0));
  } else if (type === "train") {
    const trainMat = material(0x273c50, 0.36, 0.44);
    group.add(box(1.7, 2.35, 3.2, trainMat, 0, 1.2, 0));
    group.add(box(1.73, 0.26, 3.22, material(0x78e9f4, 0.32, 0.32, 0x31bdd0, 1.7), 0, 2.15, 0));
    group.add(box(1.27, 0.68, 0.05, material(0x162d3e, 0.17, 0.5), 0, 1.5, 1.63));
    for (const x of [-0.56, 0.56]) group.add(box(0.23, 0.12, 0.06, material(0xf5f8d7, 0.25, 0.15, 0xd6fa6c, 2), x, 0.34, 1.64));
    for (const side of [-1, 1]) {
      for (const offset of [-0.5, 0.45]) group.add(box(0.04, 0.44, 0.04, material(0x82dbea, 0.26, 0.2, 0x3ca8c0, 0.9), side * 0.86, 1.6, offset));
    }
    group.userData.length = 3.2;
  } else if (type === "hazard") {
    const hazardMat = material(0xff6b51, 0.4, 0.2, 0x622016, 1.3);
    group.add(box(1.35, 0.16, 0.52, hazardMat, 0, 0.13, 0));
    for (let index = 0; index < 4; index += 1) {
      const spike = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.32, 4), hazardMat);
      spike.position.set(-0.48 + index * 0.32, 0.36, 0);
      group.add(spike);
    }
  } else if (type === "power") {
    const powerColor = metadata.power === "shield" ? colors.cyan : metadata.power === "boost" ? colors.orange : metadata.power === "multiplier" ? colors.purple : colors.acid;
    const outerMat = new THREE.MeshStandardMaterial({ color: powerColor, emissive: powerColor, emissiveIntensity: 1.55, metalness: 0.48, roughness: 0.24 });
    const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.45, 0), outerMat);
    gem.position.y = 1.12;
    group.add(gem);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.64, 0.025, 6, 24), new THREE.MeshBasicMaterial({ color: powerColor, transparent: true, opacity: 0.75 }));
    ring.position.y = 1.12;
    group.add(ring);
    group.userData.power = metadata.power;
  }
  world.add(group);
  entities.push(group);
}

function darkMaterial() {
  return material(0x182534, 0.52, 0.28);
}

function spawnPattern() {
  const difficulty = Math.min(state.distance / 1700, 1);
  const available = [0, 1, 2];
  const blocked = Math.random() < 0.13 + difficulty * 0.13 ? Math.floor(Math.random() * 3) : -1;
  const safeLane = blocked === -1 ? Math.floor(Math.random() * 3) : (blocked + 1 + Math.floor(Math.random() * 2)) % 3;
  if (blocked !== -1) {
    const obstacle = Math.random() < 0.35 ? "train" : Math.random() < 0.5 ? "sign" : "barrier";
    spawnEntity(obstacle, blocked, -94);
  } else {
    const obstacleLane = available.filter((lane) => lane !== safeLane)[Math.floor(Math.random() * 2)];
    const obstacle = Math.random() < 0.18 + difficulty * 0.2 ? "train" : Math.random() < 0.46 ? "sign" : Math.random() < 0.68 ? "hazard" : "barrier";
    spawnEntity(obstacle, obstacleLane, -94);
  }

  if (Math.random() < 0.46) {
    const rowLane = Math.random() < 0.68 ? safeLane : Math.floor(Math.random() * 3);
    const high = Math.random() < 0.15;
    for (let index = 0; index < 5; index += 1) spawnEntity("coin", rowLane, -83 - index * 3.2, { high });
  } else if (Math.random() < 0.17) {
    for (const lane of [0, 1, 2]) {
      if (lane !== blocked) spawnEntity("coin", lane, -83);
    }
  }

  if (state.distance > 90 && Math.random() < 0.09) {
    const powerTypes = ["magnet", "boost", "shield", "multiplier"];
    spawnEntity("power", safeLane, -110, { power: powerTypes[Math.floor(Math.random() * powerTypes.length)] });
  }
}

function collectCoin(entity) {
  if (entity.userData.collected) return;
  entity.userData.collected = true;
  state.coins += 1;
  state.score += 30 * state.multiplier;
  makeBurst(entity.position.clone().add(new THREE.Vector3(0, 0.9, 0)), colors.acid, 7);
  tone(750 + Math.random() * 230, 0.075, "sine", 0.036);
  updateHUD();
}

function collectPower(entity) {
  const type = entity.userData.power;
  state.power = type;
  state.powerTime = type === "boost" ? 3.3 : type === "shield" ? 10 : 8;
  state.magnet = type === "magnet";
  state.multiplier = type === "multiplier" ? 2 : 1;
  state.shield = type === "shield";
  state.boostTime = type === "boost" ? 3.3 : 0;
  const labels = { magnet: ["COIN MAGNET", "✦"], boost: ["SPEED BOOST", "↗"], shield: ["NEON SHIELD", "⬡"], multiplier: ["2× MULTIPLIER", "×2"] };
  $("#power-name").textContent = labels[type][0];
  $("#power-icon").textContent = labels[type][1];
  $("#power-meter").style.transform = "scaleX(1)";
  $("#powerup-display").hidden = false;
  makeBurst(entity.position.clone().add(new THREE.Vector3(0, 1.1, 0)), type === "shield" ? colors.cyan : type === "boost" ? colors.orange : type === "multiplier" ? colors.purple : colors.acid, 14);
  showToast(labels[type][0] + " ACTIVE");
  tone(570, 0.11, "sine", 0.05);
  window.setTimeout(() => tone(850, 0.16, "sine", 0.04), 75);
}

function makeBurst(position, color, count) {
  const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 1 });
  const geometry = new THREE.SphereGeometry(0.055, 5, 5);
  const resources = { material: mat, geometry, remaining: count };
  for (let index = 0; index < count; index += 1) {
    const mesh = new THREE.Mesh(geometry, mat);
    mesh.position.copy(position);
    const angle = Math.random() * Math.PI * 2;
    const speed = 1.2 + Math.random() * 4;
    mesh.userData.velocity = new THREE.Vector3(Math.cos(angle) * speed, 1 + Math.random() * 4, Math.sin(angle) * speed);
    mesh.userData.life = 0.34 + Math.random() * 0.38;
    mesh.userData.resources = resources;
    world.add(mesh);
    particles.push(mesh);
  }
}

function disposeEntity(entity) {
  world.remove(entity);
  entity.traverse((object) => {
    if (!object.isMesh) return;
    object.geometry.dispose();
    if (Array.isArray(object.material)) object.material.forEach((entry) => entry.dispose());
    else object.material.dispose();
  });
}

function removeParticle(particle) {
  world.remove(particle);
  const resources = particle.userData.resources;
  resources.remaining -= 1;
  if (resources.remaining === 0) {
    resources.geometry.dispose();
    resources.material.dispose();
  }
}

function updateEntities(dt) {
  const effectiveSpeed = state.speed + (state.boostTime > 0 ? 11 : 0);
  for (let index = entities.length - 1; index >= 0; index -= 1) {
    const entity = entities[index];
    entity.position.z += effectiveSpeed * dt;
    const type = entity.userData.type;
    if (type === "coin" || type === "power") {
      const phase = state.elapsed * 3.3 + entity.userData.id;
      entity.rotation.y += dt * (type === "coin" ? 3.7 : 1.6);
      entity.position.y = Math.sin(phase) * 0.09;
      if (state.magnet && type === "coin" && Math.abs(entity.position.z - 3) < 15) {
        entity.position.x += (laneXs[state.lane] - entity.position.x) * Math.min(dt * 3.6, 1);
      }
      const coinHeightReached = !entity.userData.high || state.jumpTime > 0.2;
      if (type === "coin" && Math.abs(entity.position.z - 3) < 1.35 && Math.abs(entity.position.x - laneXs[state.lane]) < 0.82 && coinHeightReached) {
        collectCoin(entity);
      }
      if (type === "power" && Math.abs(entity.position.z - 3) < 1.25 && Math.abs(entity.position.x - laneXs[state.lane]) < 0.9) collectPower(entity);
    } else {
      const xDistance = Math.abs(entity.position.x - laneXs[state.lane]);
      const isAtPlayer = entity.position.z > 2.0 && entity.position.z < 4.8;
      if (isAtPlayer && xDistance < (type === "train" ? 1.18 : 0.88) && state.hitCooldown <= 0) {
        const avoided = type === "sign" ? state.slideTime > 0 : type === "barrier" || type === "hazard" ? state.jumpTime > 0.2 : false;
        if (!avoided) handleCollision(entity);
      }
    }
    if (entity.position.z > 15) {
      disposeEntity(entity);
      entities.splice(index, 1);
    }
  }
}

function handleCollision(entity) {
  if (state.shield) {
    state.shield = false;
    state.power = null;
    state.powerTime = 0;
    $("#powerup-display").hidden = true;
    state.hitCooldown = 0.9;
    makeBurst(new THREE.Vector3(entity.position.x, 1, 3), colors.cyan, 18);
    showToast("SHIELD ABSORBED THE IMPACT");
    tone(130, 0.18, "sawtooth", 0.05);
    return;
  }
  gameOver();
}

function updateParticles(dt) {
  for (let index = particles.length - 1; index >= 0; index -= 1) {
    const particle = particles[index];
    particle.userData.life -= dt;
    particle.position.addScaledVector(particle.userData.velocity, dt);
    particle.userData.velocity.y -= 6 * dt;
    particle.material.opacity = Math.max(0, particle.userData.life * 2.3);
    particle.scale.setScalar(Math.max(0.01, particle.userData.life * 1.5));
    if (particle.userData.life <= 0) {
      removeParticle(particle);
      particles.splice(index, 1);
    }
  }
}

function clearEntities() {
  for (const entity of entities) disposeEntity(entity);
  entities = [];
  const burstResources = new Set();
  for (const particle of particles) {
    world.remove(particle);
    burstResources.add(particle.userData.resources);
  }
  for (const resources of burstResources) {
    resources.geometry.dispose();
    resources.material.dispose();
  }
  particles = [];
}

function updateEnvironment(dt, effectiveSpeed) {
  for (const part of roadParts) {
    part.position.z += effectiveSpeed * dt;
    if (part.position.z > 12) part.position.z -= 32 * 4;
  }
  for (const element of buildings) {
    element.group.position.z += effectiveSpeed * dt;
    if (element.group.position.z > 14) element.group.position.z -= 150;
  }
}

function updatePlayer(dt) {
  const targetX = laneXs[state.lane];
  player.group.position.x += (targetX - player.group.position.x) * Math.min(dt * 10, 1);
  player.group.position.z = 3;
  if (state.jumpTime > 0) state.jumpTime = Math.max(0, state.jumpTime - dt);
  if (state.slideTime > 0) state.slideTime = Math.max(0, state.slideTime - dt);
  const jumpProgress = state.jumpTime > 0 ? 1 - state.jumpTime / 0.78 : 0;
  const jumpHeight = state.jumpTime > 0 ? Math.sin(jumpProgress * Math.PI) * 1.55 : 0;
  player.group.position.y = jumpHeight;
  const sliding = state.slideTime > 0;
  player.body.scale.y += ((sliding ? 0.5 : 1) - player.body.scale.y) * Math.min(dt * 17, 1);
  player.body.position.y = sliding ? -0.24 : 0;
  player.body.rotation.z += ((targetX - player.group.position.x) * -0.045 - player.body.rotation.z) * Math.min(dt * 9, 1);
  const runCycle = state.elapsed * 12;
  const stride = state.mode === "running" && !sliding && state.jumpTime <= 0 ? Math.sin(runCycle) * 0.65 : 0;
  player.leftLeg.rotation.x = stride;
  player.rightLeg.rotation.x = -stride;
  player.leftArm.rotation.x = -stride * 0.6;
  player.rightArm.rotation.x = stride * 0.6;
  player.body.position.y += state.mode === "running" && state.jumpTime <= 0 && !sliding ? Math.abs(Math.sin(runCycle * 2)) * 0.045 : 0;
  player.trail.material.opacity = state.shield ? 0.98 : state.boostTime > 0 ? 0.9 : 0.4;
  player.trail.material.color.setHex(state.shield ? colors.cyan : state.boostTime > 0 ? colors.orange : colors.cyan);
}

function updatePower(dt) {
  if (state.powerTime <= 0) return;
  state.powerTime = Math.max(0, state.powerTime - dt);
  $("#power-time").textContent = `${state.powerTime.toFixed(1)} s`;
  $("#power-meter").style.transform = `scaleX(${state.powerTime / (state.power === "shield" ? 10 : state.power === "boost" ? 3.3 : 8)})`;
  if (state.power === "boost") state.boostTime = state.powerTime;
  if (state.powerTime <= 0) {
    state.power = null;
    state.magnet = false;
    state.multiplier = 1;
    state.shield = false;
    state.boostTime = 0;
    $("#powerup-display").hidden = true;
  }
}

function updateHUD() {
  const calculated = Math.floor(state.distance * 10) + state.coins * 30 * state.multiplier;
  state.score = Math.max(state.score, calculated);
  $("#score").textContent = String(state.score).padStart(6, "0");
  $("#distance").textContent = String(Math.floor(state.distance));
  $("#coins").textContent = String(state.coins);
}

function updateBest() {
  $("#high-score").textContent = String(bestScore);
}

function gameOver() {
  if (state.mode !== "running") return;
  state.mode = "over";
  const finalDistance = Math.floor(state.distance);
  const isNewBest = state.score > bestScore;
  if (isNewBest) {
    bestScore = state.score;
    saveBestScore(bestScore);
  }
  $("#final-distance").innerHTML = `${finalDistance}<small>m</small>`;
  $("#final-coins").textContent = String(state.coins);
  $("#final-score").textContent = String(state.score);
  $("#run-message").textContent = isNewBest ? "A new record. The city knows your name." : "The city will be here for your next run.";
  $("#new-best").hidden = !isNewBest;
  updateBest();
  hud.hidden = true;
  gameOverScreen.classList.remove("overlay-hidden");
  gameOverScreen.setAttribute("aria-hidden", "false");
  $("#mobile-hint").hidden = false;
  $("#mobile-hint").innerHTML = "<span>SWIPE TO MOVE</span><span class=\"hint-arrows\">← &nbsp; ↑ &nbsp; ↓ &nbsp; →</span>";
  shake();
  tone(180, 0.4, "triangle", 0.06);
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 1600);
}

function shake() {
  gameShell.classList.remove("is-shaking");
  void gameShell.offsetWidth;
  gameShell.classList.add("is-shaking");
  window.setTimeout(() => gameShell.classList.remove("is-shaking"), 240);
}

function ensureAudio() {
  if (!state.audio) return;
  if (!audioContext) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) audioContext = new AudioContextClass();
  }
  if (audioContext?.state === "suspended") audioContext.resume().catch((error) => console.warn("Metro Rush audio could not resume.", error));
}

function tone(frequency, duration, type, volume) {
  if (!state.audio || !audioContext) return;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  gain.gain.setValueAtTime(volume, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + duration);
}

function frame(now) {
  const rawDt = state.lastFrame ? (now - state.lastFrame) / 1000 : 0;
  const dt = Math.min(Math.max(rawDt, 0), 0.045);
  state.lastFrame = now;
  if (state.mode === "running") {
    state.elapsed += dt;
    state.distance += state.speed * dt * 0.55;
    state.speed = Math.min(19 + state.distance * 0.018, 37);
    if (state.hitCooldown > 0) state.hitCooldown -= dt;
    updatePower(dt);
    const effectiveSpeed = state.speed + (state.boostTime > 0 ? 11 : 0);
    state.spawnTimer -= dt;
    if (state.spawnTimer <= 0) {
      spawnPattern();
      const difficulty = Math.min(state.distance / 1700, 1);
      state.spawnTimer = Math.max(0.68, (1.45 - difficulty * 0.3) * (19 / state.speed) + Math.random() * 0.22);
    }
    updateEntities(dt);
    updateEnvironment(dt, effectiveSpeed);
    updatePlayer(dt);
    updateParticles(dt);
    updateHUD();
    $("#speed-lines").classList.toggle("is-active", state.speed > 28 || state.boostTime > 0);
    if (state.shakeTime > 0) state.shakeTime -= dt;
  } else {
    state.elapsed += dt * 0.2;
    if (state.mode === "ready" || state.mode === "over") {
      updatePlayer(dt);
      if (state.mode !== "paused") updateParticles(dt);
    }
  }
  if (camera) {
    const skyShift = Math.min(state.distance / 2400, 1) * 0.56;
    world.background.copy(skyBase).lerp(skyLate, skyShift);
    world.fog.color.copy(world.background);
    if (skyStars) skyStars.rotation.y = state.elapsed * 0.002;
    camera.position.x += (player.group.position.x * 0.12 + cameraBaseX - camera.position.x) * Math.min(dt * 2.2, 1);
    camera.position.y = 5.1 + Math.sin(state.elapsed * 1.2) * 0.055;
    camera.lookAt(player.group.position.x * 0.1, 1.05, -8);
  }
  renderer.render(world, camera);
}

function resize() {
  if (!renderer || !camera) return;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.fov = window.innerWidth < 680 ? 63 : 58;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.65));
  renderer.setSize(window.innerWidth, window.innerHeight);
}

if (initScene()) {
  window.addEventListener("pagehide", () => {
    renderer.setAnimationLoop(null);
    audioContext?.close();
  }, { once: true });
}
