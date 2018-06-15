<template>
  <div class="shadow-button"
       :style="{borderRadius: borderRadius, boxShadow: shadow ? '10rpx 10rpx 5rpx #cccccc' : ''}"
       @touchstart.prevent="_touchStart"
       @touchend.prevent="_touchEnd"
       @tap.prevent="_tap">
    <img :src="imgUrl">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
    export default {
      props: {
        imgUrl: '',
        borderRadius: '25rpx'
      },
      data () {
        return {
          shadow: true
        }
      },
      methods: {
        _touchStart () {
          this.shadow = false
        },
        _touchEnd () {
          let _this = this
          setTimeout(() => {
            _this.shadow = true
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
  .shadow-button{
    width: 100%;
    height:100%;
    font-size: 0;
    position: relative;
    transition: all 0.3s;
    overflow: hidden;
  }
  .shadow-button img{
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;

  }
  .shadow-button .content{
    position: relative;
    z-index: 2;
  }
</style>
