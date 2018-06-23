<template>
  <div class="container">
    <div class="con">
      <!--<img :src="imagesSrc.bg" class="bg">-->
      <img src="/static/images/helper_bg.png" class="bg">
      <div class="content">
        <p>语文大闯关是卓越教育·卓越语文精心打造的一款语文学习小程序，是卓越语文课程全新配备的巩固知识的练习。</p>
        <p>这款产品以趣味的游戏形式，新锐的互联网技术，实现语文学习的便捷和高效。小程序和卓越语文课程搭配使用，会呈现出不一样的学习方式哦。</p>
        <p>小游戏用闯关的形式，考验、增加你”语文知识”的含量。在全世界都在学习中文学习中国文化的今天，你还不快来滋养一下吗？</p>
        <p>你可以小小了解一下这些规则：</p>
        <p>1.小游戏每周持续更新内容，一次更新3个关卡；</p>
        <p>2.每闯过一关，可获得相应积分；过关所花时间越短，所用挑战次数越少，获得的积分越高；</p>
        <p>3.已通过的关卡可以重玩，积分会继续叠加；</p>
        <p>4.分享小程序也可以获得积分；</p>
        <p>5.你可以在“排行榜”中查看积分排名情况；</p>
        <p>6.游客身份登录，开启关卡将消耗“钻石”，分享小程序可获得更多“钻石”；</p>
        <p>7.你可以在“我的错题集”中查看不小心答错的题目。</p>
        <p>好啦！请开始你的“语文大闯关”吧！祝你闯关成功～</p>
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
          foot: require('static/images/foot_img.png')
        }
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
    padding: 120rpx 40rpx 50rpx;
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
    text-indent: 35rpx;
  }
  .content{
    height: 100%;
    width: 100%;
    overflow-y: auto;
    box-sizing: border-box;

  }
</style>
