import { PLAY_MODE } from '@/assets/js/constant'
import { shuffle } from '@/assets/js/util'

export function selectPlay ({ commit }, { list, index }) {
  commit('setPlayMode', PLAY_MODE.sequence) // 播放模式
  commit('setSequenceList', list) // 设置最初的播放列表
  commit('setPlayingState', true) // 是否播放
  commit('setFullScreen', true) // 是否全屏
  commit('setPlaylist', list) // 实际播放列表
  commit('setCurrentIndex', index) // 当前歌曲的序号
}

export function randomPlay ({ commit }, { list }) {
  commit('setPlayMode', PLAY_MODE.random)
  commit('setSequenceList', list)
  commit('setPlayingState', true)
  commit('setFullScreen', true)
  commit('setPlaylist', shuffle(list))
  commit('setCurrentIndex', 0) // 播放第一首歌曲
}

export function changeMode ({ commit, state, getters }, mode) {
  // 如果是顺序列表切换到随机播放列表，列表可以要重新洗牌
  if (mode === PLAY_MODE.random) {
    commit('setPlaylist', shuffle(state.sequenceList))
  } else {
    commit('setPlaylist', state.sequenceList)
  }
  // 期望改变歌曲播放模式，不改变播放曲目
  const currentSongId = getters.currentSong.id
  const index = state.playlist.findIndex((song) => {
    return song.id === currentSongId
  })
  commit('setCurrentIndex', index)
  commit('setPlayMode', mode)
}
