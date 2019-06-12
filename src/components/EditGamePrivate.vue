<template>
    <div>
       <div class="game-title" >
            <i :class="tabShowStatus[index].child.option1?'el-icon-arrow-down':'el-icon-arrow-right'"
               @click="tabShow(index,'option1')" ref="option1Title"></i>
            <span @click="tabShow(index,'option1')">
            题目
            </span>
        </div>

    <div class="game-inner" v-show="tabShowStatus[index].child.option1" >
            <div class="option-animate" style="border-bottom: none;padding-bottom:0">
                <div>
                    
                    <el-input placeholder="请输入元素名称"   size="mini" style="width:80%!important" v-model="item.rightKey.text">
                        <template slot="prepend" >正确答案：</template>
                    </el-input>
                    <div style="clear:both;"></div>
                    <div class="option-animate-title">
                        答案类型
                    </div>
                    <div class="option-animate-radio">
                        <el-radio 
                        v-model="item.rightKey.contentType"
                        :label="item2.label" 
                        :key="index2" 
                        v-for="(item2,index2) in contentType"
                        >{{item2.name}}</el-radio>
                    </div>
                    <div class="upload">
                        <div class="img-box">
                            <img :src="resourceData[item.optionsData.image.name]" alt="" width="131" height="96">
                        </div>
                        <div class="upload-btn">
                            <div class="upload-btn-file">
                                <span>更改图片</span>
                                <input type="file" @change="uploadImage('image',$event, item.optionsData.image, '')">
                            </div>
                        </div>
                    </div>
                    <el-input placeholder="请输入内容" @input="setAttr(0, 'optionImage'+0, 'left', $event)" v-model="item.optionsData.image.x" size="mini">
                        <template slot="prepend" >X：</template>
                    </el-input>
                    <el-input placeholder="请输入内容" @input="setAttr(0,  'optionImage'+0,'top', $event)" v-model="item.optionsData.image.y" size="mini">
                        <template slot="prepend">Y：</template>
                    </el-input>
                    <el-input placeholder="请输入内容" style="width:40%" @input="setAttr(0,  'optionImage'+0,'width', $event, item.optionsData.image)"  v-model="item.optionsData.image.width" size="mini">
                        <template slot="prepend">W：</template>
                    </el-input>
                    <div style="float: left;text-align: center;width: 20%;height: 28px;margin-top: 15px;line-height: 32px;">
                        <img :src="resourceData.image_lock_on" alt="" @click="setImageLock(item.optionsData.image)" style="height: 14px;cursor: pointer" v-if="item.optionsData.image.lock">
                        <img :src="resourceData.image_lock_off" alt="" @click="setImageLock(item.optionsData.image)" style="height: 14px;cursor: pointer" v-if="!item.optionsData.image.lock">
                    </div>
                    <el-input placeholder="请输入内容" style="width:40%" @input="setAttr(0,  'optionImage'+0,'height', $event, item.optionsData.image)"  v-model="item.optionsData.image.height" size="mini">
                        <template slot="prepend">H：</template>
                    </el-input>
                </div>
            </div>
    </div>
        <!-- 选项结束 -->
       
    </div>
