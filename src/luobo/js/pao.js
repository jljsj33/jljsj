var clientRect = document.body.getBoundingClientRect()
//屏幕宽度
var WIDTH = ( !! window.navigator.userAgent.match(/Android/) ? 640 : window.innerWidth * devicePixelRatio);

//屏幕高度
var HEIGHT = ( !! window.navigator.userAgent.match(/Android/) ? (clientRect.height * 640 / clientRect.width) : window.innerHeight * devicePixelRatio);

var SAFE_ZONE_WIDTH = 640,
    GameScale = Math.round(10000 * WIDTH / SAFE_ZONE_WIDTH) / 10000;


//定义舞台的坐标等常量
var CENTERX = WIDTH / 2,
    CENTERY = HEIGHT / 2;

var isDebug = false; //调试


var assets = {
    image: {
        'fish': 'images/hp.png',
        'fish_hp': 'images/fish.png',
        'bg': 'images/bg.jpg',
        'topHp': 'images/topHp.png',
        'openBtn': 'images/openBtn.png',
        'titleTxt': 'images/titleTxt.png',
        'remind':'images/remind.png'
    },
    spritesheet: {
        'duck_s': ['images/duck_stop.png', 90, 90],
        'play_duck': ['images/duck_play.png', 90, 90],
        'play_duck_wd': ['images/duck_play_w.png', 90, 90],
        'block': ['images/block.png', 75, 68],
        'block_d': ['images/block_d.png', 210, 70],
        'startPlay': ['images/startPlay.png', 150, 150]
    },
    audio: {
        "bg": 'audio/bg1.mp3',
        "toEat": 'audio/toeat.mp3',
        "toHp": 'audio/toHp.mp3',
        "F_Hp": 'audio/F_Hp.mp3'
    }
}
var jfTxt, jfNum = 0,
    sleepNum = 2, //速度
    style, tk, turret, bg, rou_b, group,remind, rouArr = [],
    playBool = false,
    tNum = 4, //初始狗的只数
    lNum = 5, //初始鱼的个数
    rouDNum = 0,
    tkTweenBool = true,
    tkWDBool = false;
var timerBar, timerPos, topHp, HpNum = 3
var dogGroup, dogArr = [],
    dogTmerNum, dogH, //狗的间隔
    fpstxt;
var dragArr = [[], [], []],
    dragArrPointerX = [[], [], []], //3个数组来控制两点触屏加鼠标
    stageDown = false,
    endGameBool = false;


var tk_stop_inter;

var UT_GAME_ID = "lw_game_1";

var loading = document.getElementById("loading");
var loadingText = document.getElementById("loading-text");
var result = document.getElementById("result");
var resultScore = document.getElementById("score-num");


var jfat_obj = {
    x: 0
};

function preload() {
    game.stage.backgroundColor = "#C1D864";
    Object.keys(assets).forEach(function (type) {
        Object.keys(assets[type]).forEach(function (id) {
            game.load[type].apply(game.load, [id].concat(assets[type][id]));
        });
    });
    game.load.onFileComplete.add(updateProgressBar, this);

};

function updateProgressBar(progress, key, success, totalLoaded, totalFiles) {
    loadingText.innerHTML = "加载中... </br>" + progress + " %";
}

var create = function () {

    // remove loading
    loading.parentNode.removeChild(loading);


    // 定义住场景
    Phaser.Canvas.setSmoothingEnabled(game.context, false);

    game.stage.scaleMode = Phaser.StageScaleMode.SHOW_ALL;
    game.world.width = WIDTH;
    game.world.height = HEIGHT;
    game.stage.scale.setScreenSize(false);

    CENTERX = game.world.centerX;
    CENTERY = game.world.centerY;

    //抗锯齿
    game.antialias = false;

    //四点触屏
    game.input.addPointer();
    game.input.addPointer();
    game.input.addPointer();

    Over.init(UT_GAME_ID, restartGame);

    SoundFun();

    startFun();


    //console.log(fat.x)

};
/*************************开始页*************************/
var startGroup, titleTxt, openBtn, startPlay;

