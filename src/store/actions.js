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

export function randomPlay ({ commit }, list) {
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

export function addSong ({ commit, state }, song) {
  // 添加一首歌，并且播放
  const playlist = state.playlist.slice()
  const sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex

  const playIndex = findIndex(playlist, song)

  if (playIndex > -1) {
    // 找得到歌曲
    currentIndex = playIndex
  } else {
    // 找不到歌曲
    sequenceList.push(song)
    currentIndex = playIndex.length - 1
  }

  const sequenceIndex = findIndex(sequenceList, song)
  if (sequenceIndex === -1) {
    sequenceList.push(song)
  }

  commit('setSequenceList', sequenceList)
  commit('setPlaylist', playlist)
  commit('setCurrentIndex', currentIndex)
  commit('setPlayingState', true)
  commit('setFullScreen', true)
}

function findIndex (list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

export function removeSong ({ commit, state }, song) {
  const playlist = state.playlist.slice()
  const sequenceList = state.sequenceList.slice()

  const sequenceIndex = findIndex(sequenceList, song)
  const playIndex = findIndex(playlist, song)

  if (sequenceIndex < 0 || playIndex < 0) {
    return
  }
  playlist.splice(playIndex, 1)
  sequenceList.splice(playIndex, 1)

  // state的修改只能通过mutation，不然会报错
  commit('setSequenceList', sequenceList)
  commit('setPlaylist', playlist)
  // 删除前面歌曲，currentIndex会发生变化，播放歌曲也就发生变化
  // 删除最后一首歌也会出错，因为currentIndex不会变
  let currentIndex = state.currentIndex
  if (playIndex < currentIndex || currentIndex === playlist.length) {
    currentIndex--
  }
  commit('setCurrentIndex', currentIndex)
  if (!playlist.length) {
    commit('setPlayingState', false)
  }
}

export function clearSongList ({ commit }) {
  commit('setSequenceList', [])
  commit('setPlaylist', [])
  commit('setCurrentIndex', 0)
  commit('setPlayingState', false)
}
