const playerBoat = document.getElementById('player-boat');
const countdownElement = document.getElementById('countdown');
const messageElement = document.getElementById('message');
const finishLine = document.getElementById('finish-line');

let playerX = 50;
let playerY = 80;
let gameStarted = false;
let countdown = 3;
let gameInterval;
let obstacles = [];
let obstacleSpawner;

// Move player boat left and right
document.addEventListener('keydown', (e) => {
  if (!gameStarted) return;

  if (e.key === 'ArrowLeft' && playerX > 5) {
    playerX -= 5;
  } else if (e.key === 'ArrowRight' && playerX < 95) {
    playerX += 5;
  }
  playerBoat.style.left = `${playerX}%`;
});

// Countdown before starting the game
function startGame() {
  countdownElement.textContent = countdown;
  if (countdown > 0) {
    countdown--;
    setTimeout(startGame, 1000);
  } else {
    countdownElement.style.display = 'none';
    gameStarted = true;
    finishLine.style.display = 'block';
    gameInterval = setInterval(updateGame, 30);
    obstacleSpawner = setInterval(createObstacles, 2000);
  }
}

// Generate obstacles (enemy boats)
function createObstacles() {
  if (!gameStarted) return;

  // Limit the number of active obstacles to avoid cluttering the screen
  if (obstacles.length >= 5) return;

  const obstacle = document.createElement('div');
  obstacle.className = 'obstacle';
  obstacle.style.left = `${Math.random() * 80}%`;
  obstacle.style.top = '-120px';
  document.querySelector('.game-container').appendChild(obstacle);
  obstacles.push(obstacle);

  let obstacleY = -120;
  const obstacleInterval = setInterval(() => {
    if (!gameStarted) {
      clearInterval(obstacleInterval);
      return;
    }

    obstacleY += 3.5;
    obstacle.style.top = `${obstacleY}px`;

    // Check collision
    if (checkCollision(playerBoat, obstacle)) {
      clearInterval(obstacleInterval);
      endGame(false);
    }

    if (obstacleY > window.innerHeight) {
      obstacle.remove();
      obstacles = obstacles.filter(o => o !== obstacle);
    }
  }, 30);
}

// Accurate collision detection
function checkCollision(player, obstacle) {
  const playerRect = player.getBoundingClientRect();
  const obstacleRect = obstacle.getBoundingClientRect();

  return (
    playerRect.bottom > obstacleRect.top &&
    playerRect.top < obstacleRect.bottom &&
    playerRect.right > obstacleRect.left &&
    playerRect.left < obstacleRect.right
  );
}

// Update game mechanics
function updateGame() {
  if (!gameStarted) return;

  playerY -= 0.5;
  playerBoat.style.top = `${playerY}%`;

  if (playerY <= 5) {
    endGame(true);
  }
}

// End game (win or lose)
function endGame(success) {
  clearInterval(gameInterval);
  clearInterval(obstacleSpawner);
  gameStarted = false;

  if (success) {
    messageElement.textContent = 'HAPPY BIRTHDAY CHAMP! I LOVE YOU <3';
  } else {
    messageElement.textContent = 'You crashed! Try again!';
  }

  messageElement.style.display = 'block';

  setTimeout(() => {
    messageElement.style.display = 'none';
    resetGame();
  }, 3000);
}

// Reset game state
function resetGame() {
  playerX = 50;
  playerY = 80;
  playerBoat.style.left = '50%';
  playerBoat.style.top = '80%';
  countdown = 3;
  countdownElement.style.display = 'block';
  finishLine.style.display = 'none';

  // Remove all existing obstacles to avoid screen clutter
  document.querySelectorAll('.obstacle').forEach(obstacle => obstacle.remove());
  obstacles = [];

  startGame();
}

// Start the game
startGame();
