import * as THREE from "three";

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

const CHARACTERS = window.POSITIVE_HEROES;

const ENEMIES = [
  {
    id: "comfort",
    name: { zh: "\u5b89\u8212\u602a", en: "Cozie" },
    image: "./assets/comfort-monster.png",
    x: -2.8,
  },
  {
    id: "lonely",
    name: { zh: "\u5b64\u884c\u7378", en: "Loner" },
    image: "./assets/lonely-beast.png",
    x: -1.4,
  },
  {
    id: "reject",
    name: { zh: "\u62d2\u7d55\u9f8d", en: "Non-Non" },
    image: "./assets/reject-dragon.png",
    x: 0,
  },
  {
    id: "lost",
    name: { zh: "\u8ff7\u5931\u72d0", en: "Whati" },
    image: "./assets/lost-fox.png",
    x: 1.4,
  },
  {
    id: "entitled",
    name: { zh: "\u7406\u6240\u7576\u733f", en: "Blinky" },
    image: "./assets/entitled-ape.png",
    x: 2.8,
  },
];

const I18N = {
  zh: {
    "start.kicker": "\u4efb\u52d9\u6307\u4ee4 01",
    "start.title": "\u6b63\u5411\u4fe0\u51fa\u52d5",
    "start.body":
      "\u4eca\u5929\u7684\u4efb\u52d9\u662f\u64ca\u9000 5 \u96bb\u300c\u8ca0\u5411\u602a\u7269\u300d\u3002\u9078\u64c7\u4e00\u4f4d\u6b63\u5411\u4fe0\u5f8c\uff0c\u5148\u5de6\u53f3\u79fb\u52d5\u907f\u958b\u653b\u64ca\uff1b\u6bcf 5 \u79d2\u5834\u4e0a\u6703\u51fa\u73fe\u661f\u661f\uff0c\u62fe\u5230\u661f\u661f\u624d\u53ef\u56de\u7b54\u6b63\u5411\u554f\u984c\u70ba\u5149\u528d\u5145\u80fd\u3002\u88ab\u64ca\u4e2d 3 \u6b21\uff0c\u4efb\u52d9\u5931\u6557\u3002",
    "start.brief1": "\u9078\u89d2\u8272",
    "start.brief2": "\u907f\u653b\u64ca\u3001\u62fe\u661f\u661f",
    "start.brief3": "\u7b54\u984c\u5145\u80fd\u3001\u63ee\u528d",
    "start.accept": "\u63a5\u53d7\u4efb\u52d9",
    "intro.kicker": "\u4efb\u52d9\u7c21\u5831",
    "intro.title": "\u6b63\u5411\u4fe0\uff0c\u8acb\u6e96\u5099\u6b66\u5668",
    "intro.step1": "\u9078\u64c7\u4e00\u4f4d\u6b63\u5411\u4fe0\uff0c\u9032\u5165\u80fd\u91cf\u7adc\u6280\u5834\u3002",
    "intro.step2":
      "\u602a\u7269\u6703\u767c\u5c04\u653b\u64ca\uff0c\u6b63\u5411\u4fe0\u8981\u5de6\u53f3\u79fb\u52d5\u9583\u907f\uff1b\u6bcf 5 \u79d2\u62fe\u5230\u661f\u661f\uff0c\u624d\u6703\u5f48\u51fa 1 \u984c\u6b63\u5411\u554f\u984c\u3002",
    "intro.step3":
      "\u7b54\u5c0d 3 \u984c\u5f8c\u5149\u528d\u5145\u80fd 100%\uff0c\u5c0d\u8457 Webcam \u63ee\u528d\u65ac\u64ca\uff1b\u82e5\u88ab\u64ca\u4e2d 3 \u6b21\uff0c\u4efb\u52d9\u5931\u6557\u3002",
    "intro.next": "\u9078\u64c7\u89d2\u8272",
    "select.title": "\u9078\u64c7\u6b63\u5411\u4fe0",
    "select.body":
      "\u9078\u597d\u89d2\u8272\u5f8c\uff0c\u9032\u5165\u602a\u7378\u9396\u5b9a\u5834\u666f\u3002\u5148\u907f\u958b\u653b\u64ca\uff0c\u62fe\u5230\u661f\u661f\u5f8c\u56de\u7b54\u554f\u984c\u70ba\u5149\u528d\u5145\u80fd\u3002",
    "select.confirm": "\u78ba\u5b9a\u89d2\u8272",
    "hud.round": "Stage",
    "stage.progress": "S{stage} \u00b7 {p}/{total}",
    "stage.banner": "STAGE {n}",
    "stage.subtitle": "\u602a\u7269\u5165\u4fb5 - GET READY",
    "stage.startToast": "Stage {n} \u958b\u59cb\uff01",
    "stage.startStatus": "Stage {n}\uff1a\u64ca\u6557 {total} \u96bb\u602a\u7378\u9032\u5165\u4e0b\u4e00\u968e\u6bb5\u3002",
    "stage.allClearStatus": "\u6240\u6709 {n} \u968e\u6bb5\u5b8c\u6210\uff01",
    "hud.score": "Score",
    "hud.move": "Move",
    "hud.combo": "Combo",
    "hud.time": "Time",
    "hud.start": "\u555f\u52d5 Webcam",
    "hud.starting": "\u904a\u6232\u9032\u884c\u4e2d",
    "hud.answer": "\u7b54\u984c\u5145\u80fd",
    "enemyHud.label": "\u602a\u7269\u76ee\u6a19",
    "hero.label": "\u6b63\u5411\u4fe0 HP",
    "mission.kicker": "\u7b54\u984c\u5145\u80fd",
    "mission.current": "\u7576\u524d\u602a\u7269",
    "mission.energy": "Energy",
    "mission.markerPrompt": "\u8acb\u628a\u5361\u7247\u4e0a\u7684 A/B/C/D \u5b57\u6bcd\u653e\u5230 Webcam \u4e2d\u592e\u6846\u5167\u3002",
    "mission.markerCenter": "\u8acb\u5c07\u5b57\u6bcd A/B/C/D \u5c0d\u6e96\u4e2d\u592e\u6846\u5167",
    "mission.markerInsert": "\u8acb\u628a A/B/C/D Marker \u5361\u653e\u5165 Webcam \u4e2d\u592e\u6846\u3002",
    "mission.scanning": "\u6383\u63cf\u4e2d\uff1a{letter}",
    "mission.recognized": "\u5df2\u8b80\u53d6 {letter}",
    "mission.complete": "\u6311\u6230\u5b8c\u6210\uff01",
    "mission.skillHint": "\u7b54\u5c0d\u4e09\u984c\u5145\u80fd\u5149\u528d\uff0c100% \u5f8c\u56de\u5230\u5834\u666f\u63ee\u528d\u65ac\u64ca\u3002",
    "mission.skillReadyHint": "\u5149\u528d\u5df2\u5b8c\u6210\u5145\u80fd\uff1a\u5728 Webcam \u524d\u5feb\u901f\u6a6b\u63ee\u53f3\u624b\uff0c\u6216\u96d9\u624b\u8209\u9ad8\u91cb\u653e\u7d42\u7d50\u6280\u80fd\u3002",
    "mission.skillReadyMarkerHint": "\u5145\u80fd 100%\uff01\u56de\u5230\u5834\u666f\u63ee\u52d5\u5b57\u6bcd\u5361\uff0c\u91cb\u653e\u5149\u528d\u65ac\u64ca\u3002",
    "mission.markerScanHint": "\u628a A/B/C/D Marker \u5361\u653e\u5230 Webcam \u4e2d\u592e\u6846\uff0c\u7cfb\u7d71\u6383\u5230\u5f8c\u6703\u81ea\u52d5\u7b54\u984c\u5145\u80fd\u3002",
    "mission.full": "\u5145\u80fd 100%\uff01\u8acb\u56de\u5230\u5834\u666f\uff0c\u63e1\u7dca\u5b57\u6bcd\u5361\u5411\u602a\u7378\u63ee\u528d\u3002",
    "mission.allClear": "\u6240\u6709\u602a\u7378\u5df2\u88ab\u64ca\u6557\uff01\u4f60\u5df2\u5b8c\u6210\u6b63\u5411\u6311\u6230\u3002",
    "status.allMonsterDone": "\u5df2\u5b8c\u6210",
    "panel.kickerLockOn": "LOCK ON",
    "panel.title": "\u6b63\u5411\u4fe0 AR Challenge",
    "panel.statusInitial": "\u4ea4\u6d41\u4fe0\u6e96\u5099\u5c31\u7dd2\uff1a\u8acb\u5148\u78ba\u8a8d\u89d2\u8272\uff0c\u518d\u958b\u59cb\u6311\u6230\u3002",
    "panel.statusReady": "{name} \u6e96\u5099\u5c31\u7dd2\uff1a\u8acb\u5148\u78ba\u8a8d\u89d2\u8272\uff0c\u518d\u958b\u59cb\u6311\u6230\u3002",
    "back.toGame": "\u56de\u5230\u5834\u666f",
    "victory.kicker": "VICTORY",
    "victory.title": "\u6b63\u5411\u80fd\u91cf\u5168\u90e8\u89e3\u653e",
    "victory.body": "\u6210\u529f\u64ca\u9000\u6240\u6709\u602a\u7269\uff0c\u5b8c\u6210\u6b63\u5411\u6311\u6230\u3002",
    "victory.bodyScore": "\u4f60\u64ca\u6557\u4e86 {n} \u96bb\u602a\u7378\uff0c\u7e3d\u5206 {score}\uff01",
    "victory.restart": "\u518d\u73a9\u4e00\u6b21",
    "victory.failedKicker": "MISSION FAILED",
    "victory.failedTitle": "\u4efb\u52d9\u5931\u6557",
    "victory.failedBody":
      "\u6b63\u5411\u4fe0\u88ab\u64ca\u4e2d 3 \u6b21\uff0c\u4efb\u52d9\u5931\u6557\u3002\u4e0b\u6b21\u8a18\u5f97\u5de6\u53f3\u79fb\u52d5\u8eb2\u958b\u653b\u64ca\uff0c\u62fe\u5230\u661f\u661f\u624d\u7b54\u984c\u5145\u80fd\uff01",
    "bossWarning.label": "WARNING",
    "bossWarning.ready": "\u602a\u7269\u5165\u4fb5 - GET READY",
    "phase.lockOn": "LOCK ON",
    "phase.battle": "BATTLE",
    "phase.strike": "STRIKE",
    "phase.scan": "SCAN",
    "phase.clear": "CLEAR",
    "phase.failed": "FAILED",
    "phase.warning": "WARNING",
    "phase.boss": "BOSS",
    "phase.hero": "HERO",
    "phase.dodge": "DODGE",
    "phase.charge": "CHARGE",
    "phase.full": "100%",
    "status.charge100Back": "\u5145\u80fd 100%\uff01\u63e1\u7dca\u5b57\u6bcd\u5361\uff0c\u5c0d\u8457 Webcam \u63ee\u51fa\u5149\u528d\u65ac\u64ca\u3002",
    "status.monsterLocked": "\u602a\u7378\u9396\u5b9a\uff01\u6b63\u5411\u4fe0\uff0c\u8acb\u5de6\u53f3\u79fb\u52d5\u907f\u958b\u653b\u64ca\u3002",
    "status.scanLetter": "\u8acb\u8209\u8d77\u6b63\u78ba\u7684 A/B/C/D \u5b57\u6bcd\u5361\uff0c\u6216\u6309\u756b\u9762\u7b54\u6848\u6383\u63cf\u3002",
    "status.failed": "\u6b63\u5411\u4fe0\u88ab\u64ca\u4e2d 3 \u6b21\uff0c\u4efb\u52d9\u5931\u6557\u3002\u8acb\u518d\u6311\u6230\u4e00\u6b21\uff01",
    "status.starAppeared": "\u5145\u80fd\u661f\u661f\u51fa\u73fe\u5728\u6b63\u5411\u4fe0\u7684\u79fb\u52d5\u8def\u5f91\u4e0a\uff01\u5de6\u53f3\u79fb\u52d5\u53bb\u62fe\u53d6\u661f\u661f\u3002",
    "status.questionStart": "\u62fe\u5230\u5145\u80fd\u661f\u661f\uff01\u73fe\u5728\u56de\u7b54\u4e00\u984c\u70ba\u5149\u528d\u5145\u80fd\u3002",
    "status.dodgeFirst": "\u5148\u9583\u907f\u602a\u7378\u653b\u64ca\uff01\u6bcf 5 \u79d2\u5834\u4e0a\u6703\u51fa\u73fe\u661f\u661f\uff0c\u62fe\u5230\u661f\u661f\u624d\u80fd\u7b54\u984c\u5145\u80fd\u3002",
    "status.dangerStart": "\u5371\u96aa\u53cd\u61c9\uff01\u602a\u7378\u6b63\u5728\u5165\u4fb5\uff0c\u6e96\u5099\u555f\u52d5 Webcam\u3002",
    "status.bossLanded": "\u602a\u7378\u767b\u5834\uff01\u8acb\u6e96\u5099\u6b63\u5411\u5149\u528d\u3002",
    "status.heroLanded": "{name} \u767b\u5834\uff01\u5148\u5de6\u53f3\u79fb\u52d5\u907f\u958b\u602a\u7378\u653b\u64ca\u3002",
    "status.dodgeTrain":
      "\u602a\u7378\u767c\u5c04\u80fd\u91cf\u5f48\uff01\u7528 Webcam \u5de6\u53f3\u79fb\u52d5\u9583\u907f\uff0c\u6c92\u6709\u93e1\u982d\u6642\u53ef\u7528 A/D \u6216\u5de6\u53f3\u9375\u6e2c\u8a66\u3002",
    "status.hitWarn":
      "\u88ab\u64ca\u4e2d\u4e86\uff01\u88ab\u64ca\u4e2d 3 \u6b21\u6703\u4efb\u52d9\u5931\u6557\u3002\u5de6\u53f3\u79fb\u52d5\u9583\u958b\u653b\u64ca\uff0c\u62fe\u661f\u661f\u624d\u80fd\u7b54\u984c\u3002",
    "status.dodgeSuccess":
      "\u9583\u907f\u6210\u529f\uff01\u7e7c\u7e8c\u79fb\u52d5\u8eb2\u653b\u64ca\uff0c\u5834\u4e0a\u51fa\u73fe\u661f\u661f\u5f8c\u62fe\u53d6\u624d\u6703\u7b54\u984c\u3002",
    "status.skillReadyBack":
      "\u5145\u80fd 100%\uff01\u5149\u528d\u5df2\u89e3\u653e\uff0c\u56de\u5230\u5834\u666f\u6e96\u5099\u65ac\u64ca\u3002",
    "status.scanSuccess": "\u6383\u63cf\u6210\u529f\uff01\u5149\u528d\u5145\u80fd\u4e0a\u5347\u3002",
    "status.wrong": "\u7b54\u932f\u4e86\uff01\u8acb\u56de\u5230\u5834\u666f\u4e2d\u91cd\u65b0\u6536\u96c6\u661f\u661f\u518d\u6311\u6230\u3002",
    "status.victoryStrike": "VICTORY! \u5149\u528d\u65ac\u64ca\u6210\u529f\uff0c\u602a\u7378\u5316\u70ba\u5149\u9ede\u6d88\u5931\u3002",
    "status.warmingTracker": "\u6b63\u5728\u8f09\u5165\u52d5\u4f5c\u8ffd\u8e64\u6a21\u578b...",
    "status.cameraOnly": "\u5df2\u555f\u52d5 Webcam\uff0c\u52d5\u4f5c\u8ffd\u8e64\u6b63\u5728\u5f8c\u5099\u6a21\u5f0f\u3002",
    "status.cameraReady": "{name} \u5df2\u51fa\u52d5\uff01\u8acb\u6309\u300c\u7b54\u984c\u5145\u80fd\u300d\u70ba\u5149\u528d\u5132\u6eff\u80fd\u91cf\u3002",
    "status.cameraError":
      "\u7121\u6cd5\u555f\u52d5 Webcam\uff1a\u8acb\u5141\u8a31\u76f8\u6a5f\u6b0a\u9650\uff0c\u4e26\u7528 localhost \u6216 HTTPS \u958b\u555f\u9801\u9762\u3002",
    "status.pickHero": "\u8acb\u5148\u9078\u64c7\u4e00\u4f4d\u6b63\u5411\u4fe0\u3002",
    "toast.charge100": "\u5145\u80fd 100%\uff1a\u63ee\u528d\u65ac\u64ca",
    "toast.charge100Plain": "\u5145\u80fd 100%\uff01",
    "toast.monsterLocked": "\u602a\u7378\u9396\u5b9a",
    "toast.scanCard": "\u6383\u63cf\u5b57\u6bcd\u5361\u5145\u80fd",
    "toast.missionComplete": "\u4efb\u52d9\u5b8c\u6210",
    "toast.starAppeared": "\u661f\u661f\u51fa\u73fe\uff01\u62fe\u53d6\u5f8c\u7b54\u984c\u5145\u80fd",
    "toast.starCharge": "\u661f\u661f\u5145\u80fd\uff1a\u7b54\u984c\u958b\u59cb",
    "toast.wrong": "\u7b54\u932f\u4e86\uff01\u8acb\u91cd\u65b0\u6536\u96c6\u661f\u661f",
    "toast.dodgeStart": "\u8eb2\u653b\u64ca + \u62fe\u661f\u661f\u624d\u7b54\u984c",
    "toast.dodgeSuccess": "\u9583\u907f\u6210\u529f\uff01\u7559\u610f\u661f\u661f",
    "toast.hitBy": "\u88ab\u602a\u7378\u653b\u64ca\uff01HP {hp} / {max}",
    "toast.timeWarn": "\u6642\u9593\u8b66\u5831\uff01Combo \u91cd\u7f6e",
    "toast.dangerStart": "\u5371\u96aa\u97f3\u6a02\u555f\u52d5",
    "toast.dodgeAttack": "\u9583\u907f\u653b\u64ca\uff1a\u5de6\u53f3\u79fb\u52d5",
    "toast.victoryStrike": "VICTORY! \u5149\u528d\u65ac\u64ca\u6210\u529f",
    "toast.chargePct": "\u5145\u80fd {pct}%",
    "toast.missionFailed": "\u4efb\u52d9\u5931\u6557\uff01\u6b63\u5411\u4fe0\u88ab\u64ca\u4e2d 3 \u6b21",
    "lang.toggle": "EN",
    "ui.langLabel": "\u8a9e\u8a00",
  },
  en: {
    "start.kicker": "Mission Brief 01",
    "start.title": "Positive Hero Mobilize",
    "start.body":
      "Today's mission: defeat 5 \"negative monsters.\" Choose a Positive Hero, then move left/right to dodge attacks. A star appears every 5 seconds \u2014 grab one to answer a positive question and charge your saber. Get hit 3 times and the mission fails.",
    "start.brief1": "Pick a hero",
    "start.brief2": "Dodge & grab stars",
    "start.brief3": "Answer & swing",
    "start.accept": "Accept Mission",
    "intro.kicker": "Mission Briefing",
    "intro.title": "Hero, prepare your weapon",
    "intro.step1": "Pick a Positive Hero and enter the energy arena.",
    "intro.step2":
      "Monsters fire attacks \u2014 move left/right to dodge. Every 5 seconds you can grab a star to unlock 1 positive question.",
    "intro.step3":
      "Answer 3 correctly to charge the saber to 100%, then slash at the Webcam. Get hit 3 times and the mission fails.",
    "intro.next": "Choose Hero",
    "select.title": "Choose a Positive Hero",
    "select.body":
      "After choosing, enter the monster lock-on scene. Dodge attacks first, then grab stars and answer questions to charge the saber.",
    "select.confirm": "Confirm",
    "hud.round": "Stage",
    "stage.progress": "S{stage} · {p}/{total}",
    "stage.banner": "STAGE {n}",
    "stage.subtitle": "Monster incoming - GET READY",
    "stage.startToast": "Stage {n} begins!",
    "stage.startStatus": "Stage {n}: defeat {total} monsters to advance.",
    "stage.allClearStatus": "All {n} stages cleared!",
    "hud.score": "Score",
    "hud.move": "Move",
    "hud.combo": "Combo",
    "hud.time": "Time",
    "hud.start": "Start Webcam",
    "hud.starting": "Game running",
    "hud.answer": "Answer to Charge",
    "enemyHud.label": "Target",
    "hero.label": "Hero HP",
    "mission.kicker": "Answer to Charge",
    "mission.current": "Current Monster",
    "mission.energy": "Energy",
    "mission.markerPrompt": "Place the A/B/C/D letter card in the center frame of the Webcam.",
    "mission.markerCenter": "Align an A/B/C/D letter with the center frame",
    "mission.markerInsert": "Place the A/B/C/D marker card in the Webcam's center frame.",
    "mission.scanning": "Scanning: {letter}",
    "mission.recognized": "Read {letter}",
    "mission.complete": "Challenge complete!",
    "mission.skillHint":
      "Answer 3 correctly to fully charge the saber. At 100%, return to the stage and slash.",
    "mission.skillReadyHint":
      "Saber fully charged: swing your right hand horizontally in front of the Webcam, or raise both hands to release the finishing skill.",
    "mission.skillReadyMarkerHint":
      "Charged 100%! Return to the stage, swing your letter card, and unleash the saber slash.",
    "mission.markerScanHint":
      "Place the A/B/C/D marker card in the center frame \u2014 the system auto-answers and charges when detected.",
    "mission.full":
      "Charged 100%! Return to the stage, hold your letter card, and slash at the monster.",
    "mission.allClear": "All monsters defeated! Positive challenge complete.",
    "status.allMonsterDone": "Done",
    "panel.kickerLockOn": "LOCK ON",
    "panel.title": "Positive Hero AR Challenge",
    "panel.statusInitial":
      "Communication Hero ready: confirm your hero, then begin the challenge.",
    "panel.statusReady": "{name} ready: confirm your hero, then begin the challenge.",
    "back.toGame": "Back to Stage",
    "victory.kicker": "VICTORY",
    "victory.title": "Positive Energy Unleashed",
    "victory.body": "You defeated every monster \u2014 positive challenge complete.",
    "victory.bodyScore": "You defeated {n} monsters with a total score of {score}!",
    "victory.restart": "Play Again",
    "victory.failedKicker": "MISSION FAILED",
    "victory.failedTitle": "Mission Failed",
    "victory.failedBody":
      "Hero was hit 3 times \u2014 mission failed. Next time, dodge left and right, and answer questions only after collecting stars!",
    "bossWarning.label": "WARNING",
    "bossWarning.ready": "Monster incoming - GET READY",
    "phase.lockOn": "LOCK ON",
    "phase.battle": "BATTLE",
    "phase.strike": "STRIKE",
    "phase.scan": "SCAN",
    "phase.clear": "CLEAR",
    "phase.failed": "FAILED",
    "phase.warning": "WARNING",
    "phase.boss": "BOSS",
    "phase.hero": "HERO",
    "phase.dodge": "DODGE",
    "phase.charge": "CHARGE",
    "phase.full": "100%",
    "status.charge100Back":
      "Charged 100%! Hold your letter card and slash at the Webcam to unleash the saber.",
    "status.monsterLocked":
      "Monster locked on! Hero, move left and right to dodge incoming attacks.",
    "status.scanLetter":
      "Raise the correct A/B/C/D card, or tap the on-screen answer to scan.",
    "status.failed":
      "Hero was hit 3 times \u2014 mission failed. Try the challenge again!",
    "status.starAppeared":
      "A charge star has appeared on the hero's path! Move left/right to grab it.",
    "status.questionStart":
      "Charge star collected! Answer one question to power the saber.",
    "status.dodgeFirst":
      "Dodge the monster's attacks first! A star appears every 5 seconds \u2014 collect one to unlock a question.",
    "status.dangerStart":
      "Danger response! A monster is invading \u2014 get the Webcam ready.",
    "status.bossLanded": "Monster arrives! Ready the positive saber.",
    "status.heroLanded": "{name} enters! Move left and right to dodge attacks.",
    "status.dodgeTrain":
      "Monster energy ball incoming! Move left/right with the Webcam \u2014 without a camera, use A/D or arrow keys to test.",
    "status.hitWarn":
      "Hit! Three hits ends the mission. Move left/right to dodge, and grab stars before answering questions.",
    "status.dodgeSuccess":
      "Dodge success! Keep moving \u2014 once a star appears, grab it to unlock a question.",
    "status.skillReadyBack":
      "Charged 100%! The saber is ready \u2014 return to the stage and prepare to slash.",
    "status.scanSuccess": "Scan success! Saber charge rising.",
    "status.wrong":
      "Wrong answer! Return to the stage and collect another star before trying again.",
    "status.victoryStrike":
      "VICTORY! Saber slash succeeded \u2014 the monster dissolves into light.",
    "status.warmingTracker": "Loading the motion-tracking model...",
    "status.cameraOnly":
      "Webcam started. Motion tracking is running in fallback mode.",
    "status.cameraReady":
      "{name} is in action! Press \"Answer to Charge\" to power the saber.",
    "status.cameraError":
      "Can't start the Webcam: allow camera permission, and open the page from localhost or HTTPS.",
    "status.pickHero": "Choose a Positive Hero first.",
    "toast.charge100": "100% Charged: Slash!",
    "toast.charge100Plain": "Charged 100%!",
    "toast.monsterLocked": "Monster locked",
    "toast.scanCard": "Scan card to charge",
    "toast.missionComplete": "Mission complete",
    "toast.starAppeared": "Star appeared! Grab it to unlock a question",
    "toast.starCharge": "Star charge: question time",
    "toast.wrong": "Wrong! Grab another star",
    "toast.dodgeStart": "Dodge & grab stars before answering",
    "toast.dodgeSuccess": "Dodge success! Watch for stars",
    "toast.hitBy": "Hit by monster! HP {hp} / {max}",
    "toast.timeWarn": "Time warning! Combo reset",
    "toast.dangerStart": "Danger music engaged",
    "toast.dodgeAttack": "Dodge: move left & right",
    "toast.victoryStrike": "VICTORY! Saber slash succeeded",
    "toast.chargePct": "Charge {pct}%",
    "toast.missionFailed": "Mission failed! Hero hit 3 times",
    "lang.toggle": "\u4e2d",
    "ui.langLabel": "Lang",
  },
};

