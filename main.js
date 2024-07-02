const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth - 100;
canvas.height = window.innerHeight - 100;

let avata1 = new Image();
avata1.src = '/images/dino.png';
let obstacle = new Image();
obstacle.src = '/images/obstacle.png';

const JUMP_SPEED = 10; // 점프 속도
const FALL_SPEED = 2 ; // 떨어지는 속도
let jumpHeight = 60; // 점프 높이 제한

let dino = {
    width: 50,
    height: 50,
    x: 10,
    y: 200,
    draw() {
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(avata1, this.x, this.y, this.width, this.height);
    },
};


class Cactus {
    constructor() {
        this.width = 50;
        this.height = 50;
        this.x = canvas.width  - this.width;
        this.y = 200;
    }
    draw() {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(obstacle, this.x, this.y, this.width, this.height);
    }
}

let timer = 0;
let cactusArr = [];
let jumpTimer = 0;
let animation;
let jump = false;

function gameLoop() {
    animation = requestAnimationFrame(gameLoop);
    timer++;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 120 프레임마다 한번씩
    if (timer % 120 === 0) {
        let cactus = new Cactus();
        cactusArr.push(cactus);
    }

    // 랜덤한 간격으로 장애물 생성
    // if (Math.random() < 0.01) { // 예를 들어, 1% 확률로 장애물 생성
    //     let cactus = new Cactus();
    //     cactusArr.push(cactus);
    // }

    // el 장애물
    cactusArr.forEach((el, i, o) => {
        // x좌표가 0 미만이면 장애물 제거
        if (el.x + el.width < 0) {
            o.splice(i, 1);
        }
        el.x--;

        checkCollision(dino, el);

        el.draw();
    });

    if (jump) {
        if (dino.y > jumpHeight) {
            dino.y -= JUMP_SPEED; // 점프 속도 조절
        } else {
            jump = false;
            jumpTimer = 0;
        }
        jumpTimer++;
    } else {
        if (dino.y < 200) { // 다시 떨어지는 위치
            dino.y += FALL_SPEED;
        }
    }

    dino.draw();
}

gameLoop();

// 충돌
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
    if (e.code === 'Space' && dino.y >= 200 && !jump) {
        jump = true;
    }
});
