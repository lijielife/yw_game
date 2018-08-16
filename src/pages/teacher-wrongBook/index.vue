<template>
  <div class="container">
    <div class="content">
      <div class="top">
        <div class="wrong-num">
          <img src="/static/images/pen.png" alt="" class="pen" style="">
          <!--<p>第{{perSequenceCn || '&#45;&#45;'}}期</p>-->
          <p>{{sea}}</p>
          <img src="/static/images/pen.png" alt="" class="pen pen_r" style="">
        </div>
        <!--选择年级关卡-->
        <div class="select">
          <div class="grade">
            <div class="grade-con" @click="_openAlert('grad')">
              <span>{{currentGradName || '--'}}</span>
              <span class="down"></span>
            </div>
            <div class="grade-list" v-show="showGrad">
              <div class="list" v-for="grad in grads" :key="grad.gradId"  @click="_selGrad(grad.gradId)">{{grad.gradName || '--'}}</div>
            </div>
          </div>
          <div class="grade">
            <div class="grade-con" @click="_openAlert('level')">
              <span>第{{currentLevel || '--'}}关</span>
              <span class="down"></span>
            </div>
            <div class="grade-list" v-show="showLevel">
              <div class="list" v-for="(n, index) in allNum" :key="index"  @click="_selLevel(index + 1)">第{{index + 1}}关</div>
            </div>
          </div>
        </div>
      </div>
      <div class="con">
        <div class="item" v-for="(sub, index) in wrongSubject" :key="sub.subjectId">
          <img src="/static/images/wrong_bg.png"  class="wrong_bg">
          <div class="item-con">
            <div class="title">
              {{index + 1}}.{{sub.content}}
            </div>
            <div class="answer-con">
              <div class="answer">
                <p :class="{wrong: answer.no === sub.rightAnswer}" v-for="(answer, index2) in sub.answer" :key="index2">
                  <span class="no">{{answer.no}}.</span>
                  <span class="text">{{answer.con}}</span>
                  <span class="per">{{answer.percent}}</span>
                </p>
              </div>
              <div class="wrong-per">
                <span>错误率{{sub.Wrong_Percent}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--弹窗-->
    <div class="alert-dialog zoomInUp" v-show="showAlert">
      <div class="alert-con">
        <img src="/static/images/visit/close.png" class="close" @click="_cancel">
        <div class="title">
          <img src="/static/images/pen.png" alt="" class="pen" style="">
          <p>{{titleText}}</p>
          <img src="/static/images/pen.png" alt="" class="pen pen_r" style="">
        </div>
        <div class="alert-content selgrad" v-if="showType === 'grad'">
          <div class="alert-content-item" v-for="grad in grads" :key="grad.gradId">
            <div class="alert-content-item-con" @click="_selGrad(grad.gradId)">{{grad.gradName}}</div>
          </div>
        </div>
        <div class="alert-content sellevel" v-if="showType === 'level'">
          <div class="alert-content-item" v-for="item in 21" :key="item">
            <div class="alert-content-item-con" @click="_selLevel(item)">第{{item + 1}}关</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import iconButton from '@/components/icon-button'
  import {grads} from '@/utils/baseUrl'
  import {getSequence, reviewWrongSubject} from '@/utils/api'
  import {changeNum} from '@/utils/index'
  export default {
    data () {
      return {
        imagesSrc: {
          visit: {
            sure: require('static/images/visit/sure.png'),
            cancel: require('static/images/visit/cancel.png')
          }
        },
        currentGradId: '2',
        currentGradName: '',
        showGrad: false,
        showLevel: false,
        perSequence: '', // 当前期数
        perSequenceCn: '',
        allNum: 0, // 关卡数
        currentLevel: '一',
        currentLevelno: 1,
        wrongSubject: [],
        showAlert: false,
        titleText: '请选择年级',
        showType: 'grad',
        sea: '' // 年份季节
      }
    },
    computed: {
      // 老师所教年级
      grads: function () {
        let arr = []
        let teaClassMsg = wx.getStorageSync('userData').teaClassMsg
        if (teaClassMsg.length) {
          teaClassMsg.forEach((item) => {
            grads.forEach((item2) => {
              if (item.gradeCode === item2.gradId) {
                arr.push(item2)
              }
            })
          })
        }
        return arr
      }
    },
    onLoad (opt) {
      this.perSequence = opt.perSequence
      this.sea = opt.sea
      this.perSequenceCn = changeNum(opt.perSequence)
      this._selGrad(wx.getStorageSync('userData').userObj.graId)
    },
    methods: {
      _openAlert (type) {
        this.showAlert = true
        this.showType = type
      },
      _cancel () {
        this.showAlert = false
      },
      // 选择关卡
      _selLevel (val) {
        this.currentLevelno = val
        this.currentLevel = changeNum(val)
        this.reviewWrongSubject()
      },
      // 选择年级
      _selGrad (type) {
        this.currentGradId = type
        grads.forEach((item) => {
          if (type === item.gradId) {
            this.currentGradName = item.gradName
          }
        })
        this._getSequence()
        this._selLevel(1)
      },
      // 根据年级获取关卡
      _getSequence () {
        let param = {
          perSequence: this.perSequence,
          graId: this.currentGradId
        }
        this.allNum = 0
        getSequence(param).then((res) => {
          console.log(res)
          if (res.data !== '0') {
            this.allNum = parseInt(res.data)
          } else {
            wx.showToast({
              title: '当前年级暂无关卡',
              icon: 'none'
            })
            return
          }
        })
      },
      // 获取错题
      reviewWrongSubject () {
        wx.showLoading({
          title: '数据加载中...'
        })
        let param = {
          openid: wx.getStorageSync('openid'),
          perSequence: this.perSequence,
          graId: this.currentGradId,
          ck_sequence: this.currentLevelno,
          userType: wx.getStorageSync('userType'),
          loginid: wx.getStorageSync('userInfo2').loginid || ''
        }
        reviewWrongSubject(param).then((res) => {
          wx.hideLoading()
          this.wrongSubject = []
          if (res.success) {
            this.showAlert = false
            if (res.data.length) {
              res.data.forEach((item) => {
                let answer = []
                let answerNo = ['A', 'B', 'C', 'D', 'E', 'F']
                for (let k in item) {
                  if (k.indexOf('answer') === 0) {
                    let n = parseInt(k.split('answer')[1])
                    answer[n - 1] = {
                      no: answerNo[n - 1],
                      con: item[k],
                      percent: item[`${answerNo[n - 1]}_Percent`]
                    }
                  }
                }
                this.wrongSubject.push({
                  answer: answer,
                  content: item.content,
                  subjectId: item.subjectId,
                  rightAnswer: item.rightAnswer,
                  Wrong_Percent: item.Wrong_Percent
                })
              })
              // 排序
              this.wrongSubject.sort((a, b) => {
                return parseInt(b.Wrong_Percent.split('%')[0]) - parseInt(a.Wrong_Percent.split('%')[0])
              })
            } else {
              wx.showToast({
                title: '暂无错题',
                icon: 'none'
              })
            }
          } else {
            // 账号登出提示
            if (res.data === '404') {
              wx.showModal({
                title: '登出提示',
                content: res.desc,
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    wx.redirectTo({url: '../index/main'})
                  }
                }
              })
              return
            }
            wx.showToast({
              title: res.desc,
              icon: 'none'
            })
          }
        })
      }
    },
    components: {
      iconButton
    }
  }
