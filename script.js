
const { createClient } = supabase;
const supabaseUrl = "https://cimflibckeqersptrdam.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpbWZsaWJja2VxZXJzcHRyZGFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxMzg5NDksImV4cCI6MjA1OTcxNDk0OX0.uHuXcGcaxaQAzpykCShBTp48a2mCaAJ7QUAZLKx2o50";
const db = createClient(supabaseUrl, supabaseKey);

let canvas = document.getElementById("game");
let ctx = canvas.getContext("2d");
let music = document.getElementById("music");
let skin = "classic", player = "Gast", score = 0, snake = [], direction = "RIGHT", food = {}, interval;

document.getElementById("adminBtn").onclick = () => {
  const pw = document.getElementById("adminPass").value;
  if (pw === "patrickboss") {
    document.getElementById("adminPanel").style.display = "block";
    alert("🛡️ Admin aktiviert!");
  } else alert("❌ Falsches Passwort!");
};

document.getElementById("setFood").onclick = () => {
  food = { 
    x: parseInt(document.getElementById("foodX").value), 
    y: parseInt(document.getElementById("foodY").value)
  };
};

document.getElementById("setSnake").onclick = () => {
  const len = parseInt(document.getElementById("snakeLength").value);
  snake = Array.from({length: len}, (_, i) => ({x: 200 - i * 20, y: 200}));
};

document.getElementById("gameSpeed").onchange = () => {
  clearInterval(interval);
  interval = setInterval(gameLoop, parseInt(document.getElementById("gameSpeed").value));
};

document.getElementById("resetBtn").onclick = () => {
  localStorage.removeItem("scores");
  updateLeaderboard();
};

function startGame() {
  skin = document.getElementById("skinSelect").value;
  player = document.getElementById("playerName").value || "Gast";
  snake = [{x: 200, y: 200}];
  food = {x: Math.floor(Math.random()*20)*20, y: Math.floor(Math.random()*20)*20};
  direction = "RIGHT"; score = 0;
  clearInterval(interval);
  interval = setInterval(gameLoop, parseInt(document.getElementById("gameSpeed").value));
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
  } else snake.pop();
  snake.forEach(s => ctx.fillRect(s.x, s.y, 20, 20));
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, 20, 20);
}

document.addEventListener("keydown", e => {
  const keys = {"ArrowUp":"DOWN","ArrowDown":"UP","ArrowLeft":"RIGHT","ArrowRight":"LEFT"};
  if(direction!==keys[e.key]) direction = e.key.replace("Arrow","").toUpperCase();
});

function saveScore() {
  db.from('highscores').insert([{ player_name: player, score: score }]);
  updateLeaderboard();
}

async function updateLeaderboard() {
  const { data } = await db.from('highscores').select("*").order('score', { ascending: false }).limit(10);
  document.getElementById("scores").innerHTML = data.map(e => `<li>${e.player_name}: ${e.score}</li>`).join("");
}

db.channel('realtime:scores').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'highscores' }, updateLeaderboard).subscribe();

window.onload = () => {
  document.getElementById("startBtn").onclick = startGame;
  document.getElementById("musicBtn").onclick = () => music.paused ? music.play() : music.pause();
  document.getElementById("themeBtn").onclick = () => document.body.classList.toggle("dark");
  updateLeaderboard();
};
