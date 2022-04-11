<template>
  <div class="m-header">
    <div class="icon"></div>
    <div class="text">网易云Music</div>
    <router-link class="mine" to="/user">
      <i class="icon-mine"></i>
    </router-link>
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  setup() {

  }
}
</script>
<style lang="scss" scoped>
  .m-header{
    height: 44px;
    text-align: center;
    color: $color-theme;
    display: flex;
    justify-content: center;
    align-items: center;
    .icon{
      width: 30px;
      height: 32px;
      margin-right: 9px;
      @include bg-image("logo");
      background-size:contain;
    }
    .text{
      display: inline-block;
      vertical-align: top;
      line-height: 44px;
      font-size: $font-size-large;
    }
    .mine {
      position: absolute;
      top: 0;
      right: 0;
      .icon-mine {
        display: block;
        padding: 12px;
        font-size: $font-size-large-x;
        color: $color-theme;
      }
    }
  }
</style>
