// 歌曲切换播放模式
import { computed } from 'vue'
import { PLAY_MODE } from '@/assets/js/constant'
import { useStore } from 'vuex'

// 调整歌曲播放模式
export default function useMode () {
  const store = useStore()
  const playMode = computed(() => store.state.playMode)

  // 设置不同播放模式图标
  const modeIcon = computed(() => {
    const playModeVal = playMode.value
    return playModeVal === PLAY_MODE.sequence ? 'icon-sequence' : playModeVal === PLAY_MODE.random
      ? 'icon-random'
      : 'icon-loop'
  })

  function changeMode () {
    const mode = (playMode.value + 1) % 3
    store.dispatch('changeMode', mode)
  }

  return {
    modeIcon,
    changeMode
  }
}
