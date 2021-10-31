"use strict";

// Selecting HTML elements
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
// Misc.
const sketchpad = document.querySelector(".sketchpad");
// Parents
const selectionModes = document.querySelector(".selection--modes");

// Initial variables
let currMode;

const canvas = {
  pixels: 16,
  color: "#f00",
};
const brush = {
  mode: "normal",
  color: "rgb(0,0,0)",
};

(() => init())();

function init() {
  buildSketchpad();
  updateBrushMode(btnNormal);
}

// Ui Functions
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
  const setBrushCursor = (curName = "brush") =>
    (sketchpad.style.cursor = `url('/assets/images/${curName}.cur'), auto`);

  for (let i = 0; i < canvas.pixels ** 2; i++) {
    let percent = 100; // Used for brush.mode case "shade"
    const div = document.createElement("div");
    div.classList.add("square");
    div.style.backgroundColor = canvas.color;
    div.addEventListener("mouseover", function () {
      setBrushCursor();
      switch (brush.mode) {
        case "normal":
          return (div.style.backgroundColor = brush.color);
        case "color":
          const generateRGBValue = () => Math.trunc(Math.random() * 255) + 1;
          const randomColor = `rgb(${generateRGBValue()},${generateRGBValue()},${generateRGBValue()})`;
          return (div.style.backgroundColor = randomColor);
        case "shade":
          // Starts from white and shades until black (100%)
          const rgbValue = (percent / 100) * 255;
          const shadeColor = `rgb(${rgbValue},${rgbValue},${rgbValue})`;
          div.style.backgroundColor = shadeColor;
          return (percent -= 10);
        case "eraser":
          div.style.backgroundColor = canvas.color;
          return setBrushCursor("eraser");
      }
    });
    sketchpad.appendChild(div);
  }
  sketchpad.style.gridTemplateRows = `repeat(${canvas.pixels}, 1fr`;
  sketchpad.style.gridTemplateColumns = `repeat(${canvas.pixels}, 1fr)`;
}

function updateSketchpad() {
  for (const square of sketchpad.getElementsByClassName("square"))
    square.style.backgroundColor = canvas.color;
}

function updateBrushMode(mode) {
  if (mode.value !== brush.mode) currMode.classList.remove("btn--active");
  brush.mode = mode.value;
  currMode = mode;
  currMode.classList.add("btn--active");
}

// Event Handlers
selectionModes.addEventListener("click", function (e) {
  const clicked = e.target;
  if (clicked.classList.contains("selection__btn")) {
    const [...btns] = this.querySelectorAll(".selection__btn");
    btns.forEach((btn) => btn.classList.remove("selection__btn--active"));
    clicked.classList.add("selection__btn--active");
    currMode = clicked;
    brush.mode = clicked.value;
  }
});

btnClear.addEventListener("click", resetSketchpad);

inputCanvasPixels.addEventListener("blur", function () {
  // Only accepts input if it falls between 1 to 101
  if (inputCanvasPixels.value > 1 && inputCanvasPixels.value < 101)
    canvas.pixels = inputCanvasPixels.value;
  else {
    // Alerts user that input value is too high i.e. above 100
    alert("Number is above 100!");
    inputCanvasPixels.value = canvas.pixels;
  }
  resetSketchpad();
});
inputCanvasColor.addEventListener("blur", function () {
  canvas.color = inputCanvasColor.value;
  updateSketchpad();
});
inputBrushColor.addEventListener("blur", function () {
  brush.color = inputBrushColor.value;
});

// --- KEYBOARD SUPPORT ---
document.addEventListener("keyup", function (e) {
  switch (e.key) {
    case "q":
      return updateBrushMode(btnNormal);
    case "w":
      return updateBrushMode(btnColor);
    case "e":
      return updateBrushMode(btnShade);
    case "d":
      return updateBrushMode(btnEraser);
  }
});
