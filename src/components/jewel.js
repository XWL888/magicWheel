import { TweenMax } from 'gsap';
import {getTexture} from '../loader';

let allStatus = {
  default: {
    jewelKey:"image_jewelDefault"
  },
  currentDefault: {
    jewelKey:"image_jewelCurrent",
    border:"image_jewelCurrentBg"
  },
  currentRight: {
    jewelKey: "image_jewelCurrentRight",
    border: "image_jewelRightBg"
  },
  currentWrong: {
    jewelKey: "image_jewelCurrentWrong",
    border:"image_jewelCurrentBg"
  },
  rightEd: {
    jewelKey: "image_jewelRightEd",
    border: "image_jewelRightBg"
  },
  wrongEd: {
    jewelKey: "image_jewelWrongEd",
    border:"image_jewelCurrentBg"
  }
}
const OX = 781.5;  
const OY = 529.5;
let jewelBgKey = "image_jewelBg";
export default class Jewel{
  constructor(self){
    this.self = self; //实例
    this.game = self.game; // 舞台
    this.jewel = {};
    this.jewelCon = new PIXI.Container();
    this.rotation = 2 * Math.PI / store.state.testNum ;
  }
  init(){
    let pageNumber = store.state.pageNumber
    store.state.answerStatus.forEach((item,index)=>{
      let status = item === 1 ? "default" : (item === 2 ? "rightEd" : "wrongEd");
      index === pageNumber ? status = "currentDefault" : '';
      let con = this.add(status);
      con.rotation = -1 * index * this.rotation ;  
      this.jewelCon.addChild(con);
    })
    
    this.jewelCon.rotation = this.rotation * pageNumber;
    this.jewelCon.x = OX;
    this.jewelCon.y = OY;
    this.jewelCon.pivot.x = OX;
    this.jewelCon.pivot.y = OY;
    this.game.addChild(this.jewelCon);
  }
  add(status){
    let con = new PIXI.Container();
    let conAll = new PIXI.Container();
    let jewelBg = this.self.createImage(jewelBgKey,{x:698.5,y:58.5});
    this.pivotCenter(jewelBg)
    let jewel = this.self.createImage(allStatus[status].jewelKey,{x:0,y:0});
    this.pivotCenter(jewel)
    jewel.x = jewelBg.width / 2;
    jewel.y = jewelBg.height / 2;


    con.addChild(jewelBg);
    let jewelBorder;
    if(status === "default"){
      jewelBorder = this.self.createImage(allStatus.currentDefault.border,{alpha:0});
    }else{
      jewelBorder = this.self.createImage(allStatus[status].border);
    }
    this.pivotCenter(jewelBorder);
    jewelBorder.x = jewelBg.width / 2;
    jewelBorder.y = jewelBg.height / 2;
    jewelBg.addChild(jewel,jewelBorder);

    conAll.addChild(jewelBg);
    conAll.x = OX;
    conAll.y = OY;
    conAll.pivot.x = OX;
    conAll.pivot.y = OY;
    return conAll;
  }
  
  rotate(){
    let pageNumber = store.state.pageNumber;
    // let rotation = this.rotation * (pageNumber + 1);
    let rotation = this.jewelCon.rotation + this.rotation;
    TweenMax.to(this.jewelCon,0.5,{
      rotation,
    })

    let con = this.jewelCon.children[pageNumber].children[0];
    let jewel = con.children[0];
    // let border = con.children[1];
    TweenMax.to(jewel,0.5,{
      width : jewel.width * 0.74,
      height : jewel.height * 0.74
    })
    // if(con.answerStatus === "currentWrong"){
    //   TweenMax.to(border,0.5,{
    //     alpha:0,
    //     onComplete(){
    //       // con.removeChild(border);
    //     }
    //   })
    // }
    let preCon = this.jewelCon.children[pageNumber + 1].children[0];
    let preJewel = preCon.children[0];
    let preBorder = preCon.children[1];
    TweenMax.to(preJewel,0.5,{
      width : preJewel.width * 1.36,
      height : preJewel.height * 1.36
    })
    TweenMax.to(preBorder,0.5,{
      alpha:1,
    })
    this.allBorderRotate()
  }
  lastJewel(){
    let {pageNumber} = store.state;
    let con = this.jewelCon.children[pageNumber].children[0];
    let jewel = con.children[0];
    // let border = con.children[1];
    TweenMax.to(jewel,0.5,{
      width : jewel.width * 0.74,
      height : jewel.height * 0.74
    })
    // if(!loadInfo[pageNumber]){
    //   TweenMax.to(border,0.5,{
    //     alpha : 0
    //   })
    // }
  }
  allBorderRotate(){
    this.jewelCon.children.forEach((con)=>{
      let border = con.children[0].children[1];
      if(border){
        TweenMax.to(border,1,{
          rotation:border.rotation + 2 * Math.PI * 8
        })
      }
    })
  }

  replace(status){
    let pageNumber = store.state.pageNumber;
    let con = this.jewelCon.children[pageNumber].children[0];
    con.answerStatus = status;
    let jewel = con.children[0];
    let x = jewel.x;
    let y = jewel.y;
    let newJewelTexture = getTexture(allStatus[status].jewelKey)
    jewel.texture = newJewelTexture;
    this.pivotCenter(jewel);
    jewel.x = x;
    jewel.y = y;

    let border = con.children[1];
    let bx = border.x;
    let by = border.y;
    border.texture = getTexture(allStatus[status].border);
    this.pivotCenter(border);
    border.x = bx;
    border.y = by;
  }

  pivotCenter(obj){

    let w = obj.width / 2;
    let h = obj.height / 2;
    obj.x += w;
    obj.y += h;
    obj.pivot.x = w;
    obj.pivot.y = h;
  }
  play(type){
    switch (type) {
      case "right":
        this.replace("currentRight");
        break;
      case "wrong":
        this.replace("currentWrong");
        break;
      case "turn":
        this.rotate();
        break;
      case "lastJewel":
        this.lastJewel();
        break;
      default:
      console.log("执行默认");
        break;
    }
  }
}