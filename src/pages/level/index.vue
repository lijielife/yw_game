<template>
  <div class="container">
    <div>
      <div class="top">
        <stu-card :imgUrl="imagesSrc.card">
          <div class="con">
            <div class="score">
              <div class="score_img" :style="{width: userType === '3' ? '90rpx' : '107rpx', height: userType === '3' ? '90rpx' : '107rpx'}">
                <img src="/static/images/score.png" alt="">
              </div>
              <span>{{score}}</span>
              <div class="score_img" style="width: 90rpx;height: 84rpx; margin-left: 40rpx;" v-if="userType === '3'">
                <img src="/static/images/gold.png" alt="">
              </div>
              <span v-if="userType === '3'">{{userDiamond}}</span>
            </div>
            <div class="info">
              <!--<span>第{{issue}}期</span>-->
              <span style="text-align: left; text-indent: 20rpx">{{sea}}</span>
              <!--<span>当前第{{currentNum}}关</span>-->
              <!--<span>总{{levelNum}}关</span>-->
              <span>当前闯过第{{currentNum}}/{{levelNum}}关</span>
            </div>
          </div>
        </stu-card>
      </div>
      <div class="level">
        <div class="level-con">
          <div class="flex-item" v-for="(i, index) in levelNum" :key="i">
            <div class="item" :class="{success: index < currentNum, now: index === currentNum}"
                 :style="{boxShadow: clickItem !== index ? '8rpx 8rpx 5rpx #999' : ''}"
                 @touchstart.prevent="_touchStart(index)"
                 @touchend.prevent="_touchEnd(index)"
                 @tap.prevent="_tap(index)">{{i + 1}}</div>
          </div>
        </div>
      </div>
    </div>
    <foot :imgUrl="imagesSrc.foot"></foot>
    <alert-dialog v-if="showGetGold" @closeAlert="_closeAlert" :getType="type"></alert-dialog>
    <!--扣减金币-->
    <div class="deleteDiamond" v-if="showDelete">
      <img src="/static/images/gold.png">
      <p class="text">-10钻石</p>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import foot from '@/components/foot'
  import alertDialog from '@/components/alert-dialog'
  import stuCard from '@/components/stu-card'
  import {getUserCheckPoints, checkYoukeGoldCoin, getSequence, getShareCoin} from '@/utils/api'
  export default {
    data () {
      return {
        imagesSrc: {
          card: require('static/images/card/s1.png'),
          foot: require('static/images/foot_img2.png')
        },
        clickItem: '',
        score: 0, // 总积分
        issue: 0, // 期数
        levelNum: 0, // 总关卡
        currentNum: 0, // 已通关卡
        gradId: '',
        showGetGold: false,
        type: 'goldNull',
        sea: '',
        userType: '',
        userDiamond: 0,
        showDelete: false
      }
    },
    // 分享
    onShareAppMessage () {
      wx.showShareMenu({
        withShareTicket: true
      })
      let _this = this
      return {
        title: '语文大闯关',
        path: `/pages/student/main?openid=${wx.getStorageSync('openid')}`,
        success: () => {
          let param = {
            shareOpenid: wx.getStorageSync('openid'),
            userOpenid: '',
            ckId: '0',
            isUpdateTitle: false
          }
          getShareCoin(param).then((res) => {
            if (res.data.msg !== '') {
              _this.type = 'getGold'
              _this.userDiamond += 20
            }
          })
        }
      }
    },
    methods: {
      _closeAlert () {
        this.showGetGold = false
      },
      _touchStart (n) {
        if (n <= this.currentNum) {
          this.clickItem = n
        }
      },
      _touchEnd (n) {
        if (n <= this.currentNum) {
          let _this = this
          setTimeout(() => {
            _this.clickItem = ''
          }, 300)
        }
      },
      _tap (n) {
        console.log('dlll')
        let param = `?id=${n + 1}&levelNum=${this.levelNum}&gradId=${this.gradId}`
        if (n <= this.currentNum) {
          if (this.userType === '3') {
            let data = {
              openid: wx.getStorageSync('openid')
            }
            // 游客登录需要金币是否足够
            checkYoukeGoldCoin(data).then((res) => {
              if (res.success) {
                let _this = this
                /*
                wx.showToast({
                  title: '-10钻石',
                  image: '/static/images/gold.png',
                  success () {
                    _this.userDiamond -= 10
                  }
                }) */
                this.showDelete = true
                this.userDiamond -= 10
                setTimeout(() => {
                  _this.goToPage('answer', param)
                  _this.showDelete = false
                }, 1500)
              } else {
                this.showGetGold = true
                this.type = 'goldNull'
              }
            })
          } else {
            this.goToPage('answer', param)
          }
        }
      },
      // 跳转页面
      goToPage (page, param) {
        let url = param ? `../${page}/main${param}` : `../${page}/main`
        wx.navigateTo({url: url})
      },
      getUserCheckPoints () {
        let data = {
          openid: wx.getStorageSync('openid'),
          graId: this.gradId,
          perSequence: wx.getStorageSync('userData').userObj.perSequence
        }
        this.score = 0
        getUserCheckPoints(data).then((res) => {
          this.currentNum = res.data.myCheckpoints.length
          this.score = res.data.xsStudents.integralCount
          this.userDiamond = res.data.xsStudents.goldCoin ? parseInt(res.data.xsStudents.goldCoin) : 0
          this.userType = res.data.xsStudents.usertype
          if (res.data.myCheckpoints.length) {
            res.data.myCheckpoints.forEach((item) => {
              if (item.topScore === '0') {
                this.currentNum--
              }
            })
          }
        })
      },
      // 根据年级获取关卡
      _getSequence () {
        wx.showLoading({
          title: '数据加载中...'
        })
        let param = {
          perSequence: this.issue,
          graId: this.gradId
        }
        this.levelNum = 0
        getSequence(param).then((res) => {
          console.log(res)
          wx.hideLoading()
          if (res.data !== '0') {
            this.levelNum = parseInt(res.data)
            this.getUserCheckPoints()
          } else {
            wx.showToast({
              title: '当前年级暂无关卡',
              icon: 'none'
            })
          }
        })
      }
    },
    onLoad (opt) {
      console.log(opt)
      this.issue = opt.perSequence
      this.gradId = opt.gradId
      this.sea = opt.sea
      console.log('djk11')
    },
    onShow () {
      console.log('djk')
      this._getSequence()
    },
    components: {
      foot,
      stuCard,
      alertDialog
    }
  }
