<script>
export default {
  methods: {
  },
  onLaunch (res) {
    console.log(res)
    if (res.scene === '1007' || res.scene === '1008') { // 单人或群聊分享进入
      console.log(res.query, res.path)
    }
    console.log('launch')
  },
  onLoad (res) {
    console.log('load', res)
  },
  onShow () {
    console.log('show')
  },
  created () {
    // 调用API从本地缓存中获取数据
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    console.log('app created and cache logs by setStorageSync')
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
