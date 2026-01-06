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

// 탄환 아이콘 렌더링
function drawBulletIcon(ctx, type, level, x, y, size) {
    const colors = {
        'normal': '#fff',
        'piercing': '#0ff',
        'explosive': '#f80',
        'flame': '#f00',
        'freeze': '#0af',
        'shock': '#ff0',
        'scatter': '#f0f'
    };

    const color = colors[type] || '#fff';
    ctx.fillStyle = color;

    if (type === 'normal') {
        // 정사각형
        ctx.fillRect(x - size / 2, y - size / 2, size, size);
    } else {
        // 마름모
        ctx.beginPath();
        ctx.moveTo(x, y - size / 2);
        ctx.lineTo(x + size / 2, y);
        ctx.lineTo(x, y + size / 2);
        ctx.lineTo(x - size / 2, y);
        ctx.closePath();
        ctx.fill();
    }

    // 레벨 표시 (특수탄만)
    if (type !== 'normal' && level) {
        ctx.fillStyle = '#000';
        ctx.font = `bold ${size * 0.6}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(level, x, y);
    }
}

// 탄환 타입 이름
function getBulletTypeName(type) {
    const names = {
        'normal': '일반탄',
        'piercing': '관통탄',
        'explosive': '폭발탄',
        'flame': '화염탄',
        'freeze': '냉각탄',
        'shock': '전격탄',
        'scatter': '확산탄'
    };
    return names[type] || '알 수 없음';
}

// 탄환 능력치 설명
function getBulletDescription(type, level) {
    const descriptions = {
        'piercing': [
            '적 1개 관통',
            '적 2개 관통',
            '적 3개 관통'
        ],
        'explosive': [
            '반경 30 폭발 (데미지 8)',
            '반경 50 폭발 (데미지 13)',
            '반경 70 폭발 (데미지 18)'
        ],
        'flame': [
            '화상 2 DPS (3초)',
            '화상 4 DPS (4초)',
            '화상 6 DPS (5초)'
        ],
        'freeze': [
            '50% 감속 (2초)',
            '60% 감속 (2.5초)',
            '70% 감속 (3초)'
        ],
        'shock': [
            '0.5초 스턴',
            '0.8초 스턴',
            '1.1초 스턴'
        ],
        'scatter': [
            '3발 산탄 (15° 확산)',
            '4발 산탄 (15° 확산)',
            '5발 산탄 (25° 확산)'
        ]
    };

    if (type === 'normal') {
        return '기본 탄환 (데미지 10)';
    }

    return descriptions[type] ? descriptions[type][level - 1] : '';
}
