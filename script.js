
let canvas = document.getElementById("game");
let ctx = canvas.getContext("2d");
let music = document.getElementById("music");
let skin = "classic", player = "Gast", score = 0, snake = [], direction = "RIGHT", food = {}, interval;

function startGame() {
  skin = document.getElementById("skinSelect").value;
  player = document.getElementById("playerName").value || "Gast";
  snake = [{x: 200, y: 200}];
  food = {x: Math.floor(Math.random()*20)*20, y: Math.floor(Math.random()*20)*20};
  direction = "RIGHT"; score = 0;
  clearInterval(interval);
  interval = setInterval(gameLoop, 150);
}

function drawSegment(s, head=false) {
  ctx.fillStyle = "lime";
  if (skin === "neon") ctx.fillStyle = "cyan";
  if (skin === "fire") ctx.fillStyle = "orange";
  if (skin === "ice") ctx.fillStyle = "#66ccff";
  if (skin === "emoji") ctx.fillText(head ? "🐍" : "🟩", s.x+2, s.y+18);
  else if (skin === "frog") ctx.fillText("🐸", s.x+2, s.y+18);
  else if (skin === "alien") ctx.fillText("👾", s.x+2, s.y+18);
  else if (skin === "patrick") ctx.fillText("🅿️", s.x+2, s.y+18);
  else ctx.fillRect(s.x, s.y, 20, 20);
}

function gameLoop() {
  ctx.clearRect(0, 0, 400, 400);
  let head = {...snake[0]};
  if (direction === "RIGHT") head.x += 20;
  if (direction === "LEFT") head.x -= 20;
  if (direction === "UP") head.y -= 20;
  if (direction === "DOWN") head.y += 20;
  if (head.x < 0 || head.x >= 400 || head.y < 0 || head.y >= 400 || snake.some(s => s.x === head.x && s.y === head.y)) {
    clearInterval(interval);
    alert("Game Over! Punkte: " + score);
    saveScore();
    return;
  }
  snake.unshift(head);
  if (head.x === food.x && head.y === food.y) {
    score++;
    food = {x: Math.floor(Math.random()*20)*20, y: Math.floor(Math.random()*20)*20};
  } else {
    snake.pop();
  }
  snake.forEach((s, i) => drawSegment(s, i===0));
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, 20, 20);
}

document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
});

function toggleMusic() {
  music.paused ? music.play() : music.pause();
}
function toggleTheme() {
  document.body.classList.toggle("dark");
}
function checkAdmin() {
  const pw = document.getElementById("adminPass").value;
  if (pw === "patrickboss") {
    document.getElementById("adminPanel").style.display = "block";
    alert("🛡️ Admin-Modus aktiviert!");
  } else {
    alert("❌ Falsches Passwort");
  }
}
function saveScore() {
  const data = JSON.parse(localStorage.getItem("scores") || "[]");
  data.push({player, score, date: new Date().toLocaleDateString()});
  localStorage.setItem("scores", JSON.stringify(data.slice(-10)));
  updateLeaderboard();
}
function resetScores() {
  localStorage.removeItem("scores");
  updateLeaderboard();
}
function updateLeaderboard() {
  const list = document.getElementById("scores");
  list.innerHTML = "";
  (JSON.parse(localStorage.getItem("scores") || "[]")).sort((a,b)=>b.score-a.score).forEach(e => {
    const li = document.createElement("li");
    li.textContent = `${e.player}: ${e.score} (${e.date})`;
    list.appendChild(li);
  });
}
window.onload = updateLeaderboard;
