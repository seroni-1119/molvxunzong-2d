(() => {
    // 开场动画相关元素
    const introContainer = document.getElementById('intro-container');
    const introVideo = document.getElementById('intro-video');
    const introTitle = document.getElementById('intro-title');
    const introTip = document.getElementById('intro-tip');
    const introIntro = document.getElementById('intro-intro');
    const gameContainer = document.getElementById('game-container');
    
    // 开场动画状态
    let introActive = true;
    let currentStage = 0; // 0: 标题显示中, 1: 点击提示显示中, 2: 开场介绍显示中
    
    // 初始化开场动画
    function initIntroAnimation() {
        // 确保开场动画容器显示，游戏容器隐藏
        introContainer.style.display = 'flex';
        gameContainer.style.display = 'none';
        
        // 添加点击事件监听器
        introContainer.addEventListener('click', handleIntroClick);
        
        // 初始化音频系统
        initAudioSystem();
        
        // 确保视频自动播放，同时播放开场音乐
        introVideo.play().then(() => {
            console.log('视频播放成功，同时播放开场音乐');
            // 视频播放成功后，立即播放开场音乐
            setTimeout(() => {
                playStartMusic();
            }, 500); // 0.5秒后播放，确保音频系统已初始化
        }).catch(e => {
            console.log('视频自动播放失败，需要用户交互:', e);
            // 即使视频播放失败，也尝试播放开场音乐
            setTimeout(() => {
                playStartMusic();
            }, 1000);
        });
        
        // 3秒后显示点击提示
        setTimeout(() => {
            if (currentStage === 0) {
                showClickTip();
            }
        }, 3000);
    }
    
    // 初始化音频系统
    function initAudioSystem() {
        window.audioSystem = {
            startMusic: null,
            backgroundMusic: null,
            rainSound: null,
            startMusicLoaded: false,
            backgroundMusicLoaded: false,
            rainSoundLoaded: false,
            hasUserInteracted: false, // 用户是否已交互
            needsUserInteraction: false, // 是否需要用户交互才能播放
            startMusicFadeOut: {
                active: false,
                startTime: 0,
                duration: 2000, // 2秒淡出
                startVolume: 1.0
            },
            backgroundMusicFadeOut: {
                active: false,
                startTime: 0,
                duration: 5000, // 5秒淡出
                startVolume: 1.0
            },
            isGameStarted: false
        };
        
        // 加载音频文件
        console.log('开始加载开场音乐...');
        window.audioSystem.startMusic = new Audio();
        window.audioSystem.startMusic.oncanplaythrough = () => {
            window.audioSystem.startMusicLoaded = true;
            console.log('开场音乐加载完成，等待用户交互后播放');
        };
        window.audioSystem.startMusic.onerror = (error) => {
            console.warn('开场音乐加载失败:', error, '文件路径: music_start.mp3');
        };
        window.audioSystem.startMusic.onloadstart = () => {
            console.log('开始加载开场音乐文件...');
        };
        window.audioSystem.startMusic.onloadeddata = () => {
            console.log('开场音乐数据加载完成');
        };
        window.audioSystem.startMusic.src = 'music_start.mp3';
        window.audioSystem.startMusic.loop = false;
        console.log('开场音乐源设置为:', window.audioSystem.startMusic.src);

        window.audioSystem.backgroundMusic = new Audio();
        window.audioSystem.backgroundMusic.oncanplaythrough = () => {
            window.audioSystem.backgroundMusicLoaded = true;
            console.log('背景音乐加载完成');
        };
        window.audioSystem.backgroundMusic.onerror = (error) => {
            console.warn('背景音乐加载失败:', error, '文件路径: music_background.mp3');
        };
        window.audioSystem.backgroundMusic.src = 'music_background.mp3';
        window.audioSystem.backgroundMusic.loop = false; // 手动控制循环
        
        // 加载雨声音频
        console.log('开始加载雨声音频...');
        window.audioSystem.rainSound = new Audio();
        window.audioSystem.rainSound.oncanplaythrough = () => {
            window.audioSystem.rainSoundLoaded = true;
            console.log('雨声音频加载完成');
        };
        window.audioSystem.rainSound.onerror = (error) => {
            console.warn('雨声音频加载失败:', error, '文件路径: music_rain.mp3');
        };
        window.audioSystem.rainSound.src = 'music_rain.mp3';
        window.audioSystem.rainSound.loop = true; // 雨声循环播放
        window.audioSystem.rainSound.volume = 1.0; // 设置最大音量
    }
    
    // 播放开场音乐
    function playStartMusic() {
        console.log('=== 尝试播放开场音乐 ===');
        console.log('音频系统存在:', !!window.audioSystem);
        console.log('加载状态:', window.audioSystem?.startMusicLoaded);
        console.log('音频对象存在:', !!window.audioSystem?.startMusic);
        console.log('音频源:', window.audioSystem?.startMusic?.src);
        
        if (window.audioSystem?.startMusicLoaded && window.audioSystem?.startMusic) {
            window.audioSystem.startMusic.volume = 1.0;
            console.log('设置音量为1.0，开始播放...');
            window.audioSystem.startMusic.play().then(() => {
                console.log('开场音乐播放成功！');
            }).catch(error => {
                console.warn('开场音乐播放失败:', error);
                if (error.name === 'NotAllowedError') {
                    console.log('由于浏览器自动播放策略，开场音乐将在用户交互后播放');
                    // 标记需要用户交互后播放
                    window.audioSystem.needsUserInteraction = true;
                }
            });
            console.log('开始播放开场音乐');
        } else {
            console.warn('开场音乐未加载完成，无法播放');
            console.warn('加载状态:', window.audioSystem?.startMusicLoaded);
            console.warn('音频对象:', !!window.audioSystem?.startMusic);
        }
    }
    
    // 开始开场音乐淡出
    function startStartMusicFadeOut() {
        if (window.audioSystem?.startMusic && window.audioSystem?.startMusicLoaded) {
            window.audioSystem.startMusicFadeOut.active = true;
            window.audioSystem.startMusicFadeOut.startTime = Date.now();
            window.audioSystem.startMusicFadeOut.startVolume = window.audioSystem.startMusic.volume;
            console.log('开始开场音乐淡出');
        }
    }
    
    // 更新开场音乐淡出
    function updateStartMusicFadeOut() {
        if (!window.audioSystem?.startMusicFadeOut?.active || !window.audioSystem?.startMusic) {
            return;
        }

        const currentTime = Date.now();
        const elapsed = currentTime - window.audioSystem.startMusicFadeOut.startTime;
        const progress = Math.min(elapsed / window.audioSystem.startMusicFadeOut.duration, 1);

        // 计算当前音量
        const currentVolume = window.audioSystem.startMusicFadeOut.startVolume * (1 - progress);
        window.audioSystem.startMusic.volume = Math.max(0, currentVolume);

        // 如果淡出完成，停止音乐并开始播放背景音乐
        if (progress >= 1) {
            window.audioSystem.startMusic.pause();
            window.audioSystem.startMusic.currentTime = 0;
            window.audioSystem.startMusicFadeOut.active = false;
            console.log('开场音乐淡出完成');
            // 开始播放背景音乐
            playBackgroundMusic();
            window.audioSystem.isGameStarted = true;
        }
    }
    
    // 播放背景音乐
    function playBackgroundMusic() {
        console.log('尝试播放背景音乐，加载状态:', window.audioSystem?.backgroundMusicLoaded, '音频对象:', !!window.audioSystem?.backgroundMusic);
        
        // 确保开场音乐完全停止
        if (window.audioSystem?.startMusic) {
            window.audioSystem.startMusic.pause();
            window.audioSystem.startMusic.currentTime = 0;
            window.audioSystem.startMusic.volume = 0;
            console.log('确保开场音乐已停止');
        }
        
        if (window.audioSystem?.backgroundMusicLoaded && window.audioSystem?.backgroundMusic) {
            window.audioSystem.backgroundMusic.volume = 1.0;
            window.audioSystem.backgroundMusic.currentTime = 0;
            window.audioSystem.backgroundMusic.play().then(() => {
                console.log('背景音乐播放成功');
            }).catch(error => {
                console.warn('背景音乐播放失败:', error);
            });
            console.log('开始播放背景音乐');
        } else {
            console.warn('背景音乐未加载完成，无法播放，加载状态:', window.audioSystem?.backgroundMusicLoaded);
        }
        
        // 同时播放雨声
        playRainSound();
    }
    
    // 播放雨声
    function playRainSound() {
        console.log('尝试播放雨声，加载状态:', window.audioSystem?.rainSoundLoaded, '音频对象:', !!window.audioSystem?.rainSound);
        
        if (window.audioSystem?.rainSoundLoaded && window.audioSystem?.rainSound) {
            window.audioSystem.rainSound.volume = 1.0; // 设置最大音量
            window.audioSystem.rainSound.play().then(() => {
                console.log('雨声播放成功！');
            }).catch(error => {
                console.warn('雨声播放失败:', error);
            });
            console.log('开始播放雨声');
        } else {
            console.warn('雨声未加载完成，无法播放');
        }
    }
    
    // 开始背景音乐淡出
    function startBackgroundMusicFadeOut() {
        if (window.audioSystem?.backgroundMusic && window.audioSystem?.backgroundMusicLoaded) {
            window.audioSystem.backgroundMusicFadeOut.active = true;
            window.audioSystem.backgroundMusicFadeOut.startTime = Date.now();
            window.audioSystem.backgroundMusicFadeOut.startVolume = window.audioSystem.backgroundMusic.volume;
            console.log('开始背景音乐淡出');
        }
    }
    
    // 更新背景音乐淡出和循环
    function updateBackgroundMusic() {
        if (!window.audioSystem?.backgroundMusic || !window.audioSystem?.backgroundMusicLoaded) {
            return;
        }

        // 检查音频是否已结束（用于循环播放）
        if (window.audioSystem.backgroundMusic.ended) {
            console.log('背景音乐播放结束，重新开始播放');
            // 确保开场音乐停止
            if (window.audioSystem?.startMusic) {
                window.audioSystem.startMusic.pause();
                window.audioSystem.startMusic.currentTime = 0;
                window.audioSystem.startMusic.volume = 0;
            }
            window.audioSystem.backgroundMusic.currentTime = 0;
            window.audioSystem.backgroundMusic.volume = 1.0;
            window.audioSystem.backgroundMusicFadeOut.active = false;
            window.audioSystem.backgroundMusic.play().catch(error => {
                console.warn('背景音乐重新播放失败:', error);
            });
            // 同时确保雨声继续播放
            if (window.audioSystem?.rainSound && window.audioSystem?.rainSoundLoaded) {
                if (window.audioSystem.rainSound.paused) {
                    window.audioSystem.rainSound.play().catch(error => {
                        console.warn('雨声重新播放失败:', error);
                    });
                }
            }
            return;
        }

        // 检查是否需要开始淡出（最后5秒）
        const duration = window.audioSystem.backgroundMusic.duration;
        const currentTime = window.audioSystem.backgroundMusic.currentTime;
        
        // 如果duration不可用，跳过淡出逻辑
        if (!duration || !isFinite(duration)) {
            return;
        }
        
        const timeRemaining = duration - currentTime;

        if (timeRemaining <= 5 && !window.audioSystem.backgroundMusicFadeOut.active) {
            startBackgroundMusicFadeOut();
        }

        // 更新淡出效果
        if (window.audioSystem.backgroundMusicFadeOut.active) {
            const fadeElapsed = Date.now() - window.audioSystem.backgroundMusicFadeOut.startTime;
            const fadeProgress = Math.min(fadeElapsed / window.audioSystem.backgroundMusicFadeOut.duration, 1);

            // 计算当前音量
            const currentVolume = window.audioSystem.backgroundMusicFadeOut.startVolume * (1 - fadeProgress);
            window.audioSystem.backgroundMusic.volume = Math.max(0, currentVolume);

            // 如果淡出完成，重新开始播放
            if (fadeProgress >= 1) {
                // 确保开场音乐停止
                if (window.audioSystem?.startMusic) {
                    window.audioSystem.startMusic.pause();
                    window.audioSystem.startMusic.currentTime = 0;
                    window.audioSystem.startMusic.volume = 0;
                }
                window.audioSystem.backgroundMusic.pause();
                window.audioSystem.backgroundMusic.currentTime = 0;
                window.audioSystem.backgroundMusicFadeOut.active = false;
                window.audioSystem.backgroundMusic.volume = 1.0;
                window.audioSystem.backgroundMusic.play().catch(error => {
                    console.warn('背景音乐重新播放失败:', error);
                });
                // 同时确保雨声继续播放
                if (window.audioSystem?.rainSound && window.audioSystem?.rainSoundLoaded) {
                    if (window.audioSystem.rainSound.paused) {
                        window.audioSystem.rainSound.play().catch(error => {
                            console.warn('雨声重新播放失败:', error);
                        });
                    }
                }
                console.log('背景音乐重新开始播放');
            }
        }
    }
    
    // 显示点击提示
    function showClickTip() {
        currentStage = 1;
        introTip.style.opacity = '1';
        introTip.style.transition = 'opacity 0.5s ease-in-out';
    }
    
    // 处理开场动画点击
    function handleIntroClick() {
        // 如果开场音乐因为浏览器策略没有播放，在用户第一次点击时播放
        if (!window.audioSystem?.hasUserInteracted && window.audioSystem?.needsUserInteraction) {
            window.audioSystem.hasUserInteracted = true;
            if (window.audioSystem?.startMusicLoaded && window.audioSystem?.startMusic) {
                console.log('用户交互后播放开场音乐');
                playStartMusic();
            }
        }
        
        if (currentStage === 1) {
            // 第一阶段：点击提示 -> 画面变黑 -> 显示开场介绍
            fadeToBlackAndShowIntro();
        } else if (currentStage === 2) {
            // 第二阶段：开场介绍 -> 画面变黑 -> 进入游戏
            fadeToBlackAndStartGame();
        }
    }
    
    // 画面变黑并显示开场介绍
    function fadeToBlackAndShowIntro() {
        currentStage = 2;
        
        // 添加变黑效果
        introContainer.classList.add('fade-to-black');
        
        // 1秒后显示开场介绍
        setTimeout(() => {
            introIntro.style.opacity = '1';
            introIntro.style.transition = 'opacity 1s ease-in-out';
        }, 1000);
    }
    
    // 画面变黑并开始游戏
    function fadeToBlackAndStartGame() {
        // 添加变黑效果
        introContainer.classList.add('fade-to-black');
        introIntro.style.transition = 'opacity 1s ease-in-out';
        introIntro.style.opacity = '0';
        
        // 1秒后进入游戏
        setTimeout(() => {
            startGame();
        }, 1000);
    }
    
    // 开始游戏
    function startGame() {
        introActive = false;
        introContainer.style.display = 'none';
        gameContainer.style.display = 'block';
        
        // 初始化游戏
        initGame();
    }
    
    // 如果页面加载完成，初始化开场动画
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initIntroAnimation);
    } else {
        initIntroAnimation();
    }
    
    // 游戏初始化函数
    function initGame() {
        const canvas = document.getElementById('game');
        const ctx = canvas.getContext('2d');

    const WIDTH = canvas.width;   // 800 (横屏 4:3)
    const HEIGHT = canvas.height; // 600 (横屏 4:3)

    // ===============
    // 游戏配置参数
    // ===============
    const PLAYER_SIZE = 40; // 角色尺寸（像素）
    const PLAYER_SCALE = 3.5; // 角色缩放倍数
    const PLAYER_START_I = 13; // 角色初始位置 i 坐标
    const PLAYER_START_J = 3; // 角色初始位置 j 坐标
    const ITEM_SIZE = 30; // 道具尺寸（像素）
    const ITEM_SCALE = 1.0; // 道具缩放倍数
    const BAMBOO_SIZE = 100; // 竹子尺寸（像素）
    const BAMBOO_SCALE = 10; // 竹子缩放倍数
    const BAMBOO_POSITION_I = 10; // 竹子位置 i 坐标
    const BAMBOO_POSITION_J = 14; // 竹子位置 j 坐标
    const FUTOU_POSITION_I = 6; // 斧头位置 i 坐标
    const FUTOU_POSITION_J = 13; // 斧头位置 j 坐标
    const FUTOU_SIZE = 30; // 斧头尺寸（像素）
    const FUTOU_SCALE = 1.5; // 斧头缩放倍数
    const INTERACTION_POSITION_I = 2; // 交互触发位置 i 坐标
    const INTERACTION_POSITION_J = 3; // 交互触发位置 j 坐标
    const INTERACTION_RADIUS = 2; // 交互检测半径（格）
    const BUTTON_POSITION_I = -1; // 按钮位置 i 坐标
    const BUTTON_POSITION_J = 2; // 按钮位置 j 坐标
    const INTERACTION2_POSITION_I = 6; // 第二个交互触发位置 i 坐标
    const INTERACTION2_POSITION_J = 13; // 第二个交互触发位置 j 坐标
    const INTERACTION2_RADIUS = 2; // 第二个交互检测半径（格）
    const BUTTON2_POSITION_I = 5; // 第二个按钮位置 i 坐标
    const BUTTON2_POSITION_J = 12; // 第二个按钮位置 j 坐标
    const BUTTON_SIZE = 120; // 交互按钮尺寸（像素）
    const DRAW_ICON_POSITION_I = 18; // 绘制图标位置 i 坐标
    const DRAW_ICON_POSITION_J = -1; // 绘制图标位置 j 坐标
    const DRAW_ICON_SIZE = 150; // 绘制图标尺寸（像素）
    const CHART_IMAGE_SRC = '2_chart_bamboo_01.png'; // 图表图片路径
    const FUTOU_INFO_IMAGE_SRC = '2_futou_information.png'; // 斧头信息图片路径
    const CHART_FUTOU_IMAGE_SRC = '2_chart_futou_01.png'; // 斧头图表图片路径
    const DRAW_ICON_SRC = '2_draw_ui.png'; // 绘制图标路径
    const HUAZHOU_IMAGE_SRC = '2_huazhou_02.png'; // 画轴图片路径
    const YELLOW_DRAWING_UI_SRC = '2_yellow_drawing_ui.png'; // 黄色绘制UI路径
    const GREEN_DRAWING_UI_SRC = '2_green_drawing_ui.png'; // 绿色绘制UI路径
    const BLUE_DRAWING_UI_SRC = '2_blue_drawing_ui.png'; // 蓝色绘制UI路径
    const RED_DRAWING_UI_SRC = '2_red_drawing_ui.png'; // 红色绘制UI路径
    const BROWN_DRAWING_UI_SRC = '2_brown_drawing_ui.png'; // 棕色绘制UI路径
    const BACKPACK_IMAGE_SRC = '2_paper_bag_back.png'; // 背包界面图片路径
    const FUTOU_ITEM_SRC = '2_futou_among the grass.png'; // 斧头物品图片路径
    const OBSTACLE_START_I = 0; // 障碍起点 i 坐标
    const OBSTACLE_START_J = -30; // 障碍起点 j 坐标
    const OBSTACLE_END_I = 0; // 障碍终点 i 坐标
    const OBSTACLE_END_J = 20; // 障碍终点 j 坐标

    // ===============
    // 等距小游戏原型
    // ===============
    const unit = 28; // 每格像素单位
    const cos30 = Math.cos(Math.PI / 6);
    const sin30 = Math.sin(Math.PI / 6);

    // 基于背景尺寸动态确定可移动范围（整张背景）
    // 边界使用 s=(i-j), t=(i+j) 的范围
    let sMin = -20, sMax = 20; // 预设，在背景加载后会被重算
    let tMin = -15, tMax = 15;
    let flagI = 6, flagJ = 6;

    // 背景图：中心与 (0,0) 原点对齐
    const bgImg = new Image();
    bgImg.src = '2_without bamboo_village.png';
    let bgLoaded = false;
    bgImg.onload = () => {
        bgLoaded = true;
        // 背景尺寸 -> s,t 范围：
        // 在屏幕上，Δx = (Δi-Δj)*unit*cos30, Δy = (Δi+Δj)*unit*sin30
        // 令 s=i-j, t=i+j，则 背景宽度 ≈ (sMax-sMin)*unit*cos30，背景高度 ≈ (tMax-tMin)*unit*sin30
        // 因此：
        const sSpan = Math.max(1, Math.floor(bgImg.width / (unit * cos30)));
        const tSpan = Math.max(1, Math.floor(bgImg.height / (unit * sin30)));
        sMin = -Math.floor(sSpan / 2);
        sMax = sMin + sSpan;
        tMin = -Math.floor(tSpan / 2);
        tMax = tMin + tSpan;

        // 初始玩家位置使用配置参数
        player.i = PLAYER_START_I; player.j = PLAYER_START_J; 
        player.pi = PLAYER_START_I; player.pj = PLAYER_START_J; 
        player.ti = PLAYER_START_I; player.tj = PLAYER_START_J; 
        player.t = 1;
        // 旗帜放在靠右下角的安全位置（留1格边距）
        const rightBottomS = sMax - 2;
        const rightBottomT = tMax - 2;
        // 由 s,t 反解 i,j：i=(s+t)/2, j=(t-s)/2，四舍五入到整数格
        flagI = Math.round((rightBottomS + rightBottomT) / 2);
        flagJ = Math.round((rightBottomT - rightBottomS) / 2);

        // 道具已在道具系统初始化时添加
    };

    // 角色动画系统
    class PlayerAnimation {
        constructor() {
            this.images = {
                idle: {
                    up: null,      // back right 01
                    down: null,    // zheng left 01  
                    left: null,    // back left 01
                    right: null    // zheng right 01
                },
                walk: {
                    up: [],        // back right 01-09
                    down: [],      // zheng left 01-08
                    left: [],      // back left 01-09
                    right: []      // zheng right 01-08
                }
            };
            this.currentState = 'idle';
            this.currentDirection = 'down';
            this.currentFrame = 0;
            this.frameTime = 0;
            this.frameRate = 8; // 每秒8帧
            this.loaded = false;
            this.loadImages();
        }

        loadImages() {
            const basePath = './'; // 使用相对路径
            let loadedCount = 0;
            const totalImages = 1 + 1 + 1 + 1 + 9 + 8 + 9 + 8; // 4个待机 + 4个移动序列

            // 加载待机状态图片
            this.loadImage(basePath + 'back right/2_ling_back right_01.png', (img) => {
                this.images.idle.up = img;
                this.checkLoadComplete(++loadedCount, totalImages);
            });
            this.loadImage(basePath + 'zheng left/2_ling_go_left_01.png', (img) => {
                this.images.idle.down = img;
                this.checkLoadComplete(++loadedCount, totalImages);
            });
            this.loadImage(basePath + 'back left/2_ling_back left_01.png', (img) => {
                this.images.idle.left = img;
                this.checkLoadComplete(++loadedCount, totalImages);
            });
            this.loadImage(basePath + 'zheng right/2_ling_go_right_01.png', (img) => {
                this.images.idle.right = img;
                this.checkLoadComplete(++loadedCount, totalImages);
            });

            // 加载移动状态图片序列
            // 向上走 (back right 01-09)
            for (let i = 1; i <= 9; i++) {
                this.loadImage(basePath + `back right/2_ling_back right_0${i}.png`, (img) => {
                    this.images.walk.up.push(img);
                    this.checkLoadComplete(++loadedCount, totalImages);
                });
            }

            // 向下走 (zheng left 01-08)
            for (let i = 1; i <= 8; i++) {
                this.loadImage(basePath + `zheng left/2_ling_go_left_0${i}.png`, (img) => {
                    this.images.walk.down.push(img);
                    this.checkLoadComplete(++loadedCount, totalImages);
                });
            }

            // 向左走 (back left 01-09)
            for (let i = 1; i <= 9; i++) {
                this.loadImage(basePath + `back left/2_ling_back left_0${i}.png`, (img) => {
                    this.images.walk.left.push(img);
                    this.checkLoadComplete(++loadedCount, totalImages);
                });
            }

            // 向右走 (zheng right 01-08)
            for (let i = 1; i <= 8; i++) {
                this.loadImage(basePath + `zheng right/2_ling_go_right_0${i}.png`, (img) => {
                    this.images.walk.right.push(img);
                    this.checkLoadComplete(++loadedCount, totalImages);
                });
            }
        }

        loadImage(src, callback) {
            const img = new Image();
            img.onload = () => {
                console.log('Loaded image:', src);
                callback(img);
            };
            img.onerror = () => {
                console.warn('Failed to load image:', src);
                callback(null);
            };
            img.src = src;
        }

        checkLoadComplete(loaded, total) {
            console.log(`图片加载进度: ${loaded}/${total}`);
            if (loaded >= total) {
                this.loaded = true;
                console.log('所有角色动画图片加载完成');
            }
        }

        setState(state, direction) {
            if (this.currentState !== state || this.currentDirection !== direction) {
                this.currentState = state;
                this.currentDirection = direction;
                this.currentFrame = 0;
                this.frameTime = 0;
            }
        }

        update(dt) {
            if (!this.loaded) return;

            if (this.currentState === 'walk') {
                this.frameTime += dt;
                const frameDuration = 1 / this.frameRate;
                
                if (this.frameTime >= frameDuration) {
                    this.frameTime = 0;
                    const frames = this.images.walk[this.currentDirection];
                    if (frames && frames.length > 0) {
                        this.currentFrame = (this.currentFrame + 1) % frames.length;
                    }
                }
            }
        }

        getCurrentImage() {
            if (!this.loaded) return null;

            if (this.currentState === 'idle') {
                return this.images.idle[this.currentDirection];
            } else if (this.currentState === 'walk') {
                const frames = this.images.walk[this.currentDirection];
                return frames && frames[this.currentFrame] ? frames[this.currentFrame] : null;
            }
            return null;
        }
    }

    const playerAnimation = new PlayerAnimation();

    // 道具系统
    class ItemSystem {
        constructor() {
            this.items = [];
            this.images = {};
            this.loaded = false;
            this.loadItemImages();
            // 立即添加道具到场景中
            this.addItem('bamboo', BAMBOO_POSITION_I, BAMBOO_POSITION_J);
            this.addItem('futou', FUTOU_POSITION_I, FUTOU_POSITION_J);
        }

        loadItemImages() {
            const itemImages = [
                { key: 'bamboo', src: '2_bamboo_on the road.png' },
                { key: 'futou', src: '2_futou_among the grass.png' }
            ];

            let loadedCount = 0;
            const totalImages = itemImages.length;

            itemImages.forEach(item => {
                this.loadImage(item.src, (img) => {
                    this.images[item.key] = img;
                    this.checkLoadComplete(++loadedCount, totalImages);
                });
            });
        }

        loadImage(src, callback) {
            const img = new Image();
            img.onload = () => {
                console.log('Loaded item image:', src);
                callback(img);
            };
            img.onerror = () => {
                console.warn('Failed to load item image:', src);
                callback(null);
            };
            img.src = src;
        }

        checkLoadComplete(loaded, total) {
            console.log(`道具图片加载进度: ${loaded}/${total}`);
            if (loaded >= total) {
                this.loaded = true;
                console.log('所有道具图片加载完成');
                // 图片加载完成后，确保道具已添加到场景中
                this.ensureItemsAdded();
            }
        }

        ensureItemsAdded() {
            // 如果道具还没有添加到场景中，现在添加
            if (this.items.length === 0) {
                this.addItem('bamboo', BAMBOO_POSITION_I, BAMBOO_POSITION_J);
                this.addItem('futou', FUTOU_POSITION_I, FUTOU_POSITION_J);
            }
        }

        addItem(type, i, j) {
            // 无论图片是否加载完成，都添加道具到列表中
            this.items.push({
                type: type,
                i: i,
                j: j
            });
            console.log(`添加道具 ${type} 在位置 (${i}, ${j})`);
        }

        draw(ctx, project) {
            this.items.forEach(item => {
                if (this.images[item.type]) {
                    const pos = project(item.i, item.j);
                    const img = this.images[item.type];
                    
                    const imgWidth = img.width;
                    const imgHeight = img.height;
                    
                    // 根据道具类型使用不同的尺寸配置
                    let size, scale;
                    if (item.type === 'bamboo') {
                        size = BAMBOO_SIZE;
                        scale = BAMBOO_SCALE;
                    } else if (item.type === 'futou') {
                        size = FUTOU_SIZE;
                        scale = FUTOU_SCALE;
                    } else {
                        size = ITEM_SIZE;
                        scale = ITEM_SCALE;
                    }
                    
                    const finalScale = (size * scale) / Math.max(imgWidth, imgHeight);
                    const scaledWidth = imgWidth * finalScale;
                    const scaledHeight = imgHeight * finalScale;
                    
                    // 保存当前状态
                    ctx.save();
                    
                    // 如果是竹子且正在褪色，应用透明度
                    if (item.type === 'bamboo' && interactionSystem.bambooFade.fading) {
                        ctx.globalAlpha = interactionSystem.bambooFade.alpha;
                    }
                    
                    // 绘制道具图片，以底部中心为锚点
                    ctx.drawImage(
                        img,
                        pos.x - scaledWidth / 2,
                        pos.y - scaledHeight,
                        scaledWidth,
                        scaledHeight
                    );
                    
                    // 恢复状态
                    ctx.restore();
                }
            });
        }
    }

    const itemSystem = new ItemSystem();

    // 交互系统
    class InteractionSystem {
        constructor() {
            this.buttons = [
                {
                    show: false,
                    x: 0,
                    y: 0,
                    isHovered: false,
                    interactionI: INTERACTION_POSITION_I,
                    interactionJ: INTERACTION_POSITION_J,
                    radius: INTERACTION_RADIUS,
                    buttonI: BUTTON_POSITION_I,
                    buttonJ: BUTTON_POSITION_J
                },
                {
                    show: false,
                    x: 0,
                    y: 0,
                    isHovered: false,
                    interactionI: INTERACTION2_POSITION_I,
                    interactionJ: INTERACTION2_POSITION_J,
                    radius: INTERACTION2_RADIUS,
                    buttonI: BUTTON2_POSITION_I,
                    buttonJ: BUTTON2_POSITION_J
                }
            ];
            this.animationTime = 0;
            this.chartImage = null;
            this.showChart = false;
            this.futouInfoImage = null;
            this.showFutouInfo = false;
            this.chartFutouImage = null;
            this.showChartFutou = false;
            this.drawIcon = null;
            this.drawIconLoaded = false;
            this.drawIconHovered = false;
            this.drawIconScale = 1.0;
            this.drawIconY = 0;
            this.backpackButton = null; // 背包按钮
            this.backpackButtonLoaded = false;
            this.backpackButtonHovered = false;
            this.backpackButtonScale = 1.0;
            this.backpackButtonY = 0;
            this.rulesButtonHovered = false;
            this.rulesButtonScale = 1.0;
            this.rulesButtonY = 0;
            this.rulesButtonHoverStartTime = 0;
            this.firstButtonCompleted = false; // 第一个按钮是否已完成交互
            this.canClearBamboo = false; // 是否可以清除竹子
            this.showClearBackpack = false; // 是否显示清除道具选择背包
            this.clearAnimation = {
                playing: false,
                images: [],
                loaded: false,
                currentFrame: 0,
                totalFrames: 5,
                frameDelay: 200,
                lastFrameTime: 0
            };
            this.bambooFade = {
                fading: false,
                alpha: 1.0,
                fadeSpeed: 0.02
            };
            this.xiangkeUI = {
                image: null,
                loaded: false,
                show: false,
                positionI: -4,
                positionJ: -4
            };
            this.bambooCleared = false; // 竹子是否已被清除
            this.clearChartImage = null;
            this.showClearChart = false;
            this.clearChartLoaded = false;
            this.clearButtonUsed = false; // 清除按钮是否已被使用
            this.cryingChartImage = null;
            this.showCryingChart = false;
            this.cryingChartLoaded = false;
            this.npcPaoImage = null;
            this.showNpcPao = false;
            this.npcPaoLoaded = false;
            this.npcInteractionArea = {
                centerI: 6,
                centerJ: -3,
                radius: 1,
                active: false
            };
            this.npcViewButton = {
                show: false,
                buttonI: 6,
                buttonJ: -3,
                radius: 1,
                text: '查看',
                x: 0,
                y: 0,
                isHovered: false,
                firstInteractionCompleted: false, // 标记第一次交互是否完成
                permanentlyHidden: false // 标记按钮是否被永久隐藏
            };
            this.menChartImage = null;
            this.showMenChart = false;
            this.menChartLoaded = false;
            this.menChartShown = false; // 标记门图表是否已经显示过
            this.selectedBackpackItem = null; // 选中的背包道具
            this.equippedItems = {}; // 已装备的道具
            this.paintPoints = {
                yellow: 0,
                green: 0,
                blue: 0,
                red: 0,
                brown: 0
            }; // 颜料点数系统
            this.paintPointsReward = {
                show: false,
                color: '',
                points: 0,
                image: null,
                loaded: false,
                fadeOut: {
                    active: false,
                    alpha: 1.0,
                    duration: 2000, // 2秒淡出
                    startTime: 0
                }
            }; // 颜料点数奖励提示
            
            // 新奖励提示系统
            this.rewardNotification = {
                show: false,
                kailingjiImage: null,
                greenDrawingImage: null,
                lingImage: null,
                kailingjiLoaded: false,
                greenDrawingLoaded: false,
                lingLoaded: false,
                fadeOut: {
                    active: false,
                    alpha: 1.0,
                    duration: 3000, // 3秒淡出
                    startTime: 0
                }
            }; // 新奖励提示系统
            
            // Keep Going图片系统
            this.keepGoingImage = {
                image: null,
                loaded: false,
                show: false
            }; // Keep Going图片系统
            
            // 规则提示系统
            this.rulesNotification = {
                show: false,
                images: [],
                currentImageIndex: 0,
                loaded: false,
                prevButtonHovered: false,
                nextButtonHovered: false,
                exitButtonHovered: false,
                fadeOut: {
                    active: false,
                    alpha: 1.0,
                    duration: 5000, // 5秒淡出
                    startTime: 0
                }
            }; // 规则提示系统
            
            // 颜料图标系统
            this.paintIcons = {
                images: [],
                loaded: false,
                points: [10, 10, 10, 10, 10], // 初始点数都为10
                iconSize: 50, // 与规则提示按钮相同尺寸
                spacing: 20 // 图标间隔
            };
            
            // 主角等级系统
            this.playerLevel = {
                level: 1, // 当前等级
                experience: 0, // 当前经验值
                experienceToNext: 100, // 升级所需经验值
                totalExperience: 0, // 总经验值
                levelUpNotification: {
                    show: false,
                    startTime: 0,
                    duration: 3000 // 3秒显示时间
                },
                delayedLevelUpNotification: false // 延迟显示升级通知
            };


            // 游戏结束系统
            this.gameEnding = {
                hasReceivedFinalReward: false, // 是否已获得最后奖励
                isTriggered: false, // 是否已触发结束序列
                isMovingLeft: false, // 是否正在向左移动
                fadeToBlack: {
                    active: false,
                    alpha: 0,
                    duration: 3000, // 3秒变暗
                    startTime: 0
                },
                triggerArea: {
                    centerI: -17,
                    centerJ: 0,
                    radius: 5
                },
                continuationImage: {
                    image: null,
                    loaded: false,
                    show: false,
                    fadeIn: {
                        active: false,
                        alpha: 0,
                        duration: 2000, // 2秒淡入
                        startTime: 0
                    }
                }
            };
            
            // 下雨特效系统
            this.rainEffect = {
                active: true, // 是否下雨
                raindrops: [],
                rainCount: 200, // 雨滴数量
                initialized: false
            };
            
            this.obstacleConfigs = {
                bamboo: {
                    type: 'wood',
                    paintPoints: 10,
                    color: 'green',
                    name: '竹子'
                }
                // 可以在这里添加更多障碍物配置
            }; // 障碍物配置系统
            this.yuChatSequence = {
                show: false,
                images: [],
                loaded: false,
                currentIndex: 0,
                totalImages: 13
            }; // 雨聊天图片序列系统
            this.axeAnimation = {
                playing: false,
                images: [],
                loaded: false,
                currentFrame: 0,
                lastFrameTime: 0,
                frameDelay: 200, // 每帧200毫秒
                positionI: 5,
                positionJ: -6,
                shouldStartSceneTransition: false
            }; // 斧头砍下动画系统
            this.shuxingxiangkeUI = {
                show: false,
                image: null,
                loaded: false,
                fadeOut: {
                    active: false,
                    alpha: 1.0,
                    duration: 1000, // 1秒淡出，与消除竹子时保持一致
                    startTime: 0
                }
            };
            this.sceneTransition = {
                active: false,
                isRewardTransition: false, // 标记是否为奖励场景转换
                fadeOut: {
                    active: false,
                    alpha: 1.0,
                    duration: 1000, // 1秒场景褪色
                    startTime: 0
                },
                fadeIn: {
                    active: false,
                    alpha: 0.0,
                    duration: 1000, // 1秒场景重新亮起
                    startTime: 0
                },
                newBackgroundImage: null,
                newBackgroundLoaded: false,
                backgroundSwitched: false // 标记背景是否已切换
            };
            this.huazhouImage = null;
            this.showHuazhou = false;
            this.huazhouExitButtonHovered = false; // 画轴退出按钮悬停状态
            this.drawingButtons = {
                yellow: { image: null, loaded: false, hovered: false, scale: 1.0, y: 0 },
                green: { image: null, loaded: false, hovered: false, scale: 1.0, y: 0 },
                blue: { image: null, loaded: false, hovered: false, scale: 1.0, y: 0 },
                red: { image: null, loaded: false, hovered: false, scale: 1.0, y: 0 },
                brown: { image: null, loaded: false, hovered: false, scale: 1.0, y: 0 }
            };
            this.plusButton = {
                hovered: false,
                rotation: 0,
                scale: 1.0
            };
            this.backpackImage = null;
            this.showBackpack = false;
            this.backpackLoaded = false;
            this.backpackExitButtonHovered = false; // 背包退出按钮悬停状态
            this.inventory = {
                // 笔绘对象（原始道具）
                futou: { 
                    collected: false, 
                    image: null, 
                    loaded: false, 
                    name: '斧头', 
                    paintPoints: 3,
                    type: 'drawing' // 笔绘对象类型
                }
            };
            
            // 绘制成功的道具
            this.drawnItems = {
                futou_new: {
                    collected: false,
                    image: null,
                    loaded: false,
                    name: '斧头',
                    type: 'item' // 道具类型
                }
            };
            this.selectedItem = null; // 画轴中选中的道具
            this.quantityInput = {
                value: 1,
                min: 1,
                max: 99,
                focused: false,
                plusButton: { hovered: false, clicked: false },
                minusButton: { hovered: false, clicked: false }
            };
            this.paintIcon = null; // 左侧颜料图标
            this.paintIconLoaded = false;
            this.selectedPaintColor = null; // 选中的颜料颜色
            this.brushButton = null; // 毛笔按钮
            this.brushButtonLoaded = false;
            this.brushButtonHovered = false;
            this.drawingAnimation = {
                images: [], // 动画图片数组
                loaded: false, // 是否加载完成
                playing: false, // 是否正在播放
                currentFrame: 0, // 当前帧
                totalFrames: 7, // 总帧数
                loopCount: 0, // 当前循环次数
                maxLoops: 2, // 最大循环次数
                frameDelay: 100, // 帧延迟（毫秒）
                lastFrameTime: 0 // 上一帧时间
            };
            this.drawingResult = {
                show: false, // 是否显示笔绘结果
                image: null, // 笔绘结果图片
                loaded: false, // 是否加载完成
                itemKey: null // 对应的道具键
            };
            this.itemBindings = {
                'futou': {
                    original: '2_futou_among the grass.png',
                    result: '2_futou_new.png',
                    requiredColor: 'yellow', // 所需颜料颜色
                    requiredPoints: 3 // 所需颜料点数
                }
            };
            this.errorMessage = {
                show: false, // 是否显示错误信息
                text: '', // 错误文本
                startTime: 0 // 开始显示时间
            };
            this.gridCols = 6; // 6列（去掉最左和最右各1列）
            this.gridRows = 3; // 3行（去掉最后1行）
            this.cellSize = 40; // 每个格子的大小
            this.activeTab = 'drawing'; // 当前激活的标签页 ('drawing' 或 'items')
            this.tabButtons = {
                drawing: { text: '笔绘对象', hovered: false, scale: 1.0 },
                items: { text: '道具', hovered: false, scale: 1.0 }
            };
            this.equipmentButton = { text: '装备', hovered: false, scale: 1.0 };
            this.loadImages();
        }

        loadImages() {
            // 加载竹子图表图片
            this.chartImage = new Image();
            this.chartImage.onload = () => {
                console.log('竹子图表图片加载完成');
            };
            this.chartImage.onerror = () => {
                console.warn('竹子图表图片加载失败');
            };
            this.chartImage.src = CHART_IMAGE_SRC;

            // 加载斧头信息图片
            this.futouInfoImage = new Image();
            this.futouInfoImage.onload = () => {
                console.log('斧头信息图片加载完成');
            };
            this.futouInfoImage.onerror = () => {
                console.warn('斧头信息图片加载失败');
            };
            this.futouInfoImage.src = FUTOU_INFO_IMAGE_SRC;

            // 加载斧头图表图片
            this.chartFutouImage = new Image();
            this.chartFutouImage.onload = () => {
                console.log('斧头图表图片加载完成');
            };
            this.chartFutouImage.onerror = () => {
                console.warn('斧头图表图片加载失败');
            };
            this.chartFutouImage.src = CHART_FUTOU_IMAGE_SRC;

            // 加载绘制图标
            this.drawIcon = new Image();
            this.drawIcon.onload = () => {
                console.log('绘制图标加载完成');
                this.drawIconLoaded = true;
            };
            this.drawIcon.onerror = () => {
                console.warn('绘制图标加载失败');
            };
            this.drawIcon.src = DRAW_ICON_SRC;

            // 加载画轴图片
            this.huazhouImage = new Image();
            this.huazhouImage.onload = () => {
                console.log('画轴图片加载完成');
            };
            this.huazhouImage.onerror = () => {
                console.warn('画轴图片加载失败');
            };
            this.huazhouImage.src = HUAZHOU_IMAGE_SRC;

            // 加载绘制按钮图片
            const drawingButtonSources = [
                { key: 'yellow', src: YELLOW_DRAWING_UI_SRC },
                { key: 'green', src: GREEN_DRAWING_UI_SRC },
                { key: 'blue', src: BLUE_DRAWING_UI_SRC },
                { key: 'red', src: RED_DRAWING_UI_SRC },
                { key: 'brown', src: BROWN_DRAWING_UI_SRC }
            ];

            drawingButtonSources.forEach(button => {
                this.drawingButtons[button.key].image = new Image();
                this.drawingButtons[button.key].image.onload = () => {
                    console.log(`${button.key}绘制按钮加载完成`);
                    this.drawingButtons[button.key].loaded = true;
                };
                this.drawingButtons[button.key].image.onerror = () => {
                    console.warn(`${button.key}绘制按钮加载失败`);
                };
                this.drawingButtons[button.key].image.src = button.src;
            });

            // 加载背包界面图片
            this.backpackImage = new Image();
            this.backpackImage.onload = () => {
                console.log('背包界面图片加载完成');
                this.backpackLoaded = true;
            };
            this.backpackImage.onerror = () => {
                console.warn('背包界面图片加载失败');
            };
            this.backpackImage.src = BACKPACK_IMAGE_SRC;

            // 加载物品图片
            this.inventory.futou.image = new Image();
            this.inventory.futou.image.onload = () => {
                console.log('斧头物品图片加载完成');
                this.inventory.futou.loaded = true;
            };
            this.inventory.futou.image.onerror = () => {
                console.warn('斧头物品图片加载失败');
            };
            this.inventory.futou.image.src = FUTOU_ITEM_SRC;

            // 加载绘制成功的道具图片
            this.drawnItems.futou_new.image = new Image();
            this.drawnItems.futou_new.image.onload = () => {
                console.log('绘制成功斧头图片加载完成');
                this.drawnItems.futou_new.loaded = true;
            };
            this.drawnItems.futou_new.image.onerror = () => {
                console.warn('绘制成功斧头图片加载失败');
            };
            this.drawnItems.futou_new.image.src = '2_futou_new.png';

            // 加载颜料待选图标
            this.paintIcon = new Image();
            this.paintIcon.onload = () => {
                this.paintIconLoaded = true;
                console.log('颜料待选图标加载完成');
            };
            this.paintIcon.onerror = () => {
                console.warn('颜料待选图标加载失败');
            };
            this.paintIcon.src = 'yanliao_daixuan_ui.png';

            // 加载毛笔按钮
            this.brushButton = new Image();
            this.brushButton.onload = () => {
                this.brushButtonLoaded = true;
                console.log('毛笔按钮加载完成');
            };
            this.brushButton.onerror = () => {
                console.warn('毛笔按钮加载失败');
            };
            this.brushButton.src = '2_maobi_ui.png';

            // 加载背包按钮
            this.backpackButton = new Image();
            this.backpackButton.onload = () => {
                this.backpackButtonLoaded = true;
                console.log('背包按钮加载完成');
            };
            this.backpackButton.onerror = () => {
                console.warn('背包按钮加载失败');
            };
            this.backpackButton.src = 'muxia.png';

            // 加载绘制动画图片
            this.loadDrawingAnimationImages();
            this.loadClearAnimationImages();
            
            // 加载属性相克UI图片
            this.xiangkeUI.image = new Image();
            this.xiangkeUI.image.onload = () => {
                this.xiangkeUI.loaded = true;
                console.log('属性相克UI图片加载完成');
            };
            this.xiangkeUI.image.onerror = () => {
                console.warn('属性相克UI图片加载失败');
            };
            this.xiangkeUI.image.src = '2_shuxingxiangke_ui.png';

            // 加载清除图表图片
            this.clearChartImage = new Image();
            this.clearChartImage.onload = () => {
                this.clearChartLoaded = true;
                console.log('清除图表图片加载完成');
            };
            this.clearChartImage.onerror = () => {
                console.warn('清除图表图片加载失败');
            };
            this.clearChartImage.src = '2_chart_qingchu_01.png';

            // 加载哭泣图表图片
            this.cryingChartImage = new Image();
            this.cryingChartImage.onload = () => {
                this.cryingChartLoaded = true;
                console.log('哭泣图表图片加载完成');
            };
            this.cryingChartImage.onerror = () => {
                console.warn('哭泣图表图片加载失败');
            };
            this.cryingChartImage.src = '2_chart_crying_01.png';

            // 加载NPC跑动UI图片
            this.npcPaoImage = new Image();
            this.npcPaoImage.onload = () => {
                this.npcPaoLoaded = true;
                console.log('NPC跑动UI图片加载完成');
            };
            this.npcPaoImage.onerror = () => {
                console.warn('NPC跑动UI图片加载失败');
            };
            this.npcPaoImage.src = '2_npc_pao_ui.png';

            // 加载门图表图片
            this.menChartImage = new Image();
            this.menChartImage.onload = () => {
                this.menChartLoaded = true;
                console.log('门图表图片加载完成');
            };
            this.menChartImage.onerror = () => {
                console.warn('门图表图片加载失败');
            };
            this.menChartImage.src = '2_chart_men_02.png';

            // 加载未完待续图片
            this.gameEnding.continuationImage.image = new Image();
            this.gameEnding.continuationImage.image.onload = () => {
                this.gameEnding.continuationImage.loaded = true;
                console.log('未完待续图片加载完成');
            };
            this.gameEnding.continuationImage.image.onerror = () => {
                console.warn('未完待续图片加载失败');
            };
            this.gameEnding.continuationImage.image.src = '2_未完待续.png';

            // 加载属性相克UI图片
            this.shuxingxiangkeUI.image = new Image();
            this.shuxingxiangkeUI.image.onload = () => {
                this.shuxingxiangkeUI.loaded = true;
                console.log('属性相克UI图片加载完成');
            };
            this.shuxingxiangkeUI.image.onerror = () => {
                console.warn('属性相克UI图片加载失败');
            };
            this.shuxingxiangkeUI.image.src = '2_shuxingxiangke_ui.png';

            // 加载新场景背景图片
            this.sceneTransition.newBackgroundImage = new Image();
            this.sceneTransition.newBackgroundImage.onload = () => {
                this.sceneTransition.newBackgroundLoaded = true;
                console.log('新场景背景图片加载完成');
            };
            this.sceneTransition.newBackgroundImage.onerror = () => {
                console.warn('新场景背景图片加载失败');
            };
            this.sceneTransition.newBackgroundImage.src = '2_without men_village.png';

            // 加载颜料点数奖励图片
            this.paintPointsReward.image = new Image();
            this.paintPointsReward.image.onload = () => {
                this.paintPointsReward.loaded = true;
                console.log('颜料点数奖励图片加载完成');
            };
            this.paintPointsReward.image.onerror = () => {
                console.warn('颜料点数奖励图片加载失败');
            };
            this.paintPointsReward.image.src = '2_green_drawing_ui.png';

            // 加载新奖励提示图片
            this.rewardNotification.kailingjiImage = new Image();
            this.rewardNotification.kailingjiImage.onload = () => {
                this.rewardNotification.kailingjiLoaded = true;
                console.log('开灵机UI图片加载完成');
            };
            this.rewardNotification.kailingjiImage.onerror = () => {
                console.warn('开灵机UI图片加载失败');
            };
            this.rewardNotification.kailingjiImage.src = '2_kailingji_ui.png';

            this.rewardNotification.greenDrawingImage = new Image();
            this.rewardNotification.greenDrawingImage.onload = () => {
                this.rewardNotification.greenDrawingLoaded = true;
                console.log('绿色绘制UI图片加载完成');
            };
            this.rewardNotification.greenDrawingImage.onerror = () => {
                console.warn('绿色绘制UI图片加载失败');
            };
            this.rewardNotification.greenDrawingImage.src = '2_green_drawing_ui.png';

            this.rewardNotification.lingImage = new Image();
            this.rewardNotification.lingImage.onload = () => {
                this.rewardNotification.lingLoaded = true;
                console.log('灵UI图片加载完成');
            };
            this.rewardNotification.lingImage.onerror = () => {
                console.warn('灵UI图片加载失败');
            };
            this.rewardNotification.lingImage.src = '2_ling_ui.png';

            // 加载Keep Going图片
            this.keepGoingImage.image = new Image();
            this.keepGoingImage.image.onload = () => {
                this.keepGoingImage.loaded = true;
                console.log('Keep Going图片加载完成，图片尺寸:', this.keepGoingImage.image.width, 'x', this.keepGoingImage.image.height);
            };
            this.keepGoingImage.image.onerror = () => {
                console.warn('Keep Going图片加载失败，文件路径: 2_chat_keep going.png');
            };
            this.keepGoingImage.image.src = '2_chat_keep going.png';


            // 加载规则提示图片
            const rulesImagePaths = ['0_wanfaguize_01.png', '0_wanfaguize_02.png'];
            let rulesLoadedCount = 0;
            const totalRulesImages = rulesImagePaths.length;

            rulesImagePaths.forEach((path, index) => {
                const img = new Image();
                img.onload = () => {
                    rulesLoadedCount++;
                    if (rulesLoadedCount === totalRulesImages) {
                        this.rulesNotification.loaded = true;
                        console.log('所有规则提示图片加载完成');
                    }
                };
                img.onerror = () => {
                    console.warn(`规则提示图片加载失败: ${path}`);
                    rulesLoadedCount++;
                    if (rulesLoadedCount === totalRulesImages) {
                        this.rulesNotification.loaded = true;
                    }
                };
                img.src = path;
            this.rulesNotification.images[index] = img;
        });

        // 加载颜料图标图片
        const paintImageNames = [
            '2_yellow_drawing_ui.png',
            '2_green_drawing_ui.png', 
            '2_blue_drawing_ui.png',
            '2_red_drawing_ui.png',
            '2_brown_drawing_ui.png'
        ];

        let paintLoadedCount = 0;
        const totalPaintImages = paintImageNames.length;

        paintImageNames.forEach((imageName, index) => {
            const img = new Image();
            img.onload = () => {
                paintLoadedCount++;
                if (paintLoadedCount === totalPaintImages) {
                    this.paintIcons.loaded = true;
                    console.log('所有颜料图标图片加载完成');
                }
            };
            img.onerror = () => {
                console.warn(`颜料图标图片加载失败: ${imageName}`);
                paintLoadedCount++;
                if (paintLoadedCount === totalPaintImages) {
                    this.paintIcons.loaded = true;
                }
            };
            img.src = imageName;
            this.paintIcons.images[index] = img;
        });

        // 加载斧头砍下动画图片
            this.loadAxeAnimationImages();

            // 加载雨聊天图片序列
            this.loadYuChatImages();
        }

        loadAxeAnimationImages() {
            const axeImagePaths = [
                '斧头砍下/01.png',
                '斧头砍下/02.png',
                '斧头砍下/03.png',
                '斧头砍下/04.png',
                '斧头砍下/05.png'
            ];

            let axeLoadedCount = 0;
            const totalAxeImages = axeImagePaths.length;

            axeImagePaths.forEach((path, index) => {
                const img = new Image();
                img.onload = () => {
                    axeLoadedCount++;
                    if (axeLoadedCount === totalAxeImages) {
                        this.axeAnimation.loaded = true;
                        console.log('所有斧头砍下动画图片加载完成');
                    }
                };
                img.onerror = () => {
                    console.warn(`斧头砍下动画图片加载失败: ${path}`);
                    axeLoadedCount++;
                    if (axeLoadedCount === totalAxeImages) {
                        this.axeAnimation.loaded = true;
                    }
                };
                img.src = path;
                this.axeAnimation.images[index] = img;
            });
        }

        loadYuChatImages() {
            const yuImagePaths = [
                '2_chat_yu_01.png',
                '2_chat_yu_02.png',
                '2_chat_yu_03.png',
                '2_chat_yu_04.png',
                '2_chat_yu_05.png',
                '2_chat_yu_06.png',
                '2_chat_yu_07.png',
                '2_chat_yu_08.png',
                '2_chat_yu_09.png',
                '2_chat_yu_10.png',
                '2_chat_yu_11.png',
                '2_chat_yu_12.png',
                '2_chat_yu_13.png'
            ];

            let yuLoadedCount = 0;
            const totalYuImages = yuImagePaths.length;

            yuImagePaths.forEach((path, index) => {
                const img = new Image();
                img.onload = () => {
                    yuLoadedCount++;
                    if (yuLoadedCount === totalYuImages) {
                        this.yuChatSequence.loaded = true;
                        console.log('所有雨聊天图片加载完成');
                    }
                };
                img.onerror = () => {
                    console.warn(`雨聊天图片加载失败: ${path}`);
                    yuLoadedCount++;
                    if (yuLoadedCount === totalYuImages) {
                        this.yuChatSequence.loaded = true;
                    }
                };
                img.src = path;
                this.yuChatSequence.images[index] = img;
            });
        }

        loadDrawingAnimationImages() {
            const imagePaths = [
                '新建文件夹/2_drawing_moving_01.png',
                '新建文件夹/2_drawing_moving_02.png',
                '新建文件夹/2_drawing_moving_03.png',
                '新建文件夹/2_drawing_moving_04.png',
                '新建文件夹/2_drawing_moving_05.png',
                '新建文件夹/2_drawing_moving_06.png',
                '新建文件夹/2_drawing_moving_07.png'
            ];

            let loadedCount = 0;
            this.drawingAnimation.images = new Array(imagePaths.length);

            imagePaths.forEach((path, index) => {
                const img = new Image();
                img.onload = () => {
                    this.drawingAnimation.images[index] = img;
                    loadedCount++;
                    if (loadedCount === imagePaths.length) {
                        this.drawingAnimation.loaded = true;
                        console.log('绘制动画图片加载完成');
                    }
                };
                img.onerror = () => {
                    console.warn(`绘制动画图片加载失败: ${path}`);
                    loadedCount++;
                    if (loadedCount === imagePaths.length) {
                        this.drawingAnimation.loaded = true;
                    }
                };
                img.src = path;
            });
        }

        loadClearAnimationImages() {
            const clearImagePaths = [
                '斧头砍下/01.png',
                '斧头砍下/02.png',
                '斧头砍下/03.png',
                '斧头砍下/04.png',
                '斧头砍下/05.png'
            ];

            let clearLoadedCount = 0;
            this.clearAnimation.images = new Array(clearImagePaths.length);

            clearImagePaths.forEach((path, index) => {
                const img = new Image();
                img.onload = () => {
                    this.clearAnimation.images[index] = img;
                    clearLoadedCount++;
                    if (clearLoadedCount === clearImagePaths.length) {
                        this.clearAnimation.loaded = true;
                        console.log('所有斧头砍下动画图片加载完成');
                    }
                };
                img.onerror = () => {
                    console.warn(`斧头砍下动画图片加载失败: ${path}`);
                    clearLoadedCount++;
                    if (clearLoadedCount === clearImagePaths.length) {
                        this.clearAnimation.loaded = true;
                    }
                };
                img.src = path;
            });
        }

        startDrawingAnimation() {
            if (!this.drawingAnimation.loaded) {
                console.warn('绘制动画图片未加载完成');
                return;
            }

            this.drawingAnimation.playing = true;
            this.drawingAnimation.currentFrame = 0;
            this.drawingAnimation.loopCount = 0;
            this.drawingAnimation.lastFrameTime = Date.now();
            console.log('开始播放绘制动画');
        }

        updateDrawingAnimation() {
            if (!this.drawingAnimation.playing || !this.drawingAnimation.loaded) {
                return;
            }

            const currentTime = Date.now();
            if (currentTime - this.drawingAnimation.lastFrameTime >= this.drawingAnimation.frameDelay) {
                this.drawingAnimation.currentFrame++;
                
                // 检查是否完成一帧循环
                if (this.drawingAnimation.currentFrame >= this.drawingAnimation.totalFrames) {
                    this.drawingAnimation.currentFrame = 0;
                    this.drawingAnimation.loopCount++;
                    
                    // 检查是否完成所有循环
                    if (this.drawingAnimation.loopCount >= this.drawingAnimation.maxLoops) {
                        this.drawingAnimation.playing = false;
                        console.log('绘制动画播放完成');
                        // 动画完成后进行笔绘判定
                        this.checkDrawingValidation();
                        return;
                    }
                }
                
                this.drawingAnimation.lastFrameTime = currentTime;
            }
        }

        updateClearAnimation() {
            if (!this.clearAnimation.playing || !this.clearAnimation.loaded) {
                return;
            }

            const currentTime = Date.now();
            if (currentTime - this.clearAnimation.lastFrameTime >= this.clearAnimation.frameDelay) {
                this.clearAnimation.currentFrame++;
                this.clearAnimation.lastFrameTime = currentTime;

                console.log(`斧头砍下动画播放第${this.clearAnimation.currentFrame}帧`);

                // 检查是否完成动画
                if (this.clearAnimation.currentFrame >= this.clearAnimation.totalFrames) {
                    this.clearAnimation.playing = false;
                    this.clearAnimation.currentFrame = 0;
                    console.log('斧头砍下动画播放完成');
                    
                    // 动画完成后开始竹子褪色
                    this.bambooFade.fading = true;
                }
            }
        }

        updateBambooFade() {
            if (!this.bambooFade.fading) return;

            // 逐渐减少透明度
            this.bambooFade.alpha -= this.bambooFade.fadeSpeed;
            
            // 当透明度降到0时停止褪色
            if (this.bambooFade.alpha <= 0) {
                this.bambooFade.alpha = 0;
                this.bambooFade.fading = false;
                
                // 确保第一个按钮保持隐藏状态
                this.buttons[0].show = false;
                
                // 设置竹子已清除状态
                this.bambooCleared = true;
                
                // 隐藏属性相克UI
                this.xiangkeUI.show = false;
                
                // 从场景中移除竹子
                this.removeBambooFromScene();
                
                // 获得竹子消除的颜料点数奖励
                this.addPaintPoints('bamboo');
                
                // 移除场景中的所有障碍
                obstacleSystem.removeAllObstacles();
                
                // 不再自动显示哭泣图表和NPC跑动UI，等待用户点击奖励提示界面
                console.log('竹子消除完成，等待用户点击奖励提示界面');
                
                console.log('竹子褪色完成，第一个按钮已隐藏，竹子已清除，属性相克UI已隐藏，竹子已从场景中移除，障碍已移除，显示哭泣图表，显示NPC跑动UI');
            }
        }

        removeBambooFromScene() {
            // 从itemSystem中移除竹子道具
            if (itemSystem) {
                itemSystem.items = itemSystem.items.filter(item => item.type !== 'bamboo');
                console.log('竹子已从道具系统中移除');
            }
        }

        removeFutouFromScene() {
            // 从itemSystem中移除斧头道具
            if (itemSystem) {
                itemSystem.items = itemSystem.items.filter(item => item.type !== 'futou');
                console.log('斧头已从道具系统中移除');
            }
        }

        showShuxingxiangkeUI() {
            // 显示属性相克UI
            this.shuxingxiangkeUI.show = true;
            this.shuxingxiangkeUI.fadeOut.active = false;
            this.shuxingxiangkeUI.fadeOut.alpha = 1.0;
            console.log('显示属性相克UI');
            
            // 0.5秒后开始淡出，与消除竹子时保持一致
            setTimeout(() => {
                this.startShuxingxiangkeFadeOut();
            }, 500);
        }

        startSceneTransition() {
            // 开始场景转换
            this.sceneTransition.active = true;
            this.sceneTransition.fadeOut.active = true;
            this.sceneTransition.fadeOut.startTime = Date.now();
            console.log('开始场景转换');
        }

        startSceneFadeIn() {
            // 开始场景重新亮起
            this.sceneTransition.fadeOut.active = false;
            this.sceneTransition.fadeIn.active = true;
            this.sceneTransition.fadeIn.startTime = Date.now();
            console.log('开始场景重新亮起');
        }

        startShuxingxiangkeFadeOut() {
            // 开始淡出动画
            this.shuxingxiangkeUI.fadeOut.active = true;
            this.shuxingxiangkeUI.fadeOut.startTime = Date.now();
            console.log('开始属性相克UI淡出动画');
        }

        addPaintPoints(obstacleType) {
            // 根据障碍物类型获得颜料点数
            const config = this.obstacleConfigs[obstacleType];
            if (config) {
                this.paintPoints[config.color] += config.paintPoints;
                console.log(`获得${config.color}颜料点数: ${config.paintPoints}，总计: ${this.paintPoints[config.color]}`);
                
                // 同时更新颜料图标的点数
                this.addPaintIconsPoints(config.color, config.paintPoints);
                
                // 显示颜料点数奖励提示
                this.showPaintPointsReward(config.color, config.paintPoints);
            }
        }

        showPaintPointsReward(color, points) {
            // 显示颜料点数奖励提示
            this.paintPointsReward.show = true;
            this.paintPointsReward.color = color;
            this.paintPointsReward.points = points;
            this.paintPointsReward.fadeOut.active = false;
            this.paintPointsReward.fadeOut.alpha = 1.0;
            console.log(`显示颜料点数奖励: ${color}颜料 ${points}点`);
            
            // 2秒后开始淡出
            setTimeout(() => {
                this.startPaintPointsRewardFadeOut();
            }, 2000);
        }

        startPaintPointsRewardFadeOut() {
            // 开始颜料点数奖励淡出动画
            this.paintPointsReward.fadeOut.active = true;
            this.paintPointsReward.fadeOut.startTime = Date.now();
            console.log('开始颜料点数奖励淡出动画');
        }

        startRewardSceneTransition() {
            // 开始场景转换并显示奖励提示
            console.log('开始奖励场景转换');
            
            // 设置新背景图片
            this.sceneTransition.newBackgroundImage.src = '2_without men_last_village.png';
            
            // 标记为奖励场景转换
            this.sceneTransition.isRewardTransition = true;
            
            // 开始场景转换淡出效果
            this.sceneTransition.active = true;
            this.sceneTransition.fadeOut.active = true;
            this.sceneTransition.fadeOut.startTime = Date.now();
        }

        showRewardNotification() {
            // 显示新奖励提示
            if (this.rewardNotification.kailingjiLoaded && this.rewardNotification.greenDrawingLoaded && this.rewardNotification.lingLoaded) {
                this.rewardNotification.show = true;
                this.rewardNotification.fadeOut.active = false;
                this.rewardNotification.fadeOut.alpha = 1.0;
                console.log('显示新奖励提示');
                
                // 添加奖励的颜料点数
                this.addPaintIconsPoints('green', 5); // 绿色颜料5点
                // 注意：灵是主角名字，不是颜料，不需要增加颜料点数
                
                // 通关获得经验值（不立即显示升级通知）
                console.log('获得最后奖励，添加150经验值');
                this.addExperience(150, false); // 通关奖励150经验值
                console.log('延迟升级通知状态:', this.playerLevel.delayedLevelUpNotification);
                
                // 停止下雨效果
                this.stopRainEffect();
                
                // 标记已获得最后奖励
                this.gameEnding.hasReceivedFinalReward = true;
                console.log('已获得最后奖励，可以触发游戏结束序列');
                
                // 3秒后开始淡出
                setTimeout(() => {
                    this.startRewardNotificationFadeOut();
                }, 3000);
            } else {
                console.warn('奖励提示图片未加载完成，无法显示');
            }
        }

        startRewardNotificationFadeOut() {
            // 开始奖励提示淡出动画
            this.rewardNotification.fadeOut.active = true;
            this.rewardNotification.fadeOut.startTime = Date.now();
            console.log('开始奖励提示淡出动画');
        }

        showRulesNotification() {
            // 显示规则提示
            if (this.rulesNotification.loaded && this.rulesNotification.images.length > 0) {
                this.rulesNotification.show = true;
                this.rulesNotification.currentImageIndex = 0; // 重置到第一张图片
                this.rulesNotification.fadeOut.active = false;
                this.rulesNotification.fadeOut.alpha = 1.0;
                console.log('显示规则提示');
            } else {
                console.warn('规则提示图片未加载完成，无法显示');
            }
        }

        startRulesNotificationFadeOut() {
            // 开始规则提示淡出动画
            this.rulesNotification.fadeOut.active = true;
            this.rulesNotification.fadeOut.startTime = Date.now();
            console.log('开始规则提示淡出动画');
        }

        startYuChatSequence() {
            // 开始雨聊天图片序列
            if (this.yuChatSequence.loaded) {
                this.yuChatSequence.show = true;
                this.yuChatSequence.currentIndex = 0;
                console.log('开始雨聊天图片序列，显示第1张图片');
            } else {
                console.warn('雨聊天图片未加载完成，无法显示');
            }
        }

        nextYuChatImage() {
            // 切换到下一张雨聊天图片
            if (this.yuChatSequence.show && this.yuChatSequence.loaded) {
                this.yuChatSequence.currentIndex++;
                if (this.yuChatSequence.currentIndex >= this.yuChatSequence.totalImages) {
                    // 序列结束，隐藏
                    this.yuChatSequence.show = false;
                    this.yuChatSequence.currentIndex = 0;
                    console.log('雨聊天图片序列结束');
                    
                    // 立即切换到新场景并显示奖励提示
                    this.startRewardSceneTransition();
                } else {
                    console.log(`切换到雨聊天图片第${this.yuChatSequence.currentIndex + 1}张`);
                }
            }
        }

        startAxeAnimation() {
            // 开始斧头砍下动画
            if (this.axeAnimation.loaded) {
                this.axeAnimation.playing = true;
                this.axeAnimation.currentFrame = 0;
                this.axeAnimation.lastFrameTime = Date.now();
                console.log('开始斧头砍下动画');
            } else {
                console.warn('斧头砍下动画图片未加载完成，无法播放动画');
            }
        }

        updateAxeAnimation() {
            if (!this.axeAnimation.playing || !this.axeAnimation.loaded) return;

            const currentTime = Date.now();
            if (currentTime - this.axeAnimation.lastFrameTime >= this.axeAnimation.frameDelay) {
                this.axeAnimation.currentFrame++;
                this.axeAnimation.lastFrameTime = currentTime;

                console.log(`斧头砍下动画播放第${this.axeAnimation.currentFrame}帧`);

                // 检查是否完成动画
                if (this.axeAnimation.currentFrame >= this.axeAnimation.images.length) {
                    this.axeAnimation.playing = false;
                    this.axeAnimation.currentFrame = 0;
                    this.axeAnimation.shouldStartSceneTransition = true;
                    console.log('斧头砍下动画播放完成，等待属性相克UI淡出后开始场景转换');
                }
            }
        }

        checkDrawingValidation() {
            if (!this.selectedItem) {
                this.showErrorMessage('请先选择笔绘对象');
                return;
            }

            const itemKey = this.selectedItem.key;
            const binding = this.itemBindings[itemKey];
            
            if (!binding) {
                this.showErrorMessage('未知的道具类型');
                return;
            }

            // 检查颜料颜色是否正确
            if (this.selectedPaintColor !== binding.requiredColor) {
                this.showErrorMessage('属性错误/颜料数量不足，无法绘制');
                return;
            }

            // 检查颜料点数是否正确
            console.log('检查颜料点数:', this.quantityInput.value, '要求:', binding.requiredPoints);
            if (this.quantityInput.value != binding.requiredPoints) {
                this.showErrorMessage('属性错误/颜料数量不足，无法绘制');
                return;
            }

            // 笔绘成功，显示结果
            this.showDrawingResult(itemKey);
        }

        showErrorMessage(text) {
            this.errorMessage.show = true;
            this.errorMessage.text = text;
            this.errorMessage.startTime = Date.now();
            console.log('错误提示:', text);
        }

        showDrawingResult(itemKey) {
            const binding = this.itemBindings[itemKey];
            if (!binding) return;

            // 消耗颜料点数
            this.consumePaintPoints(binding.requiredColor, binding.requiredPoints);

            // 立即将绘制成功的道具添加到背包并设置状态
            this.addDrawnItemToBackpack(itemKey, binding);

            // 加载笔绘结果图片
            this.drawingResult.image = new Image();
            this.drawingResult.image.onload = () => {
                this.drawingResult.loaded = true;
                this.drawingResult.show = true;
                this.drawingResult.itemKey = itemKey;
                console.log('笔绘结果图片加载完成');
            };
            this.drawingResult.image.onerror = () => {
                console.warn('笔绘结果图片加载失败');
            };
            this.drawingResult.image.src = binding.result;
        }

        consumePaintPoints(color, points) {
            // 消耗颜料点数
            if (this.paintIcons.points && this.paintIcons.points.length > 0) {
                const colorIndex = this.getColorIndex(color);
                if (colorIndex !== -1) {
                    this.paintIcons.points[colorIndex] = Math.max(0, this.paintIcons.points[colorIndex] - points);
                    console.log(`消耗${color}颜料${points}点，剩余: ${this.paintIcons.points[colorIndex]}`);
                }
            }
        }

        getColorIndex(color) {
            // 根据颜色名称返回对应的索引
            const colorMap = {
                'yellow': 0,
                'green': 1,
                'blue': 2,
                'red': 3,
                'brown': 4
            };
            return colorMap[color] !== undefined ? colorMap[color] : -1;
        }

        addPaintIconsPoints(color, points) {
            // 增加颜料图标的点数
            if (this.paintIcons.points && this.paintIcons.points.length > 0) {
                const colorIndex = this.getColorIndex(color);
                if (colorIndex !== -1) {
                    this.paintIcons.points[colorIndex] += points;
                    console.log(`颜料图标增加${color}颜料${points}点，总计: ${this.paintIcons.points[colorIndex]}`);
                }
            }
        }

        addExperience(amount, showNotification = true) {
            // 增加经验值
            this.playerLevel.experience += amount;
            this.playerLevel.totalExperience += amount;
            console.log(`获得经验值: ${amount}，当前经验: ${this.playerLevel.experience}/${this.playerLevel.experienceToNext}`);
            
            // 检查是否升级
            this.checkLevelUp(showNotification);
        }

        checkLevelUp(showNotification = true) {
            // 检查是否达到升级条件
            while (this.playerLevel.experience >= this.playerLevel.experienceToNext) {
                this.levelUp(showNotification);
            }
        }

        levelUp(showNotification = true) {
            // 升级
            this.playerLevel.experience -= this.playerLevel.experienceToNext;
            this.playerLevel.level++;
            
            // 计算下一级所需经验值（递增式）
            this.playerLevel.experienceToNext = Math.floor(100 * Math.pow(1.5, this.playerLevel.level - 1));
            
            console.log(`升级到等级 ${this.playerLevel.level}！下一级需要经验: ${this.playerLevel.experienceToNext}`);
            console.log('升级时showNotification参数:', showNotification);
            
            // 显示升级通知（可选）
            if (showNotification) {
                console.log('立即显示升级通知');
                this.showLevelUpNotification();
            } else {
                // 延迟显示升级通知
                console.log('设置延迟升级通知');
                this.playerLevel.delayedLevelUpNotification = true;
            }
        }

        showLevelUpNotification() {
            // 显示升级通知
            this.playerLevel.levelUpNotification.show = true;
            this.playerLevel.levelUpNotification.startTime = Date.now();
            console.log(`显示升级通知: 等级 ${this.playerLevel.level}`);
        }

        initRainEffect() {
            // 初始化雨滴效果
            if (this.rainEffect.initialized) return;
            
            // 确保WIDTH和HEIGHT已经定义
            if (typeof WIDTH === 'undefined' || typeof HEIGHT === 'undefined') {
                console.warn('WIDTH或HEIGHT未定义，延迟初始化雨滴效果');
                return;
            }
            
            this.rainEffect.raindrops = [];
            for (let i = 0; i < this.rainEffect.rainCount; i++) {
                this.rainEffect.raindrops.push(new Raindrop(WIDTH, HEIGHT));
            }
            this.rainEffect.initialized = true;
            console.log('雨滴效果初始化完成');
        }

        updateRainEffect() {
            // 更新雨滴效果
            if (!this.rainEffect.active || !this.rainEffect.initialized) return;
            
            for (let drop of this.rainEffect.raindrops) {
                drop.update();
            }
        }

        drawRainEffect(ctx) {
            // 绘制雨滴效果
            if (!this.rainEffect.active || !this.rainEffect.initialized) return;
            
            ctx.save();
            for (let drop of this.rainEffect.raindrops) {
                drop.draw(ctx);
            }
            ctx.restore();
        }

        stopRainEffect() {
            // 停止下雨效果
            this.rainEffect.active = false;
            console.log('停止下雨效果');
        }

        // 检查是否应该触发游戏结束序列
        checkGameEnding(playerI, playerJ) {
            // 只有在获得最后奖励且未触发过结束序列时才检查
            if (!this.gameEnding.hasReceivedFinalReward || this.gameEnding.isTriggered) {
                return;
            }

            // 检查角色是否在触发区域内
            const dx = playerI - this.gameEnding.triggerArea.centerI;
            const dy = playerJ - this.gameEnding.triggerArea.centerJ;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance <= this.gameEnding.triggerArea.radius) {
                this.triggerGameEnding();
            }
        }

        // 触发游戏结束序列
        triggerGameEnding() {
            this.gameEnding.isTriggered = true;
            this.gameEnding.isMovingLeft = true;
            console.log('触发游戏结束序列：角色开始向左移动');
        }

        // 开始画面变暗效果
        startFadeToBlack() {
            this.gameEnding.fadeToBlack.active = true;
            this.gameEnding.fadeToBlack.startTime = Date.now();
            console.log('开始画面变暗效果');
        }

        // 绘制游戏结束变暗效果
        drawGameEndingFade(ctx) {
            if (!this.gameEnding.fadeToBlack.active) return;

            const currentTime = Date.now();
            const elapsed = currentTime - this.gameEnding.fadeToBlack.startTime;
            const progress = Math.min(elapsed / this.gameEnding.fadeToBlack.duration, 1);

            // 计算透明度（从0到1）
            this.gameEnding.fadeToBlack.alpha = progress;

            // 绘制黑色遮罩 - 强制覆盖所有内容
            ctx.save();
            ctx.globalCompositeOperation = 'source-over';
            ctx.globalAlpha = 1.0; // 强制不透明
            ctx.fillStyle = `rgba(0, 0, 0, ${this.gameEnding.fadeToBlack.alpha})`;
            ctx.fillRect(0, 0, WIDTH, HEIGHT);
            ctx.restore();

            // 如果变暗完成，可以在这里添加其他逻辑
            if (progress >= 1) {
                console.log('画面变暗完成');
                // 开始显示未完待续图片
                this.startContinuationImageFadeIn();
            }
        }

        // 开始未完待续图片的淡入效果
        startContinuationImageFadeIn() {
            if (this.gameEnding.continuationImage.loaded && !this.gameEnding.continuationImage.fadeIn.active) {
                this.gameEnding.continuationImage.show = true;
                this.gameEnding.continuationImage.fadeIn.active = true;
                this.gameEnding.continuationImage.fadeIn.startTime = Date.now();
                console.log('开始未完待续图片淡入效果');
            }
        }

        // 绘制未完待续图片
        drawContinuationImage(ctx) {
            if (!this.gameEnding.continuationImage.show || 
                !this.gameEnding.continuationImage.loaded || 
                !this.gameEnding.continuationImage.image) {
                return;
            }

            // 如果淡入效果正在进行，计算透明度
            if (this.gameEnding.continuationImage.fadeIn.active) {
                const currentTime = Date.now();
                const elapsed = currentTime - this.gameEnding.continuationImage.fadeIn.startTime;
                const progress = Math.min(elapsed / this.gameEnding.continuationImage.fadeIn.duration, 1);
                this.gameEnding.continuationImage.fadeIn.alpha = progress;
            }

            // 保存当前状态
            ctx.save();

            // 计算图片位置（图片中心与(0,0)对齐）
            const origin = project(0, 0);
            const img = this.gameEnding.continuationImage.image;
            const imgWidth = img.width;
            const imgHeight = img.height;

            // 设置透明度
            ctx.globalAlpha = this.gameEnding.continuationImage.fadeIn.alpha;

            // 绘制图片，以(0,0)为中心，向上移动50像素
            ctx.drawImage(
                img,
                origin.x - imgWidth / 2,
                origin.y - imgHeight / 2 - 50,
                imgWidth,
                imgHeight
            );

            // 恢复状态
            ctx.restore();
        }

        addDrawnItemToBackpack(itemKey, binding) {
            // 根据itemKey确定对应的绘制成功道具
            if (itemKey === 'futou') {
                this.drawnItems.futou_new.collected = true;
                this.canClearBamboo = true; // 绘制成功后可以清除竹子
                console.log('绘制成功的斧头已添加到道具标签页，可以清除竹子，canClearBamboo设置为:', this.canClearBamboo);
            }
            // 可以在这里添加更多道具的映射
        }

        checkDrawingRequirements() {
            if (!this.selectedItem) {
                this.showErrorMessage('请先选择笔绘对象');
                return false;
            }

            const itemKey = this.selectedItem.key;
            const binding = this.itemBindings[itemKey];
            
            if (!binding) {
                this.showErrorMessage('未知的道具类型');
                return false;
            }

            // 检查颜料颜色是否正确
            if (this.selectedPaintColor !== binding.requiredColor) {
                this.showErrorMessage('属性错误/颜料数量不足，无法绘制');
                return false;
            }

            // 检查颜料点数是否正确
            console.log('检查颜料点数:', this.quantityInput.value, '要求:', binding.requiredPoints);
            if (this.quantityInput.value != binding.requiredPoints) {
                this.showErrorMessage('属性错误/颜料数量不足，无法绘制');
                return false;
            }

            return true;
        }

        checkInteraction(playerI, playerJ) {
            try {
                // 检查NPC交互区域
                if (this.npcInteractionArea.active && this.showNpcPao && !this.npcViewButton.permanentlyHidden) {
                    const dx = playerI - this.npcInteractionArea.centerI;
                    const dy = playerJ - this.npcInteractionArea.centerJ;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance <= this.npcInteractionArea.radius) {
                        this.npcViewButton.show = true;
                        // 计算按钮位置
                        const buttonPos = project(this.npcViewButton.buttonI, this.npcViewButton.buttonJ);
                        this.npcViewButton.x = buttonPos.x;
                        this.npcViewButton.y = buttonPos.y;
                    } else {
                        this.npcViewButton.show = false;
                        this.npcViewButton.isHovered = false;
                    }
                } else {
                    this.npcViewButton.show = false;
                    this.npcViewButton.isHovered = false;
                }
            } catch (error) {
                console.error('NPC交互检查错误:', error);
                this.npcViewButton.show = false;
                this.npcViewButton.isHovered = false;
            }

            // 检查所有按钮的交互
            this.buttons.forEach((button, index) => {
                const distance = Math.sqrt(
                    Math.pow(playerI - button.interactionI, 2) + Math.pow(playerJ - button.interactionJ, 2)
                );
                
                // 第二个按钮需要第一个按钮已完成交互才能显示
                if (index === 1 && !this.firstButtonCompleted) {
                    button.show = false;
                    button.isHovered = false;
                    return;
                }
                
                if (distance <= button.radius) {
                    // 第一个按钮在清除过程中或竹子已清除后不应该显示
                    if (index === 0 && (this.clearAnimation.playing || this.bambooCleared || this.clearButtonUsed)) {
                        button.show = false;
                        button.isHovered = false;
                    } else if (index === 0 && this.canClearBamboo && !this.showClearBackpack && !this.clearButtonUsed) {
                        // 如果可以选择清除道具但还没有选择，显示按钮
                    button.show = true;
                    // 计算按钮位置
                    const buttonPos = project(button.buttonI, button.buttonJ);
                    button.x = buttonPos.x;
                    button.y = buttonPos.y;
                    } else if (index === 0 && this.canClearBamboo && this.showClearBackpack) {
                        // 如果正在选择清除道具，隐藏按钮
                        button.show = false;
                        button.isHovered = false;
                    } else {
                        button.show = true;
                        // 计算按钮位置
                        const buttonPos = project(button.buttonI, button.buttonJ);
                        button.x = buttonPos.x;
                        button.y = buttonPos.y;
                    }
                } else {
                    button.show = false;
                    button.isHovered = false;
                }
            });
        }

        draw(ctx) {
            // 如果游戏结束序列已触发，不绘制UI元素
            if (this.gameEnding.isTriggered) {
                return;
            }

            // 绘制画轴图片（动画播放时或笔绘结果显示时隐藏）
            if (this.showHuazhou && this.huazhouImage && !this.drawingAnimation.playing && !this.drawingResult.show) {
                this.drawHuazhou(ctx);
            }

            // 绘制背包界面（在最上层）
            if (this.showBackpack && this.backpackImage) {
                this.drawBackpack(ctx);
            }

            // 绘制清除道具选择背包界面
            if (this.showClearBackpack && this.backpackImage) {
                this.drawClearBackpack(ctx);
            }

            // 绘制斧头图表
            if (this.showChartFutou && this.chartFutouImage) {
                this.drawChartFutou(ctx);
            }

            // 绘制清除图表
            if (this.showClearChart && this.clearChartImage) {
                this.drawClearChart(ctx);
            }



            // 绘制绘制动画（最高层级）
            this.drawDrawingAnimation(ctx);

            // 绘制笔绘结果
            this.drawDrawingResult(ctx);

            // 绘制错误信息
            this.drawErrorMessage(ctx);

            // 绘制斧头信息图片
            if (this.showFutouInfo && this.futouInfoImage) {
                this.drawFutouInfo(ctx);
            }

            // 绘制竹子图表
            if (this.showChart && this.chartImage) {
                this.drawChart(ctx);
            }

            // 绘制门图表（最上层，确保显示在所有其他UI元素之上）
            if (this.showMenChart && this.menChartImage) {
                this.drawMenChart(ctx);
            }

            // 绘制属性相克UI
            this.drawShuxingxiangkeUI(ctx);

            // 绘制颜料点数奖励提示
            this.drawPaintPointsReward(ctx);

            // 绘制规则提示
            this.drawRulesNotification(ctx);

            // 绘制升级通知
            this.drawLevelUpNotification(ctx);

            // 绘制新奖励提示（最后绘制，确保在最上层）
            this.drawRewardNotification(ctx);

            // 绘制Keep Going图片
            this.drawKeepGoingImage(ctx);

            // 绘制斧头砍下动画
            this.drawAxeAnimation(ctx);

            // 绘制雨聊天图片序列
            this.drawYuChatSequence(ctx);

            // 只有在没有图片显示时才绘制按钮和图标
            const hasImageDisplayed = this.showChart || this.showFutouInfo || this.showChartFutou || this.showHuazhou || this.showBackpack || this.showClearBackpack || this.showClearChart || this.showCryingChart || this.showMenChart || this.clearAnimation.playing || this.yuChatSequence.show || this.rewardNotification.show || this.rulesNotification.show || this.keepGoingImage.show;
            if (!hasImageDisplayed) {
                // 绘制绘制图标
                this.drawDrawIcon(ctx);

                // 绘制背包按钮
                this.drawBackpackButton(ctx);

                // 绘制规则按钮
                this.drawRulesButton(ctx);

                // 绘制颜料图标
                this.drawPaintIcons(ctx);

                // 绘制等级信息（已移除，只保留升级提示）
                // this.drawLevelInfo(ctx);

            // 绘制所有显示的按钮
        this.buttons.forEach((button, index) => {
            // 第一个按钮在清除动画播放期间或竹子已清除后不应该显示
            if (index === 0 && (this.clearAnimation.playing || this.bambooCleared || this.clearButtonUsed)) {
                console.log('跳过第一个按钮绘制，动画播放中或竹子已清除或按钮已使用');
                return; // 跳过第一个按钮的绘制
            }
                
                if (button.show) {
                    // 确保按钮坐标是最新的
                    const buttonPos = project(button.buttonI, button.buttonJ);
                    button.x = buttonPos.x;
                    button.y = buttonPos.y;
                    
                    this.drawButton(ctx, button, index);
                }
            });

            // 绘制NPC查看按钮（场景中的交互元素）
            if (this.npcViewButton.show) {
                this.drawNpcViewButton(ctx);
            }
            }
        }

        drawChart(ctx) {
            // 绘制半透明背景遮罩
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, 0, WIDTH, HEIGHT);

            if (this.chartImage) {
                // 计算图片位置（图片中心与(0,0)对齐）
                const origin = project(0, 0);
                const imgWidth = this.chartImage.width;
                const imgHeight = this.chartImage.height;
                
                // 绘制图片，以(0,0)为中心
                ctx.drawImage(
                    this.chartImage,
                    origin.x - imgWidth / 2,
                    origin.y - imgHeight / 2,
                    imgWidth,
                    imgHeight
                );
            }
        }

        drawFutouInfo(ctx) {
            // 绘制半透明背景遮罩
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, 0, WIDTH, HEIGHT);

            if (this.futouInfoImage) {
                // 计算图片位置（图片中心与(0,0)对齐）
                const origin = project(0, 0);
                const imgWidth = this.futouInfoImage.width;
                const imgHeight = this.futouInfoImage.height;
                
                // 绘制图片，以(0,0)为中心
                ctx.drawImage(
                    this.futouInfoImage,
                    origin.x - imgWidth / 2,
                    origin.y - imgHeight / 2,
                    imgWidth,
                    imgHeight
                );
            }
        }

        drawChartFutou(ctx) {
            // 绘制半透明背景遮罩
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, 0, WIDTH, HEIGHT);

            if (this.chartFutouImage) {
                // 计算图片位置（图片中心与(0,0)对齐）
                const origin = project(0, 0);
                const imgWidth = this.chartFutouImage.width;
                const imgHeight = this.chartFutouImage.height;
                
                // 绘制图片，以(0,0)为中心
                ctx.drawImage(
                    this.chartFutouImage,
                    origin.x - imgWidth / 2,
                    origin.y - imgHeight / 2,
                    imgWidth,
                    imgHeight
                );
            }
        }

        drawClearChart(ctx) {
            // 绘制半透明背景遮罩
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, 0, WIDTH, HEIGHT);

            if (this.clearChartImage) {
                // 计算图片位置（图片中心与(0,0)对齐）
                const origin = project(0, 0);
                const imgWidth = this.clearChartImage.width;
                const imgHeight = this.clearChartImage.height;
                
                // 绘制图片，以(0,0)为中心
                ctx.drawImage(
                    this.clearChartImage,
                    origin.x - imgWidth / 2,
                    origin.y - imgHeight / 2,
                    imgWidth,
                    imgHeight
                );
            }
        }

        drawCryingChart(ctx) {
            // 绘制半透明背景遮罩
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, 0, WIDTH, HEIGHT);

            if (this.cryingChartImage) {
                // 计算图片位置（图片中心与(0,0)对齐）
                const origin = project(0, 0);
                const imgWidth = this.cryingChartImage.width;
                const imgHeight = this.cryingChartImage.height;
                
                // 绘制图片，以(0,0)为中心
                ctx.drawImage(
                    this.cryingChartImage,
                    origin.x - imgWidth / 2,
                    origin.y - imgHeight / 2,
                    imgWidth,
                    imgHeight
                );
            }
        }

        drawNpcPao(ctx) {
            if (this.npcPaoImage) {
                // 计算图片位置（图片中心与(0,0)对齐）
                const origin = project(0, 0);
                const imgWidth = this.npcPaoImage.width;
                const imgHeight = this.npcPaoImage.height;
                
                // 绘制图片，以(0,0)为中心
                ctx.drawImage(
                    this.npcPaoImage,
                    origin.x - imgWidth / 2,
                    origin.y - imgHeight / 2,
                    imgWidth,
                    imgHeight
                );
            }
        }

        drawNpcViewButton(ctx) {
            const button = this.npcViewButton;
            const x = button.x;
            const y = button.y;
            const width = BUTTON_SIZE;
            const height = 50;
            const time = this.animationTime * 0.001; // 时间用于动画
            
            // 根据交互状态确定按钮文字
            const buttonText = button.firstInteractionCompleted ? '破除' : '查看';

            // 保存当前状态
            ctx.save();

            // 绘制按钮阴影
            ctx.fillStyle = 'rgba(254, 193, 149, 0.3)';
            ctx.fillRect(x - width/2 + 3, y - height/2 + 3, width, height);

            // 绘制按钮背景
            if (button.isHovered) {
                ctx.fillStyle = 'rgba(254, 193, 149, 0.1)';
                ctx.fillRect(x - width/2, y - height/2, width, height);
                
                // 绘制发光效果
                ctx.strokeStyle = 'rgba(254, 193, 149, 0.8)';
                ctx.lineWidth = 4;
                ctx.strokeRect(x - width/2 - 2, y - height/2 - 2, width + 4, height + 4);
            } else {
                ctx.fillStyle = 'rgba(254, 193, 149, 0.9)';
                ctx.fillRect(x - width/2, y - height/2, width, height);
            }

            // 绘制按钮边框
            ctx.strokeStyle = 'rgba(254, 193, 149, 1)';
            ctx.lineWidth = 3;
            ctx.strokeRect(x - width/2, y - height/2, width, height);

            // 绘制星星动画
            this.drawStars(ctx, x, y, width, height, time, button);

            // 绘制按钮文字（宋体）
            ctx.fillStyle = button.isHovered ? 'rgba(254, 193, 149, 1)' : 'rgba(24, 24, 24, 1)';
            ctx.font = 'bold 17px "SimSun", "宋体", serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            ctx.fillText(buttonText, x, y);

            // 恢复状态
            ctx.restore();
        }

        drawMenChart(ctx) {
            // 绘制半透明背景遮罩
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, 0, WIDTH, HEIGHT);

            if (this.menChartImage) {
                // 计算图片位置（图片中心与(0,0)对齐）
                const origin = project(0, 0);
                const imgWidth = this.menChartImage.width;
                const imgHeight = this.menChartImage.height;
                
                // 绘制图片，以(0,0)为中心
                ctx.drawImage(
                    this.menChartImage,
                    origin.x - imgWidth / 2,
                    origin.y - imgHeight / 2,
                    imgWidth,
                    imgHeight
                );
            }
        }

        drawShuxingxiangkeUI(ctx) {
            if (this.shuxingxiangkeUI.show && this.shuxingxiangkeUI.image) {
                // 计算按钮位置
                const buttonPos = project(this.npcViewButton.buttonI, this.npcViewButton.buttonJ);
                
                // 保存当前状态
                ctx.save();
                
                // 应用淡出效果
                if (this.shuxingxiangkeUI.fadeOut.active) {
                    const currentTime = Date.now();
                    const elapsed = currentTime - this.shuxingxiangkeUI.fadeOut.startTime;
                    const progress = Math.min(elapsed / this.shuxingxiangkeUI.fadeOut.duration, 1);
                    this.shuxingxiangkeUI.fadeOut.alpha = 1 - progress;
                    
                    // 如果淡出完成，隐藏UI
                    if (progress >= 1) {
                        this.shuxingxiangkeUI.show = false;
                        this.shuxingxiangkeUI.fadeOut.active = false;
                        console.log('属性相克UI淡出完成');
                        
                        // 检查是否需要开始场景转换
                        if (this.axeAnimation.shouldStartSceneTransition) {
                            this.axeAnimation.shouldStartSceneTransition = false;
                            this.startSceneTransition();
                        } else {
                            // 开始场景重新亮起
                            this.startSceneFadeIn();
                        }
                    }
                }
                
                // 设置透明度
                ctx.globalAlpha = this.shuxingxiangkeUI.fadeOut.alpha;
                
                // 绘制图片，以按钮位置为中心
                const imgWidth = this.shuxingxiangkeUI.image.width;
                const imgHeight = this.shuxingxiangkeUI.image.height;
                
                ctx.drawImage(
                    this.shuxingxiangkeUI.image,
                    buttonPos.x - imgWidth / 2,
                    buttonPos.y - imgHeight / 2,
                    imgWidth,
                    imgHeight
                );
                
                // 恢复状态
                ctx.restore();
            }
        }

        drawSceneTransition(ctx) {
            if (!this.sceneTransition.active) return;

            // 保存当前状态
            ctx.save();

            // 处理场景褪色
            if (this.sceneTransition.fadeOut.active) {
                const currentTime = Date.now();
                const elapsed = currentTime - this.sceneTransition.fadeOut.startTime;
                const progress = Math.min(elapsed / this.sceneTransition.fadeOut.duration, 1);
                this.sceneTransition.fadeOut.alpha = 1 - progress;

                // 绘制新背景
                if (this.sceneTransition.newBackgroundLoaded && this.sceneTransition.newBackgroundImage) {
                    const origin = project(0, 0);
                    const bx = Math.round(origin.x - this.sceneTransition.newBackgroundImage.width / 2);
                    const by = Math.round(origin.y - this.sceneTransition.newBackgroundImage.height / 2);
                    ctx.drawImage(this.sceneTransition.newBackgroundImage, bx, by);
                }

                // 绘制黑色遮罩
                ctx.fillStyle = `rgba(0, 0, 0, ${this.sceneTransition.fadeOut.alpha})`;
                ctx.fillRect(0, 0, WIDTH, HEIGHT);

                // 如果褪色完成，切换到新背景
                if (progress >= 1) {
                    this.sceneTransition.fadeOut.active = false;
                    console.log('场景褪色完成，切换到新背景');
                    // 自动开始淡入
                    this.startSceneFadeIn();
                }
            }

            // 处理场景重新亮起
            if (this.sceneTransition.fadeIn.active) {
                const currentTime = Date.now();
                const elapsed = currentTime - this.sceneTransition.fadeIn.startTime;
                const progress = Math.min(elapsed / this.sceneTransition.fadeIn.duration, 1);
                this.sceneTransition.fadeIn.alpha = progress;

                // 绘制新背景
                if (this.sceneTransition.newBackgroundLoaded && this.sceneTransition.newBackgroundImage) {
                    const origin = project(0, 0);
                    const bx = Math.round(origin.x - this.sceneTransition.newBackgroundImage.width / 2);
                    const by = Math.round(origin.y - this.sceneTransition.newBackgroundImage.height / 2);
                    ctx.drawImage(this.sceneTransition.newBackgroundImage, bx, by);
                }

                // 绘制淡入效果
                ctx.fillStyle = `rgba(0, 0, 0, ${1 - this.sceneTransition.fadeIn.alpha})`;
                ctx.fillRect(0, 0, WIDTH, HEIGHT);

                // 如果淡入完成，结束场景转换
                if (progress >= 1) {
                    this.sceneTransition.fadeIn.active = false;
                    this.sceneTransition.active = false;
                    // 标记背景已切换
                    this.sceneTransition.backgroundSwitched = true;
                    // 永久隐藏NPC跑动UI
                    this.showNpcPao = false;
                    console.log('场景转换完成，背景已切换，NPC跑动UI已隐藏');
                    
                    // 只有在非奖励场景转换时才启动雨聊天图片序列
                    if (!this.sceneTransition.isRewardTransition) {
                        this.startYuChatSequence();
                    } else {
                        console.log('奖励场景转换完成，不启动雨聊天图片序列');
                        // 显示奖励提示
                        this.showRewardNotification();
                        // 重置奖励场景转换标志
                        this.sceneTransition.isRewardTransition = false;
                    }
                }
            }

            // 恢复状态
            ctx.restore();
        }

        drawPaintPointsReward(ctx) {
            if (this.paintPointsReward.show && this.paintPointsReward.image) {
                // 保存当前状态
                ctx.save();
                
                // 应用淡出效果
                if (this.paintPointsReward.fadeOut.active) {
                    const currentTime = Date.now();
                    const elapsed = currentTime - this.paintPointsReward.fadeOut.startTime;
                    const progress = Math.min(elapsed / this.paintPointsReward.fadeOut.duration, 1);
                    this.paintPointsReward.fadeOut.alpha = 1 - progress;
                    
                    // 如果淡出完成，隐藏UI
                    if (progress >= 1) {
                        this.paintPointsReward.show = false;
                        this.paintPointsReward.fadeOut.active = false;
                        console.log('颜料点数奖励提示淡出完成');
                    }
                }
                
                // 设置透明度
                ctx.globalAlpha = this.paintPointsReward.fadeOut.alpha;
                
                // 计算屏幕中心位置
                const centerX = WIDTH / 2;
                const centerY = HEIGHT / 2;
                
                // 绘制半透明背景
                ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                ctx.fillRect(0, 0, WIDTH, HEIGHT);
                
                // 绘制奖励文字 - 第一行：恭喜获得
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 24px "SimSun", "宋体", serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                
                const firstLineY = centerY - 40;
                ctx.fillText('恭喜获得', centerX, firstLineY);
                
                // 绘制颜料图标 - 第二行：图2_green_drawing_ui
                const iconSize = 60;
                const iconX = centerX - iconSize / 2;
                const iconY = centerY - 10;
                
                ctx.drawImage(
                    this.paintPointsReward.image,
                    iconX,
                    iconY,
                    iconSize,
                    iconSize
                );
                
                // 绘制奖励文字 - 第三行：*10
                const thirdLineY = centerY + 40;
                ctx.fillText(`*${this.paintPointsReward.points}`, centerX, thirdLineY);
                
                // 恢复状态
                ctx.restore();
            }
        }

        drawRewardNotification(ctx) {
            if (this.rewardNotification.show && this.rewardNotification.kailingjiImage && this.rewardNotification.greenDrawingImage && this.rewardNotification.lingImage) {
                // 保存当前状态
                ctx.save();
                
                // 应用淡出效果
                if (this.rewardNotification.fadeOut.active) {
                    const currentTime = Date.now();
                    const elapsed = currentTime - this.rewardNotification.fadeOut.startTime;
                    const progress = Math.min(elapsed / this.rewardNotification.fadeOut.duration, 1);
                    this.rewardNotification.fadeOut.alpha = 1 - progress;
                    
                    // 如果淡出完成，隐藏UI
                    if (progress >= 1) {
                        this.rewardNotification.show = false;
                        this.rewardNotification.fadeOut.active = false;
                        console.log('奖励提示淡出完成');
                        // 立即显示Keep Going图片
                        this.showKeepGoingImage();
                    }
                }
                
                // 设置透明度
                ctx.globalAlpha = this.rewardNotification.fadeOut.alpha;
                
                // 计算屏幕中心位置
                const centerX = WIDTH / 2;
                const centerY = HEIGHT / 2;
                
                // 绘制半透明背景
                ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                ctx.fillRect(0, 0, WIDTH, HEIGHT);
                
                // 绘制奖励文字 - 第一行：恭喜获得
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 24px "SimSun", "宋体", serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                
                const firstLineY = centerY - 80; // 扩大2倍距离：从-40改为-80
                ctx.fillText('恭喜获得', centerX, firstLineY);
                
                // 绘制第二行：开灵机UI + 20像素间距 + 绿色绘制UI + 20像素间距 + 灵UI
                const iconSize = 60;
                const spacing = 20;
                const totalWidth = iconSize * 3 + spacing * 2; // 3张图片，2个间距
                const startX = centerX - totalWidth / 2;
                const secondLineY = centerY - 10; // 保持图片位置不变
                
                // 绘制开灵机UI
                ctx.drawImage(
                    this.rewardNotification.kailingjiImage,
                    startX,
                    secondLineY - iconSize / 2,
                    iconSize,
                    iconSize
                );
                
                // 绘制绿色绘制UI
                ctx.drawImage(
                    this.rewardNotification.greenDrawingImage,
                    startX + iconSize + spacing,
                    secondLineY - iconSize / 2,
                    iconSize,
                    iconSize
                );
                
                // 绘制灵UI
                ctx.drawImage(
                    this.rewardNotification.lingImage,
                    startX + iconSize * 2 + spacing * 2,
                    secondLineY - iconSize / 2,
                    iconSize,
                    iconSize
                );
                
                // 在绿色绘制UI右下角显示*5
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 18px "SimSun", "宋体", serif';
                ctx.textAlign = 'right';
                ctx.textBaseline = 'bottom';
                const greenMultiplierX = startX + iconSize + spacing + iconSize - 5;
                const greenMultiplierY = secondLineY + iconSize / 2 - 5;
                ctx.fillText('*5', greenMultiplierX, greenMultiplierY);
                
                // 在灵UI右下角显示*1
                const lingMultiplierX = startX + iconSize * 2 + spacing * 2 + iconSize - 5;
                const lingMultiplierY = secondLineY + iconSize / 2 - 5;
                ctx.fillText('*1', lingMultiplierX, lingMultiplierY);
                
                // 恢复状态
                ctx.restore();
            }
        }

        // 显示Keep Going图片
        showKeepGoingImage() {
            console.log('尝试显示Keep Going图片，加载状态:', this.keepGoingImage.loaded);
            if (this.keepGoingImage.loaded) {
                this.keepGoingImage.show = true;
                console.log('显示Keep Going图片成功');
            } else {
                console.warn('Keep Going图片未加载完成，无法显示');
                // 尝试重新加载图片
                if (this.keepGoingImage.image) {
                    console.log('尝试重新加载Keep Going图片');
                    this.keepGoingImage.image.src = '2_chat_keep going.png';
                }
            }
        }


        // 绘制Keep Going图片
        drawKeepGoingImage(ctx) {
            if (!this.keepGoingImage.show || !this.keepGoingImage.loaded || !this.keepGoingImage.image) {
                if (this.keepGoingImage.show) {
                    console.log('Keep Going图片显示状态:', this.keepGoingImage.show, '加载状态:', this.keepGoingImage.loaded, '图片对象:', !!this.keepGoingImage.image);
                }
                return;
            }

            // 保存当前状态
            ctx.save();

            // 绘制半透明背景遮罩
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, 0, WIDTH, HEIGHT);

            // 计算图片位置（图片中心与(0,0)对齐）
            const origin = project(0, 0);
            const img = this.keepGoingImage.image;
            const imgWidth = img.width;
            const imgHeight = img.height;

            // 绘制图片，以(0,0)为中心
            ctx.drawImage(
                img,
                origin.x - imgWidth / 2,
                origin.y - imgHeight / 2,
                imgWidth,
                imgHeight
            );

            // 恢复状态
            ctx.restore();
            console.log('Keep Going图片绘制完成');
        }

        drawAxeAnimation(ctx) {
            if (this.axeAnimation.playing && this.axeAnimation.loaded && this.axeAnimation.images[this.axeAnimation.currentFrame]) {
                // 计算动画位置
                const animPos = project(this.axeAnimation.positionI, this.axeAnimation.positionJ);
                
                // 保存当前状态
                ctx.save();
                
                // 绘制当前帧
                const currentImage = this.axeAnimation.images[this.axeAnimation.currentFrame];
                const imgSize = 120; // 3倍大小
                
                ctx.drawImage(
                    currentImage,
                    animPos.x - imgSize / 2,
                    animPos.y - imgSize / 2,
                    imgSize,
                    imgSize
                );
                
                // 恢复状态
                ctx.restore();
                
                console.log(`绘制斧头砍下动画第${this.axeAnimation.currentFrame + 1}帧，位置: (${animPos.x}, ${animPos.y})，动画播放中: ${this.axeAnimation.playing}`);
            }
        }

        drawYuChatSequence(ctx) {
            if (this.yuChatSequence.show && this.yuChatSequence.loaded && this.yuChatSequence.images[this.yuChatSequence.currentIndex]) {
                // 保存当前状态
                ctx.save();
                
                // 计算屏幕中心位置（0,0对齐）
                const centerX = WIDTH / 2;
                const centerY = HEIGHT / 2;
                
                // 获取当前图片
                const currentImage = this.yuChatSequence.images[this.yuChatSequence.currentIndex];
                
                // 绘制图片，以中心为锚点
                ctx.drawImage(
                    currentImage,
                    centerX - currentImage.width / 2,
                    centerY - currentImage.height / 2
                );
                
                // 恢复状态
                ctx.restore();
                
                console.log(`绘制雨聊天图片第${this.yuChatSequence.currentIndex + 1}张，位置: (${centerX}, ${centerY})`);
            }
        }

        drawHuazhou(ctx) {
            // 绘制半透明背景遮罩
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, 0, WIDTH, HEIGHT);

            if (this.huazhouImage) {
                // 计算图片位置（图片中心与(0,0)对齐）
                const origin = project(0, 0);
                const imgWidth = this.huazhouImage.width;
                const imgHeight = this.huazhouImage.height;
                
                // 绘制图片，以(0,0)为中心，向上偏移20像素，向右偏移10像素
                ctx.drawImage(
                    this.huazhouImage,
                    origin.x - imgWidth / 2 + 10,
                    origin.y - imgHeight / 2 - 20,
                    imgWidth,
                    imgHeight
                );

                // 绘制+号按钮（在画轴正中间，如果有选中道具则不显示）
                if (!this.selectedItem) {
                    this.drawPlusButton(ctx, origin.x + 10, origin.y - 20);
                } else {
                    // 绘制选中的道具
                    this.drawSelectedItem(ctx, origin.x + 10, origin.y - 20);
                }

                // 绘制绘制按钮
                this.drawDrawingButtons(ctx, origin.x + 10, origin.y - 20);
                
                // 绘制数量输入栏（在红线框区域）
                this.drawQuantityInput(ctx, origin.x + 10, origin.y + 210);
                
                // 绘制退出按钮（在画轴右上角）
                this.drawHuazhouExitButton(ctx, origin.x + 10, origin.y - 20);
            }
        }

        drawHuazhouExitButton(ctx, centerX, centerY) {
            // 退出按钮位置（画轴右上角）
            const imgWidth = this.huazhouImage.width;
            const imgHeight = this.huazhouImage.height;
            
            // 画轴窗口的位置
            const windowX = centerX - imgWidth / 2;
            const windowY = centerY - imgHeight / 2;
            
            // 退出按钮位置（画轴右上角，向左移动110像素）
            const buttonWidth = 60;
            const buttonHeight = 30;
            const buttonX = windowX + imgWidth - buttonWidth - 20 - 110; // 距离画轴右边20像素，再向左110像素
            const buttonY = windowY + 20; // 距离画轴顶部20像素
            
            this.drawRulesNavButton(ctx, 
                buttonX, 
                buttonY, 
                buttonWidth, 
                buttonHeight, 
                '退出', 
                this.huazhouExitButtonHovered
            );
        }

        drawDrawingAnimation(ctx) {
            if (!this.drawingAnimation.playing || !this.drawingAnimation.loaded) {
                return;
            }

            const img = this.drawingAnimation.images[this.drawingAnimation.currentFrame];
            if (!img) return;

            // 保存当前状态
            ctx.save();

            // 绘制半透明黑色遮罩，降低背景亮度
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(0, 0, WIDTH, HEIGHT);

            // 获取画布中心位置（0,0对齐）
            const origin = project(0, 0);
            const centerX = origin.x;
            const centerY = origin.y;

            // 绘制动画图片，居中显示，尺寸缩小5倍
            const imgWidth = img.width / 5;
            const imgHeight = img.height / 5;
            ctx.drawImage(
                img,
                centerX - imgWidth / 2,
                centerY - imgHeight / 2,
                imgWidth,
                imgHeight
            );

            // 恢复状态
            ctx.restore();
        }

        drawClearAnimation(ctx) {
            if (!this.clearAnimation.playing || !this.clearAnimation.loaded) {
                return;
            }

            // 获取当前帧图片
            const currentImage = this.clearAnimation.images[this.clearAnimation.currentFrame];
            if (currentImage) {
                // 计算第一个按钮的位置
                const buttonPos = project(this.buttons[0].buttonI, this.buttons[0].buttonJ);
                
                // 保存当前状态
                ctx.save();
                
                // 绘制图片，尺寸120像素（40 * 3）
                const imgSize = 120;
                ctx.drawImage(
                    currentImage,
                    buttonPos.x - imgSize / 2,
                    buttonPos.y - imgSize / 2,
                    imgSize,
                    imgSize
                );
                
                // 恢复状态
                ctx.restore();
                
                console.log(`绘制斧头砍下动画第${this.clearAnimation.currentFrame + 1}帧，位置: (${buttonPos.x}, ${buttonPos.y})，动画播放中: ${this.clearAnimation.playing}`);
            } else {
                console.warn(`斧头砍下动画第${this.clearAnimation.currentFrame}帧图片未加载`);
            }
        }

        drawXiangkeUI(ctx) {
            if (!this.xiangkeUI.show || !this.xiangkeUI.loaded || !this.xiangkeUI.image) {
                return;
            }

            // 计算属性相克UI的位置
            const uiPos = project(this.xiangkeUI.positionI, this.xiangkeUI.positionJ);
            
            // 保存当前状态
            ctx.save();
            
            // 应用竹子褪色效果
            if (this.bambooFade.fading) {
                ctx.globalAlpha = this.bambooFade.alpha;
            }
            
            // 绘制属性相克UI图片
            const imgWidth = this.xiangkeUI.image.width;
            const imgHeight = this.xiangkeUI.image.height;
            const scale = 1.0; // 可以根据需要调整缩放
            
            ctx.drawImage(
                this.xiangkeUI.image,
                uiPos.x - imgWidth * scale / 2,
                uiPos.y - imgHeight * scale / 2,
                imgWidth * scale,
                imgHeight * scale
            );
            
            // 恢复状态
            ctx.restore();
            
            console.log(`绘制属性相克UI，位置: (${uiPos.x}, ${uiPos.y})，透明度: ${this.bambooFade.alpha}`);
        }

        drawDrawingResult(ctx) {
            if (!this.drawingResult.show || !this.drawingResult.loaded || !this.drawingResult.image) {
                return;
            }

            // 保存当前状态
            ctx.save();

            // 绘制半透明黑色遮罩，降低背景亮度
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(0, 0, WIDTH, HEIGHT);

            // 获取画布中心位置（0,0对齐）
            const origin = project(0, 0);
            const centerX = origin.x;
            const centerY = origin.y;

            // 绘制笔绘结果图片，居中显示，尺寸放大3倍
            const img = this.drawingResult.image;
            const itemSize = 180; // 与选中道具尺寸一致
            const scale = itemSize / Math.max(img.width, img.height);
            const scaledWidth = img.width * scale;
            const scaledHeight = img.height * scale;

            ctx.drawImage(
                img,
                centerX - scaledWidth / 2,
                centerY - scaledHeight / 2,
                scaledWidth,
                scaledHeight
            );

            // 绘制恭喜文字
            this.drawCongratulationsText(ctx, centerX, centerY + itemSize / 2 + 50);

            // 恢复状态
            ctx.restore();
        }

        drawCongratulationsText(ctx, x, y) {
            // 保存当前状态
            ctx.save();

            // 绘制文字背景
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(x - 100, y - 15, 200, 30);

            // 绘制恭喜文字
            ctx.fillStyle = 'white';
            ctx.font = 'bold 20px "SimSun", "宋体", serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('恭喜获得斧头！', x, y);

            // 恢复状态
            ctx.restore();
        }

        drawErrorMessage(ctx) {
            if (!this.errorMessage.show) {
                return;
            }

            // 检查错误信息显示时间（3秒后自动消失）
            const currentTime = Date.now();
            if (currentTime - this.errorMessage.startTime > 3000) {
                this.errorMessage.show = false;
                return;
            }

            // 保存当前状态
            ctx.save();

            // 获取画布中心位置
            const centerX = WIDTH / 2;
            const centerY = HEIGHT / 2;

            // 绘制错误信息背景
            ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            ctx.fillRect(centerX - 200, centerY - 30, 400, 60);

            // 绘制错误信息文字
            ctx.fillStyle = '#ff4444';
            ctx.font = 'bold 20px "SimSun", "宋体", serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.errorMessage.text, centerX, centerY);

            // 恢复状态
            ctx.restore();
        }

        drawBackpack(ctx) {
            // 绘制半透明背景遮罩
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, 0, WIDTH, HEIGHT);

            if (this.backpackImage) {
                // 计算图片位置（图片中心与(0,0)对齐）
                const origin = project(0, 0);
                const imgWidth = this.backpackImage.width;
                const imgHeight = this.backpackImage.height;
                
                // 绘制背包界面图片
                ctx.drawImage(
                    this.backpackImage,
                    origin.x - imgWidth / 2,
                    origin.y - imgHeight / 2,
                    imgWidth,
                    imgHeight
                );

                // 绘制标签按钮
                this.drawTabButtons(ctx, origin.x, origin.y);

                // 绘制提示文字（如果门图表已显示过）
                if (this.menChartShown) {
                    this.drawBackpackHint(ctx, origin.x, origin.y);
                }

                // 绘制背包网格和物品
                this.drawBackpackGrid(ctx, origin.x, origin.y);
                
                // 绘制退出按钮（在背包右上角）
                this.drawBackpackExitButton(ctx, origin.x, origin.y);
            }
        }

        drawBackpackExitButton(ctx, centerX, centerY) {
            // 退出按钮位置（背包右上角）
            const imgWidth = this.backpackImage.width;
            const imgHeight = this.backpackImage.height;
            
            // 背包窗口的位置
            const windowX = centerX - imgWidth / 2;
            const windowY = centerY - imgHeight / 2;
            
            // 退出按钮位置（背包右上角，向左移动110像素，向上移动20像素）
            const buttonWidth = 60;
            const buttonHeight = 30;
            const buttonX = windowX + imgWidth - buttonWidth - 20 - 110; // 距离背包右边20像素，再向左110像素
            const buttonY = windowY + 20 - 20; // 距离背包顶部20像素，再向上20像素
            
            this.drawRulesNavButton(ctx, 
                buttonX, 
                buttonY, 
                buttonWidth, 
                buttonHeight, 
                '退出', 
                this.backpackExitButtonHovered
            );
        }

        drawBackpackHint(ctx, centerX, centerY) {
            if (!this.backpackImage) return;

            // 获取背包图片的实际尺寸
            const imgWidth = this.backpackImage.width;
            const imgHeight = this.backpackImage.height;
            
            // 计算背包图片在屏幕上的实际位置
            const origin = project(0, 0);
            const backpackX = origin.x - imgWidth / 2;
            const backpackY = origin.y - imgHeight / 2;
            
            // 计算网格区域
            const gridPadding = 40; // 背包内边距
            const cellWidth = (imgWidth - gridPadding * 2) / 8; // 原始8列的格子宽度
            const cellHeight = (imgHeight - gridPadding * 2) / 4; // 原始4行的格子高度
            
            // 计算第一行第一格的位置
            const firstCellX = backpackX + gridPadding + cellWidth; // 跳过最左1列
            const firstCellY = backpackY + gridPadding + 70; // 下移70像素
            
            // 标签按钮位置（第一格正上方40像素）
            const tabY = firstCellY - 40;
            
            // 提示文字位置（标签按钮上方40像素）
            const hintY = tabY - 40;
            
            // 保存当前状态
            ctx.save();
            
            // 绘制提示文字
            ctx.fillStyle = '#fff';
            ctx.font = '14px "SimSun", "宋体", serif'; // 宋体字体，与道具按钮相同大小
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('请选择道具，点击装备', centerX, hintY);
            
            // 恢复状态
            ctx.restore();
        }

        drawTabButtons(ctx, centerX, centerY) {
            if (!this.backpackImage) return;

            // 获取背包图片的实际尺寸
            const imgWidth = this.backpackImage.width;
            const imgHeight = this.backpackImage.height;
            
            // 计算背包图片在屏幕上的实际位置
            const origin = project(0, 0);
            const backpackX = origin.x - imgWidth / 2;
            const backpackY = origin.y - imgHeight / 2;
            
            // 计算网格区域
            const gridPadding = 40; // 背包内边距
            const cellWidth = (imgWidth - gridPadding * 2) / 8; // 原始8列的格子宽度
            const cellHeight = (imgHeight - gridPadding * 2) / 4; // 原始4行的格子高度
            
            // 计算第一行第一格的位置
            const firstCellX = backpackX + gridPadding + cellWidth; // 跳过最左1列
            const firstCellY = backpackY + gridPadding + 70; // 下移70像素
            
            // 标签按钮位置（第一格正上方40像素）
            const tabY = firstCellY - 40;
            const tabHeight = 35;
            const tabWidth = 80;
            const tabSpacing = 15;
            
            // 绘制"笔绘对象"按钮
            this.drawTabButton(ctx, 
                firstCellX, 
                tabY, 
                tabWidth, 
                tabHeight, 
                'drawing', 
                this.tabButtons.drawing
            );
            
            // 绘制"道具"按钮
            this.drawTabButton(ctx, 
                firstCellX + tabWidth + tabSpacing, 
                tabY, 
                tabWidth, 
                tabHeight, 
                'items', 
                this.tabButtons.items
            );
            
            // 计算第一行最后一格的位置（第6列，因为去掉了最左和最右各1列）
            const lastCellX = firstCellX + cellWidth * 5; // 第6列（索引5）
            
            // 绘制"装备"按钮（在第一行最后一格上方，不作为页签）
            this.drawEquipmentButton(ctx, 
                lastCellX, 
                tabY, 
                tabWidth, 
                tabHeight
            );
        }

        drawEquipmentButton(ctx, x, y, width, height) {
            // 保存当前状态
            ctx.save();
            
            // 应用悬停动画效果
            let currentScale = this.equipmentButton.scale;
            if (this.equipmentButton.hovered) {
                currentScale = 0.96; // 点击时的缩放效果
            } else {
                currentScale = 1.0;
            }
            
            // 更新状态
            this.equipmentButton.scale = currentScale;
            
            ctx.translate(x + width / 2, y + height / 2);
            ctx.scale(currentScale, currentScale);
            
            // 绘制按钮背景（参考CSS样式，使用E1B65E颜色）
            ctx.fillStyle = '#E1B65E';
            ctx.beginPath();
            ctx.roundRect(-width / 2, -height / 2, width, height, 6);
            ctx.fill();
            
            // 绘制边框
            ctx.strokeStyle = '#E1B65E';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // 绘制文字
            ctx.fillStyle = '#fff';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('装备', 0, 0);
            
            // 恢复状态
            ctx.restore();
        }

        drawTabButton(ctx, x, y, width, height, buttonKey, buttonState) {
            // 保存当前状态
            ctx.save();
            
            // 应用悬停动画效果
            let currentScale = buttonState.scale;
            if (buttonState.hovered) {
                currentScale = 0.96; // 点击时的缩放效果
            } else {
                currentScale = 1.0;
            }
            
            // 更新状态
            buttonState.scale = currentScale;
            
            ctx.translate(x + width / 2, y + height / 2);
            ctx.scale(currentScale, currentScale);
            
            // 判断是否为激活状态
            const isActive = this.activeTab === buttonKey;
            
            // 绘制按钮背景（参考CSS样式，使用E1B65E颜色）
            ctx.fillStyle = '#E1B65E';
            ctx.beginPath();
            ctx.roundRect(-width / 2, -height / 2, width, height, 6);
            ctx.fill();
            
            // 绘制边框
            ctx.strokeStyle = '#E1B65E';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // 绘制文字
            ctx.fillStyle = '#fff';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(buttonState.text, 0, 0);
            
            // 恢复状态
            ctx.restore();
        }

        drawBackpackGrid(ctx, centerX, centerY) {
            if (!this.backpackImage) return;
            
            // 获取背包图片的实际尺寸
            const imgWidth = this.backpackImage.width;
            const imgHeight = this.backpackImage.height;
            
            // 计算背包图片在屏幕上的实际位置和尺寸
            const origin = project(0, 0);
            const backpackX = origin.x - imgWidth / 2;
            const backpackY = origin.y - imgHeight / 2;
            
            // 计算网格区域（去掉边缘格子并下移）
            const gridPadding = 40; // 背包内边距
            const cellWidth = (imgWidth - gridPadding * 2) / 8; // 原始8列的格子宽度
            const cellHeight = (imgHeight - gridPadding * 2) / 4; // 原始4行的格子高度
            
            // 去掉最左和最右各1列，去掉最后1行，并下移70像素
            const gridX = backpackX + gridPadding + cellWidth; // 跳过最左1列
            const gridY = backpackY + gridPadding + 70; // 下移70像素
            const gridWidth = cellWidth * this.gridCols; // 6列宽度
            const gridHeight = cellHeight * this.gridRows; // 3行高度
            
            // 绘制网格背景
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.fillRect(gridX, gridY, gridWidth, gridHeight);

            // 绘制网格线
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.lineWidth = 1;
            
            // 垂直线
            for (let i = 0; i <= this.gridCols; i++) {
                const x = gridX + i * cellWidth;
                ctx.beginPath();
                ctx.moveTo(x, gridY);
                ctx.lineTo(x, gridY + gridHeight);
                ctx.stroke();
            }
            
            // 水平线
            for (let i = 0; i <= this.gridRows; i++) {
                const y = gridY + i * cellHeight;
                ctx.beginPath();
                ctx.moveTo(gridX, y);
                ctx.lineTo(gridX + gridWidth, y);
                ctx.stroke();
            }

            // 绘制物品
            this.drawInventoryItems(ctx, gridX, gridY, cellWidth, cellHeight);
        }

        drawInventoryItems(ctx, gridX, gridY, cellWidth, cellHeight) {
            if (this.activeTab === 'drawing') {
                // 绘制笔绘对象
                this.drawDrawingItems(ctx, gridX, gridY, cellWidth, cellHeight);
            } else if (this.activeTab === 'items') {
                // 绘制道具
                this.drawItemItems(ctx, gridX, gridY, cellWidth, cellHeight);
            }
        }

        drawDrawingItems(ctx, gridX, gridY, cellWidth, cellHeight) {
            // 绘制斧头物品（如果已收集）
            if (this.inventory.futou.collected && this.inventory.futou.loaded && this.inventory.futou.image) {
                const itemX = gridX + cellWidth / 2; // 第一行第一个格子
                const itemY = gridY + cellHeight / 2;
                
                const img = this.inventory.futou.image;
                const itemSize = Math.min(cellWidth, cellHeight) - 8; // 留出边距，使用较小的尺寸
                const scale = itemSize / Math.max(img.width, img.height);
                const scaledWidth = img.width * scale;
                const scaledHeight = img.height * scale;
                
                // 绘制物品背景（用于点击检测）
                ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
                ctx.fillRect(itemX - cellWidth / 2, itemY - cellHeight / 2, cellWidth, cellHeight);
                
                ctx.drawImage(
                    img,
                    itemX - scaledWidth / 2,
                    itemY - scaledHeight / 2,
                    scaledWidth,
                    scaledHeight
                );
            }
        }

        drawItemItems(ctx, gridX, gridY, cellWidth, cellHeight) {
            // 绘制绘制成功的斧头（如果已收集）
            if (this.drawnItems.futou_new.collected && this.drawnItems.futou_new.loaded && this.drawnItems.futou_new.image) {
                const itemX = gridX + cellWidth / 2; // 第一行第一个格子
                const itemY = gridY + cellHeight / 2;
                
                const img = this.drawnItems.futou_new.image;
                const itemSize = Math.min(cellWidth, cellHeight) - 8; // 留出边距，使用较小的尺寸
                const scale = itemSize / Math.max(img.width, img.height);
                const scaledWidth = img.width * scale;
                const scaledHeight = img.height * scale;
                
                // 绘制物品背景（用于点击检测）
                ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
                ctx.fillRect(itemX - cellWidth / 2, itemY - cellHeight / 2, cellWidth, cellHeight);
                
                // 绘制选中状态的边框
                if (this.selectedBackpackItem === 'futou_new') {
                    ctx.strokeStyle = 'black';
                    ctx.lineWidth = 3;
                    ctx.strokeRect(itemX - cellWidth / 2, itemY - cellHeight / 2, cellWidth, cellHeight);
                }
                
                ctx.drawImage(
                    img,
                    itemX - scaledWidth / 2,
                    itemY - scaledHeight / 2,
                    scaledWidth,
                    scaledHeight
                );
                
                // 绘制装备状态文字
                if (this.equippedItems['futou_new']) {
                    ctx.fillStyle = 'black';
                    ctx.font = '12px "SimSun", "宋体", serif';
                    ctx.textAlign = 'right';
                    ctx.textBaseline = 'bottom';
                    ctx.fillText('已装备', itemX + cellWidth / 2 - 5, itemY + cellHeight / 2 - 5);
                }
            }
        }


        drawClearBackpack(ctx) {
            // 绘制半透明背景遮罩
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, 0, WIDTH, HEIGHT);

            if (this.backpackImage) {
                // 计算图片位置（图片中心与(0,0)对齐）
                const origin = project(0, 0);
                const imgWidth = this.backpackImage.width;
                const imgHeight = this.backpackImage.height;
                
                // 绘制背包界面图片
                ctx.drawImage(
                    this.backpackImage,
                    origin.x - imgWidth / 2,
                    origin.y - imgHeight / 2,
                    imgWidth,
                    imgHeight
                );

                // 绘制提示文字（向上移动30像素）
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 20px "SimSun", "宋体", serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('请选择清除用的道具', WIDTH / 2, 70);
                
                // 绘制网格（不绘制标签页）
                this.drawClearBackpackGrid(ctx, origin.x, origin.y);
                
                // 只显示道具标签页的内容
                const gridPadding = 40;
                const cellWidth = (imgWidth - gridPadding * 2) / 8;
                const cellHeight = (imgHeight - gridPadding * 2) / 4;
                const gridX = origin.x - imgWidth / 2 + gridPadding + cellWidth;
                const gridY = origin.y - imgHeight / 2 + gridPadding + 70;
                this.drawItemItems(ctx, gridX, gridY, cellWidth, cellHeight);
            }
        }

        drawClearBackpackGrid(ctx, centerX, centerY) {
            if (!this.backpackImage) return;

            const imgWidth = this.backpackImage.width;
            const imgHeight = this.backpackImage.height;
            const gridPadding = 40;
            const cellWidth = (imgWidth - gridPadding * 2) / 8;
            const cellHeight = (imgHeight - gridPadding * 2) / 4;
            
            // 计算网格起始位置（去掉最左侧一列，最右侧一列，最后一行）
            const gridX = centerX - imgWidth / 2 + gridPadding + cellWidth; // 去掉最左侧一列
            const gridY = centerY - imgHeight / 2 + gridPadding + 70; // 去掉最后一行，下移70像素
            
            // 绘制6x3的网格（去掉最左、最右列和最后一行）
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.lineWidth = 1;
            
            // 绘制垂直线（6列）
            for (let col = 0; col <= 6; col++) {
                const x = gridX + col * cellWidth;
                const startY = gridY;
                const endY = gridY + 3 * cellHeight; // 只绘制3行
                ctx.beginPath();
                ctx.moveTo(x, startY);
                ctx.lineTo(x, endY);
                ctx.stroke();
            }
            
            // 绘制水平线（3行）
            for (let row = 0; row <= 3; row++) {
                const y = gridY + row * cellHeight;
                const startX = gridX;
                const endX = gridX + 6 * cellWidth; // 只绘制6列
                ctx.beginPath();
                ctx.moveTo(startX, y);
                ctx.lineTo(endX, y);
                ctx.stroke();
            }
        }

        drawPlusButton(ctx, centerX, centerY) {
            const buttonSize = 50; // 按钮尺寸
            const x = centerX;
            const y = centerY;
            
            // 应用悬停动画效果
            let currentRotation = this.plusButton.rotation;
            let currentScale = this.plusButton.scale;
            
            if (this.plusButton.hovered) {
                // 悬停时旋转90度并稍微放大
                currentRotation = 90;
                currentScale = 1.1;
            } else {
                // 平滑过渡回原始状态
                currentRotation = 0;
                currentScale = 1.0;
            }
            
            // 保存当前状态
            ctx.save();
            
            // 应用变换
            ctx.translate(x, y);
            ctx.rotate((currentRotation * Math.PI) / 180);
            ctx.scale(currentScale, currentScale);
            
            // 绘制圆形背景
            ctx.beginPath();
            ctx.arc(0, 0, buttonSize / 2, 0, 2 * Math.PI);
            
            if (this.plusButton.hovered) {
                // 悬停时填充青色
                ctx.fillStyle = 'rgba(0, 128, 128, 0.8)'; // teal-800
                ctx.fill();
                ctx.strokeStyle = 'rgba(0, 200, 200, 0.6)'; // teal-200
            } else {
                // 正常状态只描边
                ctx.fillStyle = 'none';
                ctx.strokeStyle = 'rgba(0, 200, 200, 1)'; // teal-500
            }
            
            ctx.lineWidth = 1.5;
            ctx.stroke();
            
            // 绘制+号
            ctx.strokeStyle = this.plusButton.hovered ? 'rgba(0, 200, 200, 0.6)' : 'rgba(0, 200, 200, 1)';
            ctx.lineWidth = 1.5;
            ctx.lineCap = 'round';
            
            // 水平线
            ctx.beginPath();
            ctx.moveTo(-buttonSize / 4, 0);
            ctx.lineTo(buttonSize / 4, 0);
            ctx.stroke();
            
            // 垂直线
            ctx.beginPath();
            ctx.moveTo(0, -buttonSize / 4);
            ctx.lineTo(0, buttonSize / 4);
            ctx.stroke();
            
            // 恢复状态
            ctx.restore();

            // 绘制提示文字
            this.drawPlusButtonText(ctx, x, y + buttonSize / 2 + 20);
        }

        drawBackpackButton(ctx) {
            if (!this.backpackButtonLoaded || !this.backpackButton) return;

            // 保存当前状态
            ctx.save();

            // 背包按钮位置（右上角）
            const buttonX = WIDTH - 100; // 距离右边100像素
            const buttonY = 50; // 距离顶部50像素
            const buttonSize = 80; // 按钮尺寸

            // 应用悬停动画效果
            let currentScale = this.backpackButtonScale;
            let currentY = this.backpackButtonY;

            if (this.backpackButtonHovered) {
                currentScale = 1.1;
                currentY = -3;
            } else {
                // 平滑过渡回原始状态
                currentScale = 1.0;
                currentY = 0;
            }

            // 更新状态
            this.backpackButtonScale = currentScale;
            this.backpackButtonY = currentY;

            ctx.translate(buttonX, buttonY + currentY);
            ctx.scale(currentScale, currentScale);

            // 绘制按钮背景（与绘制图标风格一致）
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.beginPath();
            ctx.arc(0, 0, buttonSize / 2, 0, Math.PI * 2);
            ctx.fill();

            // 绘制按钮边框
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.lineWidth = 2;
            ctx.stroke();

            // 绘制背包图标
            if (this.backpackButton && this.backpackButton.complete) {
                const scale = (buttonSize - 20) / Math.max(this.backpackButton.width, this.backpackButton.height);
                const scaledWidth = this.backpackButton.width * scale;
                const scaledHeight = this.backpackButton.height * scale;

                ctx.drawImage(
                    this.backpackButton,
                    -scaledWidth / 2,
                    -scaledHeight / 2,
                    scaledWidth,
                    scaledHeight
                );
            }

            // 恢复状态
            ctx.restore();
            
            // 绘制B键位提示
            this.drawBKeyHint(ctx, buttonX, buttonY + buttonSize / 2 + 20);
        }

        drawRulesButton(ctx) {
            // 保存当前状态
            ctx.save();

            // 规则按钮位置（左上角）
            const buttonX = 100; // 距离左边100像素（原50+50）
            const buttonY = 50; // 距离顶部50像素
            const buttonSize = 50; // 按钮尺寸

            // 应用jello-vertical动画效果
            let currentScaleX = 1.0;
            let currentScaleY = 1.0;
            let currentRotation = 0;

            if (this.rulesButtonHovered) {
                // 实现jello-vertical动画的关键帧效果
                const animationTime = (Date.now() - this.rulesButtonHoverStartTime) / 700; // 0.7秒动画
                
                if (animationTime < 1) {
                    // 根据动画时间计算变换
                    if (animationTime < 0.3) {
                        // 0-30%: scale3d(0.75, 1.25, 1)
                        const progress = animationTime / 0.3;
                        currentScaleX = 1.0 - (0.25 * progress);
                        currentScaleY = 1.0 + (0.25 * progress);
                    } else if (animationTime < 0.4) {
                        // 30-40%: scale3d(1.25, 0.75, 1)
                        const progress = (animationTime - 0.3) / 0.1;
                        currentScaleX = 0.75 + (0.5 * progress);
                        currentScaleY = 1.25 - (0.5 * progress);
                    } else if (animationTime < 0.5) {
                        // 40-50%: scale3d(0.85, 1.15, 1)
                        const progress = (animationTime - 0.4) / 0.1;
                        currentScaleX = 1.25 - (0.4 * progress);
                        currentScaleY = 0.75 + (0.4 * progress);
                    } else if (animationTime < 0.65) {
                        // 50-65%: scale3d(1.05, 0.95, 1)
                        const progress = (animationTime - 0.5) / 0.15;
                        currentScaleX = 0.85 + (0.2 * progress);
                        currentScaleY = 1.15 - (0.2 * progress);
                    } else if (animationTime < 0.75) {
                        // 65-75%: scale3d(0.95, 1.05, 1)
                        const progress = (animationTime - 0.65) / 0.1;
                        currentScaleX = 1.05 - (0.1 * progress);
                        currentScaleY = 0.95 + (0.1 * progress);
                    } else {
                        // 75-100%: scale3d(1, 1, 1)
                        const progress = (animationTime - 0.75) / 0.25;
                        currentScaleX = 0.95 + (0.05 * progress);
                        currentScaleY = 1.05 - (0.05 * progress);
                    }
                } else {
                    // 动画完成，恢复原始状态
                    currentScaleX = 1.0;
                    currentScaleY = 1.0;
                }
            }

            ctx.translate(buttonX, buttonY);
            ctx.scale(currentScaleX, currentScaleY);

            // 绘制按钮背景（渐变效果）
            const gradient = ctx.createLinearGradient(-25, -25, 25, 25);
            gradient.addColorStop(0, '#ffe53b');
            gradient.addColorStop(0.74, '#ff2525');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(0, 0, buttonSize / 2, 0, Math.PI * 2);
            ctx.fill();

            // 绘制按钮边框
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.lineWidth = 2;
            ctx.stroke();

            // 绘制问号图标
            ctx.fillStyle = 'white';
            ctx.font = 'bold 20px "SimSun", "宋体", serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('?', 0, 0);

            // 恢复状态
            ctx.restore();

            // 绘制tooltip提示
            if (this.rulesButtonHovered) {
                this.drawRulesTooltip(ctx, buttonX, buttonY);
            }
        }

        drawPaintIcons(ctx) {
            if (!this.paintIcons.loaded) return;

            // 规则提示按钮位置
            const rulesButtonX = 100;
            const rulesButtonY = 50;
            const rulesButtonSize = 50;

            // 颜料图标起始位置（规则提示按钮右侧30像素）
            const startX = rulesButtonX + rulesButtonSize + 30;
            const iconY = rulesButtonY - 20; // 向上移动20像素
            const iconSize = this.paintIcons.iconSize;
            const spacing = this.paintIcons.spacing;

            // 绘制5个颜料图标
            for (let i = 0; i < this.paintIcons.images.length; i++) {
                const iconX = startX + i * (iconSize + spacing);
                
                // 绘制颜料图片（透明背景）
                if (this.paintIcons.images[i]) {
                    ctx.drawImage(
                        this.paintIcons.images[i],
                        iconX,
                        iconY,
                        iconSize,
                        iconSize
                    );
                }

                // 绘制点数
                ctx.fillStyle = '#333';
                ctx.font = 'bold 12px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'top';
                ctx.fillText(
                    this.paintIcons.points[i].toString(),
                    iconX + iconSize / 2,
                    iconY + iconSize + 5
                );
            }
        }

        drawLevelInfo(ctx) {
            // 绘制等级信息（规则按钮下方30像素处）
            const rulesButtonX = 100; // 规则按钮X位置
            const rulesButtonY = 50; // 规则按钮Y位置
            const rulesButtonSize = 50; // 规则按钮尺寸
            
            const levelX = rulesButtonX; // 与规则按钮水平对齐
            const levelY = rulesButtonY + rulesButtonSize / 2 + 30; // 规则按钮下方30像素
            
            // 保存当前状态
            ctx.save();
            
            // 应用0.7倍缩放
            ctx.scale(0.7, 0.7);
            
            // 调整坐标以适应缩放
            const scaledLevelX = levelX / 0.7;
            const scaledLevelY = levelY / 0.7;
            
            // 绘制背景
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(scaledLevelX - 100, scaledLevelY - 20, 200, 40);
            
            // 绘制边框
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.lineWidth = 2;
            ctx.strokeRect(scaledLevelX - 100, scaledLevelY - 20, 200, 40);
            
            // 绘制等级文字
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 16px "SimSun", "宋体", serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`等级: ${this.playerLevel.level}`, scaledLevelX, scaledLevelY - 5);
            
            // 绘制经验条
            const expBarWidth = 160;
            const expBarHeight = 8;
            const expBarX = scaledLevelX - expBarWidth / 2;
            const expBarY = scaledLevelY + 8;
            
            // 经验条背景
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.fillRect(expBarX, expBarY, expBarWidth, expBarHeight);
            
            // 经验条填充
            const expProgress = this.playerLevel.experience / this.playerLevel.experienceToNext;
            ctx.fillStyle = '#4CAF50';
            ctx.fillRect(expBarX, expBarY, expBarWidth * expProgress, expBarHeight);
            
            // 经验条边框
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.lineWidth = 1;
            ctx.strokeRect(expBarX, expBarY, expBarWidth, expBarHeight);
            
            // 经验值文字
            ctx.fillStyle = '#fff';
            ctx.font = '12px "SimSun", "宋体", serif';
            ctx.fillText(`${this.playerLevel.experience}/${this.playerLevel.experienceToNext}`, scaledLevelX, expBarY + expBarHeight + 12);
            
            // 恢复状态
            ctx.restore();
        }

        drawLevelUpNotification(ctx) {
            if (!this.playerLevel.levelUpNotification.show) return;
            
            // 保存当前状态
            ctx.save();
            
            // 计算显示时间
            const currentTime = Date.now();
            const elapsed = currentTime - this.playerLevel.levelUpNotification.startTime;
            const progress = elapsed / this.playerLevel.levelUpNotification.duration;
            
            if (progress >= 1) {
                this.playerLevel.levelUpNotification.show = false;
                ctx.restore();
                return;
            }
            
            // 计算透明度（淡入淡出效果）
            let alpha = 1;
            if (progress < 0.2) {
                alpha = progress / 0.2; // 前20%时间淡入
            } else if (progress > 0.8) {
                alpha = (1 - progress) / 0.2; // 后20%时间淡出
            }
            
            ctx.globalAlpha = alpha;
            
            // 绘制升级通知（在界面上侧）
            const centerX = WIDTH / 2;
            const centerY = 100; // 显示在界面上侧
            
            // 绘制背景框
            ctx.fillStyle = `rgba(76, 175, 80, ${0.9 * alpha})`;
            ctx.fillRect(centerX - 200, centerY - 40, 400, 80);
            
            // 绘制边框
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.8 * alpha})`;
            ctx.lineWidth = 3;
            ctx.strokeRect(centerX - 200, centerY - 40, 400, 80);
            
            // 绘制升级文字
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 28px "SimSun", "宋体", serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('升级！', centerX, centerY - 10);
            
            // 绘制等级信息
            ctx.font = 'bold 24px "SimSun", "宋体", serif';
            ctx.fillText(`等级 ${this.playerLevel.level}`, centerX, centerY + 20);
            
            // 恢复状态
            ctx.restore();
        }

        drawRulesTooltip(ctx, buttonX, buttonY) {
            // 保存当前状态
            ctx.save();

            // tooltip位置（按钮上方）
            const tooltipX = buttonX;
            const tooltipY = buttonY - 40; // 按钮上方40像素

            // 绘制tooltip背景
            const gradient = ctx.createLinearGradient(tooltipX - 30, tooltipY - 15, tooltipX + 30, tooltipY + 15);
            gradient.addColorStop(0, '#ffe53b');
            gradient.addColorStop(0.74, '#ff2525');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(tooltipX - 30, tooltipY - 15, 60, 30);

            // 绘制tooltip文字
            ctx.fillStyle = 'white';
            ctx.font = 'bold 14px "SimSun", "宋体", serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('FAQ', tooltipX, tooltipY);

            // 绘制tooltip箭头
            ctx.fillStyle = '#ff2525';
            ctx.beginPath();
            ctx.moveTo(tooltipX - 5, tooltipY + 15);
            ctx.lineTo(tooltipX + 5, tooltipY + 15);
            ctx.lineTo(tooltipX, tooltipY + 20);
            ctx.closePath();
            ctx.fill();

            // 恢复状态
            ctx.restore();
        }

        drawRulesNotification(ctx) {
            if (this.rulesNotification.show && this.rulesNotification.images.length > 0) {
                // 保存当前状态
                ctx.save();
                
                // 计算屏幕中心位置
                const centerX = WIDTH / 2;
                const centerY = HEIGHT / 2;
                
                // 绘制半透明背景
                ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                ctx.fillRect(0, 0, WIDTH, HEIGHT);
                
                // 绘制当前规则图片
                const currentImage = this.rulesNotification.images[this.rulesNotification.currentImageIndex];
                if (currentImage) {
                    const imgWidth = currentImage.width;
                    const imgHeight = currentImage.height;
                    const scale = Math.min(WIDTH * 0.8 / imgWidth, HEIGHT * 0.6 / imgHeight); // 减少高度为导航按钮留空间
                    const scaledWidth = imgWidth * scale;
                    const scaledHeight = imgHeight * scale;
                    
                    ctx.drawImage(
                        currentImage,
                        centerX - scaledWidth / 2,
                        centerY - scaledHeight / 2 - 50, // 向上偏移50像素为导航按钮留空间
                        scaledWidth,
                        scaledHeight
                    );
                }
                
                // 绘制退出按钮
                this.drawRulesExitButton(ctx);
                
                // 绘制导航按钮
                this.drawRulesNavigationButtons(ctx, centerX, centerY);
                
                // 恢复状态
                ctx.restore();
            }
        }

        drawRulesExitButton(ctx) {
            // 退出按钮位置（规则窗口右上角）
            const centerX = WIDTH / 2;
            const centerY = HEIGHT / 2;
            
            // 计算规则窗口的位置和尺寸
            const currentImage = this.rulesNotification.images[this.rulesNotification.currentImageIndex];
            if (currentImage) {
                const imgWidth = currentImage.width;
                const imgHeight = currentImage.height;
                const scale = Math.min(WIDTH * 0.8 / imgWidth, HEIGHT * 0.6 / imgHeight);
                const scaledWidth = imgWidth * scale;
                const scaledHeight = imgHeight * scale;
                
                // 规则窗口的位置
                const windowX = centerX - scaledWidth / 2;
                const windowY = centerY - scaledHeight / 2 - 50;
                
                // 退出按钮位置（规则窗口右上角）
                const buttonWidth = 60;
                const buttonHeight = 30;
                const buttonX = windowX + scaledWidth - buttonWidth - 20 - 70; // 距离窗口右边20像素，再向左70像素
                const buttonY = windowY + 20 + 30; // 距离窗口顶部20像素，再向下30像素
                
                this.drawRulesNavButton(ctx, 
                    buttonX, 
                    buttonY, 
                    buttonWidth, 
                    buttonHeight, 
                    '退出', 
                    this.rulesNotification.exitButtonHovered
                );
            }
        }

        drawRulesNavigationButtons(ctx, centerX, centerY) {
            // 按钮位置（图片下方）
            const buttonY = centerY + 200; // 图片下方200像素
            const buttonWidth = 60;
            const buttonHeight = 30;
            const buttonSpacing = 20;
            
            // 绘制<按钮
            this.drawRulesNavButton(ctx, 
                centerX - buttonWidth - buttonSpacing / 2, 
                buttonY, 
                buttonWidth, 
                buttonHeight, 
                '<', 
                this.rulesNotification.prevButtonHovered
            );
            
            // 绘制>按钮
            this.drawRulesNavButton(ctx, 
                centerX + buttonSpacing / 2, 
                buttonY, 
                buttonWidth, 
                buttonHeight, 
                '>', 
                this.rulesNotification.nextButtonHovered
            );
        }

        drawRulesNavButton(ctx, x, y, width, height, text, hovered) {
            // 保存当前状态
            ctx.save();
            
            // 应用悬停动画效果
            let currentScale = 1.0;
            if (hovered) {
                currentScale = 0.96; // 点击时的缩放效果
            }
            
            ctx.translate(x + width / 2, y + height / 2);
            ctx.scale(currentScale, currentScale);
            
            // 绘制按钮背景（参考装备按钮样式）
            ctx.fillStyle = '#E1B65E';
            ctx.beginPath();
            ctx.roundRect(-width / 2, -height / 2, width, height, 6);
            ctx.fill();
            
            // 绘制边框
            ctx.strokeStyle = '#E1B65E';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // 绘制文字
            ctx.fillStyle = '#fff';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(text, 0, 0);
            
            // 恢复状态
            ctx.restore();
        }

        drawPlusButtonText(ctx, x, y) {
            // 保存当前状态
            ctx.save();
            
            // 绘制文字
            ctx.fillStyle = 'black';
            ctx.font = 'bold 14px "SimSun", "宋体", serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('请选择笔绘对象', x, y);
            
            // 恢复状态
            ctx.restore();
        }

        drawSelectedItem(ctx, centerX, centerY) {
            if (!this.selectedItem || !this.selectedItem.image) return;
            
            const x = centerX;
            const y = centerY;
            const itemSize = 180; // 道具尺寸放大3倍（60 * 3）
            
            // 保存当前状态
            ctx.save();
            
            // 设置透明度为50%
            ctx.globalAlpha = 0.5;
            
            // 绘制道具图片
            const img = this.selectedItem.image;
            const scale = itemSize / Math.max(img.width, img.height);
            const scaledWidth = img.width * scale;
            const scaledHeight = img.height * scale;
            
            ctx.drawImage(
                img,
                x - scaledWidth / 2,
                y - scaledHeight / 2,
                scaledWidth,
                scaledHeight
            );
            
            // 恢复透明度
            ctx.globalAlpha = 1.0;
            
            // 绘制道具信息
            this.drawItemInfo(ctx, x, y + itemSize / 2 + 20);
            
            // 恢复状态
            ctx.restore();
        }

        drawItemInfo(ctx, x, y) {
            // 保存当前状态
            ctx.save();
            
            // 绘制道具名称
            ctx.fillStyle = 'black';
            ctx.font = 'bold 14px "SimSun", "宋体", serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.selectedItem.name, x, y - 5);
            
            // 绘制颜料点数（1.5倍行间距）
            ctx.font = 'bold 12px "SimSun", "宋体", serif';
            const lineHeight = 12 * 1.5; // 1.5倍行间距
            ctx.fillText(`所需颜料点数: ${this.selectedItem.paintPoints}`, x, y - 5 + lineHeight);
            
            // 恢复状态
            ctx.restore();
        }

        drawQuantityInput(ctx, centerX, centerY) {
            const scale = 0.9; // 缩小至0.9倍
            const inputWidth = 180 * scale; // 200 * 0.9
            const inputHeight = 45 * scale; // 50 * 0.9
            const buttonWidth = 20 * scale; // 20 * 0.9
            const buttonHeight = inputHeight;
            const middleInputWidth = (inputWidth - 2 * buttonWidth) / 2; // 中间输入框宽度缩小一倍
            const iconSize = 60 * scale; // 图标尺寸，与画轴上侧颜料图标保持一致
            const spacing = 5 * scale; // 缩小间距
            
            const x = centerX - inputWidth / 2;
            const y = centerY - inputHeight / 2;
            
            // 保存当前状态
            ctx.save();
            
            // 绘制左侧颜料图标
            const paintIconX = x - iconSize - spacing;
            const paintIconY = y + (inputHeight - iconSize) / 2;
            this.drawPaintIcon(ctx, paintIconX, paintIconY, iconSize);
            
            // 绘制-按钮（左侧）
            const minusX = x;
            const minusY = y;
            this.drawQuantityButtonNew(ctx, minusX, minusY, buttonWidth, buttonHeight, '-', this.quantityInput.minusButton);
            
            // 绘制输入框（中间，居中）
            const inputX = x + buttonWidth + (inputWidth - 2 * buttonWidth - middleInputWidth) / 2;
            const inputY = y;
            this.drawQuantityInputFieldNew(ctx, inputX, inputY, middleInputWidth, inputHeight);
            
            // 绘制+按钮（右侧）
            const plusX = x + inputWidth - buttonWidth;
            const plusY = y;
            this.drawQuantityButtonNew(ctx, plusX, plusY, buttonWidth, buttonHeight, '+', this.quantityInput.plusButton);
            
            // 绘制毛笔按钮（+号右侧）
            const brushX = x + inputWidth + spacing;
            const brushY = y + (inputHeight - iconSize) / 2;
            this.drawBrushButton(ctx, brushX, brushY, iconSize);
            
            // 恢复状态
            ctx.restore();
        }

        drawQuantityButtonNew(ctx, x, y, width, height, text, buttonState) {
            // 保存当前状态
            ctx.save();
            
            // 绘制圆角矩形背景
            const radius = 10;
            ctx.fillStyle = buttonState.hovered ? '#ffffff' : '#f3f3f3';
            ctx.beginPath();
            ctx.roundRect(x, y, width, height, radius);
            ctx.fill();
            
            // 绘制边框
            if (buttonState.hovered) {
                ctx.strokeStyle = '#4a9dec';
                ctx.lineWidth = 2;
                ctx.stroke();
                
                // 绘制阴影效果
                ctx.shadowColor = 'rgba(74, 157, 236, 0.2)';
                ctx.shadowBlur = 7;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
                ctx.stroke();
                ctx.shadowColor = 'transparent';
                ctx.shadowBlur = 0;
            } else {
                ctx.strokeStyle = 'transparent';
                ctx.lineWidth = 2;
                ctx.stroke();
            }
            
            // 绘制按钮文字
            ctx.fillStyle = '#000';
            ctx.font = 'bold 14px "Courier New", monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(text, x + width/2, y + height/2);
            
            // 恢复状态
            ctx.restore();
        }

        drawPaintIcon(ctx, x, y, size) {
            if (!this.paintIconLoaded || !this.paintIcon) return;
            
            // 保存当前状态
            ctx.save();
            
            // 根据选中的颜料颜色绘制不同图标
            let iconToDraw = this.paintIcon;
            if (this.selectedPaintColor) {
                // 根据选中的颜色选择对应的颜料图标
                switch (this.selectedPaintColor) {
                    case 'yellow':
                        iconToDraw = this.drawingButtons.yellow.image;
                        break;
                    case 'green':
                        iconToDraw = this.drawingButtons.green.image;
                        break;
                    case 'blue':
                        iconToDraw = this.drawingButtons.blue.image;
                        break;
                    case 'red':
                        iconToDraw = this.drawingButtons.red.image;
                        break;
                    case 'brown':
                        iconToDraw = this.drawingButtons.brown.image;
                        break;
                }
            }
            
            if (iconToDraw && iconToDraw.complete) {
                // 确保图标尺寸固定为指定大小，不根据原图尺寸缩放
                const targetSize = size; // 使用固定的目标尺寸
                const scale = targetSize / Math.max(iconToDraw.width, iconToDraw.height);
                const scaledWidth = iconToDraw.width * scale;
                const scaledHeight = iconToDraw.height * scale;
                
                // 居中绘制，确保所有图标都是相同尺寸
                ctx.drawImage(
                    iconToDraw,
                    x + (targetSize - scaledWidth) / 2,
                    y + (targetSize - scaledHeight) / 2,
                    scaledWidth,
                    scaledHeight
                );
            }
            
            // 恢复状态
            ctx.restore();
        }

        drawBrushButton(ctx, x, y, size) {
            if (!this.brushButtonLoaded || !this.brushButton) return;
            
            // 保存当前状态
            ctx.save();
            
            // 应用悬停效果
            let currentScale = 1.0;
            let currentY = y;
            
            if (this.brushButtonHovered) {
                currentScale = 1.1;
                currentY = y - 3;
            }
            
            ctx.translate(x + size/2, currentY + size/2);
            ctx.scale(currentScale, currentScale);
            
            // 绘制按钮背景（透明背景）
            ctx.fillStyle = 'transparent';
            ctx.beginPath();
            ctx.roundRect(-size/2, -size/2, size, size, 10);
            ctx.fill();
            
            // 绘制按钮边框（透明边框，无蓝色线框）
            ctx.strokeStyle = 'transparent';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // 绘制毛笔图标
            if (this.brushButton && this.brushButton.complete) {
                const scale = size / Math.max(this.brushButton.width, this.brushButton.height);
                const scaledWidth = this.brushButton.width * scale;
                const scaledHeight = this.brushButton.height * scale;
                
                ctx.drawImage(
                    this.brushButton,
                    -scaledWidth / 2,
                    -scaledHeight / 2,
                    scaledWidth,
                    scaledHeight
                );
            }
            
            // 恢复状态
            ctx.restore();
        }

        drawQuantityInputFieldNew(ctx, x, y, width, height) {
            // 保存当前状态
            ctx.save();
            
            // 绘制圆角矩形背景
            const radius = 10;
            ctx.fillStyle = '#f3f3f3';
            ctx.beginPath();
            ctx.roundRect(x, y, width, height, radius);
            ctx.fill();
            
            // 绘制边框（透明边框，悬停时显示）
            ctx.strokeStyle = 'transparent';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // 绘制数量文字
            ctx.fillStyle = '#000';
            ctx.font = 'bold 14px "Courier New", monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.quantityInput.value.toString(), x + width/2, y + height/2);
            
            // 恢复状态
            ctx.restore();
        }

        drawQuantityInputField(ctx, x, y, width, height) {
            // 保存当前状态
            ctx.save();
            
            // 绘制输入框背景
            ctx.fillStyle = '#fff';
            ctx.fillRect(x, y, width, height);
            
            // 绘制输入框边框（只有上下边框）
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 1;
            // 上边框
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + width, y);
            ctx.stroke();
            // 下边框
            ctx.beginPath();
            ctx.moveTo(x, y + height);
            ctx.lineTo(x + width, y + height);
            ctx.stroke();
            
            // 绘制数量文字
            ctx.fillStyle = '#000';
            ctx.font = 'bold 16px "Courier New", monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.quantityInput.value.toString(), x + width/2, y + height/2);
            
            // 恢复状态
            ctx.restore();
        }

        drawQuantityButton(ctx, x, y, size, text, buttonState) {
            // 保存当前状态
            ctx.save();
            
            // 应用悬停效果
            let currentScale = 1.0;
            let currentY = y;
            
            if (buttonState.hovered) {
                currentScale = 1.1;
                currentY = y - 3;
            }
            
            ctx.translate(x, currentY);
            ctx.scale(currentScale, currentScale);
            
            // 绘制按钮背景
            ctx.fillStyle = '#fff';
            ctx.fillRect(-size/2, -size/2, size, size);
            
            // 绘制按钮边框
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 3;
            ctx.strokeRect(-size/2, -size/2, size, size);
            
            // 绘制阴影
            ctx.fillStyle = '#000';
            ctx.fillRect(-size/2 + 4, -size/2 + 4, size, size);
            ctx.fillStyle = '#fff';
            ctx.fillRect(-size/2, -size/2, size, size);
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 3;
            ctx.strokeRect(-size/2, -size/2, size, size);
            
            // 绘制按钮文字
            ctx.fillStyle = '#000';
            ctx.font = 'bold 20px "Courier New", monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(text, 0, 0);
            
            // 恢复状态
            ctx.restore();
        }

        drawDrawingButtons(ctx, centerX, centerY) {
            const buttonOrder = ['yellow', 'green', 'blue', 'red', 'brown'];
            const buttonSpacing = 90; // 按钮之间的间距（60 * 1.5）
            const startX = centerX - (buttonOrder.length - 1) * buttonSpacing / 2;
            const buttonY = centerY - 255; // 在画轴中心上方255像素处（220 - 475）

            buttonOrder.forEach((buttonKey, index) => {
                const button = this.drawingButtons[buttonKey];
                if (button.loaded && button.image) {
                    const buttonX = startX + index * buttonSpacing;
                    this.drawSingleDrawingButton(ctx, button, buttonX, buttonY, buttonKey);
                }
            });
        }

        drawSingleDrawingButton(ctx, button, x, y, buttonKey) {
            const imgWidth = button.image.width;
            const imgHeight = button.image.height;
            let buttonSize = 60; // 按钮尺寸（40 * 1.5）
            
            // 所有按钮大小一致
            // if (buttonKey === 'blue') {
            //     buttonSize = 81; // 60 * 1.5 * 0.9 = 81
            // }
            
            const scale = buttonSize / Math.max(imgWidth, imgHeight);
            const scaledWidth = imgWidth * scale;
            const scaledHeight = imgHeight * scale;

            // 应用悬停动画效果
            let currentScale = button.scale;
            let currentY = button.y;

            if (button.hovered) {
                // 悬停时的动画效果：缩放1.1倍并向上移动3像素
                currentScale = 1.1;
                currentY = -3;
            } else {
                // 平滑过渡回原始状态
                currentScale = 1.0;
                currentY = 0;
            }

            // 保存当前状态
            ctx.save();

            // 应用变换
            ctx.translate(x, y + currentY);
            ctx.scale(currentScale, currentScale);

            // 绘制按钮
            ctx.drawImage(
                button.image,
                -scaledWidth / 2,
                -scaledHeight / 2,
                scaledWidth,
                scaledHeight
            );

            // 恢复状态
            ctx.restore();
        }

        drawDrawIcon(ctx) {
            if (!this.drawIconLoaded || !this.drawIcon) return;

            // 计算图标位置
            const origin = project(DRAW_ICON_POSITION_I, DRAW_ICON_POSITION_J);
            const imgWidth = this.drawIcon.width;
            const imgHeight = this.drawIcon.height;
            
            // 计算缩放比例
            const scale = DRAW_ICON_SIZE / Math.max(imgWidth, imgHeight);
            const scaledWidth = imgWidth * scale;
            const scaledHeight = imgHeight * scale;
            
            // 应用悬停动画效果
            const time = this.animationTime * 0.001;
            let currentScale = this.drawIconScale;
            let currentY = this.drawIconY;
            
            if (this.drawIconHovered) {
                // 悬停时的动画效果：缩放1.1倍并向上移动3像素
                currentScale = 1.1;
                currentY = -3;
            } else {
                // 平滑过渡回原始状态
                currentScale = 1.0;
                currentY = 0;
            }
            
            // 保存当前状态
            ctx.save();
            
            // 应用变换
            ctx.translate(origin.x, origin.y + currentY);
            ctx.scale(currentScale, currentScale);
            
            // 绘制图标
            ctx.drawImage(
                this.drawIcon,
                -scaledWidth / 2,
                -scaledHeight / 2,
                scaledWidth,
                scaledHeight
            );
            
            // 恢复状态
            ctx.restore();
            
            // 绘制E键位提示
            this.drawEKeyHint(ctx, origin.x, origin.y + scaledHeight / 2 + 10);
        }

        drawEKeyHint(ctx, x, y) {
            // 保存当前状态
            ctx.save();
            
            // 绘制E键背景
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(x - 15, y - 10, 30, 20);
            
            // 绘制E键边框
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.lineWidth = 2;
            ctx.strokeRect(x - 15, y - 10, 30, 20);
            
            // 绘制E键文字
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.font = 'bold 14px "SimSun", "宋体", serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('E', x, y);
            
            // 恢复状态
            ctx.restore();
        }

        drawBKeyHint(ctx, x, y) {
            // 保存当前状态
            ctx.save();
            
            // 绘制B键背景
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(x - 15, y - 10, 30, 20);
            
            // 绘制B键边框
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.lineWidth = 2;
            ctx.strokeRect(x - 15, y - 10, 30, 20);
            
            // 绘制B键文字
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.font = 'bold 14px "SimSun", "宋体", serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('B', x, y);
            
            // 恢复状态
            ctx.restore();
        }

        drawButton(ctx, button, index) {
            const x = button.x;
            const y = button.y;
            const width = BUTTON_SIZE;
            const height = 50;
            const time = this.animationTime * 0.001; // 时间用于动画

            // 保存当前状态
            ctx.save();

            // 绘制按钮阴影
            ctx.fillStyle = 'rgba(254, 193, 149, 0.3)';
            ctx.fillRect(x - width/2 + 3, y - height/2 + 3, width, height);

            // 绘制按钮背景
            if (button.isHovered) {
                ctx.fillStyle = 'rgba(254, 193, 149, 0.1)';
                ctx.fillRect(x - width/2, y - height/2, width, height);
                
                // 绘制发光效果
                ctx.strokeStyle = 'rgba(254, 193, 149, 0.8)';
                ctx.lineWidth = 4;
                ctx.strokeRect(x - width/2 - 2, y - height/2 - 2, width + 4, height + 4);
            } else {
                ctx.fillStyle = 'rgba(254, 193, 149, 0.9)';
                ctx.fillRect(x - width/2, y - height/2, width, height);
            }

            // 绘制按钮边框
            ctx.strokeStyle = 'rgba(254, 193, 149, 1)';
            ctx.lineWidth = 3;
            ctx.strokeRect(x - width/2, y - height/2, width, height);

            // 绘制星星动画
            this.drawStars(ctx, x, y, width, height, time, button);

            // 绘制按钮文字（宋体）
            ctx.fillStyle = button.isHovered ? 'rgba(254, 193, 149, 1)' : 'rgba(24, 24, 24, 1)';
            ctx.font = 'bold 17px "SimSun", "宋体", serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // 根据按钮索引和状态显示不同文字
            let buttonText = '查看';
            if (index === 0 && this.canClearBamboo) {
                buttonText = '清除';
                console.log('第一个按钮显示为清除，canClearBamboo:', this.canClearBamboo, 'index:', index);
            }
            
            ctx.fillText(buttonText, x, y);

            // 恢复状态
            ctx.restore();
        }

        drawStars(ctx, x, y, width, height, time, button) {
            // 星星路径数据
            const starPath = "M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z";
            
            // 星星配置
            const stars = [
                { size: 25, x: 0.2, y: 0.2, delay: 0 },
                { size: 15, x: 0.45, y: 0.45, delay: 0.2 },
                { size: 5, x: 0.4, y: 0.4, delay: 0.4 },
                { size: 8, x: 0.2, y: 0.4, delay: 0.1 },
                { size: 15, x: 0.25, y: 0.45, delay: 0.3 },
                { size: 5, x: 0.5, y: 0.05, delay: 0.5 }
            ];

            stars.forEach((star, index) => {
                const starX = x - width/2 + star.x * width;
                const starY = y - height/2 + star.y * height;
                const starSize = star.size * 0.3; // 缩放星星大小
                
                // 悬停时的动画效果
                let finalX = starX;
                let finalY = starY;
                let opacity = 0.3;
                
                if (button.isHovered) {
                    const animationTime = (time + star.delay) % 2; // 2秒循环
                    const progress = Math.min(animationTime, 1);
                    
                    // 星星飞散效果
                    const angle = (index * 60) * Math.PI / 180; // 每个星星不同角度
                    const distance = 30 * progress;
                    finalX = starX + Math.cos(angle) * distance;
                    finalY = starY + Math.sin(angle) * distance;
                    opacity = 0.8 + 0.2 * Math.sin(time * 5 + star.delay);
                }

                // 绘制星星
                ctx.save();
                ctx.translate(finalX, finalY);
                ctx.scale(starSize / 392.05, starSize / 392.05); // 根据星星大小缩放
                
                ctx.fillStyle = `rgba(255, 253, 239, ${opacity})`;
                ctx.beginPath();
                this.drawStarPath(ctx, starPath);
                ctx.fill();
                
                ctx.restore();
            });
        }

        drawStarPath(ctx, pathData) {
            // 简化的星星路径绘制
            const path = new Path2D(pathData);
            ctx.fill(path);
        }

        handleClick(clickX, clickY) {
            // 如果笔绘结果正在显示，点击任意位置关闭
            if (this.drawingResult.show) {
                this.drawingResult.show = false;
                console.log('关闭笔绘结果显示，canClearBamboo:', this.canClearBamboo);
                
                // 显示清除图表并关闭画轴
                this.showClearChart = true;
                this.showHuazhou = false;
                console.log('显示清除图表，关闭画轴界面');
                
                return true;
            }

            // 如果颜料点数奖励提示正在显示，点击任意位置关闭
            if (this.paintPointsReward.show) {
                this.paintPointsReward.show = false;
                this.paintPointsReward.fadeOut.active = false;
                console.log('关闭颜料点数奖励提示');
                
                // 立即显示哭泣图表和NPC跑动UI
                this.showCryingChart = true;
                this.showNpcPao = true;
                console.log('立即显示哭泣图表和NPC跑动UI');
                
                return true;
            }

            // 如果新奖励提示正在显示，点击任意位置关闭
            if (this.rewardNotification.show) {
                this.rewardNotification.show = false;
                this.rewardNotification.fadeOut.active = false;
                console.log('关闭新奖励提示');
                console.log('检查延迟升级通知状态:', this.playerLevel.delayedLevelUpNotification);
                
                // 如果有延迟的升级通知，现在显示
                if (this.playerLevel.delayedLevelUpNotification) {
                    console.log('准备显示延迟的升级通知');
                    setTimeout(() => {
                        this.showLevelUpNotification();
                        this.playerLevel.delayedLevelUpNotification = false;
                        console.log('显示延迟的升级通知');
                    }, 500); // 0.5秒后显示升级通知
                } else {
                    console.log('没有延迟的升级通知需要显示');
                }
                
                // 立即显示Keep Going图片
                this.showKeepGoingImage();
                
                return true;
            }

            // 如果Keep Going图片正在显示，点击任意位置关闭
            if (this.keepGoingImage.show) {
                this.keepGoingImage.show = false;
                console.log('关闭Keep Going图片');
                return true;
            }

            // 如果规则提示正在显示，检查按钮点击
            if (this.rulesNotification.show) {
                // 检查退出按钮点击
                if (this.checkRulesExitButtonClick(clickX, clickY)) {
                    this.rulesNotification.show = false;
                    this.rulesNotification.fadeOut.active = false;
                    console.log('点击退出按钮关闭规则提示');
                    // 开始开场音乐淡出
                    startStartMusicFadeOut();
                    return true;
                }
                
                // 检查<按钮点击
                if (this.checkRulesPrevButtonClick(clickX, clickY)) {
                    this.prevRulesImage();
                    return true;
                }
                
                // 检查>按钮点击
                if (this.checkRulesNextButtonClick(clickX, clickY)) {
                    this.nextRulesImage();
                    return true;
                }
                
                // 点击其他位置不关闭（只有点击退出按钮才能关闭）
                return true;
            }

            // 如果雨聊天图片序列正在显示，点击任意位置切换到下一张
            if (this.yuChatSequence.show) {
                this.nextYuChatImage();
                return true;
            }

            // 如果背包界面正在显示，检查标签按钮和道具点击
            if (this.showBackpack) {
                // 检查标签按钮点击
                const clickedTab = this.checkTabButtonClick(clickX, clickY);
                if (clickedTab) {
                    console.log(`点击了标签按钮: ${clickedTab}`);
                    this.activeTab = clickedTab;
                    return true;
                }
                
                // 检查装备按钮点击（不切换页签）
                if (this.checkEquipmentButtonClick(clickX, clickY)) {
                    return true;
                }
                
                // 检查退出按钮点击
                if (this.checkBackpackExitButtonClick(clickX, clickY)) {
                    this.showBackpack = false;
                    console.log('点击退出按钮关闭背包界面');
                    return true;
                }
                
                // 检查道具点击
                const clickedItem = this.checkBackpackItemClick(clickX, clickY);
                if (clickedItem) {
                    console.log(`点击了背包中的${clickedItem}道具`);
                    if (this.activeTab === 'drawing') {
                        // 笔绘对象页签：选择道具并关闭背包
                        this.selectItemForCanvas(clickedItem);
                        this.showBackpack = false;
                    } else if (this.activeTab === 'items') {
                        // 道具页签：选中道具（不关闭背包）
                        this.selectedBackpackItem = clickedItem;
                        console.log(`选中道具: ${clickedItem}`);
                    }
                    return true;
                }

                // 点击背包区域其他位置不关闭背包，需要点击退出按钮才能关闭
                return true;
            }

            // 如果清除道具选择背包界面正在显示，检查道具点击
            if (this.showClearBackpack) {
                const clickedItem = this.checkClearBackpackItemClick(clickX, clickY);
                if (clickedItem) {
                    console.log(`选择了清除道具: ${clickedItem}`);
                    this.startClearProcess(clickedItem);
                    this.showClearBackpack = false; // 关闭清除背包界面
                    return true;
                }

                // 点击其他位置关闭清除背包
                this.showClearBackpack = false;
                console.log('关闭清除道具选择背包界面');
                return true;
            }

            // 如果清除图表正在显示，点击任意位置关闭
            if (this.showClearChart) {
                this.showClearChart = false;
                console.log('关闭清除图表');
                return true;
            }

            // 如果哭泣图表正在显示，点击任意位置关闭
            if (this.showCryingChart) {
                this.showCryingChart = false;
                // 激活NPC交互区域
                this.npcInteractionArea.active = true;
                console.log('关闭哭泣图表，激活NPC交互区域');
                return true;
            }

            // 如果门图表正在显示，点击任意位置关闭
            if (this.showMenChart) {
                this.showMenChart = false;
                console.log('关闭门图表');
                return true;
            }

            // 检查NPC查看按钮点击
            if (this.npcViewButton.show) {
                try {
                    const x = this.npcViewButton.x;
                    const y = this.npcViewButton.y;
                    const width = BUTTON_SIZE;
                    const height = 50;
                    
                    // 使用矩形检测，与第一个按钮一致
                        if (clickX >= x - width/2 && clickX <= x + width/2 &&
                            clickY >= y - height/2 && clickY <= y + height/2) {
                            console.log('点击了NPC查看按钮');
                            
                            if (!this.npcViewButton.firstInteractionCompleted) {
                                // 第一次点击：显示门图表
                                this.showMenChart = true;
                                this.menChartShown = true; // 标记门图表已显示
                                this.npcViewButton.firstInteractionCompleted = true;
                                console.log('显示门图表，图片加载状态:', this.menChartLoaded);
                            } else {
                                // 第二次点击：显示破除逻辑
                                console.log('点击了破除按钮');
                                // 永久隐藏按钮
                                this.npcViewButton.show = false;
                                this.npcViewButton.permanentlyHidden = true;
                                // 显示属性相克UI并播放斧头砍下动画
                                this.showShuxingxiangkeUI();
                                this.startAxeAnimation();
                            }
                            return true;
                        }
                } catch (error) {
                    console.error('NPC查看按钮点击处理错误:', error);
                }
            }

            // 如果画轴图片正在显示，检查各种按钮点击
            if (this.showHuazhou) {
                // 检查数量按钮点击
                const quantityButton = this.checkQuantityButtonClick(clickX, clickY);
                if (quantityButton) {
                    if (quantityButton === 'plus' && this.quantityInput.value < this.quantityInput.max) {
                        this.quantityInput.value++;
                        console.log('数量增加到:', this.quantityInput.value);
                    } else if (quantityButton === 'minus' && this.quantityInput.value > this.quantityInput.min) {
                        this.quantityInput.value--;
                        console.log('数量减少到:', this.quantityInput.value);
                    }
                    return true;
                }
                
                if (this.checkPlusButtonClick(clickX, clickY)) {
                    console.log('点击了+号按钮，显示背包界面');
                    this.showBackpack = true;
                    return true;
                }
                
                // 检查毛笔按钮点击
                if (this.checkBrushButtonClick(clickX, clickY)) {
                    console.log('点击了毛笔按钮');
                    // 先进行笔绘判定
                    if (this.checkDrawingRequirements()) {
                        // 开始播放绘制动画
                        this.startDrawingAnimation();
                    }
                    return true;
                }
                
                // 检查绘制按钮点击
                const clickedButton = this.checkDrawingButtonClick(clickX, clickY);
                if (clickedButton) {
                    console.log(`点击了${clickedButton}绘制按钮`);
                    // 设置选中的颜料颜色
                    this.selectedPaintColor = clickedButton;
                    console.log(`选中颜料颜色: ${clickedButton}`);
                    return true;
                }
                
                // 检查退出按钮点击
                if (this.checkHuazhouExitButtonClick(clickX, clickY)) {
                    this.showHuazhou = false;
                    console.log('点击退出按钮关闭画轴界面');
                    return true;
                }
                
                // 点击画轴区域其他位置不关闭画轴，需要点击退出按钮才能关闭
                return true;
            }

            // 如果斧头图表正在显示，点击任意位置关闭图表
            if (this.showChartFutou) {
                this.showChartFutou = false;
                console.log('关闭斧头图表显示');
                return true;
            }

            // 如果斧头信息图片正在显示，点击任意位置关闭并立即显示斧头图表
            if (this.showFutouInfo) {
                this.showFutouInfo = false;
                this.showChartFutou = true;
                console.log('关闭斧头信息图片，显示斧头图表');
                return true;
            }

            // 如果竹子图表正在显示，点击任意位置关闭图表
            if (this.showChart) {
                this.showChart = false;
                console.log('关闭竹子图表显示');
                return true;
            }


            // 检查绘制图标点击
            if (this.drawIconLoaded && this.drawIcon) {
                const origin = project(DRAW_ICON_POSITION_I, DRAW_ICON_POSITION_J);
                const imgWidth = this.drawIcon.width;
                const imgHeight = this.drawIcon.height;
                const scale = DRAW_ICON_SIZE / Math.max(imgWidth, imgHeight);
                const scaledWidth = imgWidth * scale;
                const scaledHeight = imgHeight * scale;
                
                // 检查是否点击了绘制图标
                if (clickX >= origin.x - scaledWidth/2 && clickX <= origin.x + scaledWidth/2 &&
                    clickY >= origin.y - scaledHeight/2 && clickY <= origin.y + scaledHeight/2) {
                    console.log('点击了绘制图标');
                    // 显示画轴图片
                    this.showHuazhou = true;
                    return true;
                }
            }

            // 检查背包按钮点击
            if (this.checkBackpackButtonClick(clickX, clickY)) {
                console.log('点击了背包按钮');
                this.showBackpack = true;
                return true;
            }

            // 检查规则按钮点击
            if (this.checkRulesButtonClick(clickX, clickY)) {
                console.log('点击了规则按钮');
                this.showRulesNotification();
                return true;
            }

            // 检查所有按钮的点击
            for (let i = 0; i < this.buttons.length; i++) {
                const button = this.buttons[i];
                
                if (button.show) {
                    const x = button.x;
                    const y = button.y;
                    const width = BUTTON_SIZE;
                    const height = 50;

                    // 检查是否点击了按钮
                    if (clickX >= x - width/2 && clickX <= x + width/2 &&
                        clickY >= y - height/2 && clickY <= y + height/2) {
                        console.log(`点击了查看按钮 ${i + 1}`);
                        
                        // 第一个按钮
                        if (i === 0) {
                            if (this.canClearBamboo) {
                                // 可以清除竹子，显示清除道具选择背包
                                this.showClearBackpack = true;
                                console.log('显示清除道具选择背包');
                            } else {
                                // 显示竹子图表
                            this.showChart = true;
                                this.firstButtonCompleted = true; // 标记第一个按钮已完成交互
                                console.log('显示竹子图表，第一个按钮交互完成');
                            }
                        }
                        // 第二个按钮显示斧头信息图片
                        else if (i === 1) {
                            this.showFutouInfo = true;
                            // 收集斧头物品
                            this.inventory.futou.collected = true;
                            // 从场景中移除斧头
                            this.removeFutouFromScene();
                            console.log('显示斧头信息图片，斧头已收集到背包，斧头已从场景中移除');
                        }
                        
                        return true;
                    }
                }
            }
            return false;
        }

        handleEKeyPress() {
            // 检查是否有图片正在显示，如果有则不处理E键
            const hasImageDisplayed = this.showChart || this.showFutouInfo || this.showChartFutou || this.showHuazhou || this.showBackpack || this.showClearBackpack || this.showClearChart || this.showCryingChart || this.showMenChart || this.yuChatSequence.show || this.rewardNotification.show || this.rulesNotification.show || this.keepGoingImage.show;
            if (hasImageDisplayed) return;
            
            // 检查绘制图标是否加载完成
            if (this.drawIconLoaded && this.drawIcon) {
                console.log('按E键触发绘制图标功能');
                // 显示画轴图片
                this.showHuazhou = true;
            }
        }

        handleBKeyPress() {
            // 检查是否有图片正在显示，如果有则不处理B键
            const hasImageDisplayed = this.showChart || this.showFutouInfo || this.showChartFutou || this.showHuazhou || this.showBackpack || this.showClearBackpack || this.showClearChart || this.showCryingChart || this.showMenChart || this.yuChatSequence.show || this.rewardNotification.show || this.rulesNotification.show || this.keepGoingImage.show;
            if (hasImageDisplayed) return;
            
            // 检查背包按钮是否加载完成
            if (this.backpackButtonLoaded && this.backpackButton) {
                console.log('按B键触发背包功能');
                // 显示背包界面
                this.showBackpack = true;
            }
        }

        checkDrawingButtonClick(clickX, clickY) {
            const origin = project(0, 0);
            const centerX = origin.x + 10;
            const centerY = origin.y - 20;
            const buttonOrder = ['yellow', 'green', 'blue', 'red', 'brown'];
            const buttonSpacing = 90; // 按钮之间的间距（60 * 1.5）
            const startX = centerX - (buttonOrder.length - 1) * buttonSpacing / 2;
            const buttonY = centerY - 255; // 在画轴中心上方255像素处（220 - 475）
            const baseButtonSize = 60; // 基础按钮尺寸（40 * 1.5）

            for (let i = 0; i < buttonOrder.length; i++) {
                const buttonKey = buttonOrder[i];
                const button = this.drawingButtons[buttonKey];
                if (button.loaded && button.image) {
                    const buttonX = startX + i * buttonSpacing;
                    const imgWidth = button.image.width;
                    const imgHeight = button.image.height;
                    
                    // 所有按钮大小一致
                    let buttonSize = baseButtonSize;
                    // if (buttonKey === 'blue') {
                    //     buttonSize = 81; // 60 * 1.5 * 0.9 = 81
                    // }
                    
                    const scale = buttonSize / Math.max(imgWidth, imgHeight);
                    const scaledWidth = imgWidth * scale;
                    const scaledHeight = imgHeight * scale;

                    if (clickX >= buttonX - scaledWidth/2 && clickX <= buttonX + scaledWidth/2 &&
                        clickY >= buttonY - scaledHeight/2 && clickY <= buttonY + scaledHeight/2) {
                        return buttonKey;
                    }
                }
            }
            return null;
        }

        checkPlusButtonClick(clickX, clickY) {
            const origin = project(0, 0);
            const centerX = origin.x + 10;
            const centerY = origin.y - 20;
            const buttonSize = 50;
            const radius = buttonSize / 2;

            const distance = Math.sqrt(
                Math.pow(clickX - centerX, 2) + Math.pow(clickY - centerY, 2)
            );

            return distance <= radius;
        }

        checkBackpackItemClick(clickX, clickY) {
            if (!this.backpackImage) return null;
            
            // 获取背包图片的实际尺寸和位置
            const imgWidth = this.backpackImage.width;
            const imgHeight = this.backpackImage.height;
            const origin = project(0, 0);
            const backpackX = origin.x - imgWidth / 2;
            const backpackY = origin.y - imgHeight / 2;
            
            // 计算网格区域
            const gridPadding = 40;
            const cellWidth = (imgWidth - gridPadding * 2) / 8;
            const cellHeight = (imgHeight - gridPadding * 2) / 4;
            const gridX = backpackX + gridPadding + cellWidth;
            const gridY = backpackY + gridPadding + 70;
            
            if (this.activeTab === 'drawing') {
                // 检查笔绘对象点击
                if (this.inventory.futou.collected && this.inventory.futou.loaded && this.inventory.futou.image) {
                    const itemX = gridX + cellWidth / 2;
                    const itemY = gridY + cellHeight / 2;
                    
                    if (clickX >= itemX - cellWidth / 2 && clickX <= itemX + cellWidth / 2 &&
                        clickY >= itemY - cellHeight / 2 && clickY <= itemY + cellHeight / 2) {
                        return 'futou';
                    }
                }
            } else if (this.activeTab === 'items') {
                // 检查道具点击
                if (this.drawnItems.futou_new.collected && this.drawnItems.futou_new.loaded && this.drawnItems.futou_new.image) {
                    const itemX = gridX + cellWidth / 2;
                    const itemY = gridY + cellHeight / 2;
                    
                    if (clickX >= itemX - cellWidth / 2 && clickX <= itemX + cellWidth / 2 &&
                        clickY >= itemY - cellHeight / 2 && clickY <= itemY + cellHeight / 2) {
                        return 'futou_new';
                    }
                }
            }
            
            return null;
        }

        checkClearBackpackItemClick(clickX, clickY) {
            if (!this.backpackImage) return null;
            
            // 获取背包图片的实际尺寸和位置
            const imgWidth = this.backpackImage.width;
            const imgHeight = this.backpackImage.height;
            const origin = project(0, 0);
            const backpackX = origin.x - imgWidth / 2;
            const backpackY = origin.y - imgHeight / 2;
            
            // 计算网格区域
            const gridPadding = 40;
            const cellWidth = (imgWidth - gridPadding * 2) / 8;
            const cellHeight = (imgHeight - gridPadding * 2) / 4;
            const gridX = backpackX + gridPadding + cellWidth;
            const gridY = backpackY + gridPadding + 70;
            
            // 检查道具点击（只显示道具标签页的内容）
            if (this.drawnItems.futou_new.collected && this.drawnItems.futou_new.loaded && this.drawnItems.futou_new.image) {
                const itemX = gridX + cellWidth / 2;
                const itemY = gridY + cellHeight / 2;
                
                if (clickX >= itemX - cellWidth / 2 && clickX <= itemX + cellWidth / 2 &&
                    clickY >= itemY - cellHeight / 2 && clickY <= itemY + cellHeight / 2) {
                    return 'futou_new';
                }
            }
            
            return null;
        }

        startClearProcess(itemKey) {
            console.log(`开始清除流程，使用道具: ${itemKey}`);
            
            // 隐藏第一个按钮并标记为已使用
            this.buttons[0].show = false;
            this.clearButtonUsed = true;
            console.log('第一个按钮已隐藏，show状态:', this.buttons[0].show, 'clearButtonUsed:', this.clearButtonUsed);
            
            // 显示属性相克UI
            this.xiangkeUI.show = true;
            console.log('显示属性相克UI');
            
            // 检查动画图片是否已加载
            if (!this.clearAnimation.loaded) {
                console.warn('斧头砍下动画图片未加载完成，无法播放动画');
                return;
            }
            
            // 开始斧头砍下动画
            this.clearAnimation.playing = true;
            this.clearAnimation.currentFrame = 0;
            this.clearAnimation.lastFrameTime = Date.now();
            
            console.log('开始播放斧头砍下动画，动画已加载:', this.clearAnimation.loaded);
        }

        checkQuantityButtonClick(clickX, clickY) {
            if (!this.showHuazhou) return null;
            
            const scale = 0.9;
            const inputWidth = 180 * scale;
            const inputHeight = 45 * scale;
            const buttonWidth = 20 * scale;
            const buttonHeight = inputHeight;
            const middleInputWidth = (inputWidth - 2 * buttonWidth) / 2; // 中间输入框宽度缩小一倍
            const iconSize = 60 * scale;
            const spacing = 5 * scale;
            
            const origin = project(0, 0);
            const centerX = origin.x + 10;
            const centerY = origin.y + 210; // 更新位置（下移10像素）
            
            const x = centerX - inputWidth / 2;
            const y = centerY - inputHeight / 2;
            
            // 检查-按钮点击（左侧）
            const minusX = x;
            const minusY = y;
            if (clickX >= minusX && clickX <= minusX + buttonWidth &&
                clickY >= minusY && clickY <= minusY + buttonHeight) {
                return 'minus';
            }
            
            // 检查+按钮点击（右侧）
            const plusX = x + inputWidth - buttonWidth;
            const plusY = y;
            if (clickX >= plusX && clickX <= plusX + buttonWidth &&
                clickY >= plusY && clickY <= plusY + buttonHeight) {
                return 'plus';
            }
            
            return null;
        }

        checkBrushButtonClick(clickX, clickY) {
            if (!this.showHuazhou) return false;
            
            const scale = 0.9;
            const inputWidth = 180 * scale;
            const inputHeight = 45 * scale;
            const buttonWidth = 20 * scale;
            const buttonHeight = inputHeight;
            const iconSize = 60 * scale;
            const spacing = 5 * scale;
            
            const origin = project(0, 0);
            const centerX = origin.x + 10;
            const centerY = origin.y + 210;
            
            const x = centerX - inputWidth / 2;
            const y = centerY - inputHeight / 2;
            
            // 检查毛笔按钮点击（+号右侧）
            const brushX = x + inputWidth + spacing;
            const brushY = y + (inputHeight - iconSize) / 2;
            
            if (clickX >= brushX && clickX <= brushX + iconSize &&
                clickY >= brushY && clickY <= brushY + iconSize) {
                return true;
            }
            
            return false;
        }

        checkBackpackButtonClick(clickX, clickY) {
            if (!this.backpackButtonLoaded || !this.backpackButton) return false;

            const buttonX = WIDTH - 100; // 距离右边100像素
            const buttonY = 50; // 距离顶部50像素
            const buttonSize = 80; // 按钮尺寸

            const distance = Math.sqrt(
                Math.pow(clickX - buttonX, 2) + Math.pow(clickY - buttonY, 2)
            );

            return distance <= buttonSize / 2;
        }

        checkRulesButtonClick(clickX, clickY) {
            const buttonX = 100; // 距离左边100像素（原50+50）
            const buttonY = 50; // 距离顶部50像素
            const buttonSize = 50; // 按钮尺寸

            const distance = Math.sqrt(
                Math.pow(clickX - buttonX, 2) + Math.pow(clickY - buttonY, 2)
            );

            return distance <= buttonSize / 2;
        }

        checkRulesPrevButtonClick(clickX, clickY) {
            const centerX = WIDTH / 2;
            const centerY = HEIGHT / 2;
            const buttonY = centerY + 200;
            const buttonWidth = 60;
            const buttonHeight = 30;
            const buttonSpacing = 20;
            
            const buttonX = centerX - buttonWidth - buttonSpacing / 2;
            
            return clickX >= buttonX && clickX <= buttonX + buttonWidth &&
                   clickY >= buttonY && clickY <= buttonY + buttonHeight;
        }

        checkRulesNextButtonClick(clickX, clickY) {
            const centerX = WIDTH / 2;
            const centerY = HEIGHT / 2;
            const buttonY = centerY + 200;
            const buttonWidth = 60;
            const buttonHeight = 30;
            const buttonSpacing = 20;
            
            const buttonX = centerX + buttonSpacing / 2;
            
            return clickX >= buttonX && clickX <= buttonX + buttonWidth &&
                   clickY >= buttonY && clickY <= buttonY + buttonHeight;
        }

        checkRulesExitButtonClick(clickX, clickY) {
            if (!this.rulesNotification.show || this.rulesNotification.images.length === 0) {
                return false;
            }
            
            const centerX = WIDTH / 2;
            const centerY = HEIGHT / 2;
            
            // 计算规则窗口的位置和尺寸
            const currentImage = this.rulesNotification.images[this.rulesNotification.currentImageIndex];
            if (currentImage) {
                const imgWidth = currentImage.width;
                const imgHeight = currentImage.height;
                const scale = Math.min(WIDTH * 0.8 / imgWidth, HEIGHT * 0.6 / imgHeight);
                const scaledWidth = imgWidth * scale;
                const scaledHeight = imgHeight * scale;
                
                // 规则窗口的位置
                const windowX = centerX - scaledWidth / 2;
                const windowY = centerY - scaledHeight / 2 - 50;
                
                // 退出按钮位置（规则窗口右上角）
                const buttonWidth = 60;
                const buttonHeight = 30;
                const buttonX = windowX + scaledWidth - buttonWidth - 20 - 70; // 距离窗口右边20像素，再向左70像素
                const buttonY = windowY + 20 + 30; // 距离窗口顶部20像素，再向下30像素
                
                return clickX >= buttonX && clickX <= buttonX + buttonWidth &&
                       clickY >= buttonY && clickY <= buttonY + buttonHeight;
            }
            
            return false;
        }

        checkHuazhouExitButtonClick(clickX, clickY) {
            if (!this.showHuazhou || !this.huazhouImage) {
                return false;
            }
            
            // 计算画轴的位置和尺寸
            const origin = project(0, 0);
            const centerX = origin.x + 10;
            const centerY = origin.y - 20;
            const imgWidth = this.huazhouImage.width;
            const imgHeight = this.huazhouImage.height;
            
            // 画轴窗口的位置
            const windowX = centerX - imgWidth / 2;
            const windowY = centerY - imgHeight / 2;
            
            // 退出按钮位置（画轴右上角，向左移动110像素）
            const buttonWidth = 60;
            const buttonHeight = 30;
            const buttonX = windowX + imgWidth - buttonWidth - 20 - 110; // 距离画轴右边20像素，再向左110像素
            const buttonY = windowY + 20; // 距离画轴顶部20像素
            
            return clickX >= buttonX && clickX <= buttonX + buttonWidth &&
                   clickY >= buttonY && clickY <= buttonY + buttonHeight;
        }

        prevRulesImage() {
            if (this.rulesNotification.images.length > 0) {
                this.rulesNotification.currentImageIndex--;
                if (this.rulesNotification.currentImageIndex < 0) {
                    this.rulesNotification.currentImageIndex = this.rulesNotification.images.length - 1;
                }
                console.log(`切换到规则图片第${this.rulesNotification.currentImageIndex + 1}张`);
            }
        }

        nextRulesImage() {
            if (this.rulesNotification.images.length > 0) {
                this.rulesNotification.currentImageIndex++;
                if (this.rulesNotification.currentImageIndex >= this.rulesNotification.images.length) {
                    this.rulesNotification.currentImageIndex = 0;
                }
                console.log(`切换到规则图片第${this.rulesNotification.currentImageIndex + 1}张`);
            }
        }

        checkTabButtonClick(clickX, clickY) {
            if (!this.backpackImage) return null;

            // 获取背包图片的实际尺寸
            const imgWidth = this.backpackImage.width;
            const imgHeight = this.backpackImage.height;
            
            // 计算背包图片在屏幕上的实际位置
            const origin = project(0, 0);
            const backpackX = origin.x - imgWidth / 2;
            const backpackY = origin.y - imgHeight / 2;
            
            // 计算网格区域
            const gridPadding = 40; // 背包内边距
            const cellWidth = (imgWidth - gridPadding * 2) / 8; // 原始8列的格子宽度
            
            // 计算第一行第一格的位置
            const firstCellX = backpackX + gridPadding + cellWidth; // 跳过最左1列
            const firstCellY = backpackY + gridPadding + 70; // 下移70像素
            
            // 标签按钮位置（第一格正上方40像素）
            const tabY = firstCellY - 40;
            const tabHeight = 35;
            const tabWidth = 80;
            const tabSpacing = 15;
            
            // 检查"笔绘对象"按钮
            if (clickX >= firstCellX && clickX <= firstCellX + tabWidth &&
                clickY >= tabY && clickY <= tabY + tabHeight) {
                return 'drawing';
            }
            
            // 检查"道具"按钮
            if (clickX >= firstCellX + tabWidth + tabSpacing && 
                clickX <= firstCellX + tabWidth + tabSpacing + tabWidth &&
                clickY >= tabY && clickY <= tabY + tabHeight) {
                return 'items';
            }
            
            // 计算第一行最后一格的位置（第6列，因为去掉了最左和最右各1列）
            const lastCellX = firstCellX + cellWidth * 5; // 第6列（索引5）
            
            
            return null;
        }

        equipItem(itemKey) {
            // 装备道具
            this.equippedItems[itemKey] = true;
            console.log(`道具 ${itemKey} 已装备`);
            
            // 如果装备的是斧头，隐藏提示文字
            if (itemKey === 'futou_new') {
                this.menChartShown = false;
                console.log('装备斧头后隐藏提示文字');
            }
            
            // 检查是否有装备的道具，如果有则改变NPC按钮状态
            this.checkNpcButtonState();
        }

        checkNpcButtonState() {
            // 检查是否有任何装备的道具
            const hasEquippedItems = Object.keys(this.equippedItems).some(key => this.equippedItems[key]);
            
            if (hasEquippedItems && this.npcViewButton.firstInteractionCompleted) {
                // 如果玩家已经完成第一次交互且有装备的道具，按钮文字应该变为"破除"
                console.log('检测到装备道具，NPC按钮状态已更新');
            }
        }

        checkEquipmentButtonClick(clickX, clickY) {
            if (!this.backpackImage) return false;

            // 获取背包图片的实际尺寸和位置
            const imgWidth = this.backpackImage.width;
            const imgHeight = this.backpackImage.height;
            const origin = project(0, 0);
            const backpackX = origin.x - imgWidth / 2;
            const backpackY = origin.y - imgHeight / 2;
            
            // 计算网格区域
            const gridPadding = 40;
            const cellWidth = (imgWidth - gridPadding * 2) / 8;
            
            // 计算第一行第一格的位置
            const firstCellX = backpackX + gridPadding + cellWidth;
            const firstCellY = backpackY + gridPadding + 70;
            
            // 标签按钮位置
            const tabY = firstCellY - 40;
            const tabHeight = 35;
            const tabWidth = 80;
            
            // 计算第一行最后一格的位置（第6列）
            const lastCellX = firstCellX + cellWidth * 5;
            
            // 检查装备按钮点击
            if (clickX >= lastCellX && clickX <= lastCellX + tabWidth &&
                clickY >= tabY && clickY <= tabY + tabHeight) {
                // 如果当前在道具页签且有选中的道具，则装备该道具
                if (this.activeTab === 'items' && this.selectedBackpackItem) {
                    this.equipItem(this.selectedBackpackItem);
                    console.log(`装备道具: ${this.selectedBackpackItem}`);
                    
                    // 添加点击反馈效果
                    this.equipmentButton.scale = 0.9;
                    setTimeout(() => {
                        this.equipmentButton.scale = 1.0;
                    }, 150);
                }
                return true;
            }
            
            return false;
        }

        checkBackpackExitButtonClick(clickX, clickY) {
            if (!this.showBackpack || !this.backpackImage) {
                return false;
            }
            
            // 计算背包的位置和尺寸
            const origin = project(0, 0);
            const centerX = origin.x;
            const centerY = origin.y;
            const imgWidth = this.backpackImage.width;
            const imgHeight = this.backpackImage.height;
            
            // 背包窗口的位置
            const windowX = centerX - imgWidth / 2;
            const windowY = centerY - imgHeight / 2;
            
            // 退出按钮位置（背包右上角，向左移动110像素，向上移动20像素）
            const buttonWidth = 60;
            const buttonHeight = 30;
            const buttonX = windowX + imgWidth - buttonWidth - 20 - 110; // 距离背包右边20像素，再向左110像素
            const buttonY = windowY + 20 - 20; // 距离背包顶部20像素，再向上20像素
            
            return clickX >= buttonX && clickX <= buttonX + buttonWidth &&
                   clickY >= buttonY && clickY <= buttonY + buttonHeight;
        }

        checkTabButtonHover(mouseX, mouseY) {
            if (!this.backpackImage) return;

            // 获取背包图片的实际尺寸
            const imgWidth = this.backpackImage.width;
            const imgHeight = this.backpackImage.height;
            
            // 计算背包图片在屏幕上的实际位置
            const origin = project(0, 0);
            const backpackX = origin.x - imgWidth / 2;
            const backpackY = origin.y - imgHeight / 2;
            
            // 计算网格区域
            const gridPadding = 40; // 背包内边距
            const cellWidth = (imgWidth - gridPadding * 2) / 8; // 原始8列的格子宽度
            
            // 计算第一行第一格的位置
            const firstCellX = backpackX + gridPadding + cellWidth; // 跳过最左1列
            const firstCellY = backpackY + gridPadding + 70; // 下移70像素
            
            // 标签按钮位置（第一格正上方40像素）
            const tabY = firstCellY - 40;
            const tabHeight = 35;
            const tabWidth = 80;
            const tabSpacing = 15;
            
            // 检查"笔绘对象"按钮悬停
            this.tabButtons.drawing.hovered = (mouseX >= firstCellX && mouseX <= firstCellX + tabWidth &&
                                             mouseY >= tabY && mouseY <= tabY + tabHeight);
            
            // 检查"道具"按钮悬停
            this.tabButtons.items.hovered = (mouseX >= firstCellX + tabWidth + tabSpacing && 
                                            mouseX <= firstCellX + tabWidth + tabSpacing + tabWidth &&
                                            mouseY >= tabY && mouseY <= tabY + tabHeight);
            
            // 计算第一行最后一格的位置（第6列，因为去掉了最左和最右各1列）
            const lastCellX = firstCellX + cellWidth * 5; // 第6列（索引5）
            
            // 检查"装备"按钮悬停
            this.equipmentButton.hovered = (mouseX >= lastCellX && mouseX <= lastCellX + tabWidth &&
                                           mouseY >= tabY && mouseY <= tabY + tabHeight);
        }

        selectItemForCanvas(itemKey) {
            if (itemKey === 'futou' && this.inventory.futou.collected) {
                this.selectedItem = {
                    key: 'futou',
                    name: this.inventory.futou.name,
                    paintPoints: this.inventory.futou.paintPoints,
                    image: this.inventory.futou.image
                };
                console.log(`已选择${this.selectedItem.name}用于画轴绘制`);
            }
        }

        checkQuantityButtonHover(mouseX, mouseY) {
            if (!this.showHuazhou) return;
            
            const scale = 0.9;
            const inputWidth = 180 * scale;
            const inputHeight = 45 * scale;
            const buttonWidth = 20 * scale;
            const buttonHeight = inputHeight;
            const middleInputWidth = (inputWidth - 2 * buttonWidth) / 2; // 中间输入框宽度缩小一倍
            const iconSize = 60 * scale;
            const spacing = 5 * scale;
            
            const origin = project(0, 0);
            const centerX = origin.x + 10;
            const centerY = origin.y + 210; // 更新位置（下移10像素）
            
            const x = centerX - inputWidth / 2;
            const y = centerY - inputHeight / 2;
            
            // 检查-按钮悬停（左侧）
            const minusX = x;
            const minusY = y;
            this.quantityInput.minusButton.hovered = (mouseX >= minusX && mouseX <= minusX + buttonWidth &&
                                                     mouseY >= minusY && mouseY <= minusY + buttonHeight);
            
            // 检查+按钮悬停（右侧）
            const plusX = x + inputWidth - buttonWidth;
            const plusY = y;
            this.quantityInput.plusButton.hovered = (mouseX >= plusX && mouseX <= plusX + buttonWidth &&
                                                    mouseY >= plusY && mouseY <= plusY + buttonHeight);
        }

        checkBrushButtonHover(mouseX, mouseY) {
            if (!this.showHuazhou) return;
            
            const scale = 0.9;
            const inputWidth = 180 * scale;
            const inputHeight = 45 * scale;
            const buttonWidth = 20 * scale;
            const buttonHeight = inputHeight;
            const iconSize = 60 * scale;
            const spacing = 5 * scale;
            
            const origin = project(0, 0);
            const centerX = origin.x + 10;
            const centerY = origin.y + 210;
            
            const x = centerX - inputWidth / 2;
            const y = centerY - inputHeight / 2;
            
            // 检查毛笔按钮悬停（+号右侧）
            const brushX = x + inputWidth + spacing;
            const brushY = y + (inputHeight - iconSize) / 2;
            
            this.brushButtonHovered = (mouseX >= brushX && mouseX <= brushX + iconSize &&
                                      mouseY >= brushY && mouseY <= brushY + iconSize);
        }

        checkPlusButtonHover(mouseX, mouseY) {
            const origin = project(0, 0);
            const centerX = origin.x + 10;
            const centerY = origin.y - 20;
            const buttonSize = 50;
            const radius = buttonSize / 2;

            const distance = Math.sqrt(
                Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2)
            );

            this.plusButton.hovered = distance <= radius;
        }

        checkDrawingButtonHover(mouseX, mouseY) {
            const origin = project(0, 0);
            const centerX = origin.x + 10;
            const centerY = origin.y - 20;
            const buttonOrder = ['yellow', 'green', 'blue', 'red', 'brown'];
            const buttonSpacing = 90; // 按钮之间的间距（60 * 1.5）
            const startX = centerX - (buttonOrder.length - 1) * buttonSpacing / 2;
            const buttonY = centerY - 255; // 在画轴中心上方255像素处（220 - 475）
            const baseButtonSize = 60; // 基础按钮尺寸（40 * 1.5）

            // 重置所有按钮的悬停状态
            buttonOrder.forEach(buttonKey => {
                this.drawingButtons[buttonKey].hovered = false;
            });

            for (let i = 0; i < buttonOrder.length; i++) {
                const buttonKey = buttonOrder[i];
                const button = this.drawingButtons[buttonKey];
                if (button.loaded && button.image) {
                    const buttonX = startX + i * buttonSpacing;
                    const imgWidth = button.image.width;
                    const imgHeight = button.image.height;
                    
                    // 所有按钮大小一致
                    let buttonSize = baseButtonSize;
                    // if (buttonKey === 'blue') {
                    //     buttonSize = 81; // 60 * 1.5 * 0.9 = 81
                    // }
                    
                    const scale = buttonSize / Math.max(imgWidth, imgHeight);
                    const scaledWidth = imgWidth * scale;
                    const scaledHeight = imgHeight * scale;

                    if (mouseX >= buttonX - scaledWidth/2 && mouseX <= buttonX + scaledWidth/2 &&
                        mouseY >= buttonY - scaledHeight/2 && mouseY <= buttonY + scaledHeight/2) {
                        button.hovered = true;
                    }
                }
            }
        }

        checkHover(mouseX, mouseY) {
            // 检查NPC查看按钮悬停状态
            if (this.npcViewButton.show) {
                const x = this.npcViewButton.x;
                const y = this.npcViewButton.y;
                const width = BUTTON_SIZE;
                const height = 50;
                
                // 使用矩形检测
                this.npcViewButton.isHovered = mouseX >= x - width/2 && mouseX <= x + width/2 && 
                                             mouseY >= y - height/2 && mouseY <= y + height/2;
            }

            // 检查绘制按钮悬停状态（只有在画轴显示时才检查）
            if (this.showHuazhou) {
                // 检查+号按钮悬停状态
                this.checkPlusButtonHover(mouseX, mouseY);
                this.checkDrawingButtonHover(mouseX, mouseY);
                this.checkQuantityButtonHover(mouseX, mouseY);
                this.checkBrushButtonHover(mouseX, mouseY);
                // 检查退出按钮悬停状态
                this.huazhouExitButtonHovered = this.checkHuazhouExitButtonClick(mouseX, mouseY);
            } else {
                this.huazhouExitButtonHovered = false;
            }

            // 检查绘制图标悬停状态
            if (this.drawIconLoaded && this.drawIcon) {
                const origin = project(DRAW_ICON_POSITION_I, DRAW_ICON_POSITION_J);
                const imgWidth = this.drawIcon.width;
                const imgHeight = this.drawIcon.height;
                const scale = DRAW_ICON_SIZE / Math.max(imgWidth, imgHeight);
                const scaledWidth = imgWidth * scale;
                const scaledHeight = imgHeight * scale;
                
                // 检查鼠标是否悬停在绘制图标上
                this.drawIconHovered = (mouseX >= origin.x - scaledWidth/2 && mouseX <= origin.x + scaledWidth/2 &&
                                       mouseY >= origin.y - scaledHeight/2 && mouseY <= origin.y + scaledHeight/2);
            } else {
                this.drawIconHovered = false;
            }

            // 检查背包按钮悬停状态
            if (this.backpackButtonLoaded && this.backpackButton) {
                const buttonX = WIDTH - 100; // 距离右边100像素
                const buttonY = 50; // 距离顶部50像素
                const buttonSize = 80; // 按钮尺寸

                const distance = Math.sqrt(
                    Math.pow(mouseX - buttonX, 2) + Math.pow(mouseY - buttonY, 2)
                );

                this.backpackButtonHovered = distance <= buttonSize / 2;
            } else {
                this.backpackButtonHovered = false;
            }

            // 检查规则按钮悬停状态
            const rulesButtonX = 100; // 距离左边100像素（原50+50）
            const rulesButtonY = 50; // 距离顶部50像素
            const rulesButtonSize = 50; // 按钮尺寸

            const rulesDistance = Math.sqrt(
                Math.pow(mouseX - rulesButtonX, 2) + Math.pow(mouseY - rulesButtonY, 2)
            );

            const wasHovered = this.rulesButtonHovered;
            this.rulesButtonHovered = rulesDistance <= rulesButtonSize / 2;
            
            // 如果开始悬停，记录开始时间
            if (this.rulesButtonHovered && !wasHovered) {
                this.rulesButtonHoverStartTime = Date.now();
            }

            // 检查规则导航按钮悬停状态
            if (this.rulesNotification.show) {
                this.rulesNotification.prevButtonHovered = this.checkRulesPrevButtonClick(mouseX, mouseY);
                this.rulesNotification.nextButtonHovered = this.checkRulesNextButtonClick(mouseX, mouseY);
                this.rulesNotification.exitButtonHovered = this.checkRulesExitButtonClick(mouseX, mouseY);
            } else {
                this.rulesNotification.prevButtonHovered = false;
                this.rulesNotification.nextButtonHovered = false;
                this.rulesNotification.exitButtonHovered = false;
            }

            // 检查标签按钮悬停状态
            if (this.showBackpack && this.backpackImage) {
                this.checkTabButtonHover(mouseX, mouseY);
                // 检查退出按钮悬停状态
                this.backpackExitButtonHovered = this.checkBackpackExitButtonClick(mouseX, mouseY);
            } else {
                this.backpackExitButtonHovered = false;
            }

            // 检查所有按钮的悬停状态
            this.buttons.forEach(button => {
                if (button.show) {
                    const x = button.x;
                    const y = button.y;
                    const width = BUTTON_SIZE;
                    const height = 50;

                    // 检查鼠标是否悬停在按钮上
                    button.isHovered = (mouseX >= x - width/2 && mouseX <= x + width/2 &&
                                       mouseY >= y - height/2 && mouseY <= y + height/2);
                } else {
                    button.isHovered = false;
                }
            });
        }
    }

    const interactionSystem = new InteractionSystem();
    
    // 将interactionSystem设置为全局变量，以便开场动画可以访问
    window.interactionSystem = interactionSystem;

    // 障碍系统
    class ObstacleSystem {
        constructor() {
            this.obstacles = [];
            this.initializeObstacles();
        }

        initializeObstacles() {
            // 添加从 (0,-30) 到 (0,20) 的障碍（竹子相关，清除竹子后消失）
            this.addLineObstacle(OBSTACLE_START_I, OBSTACLE_START_J, OBSTACLE_END_I, OBSTACLE_END_J, 'bamboo');
            
            // 添加第二道障碍：从 (0,-4) 到 (13,-4)（永久障碍，不清除）
            this.addLineObstacle(0, -4, 13, -4, 'permanent');
        }

        addLineObstacle(startI, startJ, endI, endJ, obstacleType = 'line') {
            // 计算两点之间的所有格子
            const points = this.getLinePoints(startI, startJ, endI, endJ);
            points.forEach(point => {
                this.obstacles.push({
                    i: point.i,
                    j: point.j,
                    type: obstacleType
                });
            });
            console.log(`添加线形障碍：从 (${startI}, ${startJ}) 到 (${endI}, ${endJ})，共 ${points.length} 个点，类型：${obstacleType}`);
        }

        getLinePoints(startI, startJ, endI, endJ) {
            const points = [];
            const di = endI - startI;
            const dj = endJ - startJ;
            const steps = Math.max(Math.abs(di), Math.abs(dj));
            
            for (let t = 0; t <= steps; t++) {
                const i = Math.round(startI + (di * t) / steps);
                const j = Math.round(startJ + (dj * t) / steps);
                points.push({ i, j });
            }
            return points;
        }

        isObstacle(i, j) {
            return this.obstacles.some(obs => obs.i === i && obs.j === j);
        }

        removeAllObstacles() {
            // 只移除竹子相关的障碍，保留永久障碍
            this.obstacles = this.obstacles.filter(obstacle => obstacle.type !== 'bamboo');
            console.log('竹子相关障碍已移除，永久障碍保留');
        }

        draw(ctx, project) {
            // 障碍不可见，但逻辑上仍然存在
            // 注释掉绘制代码，让障碍在视觉上不可见
            /*
            this.obstacles.forEach(obstacle => {
                const pos = project(obstacle.i, obstacle.j);
                this.drawObstacle(ctx, pos.x, pos.y);
            });
            */
        }

        drawObstacle(ctx, x, y) {
            // 绘制障碍（红色方块）- 已禁用
            ctx.fillStyle = 'rgba(255, 0, 0, 0.7)';
            ctx.fillRect(x - unit/2, y - unit/2, unit, unit);
            
            // 绘制边框
            ctx.strokeStyle = 'rgba(255, 0, 0, 1)';
            ctx.lineWidth = 2;
            ctx.strokeRect(x - unit/2, y - unit/2, unit, unit);
        }
    }

    const obstacleSystem = new ObstacleSystem();

    const player = {
        i: PLAYER_START_I,
        j: PLAYER_START_J,
        pi: PLAYER_START_I, // 过渡用起点
        pj: PLAYER_START_J,
        ti: PLAYER_START_I, // 过渡用终点
        tj: PLAYER_START_J,
        t: 1,  // 过渡进度 0..1
        speed: 6, // 每秒跨格数（视觉）
        moving: false,
    };
    let win = false;

    // 将 (i,j) 投影到屏幕
    function project(i, j) {
        const worldX = (i - j) * unit * cos30;
        const worldY = (i + j) * unit * sin30;
        // 地图中心放在屏幕中间略下
        const originX = WIDTH / 2;
        const originY = HEIGHT / 2 + 40;
        return { x: originX + worldX, y: originY + worldY };
    }

    function canWalk(i, j) {
        const s = i - j;
        const t = i + j;
        const inBounds = s >= sMin && s <= sMax && t >= tMin && t <= tMax;
        const noObstacle = !obstacleSystem.isObstacle(i, j);
        return inBounds && noObstacle;
    }

    // 输入
    const keys = new Set();
    window.addEventListener('keydown', (e) => {
        if (win) return;
        keys.add(e.key.toLowerCase());
        
        // 处理E键触发绘制图标功能
        if (e.key.toLowerCase() === 'e') {
            interactionSystem.handleEKeyPress();
        }
        
        // 处理B键触发背包功能
        if (e.key.toLowerCase() === 'b') {
            interactionSystem.handleBKeyPress();
        }
    });
    window.addEventListener('keyup', (e) => {
        keys.delete(e.key.toLowerCase());
    });

    // 鼠标点击事件
    canvas.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;
        
        // 处理交互按钮点击
        interactionSystem.handleClick(x, y);
    });

    // 鼠标移动事件（用于悬停效果）
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;
        
        // 检查鼠标是否悬停在按钮上
        interactionSystem.checkHover(x, y);
    });

    function update(dt) {
        // 更新动画系统
        playerAnimation.update(dt);
        
        // 更新交互系统动画时间
        interactionSystem.animationTime = performance.now();

        // 更新音频系统
        updateStartMusicFadeOut();
        if (window.audioSystem?.isGameStarted) {
            updateBackgroundMusic();
        }

        // 更新绘制动画
        interactionSystem.updateDrawingAnimation();
        interactionSystem.updateClearAnimation();
        
        // 更新斧头砍下动画
        interactionSystem.updateAxeAnimation();
        interactionSystem.updateBambooFade();
        
        // 更新雨滴效果
        interactionSystem.updateRainEffect();

        if (!player.moving && !win) {
            let di = 0, dj = 0;
            
            // 如果触发了游戏结束序列，强制向左移动
            if (interactionSystem.gameEnding.isMovingLeft) {
                di = -1;
            } else {
                // 正常按键控制
                if (keys.has('arrowup') || keys.has('w')) dj -= 1;
                if (keys.has('arrowdown') || keys.has('s')) dj += 1;
                if (keys.has('arrowleft') || keys.has('a')) di -= 1;
                if (keys.has('arrowright') || keys.has('d')) di += 1;
                // 禁止斜向，同步优先级：上下优先于左右（可按需调整）
                if (dj !== 0) di = 0;
            }

            if (di !== 0 || dj !== 0) {
                const ni = player.i + di;
                const nj = player.j + dj;
                
                // 游戏结束序列时忽略障碍物检查
                if (interactionSystem.gameEnding.isMovingLeft || canWalk(ni, nj)) {
                    player.pi = player.i; player.pj = player.j;
                    player.ti = ni; player.tj = nj; player.t = 0; player.moving = true;
                    
                    // 设置移动动画状态和方向
                    let direction = 'down';
                    if (di > 0) direction = 'right';
                    else if (di < 0) direction = 'left';
                    else if (dj > 0) direction = 'down';
                    else if (dj < 0) direction = 'up';
                    
                    playerAnimation.setState('walk', direction);
                }
            } else {
                // 没有按键时设置为待机状态，保持当前方向
                playerAnimation.setState('idle', playerAnimation.currentDirection);
            }

            // 检查交互（每帧都检查，无论是否移动）
            if (!win) {
                interactionSystem.checkInteraction(player.i, player.j);
            }

            // 检查游戏结束条件
            interactionSystem.checkGameEnding(player.i, player.j);
        }

        if (player.moving) {
            const movePerSec = player.speed; // 格/秒
            player.t += movePerSec * dt;
            if (player.t >= 1) {
                player.t = 1; player.moving = false;
                player.i = player.ti; player.j = player.tj;
                
                // 检查角色是否离开屏幕（游戏结束序列）
                if (interactionSystem.gameEnding.isMovingLeft && !interactionSystem.gameEnding.fadeToBlack.active) {
                    const playerPos = project(player.i, player.j);
                    console.log(`角色位置: i=${player.i}, j=${player.j}, screenX=${playerPos.x}`);
                    if (playerPos.x < -100) { // 角色完全离开屏幕左侧
                        console.log('角色已离开屏幕，开始变暗效果');
                        interactionSystem.startFadeToBlack();
                    }
                }
                
                // 抵达判定：与旗帜同格
                if (player.i === flagI && player.j === flagJ) win = true;
            }
        }
    }

    function draw() {
        // 清屏
        ctx.clearRect(0, 0, WIDTH, HEIGHT);

        // 背景：图片中心对齐坐标原点；若未载入则使用纯色
        // 场景转换过程中不绘制背景，由drawSceneTransition负责
        if (!interactionSystem.sceneTransition.active) {
            // 检查是否已切换到新背景
            if (interactionSystem.sceneTransition.backgroundSwitched && 
                interactionSystem.sceneTransition.newBackgroundLoaded && 
                interactionSystem.sceneTransition.newBackgroundImage) {
                // 使用新背景
                const origin = project(0, 0);
                const bx = Math.round(origin.x - interactionSystem.sceneTransition.newBackgroundImage.width / 2);
                const by = Math.round(origin.y - interactionSystem.sceneTransition.newBackgroundImage.height / 2);
                ctx.drawImage(interactionSystem.sceneTransition.newBackgroundImage, bx, by);
            } else if (bgLoaded) {
                // 使用原背景
            const origin = project(0, 0);
            const bx = Math.round(origin.x - bgImg.width / 2);
            const by = Math.round(origin.y - bgImg.height / 2);
            ctx.drawImage(bgImg, bx, by);
        } else {
            ctx.fillStyle = '#111319';
            ctx.fillRect(0, 0, WIDTH, HEIGHT);
            }
        }

        // 绘制雨滴效果（在背景之后，UI之前）
        interactionSystem.drawRainEffect(ctx);

        // 绘制哭泣图表（在游戏背景之上，但在其他图片下方）
        if (interactionSystem.showCryingChart && interactionSystem.cryingChartImage) {
            interactionSystem.drawCryingChart(ctx);
        }

        // 绘制NPC跑动UI（在游戏背景之上，但在其他图片下方）
        // 只有在没有场景转换时才显示NPC跑动UI
        if (interactionSystem.showNpcPao && interactionSystem.npcPaoImage && !interactionSystem.sceneTransition.active) {
            interactionSystem.drawNpcPao(ctx);
        }

        // 道具（在地面上）
        itemSystem.draw(ctx, project);

        // 障碍（不可见，但逻辑上存在）
        obstacleSystem.draw(ctx, project);

        // 旗帜
        {
            const p = project(flagI, flagJ);
            drawFlag(p.x, p.y, unit);
        }

        // 斧头砍下动画（在主角下面）
        interactionSystem.drawClearAnimation(ctx);

        // 属性相克UI（在主角下面）
        interactionSystem.drawXiangkeUI(ctx);

        // 玩家（在地面之上、墙体之下/之上？为了清晰，画在旗帜后）
        const px = lerp(player.pi, player.ti, player.t);
        const py = lerp(player.pj, player.tj, player.t);
        const pp = project(px, py);
        drawPlayer(pp.x, pp.y, unit);

        // 提示（游戏结束序列时不显示）
        // if (!interactionSystem.gameEnding.isTriggered) {
        //     ctx.fillStyle = 'rgba(255,255,255,0.85)';
        //     ctx.font = '600 14px system-ui';
        //     ctx.textAlign = 'left';
        //     ctx.fillText('WASD/方向键移动，抵达旗帜结束', 16, 24);
        // }

        // 交互按钮（在最后绘制，确保在最上层）
        interactionSystem.draw(ctx);

        // 绘制场景转换效果（最上层）
        if (interactionSystem.sceneTransition.active) {
            interactionSystem.drawSceneTransition(ctx);
        }

        if (win) {
            ctx.fillStyle = 'rgba(0,0,0,0.55)';
            ctx.fillRect(0, 0, WIDTH, HEIGHT);
            ctx.fillStyle = '#fff';
            ctx.textAlign = 'center';
            ctx.font = 'bold 28px system-ui';
            ctx.fillText('到达旗帜，通关！', WIDTH / 2, HEIGHT / 2);
        }

        // 绘制游戏结束变暗效果（在所有内容之上）
        interactionSystem.drawGameEndingFade(ctx);
        
        // 绘制未完待续图片（在变暗效果之上）
        interactionSystem.drawContinuationImage(ctx);
    }

    function drawDiamond(x, y, size, fill, stroke) {
        const w = size * 2 * cos30; // 菱形宽
        const h = size * 2 * sin30; // 菱形高
        ctx.beginPath();
        ctx.moveTo(x, y - h / 2);
        ctx.lineTo(x + w / 2, y);
        ctx.lineTo(x, y + h / 2);
        ctx.lineTo(x - w / 2, y);
        ctx.closePath();
        ctx.fillStyle = fill; ctx.fill();
        ctx.strokeStyle = stroke; ctx.lineWidth = 1; ctx.stroke();
    }

    function drawBlock(x, y, size, height, topColor, sideColor) {
        // 顶面
        drawDiamond(x, y - height, size, topColor, 'rgba(0,0,0,0.2)');
        // 侧面（右）
        const w = size * 2 * cos30, h = size * 2 * sin30;
        ctx.fillStyle = shade(sideColor, 0.9);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + w / 2, y);
        ctx.lineTo(x + w / 2, y - height);
        ctx.lineTo(x, y - height);
        ctx.closePath(); ctx.fill();
        // 侧面（左）
        ctx.fillStyle = shade(sideColor, 0.7);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - w / 2, y);
        ctx.lineTo(x - w / 2, y - height);
        ctx.lineTo(x, y - height);
        ctx.closePath(); ctx.fill();
        // 轮廓
        ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.lineWidth = 1; ctx.stroke();
    }

    function drawFlag(x, y, size) {
        // 旗杆
        ctx.strokeStyle = '#d4b483'; ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y - 22);
        ctx.lineTo(x, y - 60);
        ctx.stroke();
        // 旗面
        ctx.fillStyle = '#ff6b6b';
        ctx.beginPath();
        ctx.moveTo(x, y - 58);
        ctx.lineTo(x + 18, y - 52);
        ctx.lineTo(x, y - 46);
        ctx.closePath();
        ctx.fill();
        // 底座（菱形高亮）
        drawDiamond(x, y, size * 0.6, '#243045', 'rgba(255,255,255,0.1)');
    }

    function drawPlayer(x, y, size) {
        const currentImage = playerAnimation.getCurrentImage();
        
        if (currentImage) {
            // 绘制角色动画图片
            const imgWidth = currentImage.width;
            const imgHeight = currentImage.height;
            const scale = (PLAYER_SIZE * PLAYER_SCALE) / Math.max(imgWidth, imgHeight); // 使用配置参数
            const scaledWidth = imgWidth * scale;
            const scaledHeight = imgHeight * scale;
            
            // 绘制阴影
            ctx.fillStyle = 'rgba(0,0,0,0.35)';
            ctx.beginPath();
            ctx.ellipse(x, y - 2, size * 0.8, size * 0.3, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // 绘制角色图片，以底部中心为锚点
            ctx.drawImage(
                currentImage,
                x - scaledWidth / 2,
                y - scaledHeight,
                scaledWidth,
                scaledHeight
            );
        } else {
            // 如果图片未加载，使用原来的简单图形作为后备
        // 阴影
        ctx.fillStyle = 'rgba(0,0,0,0.35)';
        ctx.beginPath();
        ctx.ellipse(x, y - 2, size * 0.8, size * 0.3, 0, 0, Math.PI * 2);
        ctx.fill();
        // 身体
        ctx.fillStyle = '#5b8cff';
        ctx.beginPath();
        ctx.arc(x, y - 18, 12, 0, Math.PI * 2);
        ctx.fill();
        // 身躯
        ctx.fillStyle = '#7897ff';
        ctx.fillRect(x - 10, y - 18, 20, 18);
        // 朝向小指示（根据移动方向简化）
        const dx = player.ti - player.pi;
        const dy = player.tj - player.pj;
        const fx = dx !== 0 ? Math.sign(dx) : 0;
        ctx.fillStyle = '#fff';
        ctx.fillRect(x + fx * 6 - 2, y - 22, 4, 4);
        }
    }

    function shade(hex, k) {
        const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (!m) return hex;
        let r = Math.round(parseInt(m[1], 16) * k);
        let g = Math.round(parseInt(m[2], 16) * k);
        let b = Math.round(parseInt(m[3], 16) * k);
        r = Math.max(0, Math.min(255, r));
        g = Math.max(0, Math.min(255, g));
        b = Math.max(0, Math.min(255, b));
        return '#' + r.toString(16).padStart(2, '0') + g.toString(16).padStart(2, '0') + b.toString(16).padStart(2, '0');
    }

    function lerp(a, b, t) { return a + (b - a) * t; }

    // 雨滴类
    class Raindrop {
        constructor(canvasWidth, canvasHeight) {
            this.canvasWidth = canvasWidth;
            this.canvasHeight = canvasHeight;
            this.reset();
        }

        reset() {
            this.x = Math.random() * this.canvasWidth;
            this.y = Math.random() * -this.canvasHeight; // 从画布顶部随机生成
            this.length = 10 + Math.random() * 20;   // 雨滴长度
            this.speed = 4 + Math.random() * 6;      // 下落速度
            this.opacity = 0.2 + Math.random() * 0.5;
            this.width = 1 + Math.random() * 1.5;    // 雨滴线条粗细
        }

        update() {
            this.y += this.speed;

            // 如果雨滴离开屏幕底部，重置到顶部
            if (this.y > this.canvasHeight) {
                this.reset();
            }
        }

        draw(ctx) {
            ctx.strokeStyle = `rgba(255,255,255,${this.opacity})`;
            ctx.lineWidth = this.width;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x, this.y + this.length);
            ctx.stroke();
        }
    }

        // 主循环
        let last = performance.now();
        
        // 初始化雨滴效果
        interactionSystem.initRainEffect();

        // 强制显示规则提示界面
        setTimeout(() => {
            interactionSystem.showRulesNotification();
            console.log('游戏开始，强制显示规则提示界面');
        }, 1000); // 1秒后显示，确保游戏界面完全加载


        function loop(ts = performance.now()) {
            const dt = Math.min(0.05, (ts - last) / 1000); // 秒
            last = ts;
            update(dt);
            draw();
            requestAnimationFrame(loop);
        }
        loop();
    }
})();


