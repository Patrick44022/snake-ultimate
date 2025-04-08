
let canvas = document.getElementById("game");
let ctx = canvas.getContext("2d");
let skin = "classic", player = "Gast";
let direction = "RIGHT", snake = [{x: 200, y: 200}], food = {x: 100, y: 100}, score = 0;
let interval, admin = false;

function startGame() {
  skin = document.getElementById("skinSelect").value;
  player = document.getElementById("playerName").value || "Gast";
  score = 0;
  direction = "RIGHT";
  snake = [{x: 200, y: 200}];
  food = {x: 100, y: 100};
  clearInterval(interval);
  interval = setInterval(gameLoop, 150);
}

function draw(s, isHead) {
  ctx.fillStyle = isHead ? "lime" : (skin === "neon" ? "cyan" : "green");
  ctx.fillRect(s.x, s.y, 20, 20);
}

function gameLoop() {
  ctx.clearRect(0, 0, 400, 400);
  let head = {...snake[0]};
  if (direction === "RIGHT") head.x += 20;
  if (direction === "LEFT") head.x -= 20;
  if (direction === "UP") head.y -= 20;
  if (direction === "DOWN") head.y += 20;
  if (head.x < 0 || head.x >= 400 || head.y < 0 || head.y >= 400 || snake.some(s => s.x === head.x && s.y === head.y)) {
    clearInterval(interval); alert("Game Over!"); return;
  }
  snake.unshift(head);
  if (head.x === food.x && head.y === food.y) {
    score++; food = {x: Math.floor(Math.random()*20)*20, y: Math.floor(Math.random()*20)*20};
  } else { snake.pop(); }
  snake.forEach((s, i) => draw(s, i === 0));
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, 20, 20);
}

document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
});

function toggleTheme() { document.body.classList.toggle("dark"); }
function toggleMusic() {
  let music = document.getElementById("music");
  music.paused ? music.play() : music.pause();
}
function checkAdmin() {
  const pass = document.getElementById("adminPass").value;
  if (pass === "patrickboss") alert("🎉 Admin-Modus aktiviert!");
  else alert("❌ Falsches Passwort");
}
