class LevelUpSystem {
    constructor() {
        this.specialBullets = new Map();
        this.initializeSpecialBullets();
    }

    initializeSpecialBullets() {
        this.specialBullets.set('piercing', { name: '관통탄', maxLevel: 3, currentLevel: 0 });
        this.specialBullets.set('explosive', { name: '폭발탄', maxLevel: 3, currentLevel: 0 });
        this.specialBullets.set('flame', { name: '화염탄', maxLevel: 3, currentLevel: 0 });
        this.specialBullets.set('freeze', { name: '냉각탄', maxLevel: 3, currentLevel: 0 });
        this.specialBullets.set('shock', { name: '전격탄', maxLevel: 3, currentLevel: 0 });
        this.specialBullets.set('scatter', { name: '확산탄', maxLevel: 3, currentLevel: 0 });
    }

    generateChoices() {
        const choices = [];

        // 능력치 강화 선택지
        const statUpgrades = [
            { type: 'stat', stat: 'attackSpeed', value: 0.02, label: '공격 속도 증가' },
            { type: 'stat', stat: 'magazineSize', value: 3, label: '탄창 크기 +3' },
            { type: 'stat', stat: 'reloadTime', value: 0.2, label: '재장전 속도 증가' },
            { type: 'stat', stat: 'bulletSpeed', value: 50, label: '탄속 증가' },
            { type: 'stat', stat: 'range', value: 100, label: '사거리 증가' },
            { type: 'stat', stat: 'maxHP', value: 20, label: '최대 체력 증가' }
        ];

        // 특수탄 선택지
        const bulletUpgrades = [];
        for (const [type, data] of this.specialBullets) {
            if (data.currentLevel < data.maxLevel) {
                bulletUpgrades.push({
                    type: 'bullet',
                    bulletType: type,
                    level: data.currentLevel + 1,
                    label: `${data.name} Lv.${data.currentLevel + 1}`
                });
            } else {
                bulletUpgrades.push({
                    type: 'bullet',
                    bulletType: type,
                    level: 1,
                    label: `${data.name} Lv.1 추가`
                });
            }
        }

        // 랜덤 3개 선택지
        const allChoices = [...statUpgrades, ...bulletUpgrades];
        for (let i = 0; i < 3; i++) {
            if (allChoices.length === 0) break;
            const index = randomInt(0, allChoices.length - 1);
            choices.push(allChoices.splice(index, 1)[0]);
        }

        return choices;
    }

    applyChoice(choice, player) {
        if (choice.type === 'stat') {
            player.upgradeStat(choice.stat, choice.value);
        } else if (choice.type === 'bullet') {
            const bulletData = this.specialBullets.get(choice.bulletType);

            if (bulletData.currentLevel < bulletData.maxLevel) {
                bulletData.currentLevel++;
                player.addSpecialBullet(choice.bulletType, bulletData.currentLevel);
            } else {
                player.addSpecialBullet(choice.bulletType, 1);
            }
        }
    }
}