</script>

<style scoped>
  .container {
    position: relative;
  }
  img{
    width: 100%;
    height: 100%;
  }
  .top{
    position: relative;
    width: 570rpx;
    height: 200rpx;
    margin-top: 35rpx;
  }
  .top .con{
    position: relative;
    width: 100%;
    height: 100%;
  }
  .top .con .score{
    text-align: center;
    padding-top: 20rpx;
  }
  .top .con .score .score_img{
    font-size: 0;
    display: inline-block;
    width: 107rpx;
    height: 107rpx;
  }
  .top .con .score span{
    display: inline-block;
    font-size: 60rpx;
    line-height: 107rpx;
    vertical-align: top;
    color: #ffffff;
    margin-left: 20rpx;
  }
  .top .con .info{
    width: 100%;
    display: flex;
    justify-content: center;
    line-height: 76rpx;
    font-size: 32rpx;
  }
  .top .con .info span{
    flex:1;
    text-align: center;
  }
  .level{
    width: 570rpx;
    margin-top: 30rpx;
    height:782rpx;
  }
  .level .level-con{
    display: flex;
    flex-wrap: wrap;
    width: 570rpx;
  }
  .level .flex-item{
    flex: 0 0 25%;
    text-align: center;
  }
  .level .flex-item .item{
    display: inline-block;
    vertical-align: top;
    text-align: center;
    width: 127rpx;
    height: 127rpx;
    color: #ffffff;
    border-radius: 8rpx;
    margin-bottom: 15rpx;
    line-height: 127rpx;
    font-size: 64rpx;
    font-weight: 700;
    background-color: #cccccc;
    transition: all 0.3s;
  }
  .level .flex-item .item.success{
    background-color: #ffcc66;
  }
  .level .flex-item .item.now{
    background-color: #ff8e35;
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
