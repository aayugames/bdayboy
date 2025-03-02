const playerBoat = document.getElementById('player-boat');
const countdownElement = document.getElementById('countdown');
const messageElement = document.getElementById('message');
const finishLine = document.getElementById('finish-line');
let playerPosition = 50;
let gameStarted = false;
let countdown = 3;
let gameInterval;

// Move player boat left and right
document.addEventListener('keydown', (e) => {
  if (!gameStarted) return;

  if (e.key === 'ArrowLeft' && playerPosition > 0) {
    playerPosition -= 5;
  } else if (e.key === 'ArrowRight' && playerPosition < 95) {
    playerPosition += 5;
  }
  playerBoat.style.left = `${playerPosition}%`;
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
    finishLine.style.display = 'block';
    gameInterval = setInterval(updateGame, 20);
    createObstacles();
  }
}

// Create obstacles (boats coming the opposite way)
function createObstacles() {
  const obstacle = document.createElement('div');
  obstacle.className = 'obstacle';
  obstacle.style.left = `${Math.random() * 90}%`;
  obstacle.style.top = '-60px'; // Start above the screen
  document.querySelector('.game-container').appendChild(obstacle);

  let obstaclePosition = -60;
  const obstacleInterval = setInterval(() => {
    obstaclePosition += 2; // Speed of obstacles
    obstacle.style.top = `${obstaclePosition}px`;

    // Check for collision
    if (
      obstaclePosition > 80 &&
      playerPosition > parseFloat(obstacle.style.left) - 5 &&
      playerPosition < parseFloat(obstacle.style.left) + 5
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
    setTimeout(createObstacles, 2000); // Create new obstacles every 2 seconds
  }
}

// Update game state
function updateGame() {
  const playerBottom = parseFloat(playerBoat.style.bottom) || 20;
  if (playerBottom >= 80) {
    endGame(true);
  }
}

// End game logic
function endGame(success) {
  clearInterval(gameInterval);
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

// Reset game
function resetGame() {
  playerPosition = 50;
  playerBoat.style.left = '50%';
  countdown = 3;
  countdownElement.style.display = 'block';
  finishLine.style.display = 'none';
  document.querySelectorAll('.obstacle').forEach(obstacle => obstacle.remove());
  startGame();
}

// Start the game initially
startGame();
