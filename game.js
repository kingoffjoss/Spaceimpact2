// Configurações Iniciais e Seleção de Elementos
const bgCanvas = document.getElementById("canvas-bg");
const mainCanvas = document.getElementById("canvas-main");
const bgCtx = bgCanvas.getContext("2d");
const mainCtx = mainCanvas.getContext("2d");

mainCanvas.width = 840;
mainCanvas.height = 480;
bgCanvas.width = 840;
bgCanvas.height = 480;

// Seleção de Botões UI
const buttonUp = document.getElementById("button-up");
const buttonDown = document.getElementById("button-down");
const buttonLeft = document.getElementById("button-left");
const buttonRight = document.getElementById("button-right");
const buttonFire = document.getElementById("button-fire");
const buttonX = document.getElementById("button-x");
const playButton = document.getElementById("play");
const exitButton = document.getElementById("exit");
const pauseButton = document.getElementById("pause-button");
const logo = document.getElementById("logo");

// Carregamento de Sprites
const mainSprites = new Image(); mainSprites.src = "./img/gameSprites.png";
const bossSprites = new Image(); bossSprites.src = "./img/bossSprites.png";
const bgSprites1 = new Image(); bgSprites1.src = "./img/bgSprites1.png";
const bgSprites2 = new Image(); bgSprites2.src = "./img/bgSprites2.png";

// Variáveis de Estado Globais
let gameOver = false;
let gamePause = false;
let isLevelDark = true;
let specialAtttack = "missile";
let specialCount = 3;
let lives = 4;
let playerScore = 0;
let currentLevel;
let lastTime = 0;
let isMainScreen = true;

const keys = {
    ArrowLeft: { pressed: false },
    ArrowRight: { pressed: false },
    ArrowUp: { pressed: false },
    ArrowDown: { pressed: false },
    space: { pressed: false },
    x: { pressed: false }
}

/** * FUNÇÃO DE INICIALIZAÇÃO E RESET
 * Corrige o erro de reload limpando os estados
 */
function initGame(levelNum = 1, dark = true) {
    playerScore = 0;
    lives = 4;
    gameOver = false;
    gamePause = false;
    specialCount = 3;
    specialAtttack = "missile";
    isMainScreen = false;
    
    currentLevel = new Level(levelNum, dark);
    
    playButton.style.display = "none";
    exitButton.style.display = "none";
    pauseButton.style.visibility = "visible";
    pauseButton.innerHTML = "Pause";
}

// ... (Classes Hitbox, Shield, Player, Projectile, PowerUp, Missile, Laser, Wall, Explosion permanecem iguais ao original) ...

/** * CONFIGURAÇÃO DAS NOVAS FASES
 */
const enemiesLvl9 = [
    { time: 1500, object: [new Beetle(20, 840, 100, true, 4, 0.1, "wave", 60, 100)] },
    { time: 8000, object: [new Boss7()] },
    { time: 15000, object: [new PowerUp(840, 240, 2, 0, "linear", 0, 0)] }
];

const enemiesLvl10 = [
    { time: 2000, object: [new Dragonfly(40, 840, 100, true, 5, 0, "linear", 0, 0)] },
    { time: 5000, object: [new Boss8()] }
];

// Classe Level com suporte a 10 fases
class Level {
    constructor(level, isDark) {
        this.active = true;
        this.number = level;
        isLevelDark = isDark;
        bgCanvas.style.background = isLevelDark ? "#282828" : "#aad69c";
        
        this.player = new Player(this);
        this.input = new InputHandler(this);
        this.ui = new UI();
        this.enemies = [];
        this.playerProjectiles = [];
        this.playerSpecial = [];
        this.enemyProjectiles = [];
        this.background = [];
        this.explosions = [];
        this.levelTime = 0;
        this.i = 0;
        this.flag = true;
        this.bgStop = false;
        this.levelComplete = false;

        const enemyConfigs = {
            1: enemiesLvl1, 2: enemiesLvl2, 3: enemiesLvl3, 4: enemiesLvl4,
            5: enemiesLvl5, 6: enemiesLvl6, 7: enemiesLvl7, 8: enemiesLvl8,
            9: enemiesLvl9, 10: enemiesLvl10
        };
        this.sourceEnemyArray = enemyConfigs[this.number];
        
        // Inicialização de Backgrounds
        if (this.number === 9 || this.number === 10) {
            bgArray8.forEach((frame, index) => this.background.push(new Background8(this, frame, index)));
        } else {
            // ... (restante dos cases de 1 a 8 originais) ...
        }
    }
    // ... (Método update e playerDead iguais ao original) ...
}

// Listeners de Botões Corrigidos
playButton.addEventListener("click", () => initGame(1, true));
exitButton.addEventListener("click", () => initGame(1, true));

pauseButton.addEventListener("click", () => {
    gamePause = !gamePause;
    pauseButton.innerHTML = gamePause ? "Resume" : "Pause";
    pauseButton.blur();
});

// Loop de Animação
function animate(timestamp) {
    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    if (isMainScreen) {
        mainCtx.clearRect(0, 0, 840, 480);
        bgCtx.clearRect(0, 0, 840, 480);
        particles.forEach(p => p.update());
        mainCtx.drawImage(logo, 0, 0, 1190, 430, 100, 100, 640, 245);
    } else if (!gamePause && !gameOver) {
        mainCtx.clearRect(0, 0, 840, 480);
        bgCtx.clearRect(0, 0, 840, 480);
        currentLevel.update(deltaTime);
    } else if (gamePause) {
        mainCtx.fillStyle = "red";
        mainCtx.textAlign = "center";
        mainCtx.font = "bold 60px Silkscreen";
        mainCtx.fillText("|| Game Paused", 420, 260);
    }
    
    if (gameOver) {
        lives > 0 ? gameWin() : gameLose();
    }
    requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
