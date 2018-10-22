<template>
  <div class="container">
    <div>
    <div class="top">
      <stu-card :imgUrl="imagesSrc.card">
        <div class="con">
          <p class="title">{{subjectName}}</p>
          <p class="info">共<span>{{countStudent}}</span>人，平均通过<span>{{teaAverage}}</span>关</p>
        </div>
      </stu-card>
    </div>
    <div class="rank">
      <div class="title">
        <span class="t">姓名</span>
        <span class="t" @click="rank('done')">已通关<span class="down"></span></span>
        <span class="t" @click="rank('score')">金币<span class="down"></span></span>
        <span class="t" @click="rank('once')">一次通关<span class="down"></span></span>
        <span class="t" @click="rank('repeat')">反复刷题<span class="down"></span></span>
      </div>
      <scroll-view class="rank-scroll" scroll-y v-if="rankData.length">
        <div class="item" v-for="(item, index) in rankData" :key="index">
          <span class="li">{{item.studentName}}</span>
          <span class="li">{{item.my_sequence}}</span>
          <span class="li">{{item.integral_count}}</span>
          <span class="li">{{item.access_first}}</span>
          <span class="li">{{item.access_many}}</span>
        </div>
      </scroll-view>
    </div>
    </div>
    <foot :imgUrl="imagesSrc.foot"></foot>
  </div>
</template>

<script type="text/ecmascript-6">
  import foot from '@/components/foot'
  import stuCard from '@/components/stu-card'
  import {myStudentsAverage} from '@/utils/api'
  export default {
    data () {
      return {
        imagesSrc: {
          card: require('static/images/card/s1.png'),
          foot: require('static/images/foot_img3.png')
        },
        rankData: [
        ],
        method: true,
        countStudent: '',
        teaAverage: '',
        subjectName: ''
      }
    },
    onLoad (opt) {
      this.countStudent = opt.countStudent
      this.teaAverage = opt.teaAverage
      this.subjectName = opt.subjectName
      this.myStudentsAverage(opt.subjectsClassID)
    },
    methods: {
      rank (type) {
        this.rankData.sort((a, b) => {
          if (this.method) {
            return parseInt(a[type]) - parseInt(b[type])
          } else {
            return parseInt(b[type]) - parseInt(a[type])
          }
        })
        this.method = !this.method
      },
      myStudentsAverage (subjectsClassID) {
        wx.showLoading({
          title: '数据加载中...'
        })
        let param = {
          openid: wx.getStorageSync('openid'),
          subjectsClassID: subjectsClassID,
          userType: wx.getStorageSync('userType'),
          loginid: wx.getStorageSync('userInfo2').loginid || ''
        }
        myStudentsAverage(param).then((res) => {
          wx.hideLoading()
          console.log(res)
          this.rankData.length = 0
          if (res.success) {
            this.rankData = res.data
          } else {
            // 账号登出提示
            if (res.data === '404') {
              wx.showModal({
                title: '登出提示',
                content: res.desc,
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    wx.redirectTo({url: '../index/main'})
                  }
                }
              })
              return
            }
          }
        })
      }
    },
    components: {
      foot,
      stuCard
    }
  }
</script>

<style scoped>
  .top{
    width: 630rpx;
    height: 153rpx;
    text-align: center;
    margin-top: 35rpx;
  }
  .top .con {

  }
  .top .con .title{
    font-size: 32rpx;
    padding:38rpx 0 20rpx;
  }
  .top .con .info{
    font-size: 28rpx;
  }
  .top .con .info span{
    color: #ffffff;
  }
  .rank{
    position: relative;
    margin-top: 15rpx;
    width: 630rpx;
    height: 800rpx;
    border:8rpx solid #9ed33a;
    border-radius: 15rpx;
    padding-top: 70rpx;
    box-sizing: border-box;
    background-color: #ffffff;
  }
  .rank .title{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 70rpx;
    background-color: #b0cd4d;
    display: flex;
  }
  .rank .title .t{
    flex: 0 0 20%;
    text-align: center;
    color: #ffffff;
    font-size: 28rpx;
    position: relative;
  }
  .rank .rank-scroll{
    position: relative;
    width: 100%;
    height: 100%;
    background-color: #ffffff;
  }
  .rank .rank-scroll .item{
    display: flex;
    width: 100%;
    height: 60rpx;
    line-height: 60rpx;
  }
  .rank .rank-scroll .item .li{
    flex: 0 0 20%;
    text-align: center;
    font-size: 28rpx;
    color: #000000;
  }
  .rank .rank-scroll .item .li+.li{
    border-left: 2rpx solid #000000;
  }
  .rank .rank-scroll .item:nth-child(2n){
    background-color: #c1d874;
  }
  .rank .rank-scroll .item:nth-child(2n+1){
    background-color: #ffffff;
  }
  .rank .rank-scroll .item:nth-child(2n+1) .li+.li{
    border-left-color: #9ed33a;
  }
  .rank .rank-scroll .item:nth-child(2n) .li+.li{
    border-left-color: #ffffff;
  }

  .down{
    position: absolute;
    bottom: 10rpx;
    left: 50%;
    transform: translate(-50%);
    height: 0rpx;
    width: 0rpx;
    border-top: 20rpx solid #669900;
    border-left: 22rpx solid transparent;
    border-right: 22rpx solid transparent;
  }
</style>
