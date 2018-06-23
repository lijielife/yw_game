<template>
  <div class="alert-dialog zoomInUp">
    <div class="alert-con">
      <img src="/static/images/visit/close.png" class="close" @tap.prevent="_close">
      <img src="/static/images/alert/gold.png" class="conImg" v-if="getType === 'getGold'">
      <img src="/static/images/alert/diamon_gold.png" class="conImg" v-if="getType === 'getScore' || getType === 'gold_diamon'">
      <img src="/static/images/alert/diamon_null.png" style="width: 519rpx" class="conImg" v-if="getType === 'goldNull'">
      <p class="text" v-if="getType === 'getGold'">已获得20金币！<br>可以继续闯关啦！</p>
      <p class="text" v-if="getType === 'getScore'">已获得20积分！<br>可以继续闯关啦！</p>
      <p class="text" v-if="getType === 'gold_diamon'">已获得20金币和20积分！<br>可以继续闯关啦！</p>
      <p class="text" v-if="getType === 'goldNull'">金币不够了！<br>请分享后继续获得金币吧！</p>
      <div class="btn" v-if="getType === 'goldNull'">
        <button open-type="share" plain="true" style="width: 100%;height: 100%;border: 0;text-align: left;padding: 0;">
          <img src="/static/images/rank/share_btn.png">
        </button>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      getType: '' // getGold, getScore, goldNull
    },
    methods: {
      _close () {
        this.$emit('closeAlert')
      }
    }
  }
</script>

<style scoped>
  /*弹窗*/
  .alert-dialog{
    position: absolute;
    z-index: 9999;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 600rpx;
    height: auto;
    border-radius: 16rpx;
    background-color: rgba(0,0,0,0.8);
  }
  .alert-dialog .alert-con {
    position: relative;
    width: 100%;
    font-size: 0;
    padding-top: 50rpx;
  }
  .alert-dialog .alert-con .close{
    position: absolute;
    top: 6rpx;
    right: 0;
    width: 30rpx;
    height: 30rpx;
    font-size: 0;
    padding: 18rpx;
  }
  .alert-dialog .alert-con .conImg{
    width: 361rpx;
    height: 431rpx;
    display: block;
    margin: 0 auto;
  }
  .alert-dialog .alert-con p.text{
    font-size: 32rpx;
    text-align: center;
    color: #ffffff;
    padding:20rpx 0 60rpx 0;
  }
  .alert-dialog .alert-con .btn{
    width: 143rpx;
    height: 63rpx;
    margin: 8rpx auto;
    font-size: 0;
    margin-top:-25rpx;
    margin-bottom:30rpx;
  }
  .alert-dialog .alert-con .btn img{
    width: 100%;
    height: 100%;
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

  @keyframes zoomInDown {
    from {
      opacity: 0;
      -webkit-transform: scale3d(0.1, 0.1, 0.1) translate3d(0, -1000px, 0);
      transform: scale3d(0.1, 0.1, 0.1) translate3d(0, -1000px, 0);
      -webkit-animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
      animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
    }

    60% {
      opacity: 1;
      -webkit-transform: scale3d(0.475, 0.475, 0.475) translate3d(0, 60px, 0);
      transform: scale3d(0.475, 0.475, 0.475) translate3d(0, 60px, 0);
      -webkit-animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);
      animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);
    }
  }

  .zoomInDown {
    animation: zoomInDown 0.5s linear;
  }
</style>
