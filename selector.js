(function () {
  var characters = [
    {
      id: "gratitude",
      name: { zh: "感恩俠", en: "Gratitude Hero" },
      virtue: { zh: "感恩", en: "Gratitude" },
      color: "#ff8fa3",
      image: "./assets/gratitude.png",
    },
    {
      id: "goal",
      name: { zh: "目標俠", en: "Goal Hero" },
      virtue: { zh: "目標", en: "Goals" },
      color: "#ff4b35",
      image: "./assets/goal.png",
    },
    {
      id: "communication",
      name: { zh: "交流俠", en: "Communication Hero" },
      virtue: { zh: "交流", en: "Communication" },
      color: "#f6b85b",
      image: "./assets/communication.png",
    },
    {
      id: "challenge",
      name: { zh: "挑戰俠", en: "Challenge Hero" },
      virtue: { zh: "挑戰", en: "Challenge" },
      color: "#1f77d0",
      image: "./assets/challenge.png",
    },
    {
      id: "explore",
      name: { zh: "探索俠", en: "Explorer Hero" },
      virtue: { zh: "探索", en: "Exploration" },
      color: "#12a5d8",
      image: "./assets/explore.png",
    },
  ];

  var characterGrid = document.querySelector("#characterGrid");
  var previewMascot = document.querySelector("#previewMascot");
  var startButton = document.querySelector("#startButton");
  var statusText = document.querySelector("#statusText");

  function getLang() {
    return window.LANG === "en" ? "en" : "zh";
  }

  function localize(value) {
    if (!value) return "";
    if (typeof value === "string") return value;
    return value[getLang()] || value.zh || "";
  }

  window.POSITIVE_HEROES = characters;
  window.selectedPositiveHero = null;

  var startReady = {
    zh: "啟動 Webcam",
    en: "Start Webcam",
  };

  var statusReady = {
    zh: "準備就緒：請先確認角色，再開始挑戰。",
    en: " ready: confirm your hero, then begin the challenge.",
  };

  function buildStatusText(character) {
    var lang = getLang();
    var name = localize(character.name);
    if (lang === "en") {
      return name + statusReady.en;
    }
    return name + " " + statusReady.zh;
  }

  function setSelected(character) {
    window.selectedPositiveHero = character;
    previewMascot.src = character.image;
    startButton.disabled = false;
    startButton.textContent = startReady[getLang()] || startReady.zh;
    document.body.classList.add("has-character");
    document.body.dataset.hero = character.id;

    if (statusText) {
      statusText.textContent = buildStatusText(character);
    }

    document.querySelectorAll(".character-card").forEach(function (card) {
      card.classList.toggle("is-selected", card.dataset.character === character.id);
    });

    window.dispatchEvent(
      new CustomEvent("positive-hero-selected", {
        detail: character,
      }),
    );
  }

  function render() {
    if (!characterGrid) return;

    characterGrid.innerHTML = "";
    characters.forEach(function (character) {
      var button = document.createElement("button");
      var image = document.createElement("img");
      var name = document.createElement("span");
      var virtue = document.createElement("small");

      button.type = "button";
      button.className = "character-card";
      button.dataset.character = character.id;
      button.style.setProperty("--hero-color", character.color);
      image.src = character.image;
      image.alt = localize(character.name);
      name.textContent = localize(character.name);
      virtue.textContent = localize(character.virtue);
      button.append(image, name, virtue);
      button.addEventListener("click", function () {
        setSelected(character);
      });
      characterGrid.append(button);
    });

    if (window.selectedPositiveHero) {
      document.querySelectorAll(".character-card").forEach(function (card) {
        card.classList.toggle(
          "is-selected",
          card.dataset.character === window.selectedPositiveHero.id,
        );
      });
    }
  }

  window.rerenderCharacters = function () {
    render();
    if (window.selectedPositiveHero) {
      var ch = window.selectedPositiveHero;
      startButton.textContent = startReady[getLang()] || startReady.zh;
      if (statusText) {
        statusText.textContent = buildStatusText(ch);
      }
    }
  };

  render();
  setSelected(characters[2]);
})();
