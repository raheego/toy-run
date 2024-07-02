const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth - 100;
canvas.height = window.innerHeight - 100;

let avata1 = new Image();
avata1.src = '/images/avatar.ico';
let obstacle = new Image();
obstacle.src = '/images/obstacle.png';

const filedHeight = 200;
const JUMP_Height = 10; // 점프 높이
const GRAVITY = 2; // 떨어지는 속도 숫자가 클수록 빨리 떨어짐
let jumpHeightLimit = 90; // 점프 높이 제한 숫자가 작을수록 높이 올라감 기본100

const obstacleSpawnInterval = 120; // 장애물 생성 간격 (프레임 수)
const obstacleSpawnProbability = 0.5; // 장애물 생성 확률 (0.5는 50%)
const obstacleSpeed = 2;

let dino = {
    width: 50,
    height: 50,
    x: 10,
    y: filedHeight,
    draw() {
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(avata1, this.x, this.y, this.width, this.height);
    },
};

class Cactus {
    constructor() {
        this.width = 25;
        this.height = 25;
        this.x = canvas.width - this.width;
        this.y = 225;
    }
    draw() {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(obstacle, this.x, this.y, this.width, this.height);
    }
}

let timer = 0;
let cactusArr = [];
let animation;
let jump = false;
let jumpTimer = 0;
let jumpCount = 0;
const maxJumpCount = 4; // 최대 점프 횟수

function gameLoop() {
    animation = requestAnimationFrame(gameLoop);
    timer++;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 일정 간격마다 장애물 생성 여부 체크 (예: 2초마다)
    if (timer % obstacleSpawnInterval === 0) {
        if (Math.random() <obstacleSpawnProbability) {
            let cactus = new Cactus();
            cactusArr.push(cactus);
        }
    }

    // 장애물 이동 및 충돌 체크
    cactusArr.forEach((el, i, o) => {
        if (el.x + el.width < 0) {
            o.splice(i, 1);
        }
        el.x -= obstacleSpeed;

        checkCollision(dino, el);

        el.draw();
    });

    // 점프 로직
    if (jump) {
        if (dino.y > jumpHeightLimit) {
            dino.y -= JUMP_Height;
        } else {
            jump = false;
            jumpTimer = 0;
        }
        jumpTimer++;
    } else {
        if (dino.y < filedHeight) {
            dino.y += GRAVITY;
        }
    }

    dino.draw();
}

gameLoop();

function checkCollision(dino, cactus) {
    let xDiff = cactus.x - (dino.x + dino.width);
    let yDiff = cactus.y - (dino.y + dino.height);

    if (xDiff < 0 && yDiff < 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cancelAnimationFrame(animation);
        alert('Game Over');
    }
}

document.addEventListener('keydown', function(e) {
    if (e.code === 'Space' && jumpCount < maxJumpCount) {
        jump = true;
        jumpCount++;
    }
});

document.addEventListener('keyup', function(e) {
    if (e.code === 'Space' && dino.y >= filedHeight) {
        jumpCount = 0;
    }
});
