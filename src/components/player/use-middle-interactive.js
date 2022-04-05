// 歌曲CD页面和歌词之间切换逻辑
import { ref } from 'vue'

export default function useMiddleInteractive () {
  const currentShow = ref('cd')
  const middleLStyle = ref(null)
  const middleRStyle = ref(null)
  const touch = {}

  // 手机端拖拽事件
  function onMiddleTouchStart (e) {
    touch.startX = e.touches[0].pageX
    touch.startY = e.touches[0].pageY
  }

  function onMiddleTouchMove (e) {

  }

  function onMiddleTouchEnd (e) {

  }

  return {
    currentShow,
    middleLStyle,
    middleRStyle,
    onMiddleTouchStart,
    onMiddleTouchMove,
    onMiddleTouchEnd
  }
}