function startFun() {
    startGroup = game.add.group();
    titleTxt = game.add.sprite(CENTERX / GameScale, CENTERY / GameScale - 280 * GameScale, 'titleTxt');
    startGroup.add(titleTxt)
    titleTxt.anchor.setTo(.5, .5);
    titleTxt.alpha = 0;
    titleTxt.y = CENTERY / GameScale - 320 * GameScale;
    game.add.tween(titleTxt).to({
        y: CENTERY / GameScale - 280 * GameScale,
        alpha: 1
    }, 500, Phaser.Easing.Back.Out, true);

    startPlay = game.add.sprite(CENTERX / GameScale, CENTERY / GameScale + 50 * GameScale, "startPlay")
    startPlay.animations.add('startPlay')
    startPlay.play('startPlay', 24, true)
    startPlay.anchor.setTo(.5, .5)
    startPlay.scale.setTo(2 * GameScale, 2 * GameScale)
    startPlay.alpha = 0
    startGroup.add(startPlay)
    game.add.tween(startPlay).to({
        y: CENTERY / GameScale,
        alpha: 1
    }, 500, Phaser.Easing.Back.Out, true, 400);


    openBtn = game.add.sprite(CENTERX / GameScale, CENTERY / GameScale + 320 * GameScale, 'openBtn')
    startGroup.add(openBtn)
    openBtn.anchor.setTo(.5, .5)
    openBtn.alpha = 0
    game.add.tween(openBtn).to({
        y: CENTERY / GameScale + 280 * GameScale,
        alpha: 1
    }, 600, Phaser.Easing.Back.Out, true, 600);
    openBtn.inputEnabled = true;
    openBtn.events.onInputDown.addOnce(onStartBtnClick);


}

function onStartBtnClick() {
    openBtn.inputEnabled = false;
    startGroup.destroy();
    startGroup = null;
    newStageElement();
}
/*******************************************************/
/***********************音乐区**************************/
var bgSound, toEatSound, toHpSound, FHpSound;

function SoundFun() {
    bgSound = game.add.audio('bg');
    bgSound.play('', 0, .3, true);
    toEatSound = game.add.audio('toEat');
    toHpSound = game.add.audio('toHp');
    FHpSound = game.add.audio('F_Hp');
    game.onResume.add(function () {
        bgSound.resume();
    }, this)
    game.onPause.add(function () {
        bgSound.pause();
        toEatSound.stop();
        toHpSound.stop();
        FHpSound.stop();
    }, this)
    /*$(window).focus(function () {
        bgSound.resume();

    });
    $(window).blur(function () {
        bgSound.pause();
        toEatSound.stop();
        toHpSound.stop();
        FHpSound.stop();
    });*/

}
/********************************************************/
function newStageElement() {
    //新建背景
    bg = game.add.tileSprite(0, 0, WIDTH, HEIGHT, 'bg')
    bg.tileScale.x = GameScale
    bg.tileScale.y = GameScale
    game.stage.backgroundColor = "#e8d59b";
    //建罗拨
    group = game.add.group();
    for (var i = 0; i < lNum; i++) {
        rou_b = group.create(0, 0, 'fish') //game.add.sprite(0,0,'fish')
        rou_b.body.setPolygon(0, 0, rou_b.width, 0, rou_b.width, rou_b.height / 2, 0, rou_b.height / 2)
        rou_b.anchor.setTo(.5, .5)
        rou_b.x = WIDTH / 2 + (Math.random() * 2 - 1) * 50
        rou_b.y = (HEIGHT - 250 + rou_b.height / 2) / lNum * i + 20
        rou_b.name = 'fish'

        //rou_b.body.immovable = true;

        rouArr.push(rou_b);
    }
    rouDNum = (HEIGHT * 2 - 100) / 10

    //建障碍
    dogGroup = game.add.group();
    dogTmerNum = (HEIGHT - 250) / tNum
    for (i = 0; i < tNum; i++) {
        addDogGroup(dogTmerNum * i, false, i)
    }
    dogH = dogArr[0].height
    //建主体
    tk = game.add.sprite(0, 0, 'duck_s')
    tk.animations.add('duck_s')
    tk_stop_Tween();
    tk_stop_inter = setInterval(tk_stop_Tween, 2500)

    tk.body.setPolygon(30, 5, 60, 5, 85, 55, 70, 80, 20, 80, 5, 55)

    tk.body.immovable = true;
    tk.anchor.setTo(.5, 0)

    tk.scale.setTo(1.5, 1.5)
    tk.x = WIDTH / 2
    tk.y = HEIGHT - 250

    tk.inputEnabled = true
    tk.events.onInputDown.add(tkCilck, this)



    //积分与时间
    style = {
        font: 50 * GameScale + "px Arial",
        fill: "#ffffff",
        align: "center",
        stroke: "#999",
        strokeThickness: 4
    };
    jfTxt = game.add.text(20, 20, '0', style)

    timerBar = game.add.graphics(0, 0)
    timerBar.beginFill(0xA3AA4B)
    timerBar.lineStyle(4, 0xA3AA4B)
    //timerBar.drawRect(-WIDTH * .6, 0, WIDTH * .6, 20 * GameScale)
    drawRoundRect(timerBar, 0, 0, WIDTH * .45, 16 * GameScale, 6 * GameScale)

    timerPos = game.add.graphics(0, 0)
    timerPos.beginFill(0xffffff);
    //timerPos.drawRect(-WIDTH * .6, 0, WIDTH * .6, 20 * GameScale)
    drawRoundRect(timerPos, 0, 0, WIDTH * .45, 16 * GameScale, 6 * GameScale)

    timerPos.x = timerBar.x = WIDTH * .55 - 45 * GameScale
    timerPos.y = timerBar.y = 45 * GameScale

    topHp = game.add.sprite(0, 0, 'topHp')
    topHp.anchor.setTo(.5, .5)
    topHp.scale.setTo(GameScale, GameScale)
    topHp.x = timerPos.x - topHp.width / 2 - 10 * GameScale
    topHp.y = timerPos.y + 5 * GameScale
    
    //提醒按钮
    remind=game.add.sprite(0,0,'remind')
    remind.anchor.setTo(.5,0)
    remind.x=tk.x+40
    remind.y=tk.y+90


    //fpstxt = game.add.text(10, 100, game.time.fps)

}

