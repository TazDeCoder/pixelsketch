"use strict";

////////////////////////////////////////////////
////// Selecting HTML elements
///////////////////////////////////////////////

// Buttons
const btnNormal = document.querySelector(".selection__btn--normal");
const btnColor = document.querySelector(".selection__btn--color");
const btnShade = document.querySelector(".selection__btn--shade");
const btnEraser = document.querySelector(".selection__btn--eraser");
const btnClear = document.querySelector(".btn--clear");
// Inputs
const inputCanvasPixels = document.querySelector(
  ".options__input--canvas-pixels"
);
const inputBrushColor = document.querySelector(".options__input--brush-color");
const inputCanvasColor = document.querySelector(
  ".options__input--canvas-color"
);
// Parents
const sketchpad = document.querySelector(".sketchpad");
const selectionModes = document.querySelector(".selection--modes");

////////////////////////////////////////////////
////// Global variables
///////////////////////////////////////////////

const canvas = {
  pixels: 0,
  color: "",
  brush: {
    mode: "",
    color: "",
  },
};

////////////////////////////////////////////////
////// App UI Setup
///////////////////////////////////////////////

(() => init())();

function init() {
  // Reset app
  canvas.pixels = 16;
  canvas.color = "#f7f7f7";
  canvas.brush.mode = "normal";
  canvas.brush.color = "#000000";
  // Clean-up UI
  inputCanvasPixels.value = canvas.pixels;
  inputBrushColor.value = canvas.brush.color;
  inputCanvasColor.value = canvas.color;
  updateBrushMode.call(btnNormal);
  buildSketchpad();
}

function resetSketchpad() {
  destroySketchpad();
  buildSketchpad();
}

function destroySketchpad() {
  // Destroys canvas child nodes
  while (sketchpad.firstChild) {
    sketchpad.removeChild(sketchpad.firstChild);
  }
}

function buildSketchpad() {
  for (let i = 0; i < canvas.pixels ** 2; i++) {
    const div = document.createElement("div");
    div.classList.add("square");
    div.style.backgroundColor = canvas.color;
    div.setAttribute("data-percent", "100");
    div.addEventListener("mouseover", handleBrushHover);
    sketchpad.appendChild(div);
  }
  sketchpad.style.gridTemplateRows = `repeat(${canvas.pixels}, 1fr`;
  sketchpad.style.gridTemplateColumns = `repeat(${canvas.pixels}, 1fr)`;
}

function setBrushCursor(curName) {
  sketchpad.style.cursor = `url('/assets/images/${curName}.cur'), auto`;
}

////////////////////////////////////////////////
////// App Logic
///////////////////////////////////////////////

function handleBrushHover() {
  setBrushCursor("brush");
  switch (canvas.brush.mode) {
    case "normal":
      this.style.backgroundColor = canvas.brush.color;
      break;
    case "color":
      this.style.backgroundColor = generateRandColor(0, 255);
      break;
    case "shade":
      this.style.backgroundColor = generateShadeColor(this.dataset.percent);
      this.dataset.percent -= 10;
      break;
    case "eraser":
      this.style.backgroundColor = canvas.color;
      setBrushCursor("eraser");
  }
}

function generateRandColor(min, max) {
  const rgbVal = () => Math.trunc(Math.random() * (max - min)) + min;
  return `rgb(${rgbVal()},${rgbVal()},${rgbVal()})`;
}

function generateShadeColor(val) {
  const rgbVal = (val / 100) * 255;
  return `rgb(${rgbVal},${rgbVal},${rgbVal})`;
}

////////////////////////////////////////////////
////// Event Handlers
///////////////////////////////////////////////

function updateBrushMode() {
  const [...btns] = selectionModes.querySelectorAll(".selection__btn");
  btns.forEach((btn) => btn.classList.remove("selection__btn--active"));
  this.classList.add("selection__btn--active");
  canvas.brush.mode = this.value;
}

selectionModes.addEventListener("click", function (e) {
  const clicked = e.target;
  if (!clicked) return;
  if (clicked.classList.contains("selection__btn"))
    updateBrushMode.call(clicked);
});

inputCanvasPixels.addEventListener("blur", function () {
  // Only accepts input if it falls between 1 to 101
  if (inputCanvasPixels.value > 1 && inputCanvasPixels.value < 101)
    canvas.pixels = inputCanvasPixels.value;
  else {
    alert("Number is above 100!");
    inputCanvasPixels.value = canvas.pixels;
  }
  resetSketchpad();
});

inputCanvasColor.addEventListener("input", function () {
  canvas.color = inputCanvasColor.value;
  const [...squares] = sketchpad.querySelectorAll(".square");
  squares.forEach((s) => (s.style.backgroundColor = canvas.color));
});

inputBrushColor.addEventListener("input", function () {
  canvas.brush.color = inputBrushColor.value;
});

btnClear.addEventListener("click", resetSketchpad);

// --- KEYBOARD SUPPORT ---

document.addEventListener("keyup", function (e) {
  switch (e.key) {
    case "q":
      return updateBrushMode.call(btnNormal);
    case "w":
      return updateBrushMode.call(btnColor);
    case "e":
      return updateBrushMode.call(btnShade);
    case "d":
      return updateBrushMode.call(btnEraser);
  }
});
