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
		ctx.fillStyle = 'green';
		ctx.fillRect(this.x, this.y, this.width, this.height);
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
let gameStarted = false; // 추가: 게임 시작 여부 확인

function startGame() {
	if (!gameStarted) {
		gameStarted = true;

		function gameLoop() {
			animation = requestAnimationFrame(gameLoop);
			timer++;

			ctx.clearRect(0, 0, canvas.width, canvas.height);

			if (timer % 120 === 0) {
				let cactus = new Cactus();
				cactusArr.push(cactus);
			}

			cactusArr.forEach((el, i, o) => {
				if (el.x + el.width < 0) {
					o.splice(i, 1);
				}
				el.x--;

				checkCollision(dino, el);

				el.draw();
			});

			if (jump == true) {
				dino.y -= 2;
				jumpTimer++;
			} else {
				if (dino.y < 200) {
					dino.y += 2;
					jumpTimer = 0;
				}
			}

			if (jumpTimer > 50) {
				jump = false;
			}

			dino.draw();
		}

		gameLoop();
	}
}

// 충돌
function checkCollision(dino, cactus) {
	let xDiff = cactus.x - (dino.x + dino.width);
	let yDiff = cactus.y - (dino.y + dino.height);

	if (xDiff < 0 && yDiff < 0) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		cancelAnimationFrame(animation);
		alert('게임 오버');
		gameStarted = false; // 게임 종료 후 다시 시작 가능하도록 설정
	}
}

document.getElementById('startButton').addEventListener('click', startGame);

document.addEventListener('keydown', function(e) {
	if (e.code === 'Space' && dino.y >= 200) {
		jump = true;
	}
});
