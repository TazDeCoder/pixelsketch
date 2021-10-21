"use strict";

// Selecting HTML elements
// Buttons
// --- MODES ---
const modeBtns = document
  .querySelector("#btn--modes")
  .getElementsByClassName("btn");
const [btnNormal, btnColor, btnShade, btnEraser] = modeBtns;
// --- OTHERS ---
const btnClear = document.querySelector("#btn--clear");
// Inputs
// --- SETTINGS ---
const iptCanvasPixels = document.querySelector("#canvas--pixels");
const iptCanvasColor = document.querySelector("#canvas--color");
const iptBrushColor = document.querySelector("#brush--color");
// Misc.
const sketchpad = document.querySelector("#sketchpad");

// Initial variables
let currentMode;

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
  if (mode.value !== brush.mode) currentMode.classList.remove("btn--active");
  brush.mode = mode.value;
  currentMode = mode;
  currentMode.classList.add("btn--active");
}

// Event Handlers
for (const mode of modeBtns) {
  mode.addEventListener("click", function () {
    updateBrushMode(mode);
  });
}

btnClear.addEventListener("click", resetSketchpad);

iptCanvasPixels.addEventListener("blur", function () {
  // Only accepts input if it falls between 1 to 101
  if (iptCanvasPixels.value > 1 && iptCanvasPixels.value < 101)
    canvas.pixels = iptCanvasPixels.value;
  else {
    // Alerts user that input value is too high i.e. above 100
    alert("Number is above 100!");
    iptCanvasPixels.value = canvas.pixels;
  }
  resetSketchpad();
});
iptCanvasColor.addEventListener("blur", function () {
  canvas.color = iptCanvasColor.value;
  updateSketchpad();
});
iptBrushColor.addEventListener("blur", function () {
  brush.color = iptBrushColor.value;
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
