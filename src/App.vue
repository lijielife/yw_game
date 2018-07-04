<script>
export default {
  methods: {
  },
  onLaunch (res) {
    console.log(res)
    if (res.scene === '1007' || res.scene === '1008') { // 单人或群聊分享进入
      console.log(res.query, res.path)
    }
    // 背景音乐
    /* const backgroundAudioManager = wx.getBackgroundAudioManager()
    backgroundAudioManager.title = '此时此刻'
    backgroundAudioManager.epname = '此时此刻'
    backgroundAudioManager.singer = '许巍' */
    // backgroundAudioManager.src = 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E06DCBDC9AB7C49FD713D632D313AC4858BACB8DDD29067D3C601481D36E62053BF8DFEAF74C0A5CCFADD6471160CAF3E6A&fromtag=46' // 设置了 src 之后会自动播放
  },
  onLoad (res) {
    console.log('load', res)
  },
  onShow () {
    console.log('show')
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
