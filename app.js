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
  canvas.color = "#f00";
  canvas.brush.mode = "normal";
  canvas.brush.color = "rgb(0,0,0)";
  // Clean-up UI
  updateBrushMode.bind(btnNormal);
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
  const setBrushCursor = (curName = "brush") =>
    (sketchpad.style.cursor = `url('/assets/images/${curName}.cur'), auto`);

  for (let i = 0; i < canvas.pixels ** 2; i++) {
    let percent = 100; // Used for brush.mode case "shade"
    const div = document.createElement("div");
    div.classList.add("square");
    div.style.backgroundColor = canvas.color;
    div.addEventListener("mouseover", function () {
      setBrushCursor();
      switch (canvas.brush.mode) {
        case "normal":
          return (div.style.backgroundColor = canvas.brush.color);
        case "color":
          const generateRGBVal = () => Math.trunc(Math.random() * 255) + 1;
          const randColor = `rgb(${generateRGBVal()},${generateRGBVal()},${generateRGBVal()})`;
          return (div.style.backgroundColor = randColor);
        case "shade":
          // Starts from white and shades until black (100%)
          const rgbVal = (percent / 100) * 255;
          const shadeColor = `rgb(${rgbVal},${rgbVal},${rgbVal})`;
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
  sketchpad.querySelectorAll(".square").forEach(function (s) {
    s.style.backgroundColor = canvas.color;
  });
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
  if (clicked.classList.contains("selection__btn"))
    updateBrushMode.call(clicked);
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
  canvas.brush.color = inputBrushColor.value;
});

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
