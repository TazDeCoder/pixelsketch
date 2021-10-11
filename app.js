"use strict";

// Selecting elements
const sketchpad = document.querySelector("#sketchpad");
// Buttons
const clearBtn = document.querySelector("#btn--clear");
// --- BRUSH MODES
const modeBtns = document
  .querySelector("#btn--modes")
  .getElementsByClassName("btn");
const [normalBtn, colorBtn, shadeBtn, eraserBtn] = modeBtns;
// Inputs --- SETTINGS
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

function init() {
  currentMode = normalBtn;
  currentMode.classList.add("btn--active");
  updateCanvas();
}

function createSquare() {
  // Creates a new div element with square attributes
  const div = document.createElement("div");
  div.className = "square";
  div.style.backgroundColor = canvas.color;
  return div;
}

function updateSketchpad() {
  for (let i = 0; i < canvas.pixels ** 2; i++) {
    const node = createSquare();
    sketchpad.appendChild(node);
    sketchpad.style.gridTemplateRows = `repeat(${canvas.pixels}, 1fr`;
    sketchpad.style.gridTemplateColumns = `repeat(${canvas.pixels}, 1fr)`;
  }
}

function clearSketchpad() {
  // Destroys canvas child nodes
  while (sketchpad.firstChild) {
    sketchpad.removeChild(sketchpad.firstChild);
  }
}

function resetSketchpad() {
  clearSketchpad();
  updateSketchpad();
}

function setCursor(cursorName = "brush") {
  sketchpad.style.cursor = `url('/assets/images/${cursorName}.cur'), auto`;
}

function updateBrushMode() {
  for (const square of sketchpad.getElementsByClassName("square")) {
    const setSquareColor = (color) => (square.style.backgroundColor = color);
    let percent = 100; // Used for brush.mode shade
    square.addEventListener("mouseover", function () {
      setCursor();
      switch (brush.mode) {
        case "normal":
          setSquareColor(brush.color);
          break;
        case "color":
          setSquareColor(randomColor());
          break;
        case "shade":
          const shadeColor = darkerShade(percent);
          setSquareColor(shadeColor);
          percent -= 10;
          break;
        case "eraser":
          setSquareColor(canvas.color);
          setCursor("eraser");
          break;
      }
    });
  }
}

function updateCanvas() {
  updateSketchpad();
  updateBrushMode();
}

// Color functions
function randomColor() {
  const generateRGBValue = () => Math.trunc(Math.random() * 255) + 1;
  return `rgb(${generateRGBValue()},${generateRGBValue()},${generateRGBValue()})`;
}
function darkerShade(percent) {
  // Starts from white and shades until black
  const rgbValue = (percent / 100) * 255;
  return `rgb(${rgbValue},${rgbValue},${rgbValue})`;
}

// Button functionalities
clearBtn.addEventListener("click", function () {
  currentMode.classList.remove("btn--active");
  resetSketchpad();
});
for (const mode of modeBtns) {
  mode.addEventListener("click", function () {
    if (mode.value !== brush.mode) currentMode.classList.remove("btn--active");
    brush.mode = mode.value;
    currentMode = mode;
    currentMode.classList.add("btn--active");
    updateCanvas();
  });
}
// --- KEYBOARD SUPPORT
document.addEventListener("keydown", function (e) {
  let mode;
  switch (e.key) {
    case "q":
      brush.mode = "normal";
      mode = normalBtn;
      break;
    case "w":
      brush.mode = "color";
      mode = colorBtn;
      break;
    case "e":
      brush.mode = "shade";
      mode = shadeBtn;
      break;
    case "d":
      brush.mode = "eraser";
      mode = eraserBtn;
      break;
  }
  if (currentMode.value !== brush.mode) {
    currentMode.classList.remove("btn--active");
    currentMode = mode;
    currentMode.classList.add("btn--active");
    updateCanvas();
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
  resetSketchpad();
});
brushColorIpt.addEventListener("blur", function () {
  brush.color = brushColorIpt.value;
});

// Main code execution
init();
