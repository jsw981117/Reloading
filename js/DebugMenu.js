class DebugMenu {
    constructor(game) {
        this.game = game;
        this.settingsBtn = document.getElementById('settings-btn');
        this.settingsModal = document.getElementById('settings-modal');
        this.debugModal = document.getElementById('debug-modal');
        this.debugMenuBtn = document.getElementById('debug-menu-btn');
        this.settingsCloseBtn = document.getElementById('settings-close-btn');
        this.debugApplyBtn = document.getElementById('debug-apply-btn');
        this.debugCloseBtn = document.getElementById('debug-close-btn');
        this.debugSections = document.getElementById('debug-sections');

        this.setupEvents();
        this.buildDebugMenu();
    }

    setupEvents() {
        this.settingsBtn.onclick = () => this.openSettings();
        this.settingsCloseBtn.onclick = () => this.closeSettings();
        this.debugMenuBtn.onclick = () => this.openDebug();
        this.debugCloseBtn.onclick = () => this.closeDebug();
        this.debugApplyBtn.onclick = () => this.applySettings();
    }

    openSettings() {
        this.settingsModal.classList.remove('hidden');
        this.game.isPaused = true;
    }

    closeSettings() {
        this.settingsModal.classList.add('hidden');
        this.game.isPaused = false;
    }

    openDebug() {
        this.settingsModal.classList.add('hidden');
        this.debugModal.classList.remove('hidden');
        this.updateDebugValues();
    }

    closeDebug() {
        this.debugModal.classList.add('hidden');
        this.game.isPaused = false;
    }

    buildDebugMenu() {
        const sections = [
            {
                title: '🎮 플레이어 능력치',
                fields: [
                    { id: 'attackSpeed', label: '공격 속도', type: 'number', step: 0.01 },
                    { id: 'magazineSize', label: '탄창 크기', type: 'number', step: 1 },
                    { id: 'reloadTime', label: '재장전 시간', type: 'number', step: 0.1 },
                    { id: 'bulletSpeed', label: '탄속', type: 'number', step: 10 },
                    { id: 'range', label: '사거리', type: 'number', step: 10 },
                    { id: 'maxHP', label: '최대 체력', type: 'number', step: 10 },
                    { id: 'moveSpeed', label: '이동 속도', type: 'number', step: 10 },
                    { id: 'currentHP', label: '현재 체력', type: 'number', step: 10 }
                ]
            },
            {
                title: '👾 적 설정',
                fields: [
                    { id: 'enemySpeed', label: '적 이동 속도', type: 'number', step: 5 },
                    { id: 'enemyHP', label: '적 체력', type: 'number', step: 10 },
                    { id: 'enemySpawnInterval', label: '생성 간격(초)', type: 'number', step: 0.1 },
                    { id: 'lanes', label: '레인 수', type: 'number', step: 1 }
                ]
            },
            {
                title: '📈 레벨업 시스템',
                fields: [
                    { id: 'choiceCount', label: '선택지 개수', type: 'number', step: 1 },
                    { id: 'maxBulletLevel', label: '특수탄 최대 레벨', type: 'number', step: 1 },
                    { id: 'exp', label: '현재 경험치', type: 'number', step: 1 },
                    { id: 'level', label: '현재 레벨', type: 'number', step: 1 },
                    { id: 'expToNext', label: '다음 레벨 필요 경험치', type: 'number', step: 1 },
                    { id: 'triggerLevelUp', label: '레벨업 강제 트리거', type: 'button', buttonText: '레벨업!' }
                ]
            },
            {
                title: '💥 능력치 강화 수치',
                fields: [
                    { id: 'statAttackSpeed', label: '공격 속도 증가량', type: 'number', step: 0.01 },
                    { id: 'statMagazineSize', label: '탄창 크기 증가량', type: 'number', step: 1 },
                    { id: 'statReloadTime', label: '재장전 시간 감소량', type: 'number', step: 0.1 },
                    { id: 'statBulletSpeed', label: '탄속 증가량', type: 'number', step: 10 },
                    { id: 'statRange', label: '사거리 증가량', type: 'number', step: 10 },
                    { id: 'statMaxHP', label: '체력 증가량', type: 'number', step: 5 },
                    { id: 'statMoveSpeed', label: '이동 속도 증가량', type: 'number', step: 10 }
                ]
            },
            {
                title: '⚙️ 게임 설정',
                fields: [
                    { id: 'timeScale', label: '게임 속도 배율', type: 'number', step: 0.1 },
                    { id: 'godMode', label: '무적 모드', type: 'button', buttonText: '토글' }
                ]
            }
        ];

        sections.forEach(section => {
            const sectionDiv = document.createElement('div');
            sectionDiv.className = 'debug-section';

            const title = document.createElement('h3');
            title.textContent = section.title;
            sectionDiv.appendChild(title);

            section.fields.forEach(field => {
                const fieldDiv = document.createElement('div');
                fieldDiv.className = 'debug-field';

                const label = document.createElement('label');
                label.textContent = field.label;
                fieldDiv.appendChild(label);

                if (field.type === 'button') {
                    const button = document.createElement('button');
                    button.textContent = field.buttonText;
                    button.onclick = () => this.handleButtonClick(field.id);
                    fieldDiv.appendChild(button);
                } else {
                    const input = document.createElement('input');
                    input.type = field.type;
                    input.id = `debug-${field.id}`;
                    input.step = field.step;
                    fieldDiv.appendChild(input);
                }

                sectionDiv.appendChild(fieldDiv);
            });

            this.debugSections.appendChild(sectionDiv);
        });
    }

    updateDebugValues() {
        const p = this.game.player.stats;
        const g = this.game;

        document.getElementById('debug-attackSpeed').value = p.attackSpeed;
        document.getElementById('debug-magazineSize').value = p.magazineSize;
        document.getElementById('debug-reloadTime').value = p.reloadTime;
        document.getElementById('debug-bulletSpeed').value = p.bulletSpeed;
        document.getElementById('debug-range').value = p.range;
        document.getElementById('debug-maxHP').value = p.maxHP;
        document.getElementById('debug-moveSpeed').value = p.moveSpeed;
        document.getElementById('debug-currentHP').value = this.game.player.hp;

        document.getElementById('debug-enemySpeed').value = g.config.enemySpeed;
        document.getElementById('debug-enemyHP').value = g.config.enemyHP;
        document.getElementById('debug-enemySpawnInterval').value = g.enemySpawnInterval;
        document.getElementById('debug-lanes').value = g.config.lanes;

        document.getElementById('debug-choiceCount').value = g.levelUpSystem.config.choiceCount;
        document.getElementById('debug-maxBulletLevel').value = g.levelUpSystem.config.maxBulletLevel;
        document.getElementById('debug-exp').value = g.exp;
        document.getElementById('debug-level').value = g.level;
        document.getElementById('debug-expToNext').value = g.expToNextLevel;

        document.getElementById('debug-statAttackSpeed').value = g.levelUpSystem.config.statUpgradeValues.attackSpeed;
        document.getElementById('debug-statMagazineSize').value = g.levelUpSystem.config.statUpgradeValues.magazineSize;
        document.getElementById('debug-statReloadTime').value = g.levelUpSystem.config.statUpgradeValues.reloadTime;
        document.getElementById('debug-statBulletSpeed').value = g.levelUpSystem.config.statUpgradeValues.bulletSpeed;
        document.getElementById('debug-statRange').value = g.levelUpSystem.config.statUpgradeValues.range;
        document.getElementById('debug-statMaxHP').value = g.levelUpSystem.config.statUpgradeValues.maxHP;
        document.getElementById('debug-statMoveSpeed').value = g.levelUpSystem.config.statUpgradeValues.moveSpeed;

        document.getElementById('debug-timeScale').value = g.timeScale;
    }

    applySettings() {
        const p = this.game.player.stats;
        const g = this.game;

        p.attackSpeed = parseFloat(document.getElementById('debug-attackSpeed').value);
        p.magazineSize = parseInt(document.getElementById('debug-magazineSize').value);
        p.reloadTime = parseFloat(document.getElementById('debug-reloadTime').value);
        p.bulletSpeed = parseFloat(document.getElementById('debug-bulletSpeed').value);
        p.range = parseFloat(document.getElementById('debug-range').value);
        p.maxHP = parseFloat(document.getElementById('debug-maxHP').value);
        p.moveSpeed = parseFloat(document.getElementById('debug-moveSpeed').value);
        this.game.player.hp = parseFloat(document.getElementById('debug-currentHP').value);

        this.game.player.magazine.reloadTime = p.reloadTime;

        g.config.enemySpeed = parseFloat(document.getElementById('debug-enemySpeed').value);
        g.config.enemyHP = parseFloat(document.getElementById('debug-enemyHP').value);
        g.enemySpawnInterval = parseFloat(document.getElementById('debug-enemySpawnInterval').value);
        g.config.lanes = parseInt(document.getElementById('debug-lanes').value);

        g.levelUpSystem.config.choiceCount = parseInt(document.getElementById('debug-choiceCount').value);
        g.levelUpSystem.config.maxBulletLevel = parseInt(document.getElementById('debug-maxBulletLevel').value);
        g.exp = parseInt(document.getElementById('debug-exp').value);
        g.level = parseInt(document.getElementById('debug-level').value);
        g.expToNextLevel = parseInt(document.getElementById('debug-expToNext').value);

        g.levelUpSystem.config.statUpgradeValues.attackSpeed = parseFloat(document.getElementById('debug-statAttackSpeed').value);
        g.levelUpSystem.config.statUpgradeValues.magazineSize = parseInt(document.getElementById('debug-statMagazineSize').value);
        g.levelUpSystem.config.statUpgradeValues.reloadTime = parseFloat(document.getElementById('debug-statReloadTime').value);
        g.levelUpSystem.config.statUpgradeValues.bulletSpeed = parseFloat(document.getElementById('debug-statBulletSpeed').value);
        g.levelUpSystem.config.statUpgradeValues.range = parseFloat(document.getElementById('debug-statRange').value);
        g.levelUpSystem.config.statUpgradeValues.maxHP = parseFloat(document.getElementById('debug-statMaxHP').value);
        g.levelUpSystem.config.statUpgradeValues.moveSpeed = parseFloat(document.getElementById('debug-statMoveSpeed').value);

        g.timeScale = parseFloat(document.getElementById('debug-timeScale').value);

        g.levelUpSystem.updateMaxBulletLevels();
    }

    handleButtonClick(id) {
        if (id === 'triggerLevelUp') {
            this.closeDebug();
            this.game.levelUp();
        } else if (id === 'godMode') {
            this.game.godMode = !this.game.godMode;
            alert(this.game.godMode ? '무적 모드 ON' : '무적 모드 OFF');
        }
    }
}
