import { ref } from 'vue'
import animations from 'create-keyframe-animation'

export default function useAnimation () {
  const cdWrapperRef = ref(null)
  let entering = false
  let leaving = false

  function enter (el, done) {
    if (leaving) {
      afterLeave()
    }
    entering = true
    // 小变大
    const { x, y, scale } = getPosAndScale()

    const animation = {
      0: {
        transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
      },
      100: {
        transform: 'translate3d(0, 0, 0) scale(1)'
      }
    }

    animations.registerAnimation({
      name: 'move',
      animation,
      presets: {
        duration: 600,
        easing: 'cubic-bezier(0.45, 0, 0.55, 1)'
      }
    })

    animations.runAnimation(cdWrapperRef.value, 'move', done)
  }

  function afterEnter () {
    entering = false
    animations.unregisterAnimation('move')
    cdWrapperRef.value.style.animation = ''
  }

  function leave (el, done) {
    if (entering) {
      afterEnter()
    }
    leaving = true
    // 另外一种实现动画方式
    const { x, y, scale } = getPosAndScale()
    const cdWrapperEl = cdWrapperRef.value

    cdWrapperEl.style.transition = 'all .6s cubic-bezier(0.45, 0, 0.55, 1)'
    cdWrapperEl.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
    cdWrapperEl.addEventListener('transitionend', next)

    function next () {
      // 解绑事件
      cdWrapperEl.removeEventListener('transitionend', next)
      done()
    }
  }

  function afterLeave () {
    leaving = false
    const cdWrapperEl = cdWrapperRef.value

    cdWrapperEl.style.transition = ''
    cdWrapperEl.style.transform = ''
  }

  // 计算两个圆心的横坐标 纵坐标偏移量
  function getPosAndScale () {
    const targetWidth = 40 // 小圆的直径
    const paddingLeft = 40 // 小圆圆心到左边边上距离
    const paddingBottom = 30 // 小圆圆心到底边上距离
    const paddingTop = 80 // 大圆边上距离顶部的距离
    const width = window.innerWidth * 0.8 // 大圆的直径
    const x = -(window.innerWidth / 2 - paddingLeft) // 往左偏移为负值
    const y = window.innerHeight - paddingTop - width / 2 - paddingBottom // 往下偏移为正值
    const scale = targetWidth / width

    return {
      x,
      y,
      scale
    }
  }
  return {
    cdWrapperRef,
    enter,
    afterEnter,
    leave,
    afterLeave
  }
}
