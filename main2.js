// 캔버스 요소와 2D 컨텍스트 가져오기
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// 캔버스 크기 설정
canvas.width = window.innerWidth - 100;
canvas.height = window.innerHeight - 100;

// 이미지 로드
const avatarImage = new Image();
avatarImage.src = '/images/dino.png';

const obstacleImage = new Image();
obstacleImage.src = '/images/obstacle.png';

// 게임 설정
const groundHeight = 200; // 땅의 높이
const jumpHeight = 15; // 점프 높이
const jumpHeightLimit = 80; // 점프 높이 제한
const gravity = 1.5; // 중력 (숫자가 클수록 빠르게 떨어짐)

// 장애물 설정
const obstacleSpawnInterval = 120; // 장애물 생성 간격 (프레임 수)
const obstacleSpawnProbability = 0.5; // 장애물 생성 확률 (0.5는 50%)
let obstacleSpeed = 2; // 장애물 이동 속도 (픽셀 단위)
const obstacleSpeedIncrease = 0.1; // 장애물 이동 속도 증가율

// 게임 상태 관리 변수
let timer = 0;
let cactusArr = [];
let animation;
let jump = false;
let score = 0;

// 플레이어 클래스
class Player {
    constructor(x, y, width, height, image) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = image;
    }

    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    jump() {
        if (this.y > jumpHeightLimit) {
            this.y -= jumpHeight;
        } else {
            jump = false;
        }
    }

    fall() {
        if (this.y < groundHeight) {
            this.y += gravity;
        }
    }
}

// 장애물 클래스
class Obstacle {
    constructor(x, y, width, height, image) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = image;
    }

    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    move(speed) {
        this.x -= speed;
    }
}

// 플레이어 (공룡) 인스턴스 생성
const dino = new Player(10, groundHeight, 50, 50, avatarImage);

// 게임 루프
function gameLoop() {
    animation = requestAnimationFrame(gameLoop);
    timer++;

    updateGame(); // 게임 상태 업데이트
    drawGame();   // 게임 그리기
    updateScore(); // 점수 업데이트

    // 일정 프레임마다 장애물 속도 증가
    if (timer % 1000 === 0) {
        obstacleSpeed += obstacleSpeedIncrease;
    }
}

// 게임 상태 업데이트
function updateGame() {
    spawnObstacle(); // 장애물 생성
    moveObstacles(); // 장애물 이동 및 충돌 체크
    handleJump();    // 점프 로직
}

// 장애물 생성
function spawnObstacle() {
    if (timer % obstacleSpawnInterval === 0) {
        if (Math.random() < obstacleSpawnProbability) {
            let cactus = new Obstacle(canvas.width - 25, 225, 25, 25, obstacleImage);
            cactusArr.push(cactus);
        }
    }
}

// 장애물 이동 및 충돌 체크
function moveObstacles() {
    cactusArr.forEach((cactus, index, arr) => {
        if (cactus.x + cactus.width < 0) {
            arr.splice(index, 1); // 화면을 벗어난 장애물 제거
        }
        cactus.move(obstacleSpeed); // 장애물 이동

        if (checkCollision(dino, cactus)) {
            gameOver();
        }
    });
}

// 점프 로직 처리
function handleJump() {
    if (jump) {
        dino.jump();
    } else {
        dino.fall();
    }
}

// 게임 그리기
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // 캔버스 클리어
    dino.draw(); // 플레이어 그리기
    cactusArr.forEach(cactus => cactus.draw()); // 장애물 그리기
}

// 점수 업데이트
function updateScore() {
    if (timer % obstacleSpawnInterval === 0) {
        score++;
        document.querySelector('.score span').textContent = score;
    }
}

// 충돌 체크
function checkCollision(player, obstacle) {
    const xDiff = obstacle.x - (player.x + player.width);
    const yDiff = obstacle.y - (player.y + player.height);
    return xDiff < 0 && yDiff < 0;
}

// 게임 오버 처리
function gameOver() {
    cancelAnimationFrame(animation);
    const modal = document.getElementById('gameOverModal');
    modal.style.display = 'flex';
    const closeModal = document.querySelector('.close');
    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
        resetGame();
    });
}

// 게임 리셋
function resetGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // 캔버스 초기화
    timer = 0;
    cactusArr = [];
    jump = false;
    dino.y = groundHeight;
    score = 0;
    obstacleSpeed = 2;
    const modal = document.getElementById('gameOverModal');
    modal.style.display = 'none';
    gameLoop(); // 새로운 게임 루프 시작
}

// 점프 제어
document.addEventListener('keydown', function(e) {
    if (e.code === 'Space') {
        jump = true;
    }
});

document.addEventListener('keyup', function(e) {
    if (e.code === 'Space') {
        jump = false;
    }
});

// 모달 내 리셋 버튼 클릭 시 호출될 함수
const resetModalButton = document.getElementById('resetModalButton');
resetModalButton.addEventListener('click', resetGame);

// 초기 게임 시작
gameLoop();
