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