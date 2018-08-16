<template>
  <div class="getUser">
    <div class="wxLogin">
      <div class="btn">
        <div class="avatar">
          <open-data type="userAvatarUrl" ></open-data>
        </div>
        <div class="name">
          <open-data type="userNickName"></open-data>
        </div>
        <button v-if="canIUse" open-type="getUserInfo" @getuserinfo="bindGetUserInfo">同意授权登录</button>
        <p v-else style="font-size: 28rpx;">当前微信版本过低，请升级微信</p>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {checkUser, wxMsg} from '@/utils/api'
  export default {
    computed: {
      canIUse: function () {
        return wx.canIUse('button.open-type.getUserInfo')
      }
    },
    methods: {
      bindGetUserInfo (e) {
        console.log(e)
        wx.login({
          success: (res) => {
            let param = {
              js_code: res.code
            }
            // 获取用户微信openid
            wxMsg(param).then((res) => {
              wx.setStorageSync('openid', res.data.openid)
              wx.getUserInfo({
                success: function (res1) {
                  wx.setStorageSync('userInfo', res1.userInfo)
                }
              })
              // 验证用户是否已注册过
              checkUser({openid: res.data.openid}).then((res2) => {
                if (res2.success) { // 旧用户
                  // 进入主页
                  wx.setStorageSync('userType', res2.data.usertype)
                  this.$emit('hideWxLogin')
                } else { // 新用户
                  // 进入登录注册
                  this.$emit('goToIndex')
                  // goToPage('index')
                }
              })
            })
          }
        })
      }
    }
  }
</script>

<style scoped>
  .getUser{
    position: absolute;
    top: 0;
    left: 0;
    z-index: 999;
    width: 100%;
    height: 100%;
    background: #ffffff;
  }
  .wxLogin{
    width: 60%;
    height: 100%;
    display: table;
    margin: 0 auto;
  }
  .btn{
    display: table-cell;
    vertical-align: middle;
  }
  .avatar{
    width: 200rpx;
    height: 200rpx;
    margin:0 auto;
    border-radius: 50%;
    border: 8rpx solid #cccccc;
    overflow: hidden;
  }
  .name{
    width: 100%;
    text-align: center;
    font-size: 32rpx;
    margin:10rpx 0 50rpx;
  }
</style>
