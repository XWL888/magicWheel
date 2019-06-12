<template>
    <div class="container">
        <div style="fontFamily: 'ArialRoundedMTBold';visibile:hidden;width:0;height:0;">.</div>
        <div class="canvas" ref="canvas"></div>
        <img src="static/images/logo.png" class="logo" id="logo"/>
    </div>
</template>

<script>
    import {Application, Container, Sprite,Texture,Text,TextStyle} from 'pixi.js';
    import {getAnimation, load,getSound,createSprite,getTexture} from '../loader';
    import STEMTITLE from 'xes-preview-subtitle';
    import GAME from "xes-preview-game";
    import AnimateClass from 'xes-animate'
    import Init from './init.js'
    import Msg from './msgLog.js'
    let question;
    let allData;
    export default {
        name: "start",
        data() {
            return {
                restTime:10,
                globalAnimation:'zoomIn',
                e:{},//接收到的信息
                currentText:'',//当前文本
                
            }
        },
        methods: {
            createApp() {
                return new Application({
                    width: 1920,
                    height: 1080,
                    autoSize: true,
                    transparent: true //背景是否设为透明
                })
            },
            customAnimate(obj,type,changePivot,time=0.5){ //自定义动画
                let width = obj.width ;
                let height = obj.height ;
                let attr = {};
                if(changePivot){
                    obj.pivot.x = width/ obj.scale.x / 2;
                    obj.pivot.y = height/ obj.scale.y / 2;
                    obj.x += width/ 2 ;
                    obj.y += height / 2 ;
                }
                switch(type){
                    case "empty":
                        break;
                    case "smallToBig":
                        obj.width = 0;
                        obj.height = 0;
                        attr = {width,height}
                        break;
                    case "toBig":
                        obj.width = 2 * width;
                        obj.height = 2 * height;
                        attr = {width,height}
                        break;
                    case "fadeOut":
                        attr.alpha = 0;
                        break;
                    case "lastToNow":
                        let x = obj.x;
                        obj.x -= 92;
                        attr={x}
                        break;
                    default:
                        console.log("type错误")
                        break;
                }
                return new TweenMax(obj,time,attr)
            },
            //创建animate
            createAnimate(child,type,time=0.5){
                return new AnimateClass(child,{
                    time:time,
                    type:type,
                    delay:0
                })
            },
            //创建图片
            createImage(url,data) {
                let img = createSprite(getTexture(url));
                if (data) {
                    for(var k in data) {
                        img[k] = data[k];
                    }
                }
                return img;
            },
            //创建图片byres
            createImageByRes(image){
                let width = parseFloat(image.width);
                let height = parseFloat(image.height);
                let x = parseFloat(image.x);
                let y = parseFloat(image.y);
                let name = image.name;
                let child = this.createImage(name,{x,y,width,height});
                return child;
            },
            //创建动画
            createAnimation(key,setObj,data) {
                let animation = getAnimation(key);
                if (data) {
                    for(var k in data) {
                        animation[k] = data[k];
                    }
                }
                if (setObj) {
                    animation.state.setAnimation(setObj[0],setObj[1],setObj[2])
                }
             
                return animation;
            },
            //创建文本
            createText(string,data) {
                let text;
                if (data.style) {
                    text = new Text(string, new TextStyle(data.style));
                } else {
                    text = new Text(string);
                }
                text.x = data.x ? data.x : text.x;
                text.y = data.y ? data.y : text.y;
                return text;
            },
            //添加元素
            addElement(container,arr) {
                if (container && arr) {
                    arr.forEach((data)=>{
                        container.addChild(data);
                    });
                }
            },
            //格式化时间
            formatTime () {
                let minute = '00';
                let second = '00';
                if(this.restTime >= 0){
                    if (this.restTime < 60) {
                        minute = '00';
                    }else {
                        minute = ~~(this.restTime/60) < 10? `0${~~(this.restTime/60)}`: (~~(this.restTime/60));
                    }
                    if (this.restTime % 60 === 0) {
                        second = '00';
                    }else {
                        second = (this.restTime % 60) < 10? `0${this.restTime%60}`: this.restTime % 60;
                    }
                }
                return {minute:minute,second:second}
                
            },
            newGame(pageNumber){
                stage.children.length = 0;
                let game = new GAME(question.sources[pageNumber].bgImage, question.sources[pageNumber].stemImg, res);
                stage.addChild(game);
                this.game = game;
            },
            addFunction(){
                if(!PIXI.spine.Spine.prototype.hasOwnProperty("_play")){
                    PIXI.spine.Spine.prototype._play = function(name,loop,callBack){
                        this.state.setAnimation(0,name,loop).listener = {
                            complete(){
                                if(typeof callBack === "function"){
                                    callBack();
                                }
                            }
                        }
                    }
                }
                if(!PIXI.Container.prototype.hasOwnProperty("_show")){
                    PIXI.Container.prototype._show = function(){
                        this.alpha = 1;
                    }
                }
                if(!PIXI.Container.prototype.hasOwnProperty("_hide")){
                    PIXI.Container.prototype._hide = function(){
                        this.alpha = 0;
                    }
                }
            }
        },
        created() {
            let loading = document.getElementsByClassName('page-loading')[0];
            loading.style.display = 'none';
        },
        destroyed() {
            PIXI.sound.stopAll();
            app.destroy();
        },
        mounted() {
            PIXI.sound.stopAll();
            let loading = document.getElementsByClassName('page-loading')[0];
            loading.style.display = 'none';
            window.app = this.createApp();
            app.view.style.width = '19.2rem';
            app.view.style.height = '10.8rem';
            app.view.id = 'appCanvas';
            window.stage = app.stage;
            const self = this;
            self.$refs.canvas.appendChild(app.view);
            stage.interactive = true;
            //初始化日志类
            let msg = new Msg();
            load().then(res => {
                console.log("%c资源加载完啦✌️", "color:#FF323B;font-weight:bold;");
                this.$nextTick(()=>{
                    window.question = res.question.data;
                    question = res.question.data;
                    allData = res.question.data;
                    store.state.loadInfo = [];
                    store.state.pageNumber = 0;
                    store.state.testNum = 6;
                    store.state.sources = question.sources;
                    store.state.testNum = store.state.sources.length;
                    store.state.answers = res.question.data.preFetch.answers;
                    
                    //初始化一些方法
                    this.addFunction();




                    let init = new Init(this);
                    window.init = init;
                    
                    let startBg = this.createImage("image_startBg")
                    let start = this.createAnimation('animation_daojishi');
                    stage.addChild(startBg);
                    stage.addChild(start);


                    window.loading = {
                        "type":"coursewareOnloading", //课件加载时消息type  
                        "pageNum":0,                  //当前课件应翻到第几页（第几小题）
                        "restTime":3,                 //当前页剩余时间（当前小题剩余时间）
                        "answerInfo":[],      //已作答情况  下标对应页码  true代表正确，false代表错误
                        "nextStudentNum":1               //用户信息，如果为单人模式，只传2号学生信息即可
                    }
                    window.turnPage = {
                         "type":"coursewareDoing",     //做题过程中接收消息type
                        "nextStudentNum":1,           //翻页后答题选手
                        "score":80,                   //答对的分数（score>=70） 要翻页时没有作答传-1
                        "turnToPageNum":3,  
                    }
                    window.doingLoad =  {
                        "type":"coursewareDoingLoad",  //消息type    //接到消息立即翻页不等待   
                        "turnToPageNum":8,             //翻页页码  即将翻页页码（0/1/2/3/4... < 总题数）
                        "restTime": 12,                //小组剩余时间
                        "answerInfo":[true,true,true,true,true,true,true,true],              //小组已答对数量
                        "nextStudentNum":3
                    }
                    window._turnpage = ()=>{
                        window.turnPage.turnToPageNum = store.state.pageNumber + 1;
                        let random = Math.random();
                        window.turnPage.nextStudentNum = random < 0.33 ? 1 : (random < 0.66 ? 2 : 3);
                        window.postMessage(window.turnPage,"*");
                    }
                    window.comeOn = {type:"coursewareComeOn",comeOn:true};
                    //初始化完成
                    window.parent.postMessage({type:'loadComplete'}, '*');
                    //正经代码从这开始
                    let handleMessage = (e)=>{
                        this.e = e.data;
                        let {type,turnToPageNum,pageNum,restTime,nextStudentNum,score,comeOn,answerInfo} = e.data
                        this.currentText = store.state.answers[store.state.pageNumber].text;
                        pageNum = parseInt(pageNum);
                        restTime = parseInt(restTime);
                        
                        if(type === "coursewareOnloading"){//加载时 重置 页码,时间,答对次数
                            //初始化答题信息
                            store.dispatch("upDateInfo",{answerInfo,nextStudentNum});
                            store.state.loadData = {pageNum,restTime};
                            store.state.pageNumber = pageNum;
                            this.currentText = store.state.answers[store.state.pageNumber].text;
                            
                            //新建舞台
                            if(pageNum === 0 && restTime > 3){
                                start.state.setAnimation(0,"animation",false).listener = {
                                    complete(){
                                        setTimeout(() => {
                                            self.newGame(pageNum);
                                            init.exec();
                                        });
                                    }
                                }
                            }else if(pageNum < store.state.testNum && pageNum >= 0){
                                self.newGame(pageNum);
                                init.exec();
                            }
                            
                        }else if(type === "coursewareDoing"){ //答题时
                            if(!store.state.isWaitTurn){
                                store.state.isWaitTurn = true;
                                score = parseInt(score);
                                if(score >= 70 ){
                                    init.playRightAnimation();
                                }else{
                                    init.playWrongAnimation();
                                }
                                if(turnToPageNum >= 0 && turnToPageNum < store.state.testNum){
                                    store.state.isWaitTurn = true;
                                    setTimeout(()=>{
                                        store.dispatch("upDateInfo",{answerInfo:store.state.isRight,nextStudentNum});
                                        init.turnPage(turnToPageNum);
                                    },3000)
                                }
                            }
                        }else if(type === "coursewareDoingLoad"){
                            if(turnToPageNum >= 0 && turnToPageNum < store.state.testNum){
                                store.dispatch("upDateInfo",{answerInfo,nextStudentNum});
                                store.state.loadData.restTime = restTime;
                                store.state.loadData.pageNum = turnToPageNum;
                                store.state.pageNumber = turnToPageNum;
                                init.turnPage(turnToPageNum)
                            }
                        }else if(type === "coursewareComeOn"){
                            if(comeOn){
                                init.playComeOn();
                            }
                        }

                        
                        //上传接到消息日志
                        if(type === "coursewareOnloading" || type=== "coursewareDoing" || type === "coursewareDoingLoad" || type === "coursewareComeOn"){
                            let {isRight,isWaitTurn,answerInfo,pageNumber,answers} = store.state;
                            let afterReceiveInfo = {isRight,isWaitTurn,answerInfo,pageNumber,restTime:self.restTime}
                            let data = {logtype:"english_interactive",afterReceiveInfo,receiveMsg:e.data,currentText:this.currentText,game:"魔法阵"};
                            msg.log(data)
                        }
                        //上传接到消息日志

                    }

                    let handleError = (emsg,eurl,eline)=>{
                        let errormsg = {emsg,eurl,eline}
                        let {isRight,isWaitTurn,answerInfo,pageNumber,answers} = store.state;
                        let afterReceiveInfo = {isRight,isWaitTurn,restTime:self.restTime,answerInfo,pageNumber}
                        let data = {logtype:"english_interactive",tberr:"course_error",errormsg,afterReceiveInfo,receiveMsg:this.e,currentText:this.currentText,game:"魔法阵"};
                        msg.log(data)
                    }
                    window.addEventListener("message",handleMessage);
                    window.onerror = handleError;
                });
            })
        }
    }
</script>
<style >
    
    .canvas {
        width: 19.2rem;
        height: 10.8rem;
        position: absolute;
        left: 50%;
        top: 50%;
        margin-left: -9.6rem;
        margin-top: -5.4rem;
    }
    .logo {
        position: absolute;
        z-index: 999;
        left: .5rem;
        bottom: .3rem;
        width: 1.9rem;
    }
</style>