<template>
  <div class="stu-card">
    <img :src="imgUrl">
    <div class="content">
      <slot></slot>
    </div>
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
  .stu-card{
    width: 100%;
    height:100%;
    font-size: 0;
    position: relative;
  }
  .stu-card img{
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
  }
  .stu-card .content{
    position: relative;
    width: 100%;
    height: 100%;
    z-index: 2;
  }
</style>
