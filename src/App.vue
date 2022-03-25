<template>
  <div id="app">
    <m-header></m-header>
    <Tab></Tab>
    <router-view/>
    <player></player>
  </div>
</template>

<script>
 import Player from '@/components/player/player'
 import MHeader from '@/components/m-header/m-header'
 import Tab from '@/components/tab/tab'
export default {
  components: {
    MHeader,
    Tab,
    Player
  },
  setup() {

  }
}
</script>
<style lang="scss">
</style>
