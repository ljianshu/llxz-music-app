<template>
  <div id="app">
    <m-header></m-header>
    <Tab></Tab>
  </div>
  <router-view/>
</template>

<script>
 import MHeader from '@/components/m-header/m-header'
 import Tab from '@/components/tab/tab'
export default {
  components: {
    MHeader,
    Tab
  },
  setup() {

  }
}
</script>
<style lang="scss">
</style>
