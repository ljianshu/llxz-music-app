<template>
  <div class="player">
    <div class="normal-player" v-if="fullScreen">
      <div class="background">
        <img :src="currentSong.pic" >
      </div>
      <div class="top">
        <div class="back" @click="goBack">
          <i class="icon-back"></i>
        </div>
        <h1 class="title">{{currentSong.name}}</h1>
        <h2 class="subtitle">{{currentSong.singer}}</h2>
      </div>
      <div class="bottom">
        <div class="progress-wrapper">
          <div class="time time-l">{{formatTime(currentTime)}}</div>
          <div class="progress-bar-wrapper">
              <progress-bar
                ref="barRef"
                :progress="progress"
                @progress-changing="onProgressChanging"
                @progress-changed="onProgressChanged"
              ></progress-bar>
            </div>
          <span class="time time-r">{{formatTime(currentSong.duration)}}</span>
        </div>
        <div class="operators">
          <div class="icon i-left">
            <i @click="changeMode" :class="modeIcon"></i>
          </div>
          <div class="icon i-left" :class="disableCls">
            <i @click="prev" class="icon-prev"></i>
          </div>
          <div class="icon i-center" :class="disableCls">
            <i @click="togglePlay" :class="playIcon"></i>
          </div>
          <div class="icon i-right" :class="disableCls">
            <i @click="next" class="icon-next"></i>
          </div>
          <div class="icon i-right">
            <i @click="toggleFavorite(currentSong)" :class="getFavoriteIcon(currentSong)"></i>
          </div>
        </div>
      </div>
    </div>
    <audio ref="audioRef" @pause="pause" @canplay="ready" @error="error" @timeupdate="updateTime" @ended="end"></audio>
  </div>
</template>

<script>
import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'
import useMode from './use-mode'
import useFavorite from './use-favorite'
import ProgressBar from './progress-bar'
import { formatTime } from '@/assets/js/util'
import { PLAY_MODE } from '@/assets/js/constant'
export default {
  name: 'player',
  components: {
    ProgressBar
  },
  setup() {
      // data
     const audioRef = ref(null)
     const songReady = ref(false)
     const currentTime = ref(0) // 歌曲播放时间
     let progressChanging = false

     // vuex
    const store = useStore()
    const playlist = computed(() => store.state.playlist)
    const currentIndex = computed(() => store.state.currentIndex)
    const fullScreen = computed(() => store.state.fullScreen)
    const currentSong = computed(() => store.getters.currentSong)
    const playing = computed(() => store.state.playing)
    const playMode = computed(() => store.state.playMode)

    // hooks
    const { modeIcon, changeMode } = useMode()
    const { getFavoriteIcon, toggleFavorite } = useFavorite()

    // computed
    const disableCls = computed(() => {
      return songReady.value ? '' : 'disable'
    })
    const playIcon = computed(() => {
      return playing.value ? 'icon-pause' : 'icon-play'
    })
    const progress = computed(() => {
      return currentTime.value / currentSong.value.duration
    })

    // watch
    watch(currentSong, (newSong) => {
      // 点击歌单时，歌曲会播放，与此同时当前歌曲发生变化
      if (!newSong.id || !newSong.url) {
        return
      }
      currentTime.value = 0
      songReady.value = false
      const audioEl = audioRef.value
      audioEl.src = newSong.url
      audioEl.play()
    })
    watch(playing, (newPlaying) => {
      if (!songReady.value) {
        return
      }
       const audioEl = audioRef.value
       newPlaying ? audioEl.play() : audioEl.pause()
    })

    // methods

    // 歌曲播放结束时,根据播放模式，选择进入下一首歌曲
    function end() {
      currentTime.value = 0
      if (playMode.value === PLAY_MODE.loop) {
        loop()
      } else {
        next()
      }
    }
    function onProgressChanging(progress) {
      // 这个触发多次
      progressChanging = true
      currentTime.value = currentSong.value.duration * progress
    }
    function onProgressChanged(progress) {
       // 这个只触发一次 真实修改
       progressChanging = false
      audioRef.value.currentTime = currentTime.value = currentSong.value.duration * progress

      if (!playing.value) {
          store.commit('setPlayingState', true)
        }
    }
    function updateTime(e) {
      if (!progressChanging) {
        currentTime.value = e.target.currentTime
      }
    }

    function prev() {
      const list = playlist.value
      if (!songReady.value || !list.length) {
        return
      }
      if (list.length === 1) {
        loop()
      } else {
        let index = currentIndex.value - 1
        if (index === -1) {
           // 如果当前是第一首歌，往前一首就是歌曲最后一首
          index = list.length - 1
        }
        store.commit('setCurrentIndex', index)
        // 点击这个前一首歌按钮，如果是暂停状态，也要让其播放
        if (!playing.value) {
          store.commit('setPlayingState', true)
        }
      }
    }

    function next() {
      const list = playlist.value
      if (!songReady.value || !list.length) {
        return
      }
      if (list.length === 1) {
        loop()
      } else {
        let index = currentIndex.value + 1
        // 如果当前是最后一首歌，往后一首就是歌曲第一首歌
        if (index === list.length) {
          index = 0
        }
        store.commit('setCurrentIndex', index)
        if (!playing.value) {
          store.commit('setPlayingState', true)
        }
      }
    }
    function loop() {
      const audioEl = audioRef.value
      audioEl.currentTime = 0
      audioEl.play()
      store.commit('setPlayingState', true)
    }
    function togglePlay() {
       if (!songReady.value) {
          return
        }
      store.commit('setPlayingState', !playing.value)
      // 虽然修改了playing的状态值，但是audioEl的状态并没有改动过来,于是监听playing
    }
    function pause() {
      // 电脑处于待机状态时
      store.commit('setPlayingState', false)
    }
    function ready() {
      if (songReady.value) {
        return
      }
      songReady.value = true
    }
    function error() {
      songReady.value = true
    }
    function goBack() {
      store.commit('setFullScreen', false)
    }
    return {
      goBack,
      audioRef,
      fullScreen,
      currentSong,
      changeMode,
      prev,
      togglePlay,
      next,
      toggleFavorite,
      playIcon,
      pause,
      playlist,
      currentIndex,
      ready,
      error,
      disableCls,
      modeIcon,
      getFavoriteIcon,
      progress,
      formatTime,
      updateTime,
      onProgressChanging,
      onProgressChanged,
      currentTime,
      end,
      playMode,
      PLAY_MODE
    }
  }
}

