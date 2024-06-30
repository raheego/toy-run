var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

canvas.width = window.innerWidth - 100;
canvas.height = window.innerHeight - 100;

var dino = {
	x: 10,
	y: 200,
	width: 50,
	height: 50,
	draw() {
		ctx.fillStyle = 'green';
		ctx.fillRect(this.x, this.y, this.width, this.height);
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
	}
}

var timer = 0;
var cactusArr = [];
var jumpTimer = 0;
var animation;
var jump = false;

function gameLoop() {
	animation = requestAnimationFrame(gameLoop);
	timer++;

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// 120 프레임마다 한번씩
	if (timer % 120 === 0) {
		var cactus = new Cactus();
		cactusArr.push(cactus);
	}

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

	if (jump == true) {
		dino.y -= 2; // 점프 속도 조절
		jumpTimer++;
	}else{
		if (dino.y < 200) {
			dino.y+=2;
			jumpTimer = 0;
		}
	}

	if (jumpTimer > 50) {
		jump = false;
	}

	dino.draw();
}

gameLoop();

// 충돌
function checkCollision(dino, cactus) {
	var xDiff = cactus.x - (dino.x + dino.width);
	var yDiff = cactus.y - (dino.y + dino.height);

	if (xDiff < 0 && yDiff < 0) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		cancelAnimationFrame(animation);
		alert('Game Over');
	}
}

document.addEventListener('keydown', function(e) {
	if (e.code === 'Space' && dino.y >= 200) { // 공룡이 땅에 있을 때만 점프
		jump = true;
	}
});
