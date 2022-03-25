// 播放器的初始状态
import { PLAY_MODE } from '@/assets/js/constant'

const state = {
  sequenceList: [], // 初始播放列表
  playlist: [], // 实际播放列表
  playing: false, // 是否播放
  playMode: PLAY_MODE.sequence, // 播放形式
  currentIndex: 0, // 当前播放首歌的序号
  fullScreen: false // 全屏还是收缩的
}

export default state
