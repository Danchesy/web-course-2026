// Game state variables
let secretNumber = [];
let attempts = 0;
let history = [];
let isGameOver = false;

// DOM elements
const guessInput = document.getElementById('guess-input');
const checkBtn = document.getElementById('check-btn');
const newGameBtn = document.getElementById('new-game-btn');
const messageEl = document.getElementById('message');
const attemptsEl = document.getElementById('attempts-count');
const historyList = document.getElementById('history-list');

// Generate a random 4-digit number with unique digits
function generateSecretNumber() {
    const digits = [];
    while (digits.length < 4) {
        const randomDigit = Math.floor(Math.random() * 10);
        // Ensure no leading zero and no duplicate digits
        if (!digits.includes(randomDigit) && !(digits.length === 0 && randomDigit === 0)) {
            digits.push(randomDigit);
        }
    }
    return digits;
}

// Validate user input
function isValidInput(value) {
    if (value.length !== 4) return false;
    
    // Check if all characters are digits
    if (!/^\d+$/.test(value)) return false;
    
    // Check for unique digits
    const uniqueDigits = new Set(value.split(''));
    return uniqueDigits.size === 4;
}

// Count bulls and cows
function countBullsAndCows(secret, guess) {
    let bulls = 0;
    let cows = 0;
    
    for (let i = 0; i < 4; i++) {
        if (guess[i] === secret[i]) {
            bulls++;
        } else if (secret.includes(guess[i])) {
            cows++;
        }
    }
    
    return { bulls, cows };
}

// Update the UI based on the current state
function updateUI() {
    attemptsEl.textContent = attempts;
    
    // Render history from the array (not innerHTML)
    historyList.innerHTML = '';
    history.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.guess} - ${item.bulls} бык(а), ${item.cows} коров(ы)`;
        historyList.appendChild(li);
    });
}