const LANG_STORAGE_KEY = "ar-lang";

function getCurrentLang() {
  return window.LANG === "en" ? "en" : "zh";
}

function t(key, vars) {
  const lang = getCurrentLang();
  const dict = I18N[lang] || I18N.zh;
  let value = dict[key];
  if (value === undefined) value = I18N.zh[key] ?? key;
  if (vars) {
    value = value.replace(/\{(\w+)\}/g, (_, name) =>
      vars[name] !== undefined ? vars[name] : `{${name}}`,
    );
  }
  return value;
}

function localize(name) {
  if (!name) return "";
  if (typeof name === "string") return name;
  return name[getCurrentLang()] || name.zh || "";
}

const QUESTIONS = [
  {
    text: {
      zh: "\u7576\u670b\u53cb\u5c0d\u4f60\u8aaa\u4e86\u4e0d\u958b\u5fc3\u7684\u8a71\uff0c\u600e\u6a23\u56de\u61c9\u6700\u6210\u719f\uff1f",
      en: "When a friend says something hurtful, what's the most mature response?",
    },
    answers: [
      { zh: "\u7acb\u523b\u7f75\u56de\u53bb", en: "Yell back immediately" },
      { zh: "\u4e0d\u518d\u8ddf\u4ed6\u505a\u670b\u53cb", en: "Cut off the friendship right away" },
      { zh: "\u51b7\u975c\u5f8c\u8ddf\u4ed6\u8aaa\u81ea\u5df1\u7684\u611f\u53d7", en: "Calm down, then share how you feel" },
      { zh: "\u5728\u80cc\u5f8c\u8aaa\u4ed6\u7684\u58de\u8a71", en: "Talk badly about him behind his back" },
    ],
    correct: 2,
  },
  {
    text: {
      zh: "\u8003\u8a66\u6210\u7e3e\u4e0d\u7406\u60f3\u6642\uff0c\u6700\u6709\u7528\u7684\u60f3\u6cd5\u662f\uff1f",
      en: "When your exam result is poor, the most useful mindset is:",
    },
    answers: [
      { zh: "\u627e\u51fa\u5f31\u9ede\u4e26\u6539\u5584", en: "Identify weaknesses and improve" },
      { zh: "\u6c38\u9060\u653e\u68c4\u9019\u4e00\u79d1", en: "Give up on the subject forever" },
      { zh: "\u602a\u8001\u5e2b\u51fa\u984c\u592a\u96e3", en: "Blame the teacher for hard questions" },
      { zh: "\u5047\u88dd\u6c92\u4e8b\u767c\u751f", en: "Pretend nothing happened" },
    ],
    correct: 0,
  },
  {
    text: {
      zh: "\u5abd\u5abd\u716e\u4e86\u4f60\u4e0d\u611b\u5403\u7684\u83dc\uff0c\u6700\u6709\u79ae\u8c8c\u7684\u53cd\u61c9\u662f\uff1f",
      en: "Mom cooked something you don't like \u2014 the most polite reaction is:",
    },
    answers: [
      { zh: "\u76f4\u63a5\u628a\u7897\u63a8\u958b", en: "Push the bowl away" },
      { zh: "\u5927\u8072\u8aaa\u300c\u597d\u96e3\u5403\u300d", en: "Loudly say \"this tastes awful\"" },
      { zh: "\u4e0d\u5403\u4e5f\u4e0d\u8aaa\u8a71", en: "Stay silent and refuse to eat" },
      { zh: "\u8b1d\u8b1d\u5abd\u5abd\uff0c\u518d\u8aaa\u81ea\u5df1\u7684\u559c\u597d", en: "Thank mom, then share your preference" },
    ],
    correct: 3,
  },
  {
    text: {
      zh: "\u8a02\u76ee\u6a19\u6642\u6700\u8070\u660e\u7684\u65b9\u6cd5\u662f\uff1f",
      en: "The smartest way to set a goal is:",
    },
    answers: [
      { zh: "\u8a02\u4e00\u500b\u4e0d\u53ef\u80fd\u9054\u5230\u7684\u76ee\u6a19", en: "Set an impossible target" },
      { zh: "\u628a\u5927\u76ee\u6a19\u5207\u6210\u5c0f\u6b65\u9a5f", en: "Break a big goal into small steps" },
      { zh: "\u5f9e\u4e0d\u5beb\u4e0b\u4f86", en: "Never write it down" },
      { zh: "\u7b49\u5225\u4eba\u66ff\u4f60\u6c7a\u5b9a", en: "Wait for others to decide for you" },
    ],
    correct: 1,
  },
  {
    text: {
      zh: "\u7b2c\u4e00\u6b21\u5617\u8a66\u4e00\u4ef6\u65b0\u4e8b\u60c5\u6642\uff0c\u6b63\u78ba\u7684\u5fc3\u614b\u662f\uff1f",
      en: "The right mindset when trying something new for the first time is:",
    },
    answers: [
      { zh: "\u5373\u4f7f\u505a\u4e0d\u597d\uff0c\u4e5f\u662f\u5b78\u7fd2", en: "Even if I do poorly, I'm learning" },
      { zh: "\u4e00\u6b21\u5c31\u8981\u505a\u5230\u5b8c\u7f8e", en: "Must be perfect on the first try" },
      { zh: "\u4e0d\u5982\u4e0d\u8981\u8a66", en: "Better not to try at all" },
      { zh: "\u5077\u5077\u770b\u5225\u4eba\u600e\u6a23\u505a\u5c31\u6284", en: "Secretly copy others" },
    ],
    correct: 0,
  },
  {
    text: {
      zh: "\u8ddf\u540c\u5b78\u610f\u898b\u4e0d\u540c\u6642\uff0c\u600e\u6a23\u6700\u6709\u6548\u89e3\u6c7a\uff1f",
      en: "When you disagree with a classmate, the most effective way to resolve it is:",
    },
    answers: [
      { zh: "\u5927\u8072\u84cb\u904e\u5c0d\u65b9", en: "Talk louder than them" },
      { zh: "\u99ac\u4e0a\u8a8d\u8f38", en: "Give in immediately" },
      { zh: "\u8046\u807d\u5c0d\u65b9\u518d\u8aaa\u81ea\u5df1\u7684\u770b\u6cd5", en: "Listen first, then share your view" },
      { zh: "\u62d2\u7d55\u518d\u6e9d\u901a", en: "Refuse to talk again" },
    ],
    correct: 2,
  },
  {
    text: {
      zh: "\u505a\u932f\u4e8b\u88ab\u767c\u73fe\u6642\uff0c\u8aa0\u5be6\u7684\u505a\u6cd5\u662f\uff1f",
      en: "When caught doing something wrong, the honest action is:",
    },
    answers: [
      { zh: "\u6492\u8b0a\u63a8\u5378\u8cac\u4efb", en: "Lie to shift the blame" },
      { zh: "\u627f\u8a8d\u4e26\u9053\u6b49", en: "Admit it and apologize" },
      { zh: "\u602a\u5225\u4eba\u5bb3\u4f60", en: "Blame others" },
      { zh: "\u9003\u907f\u4e0d\u51fa\u73fe", en: "Hide and avoid showing up" },
    ],
    correct: 1,
  },
  {
    text: {
      zh: "\u770b\u5230\u540c\u5b78\u5728\u54ed\uff0c\u6700\u9ad4\u8cbc\u7684\u505a\u6cd5\u662f\uff1f",
      en: "Seeing a classmate crying, the most caring action is:",
    },
    answers: [
      { zh: "\u5047\u88dd\u6c92\u770b\u898b", en: "Pretend not to see" },
      { zh: "\u7b11\u4ed6\u8edf\u5f31", en: "Laugh at them for being weak" },
      { zh: "\u99ac\u4e0a\u544a\u8a34\u5168\u73ed", en: "Tell the whole class" },
      { zh: "\u8f15\u8072\u554f\u4ed6\u9700\u4e0d\u9700\u8981\u5e6b\u52a9", en: "Gently ask if they need help" },
    ],
    correct: 3,
  },
  {
    text: {
      zh: "\u5b8c\u6210\u529f\u8ab2\u6700\u6709\u6548\u7387\u7684\u65b9\u6cd5\u662f\uff1f",
      en: "The most effective way to finish homework is:",
    },
    answers: [
      { zh: "\u5148\u505a\u96e3\u7684\uff0c\u518d\u505a\u5bb9\u6613\u7684", en: "Tackle the hard ones first, then easy ones" },
      { zh: "\u4e00\u908a\u73a9\u624b\u6a5f\u4e00\u908a\u505a", en: "Do it while playing on your phone" },
      { zh: "\u62d6\u5230\u6700\u5f8c\u4e00\u523b", en: "Wait until the last minute" },
      { zh: "\u6284\u5225\u4eba\u7684\u7b54\u6848", en: "Copy someone else's answers" },
    ],
    correct: 0,
  },
  {
    text: {
      zh: "\u88ab\u8001\u5e2b\u6279\u8a55\u6642\uff0c\u6210\u9577\u578b\u7684\u53cd\u61c9\u662f\uff1f",
      en: "When the teacher criticizes you, a growth-oriented response is:",
    },
    answers: [
      { zh: "\u5728\u5fc3\u88e1\u8a0e\u53ad\u8001\u5e2b", en: "Resent the teacher silently" },
      { zh: "\u5f9e\u6b64\u4e0d\u4ea4\u529f\u8ab2", en: "Stop turning in homework" },
      { zh: "\u60f3\u60f3\u54ea\u88e1\u53ef\u4ee5\u6539\u9032", en: "Think about what can be improved" },
      { zh: "\u5c0d\u5176\u4ed6\u540c\u5b78\u767c\u813e\u6c23", en: "Take it out on classmates" },
    ],
    correct: 2,
  },
  {
    text: {
      zh: "\u5728\u773e\u4eba\u524d\u6f14\u8b1b\u6703\u7dca\u5f35\uff0c\u6700\u597d\u7684\u6e96\u5099\u662f\uff1f",
      en: "You feel nervous about public speaking \u2014 the best preparation is:",
    },
    answers: [
      { zh: "\u5b8c\u5168\u4e0d\u7df4\u7fd2", en: "Don't practice at all" },
      { zh: "\u591a\u6b21\u7df4\u7fd2\u4e26\u6df1\u547c\u5438", en: "Practice multiple times and breathe deeply" },
      { zh: "\u88dd\u75c5\u8acb\u5047", en: "Fake illness to skip it" },
      { zh: "\u5168\u7a0b\u4f4e\u982d\u770b\u5730\u4e0b", en: "Stare at the floor the whole time" },
    ],
    correct: 1,
  },
  {
    text: {
      zh: "\u65b0\u540c\u5b78\u7b2c\u4e00\u5929\u4e0a\u5b78\uff0c\u600e\u6a23\u5c55\u73fe\u540c\u7406\u5fc3\uff1f",
      en: "A new student joins on day one \u2014 how do you show empathy?",
    },
    answers: [
      { zh: "\u4e0d\u7406\u6703\u4ed6", en: "Ignore them" },
      { zh: "\u7b11\u4ed6\u53e3\u97f3\u5947\u602a", en: "Mock their accent" },
      { zh: "\u5728\u4ed6\u80cc\u5f8c\u8b70\u8ad6", en: "Gossip behind their back" },
      { zh: "\u4e3b\u52d5\u6253\u62db\u547c\u5e36\u4ed6\u8a8d\u8b58\u74b0\u5883", en: "Greet them and show them around" },
    ],
    correct: 3,
  },
  {
    text: {
      zh: "\u7b54\u61c9\u4e86\u670b\u53cb\u7684\u4e8b\u537b\u4f86\u4e0d\u53ca\u505a\uff0c\u8ca0\u8cac\u4efb\u7684\u505a\u6cd5\u662f\uff1f",
      en: "You promised a friend something but can't deliver in time \u2014 the responsible action is:",
    },
    answers: [
      { zh: "\u63d0\u65e9\u544a\u8a34\u4ed6\u4e26\u89e3\u91cb\u539f\u56e0", en: "Tell them early and explain why" },
      { zh: "\u5047\u88dd\u5fd8\u8a18", en: "Pretend you forgot" },
      { zh: "\u7b49\u4ed6\u4f86\u7f75\u4f60", en: "Wait for them to confront you" },
      { zh: "\u602a\u4e8b\u60c5\u592a\u591a", en: "Blame having too much going on" },
    ],
    correct: 0,
  },
  {
    text: {
      zh: "\u6bd4\u8cfd\u8f38\u4e86\u4e4b\u5f8c\uff0c\u6700\u6709\u97cc\u6027\u7684\u60f3\u6cd5\u662f\uff1f",
      en: "After losing a competition, the most resilient thought is:",
    },
    answers: [
      { zh: "\u5f9e\u6b64\u4e0d\u518d\u6bd4\u8cfd", en: "Never compete again" },
      { zh: "\u8a8d\u70ba\u81ea\u5df1\u6c92\u5929\u4efd", en: "Decide you have no talent" },
      { zh: "\u5206\u6790\u904e\u7a0b\uff0c\u4e0b\u6b21\u518d\u4f86", en: "Analyze the process and try again" },
      { zh: "\u602a\u968a\u53cb\u62d6\u7d2f", en: "Blame your teammates" },
    ],
    correct: 2,
  },
  {
    text: {
      zh: "\u5c0f\u7d44\u5408\u4f5c\u6642\uff0c\u6700\u597d\u7684\u614b\u5ea6\u662f\uff1f",
      en: "When working in a team, the best attitude is:",
    },
    answers: [
      { zh: "\u5168\u90e8\u81ea\u5df1\u505a\u5b8c", en: "Do everything yourself" },
      { zh: "\u5206\u5de5\u5408\u4f5c\u4e26\u5c0a\u91cd\u6bcf\u500b\u4eba\u610f\u898b", en: "Share the work and respect everyone's input" },
      { zh: "\u53ea\u6311\u6700\u8f15\u9b06\u7684\u90e8\u5206", en: "Only pick the easiest part" },
      { zh: "\u7b49\u5225\u4eba\u505a\u5b8c\u8ddf\u8457\u4ea4", en: "Wait for others to finish and submit along" },
    ],
    correct: 1,
  },
];

