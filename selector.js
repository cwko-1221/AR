(function () {
  var characters = [
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

  var characterGrid = document.querySelector("#characterGrid");
  var previewMascot = document.querySelector("#previewMascot");
  var startButton = document.querySelector("#startButton");
  var statusText = document.querySelector("#statusText");

  window.POSITIVE_HEROES = characters;
  window.selectedPositiveHero = null;

  function setSelected(character) {
    window.selectedPositiveHero = character;
    previewMascot.src = character.image;
    startButton.disabled = false;
    startButton.textContent = "\u555f\u52d5 Webcam";
    document.body.classList.add("has-character");
    document.body.dataset.hero = character.id;

    if (statusText) {
      statusText.textContent =
        character.name + " \u6e96\u5099\u5c31\u7dd2\uff1a\u8acb\u5148\u78ba\u8a8d\u89d2\u8272\uff0c\u518d\u958b\u59cb\u6311\u6230\u3002";
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
      image.alt = character.name;
      name.textContent = character.name;
      virtue.textContent = character.virtue;
      button.append(image, name, virtue);
      button.addEventListener("click", function () {
        setSelected(character);
      });
      characterGrid.append(button);
    });
  }

  render();
  setSelected(characters[2]);
})();