</script>

<style scoped>
  .container{
    position: relative;
  }
  .pen{
    width: 80rpx !important;
    height: 76rpx !important;
  }
  .pen_r{
    transform-origin: 50% 50%;
    transform: rotateX(0deg) rotateY(180deg);
  }

  .content{
    width: 634rpx;
    height: 100%;
    overflow-y: auto;
  }
  .top{
    text-align: center;
    margin-bottom: 20rpx;
  }
  .wrong-num {
    font-size: 0;
    margin-top: 25rpx;
    margin-bottom: 10rpx;
  }
  .wrong-num p{
    display: inline-block;
    font-size: 42rpx;
    vertical-align: bottom;
    margin: 0 10rpx;
  }
  .select{
    margin: 10rpx 0;
    display: flex;
    align-content: center;
    justify-content: center;
  }
  .grade{
    position: relative;
    width:190rpx;
    height: 100rpx;
    background-color: #b0cd4d;
    box-shadow: 8rpx 8rpx 5rpx #cccccc;
    text-align: center;
    border-radius: 0 10rpx 0 10rpx;
    color: #ffffff;
    margin: 0 30rpx;
    font-size: 32rpx;
    box-sizing: border-box;
    padding-top: 10rpx;
  }
  .grade .grade-con{
    position: relative;
    width: 100%;
    height: 100%;
  }
  .grade .grade-list{
    position: absolute;
    top: 90rpx;
    left: 0;
    width: 100%;
    z-index: 99;
    background-color: #b0cd4d;
    box-shadow: 8rpx 8rpx 5rpx #cccccc;
    border-radius:0 0 20rpx 20rpx;
  }
  .grade .grade-list .list{
    width: 100%;
    height: 100rpx;
    line-height: 100rpx;
    text-align: center;
    border-bottom: 1rpx solid #ffffff;
    border-radius:0 0 20rpx 20rpx;
    /*box-shadow: 8rpx 8rpx 5rpx #cccccc;*/
  }
  .down{
    position: absolute;
    bottom: 15rpx;
    left: 50%;
    transform: translate(-50%);
    height: 0rpx;
    width: 0rpx;
    border-top: 25rpx solid #669900;
    border-left: 27rpx solid transparent;
    border-right: 27rpx solid transparent;
  }

  .con{

  }
  .item{
    position: relative;
    width: 634rpx;
    height: auto;
    margin-bottom: 15rpx;
  }
  .wrong_bg{
    position: absolute;
    z-index: 0;
    width: 634rpx;
    height: 100%;
  }
  .item .item-con{
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 30rpx 45rpx;
    font-size: 28rpx;
  }
  .answer-con{
    display: flex;
  }
  .wrong-per{
    position: relative;
    flex: 0 0 130rpx;
    color: #450000;
  }
  .wrong-per span{
    position: absolute;
    bottom: 0;
    right: 0;
    width: 100rpx;
    /*float: right;*/
    display: inline-block;
    text-align: center;
    line-height: 1.5;
    vertical-align: bottom;
  }
  .item .item-con .answer{
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    margin-top: 5rpx;
  }
  .item .item-con .answer p{
    flex: 1;
    display: flex;
    line-height: 1.5;
    padding: 5rpx 0;
  }
  .item .item-con .answer p .no{
    flex: 0 0 40rpx;
  }
  .item .item-con .answer p .text{
    flex: 1;
  }
  .item .item-con .answer p .per{
    flex:0 0 80rpx;
    color: #c50000;
  }
  .wrong{
    color: #ff9a00;
  }
  @keyframes zoomInUp {
    from {
      opacity: 0;
      -webkit-transform: scale3d(0.1, 0.1, 0.1);
      transform: scale3d(0.1, 0.1, 0.1);
      -webkit-animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
      animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
    }

    60% {
      opacity: 1;
      -webkit-transform: scale3d(0.475, 0.475, 0.475);
      transform: scale3d(0.475, 0.475, 0.475);
      -webkit-animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);
      animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);
    }
  }

  .zoomInUp {
    animation: zoomInUp 0.5s linear;
  }

  .alert-dialog{
    position: absolute;
    z-index: 9999;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 600rpx;
    height: auto;
    border-radius: 16rpx;
    background-color: rgba(0,0,0,0.8);
  }
  .alert-dialog .alert-con {
    position: relative;
    width: 100%;
    font-size: 0;
    padding-top: 50rpx;
  }
  .alert-dialog .alert-con .close{
    position: absolute;
    top: 6rpx;
    right: 0;
    width: 30rpx;
    height: 30rpx;
    font-size: 0;
    padding: 18rpx;
  }
  .alert-dialog .alert-con .title{
    display: block;
    margin: 0 auto;
    font-size:28rpx;
    text-align:center;
  }
  .alert-dialog .alert-con .title img{
    display: inline-block;
  }
  .alert-dialog .alert-con .title p{
    display: inline-block;
    font-size: 32rpx;
    text-align: center;
    color: #ffffff;
    vertical-align:top;
    padding:17rpx;
  }
  .alert-dialog .alert-con .alert-content{
    display: block;
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    padding: 10rpx;
    box-sizing: border-box;
    justify-content: center;
  }
  .alert-dialog .alert-con .alert-content .alert-content-item{
    flex: 0 0 33%;
    text-align: center;
    padding: 0;
    margin-bottom: 30rpx;
  }
  .alert-dialog .alert-con .alert-content .alert-content-item .alert-content-item-con{
    display: inline-block;
    vertical-align: top;
    text-align: center;
    width: 150rpx;
    height: 50rpx;
    line-height: 50rpx;
    font-size: 28rpx;
    color: #ffffff;
    border-radius: 50rpx;
    background-color: #9ed33a;
  }
</style>
