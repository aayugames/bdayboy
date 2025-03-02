const playerBoat = document.getElementById('player-boat');
const countdownElement = document.getElementById('countdown');
const messageElement = document.getElementById('message');
const finishLine = document.getElementById('finish-line');
const leftBubble = document.querySelector('.left-bubble');
const rightBubble = document.querySelector('.right-bubble');
let playerPosition = 50;
let gameStarted = false;
let countdown = 3;
let gameInterval;
let opponentBoats = [];

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
    gameInterval = setInterval(updateGame, 20);
    createOpponentBoats();
    showTextBubbles();
  }
}

// Create opponent boats
function createOpponentBoats() {
  for (let i = 0; i < 3; i++) {
    const opponentBoat = document.createElement('div');
    opponentBoat.className = 'boat opponent-boat';
    opponentBoat.style.left = `${10 + i * 30}%`;
    opponentBoat.style.bottom = '20px'; // Start at the bottom
    document.querySelector('.game-container').appendChild(opponentBoat);
    opponentBoats.push(opponentBoat);
  }
}

// Move opponent boats
function moveOpponentBoats() {
  opponentBoats.forEach((boat) => {
    const speed = Math.random() * 2 + 1; // Random speed for each boat
    const currentBottom = parseFloat(boat.style.bottom) || 20;
    boat.style.bottom = `${currentBottom + speed}%`;

    // Check if opponent boat reaches the finish line
    if (currentBottom >= 80) {
      endGame(false);
    }
  });
}

// Show text bubbles at random intervals
function showTextBubbles() {
  if (!gameStarted) return;

  const bubble = Math.random() > 0.5 ? leftBubble : rightBubble;
  bubble.style.display = 'block';
  setTimeout(() => {
    bubble.style.display = 'none';
    if (gameStarted) {
      showTextBubbles();
    }
  }, 2000);
}

// Update game state
function updateGame() {
  moveOpponentBoats();

  const playerBottom = parseFloat(playerBoat.style.bottom) || 20;
  if (playerBottom >= 80) {
    finishLine.style.display = 'block';
    if (playerBottom >= 95) {
      endGame(true);
    }
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
  playerPosition = 50;
  playerBoat.style.left = '50%';
  playerBoat.style.bottom = '20px';
  countdown = 3;
  countdownElement.style.display = 'block';
  finishLine.style.display = 'none';
  opponentBoats.forEach((boat) => boat.remove());
  opponentBoats = [];
  startGame();
}

// Start the game initially
startGame();