function tkCilck() {
    var t=game.add.tween(remind).to({
        alpha:0,
        y:remind.y+60
    },500,Phaser.Easing.Linear.None,true);
    t.onComplete.add(function (){
        remind.destroy()
    })
    tk.events.onInputDown.removeAll()
    playBool = true
    clearInterval(tk_stop_inter)
    tk.animations.stop()
    tk.loadTexture('play_duck', 1)
    tk.animations.add('play_duck')
    tk.play('play_duck', 20, true)
}

function tk_stop_Tween() {
    tk.play('duck_s', 25)
}
var update = function () {
    if (!endGameBool) {
        for (var i = 0; i < dogArr.length; i++) {
            var dogMc = dogArr[i]
            if (dogMc.rotatname == 'left') {
                if (dogMc.input.pointerDown1 === false) {
                    if (dogMc.kuai) {
                        dogMc.x += 4.5 * GameScale
                    } else
                        dogMc.x += 1.5 * GameScale

                }

                if (dogMc.x - dogMc.width / 2 >= WIDTH) {
                    dogMc.rotatname = 'rig'
                    dogMc.scale.setTo(1, 1)
                }
            } else {

                if (dogMc.input.pointerDown1 === false) {
                    //alert(0)
                    if (dogMc.kuai) {
                        dogMc.x -= 4.5 * GameScale
                    } else
                        dogMc.x -= 1.5 * GameScale
                }

                if (dogMc.x - dogMc.width / 2 <= 0) {
                    dogMc.rotatname = 'left'
                    dogMc.scale.setTo(-1, 1)
                }
            }
        }


        //启动动画
        if (playBool) {

            bg.tilePosition.y += sleepNum / GameScale


            var ct = rouArr[lNum - 1].x
            if (tkTweenBool) {
                var t = game.add.tween(tk).stop().to({
                    x: ct
                }, 2000, Phaser.Easing.Cubic.Out, true)
                t.onStart.add(function () {
                    tkTweenBool = false
                }, this)
            }
            //tk.x=rouArr[tNum-1].x-tk.height/2+rouArr[tNum-1].height/2

            game.physics.collide(tk, group, collisionCallback, null, this);
            game.physics.collide(tk, dogGroup, dogCollisionCallback, null, this)
            //game.physics.collide(tk, dogGroup);
            //group.y++
            for (var i = 0; i < rouArr.length; i++) {
                var mc = rouArr[i]
                mc.y += sleepNum

            }
            for (var i = 0; i < dogArr.length; i++) {
                var dogMc = dogArr[i]
                dogMc.y += sleepNum
                if (dogMc.y > HEIGHT + dogMc.height / 2) {
                    dogMc.destroy()
                    dogArr.splice(dogArr.length - 1, 1)
                }

            }


            if (dogTmerNum > dogH + 80) {
                dogTmerNum -= .005;
            }
            //console.log(dogArr[0].y,dogTmerNum - dogH / 2)
            if (dogArr[0].y > dogTmerNum - dogH / 2) {

                addDogGroup(-dogH / 2, true)
            }
        }
        //多点触控
        /*if (stageDown) {
        for (var i = 0; i < dragArr.length; i++) {
            for (var j = 0; j < dragArr[i].length; j++) {
                var mc = dragArr[i][j]
                var _x = dragArrPointerX[i][j]
                //jfTxt.setText(game.input.x)
                mc.x = mc.x + (_x.clientX - mc.x) * .1
            }
        }
    }*/
    }
};

