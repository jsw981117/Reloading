class UI {
    constructor() {
        this.hpFill = document.getElementById('hp-fill');
        this.ammoCount = document.getElementById('ammo-count');
        this.reloadIndicator = document.getElementById('reload-indicator');
        this.levelupModal = document.getElementById('levelup-modal');
        this.levelupChoices = document.getElementById('levelup-choices');

        this.currentChoices = null;
        this.onChoiceCallback = null;
    }

    updateHP(current, max) {
        const percent = (current / max) * 100;
        this.hpFill.style.width = percent + '%';
    }

    updateAmmo(current, total) {
        this.ammoCount.textContent = `${current}/${total}`;
    }

    showReload(show) {
        if (show) {
            this.reloadIndicator.classList.add('active');
        } else {
            this.reloadIndicator.classList.remove('active');
        }
    }

    showLevelUp(choices, callback) {
        this.currentChoices = choices;
        this.onChoiceCallback = callback;

        this.levelupChoices.innerHTML = '';

        choices.forEach((choice, index) => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.innerHTML = `<strong>${choice.label}</strong>`;

            if (choice.type === 'stat') {
                btn.innerHTML += `<div>${this.getStatDescription(choice)}</div>`;
            } else {
                btn.innerHTML += `<div>${this.getBulletDescription(choice)}</div>`;
            }

            btn.onclick = () => this.selectChoice(index);
            this.levelupChoices.appendChild(btn);
        });

        this.levelupModal.classList.remove('hidden');
    }

    selectChoice(index) {
        const choice = this.currentChoices[index];
        this.levelupModal.classList.add('hidden');

        if (this.onChoiceCallback) {
            this.onChoiceCallback(choice);
        }
    }

    getStatDescription(choice) {
        switch (choice.stat) {
            case 'attackSpeed':
                return '발사 속도가 빨라집니다';
            case 'magazineSize':
                return '탄창 크기가 늘어납니다';
            case 'reloadTime':
                return '재장전 속도가 빨라집니다';
            case 'bulletSpeed':
                return '총알 속도가 빨라집니다';
            case 'range':
                return '사거리가 늘어납니다';
            case 'maxHP':
                return '최대 체력이 증가합니다';
            default:
                return '';
        }
    }

    getBulletDescription(choice) {
        const descriptions = {
            'piercing': '적을 관통하는 총알',
            'explosive': '명중 시 폭발하는 총알',
            'flame': '화상을 입히는 총알',
            'freeze': '적을 느리게 하는 총알',
            'shock': '적을 기절시키는 총알',
            'scatter': '여러 발로 퍼지는 총알'
        };
        return descriptions[choice.bulletType] || '';
    }
}
