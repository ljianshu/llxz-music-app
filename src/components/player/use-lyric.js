import { useStore } from 'vuex'
import { computed, watch, ref } from 'vue'
import { getLyric } from '@/service/song'
import Lyric from 'lyric-parser'

export default function useLyric ({ songReady, currentTime }) {
  const currentLyric = ref(null)
  const currentLineNum = ref(0)
  const pureMusicLyric = ref('')
  const playingLyric = ref('')
  const lyricScrollRef = ref(null)
  const lyricListRef = ref(null)

  const store = useStore()
  const currentSong = computed(() => store.getters.currentSong)

  watch(currentSong, async (newSong) => {
    if (!newSong.url || !newSong.id) {
      return
    }

    stopLyric()
    currentLyric.value = null
    currentLineNum.value = 0
    pureMusicLyric.value = ''
    playingLyric.value = ''

    const lyric = await getLyric(newSong)
    // 拿到歌词后，存入到相应的歌曲中
    store.commit('addSongLyric', { song: newSong, lyric })

    // 歌词还没解析好，歌曲被切换了
    if (currentSong.value.lyric !== lyric) {
      return
    }
    currentLyric.value = new Lyric(lyric, handleLyric)
    const hasLyric = currentLyric.value.lines.length
    if (hasLyric) {
      // 有歌词
      if (songReady.value) {
        // 歌曲缓存好了
        playLyric()
      }
    } else {
      // 纯音乐
      playingLyric.value = pureMusicLyric.value = lyric.replace(/\[(\d{2}):(\d{2}):(\d{2})\]/g, '')
    }
  })

  function handleLyric ({ lineNum, txt }) {
    // 歌词行lineNum发生改变时，这个方法就触发一次，txt就是当前的歌词
    currentLineNum.value = lineNum
    playingLyric.value = txt
    const scrollComp = lyricScrollRef.value
    const listEl = lyricListRef.value
    if (!listEl) {
      // 没有歌词列表
      return
    }
    if (lineNum > 5) {
      // 歌词自动向上滚动
      const lineEl = listEl.children[lineNum - 5]
      scrollComp.scroll.scrollToElement(lineEl, 1000)
    } else {
      // 前六行不动
      scrollComp.scroll.scrollTo(0, 0, 1000)
    }
  }

  function playLyric () {
    // 播放歌词
    console.log('currentLyric', currentLyric.value)
    const currentLyricVal = currentLyric.value
    if (currentLyricVal) {
      currentLyricVal.seek(currentTime.value * 1000)
    }
  }

  function stopLyric () {
    const currentLyricVal = currentLyric.value
    if (currentLyricVal) {
      currentLyricVal.stop()
    }
  }

  return {
    currentLyric,
    currentLineNum,
    playLyric,
    playingLyric,
    lyricScrollRef,
    lyricListRef,
    stopLyric,
    pureMusicLyric
  }
}
