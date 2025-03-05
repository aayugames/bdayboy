const playerBoat = document.getElementById('player-boat');
const countdownElement = document.getElementById('countdown');
const messageElement = document.getElementById('message');
const finishLine = document.getElementById('finish-line');
let playerPositionX = 50; // Horizontal (left-right)
let playerPositionY = 80; // Vertical (moves up)
let gameStarted = false;
let countdown = 3;
let gameInterval;

// Move player boat left and right
document.addEventListener('keydown', (e) => {
  if (!gameStarted) return;

  if (e.key === 'ArrowLeft' && playerPositionX > 5) {
    playerPositionX -= 5;
  } else if (e.key === 'ArrowRight' && playerPositionX < 95) {
    playerPositionX += 5;
  }
  playerBoat.style.left = `${playerPositionX}%`;
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
    createObstacles();
  }
}

// Generate obstacles (opposing boats)
function createObstacles() {
  if (!gameStarted) return;

  const obstacle = document.createElement('div');
  obstacle.className = 'obstacle';
  obstacle.style.left = `${Math.random() * 90}%`;
  obstacle.style.top = '-100px'; // Start above the screen
  document.querySelector('.game-container').appendChild(obstacle);

  let obstaclePositionY = -100;
  const obstacleInterval = setInterval(() => {
    if (!gameStarted) {
      clearInterval(obstacleInterval);
      return;
    }

    obstaclePositionY += 3; // Speed of obstacles
    obstacle.style.top = `${obstaclePositionY}px`;

    // Check collision
    if (
      obstaclePositionY > playerPositionY - 10 && // Close enough vertically
      playerPositionX > parseFloat(obstacle.style.left) - 5 &&
      playerPositionX < parseFloat(obstacle.style.left) + 5
    ) {
      clearInterval(obstacleInterval);
      endGame(false);
    }

    // Remove obstacle if off-screen
    if (obstaclePositionY > 100) {
      obstacle.remove();
    }
  }, 30);

  setTimeout(createObstacles, 2000); // Spawn new obstacles every 2s
}

// Update game mechanics
function updateGame() {
  if (!gameStarted) return;

  playerPositionY -= 0.5; // Move player upwards
  playerBoat.style.top = `${playerPositionY}%`;

  if (playerPositionY <= 5) {
    endGame(true);
  }
}

// End game (win or lose)
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

// Reset game state
function resetGame() {
  playerPositionX = 50;
  playerPositionY = 80;
  playerBoat.style.left = '50%';
  playerBoat.style.top = '80%';
  countdown = 3;
  countdownElement.style.display = 'block';
  finishLine.style.display = 'none';
  document.querySelectorAll('.obstacle').forEach(obstacle => obstacle.remove());
  startGame();
}

// Start the game
startGame();
