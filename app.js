"use strict";

// Selecting elements
const sketchpad = document.querySelector("#sketchpad");
// Buttons
// --- BRUSH MODES
const modeBtns = document
  .querySelector("#btn--modes")
  .getElementsByClassName("btn");
const [normalBtn, colorBtn, shadeBtn, eraserBtn] = modeBtns;
const clearBtn = document.querySelector("#btn--clear");
// Inputs
// --- SETTINGS
const canvasPixelsIpt = document.querySelector("#canvas--pixels");
const canvasColorIpt = document.querySelector("#canvas--color");
const brushColorIpt = document.querySelector("#brush--color");

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
  updateBrushMode();
}

// Sketchpad functions
function resetSketchpad() {
  destroySketchpad();
  buildSketchpad();
  updateSketchpad();
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
    div.className = "square";
    div.style.backgroundColor = canvas.color;
    sketchpad.appendChild(div);
    sketchpad.style.gridTemplateRows = `repeat(${canvas.pixels}, 1fr`;
    sketchpad.style.gridTemplateColumns = `repeat(${canvas.pixels}, 1fr)`;
  }
}

function updateSketchpad() {
  const setBrushCursor = (cursorName = "brush") =>
    (sketchpad.style.cursor = `url('/assets/images/${cursorName}.cur'), auto`);
  for (const square of sketchpad.getElementsByClassName("square")) {
    const setSquareColor = (color) => (square.style.backgroundColor = color);
    let percent = 100; // Used for brush.mode shade
    square.addEventListener("mouseover", function () {
      setBrushCursor();
      switch (brush.mode) {
        case "normal":
          return setSquareColor(brush.color);
        case "color":
          const generateRGBValue = () => Math.trunc(Math.random() * 255) + 1;
          const randomColor = `rgb(${generateRGBValue()},${generateRGBValue()},${generateRGBValue()})`;
          setSquareColor(randomColor);
          break;
        case "shade":
          // Starts from white and shades until black
          const rgbValue = (percent / 100) * 255;
          const shadeColor = `rgb(${rgbValue},${rgbValue},${rgbValue})`;
          setSquareColor(shadeColor);
          percent -= 10;
          break;
        case "eraser":
          setSquareColor(canvas.color);
          setBrushCursor("eraser");
          break;
      }
    });
  }
}

// Brush functions
function updateBrushMode(mode = normalBtn) {
  if (mode.value !== brush.mode) currentMode.classList.remove("btn--active");
  brush.mode = mode.value;
  currentMode = mode;
  currentMode.classList.add("btn--active");
  updateSketchpad();
}

// Button functionalities
for (const mode of modeBtns) {
  mode.addEventListener("click", function () {
    updateBrushMode(mode);
  });
}

clearBtn.addEventListener("click", resetSketchpad);

// --- KEYBOARD SUPPORT
document.addEventListener("keyup", function (e) {
  switch (e.key) {
    case "q":
      return updateBrushMode();
    case "w":
      return updateBrushMode(colorBtn);
    case "e":
      return updateBrushMode(shadeBtn);
    case "d":
      return updateBrushMode(eraserBtn);
  }
});

// Input functionalities
canvasPixelsIpt.addEventListener("blur", function () {
  if (canvasPixelsIpt.value <= 100) canvas.pixels = canvasPixelsIpt.value;
  else {
    alert("Number is above 100!");
    canvasPixelsIpt.value = canvas.pixels;
  }
  resetSketchpad();
});
canvasColorIpt.addEventListener("blur", function () {
  canvas.color = canvasColorIpt.value;
});
brushColorIpt.addEventListener("blur", function () {
  brush.color = brushColorIpt.value;
});