const ENERGY_REQUIRED = 3;
const HERO_MAX_HP = 3;
const STAGES = [
  { id: 1, monsterCount: 1, ballInterval: 2400, maxConcurrentBalls: 1 },
  { id: 2, monsterCount: 3, ballInterval: 3600, maxConcurrentBalls: 3 },
  { id: 3, monsterCount: 5, ballInterval: 4800, maxConcurrentBalls: 5 },
];
const STAGE_POSITIONS = {
  1: [0],
  3: [-2.0, 0, 2.0],
  5: [-2.8, -1.4, 0, 1.4, 2.8],
};
const TOTAL_STAGE_FIGHTS = STAGES.reduce((sum, s) => sum + s.monsterCount, 0);
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
let currentStage = 0;
let stageEnemies = [];
let totalEnemiesDefeated = 0;
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

  bossWarningName.textContent = localize(enemy.name);
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
    updatePhase(skillReady ? t("phase.strike") : t("phase.battle"));
    setStatus(skillReady ? t("status.charge100Back") : t("status.monsterLocked"));
    showToast(skillReady ? t("toast.charge100") : t("toast.monsterLocked"), skillReady ? "success" : "");
  }

  if (view === "question") {
    updatePhase(t("phase.scan"));
    setStatus(t("status.scanLetter"));
    showToast(t("toast.scanCard"), "");
  }

  if (view === "victory") {
    updatePhase(t("phase.clear"));
    playVictory();
    showToast(t("toast.missionComplete"), "success");
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
  const stage = STAGES[Math.min(currentStage, STAGES.length - 1)];
  if (roundText) {
    const stageNum = Math.min(currentStage + 1, STAGES.length);
    const alive = aliveCountInStage();
    roundText.textContent = t("stage.progress", {
      stage: stageNum,
      p: alive,
      total: stage.monsterCount,
    });
  }
  if (comboText) {
    comboText.textContent = `x${combo}`;
  }
  if (enemyHud) {
    enemyHud.hidden = !enemy;
  }
  if (enemyHudName) {
    enemyHudName.textContent = enemy ? localize(enemy.name) : t("status.allMonsterDone");
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
  showToast(t("toast.missionFailed"), "danger");
  setStatus(t("status.failed"));
  if (victoryKicker) {
    victoryKicker.textContent = t("victory.failedKicker");
  }
  if (victoryTitle) {
    victoryTitle.textContent = t("victory.failedTitle");
  }
  if (victoryText) {
    victoryText.textContent = t("victory.failedBody");
  }
  document.body.classList.add("mission-failed");
  setView("victory");
}

function updateMissionUI() {
  const enemy = ENEMIES[currentEnemyIndex];
  const question = QUESTIONS[currentQuestionIndex % QUESTIONS.length];

  updateGameHUD();
  enemyNameEl.textContent = enemy ? localize(enemy.name) : t("status.allMonsterDone");
  energyText.textContent = `${energy} / ${ENERGY_REQUIRED}`;
  questionText.textContent = enemy ? localize(question.text) : t("mission.allClear");
  document.body.classList.toggle("skill-ready", skillReady);

  energyBar.querySelectorAll("span").forEach((cell, index) => {
    cell.classList.toggle("is-filled", index < energy);
  });
  updateSaber();

  answerGrid.innerHTML = "";
  updateMarkerStatus(t("mission.markerInsert"), "");

  if (!enemy) {
    skillHint.textContent = t("mission.complete");
    if (victoryKicker) {
      victoryKicker.textContent = t("victory.kicker");
    }
    if (victoryTitle) {
      victoryTitle.textContent = t("victory.title");
    }
    if (victoryText) {
      victoryText.textContent = t("victory.bodyScore", { n: TOTAL_STAGE_FIGHTS, score });
    }
    setView("victory");
    return;
  }

  if (skillReady) {
    questionText.textContent = t("mission.full");
    skillHint.textContent = t("mission.skillReadyHint");
    return;
  }

  question.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = `${String.fromCharCode(65 + index)}. ${localize(answer)}`;
    button.addEventListener("click", () => answerQuestion(index));
    answerGrid.append(button);
  });

  skillHint.textContent = skillReady
    ? t("mission.skillReadyMarkerHint")
    : t("mission.markerScanHint");
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
    showToast(skillReady ? t("toast.charge100Plain") : t("toast.chargePct", { pct: Math.round((energy / ENERGY_REQUIRED) * 100) }), "success");
    setStatus(skillReady ? t("status.skillReadyBack") : t("status.scanSuccess"));
    document.body.classList.add("charge-cinematic");
    setView("game");
    updatePhase(skillReady ? t("phase.full") : t("phase.charge"));
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
    showToast(t("toast.wrong"), "danger");
    setStatus(t("status.wrong"));
    
    // 直接關閉問題回到遊戲畫面
    setView("game");
    
    window.setTimeout(() => {
      updateMissionUI();
      if (!skillReady && ENEMIES[currentEnemyIndex]) {
        startDodgeChallenge(850);
      }
    }, 1500);
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

