<template>
  <div class="container">
    <!--音频按钮-->
    <!-- <div class="music" :class="musicStatus">
      <icon-button :imgUrl="musicSrc" @tapEvent="_toggle"></icon-button>
    </div> -->
    <music-button v-if="showMusicButton"></music-button>
    <!--用户头像-->
    <div class="userinfo">
      <open-data type="userAvatarUrl"></open-data>
    </div>
    <!--登录框-->
    <div class="userLogin">
      <div class="item" v-if="loginType !== 1">
        <div class="phone input"  @click="_shake(1)">
          <label for="phone"  :class="{shake: shakeN === 1}">
            <img src="/static/images/phone.png">
          </label>
          <input type="number" id="phone" v-model="phoneNumber" placeholder="输入你在卓越报名的手机号码" placeholder-style="color:#e2edbe" cursor-spacing='20' confirm-type="next">
        </div>
      </div>
      <div class="item" v-if="loginType !== 1">
        <div class="code input"  @click="_shake(2)">
          <label for="code" :class="{shake: shakeN === 2}">
            <img src="/static/images/code.png">
          </label>
          <input type="number" id="code" v-model="code" placeholder="输入验证码" placeholder-style="color:#e2edbe" cursor-spacing='20' confirm-type="next">
        </div>
        <div class="code_btn">
          <div class="code_bg">
            <icon-button :imgUrl="imagesUrl.btn" @tapEvent="_getCode">
              <span v-if="!start">验证码</span>
            </icon-button>
            <span class="getCode" v-if="start">等待{{time}}s</span>
          </div>
        </div>
      </div>
      <div class="item" v-if="loginType !== 1">
        <div class="name input"  @click="_shake(3)">
          <label for="name" :class="{shake: shakeN === 3}">
            <img src="/static/images/name.png">
          </label>
          <input type="text" id="name" v-model="userName" placeholder="输入你的真实姓名" placeholder-style="color:#e2edbe" cursor-spacing='20'>
        </div>
      </div>
      <div class="item" v-if="loginType !== 2">
        <div class="phone input"  @click="_shake(4)">
          <label for="card" :class="{shake: shakeN === 4}">
            <img src="/static/images/phone.png">
          </label>
          <input type="text" id="card"  v-model="cardNumber" placeholder="输入通行证账号" placeholder-style="color:#e2edbe" cursor-spacing='20' confirm-type="next">
        </div>
      </div>
      <div class="item" v-if="loginType !== 2">
        <div class="code input" @click="_shake(5)">
          <label for="password" :class="{shake: shakeN === 5}">
            <img src="/static/images/code.png">
          </label>
          <input type="text" id="password"  v-model="password" placeholder="输入密码" placeholder-style="color:#e2edbe" cursor-spacing='20' password="true">
        </div>
      </div>
      <div class="item submit">
        <icon-button :imgUrl="imagesUrl.login" @tapEvent="_submit(1)"  v-if="loginType !== 2"></icon-button>
        <icon-button :imgUrl="imagesUrl.login" @tapEvent="_submit(2)" v-if="loginType !== 1"></icon-button>
      </div>
      <div class="item">
        <a class="go" @click="_submit(3)">我不是卓越学生</a>
        <a class="go" @click="loginType = 1" v-if="loginType !== 1">老师登录</a>
        <a class="go" @click="loginType = 2" v-if="loginType !== 2">学生登录</a>
      </div>
    </div>
    <!--底部-->
    <foot :imgUrl="imagesUrl.foot"></foot>
  </div>
</template>

<script>
import iconButton from '@/components/icon-button'
import musicButton from '@/components/music-button'
import foot from '@/components/foot'
import {getCode, stuLogin, visitLogin, teaLogin, getShareCoin} from '@/utils/api'