function addGroup() {
    var ran
    if (HpNum < 2)
        ran = Math.round(Math.random() * 5) - 1;
    else if (HpNum <= 2)
        ran = Math.round(Math.random() * 7) - 1;
    else
        ran = Math.round(Math.random() * 8) - 1;
    //console.log(ran)
    var sti = 'fish'
    if (ran == -1) {
        sti = 'fish_hp'
    }
    rou_b = group.create(0, 0, sti) //game.add.sprite(0,0,'fish')
    rou_b.body.setPolygon(0, 0, rou_b.width, 0, rou_b.width, rou_b.height / 2, 0, rou_b.height / 2)
    rou_b.anchor.setTo(.5, .5)
    rou_b.x = WIDTH / 2 + (Math.random() * 2 - 1) * 50
    rou_b.y = -rou_b.height
    rou_b.name = sti
    rouArr.unshift(rou_b);

}

function addDogGroup(_y, isStart, id) {
    var dog
    if (isStart) {
        var ran = Math.round(Math.random() * 3) - 1
        if (ran == -1)
            dog = dogGroup.create(0, 0, 'block_d')
        else
            dog = dogGroup.create(0, 0, 'block')
        ran = Math.round(Math.random() * 5) - 1
        if (ran == 1) {
            dog.kuai = true
        }
    } else {
        dog = dogGroup.create(0, 0, 'block')
    }
    dog.animations.add('block')
    if (dog.kuai) {
        dog.play('block', 50, true)
    } else
        dog.play('block', 25, true)

        dog.x = Math.random() * (WIDTH - dog.width)
    dog.y = _y
    dog.body.bounce.setTo(1, 1);
    //dog.body.checkCollision=false
    dog.body.setPolygon(dog.width / 8, dog.height / 8, dog.width - dog.width / 8, dog.height / 8, dog.width - dog.width / 8, dog.height - dog.height / 8, dog.width / 8, dog.height - dog.height / 8)
    if (Math.round(Math.random()) == 1) {
        dog.rotatname = 'left'
        dog.scale.setTo(-1, 1)

    } else {
        dog.rotatname = 'rig'
        dog.scale.setTo(1, 1)

    }
    dog.anchor.setTo(.5, .5)



    dog.id = id

    dog.input.pointerDown1 = false

    dog.input.start(0, true);
    dog.input.enableDrag()
    dog.input.allowVerticalDrag = false;
    /*dog.input.enableSnap(1,1,false,true)*/
    dog.inputEnabled = true
    dog.events.onInputDown.add(dogDown, this)
    dog.events.onInputUp.add(dogUp, this)
    //dog.events.onInputOver.add(dogOver, this)

    //dog.events.onInputOver.add(dogDown,this)
    //console.log(dog.input.enableDrag)



    if (isStart)
        dogArr.unshift(dog)
    else {

        dogArr.push(dog)
    }

}

