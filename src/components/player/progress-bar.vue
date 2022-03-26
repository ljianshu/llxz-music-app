<template>
  <div>
    <div class="progress-bar">
      <div class="bar-inner">
        <div class="progress">

        </div>
        <div class="progress-btn-wrapper">
          <div class="progress-btn">

          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'progress-btn',
  props: {
    progress: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      offset: 0
    }
  },
  methods: {
  }
}
</script>
<style lang='scss' scoped>
  .progress-bar{
    width: 100%;
  }
</style>
