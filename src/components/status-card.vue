<template>
  <div class="s-card">
    <div class="img-icon" v-if="imgUrl !== ''">
      <img :src="imgUrl" alt="">
    </div>
    <p>{{text}}</p>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    text: '',
    imgUrl: ''
  }
}
</script>

<style scoped>
  .s-card{
    position: relative;
    /*width: 200rpx;*/
    height: 45rpx;
    border-radius: 10rpx;
    line-height: 45rpx;
    background-color: #fba900;
    color: #ffffff;
    margin-top: 12rpx;
    text-align: right;
    font-size: 0;
    padding: 0 20rpx;
  }
  .s-card p{
    font-size: 28rpx;
  }
  .s-card .img-icon{
    position: absolute;
    top: 0;
    left: 10rpx;
    margin-top: 7rpx;
    width: 30rpx;
    height: 30rpx;
    font-size: 0;
  }
  .s-card .img-icon img{
    width: 100%;
    height: 100%;
  }
</style>
