<template>
  <div class="container">
    <div class="content">
      <div class="top">
        <div class="periods">{{sea}}</div>
        <div class="wrong-num">
          <!--<img :src="imagesSrc.pen" alt="" class="pen" style="">-->
          <img src="/static/images/pen.png" alt="" class="pen" style="">
          <p>错题 <span style="color: #ff9a00;">{{wrongSub.length}}</span> 道</p>
          <!--<img :src="imagesSrc.pen" alt="" class="pen pen_r" style="">-->
          <img src="/static/images/pen.png" alt="" class="pen pen_r" style="">
        </div>
        <p class="tip">答对后，题目才会显示正确答案</p>
      </div>
      <div class="con" v-if="wrongSub.length">
        <div class="item" :class="{fadeInLeft: itemIndex%2 === 0, fadeInRight: itemIndex%2 !== 0}" v-for="(item, itemIndex) in wrongSub" :key="itemIndex">
          <!--<img :src="imagesSrc.wrong_bg"  class="wrong_bg">-->
          <img src="/static/images/wrong_bg.png"  class="wrong_bg">
          <div class="item-con">
            <div class="title">
              {{itemIndex + 1}}.{{item.content}}
            </div>
            <div class="answer">
              <p :class="{wrong: item.userAnswer === k.no && item.rightAnswer === k.no}" v-for="(k, kIndex) in item.answer" :key="k.no"><span>{{k.no}}.</span>{{k.con}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getMyWrongBooks} from '@/utils/api'
  import {changeNum} from '@/utils/index'
  export default {
    data () {
      return {
        imagesSrc: {
          pen: require('static/images/pen.png'),
          wrong_bg: require('static/images/wrong_bg.png')
        },
        wrongSub: [],
        perSequence: '',
        sea: ''
      }
    },
    onLoad (opt) {
      this.perSequence = changeNum(opt.perSequence)
      this.sea = opt.sea
      this.getMyWrongBooks(opt.perSequence)
    },
    methods: {
      getMyWrongBooks (perSequence) {
        let param = {
          openid: wx.getStorageSync('openid'),
          perSequence: perSequence
        }
        getMyWrongBooks(param).then((res) => {
          console.log(res)
          this.wrongSub.length = 0
          if (res.data.length) {
            res.data.forEach((item) => {
              let answer = []
              let answerNo = ['A', 'B', 'C', 'D', 'E', 'F']
              for (let k in item) {
                if (k.indexOf('answer') === 0) {
                  let n = parseInt(k.split('answer')[1])
                  answer[n - 1] = {
                    no: answerNo[n - 1],
                    con: item[k]
                  }
                }
              }
              this.wrongSub.push({
                answer: answer,
                content: item.content,
                userAnswer: item.user_answer,
                rightAnswer: item.right_answer
              })
            })
            console.log('wrongSub:', this.wrongSub)
          }
        })
      }
    }
  }
</script>

<style scoped>
  .pen{
    width: 80rpx;
    height: 76rpx;
  }
  .pen_r{
    transform-origin: 50% 50%;
    transform: rotateX(0deg) rotateY(180deg);
  }

  .content{
    width: 634rpx;
    height: 100%;
    overflow-y: auto;
  }
  .top{
    text-align: center;
    margin-bottom: 20rpx;
  }
  .periods{
    font-size: 50rpx;
    margin-top: 10rpx;
  }
  .wrong-num {
    font-size: 0;
    margin-top: -15rpx;
    margin-bottom: 10rpx;
  }
  .wrong-num p{
    display: inline-block;
    font-size: 42rpx;
    vertical-align: bottom;
    margin: 0 10rpx;
  }
  .tip{
    font-size: 38rpx;
  }
  .con{

  }
  .item{
    position: relative;
    width: 634rpx;
    height: auto;
    margin-bottom: 15rpx;
  }
  .wrong_bg{
    position: absolute;
    z-index: 0;
    width: 634rpx;
    height: 100%;
  }
  .item .item-con{
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 30rpx 45rpx;
    font-size: 28rpx;
  }
  .item .item-con .answer{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    margin-top: 5rpx;
    /*text-align: center;*/
  }
  .item .item-con .answer p{
    flex: 1;
    display: flex;
    line-height: 1.5;
    padding: 5rpx 0;
  }
  .item .item-con .answer p span{
    flex: 0 0 40rpx;
  }
  .wrong{
    color: #ff9a00;
  }

  @keyframes fadeInLeft {
    from {
      opacity: 0;
      transform: translate3d(-100%, 0, 0);
    }

    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }

  .fadeInLeft {
    animation: fadeInLeft 1s linear;
  }
  @keyframes fadeInRight {
    from {
      opacity: 0;
      transform: translate3d(100%, 0, 0);
    }

    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }

  .fadeInRight {
    animation: fadeInRight 1s linear;
  }
</style>
