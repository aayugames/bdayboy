const boat = document.getElementById('boat');
const countdownElement = document.getElementById('countdown');
const messageElement = document.getElementById('message');
const finishLine = document.getElementById('finish-line');
let boatPosition = 50;
let gameStarted = false;
let countdown = 3;
let gameInterval;

// Move boat left and right
document.addEventListener('keydown', (e) => {
  if (!gameStarted) return;

  if (e.key === 'ArrowLeft' && boatPosition > 0) {
    boatPosition -= 5;
  } else if (e.key === 'ArrowRight' && boatPosition < 95) {
    boatPosition += 5;
  }
  boat.style.left = `${boatPosition}%`;
});

// Countdown and start game
function startGame() {
  countdownElement.textContent = countdown;
  if (countdown > 0) {
    countdown--;
    setTimeout(startGame, 1000);
  } else {
    countdownElement.style.display = 'none';
    gameStarted = true;
    gameInterval = setInterval(updateGame, 20);
    moveObstacles();
  }
}

// Obstacle logic
function moveObstacles() {
  const obstacle = document.createElement('div');
  obstacle.className = 'obstacle';
  obstacle.style.left = `${Math.random() * 90}%`;
  document.querySelector('.game-container').appendChild(obstacle);

  let obstaclePosition = 0;
  const obstacleInterval = setInterval(() => {
    obstaclePosition += 1;
    obstacle.style.top = `${obstaclePosition}%`;

    // Check for collision
    if (
      obstaclePosition > 80 &&
      boatPosition > parseFloat(obstacle.style.left) - 5 &&
      boatPosition < parseFloat(obstacle.style.left) + 5
    ) {
      clearInterval(obstacleInterval);
      endGame(false);
    }

    // Remove obstacle if it goes off screen
    if (obstaclePosition > 100) {
      obstacle.remove();
    }
  }, 20);

  if (gameStarted) {
    setTimeout(moveObstacles, 2000);
  }
}

// Update game state
function updateGame() {
  if (boatPosition >= 75) {
    endGame(true);
  }
}

// End game logic
function endGame(success) {
  clearInterval(gameInterval);
  gameStarted = false;
  if (success) {
    messageElement.textContent = 'HAPPY BIRTHDAY CHAMP! I LOVE YOU.';
  } else {
    messageElement.textContent = 'Try again!';
  }
  messageElement.style.display = 'block';
  setTimeout(() => {
    messageElement.style.display = 'none';
    resetGame();
  }, 3000);
}

// Reset game
function resetGame() {
  boatPosition = 50;
  boat.style.left = '50%';
  countdown = 3;
  countdownElement.style.display = 'block';
  document.querySelectorAll('.obstacle').forEach(obstacle => obstacle.remove());
  startGame();
}

// Start the game initially
startGame();
