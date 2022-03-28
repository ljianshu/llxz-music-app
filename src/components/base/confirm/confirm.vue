<template>
  <div>

  </div>
</template>
<script>
export default {
  name: 'confirm',
  props: {
    text: {
      type: String,
      default: ''
    },
    confirmBtnText: {
      type: String,
      default: '清空'
    },
    cancelBtnText: {
      type: String,
      default: '取消'
    }
  },
  data() {
    return {
      visible: false
    }
  },
  computed: {
  },
  methods: {
  }
}
</script>
<style lang='scss' scoped>

</style>
