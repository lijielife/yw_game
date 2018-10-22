<template>
  <div class="container">
    <div class="con">
      <!--<img :src="imagesSrc.bg" class="bg">-->
      <img src="/static/images/helper_bg.png" class="bg">
      <div class="content">
        <p>该小程序采用闯关的形式，考察你的语文知识。让你在学中玩，玩中学。</p>
        <p>规则如下：</p>
        <p>1.每周持续更新关卡，一次更新3关；</p>
        <p>2.每闯一关，可获得相应的金币。花费时间越少，答错次数越少，所得金币越多；</p>
        <p>3.已过关卡可重复挑战，金币也会叠加；</p>
        <p>4.游客分享小程序可获得60颗钻石和金币奖励，每闯一关，将消耗10颗钻石；</p>
        <p>5.卓越在读学生分享小程序，可获得金币奖励。</p>
      </div>
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
          foot: require('static/images/foot_img3.png')
        }
      }
    },
    methods: {
      _tabQr () {
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
    height: 1005rpx;
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
    font-size: 32rpx;
    text-indent: 35rpx;
  }
  .content{
    height: 100%;
    width: 100%;
    overflow-y: auto;
    box-sizing: border-box;
  }
</style>