let tesseractWorker = null;
let isScanningOcr = false;

async function initTesseract() {
  tesseractWorker = await Tesseract.createWorker('eng');
  await tesseractWorker.setParameters({
    tessedit_char_whitelist: 'ABCD',
  });
}

async function scanAnswerMarker() {
  if (!document.body.classList.contains("view-question") || skillReady || !ENEMIES[currentEnemyIndex]) {
    markerCandidate = null;
    markerStableCount = 0;
    return;
  }

  if (isScanningOcr || !tesseractWorker) return;

  if (!ensureMarkerCanvas() || video.readyState < 2 || !video.videoWidth || !video.videoHeight) {
    return;
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
  // Draw it larger (e.g. 224x224) to give Tesseract more pixels to work with
  // We can just use the same markerCanvas but scale it up visually or just rely on Tesseract's internal scaling.
  // Actually, Tesseract prefers larger images, so let's draw directly with a scale!
  markerCanvas.width = 300;
  markerCanvas.height = 300;
  markerCtx.drawImage(video, sourceX, sourceY, sourceSize, sourceSize, 0, 0, 300, 300);
  markerCtx.restore();

  isScanningOcr = true;
  // Removed the "正在辨識字母..." status update to prevent UI flashing

  try {
    const { data } = await tesseractWorker.recognize(markerCanvas);
    const cleaned = data.text.trim().toUpperCase();
    const match = cleaned.match(/[ABCD]/);

    // 嚴格過濾：必須要有 A, B, C 或 D，且信心指數要夠高(>75)，且辨識出來的文字不能是一大串雜訊(長度<=5)
    if (match && data.confidence > 75 && cleaned.length <= 5) {
      const letter = match[0];
      if (markerCandidate === letter) {
        markerStableCount += 1;
      } else {
        markerCandidate = letter;
        markerStableCount = 1;
      }

      updateMarkerStatus(t("mission.scanning", { letter }), "detecting");

      if (markerStableCount >= 2 && performance.now() - lastMarkerAnswerAt > 1400) {
        lastMarkerAnswerAt = performance.now();
        markerStableCount = 0;
        markerCandidate = null;
        updateMarkerStatus(t("mission.recognized", { letter }), "success");
        const answerIndex = MARKER_PATTERNS.findIndex((p) => p.letter === letter);
        answerQuestion(answerIndex);
      }
    } else {
      markerCandidate = null;
      markerStableCount = 0;
      // Use a consistent prompt instead of flashing "未辨識到"
      updateMarkerStatus(t("mission.markerCenter"), "detecting");
    }
  } catch (err) {
    console.error("OCR Error:", err);
  } finally {
    isScanningOcr = false;
  }
}

function selectCharacter(character) {
  selectedCharacter = character;
  previewMascot.src = character.image;
  startButton.disabled = false;
  startButton.textContent = t("hud.start");
  document.body.classList.add("has-character");
  playSelectSound();
  setStatus(t("panel.statusReady", { name: localize(character.name) }));

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
  currentStage = 0;
  stageEnemies = [];
  totalEnemiesDefeated = 0;
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
    victoryKicker.textContent = t("victory.kicker");
  }
  if (victoryTitle) {
    victoryTitle.textContent = t("victory.title");
  }
  scoreEl.textContent = "0";
  initStage(0);
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
  showToast(t("toast.starAppeared"), "success");
  setStatus(t("status.starAppeared"));
}

