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
const obstacleSpeed = 2; // 장애물 이동 속도 (픽셀 단위)

// 플레이어 (공룡) 설정
const dino = {
    width: 50,
    height: 50,
    x: 10,
    y: groundHeight,
    draw() {
        // 공룡 그리기
        ctx.drawImage(avatarImage, this.x, this.y, this.width, this.height);
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
        ctx.drawImage(obstacleImage, this.x, this.y, this.width, this.height);
    }
}

// 게임 상태 관리
let timer = 0;
let cactusArr = [];
let animation;
let jump = false;

// 게임 루프
function gameLoop() {
    animation = requestAnimationFrame(gameLoop);
    timer++;

    // 캔버스 클리어
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 장애물 생성
    if (timer % obstacleSpawnInterval === 0) {
        if (Math.random() < obstacleSpawnProbability) {
            let cactus = new Cactus();
            cactusArr.push(cactus);
        }
    }

    // 장애물 이동 및 충돌 체크
    cactusArr.forEach((cactus, index, arr) => {
        if (cactus.x + cactus.width < 0) {
            arr.splice(index, 1); // 화면을 벗어난 장애물 제거
        }
        cactus.x -= obstacleSpeed; // 장애물 이동

        checkCollision(dino, cactus); // 충돌 체크

        cactus.draw();
    });

    // 점프 로직
    if (jump) {
        if (dino.y > jumpHeightLimit) {
            dino.y -= jumpHeight;
        } else {
            jump = false;
        }
    } else {
        if (dino.y < groundHeight) {
            dino.y += gravity;
        }
    }

    dino.draw();

    updateScore();
}

gameLoop();

// 충돌 체크
function checkCollision(dino, cactus) {
    const xDiff = cactus.x - (dino.x + dino.width);
    const yDiff = cactus.y - (dino.y + dino.height);

    if (xDiff < 0 && yDiff < 0) {
        // 충돌 발생 시 게임 오버
        gameOver();
    }
}

let score = 0;

function updateScore(){
    if (timer % obstacleSpawnInterval === 0) {
        score++;
        document.querySelector('.score span').textContent = score;
    }
}


// 게임 오버 처리
function gameOver() {
    cancelAnimationFrame(animation);
    // 게임 오버 모달 보이기
    const modal = document.getElementById('gameOverModal');
    modal.style.display = 'flex';

    // 모달 닫기 버튼
    const closeModal = document.querySelector('.close');
    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
        resetGame();
    });
}

// 리셋 버튼 클릭 시 호출될 함수
function resetGame() {
    // 캔버스 초기화
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 변수 초기화
    timer = 0;
    cactusArr = [];
    jump = false;
    dino.y = groundHeight;
    score = 0;

    // 리셋 버튼 숨기기
    const modal = document.getElementById('gameOverModal');
    modal.style.display = 'none';

    // 새로운 게임 루프 시작
    gameLoop();

}

// 모달 내 리셋 버튼 클릭 시 호출될 함수
const resetModalButton = document.getElementById('resetModalButton');
resetModalButton.addEventListener('click', resetGame);

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
