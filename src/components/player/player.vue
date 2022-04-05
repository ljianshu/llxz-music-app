<template>
  <div class="player" v-show="playlist.length">
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
      <div class="middle" @touchstart.prevent="onMiddleTouchStart" @touchmove.prevent="onMiddleTouchMove" @touchend.prevent="onMiddleTouchEnd">
        <!-- 歌曲CD旋转 -->
        <div class="middle-l" :style="middleLStyle">
          <div ref="cdWrapperRef" class="cd-wrapper">
            <div class="cd" ref="cdRef">
              <img ref="cdImageRef" class="image" :class="cdCls" :src="currentSong.pic">
            </div>
          </div>
          <div class="playing-lyric-wrapper">
            <div class="playing-lyric">{{playingLyric}}</div>
          </div>
        </div>
        <!-- 歌词列表 -->
        <scroll class="middle-r" ref="lyricScrollRef" :style="middleRStyle">
          <div class="lyric-wrapper">
            <!-- currentLyric为歌曲的所有歌词 -->
            <div ref="lyricListRef" v-if="currentLyric">
              <p class="text" :class="{'current': currentLineNum === index}" v-for="(line,index) in currentLyric.lines" :key="line.num">
                {{line.txt}}
              </p>
            </div>
            <div class="pure-music" v-show="pureMusicLyric">
              <p>{{pureMusicLyric}}</p>
            </div>
          </div>
        </scroll>
      </div>
      <div class="bottom">
        <div class="dot-wrapper">
          <span class="dot" :class="{'active':currentShow==='cd'}"></span>
          <span class="dot" :class="{'active':currentShow==='lyric'}"></span>
        </div>
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
    <mini-player :progress="progress" :toggle-play="togglePlay"></mini-player>
    <audio ref="audioRef" @pause="pause" @canplay="ready" @error="error" @timeupdate="updateTime" @ended="end"></audio>
  </div>
</template>

<script>
import { computed, ref, watch, nextTick } from 'vue'
import { useStore } from 'vuex'
import useMode from './use-mode'
import useCd from './use-cd'
import useLyric from './use-lyric'
import useMiddleInteractive from './use-middle-interactive.js'
import useFavorite from './use-favorite'
import ProgressBar from './progress-bar'
import { formatTime } from '@/assets/js/util'
import { PLAY_MODE } from '@/assets/js/constant'
import Scroll from '@/components/base/scroll/scroll'
import MiniPlayer from '@/components/player/mini-player'
export default {
  name: 'player',
  components: {
    ProgressBar,
    Scroll,
    MiniPlayer
  },
  setup() {
      // data
     const audioRef = ref(null)
     const songReady = ref(false)
     const currentTime = ref(0) // 歌曲播放时间
     let progressChanging = false
     const barRef = ref(null)

     // vuex
    const store = useStore()
    const playlist = computed(() => store.state.playlist)
    const currentIndex = computed(() => store.state.currentIndex)
    const fullScreen = computed(() => store.state.fullScreen)
    const currentSong = computed(() => store.getters.currentSong)
    const playing = computed(() => store.state.playing)
    const playMode = computed(() => store.state.playMode)

    // hooks
    const { cdCls, cdRef, cdImageRef } = useCd()
    const { modeIcon, changeMode } = useMode()
    const { getFavoriteIcon, toggleFavorite } = useFavorite()
    const {
 currentLyric, currentLineNum, playLyric, playingLyric, lyricScrollRef,
    lyricListRef, stopLyric, pureMusicLyric
} = useLyric({ songReady, currentTime })
   const { currentShow, middleLStyle, middleRStyle, onMiddleTouchStart, onMiddleTouchMove, onMiddleTouchEnd } = useMiddleInteractive()
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
       if (newPlaying) {
          audioEl.play()
          playLyric()
        } else {
          stopLyric()
          audioEl.pause()
        }
    })
    // 当歌曲页面全屏时，重新计算进度条
    watch(fullScreen, async(newFullScreen) => {
      if (newFullScreen) {
        await nextTick()
      // 因为setOffset有用到dom的API，必须要在dom更新后，才触发方法
      barRef.value.setOffset(progress.value)
      }
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
      playLyric()
      stopLyric()
    }
    function onProgressChanged(progress) {
      // 这个只触发一次 真实修改
      progressChanging = false
      audioRef.value.currentTime = currentTime.value = currentSong.value.duration * progress
      if (!playing.value) {
        store.commit('setPlayingState', true)
      }
      playLyric()
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
      // 触发歌词实时跟随，这样保证歌曲和歌词同步
      playLyric()
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
      PLAY_MODE,
      cdCls,
      cdImageRef,
      cdRef,
      currentLyric,
      currentLineNum,
      playingLyric,
      barRef,
      lyricScrollRef,
      lyricListRef,
      pureMusicLyric,
      currentShow,
      middleLStyle,
      middleRStyle,
      onMiddleTouchStart,
      onMiddleTouchMove,
      onMiddleTouchEnd
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
      .middle {
        position: fixed;
        width: 100%;
        top: 80px;
        bottom: 170px;
        white-space: nowrap;
        font-size: 0;
        .middle-l {
          display: none;
          vertical-align: top;
          position: relative;
          width: 100%;
          height: 0;
          padding-top: 80%;
          .cd-wrapper {
            position: absolute;
            left: 10%;
            top: 0;
            width: 80%;
            box-sizing: border-box;
            height: 100%;
            .cd {
              width: 100%;
              height: 100%;
              border-radius: 50%;
              img {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                box-sizing: border-box;
                border-radius: 50%;
                border: 10px solid rgba(255, 255, 255, 0.1);
              }
              .playing {
                animation: rotate 20s linear infinite
              }
            }
          }
          .playing-lyric-wrapper {
            width: 80%;
            margin: 30px auto 0 auto;
            overflow: hidden;
            text-align: center;
            .playing-lyric {
              height: 20px;
              line-height: 20px;
              font-size: $font-size-medium;
              color: $color-text-l;
            }
          }
        }
        .middle-r {
          display: inline-block;
          vertical-align: top;
          width: 100%;
          height: 100%;
          overflow: hidden;
          .lyric-wrapper {
            width: 80%;
            margin: 0 auto;
            overflow: hidden;
            text-align: center;
            .text {
              line-height: 32px;
              color: $color-text-l;
              font-size: $font-size-medium;
              &.current {
                color: $color-text;
              }
            }
            .pure-music {
              padding-top: 50%;
              line-height: 32px;
              color: $color-text-l;
              font-size: $font-size-medium;
            }
          }
        }
      }
      .bottom {
        position: absolute;
        bottom: 50px;
        width: 100%;
        .dot-wrapper {
          text-align: center;
          font-size: 0;
          .dot {
            display: inline-block;
            vertical-align: middle;
            margin: 0 4px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: $color-text-l;
            &.active {
              width: 20px;
              border-radius: 5px;
              background: $color-text-ll;
            }
          }
        }
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
