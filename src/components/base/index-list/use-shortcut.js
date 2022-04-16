import { ref, computed } from 'vue'

export default function useStortcut (props, groupRef) {
  const scrollRef = ref(null)

  const shortcutList = computed(() => {
    return props.data.map((group) => {
      return group.title
    })
  })

  function onShortcutTouchStart (e) {
    // 获取到自定义索引 自定义属性
    const anchorIndex = parseInt(e.target.dataset.index)
    const targetEl = groupRef.value.children[anchorIndex]
    const scroll = scrollRef.value.scroll
    scroll.scrollToElement(targetEl)
  }

  function onShortcutTouchMove () {

  }

  return {
    shortcutList,
    scrollRef,
    onShortcutTouchMove,
    onShortcutTouchStart
  }
}
