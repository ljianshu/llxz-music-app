import { ref, computed, watch, onMounted, onUnmounted, onActivated, onDeactivated, nextTick } from 'vue'
import { useStore } from 'vuex'
import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'

BScroll.use(Slide)

export default function useMiniSlider () {
  const sliderWrapperRef = ref(null)
  const slider = ref(null)

  const store = useStore()
  const fullScreen = computed(() => store.state.fullScreen)
  const playlist = computed(() => store.state.playlist)
  const currentIndex = computed(() => store.state.currentIndex)

  const sliderShow = computed(() => {
    // 播放列表有歌曲且不全屏
    return !fullScreen.value && playlist.value.length
  })

  onMounted(() => {
    let sliderVal
    watch(sliderShow, async (newSliderShow) => {
      // 值为true时，才有必要出现slider
      if (newSliderShow) {
        await nextTick()
        if (!sliderVal) {
          // 没有初始化过，就要实例化一次
          sliderVal = slider.value = new BScroll(sliderWrapperRef.value, {
            click: true,
            scrollX: true,
            scrollY: false,
            momentum: false,
            bounce: false,
            probeType: 2,
            slide: {
              autoplay: false,
              loop: true
            }
          })
          // 当slide 切换page之后触发
          sliderVal.on('slidePageChanged', ({ pageX }) => {
            store.commit('setCurrentIndex', pageX)
          })
        } else {
          sliderVal.refresh()
        }
        // 滚动到指定的Page位置 保证slider显示就是当前播放的歌曲，但如果一首歌播放结束后，slider应该实时切换过来，所以必须要监听currentIndex
        sliderVal.goToPage(currentIndex.value, 0, 0)
      }
    })

    watch(currentIndex, (newIndex) => {
      if (sliderVal && sliderShow.value) {
        sliderVal.goToPage(newIndex, 0, 0)
      }
    })

    // 修复歌曲被删除时，会报错
    watch(playlist, async (newList) => {
      if (sliderVal && sliderShow.value && newList.length) {
        await nextTick()
        sliderVal.refresh()
      }
    })
  })

  onUnmounted(() => {
    if (slider.value) {
      slider.value.destroy()
    }
  })

  onActivated(() => {
    scroll.value.enable()
    scroll.value.refresh()
  })

  onDeactivated(() => {
    scroll.value.disable()
  })

  return {
    sliderWrapperRef,
    slider
  }
}
