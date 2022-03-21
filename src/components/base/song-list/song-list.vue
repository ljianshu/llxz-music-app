<template>
  <ul class="song-list">
    <li class="item" v-for="song in songs" :key="song.id">
      <div class="content">
        <div class="name">{{song.name}}</div>
        <div class="desc">{{getDesc(song)}}</div>
      </div>
    </li>
  </ul>
</template>
<script>
export default {
  name: 'SongList',
  props: {
    songs: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    getDesc(song) {
      return `${song.singer}·${song.album}`
    }
  }
}
</script>
<style lang='scss' scoped>

</style>
