<template>
  <div class="search">
    <div class="search-input-wrapper">
      <search-input v-model="query"></search-input>
    </div>
    <scroll class="search-content" ref="scrollRef" v-show="!query">
      <div>
        <div class="hot-keys">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li
                class="item"
                v-for="item in hotKeys"
                :key="item.id"
                @click="addQuery(item.key)"
              >
                <span>{{item.key}}</span>
              </li>
          </ul>
        </div>
        <div class="search-history" v-show="searchHistory.length">
          <h1 class="title">
            <span class="text">搜索历史</span>
            <span class="clear" @click="showConfirm">
              <i class="icon-clear"></i>
            </span>
          </h1>
          <confirm
            ref="confirmRef"
            text="是否清空所有搜索历史"
            confirm-btn-text="清空"
            @confirm="clearSearch"
          />
          <search-list :searches="searchHistory" @select="addQuery" @delete="deleteSearch"></search-list>
        </div>
      </div>
    </scroll>
    <!-- 搜索歌曲、歌手结果展示 -->
    <div class="search-result" v-show="query">
      <suggest :query="query" @select-song="selectSong" @select-singer="selectSinger"></suggest>
    </div>
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :data="selectedSinger"/>
      </transition>
    </router-view>
  </div>
</template>

<script>
import { computed, nextTick, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import SearchInput from '@/components/search/search-input'
import Confirm from '@/components/base/confirm/confirm'
import SearchList from '@/components/base/search-list/search-list'
import Suggest from '@/components/search/suggest'
import { getHotKeys } from '@/service/search'
import useSearchHistory from '@/components/search/use-search-history'
import Scroll from '@/components/wrap-scroll'
import { SINGER_KEY } from '@/assets/js/constant'
import storage from 'good-storage'

export default {
  name: 'search',
  components: {
    SearchInput,
    Suggest,
    SearchList,
    Scroll,
    Confirm
  },
  setup() {
    const query = ref('')
    const hotKeys = ref([])
    const selectedSinger = ref(null)
    const scrollRef = ref(null)
    const confirmRef = ref(null)

    const store = useStore()
    const router = useRouter()

    const { saveSearch, deleteSearch, clearSearch } = useSearchHistory()

    const searchHistory = computed(() => store.state.searchHistory)

    watch(query, async(newQuery) => {
      // 清空输入搜索歌曲名字后，修复搜索页不能滚动的bug
      if (!newQuery) {
        await nextTick()
        refreshScroll()
      }
    })
    function refreshScroll() {
      scrollRef.value.scroll.refresh()
    }

    getHotKeys().then((result) => {
      hotKeys.value = result.hotKeys
    })
    const addQuery = (params) => {
      query.value = params
    }
    const selectSong = (song) => {
      // 这时候将查询歌曲的名字存入本地和vuex
      saveSearch(query.value)
      // 播放歌曲
      store.dispatch('addSong', song)
    }

    function selectSinger(singer) {
      // 这时候将查询歌手的名字存入本地和vuex
      // 直接跳转到二级路由SingerDetail
      saveSearch(query.value)
      selectedSinger.value = singer
      cacheSinger(singer)

      router.push({
        path: `/search/${singer.mid}`
      })
    }

    function cacheSinger(singer) {
      storage.session.set(SINGER_KEY, singer)
    }

    function showConfirm() {
      confirmRef.value.show()
    }

    return {
      query,
      hotKeys,
      addQuery,
      searchHistory,
      deleteSearch,
      saveSearch,
      clearSearch,
      selectSong,
      selectSinger,
      scrollRef,
      confirmRef,
      showConfirm,
      selectedSinger
    }
  }
}
</script>

<style lang="scss" scoped>
  .search{
    position: fixed;
    width: 100%;
    top:88px;
    bottom: 0;
    display: flex;
    flex-direction: column;
    .search-input-wrapper{
      margin: 20px;
    }
    .search-content{
      flex: 1;
      overflow: hidden;
      .hot-keys{
        margin: 0 20px 20px 20px;
        .title {
          margin-bottom: 20px;
          font-size: $font-size-medium;
          color: $color-text-l;
        }
        .item {
          display: inline-block;
          padding: 5px 10px;
          margin: 0 20px 10px 0;
          border-radius: 6px;
          background: $color-highlight-background;
          font-size: $font-size-medium;
          color: $color-text-d;
        }
      }
      .search-history {
        position: relative;
        margin: 0 20px;
        .title {
          display: flex;
          align-items: center;
          height: 40px;
          font-size: $font-size-medium;
          color: $color-text-l;
          .text {
            flex: 1;
          }
          .clear {
            @include extend-click();
            .icon-clear {
              font-size: $font-size-medium;
              color: $color-text-d;
            }
          }
        }
      }
    }
    .search-result {
      flex: 1;
      overflow: hidden;
    }
  }
</style>