export default {
  data () {
    return {
      imagesUrl: {
        login: require('static/images/login.png'),
        btn: require('static/images/btn_bg.png'),
        foot: require('static/images/foot_img.png')
      },
      motto: 'Hello World',
      userInfo: {},
      avatarUrl: require('static/images/avatar_img.png'),
      musicStatus: 'run', // run or stop
      codeText: '验证码',
      start: false,
      time: 60,
      interVal: null,
      loginType: 2, // 登录类型： 2：学生登录， 1：老师登录
      selGrad: 0, // 选择年级
      // todo: 表单信息
      userName: '', // 真实姓名 --- 学生
      phoneNumber: '', // 手机号码 --- 学生
      code: '', // 验证码 ---- 学生
      cardNumber: '', // 通行证账号-----教师
      password: '', // 通行证密码 ----- 教师
      shakeN: 0,
      showMusicButton: false
    }
  },
  computed: {
    // 切换音乐按钮
    musicSrc: function () {
      return require(`static/images/music_${this.musicStatus}.png`)
    }
  },
  components: {
    iconButton,
    foot,
    musicButton
  },
  onShow () {
  },
  onLoad (opt) {
    if (opt.userType) {
      this.loginType = parseInt(opt.userType)
    }
  },
  methods: {
    _shake (n) {
      this.shakeN = n
      let _this = this
      setTimeout(() => {
        _this.shakeN = 0
      }, 10000)
    },
    // 初始化调用图片
    _initSrc (arr) {
      let urls = []
      for (let i = 0; i < arr.length; i++) {
        urls.push({
          grad: arr[i],
          gradImg: require(`static/images/visit/${arr[i]}.png`),
          gradSel: require(`static/images/visit/${arr[i]}_sel.png`)
        })
      }
      return urls
    },
    // 倒计时
    _countDown () {
      this.interval = null
      let _this = this
      this.time = 60
      this.interval = setInterval(() => {
        if (_this.time > 0) {
          _this.time--
        } else {
          clearInterval(_this.interval)
          this.start = false
        }
      }, 1000)
    },
    // 获取手机验证码
    _getCode () {
      if (this.phoneNumber.length !== 11) {
        wx.showToast({
          title: '亲，请输入正确的电话号码',
          icon: 'none'
        })
        return
      }
      this.start = true
      this._countDown()
      let param = {
        phoneNumber: this.phoneNumber
      }
      getCode(param).then((res) => {
        wx.showToast({
          title: res.desc,
          icon: 'none'
        })
      })
    },
    // 登录
    _submit (type) {
      // this.loginType = type
      let userInfo = wx.getStorageSync('userInfo')
      let openid = wx.getStorageSync('openid')
      let wxMsgJson = {
        openid: openid,
        nickname: userInfo.nickName,
        avatarUrl: userInfo.avatarUrl
      }
      let param = {}
      let fn = null
      switch (type) {
        case 1: // 教师登录
          param = {
            username: this.cardNumber,
            password: this.password,
            wxMsgJson: JSON.stringify(wxMsgJson)
          }
          fn = teaLogin
          break
        case 2: // 学生登录
          if (!this.userName) {
            wx.showToast({
              title: '亲，请输入您的真实姓名',
              icon: 'none'
            })
            return
          }
          param = {
            phoneNumber: this.phoneNumber,
            code: this.code,
            username: this.userName,
            wxMsgJson: JSON.stringify(wxMsgJson)
          }
          fn = stuLogin
          break
        case 3: // 游客登录
          param = {
            wxMsgJson: JSON.stringify(wxMsgJson)
          }
          fn = visitLogin
          break
      }
      console.log(param)
      fn(param).then((res) => {
        if (res.success) {
          // 分享者获得分享积分或金币
          if (wx.getStorageSync('shareOpenid')) {
            let param = {
              shareOpenid: wx.getStorageSync('shareOpenid'),
              userOpenid: wx.getStorageSync('openid'),
              ckId: '0',
              isUpdateTitle: false
            }
            getShareCoin(param).then((res) => {
              if (res.success) {
                wx.removeStorageSync('shareOpenid')
              }
            })
          }
          // 缓存用户类型
          wx.setStorageSync('userType', `${type}`)
          let param = `?flag=true`
          this.goToPage('student', param)
          // wx.navigateTo({url: '../student/main'})
        } else {
          wx.showToast({
            title: res.desc,
            icon: 'none'
          })
          /* if (res.data === '1') { // 用户已注册
            this.goToPage('student')
            // wx.navigateTo({url: '../student/main'})
          } */
        }
      })
    },
    // 音乐开关
    _toggle () {
      let bgMusic = wx.getBackgroundAudioManager()
      console.log(bgMusic)
      this.musicStatus = this.musicStatus === 'run' ? 'stop' : 'run'
      if (bgMusic.paused) {
        wx.playBackgroundAudio()
      } else {
        wx.pauseBackgroundAudio()
      }
    },
    // 页面跳转
    goToPage (page, param) {
      let url = param ? `../${page}/main${param}` : `../${page}/main`
      wx.navigateTo({url: url})
    }
  }
}
</script>