</template>
<script>
    import {CopyAndRender,DeleteEleByName,UploadAndRenderEle,RenderElementByIndex} from 'xes-tem-render';
    export default {
        name: "EditGamePrivate",
        data() {
            return {
                contentType:[
                {
                    label:'word',
                    name:'单词'
                },{
                    label:'sentence',
                    name:'句子'
                }
                ],
                fontFamily: [
                    {
                        label: '微软雅黑',
                        value: 'Microsoft YaHei'
                    },
                    {
                        label: '宋体',
                        value: 'SimSun'
                    },
                    {
                        label: '黑体',
                        value: 'SimHei'
                    },
                    {
                        label: '方正粗圆',
                        value: 'FZCuYuan-M03S'
                    },
                    {
                        label: '方正粗圆简',
                        value: 'FZZhunYuan-M02S'
                    }
                ],
                textAlign: [
                    {
                        label: '左对齐',
                        value: 'left'
                    },
                    {
                        label: '右对齐',
                        value: 'right'
                    },
                    {
                        label: '居中对齐',
                        value: 'center'
                    },
                    {
                        label: '两端对齐',
                        value: 'justify'
                    }
                ],
                lockImg:this.resourceData['image_lock_off'],
                checkbox:false,
                radio:1,
                switchStatus:false,
                audio_name:'',
                image:{
                    "show": true,
                    "x": 0,
                    "y": 0,
                    "lock":false,
                    "width":0,
                    "height":0,
                    "name": "",
                    "ratio":0
                },
                sprite:{
                    "show": false,
                    "x": "500",
                    "y": "0",
                    "name": "",
                    "scale": "1",
                    "loop": false
                },
                animate:{
                    "show": false,
                    "x": "100",
                    "y": "100",
                    "name": "",
                    "scale": "3",
                    "loop": true
                }
            }
        },
        props: [
            "allData",
            "gameData",
            "resourceData",
            "item",
            "index",
            "tabShowStatus"
        ],
        mounted() {
        },
        methods: {
            // 位置问题
            setSubTitileAttr(name,attr){
                let newName = '';
                if(name === 'soundImg'){
                    newName = 'stemSound'
                }else{
                    newName = 'rightKey'
                }
                let GAME = window.stage.getChildByName('GAME');
                let component = GAME.getChildByName('GAME'+this.index).getChildByName(newName);
                let rightKey = this.item.rightKey;
                if(component){
                    if(attr === 'x'&&rightKey[attr] > 1920){
                        this.$message.error('输入数值超出范围 应为0-1920');
                        rightKey[attr] = component[attr]
                        return
                    }
                    if(attr === 'y'&rightKey[attr] > 1080){
                        this.$message.error('输入数值超出范围 应为0-1080');
                        rightKey[attr] = component[attr]
                        return
                    }
                    if(this.isFloat(parseFloat(rightKey[attr]))){
                        rightKey[attr] = parseFloat(rightKey[attr].split('.')[0]+'.'+rightKey[attr].split('.')[1].substr(0,1));
                    }else{
                        rightKey[attr]
                        var reg = /^\d*\.+$/g;
                        if(rightKey[attr]&&reg.test(rightKey[attr])){
                            rightKey[attr] = parseFloat(rightKey[attr])+'.';
                        }else{
                            rightKey[attr] = rightKey[attr]?parseFloat(rightKey[attr]):0;
                        }
                    }
                    if(parseFloat(rightKey[attr])<0){
                        rightKey[attr] = component[attr]
                    }
                    component[attr] = rightKey[attr];
                }
            },
            //文本方法
            setStemText(attr){
                let rightKey = this.item.rightKey;
                let GAME = window.stage.getChildByName('GAME');
                let component = GAME.getChildByName('GAME'+this.index).getChildByName('rightKey');
                if(attr === "strong" || attr === "italic"){
                    rightKey[attr] = !rightKey[attr]
                }
                let reg = /^\d{1,3}$/;
                if(attr==='letterSpacing'||attr==='lineHeight'){
                    reg = /^0?-\d?\.?\d?$/;
                }
                if(attr === 'width' && (rightKey[attr] > 1920 || rightKey[attr] < 0)){
                    rightKey.width = component._style.wordWrapWidth
                    this.$message.error('输入数值超出范围 应为0-1920');
                    return
                }
                if(attr == 'fontSize'){
                    if(rightKey[attr]==0){
                        if(component){
                            component.visible = false;
                            return;
                        }
                    }
                    else{
                        if(component){
                            component.visible = true
                        }
                    }
                }
                if(attr == 'fontSize'){
                    if(!reg.test(rightKey[attr])){
                        this.$message({
                            type:'error',
                            message:'输入错误'
                        });
                        return;
                    }
                    if(rightKey[attr]>120){
                        rightKey[attr] = 120
                        this.$message({
                            type:'warning',
                            message:'超过最大字体120'
                        });
                    }
                }
                if(attr == 'lineHeight'||attr == 'letterSpacing'){
                    if(reg.test(rightKey[attr])){
                        rightKey[attr] = parseFloat(rightKey[attr])?parseFloat(rightKey[attr]).toFixed(0):'-';
                    }else{
                        rightKey[attr] = parseFloat(rightKey[attr])?parseFloat(rightKey[attr]).toFixed(0):0
                    }
                }
                if(attr == 'width'){
                    rightKey[attr] = this.verifyNumber(rightKey[attr]);
                }
                rightKey.color = rightKey.color?rightKey.color:'#000';



                let style = new PIXI.TextStyle({
                    fontFamily: rightKey.fontFamily,
                    fontSize: parseInt(rightKey.fontSize),
                    wordWrap: true,
                    wordWrapWidth: parseInt(rightKey.width),
                    breakWords: true,
                    lineHeight: parseInt(rightKey.lineHeight),
                    letterSpacing: parseInt(rightKey.letterSpacing),
                    align: rightKey.textAlign,
                    fill: rightKey.color,
                    width: rightKey.width,
                    fontWeight: rightKey.strong ? 'bold' : '',
                    fontStyle: rightKey.italic ? 'italic' : ''
                });
                if(component){
                    if(attr === 'text'){
                        component.setText(rightKey.text);
                        return;
                    }
                    component.setStyle(style);
                    if(rightKey.show){
                        component.visible =  true;
                    }else{
                        component.visible =  false;
                    }
                }else{
                    let text = new Text(rightKey.text,style);
                    // new DragElement(text,(x,y)=>{
                    //     this.item.rightKey.x = x.toFixed(1);
                    //     this.item.rightKey.y = y.toFixed(1);
                    // });
                    text.name = 'rightKey';
                    console.log(text);
                    GAME.getChildByName('GAME'+this.index).addChild(text);
                    if(rightKey.show){
                        text.visible =  true;
                    }else{
                        text.visible =  false;
                    }
                }
            },
            //文本方法
            setImageLock(element){
                if(element){
                    element.lock = !element.lock;
                    if(!element.height||!element.width){
                        this.$message({
                            message: 'X或Y为0或为空 无法计算比例',
                            type: 'warning'
                        });
                        return;
                    }
                    if(element.lock){
                        element.ratio = element.width/element.height;
                    }
                }else{
                    this.image.lock = !this.image.lock;
                    if(!this.image.height||!this.image.width){
                        this.$message({
                            message: 'X或Y为0或为空 无法计算比例',
                            type: 'warning'
                        });
                        return;
                    }
                    if(this.image.lock){
                        this.image.ratio = this.image.width/this.image.height;
                    }
                }
            },
            setAttr(index, name, type, e, ev){
                e = parseFloat(e);
                let box =stage.getChildByName('GAME').getChildByName('GAME'+this.index).getChildByName('componentContainer');
                if(box&&box.getChildByName(name)){
                    if(type === 'left'&&e > 1920){
                        // e = 1920;
                        this.$message.error('输入数值超出范围 应为0-1920');
                        return
                    }
                    if(type === 'top'&&e > 1080){
                        // e = 1080;
                        this.$message.error('输入数值超出范围 应为0-1080');
                        return
                    }
                    
                    if(type === 'width'){
                        // console.log(e,e/ev.ratio,ev.ratio);
                        if(ev.lock){
                            ev.height = (e/ev.ratio).toFixed(0);
                            box.getChildByName(name).height = e/ev.ratio;
                        }
                    }
                    if(type === 'height'){
                        if(ev.lock) {
                            ev.width = (e*(ev.ratio)).toFixed(0);
                            box.getChildByName(name).width = e*(ev.ratio);
                        }
                    }
                    switch (type) {
                        case 'left':
                            box.getChildByName(name).x = e==''?0:parseFloat(e);
                            break;
                        case 'top':
                            box.getChildByName(name).y = e==''?0:parseFloat(e);
                            break;
                        case 'width':
                            box.getChildByName(name).width = e==''?0:parseFloat(e);
                            break;
                        case 'height':
                            box.getChildByName(name).height = e==''?0:parseFloat(e);
                            break;
                        case 'scale':
                            let value = e==''?0:parseFloat(e);
                            box.getChildByName(name).scale.set(value);
                            break;
                        default:
                            break;
                    }
                }
            },
            changeOptionArr(type, ids) {
                    switch(type) {
                        case 'add':
                            let optionObj = {
                                "id":"",
                                "show": true,
                                "x": 0,
                                "y": 0,
                                "lock":false,
                                "width":0,
                                "height":0,
                                "name": "",
                                "ratio":1,
                                "rightKey":"",
                                "componentName": "optionImage"+this.item.optionsData.length
                            };
                            this.item.optionsData.push(optionObj);
                            break;
                        case 'copy':
                            let copyItem = JSON.parse(JSON.stringify(this.item.optionsData[ids]));
                            this.item.optionsData.push(copyItem);
                            break;
                        case 'del':
                            if(this.item.optionsData.length <= 1){
                                this.$message({
                                    message: '请至少保留一个选项',
                                    type: 'warning',
                                });
                                return false;
                            }
                            this.item.optionsData.splice(ids,1);
                            break;
                        default:
                            break;
                            
                    }
                    this.item.optionsData.forEach((opt, ins) => {
                        opt.id = ins;
                        opt.componentName = 'optionImage'+ins
                    })
                RenderElementByIndex(this.index, this.allData)
                if (type == "copy") {  
                    console.log(stage,"stage")       
                    let pageNumber = store.state.pageNumber == -1 ? 0 : store.state.pageNumber;
                    let copyObj = stage.getChildByName('GAME').getChildByName('GAME'+pageNumber).getChildByName('componentContainer').getChildByName('optionImage'+ (this.item.optionsData.length-1));
                    stage.getChildByName('GAME').getChildByName('GAME'+pageNumber).getChildByName('componentContainer').setChildIndex(copyObj, stage.getChildByName('GAME').getChildByName('GAME'+pageNumber).getChildByName('componentContainer').children.length-1);
                } 
                
            },
            tabShow(index, name) {
                console.log(index,name);
                console.log(this.tabShowStatus)
                console.log(this.$refs)
                let title = this.$refs[name + 'Title'];
                let nameTab = this.tabShowStatus[index].child[name];
                if (nameTab) {
                    this.tabShowStatus[index].child[name] = false;
                    title.className = 'el-icon-arrow-right'
                } else {
                    Object.keys(this.tabShowStatus[index].child).forEach((item, index1) => {
                        this.tabShowStatus[index].child[item] = false
                    })
                    this.tabShowStatus[index].child[name] = true;
                    title.className = 'el-icon-arrow-down'
                }
            },
            isFloat(n){
                return /^-?\d*\.\d+$/.test(n);
            },
            verifyAnimationFiles(filesArr) {
                let arr = Object.values(filesArr).map((item, index) => item.name);
                let extArr = [];
                let nameArr = arr.map((item)=>{
                    extArr.push(item.split('.')[1]);
                    return item.split('.')[0]
                });
                let extArrString = extArr.sort((a,b)=>a.length-b.length).toString();
                let extTestArrString = ["png", "json", "atlas"].toString();
                let testName = nameArr[0];
                let nameStatus = nameArr.every((item,index)=>{
                    return testName === item
                });
                let extStatus = extArrString === extTestArrString;
                return nameStatus&&extStatus;
            },
            verifySpriteFiles(filesArr) {
                let arr = Object.values(filesArr).map((item, index) => item.name);
                let extArr = [];
                let nameArr = arr.map((item)=>{
                    extArr.push(item.split('.')[1]);
                    return item.split('.')[0]
                });
                let extArrString = extArr.sort((a,b)=>a.length-b.length).toString();
                let extTestArrString = ["png", "json"].toString();
                let testName = nameArr[0];
                let nameStatus = nameArr.every((item,index)=>{
                    return testName === item
                });
                let extStatus = extArrString === extTestArrString;
                return nameStatus&&extStatus;
            },
             uploadImage(name, e, obj) {
                let self = this;
                let ext = e.target.files[0].name.split('.')[e.target.files[0].name.split('.').length - 1];
                let extArr = ['jpg', 'png'];
                if (extArr.indexOf(ext) === -1) {
                    this.$message({
                        message: '上传类型不符',
                        type: 'error'
                    });
                    return;
                }
                if (e.target.files.length === 0) {
                    this.$message({
                        message: '上传文件个数不符合',
                        type: 'warning',
                    });
                    return;
                }
                this.$http.post('/uploadingImage',
                    {
                        image: e.target.files[0]
                    },
                    {
                        headers: {'Content-Type': 'multipart/form-data'}
                    }
                ).then((res) => {
                    obj.name = res.resourceName;
                    obj.width = res.width;
                    obj.height = res.height;
                    this.updateResourceData();
                    UploadAndRenderEle(self.index,obj.componentName,res,self.allData);
                    e.target.value = '';
                })
            },
            uploadAnimation(name, e,obj,custom=false) {
                let self = this;
                if (e.target.files.length === 0 || e.target.files.length !== 3){
                    this.$message({
                        message: '上传文件个数不符合',
                        type: 'warning',
                    });
                    return;
                }
                if(!this.verifyAnimationFiles(e.target.files)){
                    this.$message({
                        message: '上传文件不符合',
                        type: 'warning',
                    });
                    return;
                }
                let object = {};
                let type = 'Animate';
                let files = Object.values(e.target.files);
                files.forEach((item, index) => {
                    object['animation' + (index + 1)] = item;
                });
                this.$http.post('/uploadingAnimation', object, {
                        headers: {'Content-Type': 'multipart/form-data'}
                    }
                ).then((res) => {
                    if(custom){
                        obj.name = res.resourceName;
                        // this.updateResourceData();
                        // UploadAndRenderEle(self.index,obj.componentName,res,self.allData);
                        e.target.value = '';
                    }else{
                        this.animate.name = res.resourceName;
                        e.target.value = '';
                    }
                })
            },
            uploadSprite(name, e) {
                if (e.target.files.length === 0 || e.target.files.length !== 2) {
                    this.$message({
                        message: '上传文件个数不符合',
                        type: 'warning',
                    });
                    return;
                }
                if(!this.verifySpriteFiles(e.target.files)){
                    this.$message({
                        message: '上传文件不符合',
                        type: 'warning',
                    });
                    return;
                }
                let object = {};
                let files = Object.values(e.target.files);
                files.forEach((item, index) => {
                    object['sprite' + (index + 1)] = item;
                });
                console.log(object);
                this.$http.post('/uploadingSprite', object, {
                        headers: {'Content-Type': 'multipart/form-data'}
                    }
                ).then((res) => {
                    this.sprite.name = res.resourceName;
                    e.target.value = '';
                })
            },
            uploadAudio(name,e) {
                let ext = e.target.files[0].name.split('.')[e.target.files[0].name.split('.').length - 1];
                let extArr = ['mp3', 'wav'];
                if (extArr.indexOf(ext) === -1) {
                    this.$message({
                        message: '上传类型不符',
                        type: 'error'
                    });
                    return;
                }
                if (e.target.files.length === 0) {
                    this.$message({
                        message: '上传文件个数不符合',
                        type: 'warning',
                    });
                    return;
                }
                this.$http.post('/uploadingAudio',
                    {audio: e.target.files[0]}, {
                        headers: {'Content-Type': 'multipart/form-data'}
                    }
                ).then((res) => {
                    this.audio_name = res.resourceName;
                    e.target.value = '';
                })
            },
            updateResourceData() {
                this.$emit('updateResourceData')
            },
        }
    }
</script>
<style scoped lang="scss">

</style>