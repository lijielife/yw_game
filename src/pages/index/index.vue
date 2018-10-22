<template>
  <div class="container">
    <div class="userinfo" v-if="!switchType">
      <open-data type="userAvatarUrl"></open-data>
    </div>
    <!--登录框-->
    <div class="userLogin" v-if="!switchType">
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
              <span v-if="!start">获取验证码</span>
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
      <div class="item" v-if="!hideType">
        <a class="go" @click="_submit(3)">我未报读秋季课程</a>
        <a class="go" @click="loginType = 1" v-if="loginType !== 1">老师登录</a>
        <a class="go" @click="loginType = 2" v-if="loginType !== 2">学生登录</a>
      </div>
    </div>
    <div class="switchUser" v-if="switchType">
      <div class="panel-tip">
        <div class="img-con">
          <img src="/static/images/card/s1.png" alt="">
          <p>轻点姓名以切换账号</p>
        </div>
        <img src="/static/images/pen.png" class="pen" alt="">
        <img src="/static/images/pen.png" class="pen pen_r" alt="">
      </div>
      <ul class="wxUser">
        <li class="user-item" v-for="user in userCount" :key="user.loginid" :class="{'present': user.loginid === loginid}" @click="_changeUser(user)">
          <div class="item">
            <div class="user-con"><span>{{user.username}}</span></div>
            <p v-if="user.loginid === loginid"><i class="dot"></i>当前使用</p>
          </div>
        </li>
        <li class="user-item addUser" @click="_hideType">
          <div class="item">
            <div class="user-con"><span>+</span></div>
          </div>
        </li>
      </ul>
    </div>
    <!--底部-->
    <foot :imgUrl="imagesUrl.foot"></foot>
  </div>
</template>

<script>
import iconButton from '@/components/icon-button'
import foot from '@/components/foot'
import {getCode, stuLogin, visitLogin, teaLogin, getShareCoin, getCurrentWxUsers, signOutAndLogin} from '@/utils/api'

