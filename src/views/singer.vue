<template>
  <div class="singer">
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
    console.log(111, result)
  }
}
</script>
