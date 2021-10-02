"use strict";

// Selecting elements
const sketchpad = document.querySelector("#sketchpad");
// Buttons
const clearBtn = document.querySelector("#btn--clear");
const normalBtn = document.querySelector("#btn--normal");
const colorBtn = document.querySelector("#btn--color");
const shadeBtn = document.querySelector("#btn--shade");
const eraserBtn = document.querySelector("#btn--eraser");
// Inputs
const squareQtyInput = document.querySelector("#square--qty");
const squareColorInput = document.querySelector("#square--color");
const brushColorInput = document.querySelector("#brush--color");

let squareQty, squareColor, brush, brushColor;

function init() {
  // Initial conditons
  squareQty = 16; // Specifies 16x16 grid
  squareColor = "#f00";
  brush = "normal";
  brushColor = "rgb(0,0,0)";
  updateSketchpad();
}

function createSquare() {
  let elmnt = document.createElement("div");
  elmnt.className = "square";
  elmnt.style.backgroundColor = squareColor;
  return elmnt;
}

function updateSketchpad() {
  for (let i = 0; i < squareQty ** 2; i++) {
    let node = createSquare();
    let percent = 100;
    node.addEventListener("mouseover", function () {
      switch (brush) {
        case "normal":
          node.style.backgroundColor = brushColor;
          break;
        case "color":
          node.style.backgroundColor = randomColor();
          break;
        case "shade":
          let newColor = darkerShade(percent);
          node.style.backgroundColor = newColor;
          percent -= 10;
          break;
        case "eraser":
          node.style.backgroundColor = squareColor;
          break;
      }
    });
    sketchpad.appendChild(node);
    sketchpad.style.gridTemplateRows = `repeat(${squareQty}, 1fr)`;
    sketchpad.style.gridTemplateColumns = `repeat(${squareQty}, 1fr)`;
  }
}

// Color functions
function randomColor() {
  const generateRGBValue = () => Math.trunc(Math.random() * 255) + 1;
  let red = generateRGBValue();
  let blue = generateRGBValue();
  let green = generateRGBValue();
  let backgroundColor = `rgb(${red},${blue},${green})`;
  return backgroundColor;
}

function darkerShade(percent) {
  let rgbValue = (percent / 100) * 255;
  return `rgb(${rgbValue},${rgbValue},${rgbValue})`;
}

// Button functionalities
clearBtn.addEventListener("click", function () {
  while (sketchpad.firstChild) {
    sketchpad.removeChild(sketchpad.firstChild);
  }
  updateSketchpad();
});

normalBtn.addEventListener("click", function () {
  if (brush !== "normal") {
    colorBtn.classList.remove("btn--active");
    shadeBtn.classList.remove("btn--active");
    eraserBtn.classList.remove("btn--active");
  }
  brush = "normal";
  updateSketchpad();
  normalBtn.classList.add("btn--active");
});

colorBtn.addEventListener("click", function () {
  if (brush !== "color") {
    normalBtn.classList.remove("btn--active");
    shadeBtn.classList.remove("btn--active");
    eraserBtn.classList.remove("btn--active");
  }
  brush = "color";
  updateSketchpad();
  colorBtn.classList.add("btn--active");
});

shadeBtn.addEventListener("click", function () {
  if (brush !== "shade") {
    normalBtn.classList.remove("btn--active");
    colorBtn.classList.remove("btn--active");
    eraserBtn.classList.remove("btn--active");
  }
  brush = "shade";
  updateSketchpad();
  shadeBtn.classList.add("btn--active");
});

eraserBtn.addEventListener("click", function () {
  if (brush !== "eraser") {
    normalBtn.classList.remove("btn--active");
    colorBtn.classList.remove("btn--active");
    shadeBtn.classList.remove("btn--active");
  }
  brush = "eraser";
  updateSketchpad();
  eraserBtn.classList.add("btn--active");
});

// Input functionalities
squareQtyInput.addEventListener("blur", function () {
  while (sketchpad.firstChild) {
    sketchpad.removeChild(sketchpad.firstChild);
  }
  if (squareQtyInput.value <= 100) {
    squareQty = squareQtyInput.value;
    updateSketchpad();
  } else {
    alert("Number is above 100!");
    squareQtyInput.value = squareQty;
    updateSketchpad();
  }
});

squareColorInput.addEventListener("blur", function () {
  while (sketchpad.firstChild) {
    sketchpad.removeChild(sketchpad.firstChild);
  }
  squareColor = squareColorInput.value;
  updateSketchpad();
});

brushColorInput.addEventListener("blur", function () {
  brushColor = brushColorInput.value;
});

// Main code execution
init();
