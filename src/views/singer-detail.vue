<template>
  <div class="singer-detail">
    <music-list :songs='songs' :title="title" :pic="pic"></music-list>
  </div>
</template>
<script>
import MusicList from '@/components/music-list/music-list'
import { getSingerDetail } from '@/service/singer'
import { processSongs } from '@/service/song'
import storage from 'good-storage'
import { SINGER_KEY } from '@/assets/js/constant'
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
    computedSinger() {
      let ret = null
      const singer = this.singer
      if (singer) {
        // 从歌手列表进入
        ret = singer
      } else {
        // 刷新歌手详情页时
        const cachedSinger = storage.session.get(SINGER_KEY)
        if (cachedSinger && this.$route.params.id === cachedSinger.mid) {
          ret = cachedSinger
        }
      }
      return ret
    },
    pic() {
      const singer = this.computedSinger
      return singer && singer.pic
    },
    title() {
      const singer = this.computedSinger
      return singer && singer.name
    }
  },
  data() {
    return {
      songs: []
    }
  },
  async created() {
    // computedSinger有可能取到null,比如手动修改网页地址，然后刷新页面，就会报错
    const data = this.computedSinger
    if (!data) {
      const path = this.$route.matched[0].path
      this.$router.push({
        path
      })
      return
    }
    const result = await getSingerDetail(data)
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
