// get canvas and context
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// ui elements
const scoreDisplay = document.getElementById('score-display');
const gameOverDiv = document.getElementById('game-over');
const finalScoreSpan = document.getElementById('final-score');
const restartBtn = document.getElementById('restart-btn');

// grid settings
const gridSize = 20; // 20x20 cells
const cellSize = canvas.width / gridSize; // 20px per cell

// game state variables
let snake = [];
let direction = { x: 1, y: 0 }; // moving right initially
let nextDirection = { x: 1, y: 0 };
let apple = { x: 0, y: 0 };
let score = 0;
let gameOver = false;

// timing variables for constant speed
let lastMoveTime = 0;
const moveInterval = 150; // move every 150ms

// initialize or reset game state
function initGame() {
    snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];
    direction = { x: 1, y: 0 };
    nextDirection = { x: 1, y: 0 };
    score = 0;
    gameOver = false;
    gameOverDiv.classList.add('hidden');
    scoreDisplay.textContent = `score: ${score}`;
    spawnApple();
}

// place apple on a random free cell
function spawnApple() {
    let newApple;
    let isOccupied = true;
    while (isOccupied) {
        newApple = {
            x: Math.floor(Math.random() * gridSize),
            y: Math.floor(Math.random() * gridSize)
        };
        // check if apple overlaps with snake
        isOccupied = snake.some(segment => segment.x === newApple.x && segment.y === newApple.y);
    }
    apple = newApple;
}

// check if head collides with wall or itself
function checkCollision(head) {
    // wall collision
    if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
        return true;
    }
    // self collision (check against body, ignoring the tail which will move)
    for (let i = 0; i < snake.length - 1; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            return true;
        }
    }
    return false;
}

// update game logic
function update() {
    if (gameOver) return;

    // apply queued direction change
    direction = nextDirection;

    // calculate new head position
    const head = snake[0];
    const newHead = {
        x: head.x + direction.x,
        y: head.y + direction.y
    };

    // check for collisions
    if (checkCollision(newHead)) {
        gameOver = true;
        finalScoreSpan.textContent = `score: ${score}`;
        gameOverDiv.classList.remove('hidden');
        return;
    }

    // add new head to the front
    snake.unshift(newHead);

    // check if apple is eaten
    if (newHead.x === apple.x && newHead.y === apple.y) {
        score++;
        scoreDisplay.textContent = `score: ${score}`;
        spawnApple();
    } else {
        // remove tail if no apple eaten
        snake.pop();
    }
}

// draw everything on canvas based on current state
function draw() {
    // clear canvas
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // draw apple
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(apple.x * cellSize, apple.y * cellSize, cellSize, cellSize);

    // draw snake
    ctx.fillStyle = '#2ecc71';
    snake.forEach((segment, index) => {
        // make head slightly brighter
        if (index === 0) {
            ctx.fillStyle = '#27ae60';
        } else {
            ctx.fillStyle = '#2ecc71';
        }
        ctx.fillRect(segment.x * cellSize, segment.y * cellSize, cellSize - 1, cellSize - 1);
    });
}

// main game loop using requestAnimationFrame
function gameLoop(currentTime) {
    // initialize lastMoveTime on first frame
    if (lastMoveTime === 0) {
        lastMoveTime = currentTime;
    }

    const deltaTime = currentTime - lastMoveTime;

    // move snake only when enough time has passed
    if (deltaTime >= moveInterval) {
        update();
        lastMoveTime = currentTime;
    }

    draw();

    // continue loop even if game over to keep rendering
    requestAnimationFrame(gameLoop);
}

// keyboard controls
document.addEventListener('keydown', (e) => {
    if (gameOver) return;

    const key = e.key;
    let newDir = null;

    if (key === 'ArrowUp' && direction.y === 0) {
        newDir = { x: 0, y: -1 };
    } else if (key === 'ArrowDown' && direction.y === 0) {
        newDir = { x: 0, y: 1 };
    } else if (key === 'ArrowLeft' && direction.x === 0) {
        newDir = { x: -1, y: 0 };
    } else if (key === 'ArrowRight' && direction.x === 0) {
        newDir = { x: 1, y: 0 };
    }

    if (newDir) {
        nextDirection = newDir;
    }
});

// restart button handler
restartBtn.addEventListener('click', () => {
    initGame();
    lastMoveTime = 0; // reset timing so first move happens immediately
});

// start the game
initGame();
requestAnimationFrame(gameLoop);