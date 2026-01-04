// 충돌 감지
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// 원형 충돌 감지
function checkCircleCollision(x1, y1, r1, x2, y2, r2) {
    const dx = x1 - x2;
    const dy = y1 - y2;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < r1 + r2;
}

// 거리 계산
function getDistance(x1, y1, x2, y2) {
    const dx = x1 - x2;
    const dy = y1 - y2;
    return Math.sqrt(dx * dx + dy * dy);
}

// 화면 밖 체크
function isOffScreen(x, y, width, height, canvasWidth, canvasHeight) {
    return x + width < 0 || x > canvasWidth || y + height < 0 || y > canvasHeight;
}

// 랜덤 정수
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 랜덤 선택
function randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
}
