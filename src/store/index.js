import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);
import {postAnswer, AnswerInfo} from 'xes-answer';

const state = {
    postArr: [],//答题数据
    resultArr: [],//平台结果处理后结果
    pisShow: false,//平台结果页是否出现
    pShow: false,//切换老师收卷
    goldnum: 0,//金币数
    testNum: 1,//题数
    result: [],//服务端返回数据
    isShow: false,//是否显示结果页
    pageNumber: 0,
    question: null,
    answerStatus:[],
    sources:[],//题目信息
    loadInfo:[], //
    currentStudent:1,//当前谁作答
};
const actions = {
    clearLoadData({state}){
        state.loadData.pageNum = null;
        state.loadData.restTime = null;
    },
    upDateInfo({state},{answerInfo,nextStudentNum}){
        store.dispatch("upDateLoadInfo",{answerInfo})
        store.dispatch("upDateAnswerStatus")
        store.dispatch("upDateCurrentStudent",{nextStudentNum})
    },
    upDateCurrentStudent({state},{nextStudentNum}){
        state.currentStudent = nextStudentNum;
    },
    upDateLoadInfo({state},{answerInfo}){
        if(Array.isArray(answerInfo)){
            state.loadInfo = answerInfo;
        }else if(typeof answerInfo === "boolean"){
            state.loadInfo.push(answerInfo);
        }else{
            state.loadInfo = [];
        }
    },
    upDateAnswerStatus({state}){  
        state.answerStatus = [];
        for(let index = 0 ; index < state.testNum; index++){
            let item ; 
            //item 1=未答题  2=已答对   3=已答错
            state.loadInfo[index] === true ? item = 2 : (state.loadInfo[index] === false ? item = 3 : item = 1 )
            state.answerStatus[index] = item;
        }
    },
    postAnswer({state}) {
        console.log(state.postArr, "整体答题数据");
        postAnswer(state.postArr, state.testNum);
    },
    defaultPushToPostArr({state}, value) {
        state.postArr.push(value);
    },
    increment({state}) {
        state.pageNumber++;
        console.log(state);
    },
    decrement({state}) {
        state.pageNumber--;
    },
    setPageNumber({state}, value) {
        state.pageNumber = value;
    },
    pushToPostArr({state}, value) {
        console.log(value, "第" + value.id + "道题答题数据");
        state.postArr.splice(value.id, 1, value);
    }
};
const mutations = {
    setIsPost(state, value) {
        state.isShow = value;
    },
    setpIsPost(state, value) {
        state.pisShow = value;
    }
};
window.store = new Vuex.Store({
    state,
    actions,
    mutations,
});

