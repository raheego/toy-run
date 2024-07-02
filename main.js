const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth - 100;
canvas.height = window.innerHeight - 100;

let avata1 = new Image();
avata1.src = '/images/dino.png';
let obstacle = new Image();
obstacle.src = '/images/obstacle.png';

let dino = {
    x: 10,
    y: 200,
    width: 50,
    height: 50,
    draw() {
        ctx.drawImage(avata1, this.x, this.y, this.width, this.height);
    },
};

class Cactus {
    constructor() {
        this.x = 500;
        this.y = 200;
        this.width = 50;
        this.height = 50;
    }
    draw() {
        ctx.drawImage(obstacle, this.x, this.y, this.width, this.height);
    }
}

let timer = 0;
let cactusArr = [];
let animation;
let jump = false;
let jumpTimer = 0;
let gravity = 0.8; // 중력 값
let jumpHeight = 12; // 점프 높이

function gameLoop() {
    animation = requestAnimationFrame(gameLoop);
    timer++;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 120프레임마다 장애물 생성
    if (timer % 120 === 0) {
        let cactus = new Cactus();
        cactusArr.push(cactus);
    }

    // 장애물 이동 및 충돌 검사
    cactusArr.forEach((el, i, o) => {
        if (el.x + el.width < 0) {
            o.splice(i, 1); // 화면을 벗어난 장애물 제거
        }
        el.x--;

        checkCollision(dino, el); // 충돌 검사

        el.draw(); // 장애물 그리기
    });

    // 점프 처리
    if (jump) {
        if (dino.y > 120) {
            dino.y -= jumpHeight; // 점프 높이만큼 올라감
        } else {
            jump = false;
            jumpTimer = 0;
        }
    } else {
        if (dino.y < 200) {
            dino.y += gravity; // 중력 적용
        }
    }

    if (jumpTimer > 50) {
        jump = false; // 점프 제어 변수 리셋
    }

    dino.draw(); // 공룡 그리기
}

gameLoop(); // 게임 루프 시작

// 충돌 검사 함수
function checkCollision(dino, cactus) {
    let xDiff = cactus.x - (dino.x + dino.width);
    let yDiff = cactus.y - (dino.y + dino.height);

    if (xDiff < 0 && yDiff < 0) { // 충돌이 발생한 경우
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cancelAnimationFrame(animation); // 애니메이션 정지
        alert('Game Over'); // 게임 오버 알림
    }
}

// 키 이벤트 처리 (점프)
document.addEventListener('keydown', function(e) {
    if (e.code === 'Space' && !jump) { // 점프 중이 아닐 때만 점프 가능
        jump = true; // 점프 시작
        jumpTimer = 0; // 점프 타이머 초기화
    }
});
