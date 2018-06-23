<template>
  <div class="container">
    <div class="con">
      <img src="/static/images/rank/top.png"  class="top">
      <!--领奖台-->
      <div class="podium">
        <img src="/static/images/rank/podium.png" class="podium-img">
        <div class="user fir" v-if="rankData.length">
          <div class="avatar">
            <img :src="rankData[0].avatarUrl" alt="" style="width: 100%; height: 100%;border-radius: 50%;">
            <img src="/static/images/fir.png" class="fir-img">
          </div>
          <div class="name">{{rankData[0].name}}</div>
          <div class="score">
            <img src="/static/images/score.png" class="score-img">
            <span>{{rankData[0].score}}</span>
          </div>
        </div>
        <div class="user sec" v-if="rankData.length > 1">
          <div class="avatar">
            <img :src="rankData[1].avatarUrl" alt="" style="width: 100%; height: 100%;border-radius: 50%;">
            <img src="/static/images/sec.png" class="sec-img">
          </div>
          <div class="name">{{rankData[1].name}}</div>
          <div class="score">
            <img src="/static/images/score.png" class="score-img">
            <span>{{rankData[1].score}}</span>
          </div>
        </div>
        <div class="user third" v-if="rankData.length > 2">
          <div class="avatar">
            <img :src="rankData[2].avatarUrl" alt="" style="width: 100%; height: 100%;border-radius: 50%;">
            <img src="/static/images/thir.png" class="third-img">
          </div>
          <div class="name">{{rankData[2].name}}</div>
          <div class="score">
            <img src="/static/images/score.png" class="score-img">
            <span>{{rankData[2].score}}</span>
          </div>
        </div>
      </div>
      <img src="/static/images/rank/child1.png" class="child child1 jackInTheBox">
      <img src="/static/images/rank/child2.png" class="child child2 jackInTheBox2">
      <img src="/static/images/rank/child3.png" class="child child3 jackInTheBox2">
      <img src="/static/images/rank/child4.png" class="child child4 jackInTheBox">
      <!--排行榜-->
      <div class="rank">
        <img src="/static/images/rank/rank_bg.png" class="rank-img">
        <scroll-view class="rank-con" scroll-y>
          <div class="item" v-for="(item, index) in rankData" :key="item.openid">
            <span class="no">{{index + 1}}</span>
            <span class="name">{{item.name}}</span>
            <span class="score">{{item.score}}</span>
          </div>
        </scroll-view>
      </div>
    </div>
    <div class="share">
      <img src="/static/images/rank/share_bg.png" class="share_bg">
      <div class="share-con">
        <div class="user">
          <div class="avatar">
            <open-data type="userAvatarUrl" ></open-data>
          </div>
          <span class="name"><open-data type="userNickName"></open-data></span>
        </div>
        <div class="user-rank">
          <div class="score">
            <img src="/static/images/score.png" class="score-img">
            <span>{{userData.integralCount}}</span>
          </div>
          <div class="no">排名：{{userData.no}}</div>
        </div>
        <div class="share-btn">
          <div class="btn">
            <button open-type="share" plain="true" style="width: 100%;height: 100%;border: 0;text-align: left;padding: 0;">
              <icon-button :imgUrl="imagesSrc.share_btn"></icon-button>
            </button>
          </div>
        </div>
      </div>
    </div>
    <!--ddd-->
    <alert-dialog v-if="showGetGold" @closeAlert="_closeAlert" :getType="type"></alert-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
  import iconButton from '@/components/icon-button'
  import alertDialog from '@/components/alert-dialog'
  import {stuRanking, getShareCoin} from '@/utils/api'
  export default {
    data () {
      return {
        imagesSrc: {
          share_btn: require('static/images/rank/share_btn.png')
        },
        rankData: [],
        userData: {},
        stuRank: [],
        showGetGold: false,
        type: 'getGold'
      }
    },
    components: {
      iconButton,
      alertDialog
    },
    onShow () {
      this.stuRanking()
    },
    // 分享
    onShareAppMessage () {
      wx.showShareMenu({
        withShareTicket: true
      })
      let _this = this
      return {
        title: '语文大闯关',
        path: `/pages/student/main?openid=${wx.getStorageSync('openid')}`,
        success: (res) => {
          console.log(res)
          let param = {
            shareOpenid: wx.getStorageSync('openid'),
            userOpenid: '',
            ckId: '0',
            isUpdateTitle: false
          }
          getShareCoin(param).then((res) => {
            console.log(res)
            if (res.data.msg !== '') {
              _this.showGetGold = true
            }
          })
        }
      }
    },
    methods: {
      _closeAlert () {
        this.showGetGold = false
      },
      stuRanking () {
        let param = {
          openid: wx.getStorageSync('openid')
        }
        this.rankData = []
        stuRanking(param).then((res) => {
          if (res.data.length) {
            res.data.forEach((item) => {
              if (item.openid === wx.getStorageSync('openid')) {
                this.userData = item
              }
              this.rankData.push({
                openid: item.openid,
                name: item.nickName2,
                score: item.integralCount,
                avatarUrl: item.avatarUrl
              })
            })
            // 老师数据
            if (wx.getStorageSync('userType') === '1') {
              this.userData = {
                integralCount: '--',
                no: '--'
              }
            }
            this.rankData.sort((a, b) => {
              return parseInt(b.integralCount) - parseInt(a.integralCount)
            })
            for (let i = 0; i <= this.rankData.length; i++) {
              if (this.userData.openid === this.rankData[i].openid) {
                this.userData.no = i + 1
              }
            }
          }
        })
      }
    }
  }