</script>
<style scoped lang='scss'>
  .player{
    .normal-player{
      position: fixed;
      left: 0;
      right: 0;
      top:0;
      bottom: 0;
      z-index: 150;
      background: $color-background;
      .background {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        opacity: 0.6;
        filter: blur(20px);
        img {
          width: 100%;
          height: 100%;
        }
      }
      .top {
        position: relative;
        margin-bottom: 25px;
        .back {
          position: absolute;
          top: 0;
          left: 6px;
          z-index: 50;
        }
        .icon-back {
          display: block;
          padding: 9px;
          font-size: $font-size-large-x;
          color: $color-theme;
          transform: rotate(-90deg);
        }
        .title {
          width: 70%;
          margin: 0 auto;
          line-height: 40px;
          text-align: center;
          @include no-wrap();
          font-size: $font-size-large;
          color: $color-text;
        }
        .subtitle {
          line-height: 20px;
          text-align: center;
          font-size: $font-size-medium;
          color: $color-text;
        }
      }
      .bottom {
        position: absolute;
        bottom: 50px;
        width: 100%;
        .progress-wrapper {
          display: flex;
          align-items: center;
          width: 80%;
          margin: 0px auto;
          padding: 10px 0;
          .time {
            color: $color-text;
            font-size: $font-size-small;
            flex: 0 0 40px;
            line-height: 30px;
            width: 40px;
            &.time-l {
              text-align: left;
            }
            &.time-r {
              text-align: right;
            }
          }
          .progress-bar-wrapper {
            flex: 1;
          }
        }
        .operators {
          display: flex;
          align-items: center;
          .icon {
            flex: 1;
            color: $color-theme;
            &.disable {
              color: $color-theme-d;
            }
            i {
              font-size: 30px;
            }
          }
          .i-left {
            text-align: right;
          }
          .i-center {
            padding: 0 20px;
            text-align: center;
            i {
              font-size: 40px;
            }
          }
          .i-right {
            text-align: left
          }
          .icon-favorite {
            color: $color-sub-theme;
          }
        }
      }
    }
  }
</style>
