<template>
  <div class="container">
    <!--<img :src="imagesSrc.top" class="top">-->
    <img src="/static/images/top10/top10.png" class="top">
    <div class="top10">
      <div class="item" v-for="(item, index) in top10" :key="index">
        <div class="con">
          <img :src="top10_bg[index]" class="item-bg">
          <div class="item-con">
            <div class="avatar">
              <img :src="item.imageUrl">
            </div>
            <div class="name">{{item.name}}</div>
            <div class="score">
              <!--<img :src="imagesSrc.score">-->
              <img src="/static/images/score.png">
              {{item.score}}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {checkPointTopTen} from '@/utils/api'
  export default {
    data () {
      return {
        imagesSrc: {
//          top: require('static/images/top10/top10.png'),
          close_btn: require('static/images/top10/top10.png')
//          score: require('static/images/score.png')
        },
        top10: [
          {imageUrl: require('static/images/avatar_2.png'), name: 'kkdkkd', score: '120'},
          {imageUrl: require('static/images/avatar_2.png'), name: 'kkdkkd', score: '120'}
        ]
      }
    },
    computed: {
      top10_bg: function () {
        let arr = []
        for (let i = 1; i <= 10; i++) {
          arr.push(require(`static/images/top10/top_${i}.png`))
        }
        return arr
      }
    },
    onLoad (opt) {
      this.checkPointTopTen(opt.mySequence)
    },
    methods: {
      checkPointTopTen (mySequence) {
        let param = {
          perSequence: wx.getStorageSync('perSequence'),
          graId: wx.getStorageSync('graId'),
          mySequence: mySequence
        }
        checkPointTopTen(param).then((res) => {
          console.log(res)
          this.top10.length = 0
          if (res.success) {
            res.data.forEach((item) => {
              this.top10.push({
                imageUrl: item.avatarUrl,
                name: item.nickname,
                score: item.topScore
              })
            })
          }
        })
      }
    }
  }
</script>

<style scoped>
  .top{
    margin-top: 10rpx;
    width: 558rpx;
    height: 166rpx;
  }
  .top10{
    display: flex;
    flex-direction: column;
    width: 585rpx;
    height:1010rpx;
  }
  .top10 .item .con{
    display: flex;
    position: relative;
    width: 585rpx;
    height: 84rpx;
    margin-bottom: 16rpx;
    box-sizing: border-box;
    padding: 0 24rpx 0 100rpx;
  }
  .top10 .item .item-bg{
    position: absolute;
    z-index: 0;
    left: 0;
    top: 0;
    width: 585rpx;
    height: 84rpx;
  }
  .top10 .item .item-con{
    display: flex;
    position: relative;
    z-index: 1;
    font-size: 24rpx;
    height: 50rpx;
    margin-top: 12rpx;
    line-height: 50rpx;
    width: 100%;
  }
  .top10 .item .item-con .avatar{
    font-size: 0;
    border: 4rpx solid #ffcc66;
    border-radius: 2rpx;
    width: 35rpx;
    height: 35rpx;
    margin-top: 5rpx;
  }
  .top10 .item .item-con .avatar img{
    width: 100%;
    height: 100%;
  }
  .top10 .item .item-con .name{
    margin-left: 20rpx;
  }
  .top10 .item .item-con .score{
    flex: 1;
    text-align: right;
  }
  .top10 .item .item-con .score img{
    width: 30rpx;
    height: 30rpx;
    margin-bottom: -3rpx;
  }
</style>
