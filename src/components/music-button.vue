<template>
  <div class="music-button" :class="musicStatus" :style="{top: t, right: r}">
    <icon-button :imgUrl="musicSrc" @tapEvent="_toggle"></icon-button>
  </div>
</template>

<script type="text/ecmascript-6">
  import iconButton from '@/components/icon-button'
  export default {
    props: {
      t: '',
      r: ''
    },
    data () {
      return {
        musicStatus: 'run' // run or stop
      }
    },
    computed: {
      // 切换音乐按钮
      musicSrc: function () {
        return require(`static/images/music_${this.musicStatus}.png`)
      }
    },
    created () {
      console.log(wx.getBackgroundAudioManager().paused)
      this.musicStatus = wx.getBackgroundAudioManager().paused ? 'stop' : 'run'
    },
    methods: {
      // 音乐开关
      _toggle () {
        let bgMusic = wx.getBackgroundAudioManager()
        console.log(bgMusic)
        this.musicStatus = !bgMusic.paused ? 'stop' : 'run'
        if (bgMusic.paused) {
          wx.playBackgroundAudio()
        } else {
          wx.pauseBackgroundAudio()
        }
      }
    },
    components: {
      iconButton
    }
  }
</script>

<style scoped>
  .music-button{
    position: absolute;
    top: 20rpx;
    right: 56rpx;
    z-index: 999;
    /*transition: all 0.3s*/
  }
  .music-button.stop{
    width: 70rpx;
    height: 73rpx;
  }
  .music-button.run{
    width: 70rpx;
    height: 67rpx;
    transform-origin: center center;
    animation: rotateX 3s linear infinite;
  }
  @keyframes rotateX {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
