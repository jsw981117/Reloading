class LevelUpSystem {
    constructor() {
        this.config = {
            choiceCount: 3,
            maxBulletLevel: 3,
            statUpgradeValues: {
                attackSpeed: 0.02,
                magazineSize: 3,
                reloadTime: 0.2,
                bulletSpeed: 50,
                range: 100,
                maxHP: 20
            }
        };

        this.specialBullets = new Map();
        this.initializeSpecialBullets();
    }

    initializeSpecialBullets() {
        const maxLvl = this.config.maxBulletLevel;
        this.specialBullets.set('piercing', { name: '관통탄', maxLevel: maxLvl, currentLevel: 0 });
        this.specialBullets.set('explosive', { name: '폭발탄', maxLevel: maxLvl, currentLevel: 0 });
        this.specialBullets.set('flame', { name: '화염탄', maxLevel: maxLvl, currentLevel: 0 });
        this.specialBullets.set('freeze', { name: '냉각탄', maxLevel: maxLvl, currentLevel: 0 });
        this.specialBullets.set('shock', { name: '전격탄', maxLevel: maxLvl, currentLevel: 0 });
        this.specialBullets.set('scatter', { name: '확산탄', maxLevel: maxLvl, currentLevel: 0 });
    }

    updateMaxBulletLevels() {
        const maxLvl = this.config.maxBulletLevel;
        for (const [key, data] of this.specialBullets) {
            data.maxLevel = maxLvl;
        }
    }

    generateChoices() {
        const choices = [];
        const cfg = this.config.statUpgradeValues;

        // 능력치 강화 선택지
        const statUpgrades = [
            { type: 'stat', stat: 'attackSpeed', value: cfg.attackSpeed, label: '공격 속도 증가' },
            { type: 'stat', stat: 'magazineSize', value: cfg.magazineSize, label: `탄창 크기 +${cfg.magazineSize}` },
            { type: 'stat', stat: 'reloadTime', value: cfg.reloadTime, label: '재장전 속도 증가' },
            { type: 'stat', stat: 'bulletSpeed', value: cfg.bulletSpeed, label: `탄속 +${cfg.bulletSpeed}` },
            { type: 'stat', stat: 'range', value: cfg.range, label: `사거리 +${cfg.range}` },
            { type: 'stat', stat: 'maxHP', value: cfg.maxHP, label: `최대 체력 +${cfg.maxHP}` }
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

        // 랜덤 선택지
        const allChoices = [...statUpgrades, ...bulletUpgrades];
        const count = Math.min(this.config.choiceCount, allChoices.length);
        for (let i = 0; i < count; i++) {
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
