<template>
  <div class="singer" v-loading="!singers.length">
    <index-list :singers="singers"></index-list>
  </div>
</template>

<script>
import { getSingerList } from '@/service/singer'
import IndexList from '@/components/base/index-list/index-list'
export default {
  name: 'Singer',
  components: {
    IndexList
  },
  data() {
    return {
      singers: []
    }
  },
  async created() {
    const result = await getSingerList()
    this.singers = result.singers
  }
}
</script>
<style lang="scss" scoped>
  .singer{
    position: fixed;
    top: 88px;
    bottom: 0;
    width: 100%;
  }
</style>
