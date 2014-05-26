(function (C) {
    var clientRect = document.body.getBoundingClientRect();
    //屏幕宽度
    var WIDTH = ( !! window.navigator.userAgent.match(/Android/) ? 640 : window.innerWidth * devicePixelRatio);

    //屏幕高度
    var HEIGHT = ( !! window.navigator.userAgent.match(/Android/) ? (clientRect.height * 640 / clientRect.width) : window.innerHeight * devicePixelRatio);

    var SAFE_ZONE_HEIGHT = 1136,
        GameScale = Math.round(10000 * HEIGHT / SAFE_ZONE_HEIGHT) / 10000;


    //定义舞台的坐标等常量
    var CENTERX = WIDTH / 2,
        CENTERY = HEIGHT / 2;

    var imgManifest = [
        {
            "src": 'images/titleTxt.png',
            id: "titleTxt"
        }
    ],
        loadData = [];

    var i, j;

    var stage, Canvas, load;

    var leadMovie, gameSting, bloNum, doubleMc;

    var gradeTxt, gradeNum, empNum, gridW, gridH, gridMovie;

    var mouseMoveBool = true;

    var d_X = 50,
        d_Y = 180 * GameScale;

    var gridSprArr = [],
        gridSprArr_Back = [],
        gradeNumArr_Back = [],
        gridIdArr = [],
        gridColor = {
            top: ['#ffffde', '#ffd68e', '#ffc18e', '#ff8e8e', '#ff8ec8', '#e38eff', '#7c60f1', '#4850f0', '#48abf0', '#50f048', '#ff5555'],
            dow: ['#c3c38c', '#c29c58', '#c7834b', '#bf4949', '#cc5994', '#b45ed0', '#533eab', '#282fac', '#307baf', '#2db126', '#b12626']
        };
    //返回按钮与当前步数；
    var backSpr, backNum = 0,
        backHome,
        tdelay = .3;


    var loade = function () {
        load = new C.LoadQueue(false)
        load.addEventListener("fileload", loadFileLoad);
        load.addEventListener("complete", loadComplete);
        load.loadManifest(imgManifest)
    },
        loadFileLoad = function (e) {
            //console.log(e.target.progress)
            //if (e.item.type == "image") { loadData[e.item.id] = e.result; }
            loadData[e.item.id] = e.result;
        },
        loadComplete = function (e) {
            $('body').css({
                'background-color': '#ede9de'
            })
            $('#loading').hide()
            newLead()
            //newStageElement()
        };

    function newLead() {
        leadMovie = new C.MovieClip();
        stage.addChild(leadMovie);

        var titleTxt = new C.Bitmap(loadData.titleTxt)
        titleTxt.x = CENTERX - titleTxt.image.width / 2;
        titleTxt.y = CENTERY - 350;
        leadMovie.addChild(titleTxt);

        var leadBg = new C.Shape();
        leadBg.graphics.f('#d8caa3').dc(CENTERX, CENTERY, 180).endFill();
        leadMovie.addChild(leadBg);

        var leftBtnMc = new C.MovieClip()
        var left_btn = new C.Shape();
        left_btn.drawBnt(110, 80, 10);
        var left_txt = new C.Text('2048', '40px menlo', '#856a28')
        left_txt.x = 5
        left_txt.y = 18
        //left_txt.textAlign="center";
        leftBtnMc.addChild(left_btn);
        leftBtnMc.addChild(left_txt);
        leftBtnMc.x = CENTERX - 220;
        leftBtnMc.y = CENTERY + 240;
        leadMovie.addChild(leftBtnMc);

        var centBtnMc = new C.Shape();
        centBtnMc.drawBnt(180, 80, 10);
        centBtnMc.graphics.f('#856a28').mt(80, 20).lt(110, 40).lt(80, 60).endFill();
        leadMovie.addChild(centBtnMc);
        centBtnMc.x = CENTERX - 90;
        centBtnMc.y = CENTERY + 240;

        var rigBtnMc = new C.Shape();
        rigBtnMc.drawBnt(110, 80, 10);
        /*rigBtnMc.graphics.f('#856a28').mt(55, 20).lt(55 + 2.5 / 7 * 20, 40 - 2.5 / 7 * 20).lt(75, 40 - 1.5 / 7 * 20).lt(55 + 4 / 7 * 20, 40 + 2 / 7 * 20).lt(55 + 4.5 / 7 * 20, 40 + 20).lt(55, 40 + 5 / 7 * 20).lt(55 - 4.5 / 7 * 20, 60).lt(55 - 4 / 7 * 20, 40 + 2 / 7 * 20).lt(35, 40 - 1.5 / 7 * 20).lt(55 - 2.5 / 7 * 20, 40 - 2.5 / 7 * 20).ef()*/
        rigBtnMc.graphics.f('#856a28').drawPolyStar(55, 40, 25, 5, .45, -90);
        leadMovie.addChild(rigBtnMc);
        rigBtnMc.x = CENTERX + 110;
        rigBtnMc.y = CENTERY + 240;


        leftBtnMc.addEventListener('click', function () {
            startGame()
        })
        centBtnMc.addEventListener('click', function () {
            gameSting = 'Fixed'
            startGame()
        })
        rigBtnMc.addEventListener('click', function () {
            gameSting = 'Double'
            startGame()
        })
    }

    function startGame() {
        TweenLite.to(leadMovie, .5, {
            alpha: 0,
            onComplete: newStageElement
        })
    }
    C.Shape.prototype.drawBnt = function (w, h, r, c) {
        if (c) {
            var _x = -w / 2
            var _y = -h / 2
        } else {
            _x = 0;
            _y = 0;
        }
        this.graphics.f('#c3c38c').rr(_x, _y + 4, w, h, r).endFill();
        this.graphics.f('#ffffde').rr(_x, _y, w, h, r).endFill();

    }

    function newStageElement() {
        //监听鼠标事件
        mouseMoveFun()
        //新建头部相关内容
        /*var titleTxt = new C.Bitmap(loadData.titleTxt)
        titleTxt.x = CENTERX - titleTxt.image.width / 2
        titleTxt.y = 60;


        stage.addChild(titleTxt)*/

        var titleBg = new C.Shape();
        titleBg.graphics.beginFill('#d8caa3');
        titleBg.graphics.drawRect(0, 40 * GameScale, WIDTH, 100 * GameScale)
        titleBg.graphics.endFill()
        var titleBgShadow = new C.Shadow("#e5d8b3", 0, 5, 5)
        titleBg.shadow = titleBgShadow
        //titleBg.shadow={color:0,offsetX:0,offsetY:5,blur:5}
        stage.addChild(titleBg)

        //新建计分文本
        gradeNum = 0
        gradeTxt = new C.Text(gradeNum.toString(), 80 * GameScale + "px menlo", "#ffffff");
        gradeTxt.textAlign = "center"
        gradeTxt.x = CENTERX
        gradeTxt.y = 50 * GameScale
        //console.log(gradeTxt.getMeasuredWidth())
        stage.addChild(gradeTxt);

        //新建1024外框
        empNum = 10
        var G_X = WIDTH - 100,
            G_Y = HEIGHT - 350 * GameScale;
        gridW = (G_X - empNum * 6) / 4,
        gridH = (G_Y - empNum * 6) / 4;
        var dowBg = new C.Shape();
        dowBg.graphics.f('#e5d8b3').rr(d_X, d_Y, WIDTH - 100, HEIGHT - 350 * GameScale, 20);
        stage.addChild(dowBg)

        //新建返回
        backSpr = new C.Shape();
        stage.addChild(backSpr)
        backSpr.drawBnt(80, 50, 10);
        backSpr.graphics.f('#c29c58').mt(20, 25).lt(40, 12).lt(40, 20).lt(55, 12).lt(55, 38).lt(40, 30).lt(40, 38).lt(20, 25).ef()
        //backSpr.shadow=titleBgShadow;
        backSpr.x = CENTERX - 40;
        backSpr.y = 1000 * GameScale;
        backSpr.scaleX = backSpr.scaleY = 1.5
        /*backSpr.addEventListener('click', backFun)
        var matrix = new createjs.ColorMatrix().adjustSaturation(-100);
        backSpr.filters=[new C.ColorMatrixFilter(matrix)]
        backSpr.cache(0, 0, 80, 55)*/

        backHome = new C.Shape();
        backHome.drawBnt(80, 60, 10, true);
        backHome.graphics.f("#c29c58").s().p("Ah7CZIAAiRIg6AAIC1igIC2CgIg6AAIAACRg");
        stage.addChild(backHome)
        backHome.x = 90
        backHome.y = 1040 * GameScale
        backHome.addEventListener('click', backHomeFun)

        //新建1024背景方块
        for (i = 0; i < 4; i++) {
            gridSprArr.push([])
            for (j = 0; j < 4; j++) {
                var gridBg = new C.Shape();
                gridBg.graphics.f('#d8caa3').rr(0, 0, gridW, gridH, 10).ef();
                gridBg.x = (gridW + empNum) * i + d_X + empNum + 5;
                gridBg.y = (gridH + empNum) * j + d_Y + empNum + 5;
                stage.addChild(gridBg);
                gridSprArr[i].push(null);
            }
        }

        idArrSort();
        inct();

        TweenLite.from(stage, .5, {
            //y: '30',
            alpha: 0
        })
    };
    //id重新排序与插入
    function idArrSort() {
        gridIdArr = []
        for (i = 0; i < 16; i++) {
            if (!gridSprArr[Math.floor(i / 4)][i % 4])
                gridIdArr.push(i)
        }
        gridIdArr.sort(function (a, b) {
            return a > b ? 1 : -1
        })
        //console.log(gridIdArr)
    }
    //开场插入
    function inct() {
        gridSprArr_Back[backNum] = []
        gradeNumArr_Back.push(0);
        gridMovie = new C.MovieClip();
        stage.addChild(gridMovie);
        gridMovie.x = d_X + empNum + 5;
        gridMovie.y = d_Y + empNum + 5;

        var t_id

        //对游戏类型操作
        switch (gameSting) {
        case 'Fixed':
            var tarr = [5, 6, 9, 10];
            t_id = tarr[Math.round(Math.random() * (tarr.length - 1))];
            bloNum = t_id;
            newGrid(-1, t_id);
            gridSprArr_Back[backNum].push({
                cid: -1,
                id: t_id
            });
            break;
        case 'Double':
            t_id = gridIdArr[Math.round(Math.random() * (gridIdArr.length - 1))];
            newGrid(-2, t_id);
            newDouble()
            gridSprArr_Back[backNum].push({
                cid: -2,
                id: t_id
            });
            break;
        default:
            break;
        };

        var stratNum = Math.ceil(Math.random() * 2) + 1
        for (i = 0; i < stratNum; i++) {
            var gridNum = Math.ceil(Math.random() * 7)
            if (gridNum === 1) {
                var cid = 1
            } else
                cid = 0 //Math.round(Math.random() * 9)
            t_id = gridIdArr[Math.round(Math.random() * (gridIdArr.length - 1))]
            newGrid(cid, t_id)
            gridSprArr_Back[backNum].push({
                cid: cid,
                id: t_id
            });
        }
        //gridSprArr_Back.push(gridSprArr);
        //console.log(gridSprArr_Back)
    }

    function newDouble() {
        var id = gridIdArr[Math.round(Math.random() * (gridIdArr.length - 1))];
        doubleMc = new C.Shape();
        doubleMc.graphics.f('#fce39d').drawPolyStar(0, 0, 30, 5, .45, -90)
        bloNum = id;
        stage.addChild(doubleMc);
        doubleMc.x = (gridW + empNum) * (id % 4) + gridW / 2 + d_X + empNum + 5
        doubleMc.y = (gridH + empNum) * Math.floor(id / 4) + gridH / 2 + d_Y + empNum + 5
        stage.swapChildren(doubleMc, gridMovie)
    }

    function newGrid(cid, id, delay) {
        if (!delay)
            delay = 0;
        var gridSpr = new C.MovieClip();
        if (gameSting) {
            if (cid >= 9) {
                cid = 9
            }
        } else {
            if (cid >= 10) {
                cid = 10
            }
        }

        gridSpr.cid = cid


        var gridbg = new C.Shape();
        var d_Color = gridColor.dow[cid],
            t_Color = gridColor.top[cid],
            txt = (Math.pow(2, cid + 1)).toString(),
            gridTxt;
        if (gameSting && cid < 0) {
            t_Color = '#5b738e';
            d_Color = '#2f3e4e';
            if (cid === -4) {
                t_Color = '#9de0ff';
                d_Color = '#3093c1';
            }
            txt = 0;
        }
        gridbg.graphics.f(d_Color).rr(-gridW / 2, -gridH / 2 + 5, gridW, gridH, 10).ef().f(t_Color).rr(-gridW / 2, -gridH / 2, gridW, gridH, 10).ef();
        //rf(["#ffffff",t_Color], [0, 1], 0, 0, 0, 0, 0, gridH/2)
        gridSpr.addChild(gridbg);


        if (cid === -2) {
            gridTxt = new C.Shape();
            gridTxt.graphics.f('#2f3e4e').drawPolyStar(gridW / 2, gridH / 2, 30, 5, .45, -90);
            gridTxt.x = -gridW / 2;
            gridTxt.y = -gridH / 2;
        } else if (cid === -4) {
            gridTxt = new C.Shape();
            gridTxt.graphics.s('#ffffff').ss(5, 1, 1).f('#ffcf5c').drawPolyStar(gridW / 2, gridH / 2, 30, 5, .45, -90);
            gridTxt.x = -gridW / 2;
            gridTxt.y = -gridH / 2;
        } else {
            gridTxt = new C.Text(txt, 50 + "px menlo", d_Color);
            gridTxt.textAlign = "center"
            gridTxt.textBaseline = "middle"
        }

        gridSpr.addChild(gridTxt)
        gridSpr.id = id;
        gridIdArr = _.without(gridIdArr, gridSpr.id);

        gridSpr.x = (gridW + empNum) * (gridSpr.id % 4) + gridW / 2
        gridSpr.y = (gridH + empNum) * Math.floor(gridSpr.id / 4) + gridH / 2 //- 50

        gridSpr.name = 'grid' + id

        gridSprArr[Math.floor(gridSpr.id / 4)][(gridSpr.id % 4)] = gridSpr;

        //TweenLite.to(gridSpr,.3,{startAt:{alpha:0,scaleX:0}})
        TweenLite.set(gridSpr, {
            alpha: 0,
            scaleX: 0,
            scaleY: 0
        });
        TweenLite.to(gridSpr, .3, {
            alpha: 1,
            scaleX: 1,
            scaleY: 1,
            delay: delay,
            //y: (gridH + empNum) * Math.floor(gridSpr.id / 4) + gridH / 2,
            ease: Back.easeInOut
        })

        gridMovie.addChild(gridSpr);
    };
    //返回首页
    function backHomeFun() {
        stage.removeAllChildren();
        stage.removeAllEventListeners()
        backNum = 0
        gridSprArr = []
        gridSprArr_Back = []
        gradeNumArr_Back = []
        gameSting=''
        newLead()
    }

    //添加back事件
    function addBackFun() {
        if (backNum > 0) {
            TweenLite.to(backSpr, .3, {
                easel: {
                    saturation: 1
                }
            })
            backSpr.addEventListener('click', backFun)
        }
    }
    //去除back监听事件
    function remBackFun() {
        backSpr.removeAllEventListeners('click');
        /*TweenLite.to(backSpr, .3, {
            easel: {
                saturation: 0
            }
        })*/
        var matrix = new createjs.ColorMatrix().adjustSaturation(-100);
        backSpr.filters = [new C.ColorMatrixFilter(matrix)]
        backSpr.cache(0, 0, 80, 55)
    }
    //后退操作
    function backFun() {
        gradeNumArr_Back.splice(backNum, 1);
        gridMovie.removeAllChildren()
        for (i = 0; i < 4; i++) {
            for (j = 0; j < 4; j++) {
                gridSprArr[i][j] = null
            }
        }
        for (i = 0; i < gridSprArr_Back[backNum - 1].length; i++) {
            newGrid(gridSprArr_Back[backNum - 1][i].cid, gridSprArr_Back[backNum - 1][i].id)
            if (gridSprArr_Back[backNum - 1][i].cid === -2) {
                doubleMc.visible = true
            }
        }
        idArrSort()

        backNum--

        gradeNum = gradeNumArr_Back[backNum]
        gradeTxt.text = gradeNum
        remBackFun()
        TweenLite.delayedCall(.5, addBackFun)
    }
    //获取移动方面
    var mousePoint = {
        start: {
            x: 0,
            y: 0
        },
        end: {
            x: 0,
            y: 0
        }
    }, mouseSting, xBool, yBool;
    var reg = /^\d+(?=\.{0,1}\d+$|$)/,
        t_x, t_y, isGridTween;
    var mergeArr = [];

    function mouseMoveFun() {
        stage.addEventListener('stagemousedown', function (e) {
            mousePoint.start.x = e.target.mouseX;
            mousePoint.start.y = e.target.mouseY;
        });
        stage.addEventListener('stagemouseup', function (e) {
            mousePoint.end.x = e.target.mouseX;
            mousePoint.end.y = e.target.mouseY;
            t_x = mousePoint.end.x - mousePoint.start.x
            t_y = mousePoint.end.y - mousePoint.start.y;
            mouseSting = '';
            if ((t_x + t_y > 10 || t_x + t_y < -10) && mouseMoveBool) {
                judgeMouse();
            }
        });

        function judgeMouse() {

            xBool = reg.test(t_x);
            yBool = reg.test(t_y)

            if (xBool && yBool) {
                if (t_x > t_y) {
                    mouseSting = 'rig'
                } else {
                    mouseSting = 'down'
                }
            } else if (xBool && !yBool) {
                if (t_x > -t_y) {
                    mouseSting = 'rig'
                } else {
                    mouseSting = 'top'
                }
            } else if (!xBool && yBool) {
                if (-t_x > t_y) {
                    mouseSting = 'left'
                } else {
                    mouseSting = 'down'
                }
            } else if (!xBool && !yBool) {
                if (-t_x > -t_y) {
                    mouseSting = 'left'
                } else {
                    mouseSting = 'top'
                }
            }
            isGridTween = false
            mergeArr = [false, false, false, false]
            gridReady()
        }
    }

    function gridReady() {

        if (mouseSting == 'left' || mouseSting == 'top') {
            for (var ti = 0; ti < 4; ti++) {
                for (var tj = 0; tj < 4; tj++) {
                    var mc = gridSprArr[ti][tj]
                    if (mc) {
                        isTweenFun(ti, tj)
                    }
                }
            }
        } else if (mouseSting == 'rig' || mouseSting == 'down') {
            for (ti = 3; ti >= 0; ti--) {
                for (tj = 3; tj >= 0; tj--) {
                    if (gridSprArr[ti][tj]) {
                        isTweenFun(ti, tj)
                    }

                }
            }
        }
        if (mouseMoveBool) {
            isGridTweenFun();
        } else {
            TweenLite.delayedCall(1.5, isGridTweenFun);
        }
    }

    function isGridTweenFun() {
        if (isGridTween) {
            var gridNum = Math.ceil(Math.random() * 4)
            if (gridNum === 1) {
                var cid = 1
            } else cid = 0
            var id = gridIdArr[Math.round(Math.random() * (gridIdArr.length - 1))]

            newGrid(cid, id, .3)
            endGame()
            //去除返回按钮事件
            remBackFun();
            TweenLite.delayedCall(.5, addBackFun)

            //插入上一步，直接push数组，数组内容相同；
            backNum++
            gridSprArr_Back[backNum] = []
            for (i = 0; i < 4; i++) {
                for (j = 0; j < 4; j++) {
                    if (gridSprArr[i][j]) {
                        gridSprArr_Back[backNum].push({
                            cid: gridSprArr[i][j].cid,
                            id: gridSprArr[i][j].id
                        })
                    }
                }
            }
            //console.log(gridSprArr,gridSprArr_Back)
            gradeNumArr_Back.push(gradeNum);
        }
    }

    function endGame() {
        var endGameBoolArr = [];
        if (gridIdArr.length <= 0) {
            for (i = 0; i < 4; i++) {
                for (j = 0; j < 4; j++) {
                    var mc = gridSprArr[i][j];
                    var l_mc = gridSprArr[i][j - 1];
                    var r_mc = gridSprArr[i][j + 1];
                    var t_mc = null,
                        d_mc = null;
                    if (i > 0)
                        t_mc = gridSprArr[i - 1][j];
                    if (i <= 2)
                        d_mc = gridSprArr[i + 1][j];
                    if (l_mc && mc.cid === l_mc.cid) {
                        endGameBoolArr[i * 4 + j] = false
                    } else if (r_mc && mc.cid === r_mc.cid) {
                        endGameBoolArr[i * 4 + j] = false
                    } else if (t_mc && mc.cid === t_mc.cid) {
                        endGameBoolArr[i * 4 + j] = false
                    } else if (d_mc && mc.cid === d_mc.cid) {
                        endGameBoolArr[i * 4 + j] = false
                    } else {
                        endGameBoolArr[i * 4 + j] = true
                    }
                }
            }
            //console.log(endGameBoolArr)
            if (!_.contains(endGameBoolArr, false)) {
                TweenLite.delayedCall(.7 + tdelay, GameOver)
            }
        }
    }

    function GameOver() {
        alert('game over')
    }
    /*************************************************
     **不合并移动，合并移动，合并不移动，不合并不移动四种类型**
     **************************************************/
    //判断是否有移动
    function isTweenFun(ci, cj) {
        var tmc, b_t;
        var mc = gridSprArr[ci][cj]
        var c_i = ci,
            c_j = cj,
            i_num = Math.floor(bloNum / 4),
            j_num = bloNum % 4
        for (i = 0; i < 4; i++) {
            switch (mouseSting) {
            case 'left':
                c_j = i
                b_t = c_i
                if (gameSting === 'Fixed' && i_num == b_t) {
                    if (mc.id > bloNum) {
                        c_j = c_j + j_num
                    }
                }
                break;
            case 'rig':
                c_j = 3 - i
                b_t = c_i
                if (gameSting === 'Fixed' && i_num == b_t) {
                    if (mc.id < bloNum) {
                        c_j = j_num - i
                    }
                }
                break;
            case 'top':
                c_i = i
                b_t = c_j
                if (gameSting === 'Fixed' && j_num == b_t) {
                    if (mc.id > bloNum) {
                        c_i = c_i + i_num
                    }
                }
                break;
            case 'down':
                c_i = 3 - i
                b_t = c_j
                if (gameSting === 'Fixed' && j_num == b_t) {
                    if (mc.id < bloNum) {
                        c_i = i_num - i
                    }
                }
                break;
            default:
                console.log('eror')
                break;
            };


            tmc = gridSprArr[c_i][c_j]

            if ((!tmc || tmc === mc) && mc.cid !== -1) {
                if (tmc !== mc)
                    isGridTween = true

                mc.id = c_i * 4 + c_j
                gridSprArr[ci][cj] = null
                gridSprArr[c_i][c_j] = mc;
                //if (mc.cid < 10)
                isMergeFun(c_i, c_j);
                startTweenMc(mc);
                idArrSort()
                //双倍操作
                if (mc.cid === -2 && mc.id === bloNum) {
                    mouseMoveBool = false;
                    //判断有没合并，有合并延时.5秒再作番倍,不延时for循环没结束，得到到当前步有没有合拼；
                    TweenLite.delayedCall(.5, DoubleDelay)
                }
                break;
            }
        }
    }
    //判断双倍
    function DoubleDelay() {
        if (_.contains(mergeArr, true)) {
            TweenLite.delayedCall(.4, DoubleFun)
        } else {
            DoubleFun()
        }
    }

    function DoubleNew(mc) {
        if (mc.cid === -2) {
            newGrid(-4, mc.id)
        } else {
            newGrid(mc.cid + 1, mc.id)
        }
        gridMovie.removeChild(mc);
    }

    function DoubleFun() {
        doubleMc.visible = false;
        for (i = 0; i < gridMovie.children.length; i++) {
            var mc = gridMovie.children[i];

            if (mc.cid === -2) {
                var d = 0

            } else {
                d = .5

            }
            TweenLite.to(mc, .3, {
                delay: d,
                scaleX: 0,
                onComplete: DoubleNew,
                onCompleteParams: [mc]
            })
            gradeNum += Math.pow(2, mc.cid + 1) * 2 - (mc.cid + 2)
        }
        gradeNumArr_Back.push(gradeNum)

        gradeTxt.text = gradeNum
        remBackFun()
        TweenLite.delayedCall(.5, addBackFun)
        TweenLite.delayedCall(.5, function () {
            mouseMoveBool = true
        });

    }
    //计算是否有合并
    function isMergeFun(ti, tj) {
        var me_arr, ci = ti,
            cj = tj;
        switch (mouseSting) {
        case 'left':
            cj = tj - 1
            me_arr = ti
            break;
        case 'rig':
            cj = tj + 1
            me_arr = ti
            break;
        case 'top':
            ci = ti - 1
            me_arr = tj
            break;
        case 'down':
            ci = ti + 1
            me_arr = tj
            break;
        default:
            console.log('eror')
            break;
        };
        if (gridSprArr[ci] && gridSprArr[ci][cj]) {
            if (gridSprArr[ti][tj].cid == gridSprArr[ci][cj].cid && !mergeArr[me_arr]) {
                mergeArr[me_arr] = true
                gridSprArr[ti][tj].mergeBool = true
                gridSprArr[ti][tj].toID = ci * 4 + cj
                gridSprArr[ti][tj] = null
                //gridSprArr[ci][cj] = null
                //console.log(ti, tj)
            }
        }
    }
    //开始移动
    function startTweenMc(mc) {
        //TweenLite.killTweensOf(mc, true)
        //TweenLite.killDelayedCallsTo(MergeMc, true)
        if (mc.cid !== -1)
            if (mc.mergeBool) {
                isGridTween = true
                TweenLite.to(mc, .3, {
                    x: (gridW + empNum) * (mc.toID % 4) + gridW / 2,
                    y: (gridH + empNum) * Math.floor(mc.toID / 4) + gridH / 2,
                    ease: Circ.easeInOut
                })
                var id = mc.toID
                var ci = Math.floor(id / 4)
                var cj = id % 4
                var c_mc = gridSprArr[ci][cj]
                //TweenLite.delayedCall(.5, MergeMc, [mc, c_mc])
                MergeMc(mc, c_mc)
                newGrid(mc.cid + 1, c_mc.id, .3)

                //TweenLite.delayedCall(.5, newGrid, [mc.cid + 1, c_mc.id])
            } else {
                TweenLite.to(mc, .3, {
                    x: (gridW + empNum) * (mc.id % 4) + gridW / 2,
                    y: (gridH + empNum) * Math.floor(mc.id / 4) + gridH / 2,
                    ease: Circ.easeInOut
                })
            }



    }
    //合拼
    function MergeMc(mc, c_mc) {
        TweenLite.to([c_mc, mc], .3, {
            scaleX: 0,
            scaleY: 0,
            delay: .3,
            onComplete: function () {
                gridMovie.removeChild(c_mc);
                gridMovie.removeChild(mc);
            }
        })
        gradeNum += Math.pow(2, mc.cid + 1) * 2 - (mc.cid + 2)
        gradeTxt.text = gradeNum
        //newGrid(mc.cid + 1, c_mc.id)
        idArrSort()

    }
    /*************************************************/

    function debug() {
        var t = new C.Text('', "50px menlo")
        stage.addChild(t)
        t.text = 'ID:'
        stage.addEventListener('stagemouseup', function (e) {
            //alert(0)
            console.log(e.target)
            //t.text=t.text+e.target.__touch.count+":"
        })
        stage.addEventListener('pressmove', function (e) {
            console.log(e)
            t.text = e.stageX + ":" + e.pointerID
        })
    }
    $(document).ready(function () {
        
        console.log(clientRect)
        Canvas = $("<canvas id='myC' style='display:block'></canvas>").appendTo('body'); //document.createElement('canvas');
        Canvas[0].width = WIDTH
        Canvas[0].height = HEIGHT
        Canvas.width(window.innerWidth)
        Canvas.height(window.innerHeight)

        stage = new C.Stage('myC');

        C.Ticker.setFPS(30)
        C.Ticker.useRAF = true;
        C.Ticker.addEventListener("tick", stage);
        C.Touch.enable(stage, true); //单指触摸
        //debug()


        loade();
        
       
    });
})(createjs = createjs || {});
var createjs;
