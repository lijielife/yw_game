<script>
  import {compareVersion} from '@/utils/index'
  export default {
    methods: {
    },
    onLaunch (res) {
      console.log(res)
      wx.getSystemInfo({
        success: (res) => {
          console.log('设备信息：', res)
          let flag = compareVersion(res.SDKVersion, '1.9.90')
          wx.setStorageSync('versionSure', flag)
          if (flag !== -1) {
            const updateManager = wx.getUpdateManager()
            updateManager.onCheckForUpdate(function (res) {
              // 请求完新版本信息的回调
              console.log(res, '版本')
            })
            updateManager.onUpdateReady(function () {
              wx.showModal({
                title: '更新提示',
                content: '新版本已经准备好，是否重启应用？',
                success: function (res) {
                  if (res.confirm) {
                    // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                    updateManager.applyUpdate()
                  }
                }
              })
            })
            updateManager.onUpdateFailed(function () {
              // 新的版本下载失败
              wx.showModal({
                title: '更新提示',
                content: '更新失败，请检查网络是否连接？',
                success: function (res) {
                  if (res.confirm) {
                  }
                }
              })
            })
          } else {
            wx.showModal({
              title: '微信版本检测',
              content: '您的微信版本较低，为保证较好的游戏体验，建议先升级您的微信！',
              success: function (res) {
              }
            })
          }
        }
      })
    },
    onLoad (res) {
      console.log('load', res)
    },
    onShow () {
      wx.setStorageSync('onceSend', true)
      console.log('show')
    },
    created () {
    }
  }
</script>

<style>
page{
  width: 100%;
  height: 100%;

}
.container {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  background: url("../static/images/bg_grid.png") repeat;
  background-size: 24rpx 26rpx;
}
.flexColum{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}
/* this rule will be remove */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}
</style>
