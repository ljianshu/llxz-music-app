<template>
  <div class="music-list">
    <div class="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title">{{title}}</h1>
    <div class="bg-img" :style="bgImgStyle"></div>
    <div class="filter"></div>
  </div>
  <scroll class="list">
    <div class="song-list-wrapper">
      <song-list :songs="songs"></song-list>
    </div>
  </scroll>
</template>
<script>
import Scroll from '@/components/base/scroll/scroll'
import SongList from '@/components/base/song-list/song-list'
export default {
  name: 'music-list',
  components: {
    Scroll,
    SongList
  },
  props: {
    songs: {
      type: Array,
      default: () => []
    },
    title: String,
    pic: String
  },
  computed: {
    bgImgStyle() {
      return {
        backgroundImage: `url(${this.pic})`
      }
    }
  }
}
</script>
<style lang='scss' scoped>
  .music-list{
    height: 100%;
  }
</style>
