import { nextTick, ref, watch } from 'vue'

export default function useFixed (props) {
  const groupRef = ref(null)
  const listHeights = ref([])
  const scrollY = ref(0)

  watch(() => props.data, async () => {
    await nextTick()
    calculate()
  })

  function calculate () {
    const list = groupRef.value.children
    const listHeightsVal = listHeights.value
    let height = 0
    // 一开始先数组清空
    listHeightsVal.length = 0
    listHeightsVal.push(height)

    for (let i = 0; i < list.length; i++) {
      height += list[i].clientHeight
    }
    console.log('height', height)
  }

  function onScroll (pos) {
    scrollY.value = -pos.y
  }
  return {
    groupRef,
    onScroll
  }
}
