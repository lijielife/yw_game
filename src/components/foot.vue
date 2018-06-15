<template>
  <div class="foot">
    <img :src="imgUrl">
  </div>
</template>

<script type="text/ecmascript-6">
    export default {
      props: {
        imgUrl: ''
      }
    }
</script>

<style scoped>
  .foot{
    width: 420rpx;
    height: 156rpx;
  }
  .foot img{
    width: 100%;
    height: 100%;
  }
</style>