<style scoped>
.container{
  overflow: hidden;
}
.visitor{
  position: absolute;
  z-index: 100;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 672rpx;
  height: 734rpx;
  border-radius: 16rpx;
  background-color: rgba(0,0,0,0.8);
}
.visitor .flexColum{
  position: relative;
  width: 100%;
  height: 100%;
}
.visitor img{
  width: 100%;
  height: 100%;
}
.visitor .flexColum .close{
  position: absolute;
  top: 6rpx;
  right: 0;
  width: 30rpx;
  height: 30rpx;
  font-size: 0;
  padding: 18rpx;
}
.visitor .title{
  padding-top: 36rpx;
  width: 480rpx;
  height: 84rpx;
  font-size: 0;
}
.visitor .content{
  width: 100%;
  box-sizing: border-box;
  padding: 0 34rpx;
}
.visitor .content h1{
  width: 100%;
  text-align: left;
  width: 83rpx;
  height: 35rpx;
  font-size: 0;
  padding:10rpx 0 5rpx 20rpx;
}
.visitor .content .con{
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}
.visitor .content .img{
  flex: 0 0 172rpx;
  font-size: 0;
  width: 172rpx;
  height: 62rpx;
  padding: 15rpx 12rpx;
}
.visitor .bottom{
  padding: 40rpx 0 58rpx 0;
}
.visitor .bottom .tip{
  width: 344rpx;
  height: 25rpx;
  font-size: 0;
  margin:0 auto;
  padding: 10rpx 0;
}
.visitor .bottom .btn .sure, .visitor .bottom .btn .cancel{
  float: left;
  width: 177rpx;
  height: 78rpx;
  padding: 0 36rpx;
}

.music{
  position: absolute;
  top: 20rpx;
  right: 56rpx;
  /*transition: all 0.3s*/
}
.music.stop{
  width: 70rpx;
  height: 73rpx;
}
.music.run{
  width: 70rpx;
  height: 67rpx;
}

.userinfo {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 104rpx;
  width: 200rpx;
  height: 200rpx;
  border:24rpx solid #ffcc66;
  border-radius: 24rpx;
  box-shadow: 15rpx 15rpx 10rpx #ccc;
  font-size: 0;
}
.userinfo-avatar {
  width: 100%;
  height: 100%;
}

.userLogin{
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 600rpx;
  margin-bottom: 60rpx;
}
.userLogin .item{
  display: flex;
  flex: 1;
  width: 100%;
}
.userLogin .item .input{
  position: relative;
  flex: 1;
  background-color: #b0cd4d;
  margin-top: 50rpx;
  box-shadow: 8rpx 8rpx 5rpx #ccc;
  border-radius: 8rpx;
}
.userLogin .item .code_btn {
  flex:0 0 238rpx;
  position: relative;
}
.userLogin .item .code_btn .code_bg{
  position: absolute;
  right: -18rpx;
  bottom: -12rpx;
  width: 215rpx;
  height: 74rpx;
  line-height: 74rpx;
  color: #ffffff;
}
.userLogin .item .code_btn .code_bg .getCode{
  position: absolute;
  right: 0;
  bottom: 0;
  width: 215rpx;
  height: 74rpx;
  line-height: 74rpx;
  font-size: 28rpx;
  text-align: center;
  z-index: 2;
}
.userLogin .item .input label{
  position: absolute;
  bottom: 6rpx;
 }
.userLogin .item .phone label{
  left: 35rpx;
  width: 44rpx;
  height: 77rpx;
}
.userLogin .item .code label{
  left: 23rpx;
  width: 68rpx;
  height: 68rpx;
}
.userLogin .item .name label{
  left: 28rpx;
  width: 75rpx;
  height: 53rpx;
}
.userLogin .item .input label img{
  width: 100%;
  height: 100%;
}
.userLogin .item .input input{
  position: relative;
  width: 100%;
  box-sizing: border-box;
  padding-left: 122rpx;
  font-size: 28rpx;
  color: #ffffff;
  height: 60rpx;
  line-height: 60rpx;
}
.userLogin .submit{
  margin-top: 50rpx;
  width: 288rpx;
  height: 128rpx;
}
.userLogin .item .go{
  margin-top: 35rpx;
  flex: 1;
  text-align: center;
}
.shake{
  transform-origin: center bottom;
  transform: rotate(20deg);
  animation: shake 0.1s linear 0s 5 alternate;
}
  @keyframes shake {
    0% {
      transform: rotate(0deg)
    }
    25% {
      transform: rotate(-10deg)
    }
    50% {
      transform: rotate(10deg)
    }
    75% {
      transform: rotate(0deg)
    }
    100% {
      transform: rotate(-10deg)
    }
  }
</style>