export default {
  data () {
    return {
      imagesUrl: {
        login: require('static/images/login.png'),
        btn: require('static/images/btn_bg.png'),
        foot: require('static/images/foot_img3.png')
      },
      userInfo: {},
      avatarUrl: require('static/images/avatar_img.png'),
      musicStatus: 'run', // run or stop
      codeText: '验证码',
      start: false,
      time: 60,
      interVal: null,
      loginType: 2, // 登录类型： 2：学生登录， 1：老师登录
      selGrad: 0, // 选择年级
      userName: '', // 真实姓名 --- 学生
      phoneNumber: '', // 手机号码 --- 学生
      code: '', // 验证码 ---- 学生
      cardNumber: '', // 通行证账号-----教师
      password: '', // 通行证密码 ----- 教师
      shakeN: 0,
      showMusicButton: false,
      hasLogin: false, // 主动从入口进来的
      switchType: false,
      hideType: false,
      userCount: [],
      loginid: ''
    }
  },
  computed: {
  },
  components: {
    iconButton,
    foot
  },
  onShow () {
    this._getCurrentWxUsers()
    this.loginid = wx.getStorageSync('userInfo2').loginid || ''
  },
  onLoad (opt) {
    if (opt.userType) {
      this.loginType = parseInt(opt.userType)
      this.hasLogin = true
    }
    if (opt.switchType) {
      this.switchType = opt.switchType
    } else {
      this.switchType = false
    }
  },
  methods: {
    // 隐藏游客和老师切换
    _hideType () {
      this.hideType = true
      this.switchType = false
    },
    // 图标晃动
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
      let param = {
        phoneNumber: this.phoneNumber
      }
      getCode(param).then((res) => {
        if (res.success) {
          this.start = true
          this._countDown()
        }
        wx.showToast({
          title: res.desc,
          icon: 'none'
        })
      })
    },
    // 登录
    _submit (type) {
      let userInfo = wx.getStorageSync('userInfo')
      let openid = wx.getStorageSync('openid')
      let newWxMsgJson = Object.assign({}, {openid: openid}, userInfo)
      let param = {}
      let fn = null
      // console.log('shareOpenid:', wx.getStorageSync('shareOpenid') || 'meiyou')
      switch (type) {
        case 1: // 教师登录
          param = {
            username: this.cardNumber,
            password: this.password,
            wxMsgJson: JSON.stringify(newWxMsgJson)
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
            shareOpenid: wx.getStorageSync('shareOpenid') || '',
            phoneNumber: this.phoneNumber,
            code: this.code,
            username: this.userName,
            wxMsgJson: JSON.stringify(newWxMsgJson)
          }
          fn = stuLogin
          break
        case 3: // 游客登录
          param = {
            shareOpenid: wx.getStorageSync('shareOpenid') || '',
            wxMsgJson: JSON.stringify(newWxMsgJson)
          }
          if (this.hasLogin) {
            wx.navigateBack()
            this.hasLogin = false
            return
          }
          fn = visitLogin
          break
      }
      fn(param).then((res) => {
        if (res.success) {
          // 分享者获得分享金币或钻石
          if (wx.getStorageSync('shareOpenid')) {
            let param = {
              shareOpenid: wx.getStorageSync('shareOpenid') || '',
              userOpenid: wx.getStorageSync('openid'),
              ckId: '0',
              isUpdateTitle: false,
              userType: type,
              loginid: res.data.loginid || ''
            }
            getShareCoin(param).then((res1) => {
              if (res1.success) {
                wx.removeStorageSync('shareOpenid')
              }
            })
          }
          console.log('userLogin', res)
          wx.setStorageSync('userInfo2', res.data)

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
    _getCurrentWxUsers () {
      let param = {
        openid: wx.getStorageSync('openid')
      }
      wx.showLoading({
        title: '数据加载中...'
      })
      getCurrentWxUsers(param).then((res) => {
        wx.hideLoading()
        this.userCount = res.data
      })
    },
    // 切换账号
    _changeUser (user) {
      console.log(user)
      let userInfo = wx.getStorageSync('userInfo')
      let param = {
        openid: user.openid,
        loginid: user.loginid,
        userType: user.usertype,
        wxMsgJson: JSON.stringify(userInfo)
      }
      signOutAndLogin(param).then((res) => {
        if (res.success) {
          this.goToPage('student')
        } else {
          wx.showToast({
            title: res.desc,
            icon: 'none'
          })
        }
      })
    },
    // 页面跳转
    goToPage (page, param) {
      let url = param ? `../${page}/main${param}` : `../${page}/main`
      wx.reLaunch({url: url})
    }
  }
}
</script>

<style scoped>
.container{
  overflow: hidden;
}
.switchUser{
  display: flex;
  flex-direction: column;
  align-items: center;
}
.switchUser .panel-tip{
  position: relative;
  margin-top: 100rpx;
}
.switchUser .panel-tip .pen{
  position: absolute;
  left: 25rpx;
  top: 56rpx;
  width: 80rpx;
  height: 75rpx;
}
.switchUser .panel-tip .pen.pen_r{
  left:468rpx;
  transform-origin:50% 50%;
  transform:rotate(-270deg);
}
.switchUser .panel-tip .img-con{
  position: relative;
  width: 572rpx;
  height: 200rpx;
  text-align: center;
  line-height: 200rpx;
}
.switchUser .panel-tip .img-con img{
  width: 100%;
  height: 100%
}
.switchUser .panel-tip .img-con p{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  font-size: 36rpx;
  color: #ffffff;
}
.switchUser .wxUser{
  display: flex;
  flex-wrap: wrap;
  margin-top: 100rpx;
  width: 572rpx;
}
.switchUser .wxUser .user-item{
  flex: 0 0 33%;
  text-align:center;
  margin-bottom: 40rpx;
}
.switchUser .wxUser .user-item .item{
  display: inline-block;
  text-align: center;
}
.switchUser .wxUser .user-item .user-con{
  width: 130rpx;
  height: 130rpx;
  font-size: 32rpx;
  color: #660000;
  border: 14rpx solid #ffcc66;
  background: #ffffff;
  border-radius: 20rpx;
  display:flex;
  flex-direction:colum;
  align-items:center;
  justify-content:center;
}
.switchUser .wxUser .user-item.present .user-con{
  color: #6f8b00;
  border: 14rpx solid #b0cd4d;
}
.switchUser .wxUser .user-item.addUser .user-con{
  font-size: 72rpx;
  color: #a37a28;
}
.switchUser .wxUser .user-item.addUser .user-con span{
  padding-bottom: 10px;
}
.switchUser .wxUser .user-item p{
  font-size: 28rpx;
  line-height:2;
}
.switchUser .wxUser .user-item p i{
  display: inline-block;
  width: 16rpx;
  height: 16rpx;
  background: #b0cd4d;
  border-radius: 50%;
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
  height: 84rpx;
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
  height: 70rpx;
  line-height: 70rpx;
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
