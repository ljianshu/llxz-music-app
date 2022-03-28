<template>
  <div class="search">
    <div class="search-input-wrapper">
      <search-input v-model="query"></search-input>
    </div>
    <div class="search-content" v-show="!query">
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
        <!-- <confirm
          ref="confirmRef"
          text="是否清空所有搜索历史"
          confirm-btn-text="清空"
          @confirm="clearSearch"
        > -->
        <search-list :searches="searchHistory" @select="addQuery" @delete="deleteSearch"></search-list>
      </div>
    </div>
    <div class="search-result" v-show="query">
      <suggest :query="query"></suggest>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import SearchInput from '@/components/search/search-input'
// import Confirm from '@/components/base/confirm/confirm'
import SearchList from '@/components/base/search-list/search-list'
import Suggest from '@/components/search/suggest'
import { getHotKeys } from '@/service/search'
export default {
  name: 'search',
  components: {
    SearchInput,
    Suggest,
    SearchList
  },
  setup() {
    const query = ref('')
    const hotKeys = ref([])
    const searchHistory = ref([])
    getHotKeys().then((result) => {
      hotKeys.value = result.hotKeys
    })
    const addQuery = (params) => {
      query.value = params
    }
    const deleteSearch = (item) => {
      console.log(22)
    }
    return {
      query,
      hotKeys,
      addQuery,
      searchHistory,
      deleteSearch
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
  }
</style>
