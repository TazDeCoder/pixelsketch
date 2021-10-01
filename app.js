"use strict";

// Selecting elements
const sketchpad = document.querySelector("#sketchpad");
const clearBtn = document.querySelector("#btn--clear");

let numSquares;

function init() {
  // Initial conditons
  numSquares = 16; // Specifies 16x16 grid
  updateSketchpad();
}

function createSquare() {
  let elmnt = document.createElement("div");
  elmnt.classList.add("square");
  return elmnt;
}

function updateSketchpad() {
  for (let i = 0; i < numSquares ** 2; i++) {
    let node = createSquare();
    node.addEventListener("mouseover", function () {
      node.style.backgroundColor = "#000";
    });
    sketchpad.appendChild(node);
    // Creates new grid if numSquares is less than 100
    if (numSquares <= 100) {
      sketchpad.style.gridTemplateRows = `repeat(${numSquares}, 1fr)`;
      sketchpad.style.gridTemplateColumns = `repeat(${numSquares}, 1fr)`;
    }
  }
}

clearBtn.addEventListener("click", function () {
  while (sketchpad.firstChild) {
    sketchpad.removeChild(sketchpad.firstChild);
  }
  numSquares = prompt("Enter Layout Dimension (per side)");
  if (numSquares > 100) {
    alert("Number to High!");
    init();
  } else {
    updateSketchpad();
  }
});

// Main code execution
init();
