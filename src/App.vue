<template>
  <div id="app">
    <m-header></m-header>
    <Tab></Tab>
    <router-view :style="viewStyle" v-slot="{ Component }">
      <!-- 组件缓存 使用keep-alive会让onUnmouted钩子方法就会失效，记得改下-->
      <keep-alive>
        <component :is="Component"/>
      </keep-alive>
    </router-view>
    <!-- 为了避免每个一级路由切换都有动画，故而将这个user一级路由独立出来 -->
    <router-view
    :style="viewStyle"
    name="user"
    v-slot="{ Component }"
    >
      <transition appear name="slide">
        <keep-alive>
          <component :is="Component"/>
        </keep-alive>
      </transition>
    </router-view>
    <player></player>
  </div>
</template>

<script>
 import Player from '@/components/player/player'
 import MHeader from '@/components/m-header/m-header'
 import Tab from '@/components/tab/tab'
 import { mapState } from 'vuex'
export default {
  components: {
    MHeader,
    Tab,
    Player
  },
  computed: {
    viewStyle() {
      const bottom = this.playlist.length ? '60px' : '0'
      return {
        bottom
      }
    },
    ...mapState([
      'playlist'
    ])
  }
}
</script>
