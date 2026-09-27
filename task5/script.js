let sequence = [];
let playerSequence = [];
let level = 0;
let isShowingSequence = false;
let isGameActive = false;
let timers = []; // Store timers to clear them properly

const sectors = document.querySelectorAll('.sector');
const startBtn = document.getElementById('start-btn');
const levelDisplay = document.getElementById('level-display');
const statusMessage = document.getElementById('status-message');
const gameBoard = document.querySelector('.game-board');

// Helper to add a delay
const delay = (ms) => new Promise(resolve => {
    const timer = setTimeout(resolve, ms);
    timers.push(timer);
});

// Clear all pending timers to prevent overlapping
function clearAllTimers() {
    console.log(`Очищаю таймеров: ${timers.length}`);
    timers.forEach(timer => clearTimeout(timer));
    timers = [];
}

// Add a random step to the sequence
function addRandomStep() {
    const randomIndex = Math.floor(Math.random() * 4);
    sequence.push(randomIndex);
}

// Show the sequence to the player
async function playSequence() {
    isShowingSequence = true;
    playerSequence = [];
    gameBoard.classList.add('disabled'); // Block clicks
    statusMessage.textContent = 'Смотрите внимательно...';

    for (let i = 0; i < sequence.length; i++) {
        const sectorIndex = sequence[i];
        const sector = sectors[sectorIndex];
        
        // Highlight the sector
        sector.classList.add('active');
        
        // Wait for the highlight duration
        await delay(500);
        
        // Remove highlight
        sector.classList.remove('active');
        
        // Wait for the pause between highlights
        await delay(200);
    }

    isShowingSequence = false;
    gameBoard.classList.remove('disabled'); // Allow clicks
    statusMessage.textContent = 'Ваш ход!';
}


// Handle the player clicking a sector
function handleSectorClick(event) {
    // Ignore clicks if game is not active or sequence is showing
    if (!isGameActive || isShowingSequence) return;

    const clickedIndex = parseInt(event.target.dataset.index);
    
    // Add to player's current input
    playerSequence.push(clickedIndex);
    
    // Visual feedback for the click
    const sector = event.target;
    sector.classList.add('active');
    setTimeout(() => sector.classList.remove('active'), 200);

    // Check the player's input against the sequence
    const currentStepIndex = playerSequence.length - 1;
    if (playerSequence[currentStepIndex] !== sequence[currentStepIndex]) {
        // Wrong move, game over
        handleGameOver();
        return;
    }

    // If the player completed the entire sequence
    if (playerSequence.length === sequence.length) {
        // Move to the next round
        level++;
        levelDisplay.textContent = level;
        
        // Add a new step and play the sequence again
        addRandomStep();
        
        // Small delay before showing the next sequence
        const nextRoundTimer = setTimeout(() => {
            playSequence();
        }, 1000);
        timers.push(nextRoundTimer);
    }
}

// End the game
function handleGameOver() {
    isGameActive = false;
    isShowingSequence = false;
    clearAllTimers(); // Important: stop any running timers
    
    gameBoard.classList.add('disabled');
    statusMessage.textContent = `Игра окончена! Вы дошли до уровня ${level}`;
    
    // Optionally reset the level display, but keep the result in message
    levelDisplay.textContent = level; 
}

// Start the game
function startGame() {
    // Reset everything
    clearAllTimers();
    sequence = [];
    playerSequence = [];
    level = 0;
    isGameActive = true;
    isShowingSequence = false;
    
    levelDisplay.textContent = level;
    gameBoard.classList.remove('disabled');
    statusMessage.textContent = 'Игра началась!';
    
    // Start the first round
    level++;
    levelDisplay.textContent = level;
    addRandomStep();
    playSequence();
}

// Event listeners
sectors.forEach(sector => {
    sector.addEventListener('click', handleSectorClick);
});

startBtn.addEventListener('click', startGame);