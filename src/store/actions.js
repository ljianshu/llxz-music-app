import { PLAY_MODE } from '@/assets/js/constant'

export function selectPlay ({ commit }, { list, index }) {
  console.log('list', list)
  console.log('index', index)
  commit('setPlayMode', PLAY_MODE.sequence)
  commit('setSequenceList', list)
  commit('setPlayingState', true)
  commit('setFullScreen', true)
  commit('setPlaylist', list)
  commit('setCurrentIndex', index)
}
