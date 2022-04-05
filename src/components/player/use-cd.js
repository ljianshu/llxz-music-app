// 暂停时候，cd停止滚动
import { useStore } from 'vuex'
import { computed, ref, watch } from 'vue'

export default function useCd () {
  const cdRef = ref(null)
  const cdImageRef = ref(null)

  const store = useStore()
  const playing = computed(() => store.state.playing)

  const cdCls = computed(() => {
    return playing.value ? 'playing' : ''
  })

  watch(playing, (newPlaying) => {
    if (!newPlaying) {
      // 暂停时如何同步cd旋转角度
      syncTransform(cdRef.value, cdImageRef.value)
    }
  })

  function syncTransform (wrapper, inner) {
    console.log('wrapper', wrapper)
    console.log('inner', inner)
    const wrapperTransform = getComputedStyle(wrapper).transform
    const innerTransform = getComputedStyle(inner).transform
    wrapper.style.transform = wrapperTransform === 'none' ? innerTransform : innerTransform.concat(' ', wrapperTransform)
  }

  return {
    cdCls,
    cdRef,
    cdImageRef
  }
}
