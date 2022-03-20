<template>
  <div ref="rootRef">
    <slot></slot>
  </div>
</template>
<script>
import { ref } from 'vue'
import useScroll from './useScroll'
export default {
  name: 'scroll',
  props: {
    click: {
      type: Boolean,
      default: true
    }
  },
  setup(props, { emit }) {
    const rootRef = ref(null)
    const scroll = useScroll(rootRef, props)
    return {
      rootRef,
      scroll
    }
  }
}
</script>
