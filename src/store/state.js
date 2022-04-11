// 播放器的初始状态
import storage from 'good-storage'
import { PLAY_MODE, SEARCH_KEY } from '@/assets/js/constant'

const state = {
  sequenceList: [], // 初始播放列表
  playlist: [], // 实际播放列表
  playing: false, // 是否播放
  playMode: PLAY_MODE.sequence, // 播放形式
  currentIndex: 0, // 当前播放首歌的序号
  fullScreen: false, // 全屏还是收缩的
  favoriteList: [], // 收藏歌曲列表
  searchHistory: storage.get(SEARCH_KEY) || [], // 搜索历史记录
  playHistory: [] // 播放历史记录
}

export default state
