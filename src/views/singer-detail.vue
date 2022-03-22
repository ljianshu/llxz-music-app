<template>
  <div class="singer-detail">
    <music-list :songs='songs' :title="title" :pic="pic"></music-list>
  </div>
</template>
<script>
import MusicList from '@/components/music-list/music-list'
import { getSingerDetail } from '@/service/singer'
import { processSongs } from '@/service/song'
export default {
  name: 'SingerDetail',
  components: {
    MusicList
  },
  props: {
    singer: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    pic() {
      return this.singer && this.singer.pic
    },
    title() {
      return this.singer && this.singer.name
    }
  },
  data() {
    return {
      songs: []
    }
  },
  async created() {
    const result = await getSingerDetail(this.singer)
    this.songs = await processSongs(result.songs)
  }
}
</script>
<style lang='scss' scoped>
 .singer-detail {
    position: fixed;
    z-index: 50;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: $color-background;
  }
</style>
