"use strict";

////////////////////////////////////////////////
////// Selecting HTML Elements
///////////////////////////////////////////////

// Parents
const sketchpad = document.querySelector(".canvas");
const navModes = document.querySelector(".content__nav--modes");
const configContainer = document.querySelector(".foot__container--config");
// Buttons
const btnClear = document.querySelector(".content__btn--clear");
const btnNormal = document.querySelector(".nav__btn--normal");
const btnAlternate = document.querySelector(".nav__btn--alternate");
const btnColor = document.querySelector(".nav__btn--color");
const btnShade = document.querySelector(".nav__btn--shade");
const btnEraser = document.querySelector(".nav__btn--eraser");
// Inputs
const inputPixels = document.querySelector(".item__input--pixels");
const inputColor = document.querySelector(".item__input--color");
const inputPrimary = document.querySelector(".item__input--primary");
const inputAlternate = document.querySelector(".item__input--alternate");

////////////////////////////////////////////////
////// App Architecture
///////////////////////////////////////////////

class App {
  #pixels;
  #color;
  #brushMode;
  #brushColors = {};

  constructor() {
    this._loadApp();
    // Add event handlers
    document.addEventListener("keyup", this._handleKeyupPress.bind(this));
    sketchpad.addEventListener("contextmenu", this._handleMouseEvents);
    sketchpad.addEventListener("mousedown", this._handleMouseEvents.bind(this));
    navModes.addEventListener("click", this._toggleBrushMode.bind(this));
    configContainer.addEventListener("input", this._handleUserInput.bind(this));
    btnClear.addEventListener("click", this._clearSketchpad.bind(this));
  }

  _loadApp() {
    // Initial variables
    this.#pixels = 16;
    this.#color = "#f7f7f7";
    this.#brushMode = "normal";
    this.#brushColors.main = "#000000";
    this.#brushColors.alternate = "#ff0000";
    // Clean-up UI
    inputPixels.value = this.#pixels;
    inputPrimary.value = this.#brushColors.main;
    inputAlternate.value = this.#brushColors.alternate;
    inputColor.value = this.#color;
    this._updateBrushMode.call(this, btnNormal);
    this._buildSketchpad();
  }

  _resetSketchpad() {
    this._destroySketchpad();
    this._buildSketchpad();
  }

  _destroySketchpad() {
    // Destroys canvas child nodes
    while (sketchpad.firstChild) {
      sketchpad.removeChild(sketchpad.firstChild);
    }
  }

  _buildSketchpad() {
    for (let i = 0; i < this.#pixels ** 2; i++) {
      const div = document.createElement("div");
      div.classList.add("square");
      div.style.backgroundColor = this.#color;
      div.setAttribute("data-percent", "100");
      div.addEventListener("mouseover", this._handleBrushHover.bind(this, div));
      sketchpad.appendChild(div);
    }
    sketchpad.style.gridTemplateRows = `repeat(${this.#pixels}, 1fr`;
    sketchpad.style.gridTemplateColumns = `repeat(${this.#pixels}, 1fr)`;
  }

  _clearSketchpad() {
    const [...squares] = sketchpad.querySelectorAll(".square");
    squares.forEach((s) => (s.style.backgroundColor = this.#color));
  }

  _toggleBrushMode(e) {
    const clicked = e.target;
    if (!clicked) return;
    if (clicked.classList.contains("nav__btn"))
      this._updateBrushMode.call(this, clicked);
  }

  _updateBrushMode(btn) {
    const [...btns] = navModes.querySelectorAll(".nav__btn");
    btns.forEach((btn) => btn.classList.remove("btn--active"));
    btn.classList.add("btn--active");
    this.#brushMode = btn.value;
  }

  _handleBrushHover(div) {
    // Helper functions
    const generateRandColor = function (min, max) {
      const rgbVal = () => Math.trunc(Math.random() * (max - min)) + min;
      return `rgb(${rgbVal()},${rgbVal()},${rgbVal()})`;
    };
    const generateShadeColor = function (val) {
      const rgbVal = (val / 100) * 255;
      return `rgb(${rgbVal},${rgbVal},${rgbVal})`;
    };

    switch (this.#brushMode) {
      case "normal":
        div.style.backgroundColor = this.#brushColors.main;
        break;
      case "alternate":
        div.style.backgroundColor = this.#brushColors.alternate;
        break;
      case "color":
        div.style.backgroundColor = generateRandColor(0, 255);
        break;
      case "shade":
        div.style.backgroundColor = generateShadeColor(div.dataset.percent);
        div.dataset.percent -= 10;
        break;
      case "eraser":
        div.style.backgroundColor = this.#color;
    }
  }

  _handleUserInput(e) {
    const target = e.target;
    if (!target) return;
    // Helper function
    const hexToDeciConvertor = (hex) => parseInt(hex, 16);
    if (target.classList.contains("item__input--pixels")) {
      if (inputPixels.value === this.#pixels) return;
      // Only accepts input if it falls between 1 to 101
      if (inputPixels.value > 1 && inputPixels.value < 101) {
        this.#pixels = inputPixels.value;
        return this._resetSketchpad();
      }
      // Reset pixel value back if invalid
      inputPixels.value = this.#pixels;
      if (inputPixels.value > 100) return alert("Number is above 100!");
      if (!inputPixels.value) return alert("Invalid input");
    }
    if (target.classList.contains("item__input--color")) {
      const colorArr = this.#color.substring(1).match(/.{1,2}/g);
      const convertedColorArr = colorArr.map((el) => hexToDeciConvertor(el));
      const rgbColor = `rgb(${convertedColorArr
        .join(",")
        .replaceAll(",", ", ")})`;

      const [...squares] = sketchpad.querySelectorAll(".square");
      const filteredSquares = squares.filter(
        (s) => s.style.backgroundColor === rgbColor
      );
      filteredSquares.forEach(
        (s) => (s.style.backgroundColor = inputColor.value)
      );
      this.#color = inputColor.value;
    }
    if (target.classList.contains("item__input--primary"))
      this.#brushColors.main = inputPrimary.value;
    if (target.classList.contains("item__input--alternate"))
      this.#brushColors.alternate = inputAlternate.value;
  }

  _handleKeyupPress(e) {
    switch (e.key) {
      case "q":
        return this._updateBrushMode.call(this, btnNormal);
      case "a":
        return this._updateBrushMode.call(this, btnAlternate);
      case "w":
        return this._updateBrushMode.call(this, btnColor);
      case "e":
        return this._updateBrushMode.call(this, btnShade);
      case "d":
        return this._updateBrushMode.call(this, btnEraser);
    }
  }

  _handleMouseEvents(e) {
    e.preventDefault();
    if (e.type === "contextmenu") return false;
    switch (e.button) {
      // Left-click
      case 0:
        return this._updateBrushMode.call(this, btnNormal);
      // Right-click
      case 2:
        return this._updateBrushMode.call(this, btnAlternate);
    }
  }
}

const app = new App();