function openQuestionFromStar() {
  if (!ENEMIES[currentEnemyIndex] || skillReady || missionFailed) return;

  dodgeState = "question";
  clearDodgeTimeout();
  clearEnemyProjectiles();
  clearStarPickup();
  updateMissionUI();
  updatePhase(t("phase.scan"));
  setStatus(t("status.questionStart"));
  showToast(t("toast.starCharge"), "success");
  setView("question");
}

function updateStarPickup(elapsed) {
  const canSpawn =
    document.body.classList.contains("view-game") &&
    document.body.classList.contains("hero-entered") &&
    dodgeState === "waiting" &&
    !skillReady &&
    !missionFailed &&
    enemyProjectiles.length === 0 &&
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

function fireVolley(attemptId = dodgeAttemptId) {
  if (attemptId !== dodgeAttemptId) return;
  const aliveEntries = stageEnemies.filter((e) => !e.defeated);
  aliveEntries.forEach((entry, idx) => {
    window.setTimeout(() => createEnemyProjectile(entry, attemptId), idx * 60);
  });
}

function createEnemyProjectile(sourceEntry, attemptId = dodgeAttemptId) {
  if (attemptId !== dodgeAttemptId) return;
  if (!sourceEntry) {
    const aliveEntries = stageEnemies.filter((e) => !e.defeated);
    if (!aliveEntries.length) return;
    sourceEntry = aliveEntries[Math.floor(Math.random() * aliveEntries.length)];
  }
  const enemy = enemyMeshes[sourceEntry.meshIndex];
  if (!scene || !enemy || enemy.defeated || !enemy.slot.visible) return;

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
  updatePhase(t("phase.dodge"));
  setStatus(t("status.dodgeFirst"));
  showToast(t("toast.dodgeStart"), "danger");

  dodgeTimeout = window.setTimeout(() => {
    if (attemptId !== dodgeAttemptId || dodgeState !== "waiting") return;
    dodgeTimeout = null;
    fireVolley(attemptId);
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

  const stage = STAGES[Math.min(currentStage, STAGES.length - 1)];
  if (canAttack && enemyProjectiles.length === 0 && performance.now() - lastEnemyShotAt > stage.ballInterval) {
    lastEnemyShotAt = performance.now();
    fireVolley(dodgeAttemptId);
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
      showToast(t("toast.hitBy", { hp: heroHp, max: HERO_MAX_HP }), "danger");
      setStatus(t("status.hitWarn"));
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
        showToast(t("toast.dodgeSuccess"), "success");
        setStatus(t("status.dodgeSuccess"));
      }
      return false;
    }

    return true;
  });
}

