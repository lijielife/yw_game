<template>
  <div class="container">
    <div class="con">
      <div class="question">
        <stu-card :imgUrl="imagesSrc.card">
          <div class="text">{{currentSub.content}}</div>
        </stu-card>
        <div class="pro-bar">
          <div class="bar">
            <!--<img :src="imagesSrc.pro_bar" class="bar-bg">-->
            <img src="/static/images/pro_bar.png" class="bar-bg">
            <span class="num">{{currentNum}}/{{total}}</span>
            <div class="bar-line">
              <div class="line" :style="{width: lineWidth + 'rpx', backgroundColor: bgc, borderColor: bdc}">
                <!--<img :src="imagesSrc.dot" class="dot" :class="{jump: showJump, rotate: !showJump}">-->
                <img src="/static/images/dot.png" class="dot" :class="{jump: showJump, rotate: !showJump}">
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="answer">
        <p class="item"
           v-for="(item, indexNum) in currentSub.answer"
           :key="item.no"
           :class="{right: userAnswer === currentSub.rightAnswer && userAnswer === item.no, wrong: userAnswer !== '' && userAnswer !== currentSub.rightAnswer && userAnswer === item.no,fadeInLeft: indexNum%2 === 0 && userAnswer === '', fadeInRight: indexNum%2 !== 0 && userAnswer === ''}"
           @click="_answer(item.no)">
          {{item.no}}.{{item.con}}
        </p>
      </div>
    </div>
    <foot :imgUrl="imagesSrc.foot"></foot>

    <!-- 弹窗 -->
    <div class="alert-dialog" v-if="showAlert">
      <div class="success" v-if="success">
        <div class="background" @click="_back"></div>
        <!--<img :src="imagesSrc.alert.bg" class="bg bounceInDown">-->
        <img src="/static/images/alert/bg.png" class="bg bounceInDown">
        <!--<img :src="imagesSrc.alert.color" class="color">-->
        <img src="/static/images/alert/color.png" class="color">
        <div class="pg bounceInUp delay">
          <img src="/static/images/alert/p2.png" class="p2">
          <img src="/static/images/alert/p1.png" class="p1">
          <img src="/static/images/alert/gift.png" class="gift">
          <!--<img :src="imagesSrc.alert.p2" class="p2">
          <img :src="imagesSrc.alert.p1" class="p1">
          <img :src="imagesSrc.alert.gift" class="gift">-->
        </div>
        <div class="text bounceInUp">
          <!--<img :src="imagesSrc.alert.text_bg" class="text_bg">-->
          <img src="/static/images/alert/text_bg.png" class="text_bg">
          <!--<img :src="imagesSrc.alert.success_text" class="success_text">-->
          <img src="/static/images/alert/text.png" class="success_text">
        </div>
        <div class="get bounceInUp">
          <p>本关最高分：{{topScore}}</p>
          <p>获得积分：{{currentScore}}</p>
          <p>排名：{{currentRank}}</p>
        </div>
        <div class="btn bounceInUp">
          <div class="next">
            <icon-button :imgUrl="imagesSrc.alert.btn_next" @tapEvent="_next"></icon-button>
          </div>
          <div class="share">
            <button open-type="share" plain="true" style="width: 100%;height: 100%;border: 0;text-align: left;padding: 0;">
              <icon-button :imgUrl="imagesSrc.alert.btn_share"></icon-button>
            </button>
          </div>
        </div>
        <div class="bottom bounceInUp">
          <p @click="_goToRank">查看排行榜>></p>
          <p @click="_goToTop10">查看通关前十名>></p>
        </div>
      </div>
      <div class="fail zoomInUp" v-if="!success">
        <!-- <img :src="imagesSrc.alert.boom" alt="" class="boom">
        <img :src="imagesSrc.alert.fail_text" alt="" class="fail_text"> -->
        <div class="background" @click="_back"></div>
        <img src="/static/images/alert/boom.png" class="boom">
        <img src="/static/images/alert/fail_text.png" class="fail_text">
        <div class="again">
          <icon-button :imgUrl="imagesSrc.alert.btn_again" @tapEvent="_again"></icon-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import stuCard from '@/components/stu-card'
  import foot from '@/components/foot'
  // import {alert} from '@/utils/wx'
  import {getAccessPassSubject, submitUserAnswer, getShareCoin, checkYoukeGoldCoin} from '@/utils/api'
  import iconButton from '@/components/icon-button'
  export default {
    data () {
      return {
        imagesSrc: {
          hats: {
            stu_1: require('static/images/hats/stu_1.png'),
            stu_2: require('static/images/hats/stu_2.png'),
            stu_3: require('static/images/hats/stu_3.png'),
            stu_4: require('static/images/hats/stu_4.png'),
            stu_5: require('static/images/hats/stu_5.png')
          },
          card: require('static/images/card/s1.png'),
          foot: require('static/images/foot_img.png'),
//          pro_bar: require('static/images/pro_bar.png'),
//          dot: require('static/images/dot.png'),
          alert: {
           /* bg: require('static/images/alert/bg.png'),
            boom: require('static/images/alert/boom.png'),
            color: require('static/images/alert/color.png'),
            fail_text: require('static/images/alert/fail_text.png'),
            success_text: require('static/images/alert/text.png'),
            gift: require('static/images/alert/gift.png'),
            text_bg: require('static/images/alert/text_bg.png'),
            p1: require('static/images/alert/p1.png'),
            p2: require('static/images/alert/p2.png'), */
            btn_again: require('static/images/alert/btn_again.png'),
            btn_next: require('static/images/alert/btn_next.png'),
            btn_share: require('static/images/alert/btn_share.png')
          }
        },
        showJump: false, // 进度条样式
        clearTime: null,
        time: 30, // 答题时间
        s: 0, // 单题耗时
        lineWidth: 0,
        subObj: {}, // 当前关卡总题目list
        currentSub: {}, // 当前题目
        currentNum: 1, // 当前题目序号
        total: 0, // 题目数量
        userAnswer: '', // 用户答案
        wrongAnswer: [],
        rightAnswer: [],
        submitAnswer: {
          openid: '',
          perSequence: '', // 期数
          graId: '', // 年级
          mySequence: '', // 关卡序号
          integral: '', // 积分
          viaTime: 0, // 总耗时
          wrongAnswer: '', // 错题
          rightAnswer: '' // 对题
        },
        showAlert: false,
        success: false,
        submitResult: {},
        currentSequence: 0, // 当前的关卡序号
        currentScore: '0', // 当前关卡获得分数
        currentRank: '0', // 当前关卡排名
        topScore: '0', // 最高分数
        levelNum: 4, // 总关卡
        isUpdateTitle: false,
        gradId: '',
        ckId: '', // 关卡id
        bgc: 'rgb(255, 160, 0)',  // 绿色rgb(158, 211, 0)-->橙红rgb(255, 77, 0)
        bdc: 'rgb(255, 180, 0)'  // 绿色rgb(204, 211, 0)-->橙红rgb(204, 77, 0)
      }
    },
    computed: {},
    created () {
    },
    onShareAppMessage (res) {
      if (res.from === 'button') {
        // 来自页面内转发按钮
        console.log(res.target)
      }
      wx.showShareMenu({
        withShareTicket: true
      })
      let _this = this
      return {
        title: '语文大闯关',
        path: `/pages/student/main?openid=${wx.getStorageSync('openid')}`,
        success () {
          let param = {
            shareOpenid: wx.getStorageSync('openid'),
            userOpenid: '',
            ckId: _this.ckId,
            isUpdateTitle: _this.isUpdateTitle
          }
          getShareCoin(param).then((res) => {
            console.log(res)
            if (res.data.msg !== '') {
              wx.showToast({
                title: res.data.msg,
                icon: 'none'
              })
            }
          })
        }
      }
    },
    onLoad (options) {
      this.showAlert = false
      this._initCutDown()
      this.gradId = options.gradId
      this.getAccessPassSubject(options.id)
      this.currentSequence = parseInt(options.id)
      this.levelNum = parseInt(options.levelNum)
    },
    onHide () {
      console.log('hide')
      this._initCutDown()
    },
    mounted () {
    },
    methods: {
      _back () {
        setTimeout(() => {
          wx.navigateBack()
        }, 300)
      },
      // 下一关
      _next () {
        this.showAlert = false
        console.log(this.currentSequence)
        this.currentSequence++
        if (this.currentSequence > this.levelNum) {
          wx.navigateBack()
          return
        }
        if (wx.getStorageSync('userData').weixinObj.usertype === '3') {
          let data = {
            openid: wx.getStorageSync('openid')
          }
          let _this = this
          // 游客登录需要金币是否足够
          checkYoukeGoldCoin(data).then((res) => {
            if (res.success) {
              wx.showToast({
                title: '-10金币',
                icon: 'none',
                success: () => {
                  setTimeout(() => {
                    _this.getAccessPassSubject(this.currentSequence)
                  }, 1000)
                }
              })
            } else {
              wx.showToast({
                title: res.desc,
                icon: 'none',
                success: () => {
                  setTimeout(() => {
                    _this._back()
                  }, 1000)
                }
              })
            }
          })
        } else {
          this.getAccessPassSubject(this.currentSequence)
        }
      },
      // 再玩一次
      _again () {
        this.showAlert = false
        if (wx.getStorageSync('userData').weixinObj.usertype === '3') {
          let data = {
            openid: wx.getStorageSync('openid')
          }
          // 游客登录需要金币是否足够
          let _this = this
          checkYoukeGoldCoin(data).then((res) => {
            if (res.success) {
              wx.showToast({
                title: '-10金币',
                icon: 'none',
                success: () => {
                  setTimeout(() => {
                    _this.getAccessPassSubject(this.currentSequence)
                  }, 1000)
                }
              })
            } else {
              wx.showToast({
                title: res.desc,
                icon: 'none',
                success: () => {
                  setTimeout(() => {
                    _this._back()
                  }, 1000)
                }
              })
            }
          })
        } else {
          this.getAccessPassSubject(this.currentSequence)
        }
      },
      // 答题结果弹窗 true:闯关成功，false：闯关失败
      _result (res) {
        this.showAlert = true
        this.success = res
      },
      // 答题
      _answer (answer) {
        this._initCutDown()
        this.userAnswer = answer
        if (answer !== this.currentSub.rightAnswer) {
          this.submitAnswer.integral = 0
          this.wrongAnswer.push({
            subject_id: this.currentSub.subjectId,
            userAnswer: answer
          })
          this._submitAnswer()
          return
        } else {
          this.rightAnswer.push({
            subject_id: this.currentSub.subjectId,
            userAnswer: answer
          })
          console.log(`正确答案${this.currentNum}：`, this.rightAnswer)
        }
        if (this.currentNum < this.total) {
          this.currentNum++
        } else {
          this._submitAnswer()
          return
        }
        // 切题
        let _this = this
        setTimeout(() => {
          _this.setCurrentSub(_this.currentNum - 1)
        }, 600)
      },
      // 提交答案
      _submitAnswer () {
        console.log('提交答案')
        this.isUpdateTitle = false
        this.submitAnswer.openid = wx.getStorageSync('openid')
        this.submitAnswer.wrongAnswer = JSON.stringify(this.wrongAnswer)
        this.submitAnswer.rightAnswer = JSON.stringify(this.rightAnswer)
        console.log('答案：', this.submitAnswer)
        submitUserAnswer(this.submitAnswer).then((res) => {
          console.log(res)
          if (res.success) {
            if (res.data.flag) {
              // 当前关卡获得分数
              this.currentScore = res.data.viaRepScore
              this.currentRank = res.data.stuRank
              this.topScore = res.data.topScore
              this.isUpdateTitle = res.data.isUpdateTitle
              this._result(true)
            } else {
              this._result(false)
            }
          } else {
            wx.showToast({
              title: res.desc,
              icon: 'none'
            })
          }
        })
      },
      // 获取题目
      getAccessPassSubject (opt) {
        this.wrongAnswer = []
        this.rightAnswer = []
        wx.showLoading({
          title: '数据加载中...'
        })
        let param = {
          openid: wx.getStorageSync('openid'),
          ckId: opt,
          perSequence: wx.getStorageSync('userData').userObj.perSequence,
          graId: this.gradId,
          ck_sequence: opt
        }
        getAccessPassSubject(param).then((res) => {
          wx.hideLoading()
          console.log(res, 'data')
          if (res.success) {
            this.ckId = res.data.ckOjbMsg.id
            this.submitAnswer.viaTime = 0
            // 当前关卡总题目
            this.subObj = res.data.subjectObjs
            this.total = this.subObj.length

            this.submitAnswer.perSequence = res.data.ckOjbMsg.perSequence
            this.submitAnswer.integral = res.data.ckOjbMsg.integral
            this.submitAnswer.graId = res.data.ckOjbMsg.gradeid
            this.submitAnswer.mySequence = res.data.ckOjbMsg.sequence
            // 当前题号
            this.currentNum = 1
            // 初始化第一题
            this.setCurrentSub(0)
          } else {
            wx.showToast({
              title: res.desc,
              icon: 'none',
              success: () => {
                wx.navigateBack()
              }
            })
          }
        })
      },
      // 设置当前题目
      setCurrentSub (i) {
        // 清除用户答案
        this.userAnswer = ''
        // 清空旧题
        this.currentSub = {}
        let answerNo = ['A', 'B', 'C', 'D', 'E', 'F']
        this.currentSub.answer = []
        for (let k in this.subObj[i]) {
          if (k.indexOf('answer') !== -1) {
            let n = parseInt(k.split('answer')[1])
            this.currentSub.answer[n - 1] = {
              no: answerNo[n - 1],
              con: this.subObj[i][k]
            }
          }
        }
        this.currentSub.subjectId = this.subObj[i].subjectId
        this.currentSub.content = this.subObj[i].content
        this.currentSub.rightAnswer = this.subObj[i].rightAnswer
        console.log('rightAnswer:', this.currentSub.rightAnswer)
        console.log('subjectId:', this.currentSub.subjectId)
        // 开始倒计时
        this.cutDown()
      },
      // 初始化答题进度条
      _initCutDown () {
        // 清除定时器
        clearTimeout(this.clearTime)
        // 累积答题耗时
        this.submitAnswer.viaTime += this.s
        this.s = 0
        this.showJump = false
        this.lineWidth = 0
        this.bgc = `rgb(255, 160, 0)`
        this.bdc = `rgb(255, 180, 0)`
      },
      // 答题进度条倒计时
      cutDown () {
        let _this = this
        this.s++
        this.lineWidth = (374 / this.time) * this.s
        if (this.s > this.time * 0.8) {
          this.bgc = `rgb(255, 77, 0)`
          this.bdc = `rgb(255, 110, 0)`
        }
        this.clearTime = null
        this.clearTime = setTimeout(() => {
          // 时间快到
          if (_this.lineWidth > 374 * 0.8) {
            _this.showJump = true
          }
          // 超时
          if (_this.s >= _this.time) {
            _this._initCutDown()
            _this.submitAnswer.integral = 0
            _this.wrongAnswer.push({
              subject_id: _this.currentSub.subjectId,
              userAnswer: _this.userAnswer
            })
            _this._submitAnswer()
            return false
          }
          _this.cutDown()
        }, 1000)
      },
      // 跳转排行榜
      _goToRank () {
        this.goToPage('rank')
      },
      // 跳转前十排行
      _goToTop10 () {
        let param = `?mySequence=${this.currentSequence}`
        this.goToPage('top10', param)
      },
      // 跳转页面
      goToPage (page, param) {
        let url = param ? `../${page}/main${param}` : `../${page}/main`
        wx.navigateTo({url: url})
      }
    },
    components: {
      stuCard,
      foot,
      iconButton
    }
  }
