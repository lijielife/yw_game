<template>
  <div class="container">
    <div class="con">
      <!--<img :src="imagesSrc.bg" class="bg">-->
      <img src="/static/images/helper_bg.png" class="bg">
      <p>{{text}}</p>
    </div>
    <div style="position: relative;z-index: 99">
      <foot :imgUrl="imagesSrc.foot"></foot>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import foot from '@/components/foot'
  export default {
    data () {
      return {
        imagesSrc: {
//          bg: require('static/images/helper_bg.png'),
          foot: require('static/images/foot_img.png')
        },
        text: '添加说明...'
      }
    },
    components: {
      foot
    }
  }
</script>

<style scoped>
  .con{
    position: relative;
    z-index: 90;
    width: 622rpx;
    height: 1050rpx;
    box-sizing: border-box;
    padding: 120rpx 40rpx 0rpx;
    margin-top: 40rpx;
    font-size: 0;
  }
  .bg{
    position: absolute;
    width: 622rpx;
    height: 1050rpx;
    top: 0;
    left: 0;
  }
  .con p{
    position: relative;
    z-index: 12;
    font-size: 28rpx;
  }
</style>