function dogUp(mc) {
    /*var id = game.input.activePointer.id
    jfTxt.setText(game.input.pointer1.isDown + ':' + id + 'a')
    var p1=game.input.pointer1.isDown
    var p2=game.input.pointer2.isDown
    //判断第一触点是否处由点击状态
    if (id !== 0) //鼠标除外
    {
        //二点按着，一点释放，id为1,(!p1,p2)
        if (p1&&!p2) {
            id = 2
        }else if(!p1&&p2){
            id=1
        }
        fpstxt.setText(game.input.pointer2.isDown + ':' + id )
    }

    //console.log(id)
    for (var i = 0; i < dragArr[id].length; i++) {
        var _mc = dragArr[id][i]
        _mc.input.pointerDown1 = false;
    }
    dragArr[id] = []
    dragArrPointerX[id] = []
    var t
    for (var i = 0; i < dragArr.length; i++) {
        if (dragArr[i].length > 0) {
            t = true
            break;
        }
    }
    if (!t) {
        stageDown = false
    }*/

    //game.input.recordPointerHistory = true
    /*mc.touch = null
    game.canvas.onmousemove = null
    game.canvas.touchmove = null*/
    //dragArr = [[], [], [], []]
    //dragArrPointerX = [[], [], [], []]
    mc.input.pointerDown1 = false
}

function dogDown(mc) {
    mc.input.pointerDown1 = true;
    /*stageDown = true
    var id = game.input.activePointer.id
    dragArr[id].push(mc)
    dragArrPointerX[id].push(game.input.activePointer)
    console.log(dragArr)*/
    //console.log(game.input.activePointer)
    //jfTxt.setText(game.input.activePointer.id)
    /*game.canvas.onmousemove=function (e){
        //console.log(e.offsetX)
        mc.x=game.input.mouse.event.x
        jfTxt.setText(game.input.pointer1)
    }
    game.canvas.addEventListener('touchmove',function (e){
        
        var touch = e.targetTouches[0];
        jfTxt.setText(touch.pageX)
        mc.x=touch.pageX
    })
    game.canvas.addEventListener('touchend',function (e){
        
    })
   game.input.pointer1.timeDown=function (){
       jfTxt.setText(game.input.pointer1)
   }*/

};

/*function dogOver(mc) {
    if (stageDown) {
        var id = game.input.activePointer.id
        dragArr[id].push(mc)
        dragArrPointerX[id].push(game.input.activePointer)
    }
}*/


function collisionCallback(obj1, obj2) {
    tkTweenBool = true
    jfNum++

    //console.log(0)
    if (obj2.name.indexOf('fish') == 0) {
        obj2.destroy();
        rouArr.splice(lNum - 1, 1)
        addGroup()
        if (obj2.name == 'fish_hp') {
            HpNum++
            if (HpNum >= 3) {
                HpNum = 3
            }
            hpTween()
            toHpSound.play();
        } else {
            toEatSound.play()
        }
        var t = game.add.tween(jfat_obj).stop().to({
            x: jfNum * 100
        }, 1000, Phaser.Easing.Cubic.Out, true)

        t.onUpdateCallback(function () {
            jfTxt.setText(Math.round(jfat_obj.x).toString())
        })


    }
}

function hpTween() {
    if (HpNum > 0) {
        var eas = Phaser.Easing.Back.Out
    } else {
        eas = Phaser.Easing.Cubic.Out
    }
    var s = game.add.tween(timerPos.scale)
    s.to({
        x: HpNum / 3
    }, 500, eas)
    s.start()
}

function dogCollisionCallback(obj1, obj2) {
    //console.log(timerPos.width)
    obj2.body.checkCollision = false;
    if (!tkWDBool) {
        FHpSound.play()
        HpNum--;
        hpTween()
        if (HpNum <= 0) {

            setTimeout(endGame, 500)
        }
        //无敌1秒
        tkWDBool = true
        if (!endGameBool) {
            setTimeout(function () {
                if (!endGameBool) {
                    tkWDBool = false
                    var len = obj1.animations._outputFrames.length
                    var t = obj1.animations.currentFrame.index
                    var tArr = []
                    for (var i = t; i < len + t; i++) {

                        if (i >= len) {
                            tArr.push(i - len)
                        } else {
                            tArr.push(i)
                        }
                    }
                    obj1.loadTexture('play_duck')
                    obj1.animations.add('play_duck', tArr)
                    obj1.play('play_duck', 20, true)
                }
            }, 2500)

            var len = obj1.animations._outputFrames.length
            var t = obj1.animations.currentFrame.index
            var tArr = []
            for (var i = t; i < len + t; i++) {

                if (i >= len) {
                    tArr.push(i - len)
                } else {
                    tArr.push(i)
                }
            }
            obj1.loadTexture('play_duck_wd')
            obj1.animations.add('play_duck_wd', tArr)
            obj1.play('play_duck_wd', 20, true)
        }
    }
}