</script>

<style scoped>
  .con{
    position: relative;
    font-size: 0;
    margin-top: 20rpx;
  }
  .top{
    position: relative;
    z-index: 2;
    width: 560rpx;
    height: 166rpx;
  }
  .podium{
    position: relative;
    z-index: 1;
    width: 100%;
    height: 363rpx;
    font-size: 0;
    box-sizing: border-box;
    padding-top: 76rpx;
    margin-top: -76rpx;
  }
  .podium .podium-img{
    position: absolute;
    top: 0;
    left: 50%;
    z-index: 0;
    transform: translateX(-50%);
    width: 470rpx;
    height: 363rpx;
  }
  .podium .user{
    position: absolute;
    z-index: 1;
    display: inline-block;
  }
  .podium .user.fir{
    top: 98rpx;
    left: 50%;
    transform: translateX(-50%);
  }
  .podium .user.sec{
     bottom: 10rpx;
     left: 80rpx;
   }
  .podium .user.third{
    bottom: 10rpx;
    right: 80rpx;
  }

  .podium .user .avatar{
    margin:0 auto;
    position: relative;
    border-radius: 50%;
  }
  .podium .fir .avatar{
    width: 112rpx;
    height: 112rpx;
    background-color: #e2d3c7;
  }
  .podium .sec .avatar{
    width: 74rpx;
    height: 74rpx;
    background-color: #ff9999;
  }
  .podium .third .avatar{
    width: 74rpx;
    height: 74rpx;
    background-color: #6dcbdc;
  }

  .podium .user .avatar img{
    position: absolute;
    left: 50%;
    transform: translateX(-50%)
  }
  .fir-img{
    top: -40rpx;
    width: 83rpx;
    height: 55rpx;
  }
  .sec-img{
    top: -25rpx;
    width: 40rpx;
    height: 33rpx;
  }
  .third-img{
    top: -25rpx;
    width: 40rpx;
    height: 35rpx;
  }
  .podium .user .name{
    text-align: center;
    font-size:24rpx;
    color: #000;
    max-width: 180rpx;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .podium .user .score{
    font-size:24rpx;
    color: #ffcc66;
  }
  .podium .user .score .score-img{
    display: inline-block;
    width: 36rpx;
    height: 34rpx;
  }
  .podium .user .score span{
    display: inline-block;
    line-height: 40rpx;
    margin-left: 10rpx;
    vertical-align: top;
  }

  .child{
    position: absolute;
    z-index: 3;
  }
  .child1{
    top: 320rpx;
    right: -27rpx;
    width: 90rpx;
    height: 131rpx;
  }
  .child2{
    top: 130rpx;
    left: 99rpx;
    width: 84rpx;
    height: 128rpx;
  }
  .child3{
    top: 320rpx;
    left: -13rpx;
    width: 94rpx;
    height: 129rpx;
  }
  .child4{
    top: 130rpx;
    right: 78rpx;
    width: 100rpx;
    height: 136rpx;
  }

  .rank{
    position: relative;
    width: 488rpx;
    min-height:500rpx;
    margin: -14rpx auto 0;
  }
  .rank-img{
    position: absolute;
    width: 100%;
    height: 100%;
  }
  .rank-con{
    position: relative;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 50rpx 10rpx 14rpx 10rpx;
  }
  .rank-con .item{
    width: 100%;
    height: 50rpx;
    line-height: 50rpx;
    text-align: center;
    border-bottom: 3px solid #000000;
    color: #000;
    font-size: 24rpx;
    display: flex;
  }
  .rank-con .item .no{
    flex: 0 0 25%;
  }
  .rank-con .item .name{
    flex: 0 0 45%;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .rank-con .item .score{
    flex: 0 0 30%;
  }
  .share{
    position: relative;
    width: 553rpx;
    height: 164rpx;
  }
  .share .share_bg{
    position: absolute;
    z-index: 1;
    width: 100%;
    height: 100%;
  }
  .share .share-con{
    position: relative;
    z-index: 2;
    display: flex;
    box-sizing: border-box;
    padding-top: 45rpx;
    width: 100%;
    height: 100%;
    justify-content: center;
  }
  .share .share-con .user{
    flex: 0 0 130rpx;
    margin-left: 40rpx;
    margin-top: 10rpx;
    font-size: 0;
  }
  .share .share-con .user .avatar{
    width: 70rpx;
    height: 70rpx;
    box-sizing: border-box;
    border: 4rpx solid #ffffff;
    border-radius: 50%;
    background-color: #ffcc66;
    overflow: hidden;
  }
  .share .share-con .user .name{
    display: inline-block;
    width: 100%;
    font-size: 20rpx;
    color: #000000;
    text-align: center;
    padding-left: 5rpx;
    margin-left: -10rpx;
    max-width: 100rpx;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .share .share-con .user-rank{
    flex: 1;
    font-size: 32rpx;
  }
  .share .share-con .user-rank .score{
    margin-top: 5rpx;
  }
  .share .share-con .user-rank .no{

  }
  .share .share-con .user-rank .score .score-img{
    display: inline-block;
    width: 50rpx;
    height: 45rpx;
  }
  .share .share-con .user-rank .score span{
    display: inline-block;
    vertical-align: top;
    line-height: 50rpx;
    margin-left: 10rpx;
  }
  .share .share-con .share-btn{
    flex:0 0 190rpx;
    font-size: 0;
    margin-left: 20rpx;
    /*align-content: center;*/
  }
  .share .share-con .share-btn .btn{
    width: 143rpx;
    height: 63rpx;
    margin: 8rpx 0;
  }
  .share .share-con .share-btn .share-tip{
    width: 143rpx;
    height: 23rpx;
  }
  /*动画 人物左右摇动*/
  .jackInTheBox{
    animation: jackInTheBox 2s linear;
  }
  @keyframes jackInTheBox {
    from {
      opacity: 0;
      transform: scale(0.1) rotate(30deg);
      transform-origin: center bottom;
    }
    30% {
      opacity: 1;
      transform: rotate(-10deg);
    }
    50% {
      transform: rotate(30deg);
    }
    70% {
      transform: rotate(-10deg);
    }
    to {
      transform: scale(1);
    }
  }
  .jackInTheBox2{
    animation: jackInTheBox2 2s linear;
  }
  @keyframes jackInTheBox2 {
    from {
      opacity: 0;
      transform: scale(0.1) rotate(-30deg);
      transform-origin: center bottom;
    }
    30% {
      opacity: 1;
      transform: rotate(10deg);
    }
    50% {
      transform: rotate(-30deg);
    }
    70% {
      transform: rotate(10deg);
    }
    to {
      transform: scale(1);
    }
  }

</style>
