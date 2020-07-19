import "./styles.css";

let ctx;
let grid;
let cols;
let rows;
const totalWidth = window.innerWidth >= 600 ? 600 : window.innerWidth - 24;
const width = totalWidth - (totalWidth % 10);
const height = width;
const resolution = 10;

let intervalId;

function createCanvas(w, h) {
  const canvas = document.createElement("canvas");
  const rootEle = document.getElementById("app");

  canvas.width = w;
  canvas.height = h;
  canvas.id = "canvas";
  canvas.style = "border:1px solid black;";
  ctx = canvas.getContext("2d");
  rootEle.appendChild(canvas);
}

function createGrid(cols, rows) {
  let t = new Array(cols);

  for (let i = 0; i < cols; i++) {
    t[i] = new Array(rows);
  }
  return t;
}

function setup() {
  createCanvas(width, height);
  cols = Math.floor(width / resolution);
  rows = Math.floor(height / resolution);
  grid = createGrid(cols, rows);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = Math.floor(Math.random() * 2) + 0;
    }
  }

  document.querySelector(".start").addEventListener("click", start);
  document.querySelector(".stop").addEventListener("click", stop);
}

function draw() {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * resolution;
      let y = j * resolution;

      ctx.beginPath();
      if (grid[i][j] === 1) {
        ctx.fillStyle = "black";
        ctx.fillRect(y, x, resolution, resolution);
      } else {
        ctx.strokeStyle = "black";
        ctx.strokeRect(y, x, resolution, resolution);
      }
    }
  }

  let next = createGrid(cols, rows);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let c = count(i, j);

      if (grid[i][j] === 0 && c === 3) {
        next[i][j] = 1;
      } else if (grid[i][j] === 1 && (c < 2 || c > 3)) {
        next[i][j] = 0;
      } else {
        next[i][j] = grid[i][j];
      }
    }
  }
  grid = next;
}

function count(i, j) {
  let c = 0;
  for (let x = -1; x < 2; x++) {
    for (let y = -1; y < 2; y++) {
      let col = (x + i + cols) % cols;
      let row = (y + j + rows) % rows;
      c += grid[col][row];
    }
  }
  c -= grid[i][j];
  return c;
}

setup();
draw();

function start() {
  intervalId = setInterval(() => {
    ctx.clearRect(0, 0, width, height);
    draw();
  }, 1000 / 60);
}

function stop() {
  clearInterval(intervalId);
}
