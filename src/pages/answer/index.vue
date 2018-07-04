<template>
  <div class="container">
    <music-button :t="musicPosition.t" :r="musicPosition.r" @toggle="_toggle"></music-button>
    <div class="con">
      <div class="question" v-if="!showLevel">
        <stu-card :imgUrl="imagesSrc.card">
          <text class="text">{{currentSub.content}}</text>
        </stu-card>
        <div class="pro-bar">
          <div class="bar">
            <img src="/static/images/pro_bar.png" class="bar-bg">
            <span class="num">{{currentNum}}/{{total}}</span>
            <div class="bar-line">
              <div class="line" :style="{width: lineWidth + 'rpx', backgroundColor: bgc, borderColor: bdc}">
                <img src="/static/images/dot.png" class="dot" :class="{jump: showJump, rotate: !showJump}">
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="answer" v-if="!showLevel">
        <p class="item"
           v-for="(item, indexNum) in currentSub.answer"
           :key="item.no"
           :class="{right: userAnswer === currentSub.rightAnswer && userAnswer === item.no, wrong: userAnswer !== '' && userAnswer !== currentSub.rightAnswer && userAnswer === item.no,fadeInLeft: indexNum%2 === 0 && userAnswer === '', fadeInRight: indexNum%2 !== 0 && userAnswer === ''}"
           @click="_limitAnswer(item.no)">
          {{item.no}}.{{item.con}}
        </p>
      </div>
    </div>
    <foot :imgUrl="imagesSrc.foot"></foot>

    <!-- 弹窗 -->
    <div class="alert-dialog" v-if="showAlert">
      <!--闯关成功-->
      <div class="success" v-if="success !== '3'">
        <div class="background" @click="_back"></div>
        <!--淡绿椭圆背景-->
        <img src="/static/images/alert/bg.png" class="bg bounceInDown" v-if="success === '1' || success === '4'">
        <!--礼花散开-->
        <img src="/static/images/alert/color.png" class="color">
        <!--人物和礼物-->
        <div class="pg bounceInUp delay" v-if="success === '1'">
          <img src="/static/images/alert/p2.png" class="p2">
          <img src="/static/images/alert/p1.png" class="p1">
          <img src="/static/images/alert/gift.png" class="gift">
        </div>
        <!--童生到贡士晋升-->
        <div class="pg bounceInUp delay" v-if="success === '4'">
          <img :src="imagesSrc.hatsText[hatsTextType]" class="hatText">
          <img :src="imagesSrc.hats[hatType]" class="hat" :class="hatType">
        </div>
        <!--状元淡紫椭圆背景-->
        <div class="bgColor bounceInDown" v-if="success === '2'"></div>
        <!--状元礼花背景-->
        <img src="/static/images/alert/fire_gift.png" class="fire_gift bounceInUp delay" v-if="success === '2'">
        <!--状元贺喜文字-->
        <img src="/static/images/alert/no1_text.png" class="no1_text bounceInDown" v-if="success === '2'">
        <!--状元人物-->
        <img src="/static/images/alert/no1.png" class="no1 bounceInUp delay" v-if="success === '2'">
        <!--闯关成功文字-->
        <div class="text bounceInUp">
          <img src="/static/images/alert/text_bg.png" class="text_bg">
          <img src="/static/images/alert/text.png" class="success_text">
        </div>
        <!--得分-->
        <div class="get bounceInUp" :class="{colorW: success === '2'}">
          <p>本关最高分：{{topScore}}</p>
          <p>获得金币：{{currentScore}}</p>
          <p>排名：{{currentRank}}</p>
        </div>
        <!--按钮-->
        <div class="btn bounceInUp">
          <div class="next" style="margin-right: 35rpx;" v-if="success === '1' || success === '4'">
            <icon-button :imgUrl="imagesSrc.alert.btn_next" @tapEvent="_next"></icon-button>
          </div>
          <div class="share">
            <button open-type="share" plain="true" style="width: 100%;height: 100%;border: 0;text-align: left;padding: 0;">
              <icon-button :imgUrl="imagesSrc.alert.btn_share"></icon-button>
            </button>
          </div>
        </div>
        <!--查看排行-->
        <div class="bottom bounceInUp">
          <p @click="_goToRank">查看排行榜>></p>
          <p @click="_goToTop10">查看通关前十名>></p>
        </div>
      </div>
      <!--闯关失败-->
      <div class="fail zoomInUp" v-if="success === '3'">
        <div class="background" @click="_back"></div>
        <img src="/static/images/alert/boom.png" class="boom">
        <img src="/static/images/alert/fail_text.png" class="fail_text">
        <div class="again">
          <icon-button :imgUrl="imagesSrc.alert.btn_again" @tapEvent="_again"></icon-button>
        </div>
      </div>
    </div>
    <alert-dialog v-if="showGetGold" @closeAlert="_closeAlert" :getType="type"></alert-dialog>
    <!--<img v-if="showDiamon" src="/static/images/alert/diamon.png" class="diamon">-->
    <!--切题显示关卡-->
    <!--<div class="showLevel" v-if="showLevel">
      <div class="level-con">
        <img src="/static/images/level_bg.png" class="level-bg">
        <img src="/static/images/earth.png" class="earth">
        <img src="/static/images/lines.png" class="lines">
        <p class="level-text">第{{currentSequence}}关</p>
      </div>
    </div>-->
    <p class="levelText"  v-if="showLevel">第{{currentSequence}}关</p>
    <!--头衔(暂不采用)-->
    <div class="showHats bounceInDown" :class="{big2: hidden}" v-if="showHats">
      <img :src="imagesSrc.hats[hatType]" class="hat" :class="hatType">
      <p class="text">{{hatText}}</p>
    </div>
    <!--扣减金币-->
    <div class="deleteDiamond" v-if="showDelete">
      <img src="/static/images/gold.png">
      <p class="text">-10钻石</p>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import stuCard from '@/components/stu-card'
  import foot from '@/components/foot'
  import alertDialog from '@/components/alert-dialog'
  // import {alert} from '@/utils/wx'
  import {getAccessPassSubject, submitUserAnswer, getShareCoin, checkYoukeGoldCoin} from '@/utils/api'
  import iconButton from '@/components/icon-button'
  import musicButton from '@/components/music-button'
  export default {
    data () {
      return {
        imagesSrc: {
          // 头衔帽子
          hats: {
            stu_1: require('static/images/hats/stu_1.png'),
            stu_2: require('static/images/hats/stu_2.png'),
            stu_3: require('static/images/hats/stu_3.png'),
            stu_4: require('static/images/hats/stu_4.png'),
            stu_5: require('static/images/hats/stu_5.png'),
            stu_6: require('static/images/hats/stu_6.png')
          },
          // 头衔文字
          hatsText: {
            stu_text_1: require('static/images/hats/stu_text_1.png'),
            stu_text_2: require('static/images/hats/stu_text_2.png'),
            stu_text_3: require('static/images/hats/stu_text_3.png'),
            stu_text_4: require('static/images/hats/stu_text_4.png'),
            stu_text_5: require('static/images/hats/stu_text_5.png')
          },
          card: require('static/images/card/s1.png'),
          foot: require('static/images/foot_img.png'),
          alert: {
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
          integral: '', // 金币
          viaTime: 0, // 总耗时
          wrongAnswer: '', // 错题
          rightAnswer: '' // 对题
        },
        showAlert: false,
        success: '1', // 1：普通关卡 2：状元关卡 3：答错关卡 4：其他
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
        bdc: 'rgb(255, 180, 0)',  // 绿色rgb(204, 211, 0)-->橙红rgb(204, 77, 0)
        showGetGold: false,
        type: 'getScore',
        showDiamon: false,
        titleUp: '0', // 头衔
        showHats: false,
        hatType: 'stu_1',
        hatsTextType: 'stu_text_1',
        hatText: '恭喜晋升到童生！',
        hidden: false,
        showLevel: true,
        cleanTime: null,
        musicPosition: { // 开关按钮位置
          t: '',
          r: ''
        },
        showMusic: true, // 是否启动音效,默认启动
        showDelete: false, // 游客钻石减去动效
        flag: true,  // 答题期间离开答题
        onceSubmit: false, // 防止网络延迟导致重复提交答案
        onceAnswer: false // 防止每道题被多次点击
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
            if (res.success) {
              if (_this.isUpdateTitle) {
                // 升头衔了
                _this.showGetGold = true
                if (wx.getStorageSync('userType') === '2') {
                  _this.type = 'getScore' // getGold, getScore
                } else {
                  _this.type = 'gold_diamon'
                }
                // 只能分享一次
                _this.isUpdateTitle = false
              } else {
                // 未升头衔,只有游客才加钻石
                _this.showGetGold = true
                if (wx.getStorageSync('userType') === '3') {
                  _this.type = 'getGold'
                } else {
                  _this.type = 'getScore2'
                }
              }
            }
          })
        }
      }
    },
    onLoad (options) {
      this.showDelete = false
      this.showLevel = false
      clearTimeout(this.cleanTime)
      this.showAlert = false
      this._initCutDown()
      this.gradId = options.gradId
      this.getAccessPassSubject(options.id)
      this.currentSequence = parseInt(options.id)
      this.levelNum = parseInt(options.levelNum)
    },
    onUnload () {
      let _this = this
      if (this.flag) {
        wx.showModal({
          title: '提示',
          content: '你选择了放弃本关……闯关失败！',
          showCancel: false,
          success (res) {
            _this._initCutDown()
            if (res.confirm) {
              _this.wrongAnswer.push({
                subject_id: _this.currentSub.subjectId,
                userAnswer: ''
              })
              _this._submitAnswer(true)
            }
          }
        })
      }
    },
    mounted () {
    },
    methods: {
      // 切换启动
      _toggle () {
        this.showMusic = !this.showMusic
      },
      _closeAlert () {
        this.showGetGold = false
      },
      _back () {
        setTimeout(() => {
          wx.navigateBack()
        }, 300)
      },
      // 下一关
      _next () {
        if (this.currentSequence >= this.levelNum) {
          wx.navigateBack()
          return
        }
        if (wx.getStorageSync('userData').weixinObj.usertype === '3') {
          let data = {
            openid: wx.getStorageSync('openid')
          }
          let _this = this
          // 游客登录需要钻石是否足够
          checkYoukeGoldCoin(data).then((res) => {
            if (res.success) {
              // _this.showDiamon = true
              /* this.showDelete = true
              wx.showToast({
                title: '-10钻石',
                image: '/static/images/gold.png'
              }) */
              this.showDelete = true
              setTimeout(() => {
                _this.currentSequence++
                _this.getAccessPassSubject(_this.currentSequence)
                _this.showDelete = false
              }, 1500)
            } else {
              _this.showGetGold = true
              _this.type = 'goldNull'
              return
            }
            this.showAlert = false
          })
        } else {
          this.currentSequence++
          this.showAlert = false
          this.getAccessPassSubject(this.currentSequence)
        }
      },
      // 再玩一次
      _again () {
        if (wx.getStorageSync('userData').weixinObj.usertype === '3') {
          let data = {
            openid: wx.getStorageSync('openid')
          }
          // 游客登录需要钻石是否足够
          let _this = this
          checkYoukeGoldCoin(data).then((res) => {
            if (res.success) {
              this.showDelete = true
              // _this.showDiamon = true
              /* wx.showToast({
                title: '-10钻石',
                image: '/static/images/gold.png'
              }) */
              setTimeout(() => {
                _this.getAccessPassSubject(_this.currentSequence)
                // _this.showDiamon = false
                _this.showDelete = false
              }, 1500)
            } else {
              _this.showGetGold = true
              _this.type = 'goldNull'
              return
            }
            this.showAlert = false
          })
        } else {
          this.showAlert = false
          this.getAccessPassSubject(this.currentSequence)
        }
      },
      // 答题结果弹窗 true:闯关成功，false：闯关失败
      _result (res) {
        this.showAlert = true
        this.success = res
      },
      // 答题限制
      _limitAnswer (val) {
        if (this.onceAnswer) {
          this._answer(val)
        }
      },
      // 答题
      _answer (answer) {
        this.onceAnswer = false
        this._initCutDown()
        this.userAnswer = answer
        if (answer !== this.currentSub.rightAnswer) {
          this.submitAnswer.integral = 0
          this.wrongAnswer.push({
            subject_id: this.currentSub.subjectId,
            userAnswer: answer
          })
          if (this.onceSubmit) {
            this._submitAnswer()
          }
          return
        } else {
          this.rightAnswer.push({
            subject_id: this.currentSub.subjectId,
            userAnswer: answer
          })
          if (this.showMusic) {
            let innerAudioContext = wx.createInnerAudioContext()
            innerAudioContext.autoplay = true
            innerAudioContext.src = '/static/music_true.mp3'
            innerAudioContext.onPlay(() => {
              console.log('开始播放')
            })
          }
          console.log(`正确答案${this.currentNum}：`, this.rightAnswer)
        }
        if (this.currentNum < this.total) {
          this.currentNum++
        } else {
          console.log(this.onceSubmit, 'dd')
          if (this.onceSubmit) {
            this._submitAnswer()
          }
          return
        }
        // 切题
        let _this = this
        setTimeout(() => {
          _this.setCurrentSub(_this.currentNum - 1)
        }, 600)
      },
      // 提交答案
      _submitAnswer (type) {
        this.flag = false
        this.onceSubmit = false
        console.log('提交答案')
        this.isUpdateTitle = false
        this.submitAnswer.openid = wx.getStorageSync('openid')
        this.submitAnswer.wrongAnswer = JSON.stringify(this.wrongAnswer)
        this.submitAnswer.rightAnswer = JSON.stringify(this.rightAnswer)
        submitUserAnswer(this.submitAnswer).then((res) => {
          console.log(res)
          if (res.success) {
            if (res.data.flag) {
              // 当前关卡获得分数
              this.currentScore = res.data.viaRepScore
              this.currentRank = res.data.stuRank === '0' ? '-' : res.data.stuRank
              this.topScore = res.data.topScore
              this.isUpdateTitle = res.data.isUpdateTitle
              if (this.showMusic && !type) {
                let innerAudioContext = wx.createInnerAudioContext()
                innerAudioContext.autoplay = true
                innerAudioContext.src = '/static/success.mp3'
                innerAudioContext.onPlay(() => {
                  console.log('开始播放')
                })
              }
              /*
              if (this.titleUp === '6' && res.data.isUpdateTitle) {
                this._result('2')
              } else {
                this._result('1')
              }
              */
              // 状元前五升头衔效果提示
              if (res.data.isUpdateTitle) {
                if (this.titleUp === '6') {
                  this._result('2')
                } else {
                  this.hatType = `stu_${this.titleUp}`
                  this.hatsTextType = `stu_text_${this.titleUp}`
                  this._result('4')
                }
              } else {
                this._result('1')
              }
              // 状元前五升头衔效果提示
              /*
              if (res.data.isUpdateTitle) {
                if (this.titleUp !== '6') {
                  this.showHats = true
                  this.hatType = `stu_${this.titleUp}`
                  let text = ''
                  switch (this.titleUp) {
                    case '1':
                      text = '童生'
                      break
                    case '2':
                      text = '秀才'
                      break
                    case '3':
                      text = '举人'
                      break
                    case '4':
                      text = '贡士'
                      break
                    case '5':
                      text = '进士'
                      break
                  }
                  this.hatText = `恭喜你晋升到${text}！`
                  this.hidden = false
                  let _this = this
                  setTimeout(() => {
                    _this.hidden = true
                  }, 3000)
                  setTimeout(() => {
                    _this.showHats = false
                  }, 4000)
                }
              }
              */
            } else {
              this._result('3')
              if (this.showMusic && !type) {
                let innerAudioContext = wx.createInnerAudioContext()
                innerAudioContext.autoplay = true
                innerAudioContext.src = '/static/fail.mp3'
                innerAudioContext.onPlay(() => {
                  console.log('开始播放')
                })
              }
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
        this.onceSubmit = true
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
            this.titleUp = res.data.ckOjbMsg.titleup
            this.submitAnswer.perSequence = res.data.ckOjbMsg.perSequence
            this.submitAnswer.integral = res.data.ckOjbMsg.integral
            this.submitAnswer.graId = res.data.ckOjbMsg.gradeid
            this.submitAnswer.mySequence = res.data.ckOjbMsg.sequence
            // 当前题号
            this.currentNum = 1
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
        this.showLevel = true
        console.log(this.showLevel, 'this.showLevel')
        let _this = this
        this.cleanTime = setTimeout(function () {
          _this.showLevel = false
          // 初始化第一题
          _this.setCurrentSub(0)
        }, 2000)
      },
      // 设置当前题目
      setCurrentSub (i) {
        this.onceAnswer = true
        this.flag = true
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
        this.showGetGold = false
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
            if (_this.onceSubmit) {
              _this._submitAnswer()
            }
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
      iconButton,
      alertDialog,
      musicButton
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
    padding: 75rpx 60rpx 60rpx;
    font-size: 38rpx;
    word-wrap: break-word;
    display: block;
    word-break: break-all;
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
    top: 155rpx;
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
    top: 520rpx;
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
    top: 215rpx;
    left: 17%;
    /*transform: translate(-50%,-75%);*/
    width: 495rpx;
    height: 414rpx;
    opacity: 0;
  }
  /*头衔文字*/
  .alert-dialog .success .pg .hatText{
    position: absolute;
    z-index: 0;
    right: 35rpx;
    top: -160rpx;
    width: 419rpx;
    height: 165rpx;
  }
  /*头衔帽子*/
  .alert-dialog .success .pg .hat{
    position: absolute;
    z-index: 0;
    right: 56rpx;
    bottom: 0;
    margin-bottom:123rpx;
    transform:scale(1.1);
  }
  .pg .hat.stu_1{
    width: 360rpx;
    height: 232rpx;
  }
  .pg .hat.stu_2{
    width: 360rpx;
    height: 195rpx;
  }
  .pg .hat.stu_3{
    width: 360rpx;
    height: 186rpx;
    margin-top: 46rpx;
  }
  .pg .hat.stu_4{
    width: 360rpx;
    height: 190rpx;
  }
  .pg .hat.stu_5{
    width: 360rpx;
    height: 165rpx;
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
  /*金币排名*/
  .alert-dialog .success .get{
    position: absolute;
    z-index: 10;
    top: 692rpx;
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
  .alert-dialog .success .get.colorW p{
    color: #ffffff;
  }
  /*按钮*/
  .alert-dialog .success .btn{
    position: absolute;
    z-index: 20;
    top: 835rpx;
    left: 10%;
    display: flex;
    width: 615rpx;
    justify-content:center;
  }
  .alert-dialog .success .btn .share{
    /*margin-left: 70rpx;*/
  }
  /* 查看排行 */
  .alert-dialog .success .bottom{
    position: absolute;
    z-index: 20;
    top: 970rpx;
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
  .alert-dialog .bgColor{
    position: absolute;
    top: 450rpx;
    left: 150rpx;
    width: 420rpx;
    height: 230rpx;
    border-radius: 50%;
    background: #663399;
  }
  .alert-dialog .fire_gift{
    position: absolute;
    top: 120rpx;
    left: 20rpx;
    width: 676rpx;
    height: 464rpx;
  }
  .alert-dialog .no1{
    position: absolute;
    top: 144rpx;
    left: 175rpx;
    width: 345rpx;
    height: 442rpx;
    z-index: 11;
  }
  .alert-dialog .no1_text{
    position: absolute;
    top: 60rpx;
    left: 150rpx;
    width: 423rpx;
    height: 169rpx;
    z-index: 12;
  }
  .alert-dialog .bg{
    position: absolute;
    top: 100rpx;
    left: 10%;
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
  .diamon {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -20%;
    margin-left: -15%;
    width: 226rpx;
    height: 273rpx;
    transition: all 0.2s;
    opacity: 0;
    animation: big 1s linear;
  }
  @keyframes big {
    0% {
      transform: scale(0.1);
    }
    10% {
      opacity: 1;
      transform: scale(0.7);
    }
    100%{
      transform: scale(2);
      opacity: 0;
    }
  }
  .big2{
    animation: big2 1s linear 0s forwards;
  }
  @keyframes big2 {
    0% {
      transform: scale(1);
    }
    100%{
      transform: scale(2);
      opacity: 0;
    }
  }
  /*头衔*/
  .showHats {
    position: absolute;
    z-index: 9999;
    top: 298rpx;
    left: 76rpx;
    width: 600rpx;
    height: auto;
  }
  .showHats .hat{
    display: block;
    margin: 0 auto;
  }
  .showHats .hat.stu_1{
    width: 360rpx;
    height: 232rpx;
    margin-bottom: 0;
  }
  .showHats .hat.stu_2{
    width: 360rpx;
    height: 195rpx;
    margin-top: 37rpx;
  }
  .showHats .hat.stu_3{
    width: 360rpx;
    height: 186rpx;
    margin-top: 46rpx;
  }
  .showHats .hat.stu_4{
    width: 360rpx;
    height: 190rpx;
    margin-top: 42rpx;
  }
  .showHats .hat.stu_5{
    width: 360rpx;
    height: 165rpx;
    margin-top: 67rpx;
  }
  .showHats p.text{
    font-size: 32rpx;
    text-align: center;
    color: #450000;
    font-weight: 900;
    padding:20rpx 0 60rpx 0;
  }
  /*显示关卡*/
  .showLevel{
    position: absolute;
    left: 0;
    top: 50%;
    z-index: 999;
    width: 115%;
    height: 290rpx;
    margin-top: -145rpx;
    transform: translateX(-100%);
    animation: moveRight 3s linear forwards;
  }
  @keyframes moveRight {
    0% {
      transform: translateX(-100%);
    }
    20% {
      transform: translateX(0%);
    }
    80% {
      transform: translateX(0%);
    }
    100% {
      transform: translateX(-100%);
    }
  }
  .showLevel .level-con{
    position: relative;
    width: 100%;
    height: 100%;
    font-size: 0;
  }
  .showLevel .level-con .level-bg{
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }
  .showLevel .level-con .earth{
    position: absolute;
    bottom: 45rpx;
    left: 35%;
    z-index: 2;
    width: 150rpx;
    height: 200rpx;
    margin-left: -170rpx;
  }
  .showLevel .level-con .lines{
    position: absolute;
    left: 35%;
    bottom: 16rpx;
    z-index: 2;
    width: 430rpx;
    height: 90rpx;
    margin-left: -134rpx;
  }
  .showLevel .level-con p{
    position: absolute;
    left: 36%;
    bottom: 52rpx;
    z-index: 3;
    font-size: 80rpx;
    color: #ffffff;
  }
  .levelText {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -100%);
    font-size: 98rpx;
    z-index: 999;
    color: #ffcc66;
    font-weight: 700;
    text-shadow: 4rpx 4rpx 0px #fff;
    opacity: 1;
    animation: hide 2s linear forwards;
  }
  @keyframes hide {
    0% {
       opacity: 0;
     }
    30% {
      opacity: 1;
    }
    70% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }

  .deleteDiamond{
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -200rpx;
    margin-top:-150rpx;
    width: 400rpx;
    font-size: 0;
    animation: big 1.5s linear 0s forwards;
  }
  .big{
    animation: big 1s linear 0s forwards;
  }
  @keyframes big {
    0% {
      opacity: 0;
      transform: scale(1);
    }
    30% {
      transform: scale(1);
      opacity: 1;
    }
    100%{
      transform: scale(2);
      opacity: 0;
    }
  }
  .deleteDiamond img{
    display: block;
    margin: 0 auto;
    width: 180rpx;
    height: 170rpx;
  }
  .deleteDiamond p{
    width: 100%;
    text-align: center;
    font-size: 48rpx;
    color: #2384be;
    padding: 30rpx 0;
  }
</style>
