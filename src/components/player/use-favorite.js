// 收藏歌曲
import { computed } from 'vue'
import { useStore } from 'vuex'
import { save, remove } from '@/assets/js/array-store'
import { FAVORITE_KEY } from '@/assets/js/constant'

export default function favorite () {
  const store = useStore()
  const favoriteList = computed(() => store.state.favoriteList)
  const maxLen = 100

  function getFavoriteIcon (song) {
    return isFavorite(song) ? 'icon-favorite' : 'icon-not-favorite'
  }

  function isFavorite (song) {
    const index = favoriteList.value.findIndex((item) => {
      return item.id === song.id
    })
    return index > -1
  }
  function toggleFavorite (song) {
    // 是否收藏歌曲到收藏列表
    let list
    if (isFavorite(song)) {
      list = remove(FAVORITE_KEY, compare)
    } else {
      list = save(song, FAVORITE_KEY, compare, maxLen)
    }
    store.commit('setFavoriteList', list)

    function compare (item) {
      return item.id === song.id
    }
  }

  return {
    getFavoriteIcon,
    toggleFavorite
  }
}
