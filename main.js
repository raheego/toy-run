const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth - 100;
canvas.height = window.innerHeight - 100;

// 이미지 로드
let avata1 = new Image();
avata1.src = '/images/avatar.ico';
let obstacle = new Image();
obstacle.src = '/images/obstacle.png';

// 게임 설정
const filedHeight = 200; // 땅의 높이
const JUMP_Height = 10; // 점프 높이
const GRAVITY = 2; // 중력 (숫자가 클수록 빠르게 떨어짐)
let jumpHeightLimit = 90; // 점프 높이 제한 (숫자가 작을수록 더 높이 점프 가능, 기본값 100)

// 장애물 설정
const obstacleSpawnInterval = 120; // 장애물 생성 간격 (프레임 수)
const obstacleSpawnProbability = 0.5; // 장애물 생성 확률 (0.5는 50%)
const obstacleSpeed = 2; // 장애물 이동 속도 (픽셀 단위)

// 플레이어 (공룡) 설정
let dino = {
    width: 50,
    height: 50,
    x: 10,
    y: filedHeight,
    draw() {
        // 공룡 그리기
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(avata1, this.x, this.y, this.width, this.height);
    },
};

// 장애물 클래스
class Cactus {
    constructor() {
        this.width = 25;
        this.height = 25;
        this.x = canvas.width - this.width; // 오른쪽 끝에서 시작
        this.y = 225; // 고정된 y 위치
    }
    draw() {
        // 장애물 그리기
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(obstacle, this.x, this.y, this.width, this.height);
    }
}

// 게임 루프
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

    // 장애물 생성
    if (timer % obstacleSpawnInterval === 0) {
        if (Math.random() < obstacleSpawnProbability) {
            let cactus = new Cactus();
            cactusArr.push(cactus);
        }
    }

    // 장애물 이동 및 충돌 체크
    cactusArr.forEach((el, i, o) => {
        if (el.x + el.width < 0) {
            o.splice(i, 1); // 화면을 벗어난 장애물 제거
        }
        el.x -= obstacleSpeed; // 장애물 이동

        checkCollision(dino, el); // 충돌 체크

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

    dino.draw(); // 공룡 그리기
}

gameLoop();

// 충돌 체크
function checkCollision(dino, cactus) {
    let xDiff = cactus.x - (dino.x + dino.width);
    let yDiff = cactus.y - (dino.y + dino.height);

    if (xDiff < 0 && yDiff < 0) {
        // 충돌 발생 시 게임 오버
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cancelAnimationFrame(animation);
        alert('Game Over');
    }
}

// 점프 제어
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
