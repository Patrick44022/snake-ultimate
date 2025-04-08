
let canvas = document.getElementById("game");
let ctx = canvas.getContext("2d");
let direction = "RIGHT";
let snake = [{x: 200, y: 200}];
let food = {x: 100, y: 100};
let interval;
let skin = "classic";
let score = 0;

document.getElementById("startBtn").addEventListener("click", () => {
  skin = document.getElementById("skinSelect").value;
  snake = [{x: 200, y: 200}];
  food = {x: 100, y: 100};
  score = 0;
  direction = "RIGHT";
  clearInterval(interval);
  interval = setInterval(gameLoop, 150);
});

document.getElementById("themeBtn").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

document.getElementById("musicBtn").addEventListener("click", () => {
  let music = document.getElementById("music");
  music.paused ? music.play() : music.pause();
});

document.getElementById("adminBtn").addEventListener("click", () => {
  const pass = document.getElementById("adminPass").value;
  if (pass === "patrickboss") {
    alert("🛡️ Admin-Modus aktiviert!");
  } else {
    alert("❌ Falsches Passwort!");
  }
});

document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
});

function drawSegment(s, head = false) {
  if (skin === "emoji") {
    ctx.font = "20px serif";
    ctx.fillText(head ? "🐍" : "🟩", s.x + 2, s.y + 18);
  } else if (skin === "neon") {
    ctx.fillStyle = head ? "cyan" : "magenta";
    ctx.fillRect(s.x, s.y, 20, 20);
  } else if (skin === "frog") {
    ctx.font = "20px serif";
    ctx.fillText("🐸", s.x + 2, s.y + 18);
  } else if (skin === "alien") {
    ctx.font = "20px serif";
    ctx.fillText("👾", s.x + 2, s.y + 18);
  } else if (skin === "fire") {
    ctx.fillStyle = "orange";
    ctx.fillRect(s.x, s.y, 20, 20);
  } else if (skin === "ice") {
    ctx.fillStyle = "#66ccff";
    ctx.fillRect(s.x, s.y, 20, 20);
  } else if (skin === "crystal") {
    ctx.fillStyle = "#00ffff";
    ctx.fillRect(s.x, s.y, 20, 20);
  } else if (skin === "patrick") {
    ctx.font = "20px serif";
    ctx.fillText("🅿️", s.x + 2, s.y + 18);
  } else {
    ctx.fillStyle = "lime";
    ctx.fillRect(s.x, s.y, 20, 20);
  }
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let head = {...snake[0]};
  if (direction === "RIGHT") head.x += 20;
  if (direction === "LEFT") head.x -= 20;
  if (direction === "UP") head.y -= 20;
  if (direction === "DOWN") head.y += 20;

  if (head.x < 0 || head.x >= 400 || head.y < 0 || head.y >= 400 || snake.some(s => s.x === head.x && s.y === head.y)) {
    clearInterval(interval); alert("Game Over! Score: " + score); return;
  }

  snake.unshift(head);
  if (head.x === food.x && head.y === food.y) {
    score++;
    food = {x: Math.floor(Math.random()*20)*20, y: Math.floor(Math.random()*20)*20};
  } else {
    snake.pop();
  }

  snake.forEach((s, i) => drawSegment(s, i === 0));
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, 20, 20);
}
