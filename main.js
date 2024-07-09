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

const coinImage = new Image();
coinImage.src = '/images/coin.jpg'

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


// 동전 설정
const coinSpawnInterval = 150; // 동전 생성 간격 (프레임 수)
const coinSpawnProbability = 0.3; // 동전 생성 확률 (0.3는 30%)

// 플레이어 (공룡) 설정
const dino = {
	width: 50,
	height: 50,
	x: 10,
	y: groundHeight,
	draw() {
		ctx.drawImage(avatarImage, this.x, this.y, this.width, this.height);
	},
	updatePosition(){
		// 점프 로직
		if (jump) {
			if (this.y > jumpHeightLimit) {
				this.y -= jumpHeight;
			} else {
				jump = false;
			}
		} else {
			if (this.y < groundHeight) {
				this.y += gravity;
			}
		}
	}
};

// 장애물 클래스
class Cactus {
	constructor() {
		this.width = 25;
		this.height = 25;
		this.x = canvas.width - this.width;
		this.y = 225;
	}

	draw() {
		ctx.drawImage(obstacleImage, this.x, this.y, this.width, this.height);
	}

	updatePosition(speed){
		this.x -= speed;
	}
}

// 동전
class Coin {
	constructor(){
		this.width = 25;
		this.height = 25;
		this.x = canvas.width - this.width;
		// this.y =  Math.random() * (270 - this.height); ;
		this.y = 100;
	}

	draw(){
		ctx.drawImage(coinImage, this.x, this.y, this.width, this.height);
	}

	updatePosition(speed){
		this.x -= speed;
	}
}


// 게임 상태 관리
let timer = 0;
let cactusArr = [];
let coinArr = [];
let animation;
let jump = false;
let score = 0;


// 게임 루프
function gameLoop() {
	animation = requestAnimationFrame(gameLoop);
	timer++;

	updateGame(); // 게임 상태 업데이트
	drawGame();   // 게임 그리기
	updateScore(); // 점수 업데이트

	// 일정 프레임마다 장애물 속도 증가
	if (timer % 500 === 0) {
		obstacleSpeed += obstacleSpeedIncrease;
	}
}

function updateGame() {
	// 장애물 생성
	if (timer % obstacleSpawnInterval === 0) {
		if (Math.random() < obstacleSpawnProbability) {
			let cactus = new Cactus();
			cactusArr.push(cactus);
		}
	}

	// 동전 생성
	if (timer % coinSpawnInterval === 0) {
		if (Math.random() < coinSpawnProbability) {
			let coin = new Coin();
			coinArr.push(coin);
		}
	}

	// 장애물 이동 및 충돌 체크
	cactusArr.forEach((cactus, index, arr) => {
		if (cactus.x + cactus.width < 0) {
			arr.splice(index, 1); // 화면을 벗어난 장애물 제거
		}
		cactus.updatePosition(obstacleSpeed);

		if (checkCollision(dino, cactus)) {
			gameOver();
		}
	});

	// 동전 충돌 체크
	coinArr.forEach((coin, index, arr) => {
		if (coin.x + coin.width < 0) {
			arr.splice(index, 1); // 화면을 벗어난 장애물 제거
		}
		coin.updatePosition(obstacleSpeed);

		if (checkCollision(dino, coin)) {
			arr.splice(index, 1); // 충돌한 동전 제거
			score += 5;
		}
	});

	dino.updatePosition();
}

function drawGame() {
	// 캔버스 클리어
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// 플레이어 그리기
	dino.draw();

	// 장애물 그리기
	cactusArr.forEach(cactus => {
		cactus.draw();
	});

	// 동전 그리기 추가
	coinArr.forEach(coin => {
		coin.draw();
	});
}

function updateScore(){
	if (timer % obstacleSpawnInterval === 0) {
		score++;
		document.querySelector('.score span').textContent = score;
	}
}

// 충돌 체크
function checkCollision(dino, cactus) {
	const xDiff = cactus.x - (dino.x + dino.width);
	const yDiff = cactus.y - (dino.y + dino.height);

	return xDiff < 0 && yDiff < 0;
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
	coinArr = [];
	jump = false;
	dino.y = groundHeight;
	score = 0;
	obstacleSpeed = 2;

	// 모달
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

// 초기 게임 시작
gameLoop();
