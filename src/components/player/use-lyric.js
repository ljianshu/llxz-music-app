import { useStore } from 'vuex'
import { computed, watch, ref } from 'vue'
import { getLyric } from '@/service/song'
import Lyric from 'lyric-parser'

export default function useLyric ({ songReady, currentTime }) {
  const currentLyric = ref(null)
  const currentLineNum = ref(0)
  const playingLyric = ref('')

  const store = useStore()
  const currentSong = computed(() => store.getters.currentSong)

  watch(currentSong, async (newSong) => {
    if (!newSong.url || !newSong.id) {
      return
    }

    const lyric = await getLyric(newSong)
    // 拿到歌词后，存入到相应的歌曲中
    store.commit('addSongLyric', { song: newSong, lyric })

    // 歌词还没解析好，歌曲被切换了
    if (currentSong.value.lyric !== lyric) {
      return
    }
    currentLyric.value = new Lyric(lyric, handleLyric)
    console.log(1, currentLyric.value)
  })

  function handleLyric ({ lineNum, txt }) {
    // this hanlder called when lineNum change
    currentLineNum.value = lineNum
    playingLyric.value = txt
    if (songReady.value) {
      // 歌曲缓存好了
      playLyric()
    }
  }

  function playLyric () {
    // 播放歌词
    console.log(2, currentLyric.value, playingLyric)
    const currentLyricVal = currentLyric.value
    if (currentLyricVal) {
      currentLyricVal.seek(currentTime.value * 1000)
    }
  }

  // function stopLyric () {
  //   // 暂停歌词
  // }

  return {
    currentLyric,
    currentLineNum,
    playLyric,
    playingLyric
  }
}
