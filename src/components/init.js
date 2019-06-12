import { TweenMax } from 'gsap';
import Jewel from './jewel';

const OX = 781.5;  
const OY = 529.5;


class Init {

    constructor(self){
        this.self = self;             // vue实例
        this.restTime = null;         // 剩余时间
        this.restTimer = null;        //定时器
        this.global = {
            wheel: null,  //魔法轮
            jewel: null,  //所有宝珠
            animation:{} //动画数据
        },
        this.lastY = -740;

    }

    exec(){
        this._init();
    }

    _init(){
        this.dataInit();
        this.sceneInit();
    }


    //数据初始化
    dataInit(){
        let pageNumber = store.state.pageNumber;
        let {pageNum,restTime} = store.state.loadData;
        // 当前页码
        store.state.pageNumber = pageNum || pageNumber;
        //剩余时间
        this.self.restTime = restTime || parseInt(store.state.answers[store.state.pageNumber].singleTime) 
        if(store.state.pageNumber === 0 && this.self.restTime > 3){
            this.self.restTime -= 3;
        }
        //重置当前等待开关
        store.state.isWaitTurn = false;
        //重置当前正确
        store.state.isRight = false;
        //清除loading数据保留isSingle
        store.dispatch("clearLoadData");
    }
  
    //图片初始化
    imageInit(){
        let pageNumber = store.state.pageNumber;
        let game = this.self.game;
        let that = this.self;
        //初始化魔法轮
        this.global.wheel = that.createImage("image_wheel",{x:249})
        game.addChild(this.global.wheel)

        //初始化宝珠
        let jewel = new Jewel(that)
        this.global.jewel = jewel;
        jewel.init();
        window.jewel = jewel;

        //题目初始化
        let stemBg = that.createImage("image_optionBg",{x:554.5,y:303})
        this.global.stemBg = stemBg;
        let stemImage = store.state.sources[pageNumber].optionsData.image;
        stemImage = that.createImageByRes(stemImage);
        that.customAnimate(stemImage,"smallToBig",true);
        this.global.stemImage = stemImage;
        game.addChild(stemBg,stemImage)
        

        //comeOn初始化
        this.global.comeOn = that.createImage("image_comeOn",{x:1205,y:0,alpha:0});
        game.addChild(this.global.comeOn);
    }
    // 倒计时初始化
    restTimeInit(){
        let that = this.self;
        let game = this.self.game;
        let con = new PIXI.Container();
        con.rotation = - Math.PI / 2;
        con.pivot.x = OX;
        con.pivot.y = OY;
        con.x = OX;
        con.y = OY;
        let first = true;
        let time = that.restTime;
        
        let red = that.createImage("image_timeRed",{x:566,y:314});
        let green = that.createImage("image_timeGreen",{x:566,y:314});
        
        let radio = time > 3 ? (3 / time ) : -1; //3s在总时间所占比率
        radio > 0 ? con.addChild(red,green) : con.addChild(red)
        game.addChild(con);
        this.global.timeImage = con;
        let unit = 2 * Math.PI / (50 * time);   //每次绘制的单元

        let mask = new PIXI.Graphics();
        let startRect = 2 * Math.PI;

        this.restTimer ? clearInterval(this.restTimer) : '';

        this.restTimer = setInterval(()=>{
            mask.clear();
            mask.lineStyle(50,0xffffff);
            mask.arc(OX,OY,200,startRect,0,true);
            startRect-=unit;
            if(startRect < (2 * Math.PI * radio) && first && radio > 0 ){
                first = false;
                con.removeChild(green);
            }
            if(startRect < 0){
                con.removeChild(red)
                clearInterval(this.restTimer)
            }
        },20);
        con.mask = mask;
        con.addChild(mask);
    }
    

    //动画初始化
    animationInit(){
        let that = this.self;
        let game = this.self.game;
        this.global.animation.fire = that.createAnimation("animation_xuanze",false,{alpha:0});
        this.global.animation.stick = that.createAnimation("animation_mofabang",false,{y:this.lastY});
        this.stickMove(store.state.currentStudent)
        this.global.animation.status = that.createAnimation("animation_animation",false,{alpha:0});
        this.global.animation.stick._play("mofabang",true);
        game.addChild(this.global.animation.fire,this.global.animation.stick,this.global.animation.status)
    }
    
    //场景初始化
    sceneInit(){
        this.imageInit();
        this.restTimeInit();
        this.animationInit();
    }

    // 魔法棒移动
    stickMove(studentNum){
        TweenMax.to(this.global.animation.stick,0.5,{
            y: -740 + (studentNum -1) * 350,
        });
    }
    
    //播放正确动效
    playRightAnimation(){
        clearInterval(this.restTimer)
        store.state.isRight = true;
        let {fire,stick,status} = this.global.animation;
        let {pageNumber,testNum,currentStudent} = store.state;
        fire._show();
        stick._hide();
        fire._play(`P${currentStudent}`,false,()=>{
            status._show();
            status._play("right",false,()=>{
                setTimeout(() => {
                    this.global.jewel.play("right")
                    if(pageNumber + 1 < testNum){
                        setTimeout(() => {
                            this.global.jewel.play("turn");
                        }, 500);
                    }else{
                        this.playFinishAnimation();
                    }
                });
            })
            fire._hide();
            stick._show();
        })
    }
    //完成动效
    playFinishAnimation(){
        let {loadInfo,isRight} = store.state;
        store.dispatch("upDateLoadInfo",{answerInfo:isRight})
        let game = this.self.game;
        let {status,stick} = this.global.animation;
        let {jewel,stemBg,stemImage,timeImage} = this.global;
        jewel.play("lastJewel");
        TweenMax.to([stick,stemBg,stemImage,timeImage],0.5,{
            alpha:0
        })
        if(loadInfo.find(item =>  item === false) === undefined){
            game.setChildIndex(status,1)
            status._play("finish_1")
        }else{
            game.setChildIndex(status,1)
            status._play("finish_2")
        }
    }
    //播放错误动效
    playWrongAnimation(){
        clearInterval(this.restTimer)
        let {pageNumber,testNum} = store.state;
        let jewel = this.global.jewel;
        let status = this.global.animation.status;
        status._show();
        status._play("wrong",false,()=>{
            jewel.play("wrong");
            if(pageNumber + 1 < testNum){
                setTimeout(() => {
                    jewel.play("turn")
                }, 500);
            }else{
                this.playFinishAnimation();
            }
            
        })
    }
    
    playComeOn(){
        let comeOn = this.global.comeOn;
        let game = this.self.game;
        game.setChildIndex(comeOn,this.self.game.children.length - 1)
        let studentNum = store.state.currentStudent ;
        let y = (studentNum -1) * 350;
        comeOn._hide();
        comeOn.y = y;
        TweenMax.to(comeOn,0.5,{
            alpha:1,
            onComplete(){
                setTimeout(()=>{
                    comeOn._hide();
                },500)
            }
        })
      
    }
    //翻页
    turnPage(pageNumber){
        this.lastY = this.global.animation.stick.y;
        clearInterval(this.restTimer);
        store.state.pageNumber = pageNumber;
        this.self.newGame(pageNumber);
        this.exec();
    }

   
}


export default Init