function refreshEnemies() {
  const scale = stageEnemies.length >= 5 ? 0.82 : stageEnemies.length === 3 ? 0.9 : 0.98;
  enemyMeshes.forEach((enemy, index) => {
    const entry = stageEnemies.find((e) => e.meshIndex === index && !e.defeated);
    if (entry) {
      enemy.slot.visible = true;
      enemy.slot.position.x = entry.x;
      enemy.slot.position.z = ENEMY_Z;
      enemy.slot.scale.setScalar(scale);
      enemy.halo.material.opacity = 0.26;
    } else {
      enemy.slot.visible = false;
      enemy.slot.scale.setScalar(0.08);
      enemy.halo.material.opacity = 0;
    }
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
  if (!stageEnemies.length) return;

  const introScale = stageEnemies.length >= 5 ? 1.0 : stageEnemies.length === 3 ? 1.08 : 1.18;
  stageEnemies.forEach((entry) => {
    const mesh = enemyMeshes[entry.meshIndex];
    if (!mesh) return;
    mesh.slot.visible = true;
    mesh.slot.position.set(entry.x, WORLD.floorY + 1.28, ENEMY_Z);
    mesh.slot.scale.setScalar(introScale);
    mesh.halo.material.opacity = 0.5;
    if (mesh.mesh && mesh.mesh.material) {
      mesh.mesh.material.opacity = 1;
    }
  });
  document.body.classList.add("enemy-entered");
  const firstAlive = stageEnemies.find((e) => !e.defeated);
  if (firstAlive) {
    showBossWarning(ENEMIES[firstAlive.meshIndex]);
  }
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
  initStage(currentStage);
  prepareBattleEntrance();
  setView("game");
  updatePhase(t("phase.warning"));
  setStatus(t("status.dangerStart"));
  showToast(t("toast.dangerStart"), "danger");

  startCamera({ silent: true });

  scheduleBattleIntro(() => {
    updatePhase(t("phase.boss"));
    setStatus(t("status.bossLanded"));
    revealCurrentEnemy();
  }, 700);

  scheduleBattleIntro(() => {
    updatePhase(t("phase.hero"));
    setStatus(t("status.heroLanded", { name: localize(selectedCharacter.name) }));
    revealHero();
  }, 2200);

  scheduleBattleIntro(() => {
    updatePhase(t("phase.dodge"));
    setStatus(t("status.dodgeTrain"));
    showToast(t("toast.dodgeAttack"), "danger");
  }, 3400);

  scheduleBattleIntro(() => {
    document.body.classList.remove("battle-intro");
    announceStage(currentStage);
    startDodgeChallenge(800);
  }, 4200);
}

function syncCurrentEnemyIndex() {
  const alive = stageEnemies.find((e) => !e.defeated);
  currentEnemyIndex = alive ? alive.meshIndex : ENEMIES.length;
}

function aliveCountInStage() {
  return stageEnemies.filter((e) => !e.defeated).length;
}

function updateStageHpBar() {
  const stage = STAGES[Math.min(currentStage, STAGES.length - 1)];
  if (!stage || !stage.monsterCount) {
    enemyHp = 0;
    return;
  }
  enemyHp = (aliveCountInStage() / stage.monsterCount) * 100;
}

function initStage(stageIdx) {
  const stage = STAGES[stageIdx];
  if (!stage) {
    stageEnemies = [];
    syncCurrentEnemyIndex();
    refreshEnemies();
    return;
  }

  const positions = STAGE_POSITIONS[stage.monsterCount] || [0];
  stageEnemies = [];
  for (let i = 0; i < stage.monsterCount; i += 1) {
    stageEnemies.push({
      meshIndex: i % ENEMIES.length,
      x: positions[i] ?? 0,
      defeated: false,
    });
  }

  enemyMeshes.forEach((m, i) => {
    const inStage = stageEnemies.some((e) => e.meshIndex === i);
    m.defeated = !inStage;
    m.slot.userData.defeat = inStage ? 1 : 0;
    if (m.mesh && m.mesh.material) {
      m.mesh.material.transparent = true;
      m.mesh.material.opacity = inStage ? 1 : 0;
    }
    if (m.halo && m.halo.material) {
      m.halo.material.opacity = inStage ? 0.26 : 0;
    }
  });

  syncCurrentEnemyIndex();
  updateStageHpBar();
  refreshEnemies();
  updateGameHUD();
}

function triggerSkill() {
  if (!skillReady || performance.now() - lastSkillAt < 1200) return;
  const aliveEntries = stageEnemies.filter((e) => !e.defeated);
  if (!aliveEntries.length) return;

  lastSkillAt = performance.now();
  playSlashSound();
  clearStarPickup();

  aliveEntries.forEach((entry, idx) => {
    const enemy = enemyMeshes[entry.meshIndex];
    if (!enemy) return;
    window.setTimeout(() => {
      createSkillBeam(enemy.slot);
      createSlashTrail(enemy.slot);
    }, idx * 90);
    enemy.defeated = true;
    enemy.slot.userData.defeat = 1;
    entry.defeated = true;
    totalEnemiesDefeated += 1;
    score += 5 + combo;
    combo += 1;
  });

  energy = 0;
  skillReady = false;
  scoreEl.textContent = String(score);
  updateStageHpBar();
  syncCurrentEnemyIndex();
  updateGameHUD();
  showToast(t("toast.victoryStrike"), "success");
  setStatus(t("status.victoryStrike"));

  const allStagesDone = currentStage >= STAGES.length - 1;
  const stageClearDelay = 650 + Math.max(0, (aliveEntries.length - 1) * 90);

  window.setTimeout(() => {
    resetRoundTimer();
    clearEnemyProjectiles();
    clearDodgeTimeout();
    dodgeState = "idle";
    lastEnemyShotAt = performance.now();

    if (allStagesDone) {
      stageEnemies = [];
      currentEnemyIndex = ENEMIES.length;
      refreshEnemies();
      updateMissionUI();
      return;
    }

    currentStage += 1;
    initStage(currentStage);
    updateMissionUI();
    announceStage(currentStage);
    startDodgeChallenge(1600);
  }, stageClearDelay);
}

function announceStage(stageIndex) {
  const stage = STAGES[stageIndex];
  if (!stage) return;
  if (bossWarning) {
    const label = bossWarning.querySelector("p");
    const subtitle = bossWarning.querySelector("span");
    if (label) label.textContent = t("stage.banner", { n: stage.id });
    const firstAlive = stageEnemies.find((e) => !e.defeated);
    bossWarningName.textContent = firstAlive
      ? localize(ENEMIES[firstAlive.meshIndex].name)
      : "";
    if (subtitle) {
      subtitle.textContent = t("stage.startStatus", {
        n: stage.id,
        total: stage.monsterCount,
      });
    }
    bossWarning.classList.add("is-visible", "is-stage");
    window.clearTimeout(bossWarningTimer);
    bossWarningTimer = window.setTimeout(() => {
      bossWarning.classList.remove("is-visible", "is-stage");
      if (label) label.textContent = t("bossWarning.label");
      if (subtitle) subtitle.textContent = t("bossWarning.ready");
    }, 2000);
  }
  showToast(t("stage.startToast", { n: stage.id }), "success");
  setStatus(t("stage.startStatus", { n: stage.id, total: stage.monsterCount }));
  flashScreen("good");
  playCharge(2);
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
  setStatus(t("status.warmingTracker"));
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
    setStatus(t("status.pickHero"));
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
    startButton.textContent = t("hud.starting");
    resizeCanvases();

    if (!landmarker) {
      try {
        await createLandmarker();
      } catch (trackingError) {
        console.warn(trackingError);
        moveState.textContent = "camera only";
        if (!silent) {
          setStatus(t("status.cameraOnly"));
        }
        setTimeout(predictFrame, 25);
        return true;
      }
    }

    if (!silent) {
      setStatus(t("status.cameraReady", { name: localize(selectedCharacter.name) }));
    }
    setTimeout(predictFrame, 25);
    return true;
  } catch (error) {
    console.error(error);
    setStatus(t("status.cameraError"));
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
      showToast(t("toast.timeWarn"), "danger");
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
function applyLanguage(lang) {
  const target = lang === "en" ? "en" : "zh";
  window.LANG = target;
  try {
    localStorage.setItem(LANG_STORAGE_KEY, target);
  } catch (_) {
    // ignore storage failures (private mode etc.)
  }
  document.documentElement.lang = target === "en" ? "en" : "zh-Hant";
  document.body.dataset.lang = target;

  // Update static elements marked with data-i18n
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.dataset.i18n;
    if (key) node.textContent = t(key);
  });

  // Update lang toggle button label
  const toggle = document.querySelector("#langToggle");
  if (toggle) {
    toggle.textContent = t("lang.toggle");
    toggle.setAttribute("aria-label", target === "en" ? "Switch to Chinese" : "Switch to English");
  }

  // Re-render character cards + selector strings
  if (typeof window.rerenderCharacters === "function") {
    window.rerenderCharacters();
  }

  // Re-render dynamic mission UI (question text, answers, enemy names, HUD)
  if (typeof updateMissionUI === "function") {
    updateMissionUI();
  }
  if (typeof updateGameHUD === "function") {
    updateGameHUD();
  }
}

const langToggleButton = document.querySelector("#langToggle");
if (langToggleButton) {
  langToggleButton.addEventListener("click", () => {
    playSelectSound();
    applyLanguage(getCurrentLang() === "zh" ? "en" : "zh");
  });
}

applyLanguage(getCurrentLang());

initThree();
initTesseract();
startAmbientAudio();

if (window.selectedPositiveHero) {
  selectCharacter(window.selectedPositiveHero);
}
