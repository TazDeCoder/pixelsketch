"use strict";

import "core-js/stable";

////////////////////////////////////////////////
////// Selecting HTML Elements
///////////////////////////////////////////////

// Parents
const canvas = document.querySelector(".hero__content--canvas");
const navModes = document.querySelector(".content__nav--modes");
const configContainer = document.querySelector(".content__item--colors");
// Buttons
const btnClear = document.querySelector(".hero__btn--clear");
const btnNormal = document.querySelector(".nav__btn--normal");
const btnAlternate = document.querySelector(".nav__btn--alternate");
const btnColor = document.querySelector(".nav__btn--color");
const btnShade = document.querySelector(".nav__btn--shade");
const btnEraser = document.querySelector(".nav__btn--eraser");
// Inputs
const inputPixels = document.querySelector(".canvas__input--pixels");
const inputPrimary = document.querySelector(".item__input--primary-color");
const inputAlternate = document.querySelector(".item__input--alternate-color");

////////////////////////////////////////////////
////// App Architecture
///////////////////////////////////////////////

class App {
  #pixels;
  #brushMode;
  #brushColors = {};
  #color = "#ffffff";

  constructor() {
    this._loadApp();
    // Add event handlers
    document.addEventListener("keyup", this._handleKeyupPress.bind(this));
    navModes.addEventListener("click", this._toggleBrushMode.bind(this));
    configContainer.addEventListener(
      "input",
      this._handleColorInput.bind(this)
    );
    // --- CANVAS ---
    canvas.addEventListener("contextmenu", this._handleMouseEvents);
    canvas.addEventListener("mousedown", this._handleMouseEvents.bind(this));
    inputPixels.addEventListener("click", this._handleCanvasInput.bind(this));
    btnClear.addEventListener("click", this._clearSketchpad.bind(this));
  }

  /////////////////////////////////////
  //////////// Handler functions

  _loadApp() {
    // Initial variables
    this.#pixels = 16;
    this.#brushMode = "normal";
    this.#brushColors.main = "#000000";
    this.#brushColors.alternate = "#ff0000";
    // Clean-up UI
    inputPrimary.value = this.#brushColors.main;
    inputAlternate.value = this.#brushColors.alternate;
    this._updateBrushMode.call(this, btnNormal);
    this._buildSketchpad();
  }

  _toggleBrushMode(e) {
    const clicked = e.target.closest(".nav__btn");
    if (!clicked) return;
    this._updateBrushMode.call(this, clicked);
  }

  _updateBrushMode(btn) {
    const [...btns] = navModes.querySelectorAll(".nav__btn");
    btns.forEach((btn) => btn.classList.remove("btn--active"));
    btn.classList.add("btn--active");
    this.#brushMode = btn.value;
  }

  _handleBrushHover(e) {
    const target = e.target.closest(".square");
    if (!target) return;

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
        target.style.backgroundColor = this.#brushColors.main;
        break;
      case "alternate":
        target.style.backgroundColor = this.#brushColors.alternate;
        break;
      case "color":
        target.style.backgroundColor = generateRandColor(0, 255);
        break;
      case "shade":
        target.style.backgroundColor = generateShadeColor(
          target.dataset.percent
        );
        target.dataset.percent -= 10;
        break;
      case "eraser":
        target.style.backgroundColor = this.#color;
    }
  }

  _handleColorInput(e) {
    const target = e.target.closest(".item__input");
    if (!target) return;
    if (target.classList.contains("item__input--primary-color"))
      this.#brushColors.main = target.value;
    if (target.classList.contains("item__input--alternate-color"))
      this.#brushColors.alternate = target.value;
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
    if (e.type === "contextmenu" || window.screen.width <= 768) return false;
    switch (e.button) {
      // Left-click
      case 0:
        return this._updateBrushMode.call(this, btnNormal);
      // Right-click
      case 2:
        return this._updateBrushMode.call(this, btnAlternate);
    }
  }

  _handleCanvasInput(e) {
    const target = e.target;
    if (target.classList.contains("hero__input--pixels")) {
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
  }

  /////////////////////////////////////
  //////////// Sketchpad functions

  _resetSketchpad() {
    this._destroySketchpad();
    this._buildSketchpad();
  }

  _destroySketchpad() {
    // Destroys canvas child nodes
    while (canvas.firstChild) {
      canvas.removeChild(canvas.firstChild);
    }
  }

  _buildSketchpad() {
    for (let i = 0; i < this.#pixels ** 2; i++) {
      const html = `
      <div class="square" data-percent="100"></div>
      `;
      canvas.insertAdjacentHTML("beforeend", html);
    }
    canvas.style.gridTemplateRows = `repeat(${this.#pixels}, 1fr`;
    canvas.style.gridTemplateColumns = `repeat(${this.#pixels}, 1fr)`;
    canvas.addEventListener("mouseover", this._handleBrushHover.bind(this));
  }

  _clearSketchpad() {
    const [...squares] = canvas.querySelectorAll(".square");
    squares.forEach((s) => (s.style.backgroundColor = this.#color));
  }
}

const app = new App();
