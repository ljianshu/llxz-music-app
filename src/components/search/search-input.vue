<template>
  <div>
    <div class="search-input">
      <i class="icon-search"></i>
      <input v-model="value" class="input-inner" :placeholder="placeholder">
      <i class="icon-dismiss" v-show="value" @click="clear"></i>
    </div>
  </div>
</template>
<script>
import { debounce } from 'throttle-debounce'
export default {
  name: 'search-input',
  props: {
    modelValue: String,
    placeholder: {
      type: String,
      default: '搜索歌曲、歌手'
    }
  },
  emits: ['update:modelValue'],
  computed: {
    value: {
      get() {
        return this.modelValue
      },
      set: debounce(300, function(newVal) {
        this.$emit('update:modelValue', newVal.trim())
      })
    }
  },
  methods: {
    clear() {
      this.value = ''
    }
  }
}
</script>
<style lang='scss' scoped>
  .search-input{
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0 6px;
    height: 32px;
    border-radius: 6px;
    background: $color-highlight-background;
    box-sizing: border-box;
    .icon-search {
      font-size: 24px;
      color: $color-text-d;
    }
    .input-inner{
      flex: 1;
      margin: 0 5px;
      line-height: 18px;
      font-size: $font-size-medium;
      background: $color-highlight-background;
      outline: 0;
      color: $color-text;
      &::placeholder {
        color: $color-text-d;
      }
    }
    .icon-dismiss {
      font-size: 16px;
      color: $color-text-d;
    }
  }
</style>
