<template>
  <div class="container">
    <div class="top">
      <stu-card :imgUrl="imagesSrc.card">
        <div class="con">
          <div class="score">
            <div class="score_img">
              <img src="/static/images/score.png" alt="">
            </div>
            <span>{{score}}</span>
          </div>
          <div class="info">
            <span>第{{issue}}期</span>
            <span>当前第{{currentNum}}关</span>
            <span>总{{levelNum}}关</span>
          </div>
        </div>
      </stu-card>
    </div>
    <div class="level">
      <div class="level-con">
        <div class="flex-item" v-for="(i, index) in levelNum" :key="i">
          <div class="item" :class="{success: index < currentNum, now: index === currentNum}"
               :style="{boxShadow: clickItem !== index ? '10rpx 10rpx 5rpx #cccccc' : ''}"
               @touchstart.prevent="_touchStart(index)"
               @touchend.prevent="_touchEnd(index)"
               @tap.prevent="_tap(index)">{{i + 1}}</div>
        </div>
      </div>
    </div>
    <foot :imgUrl="imagesSrc.foot"></foot>
  </div>
</template>

<script type="text/ecmascript-6">
  import foot from '@/components/foot'
  import stuCard from '@/components/stu-card'
  import {getUserCheckPoints, checkYoukeGoldCoin, getSequence} from '@/utils/api'
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
        gradId: ''
      }
    },
    methods: {
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
        let param = `?id=${n + 1}&levelNum=${this.levelNum}&gradId=${this.gradId}`
        if (n <= this.currentNum) {
          if (wx.getStorageSync('userData').weixinObj.usertype === '3') {
            let data = {
              openid: wx.getStorageSync('openid')
            }
            // 游客登录需要金币是否足够
            checkYoukeGoldCoin(data).then((res) => {
              if (res.success) {
                let _this = this
                wx.showToast({
                  title: '-10金币',
                  icon: 'none',
                  success: (res) => {
                    console.log(res)
                    setTimeout(() => {
                      _this.goToPage('answer', param)
                    }, 1000)
                  }
                })
              } else {
                wx.showToast({
                  title: res.desc,
                  icon: 'none'
                })
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
    },
    onShow () {
      this._getSequence()
      /* if (wx.getStorageSync('userData').weixinObj.usertype === '1') {
        this.currentNum = this.levelNum
      } else {
        this.getUserCheckPoints()
      } */
    },
    components: {
      foot,
      stuCard
    }
  }
</script>

<style scoped>
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
    /*justify-content: center;*/
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
    margin-bottom: 13rpx;
    line-height: 127rpx;
    font-size: 64rpx;
    font-weight: 700;
    background-color: #cccccc;
    /*box-shadow: 6rpx 6rpx 5rpx #979797;*/
    transition: all 0.3s;
  }
  .level .flex-item .item.success{
    background-color: #ffcc66;
    /*box-shadow: 6rpx 6rpx 5rpx #cccccc;*/
  }
  .level .flex-item .item.now{
    background-color: #ff8e35;
  }
</style>
