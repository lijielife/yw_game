<template>
  <div class="button" :style="{transform: animates === 'start' ? 'scale(0.8)' : 'scale(1)'}" @touchstart.prevent="_touchStart" @touchend.prevent="_touchEnd" @tap.prevent="_tap">
    <img :src="imgUrl" v-if="imgUrl !== ''">
    <div class="text">
      <slot></slot>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      imgUrl: ''
    },
    data () {
      return {
        animates: ''
      }
    },
    methods: {
      _touchStart () {
        this.animates = 'start'
      },
      _touchEnd () {
        let _this = this
        setTimeout(() => {
          _this.animates = 'end'
        }, 300)
      },
      _tap () {
        let _this = this
        setTimeout(() => {
          _this.$emit('tapEvent')
        }, 400)
      }
    }
  }
</script>

<style scoped>
  .button{
    position: relative;
    width: 100%;
    height: 100%;
    transition: all 0.3s
  }
  img{
    position: absolute;
    width: 100%;
    height: 100%;
  }
  .text{
    position: relative;
    font-size: 28rpx;
    text-align: center;
    z-index: 2;
  }
</style>
