<template>
  <div class="suggest" v-loading:[loadingText]="loading" v-no-result:[noResultText]="noResult">
    <ul class="suggest-list">
      <li class="suggest-item" v-if="singer" @click="selectSinger(singer)">
        <div class="icon">
          <i class="icon-mine"></i>
        </div>
        <div class="name">
          <p class="text">{{ singer.name }}</p>
        </div>
      </li>
      <li
        class="suggest-item"
        v-for="song in songs"
        :key="song.id"
        @click="selectSong(song)"
      >
        <div class="icon">
          <i class="icon-music"></i>
        </div>
        <div class="name">
          <p class="text">
            {{song.singer}}-{{song.name}}
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { computed, ref, watch } from 'vue'
import { search } from '@/service/search'
import { processSongs } from '@/service/song'
export default {
  name: 'suggest',
  props: {
    query: String,
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  emits: ['select-song', 'select-singer'],
  setup(props, { emit }) {
    const loading = ref(true)
    const singer = ref(null)
    const songs = ref([])
    const hasMore = ref(true)
    const page = ref(1)
    const loadingText = ref('')
    const noResultText = ref('抱歉，暂无搜索结果')

    const noResult = computed(() => {
      console.log('321', !singer.value && !songs.value.length && !hasMore.value)
      return !singer.value && !songs.value.length && !hasMore.value
    })

    watch(() => props.query, async(newQuery) => {
      if (!newQuery) {
        return
      }
      await searchFirst()
    })

    const searchFirst = async function() {
      if (!props.query) {
        return
      }
      page.value = 1
      hasMore.value = true
      songs.value = []
      singer.value = true
      loading.value = true

      const result = await search(props.query, page.value, props.showSinger)
      songs.value = await processSongs(result.songs)
      hasMore.value = result.hasMore
      singer.value = result.singer
      loading.value = false
    }

    function selectSong(song) {
      emit('select-song', song)
    }

    function selectSinger(singer) {
      emit('select-singer', singer)
    }
    return {
      singer,
      songs,
      hasMore,
      selectSong,
      selectSinger,
      loadingText,
      noResultText,
      loading,
      noResult
    }
  }
}

</script>
<style scoped lang='scss'>
  .suggest{
    height: 100%;
    overflow: hidden;
    .suggest-list{
      padding: 0 30px;
      .suggest-item{
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        .icon {
          flex: 0 0 30px;
          width: 30px;
          [class^="icon-"] {
            font-size: 14px;
            color: $color-text-d;
          }
        }
        .name {
          flex: 1;
          font-size: $font-size-medium;
          color: $color-text-d;
          overflow: hidden;
          .text {
            @include no-wrap();
          }
        }
      }
    }
  }
</style>