</script>

<style scoped>
  .con{
    width: 602rpx;
    margin-top: 125rpx;
    min-height: 500rpx;
  }
  .question{
    position: relative;
    width: 602rpx;
    height: auto;
    box-sizing: border-box;
  }
  .question .text{
    padding: 75rpx 65rpx 60rpx 90rpx;
    font-size: 38rpx;
  }
  .question .pro-bar{
    position: absolute;
    top: -80rpx;
    left: 95rpx;
    width: 412rpx;
    height: 110rpx;
  }
  .question .pro-bar .bar{
    position: relative;
    width: 100%;
    height: 100%;
    font-size: 0;
  }
  .question .pro-bar .bar .bar-bg{
    position: absolute;
    width: 100%;
    height: 100%;
  }
  .question .pro-bar .bar .num{
    position: absolute;
    top: 0rpx;
    left: 0rpx;
    display: inline-block;
    width: 204rpx;
    height: 46rpx;
    line-height: 46rpx;
    text-align: center;
    font-size: 30rpx;
    color: #ffffff;
  }
  .question .pro-bar .bar .bar-line{
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 64rpx;
    box-sizing: border-box;
    padding: 17rpx 19rpx;
  }
  .question .pro-bar .bar .bar-line .line{
    position: relative;
    width: 0%;
    height: 100%;
    background-color: #ff4d07;
    border-radius: 8rpx;
    box-sizing: border-box;
    border: 5rpx solid #ffa63d;
    transition: all 1s linear;
  }
  .question .pro-bar .bar .bar-line .line.bgc{
    background-color: #9ed33a;
  }
  .question .pro-bar .bar .bar-line .line .dot{
    position: absolute;
    top: -12rpx;
    right: -26rpx;
    width: 45rpx;
    height: 45rpx;
    transform: scale(1);
  }
  .rotate{
    transform-origin: center center;
    animation: rotate 1s linear infinite;
  }
  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(180deg);
    }
  }
  .jump{
    animation: jump 1s linear infinite;
  }
  @keyframes jump {
    0% {
      transform: scale(1);
    }
    25% {
      transform: scale(1.2);
    }
    50% {
      transform: scale(1);
    }
    75% {
      transform: scale(0.8);
    }
    100% {
      transform: scale(1);
    }
  }
  .answer {
    max-height: 650rpx;
    overflow-y: auto;
  }
  .answer .item{
    width: 520rpx;
    height: auto;
    padding: 25rpx 20rpx;
    font-size: 30rpx;
    color: #530000;
    background-color: #fdd329;
    border-radius: 5rpx;
    box-shadow: 8rpx 8rpx 5rpx #cccccc;
    margin: 25rpx auto;
    transition: all 0.3s;
  }
  .answer .item.right{
    background-color: #9ed33a;
  }
  .answer .item.wrong{
    background-color: #ff4d07;
  }

  /* 弹窗 */
  .alert-dialog{
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 999;
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-content: center;
  }
  .alert-dialog .background{
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 19;
  }
  .alert-dialog .success .background{
    z-index: 0;
  }
  /*成功*/
  .alert-dialog .success{
    position: relative;
    width: 100%;
    font-size: 0;
    top: 0;
    left: 0;
  }
  .alert-dialog .success .bg {
    position: absolute;
    z-index: 1;
    top: 13%;
    left: 12%;
    /*margin-left: -50%;
    margin-top: -70%;*/
    /*transform: translate(-50%,-50%);*/
  }
  .alert-dialog .success .color{
    position: absolute;
    z-index: 99;
    top: 23%;
    left: 0%;
    opacity: 0;
    transform-origin: center center;
    /*transition: all 2s;*/
    animation: rollBig 3s linear 1s;
    /*animation: rollRL 0.5s linear 1.5s infinite alternate;*/
  }
  @keyframes rollRL {
    0%{
      opacity: 0;
      /*transform: translate(20rpx)*/
    }
    50%{
      opacity: 1;
      /*transform: translate(0rpx)*/
    }
    100%{
      opacity: 1;
      /*transform: translate(-20rpx)*/
    }
  }
  @keyframes rollBig {
    0%{
      opacity: 1;
      transform: scale(0.1);
    }
    5%{
      /*opacity: 1;*/
      transform: scale(1) translateY(-150rpx);
    }
    /*30%{
      transform: scale(1);
      !*top: 0%;*!
    }*/
    100%{
      transform: scale(1) translateY(900rpx);
    }
  }
  /*闯关文字*/
  .alert-dialog .success .text{
    position: absolute;
    z-index: 10;
    top: 43%;
    left: 70rpx;
    width: 610rpx;
    height: 235rpx;
  }
  .alert-dialog .success .text .text_bg{
    position: absolute;
    z-index: 1;
  }
  .alert-dialog .success .text .success_text{
    position: absolute;
    z-index: 2;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
  }
  /*人物和礼物*/
  .alert-dialog .success .pg{
    position: absolute;
    z-index: 9;
    top: 18%;
    left: 17%;
    /*transform: translate(-50%,-75%);*/
    width: 495rpx;
    height: 414rpx;
    opacity: 0;
  }
  .alert-dialog .success .pg .p1{
    position: absolute;
    z-index: 0;
    right: 0;
    top: 0;
  }
  .alert-dialog .success .pg .p2{
    position: absolute;
    z-index: 0;
    left: 0;
    top: 0;
  }
  .alert-dialog .success .pg .gift{
    position: absolute;
    z-index: 2;
    top: 45%;
    left: 14%;
    /*transform: translate(-45%, 0%);*/
    /*animation: roll 1s linear 0s infinite alternate;*/
  }
  @keyframes roll {
    0%{
      transform: translateY(0);
    }
    25%{
      transform: translateY(-30rpx);
    }
    60%{
      transform: translateY(0rpx);
    }
    90%{
      transform: translateY(30rpx);
    }
  }
  /*积分排名*/
  .alert-dialog .success .get{
    position: absolute;
    z-index: 10;
    top: 57%;
    left: 10%;
    /*transform: translate(-50%,210%);*/
    width: 615rpx;
  }
  .alert-dialog .success .get p{
    width: 100%;
    font-size: 32rpx;
    text-align: center;
    color: #910000;
  }
  /*按钮*/
  .alert-dialog .success .btn{
    position: absolute;
    z-index: 20;
    top: 68%;
    left: 10%;
    /*transform: translate(-50%,50%);*/
    display: flex;
    width: 615rpx;
  }
  .alert-dialog .success .btn .share{
    margin-left: 70rpx;
  }
  /* 查看排行 */
  .alert-dialog .success .bottom{
    position: absolute;
    z-index: 20;
    top: 80%;
    left: 30%;
    /*transform: translate(-50%, 50%);*/
    text-align: center;
  }
  .alert-dialog .success .bottom p{
    font-size: 28rpx;
    padding: 5rpx 20rpx;
    line-height: 45rpx;
    background-color: #9ed33a;
    border-radius: 8rpx;
    margin-bottom: 20rpx;
    color: #ffffff;
  }
  /*失败*/
  .alert-dialog .fail{
    position: relative;
    width: 100%;
    font-size: 0;
  }
  .alert-dialog .fail .boom{
    position: absolute;
    top: 50%;
    margin-top: -60%;
    z-index: 0;
  }
  .alert-dialog .fail .fail_text{
    position: absolute;
    z-index: 1;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -150%);
  }
  .alert-dialog .fail .again{
    position: absolute;
    z-index: 20;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -30%);
  }


  /*img*/
  .alert-dialog .bg{
    width: 580rpx;
    height: 745rpx;
  }
  .alert-dialog .color{
    width: 750rpx;
    height: 325rpx;
  }
  .alert-dialog .text_bg{
    width: 610rpx;
    height: 235rpx;
  }
  .alert-dialog .success_text{
    width: 350rpx;
    height: 89rpx;
  }
  .alert-dialog .p1{
    width: 212rpx;
    height: 391rpx;
  }
  .alert-dialog .p2{
    width: 270rpx;
    height: 414rpx;
  }
  .again, .next, .share{
    width: 274rpx;
    height: 121rpx;
  }
  .alert-dialog .gift{
    width: 390rpx;
    height: 185rpx;
  }
  .alert-dialog .boom{
    width: 750rpx;
    height: 746rpx;
  }
  .alert-dialog .fail_text{
    width: 360rpx;
    height: 89rpx;
  }
  /*动画*/
  /*小到大*/
  @keyframes zoomInDown {
    from {
      opacity: 0;
      -webkit-transform: scale3d(0.1, 0.1, 0.1) translate3d(0, -1000rpx, 0);
      transform: scale3d(0.1, 0.1, 0.1) translate3d(0, -1000rpx, 0);
      -webkit-animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
      animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
    }

    60% {
      opacity: 1;
      -webkit-transform: scale3d(0.475, 0.475, 0.475) translate3d(0, 60rpx, 0);
      transform: scale3d(0.475, 0.475, 0.475) translate3d(0, 60rpx, 0);
      -webkit-animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);
      animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);
    }
  }

  .zoomInDown {
    animation: zoomInDown 2s linear;
    /*-webkit-animation-name: zoomInDown;
    animation-name: zoomInDown;*/
  }
  @keyframes bounceInUp {
    from,
    60%,
    75%,
    90%,
    to {
      -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
      animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    }

    from {
      opacity: 0;
      -webkit-transform: translate3d(0, 3000px, 0);
      transform: translate3d(0, 3000px, 0);
    }

    60% {
      opacity: 1;
      -webkit-transform: translate3d(0, -20px, 0);
      transform: translate3d(0, -20px, 0);
    }

    75% {
      -webkit-transform: translate3d(0, 10px, 0);
      transform: translate3d(0, 10px, 0);
    }

    90% {
      -webkit-transform: translate3d(0, -5px, 0);
      transform: translate3d(0, -5px, 0);
    }

    to {
      opacity: 1;
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
    }
  }
  .bounceInUp {
    animation: bounceInUp 1s linear;
  }

  @keyframes bounceInDown {
    from,
    60%,
    75%,
    90%,
    to {
      -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
      animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    }

    0% {
      opacity: 0;
      -webkit-transform: translate3d(0, -3000px, 0);
      transform: translate3d(0, -3000px, 0);
    }

    60% {
      opacity: 1;
      -webkit-transform: translate3d(0, 25px, 0);
      transform: translate3d(0, 25px, 0);
    }

    75% {
      -webkit-transform: translate3d(0, -10px, 0);
      transform: translate3d(0, -10px, 0);
    }

    90% {
      -webkit-transform: translate3d(0, 5px, 0);
      transform: translate3d(0, 5px, 0);
    }

    to {
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
    }
  }
  .bounceInDown {
    animation: bounceInDown 1s linear;
  }
  .delay{
    animation-delay: 0.3s;
    animation-fill-mode: forwards;
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
  @keyframes fadeInLeft {
    from {
      opacity: 0;
      transform: translate3d(-100%, 0, 0);
    }

    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }

  .fadeInLeft {
    animation: fadeInLeft 1s linear;
  }
  @keyframes fadeInRight {
    from {
      opacity: 0;
      transform: translate3d(100%, 0, 0);
    }

    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }

  .fadeInRight {
    animation: fadeInRight 1s linear;
  }
</style>