var render = function () {
    if (isDebug) {
        //game.debug.renderText('id: ', 32, 96);
        game.debug.renderPhysicsBody(tk.body)
        for (var i = 0; i < rouArr.length; i++) {
            var mc = rouArr[i]
            game.debug.renderPhysicsBody(mc.body)
        }
        for (var i = 0; i < dogArr.length; i++) {
            var dog = dogArr[i]
            game.debug.renderPhysicsBody(dog.body)
            if (i == dogArr.length - 1) {
                game.debug.renderSpriteInputInfo(dog, 20, 20)
                game.debug.renderSpriteInfo(dog, 20, 100)
                //jfTxt.setText(dog.input.pointerDown1+'')
            }
        }
        //game.debug.renderInputInfo(32, 32)
        /*game.debug.renderPointer(game.input.mousePointer);
        game.debug.renderPointer(game.input.pointer1);
        game.debug.renderPointer(game.input.pointer2);
        game.debug.renderPointer(game.input.pointer3);
        game.debug.renderPointer(game.input.pointer4);
        game.debug.renderPointer(game.input.pointer5);
        game.debug.renderPointer(game.input.pointer6);*/
        //fpstxt.setText(game.time.fps)
    }
};

function endGame() {
    bgSound.stop()
    endGameBool = true
    playBool = false
    dogGroup.callAll('kill')
    dogGroup.destroy()
    bg.destroy()
    group.callAll('kill')
    group.destroy()
    tk.destroy()
    jfTxt.destroy()
    timerBar.destroy()
    timerPos.destroy()
    //rouArr=[]
    //dogArr=[]
    Over.show(jfNum * 100, game.time.fpsMax)

}
document.addEventListener('touchmove', function (e) {
    e.preventDefault();
}, false);


function restartGame() {
    jfNum = 0;
    rouDNum = 0;
    tkTweenBool = true;
    tkWDBool = false;
    HpNum = 3;
    endGameBool = false
    rouArr = []
    dogArr = []
    bgSound.play('', 0, .3, true);
    newStageElement()
}
document.addEventListener('touchmove', function (e) {
    e.preventDefault();
}, false);



var game = new Phaser.Game(WIDTH, HEIGHT, Phaser.CANVAS, 'game', {
    preload: preload,
    create: create,
    update: update, //update执行在魅族有双重阴子。
    render: render
});


var drawRoundRect = function (mc, x, y, w, h, radius) {
    var leftTop, rigTop, leftDow, rigDow,
        r_x, r_y, xyPoint;
    if (Number(radius)) {
        leftTop = rigTop = leftDow = rigDow = radius;
    } else if (Object(radius)) {
        leftTop = radius.leftTop;
        rigTop = radius.rigTop;
        leftDow = radius.leftDow;
        rigDow = radius.rigDow;
    }
    mc.moveTo(x + leftTop, y)
    mc.lineTo(x + w - rigTop, y)
    drawCircle(rigTop, {
        x: x + w - leftTop,
        y: y + rigTop
    }, -Math.PI / 2)
    mc.lineTo(x + w, y + h - rigTop - rigDow)
    drawCircle(rigDow, {
        x: x + w - rigDow,
        y: y + h - rigDow
    })
    mc.lineTo(x + leftDow, y + h)
    drawCircle(leftDow, {
        x: x + leftDow,
        y: y + h - leftDow
    }, Math.PI / 2)
    mc.lineTo(x, y + leftTop)
    drawCircle(leftTop, {
        x: x + leftTop,
        y: y + leftTop
    }, Math.PI)
    mc.endFill()

    function drawCircle(_radius, _xyP, _PI, _r) {
        _r = _r ? _r : 0
        _PI = _PI ? _PI : 0
        for (i = 0; i < _radius; i++) {
            _r += ((90 / _radius) / 180) * Math.PI;
            r_x = _xyP.x + _radius * Math.cos(_r + _PI);
            r_y = _xyP.y + _radius * Math.sin(_r + _PI);
            mc.lineTo(r_x, r_y);
        }

    }
}