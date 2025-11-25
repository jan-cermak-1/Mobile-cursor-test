// Konfigurace hry
const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 25;
const COLORS = [
    null,
    '#FF0D72', // I - červená
    '#0DC2FF', // O - modrá
    '#0DFF72', // T - zelená
    '#F538FF', // S - fialová
    '#FF8E0D', // Z - oranžová
    '#FFE138', // J - žlutá
    '#3877FF'  // L - tmavě modrá
];

// Definice tetromin
const PIECES = {
    I: [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    O: [
        [2, 2],
        [2, 2]
    ],
    T: [
        [0, 3, 0],
        [3, 3, 3],
        [0, 0, 0]
    ],
    S: [
        [0, 4, 4],
        [4, 4, 0],
        [0, 0, 0]
    ],
    Z: [
        [5, 5, 0],
        [0, 5, 5],
        [0, 0, 0]
    ],
    J: [
        [6, 0, 0],
        [6, 6, 6],
        [0, 0, 0]
    ],
    L: [
        [0, 0, 7],
        [7, 7, 7],
        [0, 0, 0]
    ]
};

class Tetris {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.nextCanvas = document.getElementById('nextCanvas');
        this.nextCtx = this.nextCanvas.getContext('2d');
        
        // Dynamické nastavení velikosti canvasu podle dostupného prostoru
        this.calculateCanvasSize();
        
        // Nastavení velikosti canvasu
        this.canvas.width = COLS * this.blockSize;
        this.canvas.height = ROWS * this.blockSize;
        this.nextCanvas.width = 4 * this.blockSize;
        this.nextCanvas.height = 4 * this.blockSize;
        
        // Nastavení CSS velikosti pro správné zobrazení
        this.canvas.style.width = (COLS * this.blockSize) + 'px';
        this.canvas.style.height = (ROWS * this.blockSize) + 'px';
        this.nextCanvas.style.width = (4 * this.blockSize) + 'px';
        this.nextCanvas.style.height = (4 * this.blockSize) + 'px';
        
        this.board = this.createBoard();
        this.piece = null;
        this.nextPiece = null;
        this.score = 0;
        this.lines = 0;
        this.level = 1;
        this.dropCounter = 0;
        this.dropInterval = 1000;
        this.lastTime = 0;
        this.paused = false;
        this.gameOver = false;
        
        this.init();
    }
    
    calculateCanvasSize() {
        // Získání dostupného prostoru
        const gameArea = this.canvas.parentElement;
        const sideInfoWidth = 70; // šířka side-info
        const availableWidth = gameArea.clientWidth - sideInfoWidth - 20; // odečtení side-info a padding
        const availableHeight = window.innerHeight - 200; // odečtení header, controls, atd.
        
        // Výpočet optimální velikosti bloku
        const maxBlockSizeByWidth = Math.floor(availableWidth / COLS);
        const maxBlockSizeByHeight = Math.floor(availableHeight / ROWS);
        
        // Použijeme menší hodnotu, aby se vše vešlo
        this.blockSize = Math.min(maxBlockSizeByWidth, maxBlockSizeByHeight, BLOCK_SIZE);
        
        // Minimální velikost pro hratelnost
        if (this.blockSize < 12) {
            this.blockSize = 12;
        }
    }
    
    resize() {
        this.calculateCanvasSize();
        this.canvas.width = COLS * this.blockSize;
        this.canvas.height = ROWS * this.blockSize;
        this.nextCanvas.width = 4 * this.blockSize;
        this.nextCanvas.height = 4 * this.blockSize;
        this.canvas.style.width = (COLS * this.blockSize) + 'px';
        this.canvas.style.height = (ROWS * this.blockSize) + 'px';
        this.nextCanvas.style.width = (4 * this.blockSize) + 'px';
        this.nextCanvas.style.height = (4 * this.blockSize) + 'px';
        this.draw();
        this.drawNext();
    }
    
    createBoard() {
        return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    }
    
    init() {
        this.board = this.createBoard();
        this.score = 0;
        this.lines = 0;
        this.level = 1;
        this.dropInterval = 1000;
        this.paused = false;
        this.gameOver = false;
        this.updateScore();
        
        this.nextPiece = this.createPiece();
        this.spawnPiece();
        
        document.getElementById('gameOver').classList.add('hidden');
        document.getElementById('pauseScreen').classList.add('hidden');
    }
    
    createPiece() {
        const types = 'IOTSZJL';
        const type = types[Math.floor(Math.random() * types.length)];
        const matrix = PIECES[type];
        
        return {
            matrix: matrix,
            pos: { x: Math.floor(COLS / 2) - Math.floor(matrix[0].length / 2), y: 0 },
            type: type
        };
    }
    
    spawnPiece() {
        this.piece = this.nextPiece;
        this.nextPiece = this.createPiece();
        this.drawNext();
        
        if (this.collide(this.piece)) {
            this.endGame();
        }
    }
    
    collide(piece, offset = { x: 0, y: 0 }) {
        const pos = {
            x: piece.pos.x + offset.x,
            y: piece.pos.y + offset.y
        };
        
        for (let y = 0; y < piece.matrix.length; y++) {
            for (let x = 0; x < piece.matrix[y].length; x++) {
                if (piece.matrix[y][x] !== 0) {
                    const boardX = pos.x + x;
                    const boardY = pos.y + y;
                    
                    if (boardX < 0 || boardX >= COLS || 
                        boardY >= ROWS ||
                        (boardY >= 0 && this.board[boardY][boardX] !== 0)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    
    merge() {
        for (let y = 0; y < this.piece.matrix.length; y++) {
            for (let x = 0; x < this.piece.matrix[y].length; x++) {
                if (this.piece.matrix[y][x] !== 0) {
                    const boardY = this.piece.pos.y + y;
                    const boardX = this.piece.pos.x + x;
                    if (boardY >= 0) {
                        this.board[boardY][boardX] = this.piece.matrix[y][x];
                    }
                }
            }
        }
    }
    
    clearLines() {
        let linesCleared = 0;
        
        for (let y = ROWS - 1; y >= 0; y--) {
            if (this.board[y].every(cell => cell !== 0)) {
                this.board.splice(y, 1);
                this.board.unshift(Array(COLS).fill(0));
                linesCleared++;
                y++; // Zkontroluj stejný řádek znovu
            }
        }
        
        if (linesCleared > 0) {
            this.lines += linesCleared;
            // Bodování: 100 * level za jeden řádek, 300 za dva, 500 za tři, 800 za čtyři
            const points = [0, 100, 300, 500, 800][linesCleared] * this.level;
            this.score += points;
            
            // Zvyš úroveň každých 10 řádků
            this.level = Math.floor(this.lines / 10) + 1;
            this.dropInterval = Math.max(100, 1000 - (this.level - 1) * 100);
            
            this.updateScore();
        }
    }
    
    rotate() {
        const rotated = [];
        const matrix = this.piece.matrix;
        const N = matrix.length;
        
        for (let i = 0; i < N; i++) {
            rotated[i] = [];
            for (let j = 0; j < N; j++) {
                rotated[i][j] = matrix[N - 1 - j][i];
            }
        }
        
        const originalMatrix = this.piece.matrix;
        this.piece.matrix = rotated;
        
        if (this.collide(this.piece)) {
            // Zkus posunout doleva nebo doprava
            let offset = 1;
            let moved = false;
            
            while (offset <= 2 && !moved) {
                if (!this.collide(this.piece, { x: offset, y: 0 })) {
                    this.piece.pos.x += offset;
                    moved = true;
                } else if (!this.collide(this.piece, { x: -offset, y: 0 })) {
                    this.piece.pos.x -= offset;
                    moved = true;
                }
                offset++;
            }
            
            if (!moved) {
                this.piece.matrix = originalMatrix;
            }
        }
    }
    
    move(dir) {
        if (!this.collide(this.piece, { x: dir, y: 0 })) {
            this.piece.pos.x += dir;
        }
    }
    
    drop() {
        if (!this.collide(this.piece, { x: 0, y: 1 })) {
            this.piece.pos.y++;
        } else {
            this.merge();
            this.clearLines();
            this.spawnPiece();
        }
    }
    
    hardDrop() {
        while (!this.collide(this.piece, { x: 0, y: 1 })) {
            this.piece.pos.y++;
            this.score += 2;
        }
        this.merge();
        this.clearLines();
        this.spawnPiece();
        this.updateScore();
    }
    
    draw() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Nakresli desku
        for (let y = 0; y < ROWS; y++) {
            for (let x = 0; x < COLS; x++) {
                if (this.board[y][x] !== 0) {
                    this.ctx.fillStyle = COLORS[this.board[y][x]];
                    this.ctx.fillRect(x * this.blockSize, y * this.blockSize, this.blockSize, this.blockSize);
                    this.ctx.strokeStyle = '#fff';
            this.ctx.strokeRect(x * this.blockSize, y * this.blockSize, this.blockSize, this.blockSize);
                }
            }
        }
        
        // Nakresli aktuální kus
        if (this.piece) {
            for (let y = 0; y < this.piece.matrix.length; y++) {
                for (let x = 0; x < this.piece.matrix[y].length; x++) {
                    if (this.piece.matrix[y][x] !== 0) {
                        const drawX = (this.piece.pos.x + x) * this.blockSize;
                        const drawY = (this.piece.pos.y + y) * this.blockSize;
                        this.ctx.fillStyle = COLORS[this.piece.matrix[y][x]];
                        this.ctx.fillRect(drawX, drawY, this.blockSize, this.blockSize);
                        this.ctx.strokeStyle = '#fff';
                        this.ctx.strokeRect(drawX, drawY, this.blockSize, this.blockSize);
                    }
                }
            }
        }
    }
    
    drawNext() {
        this.nextCtx.fillStyle = '#000';
        this.nextCtx.fillRect(0, 0, this.nextCanvas.width, this.nextCanvas.height);
        
        if (this.nextPiece) {
            const offsetX = (4 - this.nextPiece.matrix[0].length) / 2;
            const offsetY = (4 - this.nextPiece.matrix.length) / 2;
            
            for (let y = 0; y < this.nextPiece.matrix.length; y++) {
                for (let x = 0; x < this.nextPiece.matrix[y].length; x++) {
                    if (this.nextPiece.matrix[y][x] !== 0) {
                        const drawX = (offsetX + x) * this.blockSize;
                        const drawY = (offsetY + y) * this.blockSize;
                        this.nextCtx.fillStyle = COLORS[this.nextPiece.matrix[y][x]];
                        this.nextCtx.fillRect(drawX, drawY, this.blockSize, this.blockSize);
                        this.nextCtx.strokeStyle = '#fff';
                        this.nextCtx.strokeRect(drawX, drawY, this.blockSize, this.blockSize);
                    }
                }
            }
        }
    }
    
    updateScore() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('lines').textContent = this.lines;
        document.getElementById('level').textContent = this.level;
    }
    
    pause() {
        this.paused = !this.paused;
        if (this.paused) {
            document.getElementById('pauseScreen').classList.remove('hidden');
        } else {
            document.getElementById('pauseScreen').classList.add('hidden');
        }
    }
    
    endGame() {
        this.gameOver = true;
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('gameOver').classList.remove('hidden');
    }
    
    update(time = 0) {
        if (this.gameOver || this.paused) {
            return;
        }
        
        const deltaTime = time - this.lastTime;
        this.lastTime = time;
        
        this.dropCounter += deltaTime;
        
        if (this.dropCounter > this.dropInterval) {
            this.drop();
            this.dropCounter = 0;
        }
        
        this.draw();
    }
}

// Inicializace hry
const game = new Tetris();

// Klávesnice
let keys = {};
let moveLeftInterval = null;
let moveRightInterval = null;

document.addEventListener('keydown', (e) => {
    if (game.gameOver || game.paused) {
        if (e.key === ' ' || e.key === 'Enter') {
            if (game.gameOver) {
                game.init();
            } else {
                game.pause();
            }
        }
        return;
    }
    
    switch(e.key) {
        case 'ArrowLeft':
            e.preventDefault();
            game.move(-1);
            game.draw();
            break;
        case 'ArrowRight':
            e.preventDefault();
            game.move(1);
            game.draw();
            break;
        case 'ArrowDown':
            e.preventDefault();
            game.drop();
            game.draw();
            break;
        case 'ArrowUp':
        case ' ':
            e.preventDefault();
            game.rotate();
            game.draw();
            break;
        case 'p':
        case 'P':
            game.pause();
            break;
    }
});

// Tlačítka
document.getElementById('leftBtn').addEventListener('click', () => {
    if (!game.gameOver && !game.paused) {
        game.move(-1);
        game.draw();
    }
});

document.getElementById('rightBtn').addEventListener('click', () => {
    if (!game.gameOver && !game.paused) {
        game.move(1);
        game.draw();
    }
});

document.getElementById('downBtn').addEventListener('click', () => {
    if (!game.gameOver && !game.paused) {
        game.hardDrop();
        game.draw();
    }
});

document.getElementById('rotateBtn').addEventListener('click', () => {
    if (!game.gameOver && !game.paused) {
        game.rotate();
        game.draw();
    }
});

document.getElementById('pauseBtn').addEventListener('click', () => {
    game.pause();
});

document.getElementById('restartBtn').addEventListener('click', () => {
    game.init();
});

document.getElementById('resumeBtn').addEventListener('click', () => {
    game.pause();
});

// Dotykové ovládání
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

document.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }
}, { passive: true });

document.addEventListener('touchend', (e) => {
    if (e.changedTouches.length === 1 && !game.gameOver && !game.paused) {
        touchEndX = e.changedTouches[0].clientX;
        touchEndY = e.changedTouches[0].clientY;
        
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        const minSwipeDistance = 30;
        
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontální swipe
            if (Math.abs(deltaX) > minSwipeDistance) {
                if (deltaX > 0) {
                    game.move(1);
                } else {
                    game.move(-1);
                }
                game.draw();
            }
        } else {
            // Vertikální swipe
            if (Math.abs(deltaY) > minSwipeDistance) {
                if (deltaY > 0) {
                    game.drop();
                } else {
                    game.rotate();
                }
                game.draw();
            }
        }
    }
}, { passive: true });

// Resize handler
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        game.resize();
    }, 100);
});

// Resize při načtení stránky (pro správné zobrazení na mobilu)
window.addEventListener('load', () => {
    setTimeout(() => {
        game.resize();
    }, 100);
});

// Herní smyčka
function gameLoop(time) {
    game.update(time);
    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
