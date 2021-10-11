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
  // Reset conditons
  currentMode = normalBtn;
  currentMode.classList.add("btn--active");
  canvas.pixels = 16; // Specifies 16x16 grid
  canvas.color = "#f00";
  brush.mode = "normal";
  brush.color = "rgb(0,0,0)";
  updateSketchpad();
  updateBrushMode();
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

function updateBrushMode() {
  for (const node of sketchpad.getElementsByClassName("square")) {
    let percent = 100; // Used for brush shade mode
    node.addEventListener("mouseover", function () {
      switch (brush.mode) {
        case "normal":
          node.style.backgroundColor = brush.color;
          sketchpad.style.cursor = 'url("/assets/images/brush.cur"), auto';
          break;
        case "color":
          node.style.backgroundColor = randomColor();
          sketchpad.style.cursor = 'url("/assets/images/brush.cur"), auto';
          break;
        case "shade":
          const newColor = darkerShade(percent);
          node.style.backgroundColor = newColor;
          sketchpad.style.cursor = 'url("/assets/images/brush.cur"), auto';
          percent -= 10;
          break;
        case "eraser":
          node.style.backgroundColor = canvas.color;
          sketchpad.style.cursor = 'url("/assets/images/eraser.cur"), auto';
          break;
      }
    });
  }
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
  clearSketchpad();
  updateSketchpad();
});
for (const mode of modeBtns) {
  mode.addEventListener("click", function () {
    if (mode.value !== brush.mode) currentMode.classList.toggle("btn--active");
    mode.classList.add("btn--active");
    currentMode = mode;
    brush.mode = mode.value;
    updateSketchpad();
    updateBrushMode();
  });
}
// --- KEYBOARD SUPPORT
document.addEventListener("keydown", function (e) {
  switch (e.key) {
    case "b":
      brush.mode = "normal";
      if (currentMode.value !== brush.mode)
        currentMode.classList.toggle("btn--active");
      currentMode = normalBtn;
      currentMode.classList.add("btn--active");
      break;
    case "c":
      brush.mode = "color";
      if (currentMode.value !== brush.mode)
        currentMode.classList.toggle("btn--active");
      currentMode = colorBtn;
      currentMode.classList.add("btn--active");
      break;
    case "s":
      brush.mode = "shade";
      if (currentMode.value !== brush.mode)
        currentMode.classList.toggle("btn--active");
      currentMode = shadeBtn;
      currentMode.classList.add("btn--active");
      break;
    case "e":
      brush.mode = "eraser";
      if (currentMode.value !== brush.mode)
        currentMode.classList.toggle("btn--active");
      currentMode = eraserBtn;
      currentMode.classList.add("btn--active");
      break;

      updateSketchpad();
      updateBrushMode();
  }
});

// Input functionalities
canvasPixelsIpt.addEventListener("blur", function () {
  clearSketchpad();
  if (canvasPixelsIpt.value <= 100) canvas.pixels = canvasPixelsIpt.value;
  else {
    alert("Number is above 100!");
    canvasPixelsIpt.value = canvas.pixels;
  }
  updateSketchpad();
});
canvasColorIpt.addEventListener("blur", function () {
  clearSketchpad();
  canvas.color = canvasColorIpt.value;
  updateSketchpad();
});
brushColorIpt.addEventListener("blur", function () {
  brush.color = brushColorIpt.value;
});

// Main code execution
init();
