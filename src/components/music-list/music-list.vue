<template>
  <div class="music-list">
    <div class="back" @click="goBack">
      <i class="icon-back"></i>
    </div>
    <h1 class="title">{{title}}</h1>
    <div class="bg-img" :style="bgImgStyle" ref="bgImg">
      <div class="play-btn-wrapper" :style="playBtnStyle">
        <div class="play-btn" v-show="songs.length>0" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" :style="filterStyle"></div>
    </div>
    <scroll class="list" v-loading="loading"  v-no-result:[noResultText]='noResult' :style="listStyle" :probe-type="3"
      @scroll="onScroll">
      <div class="song-list-wrapper">
        <song-list :songs="songs" @select="selectItem"></song-list>
      </div>
    </scroll>
  </div>
</template>
<script>
import Scroll from '@/components/base/scroll/scroll'
import SongList from '@/components/base/song-list/song-list'
import { mapActions } from 'vuex'

const RESERVED_HEIGHT = 40

export default {
  name: 'music-list',
  components: {
    Scroll,
    SongList
  },
  props: {
    songs: {
      type: Array,
      default: () => []
    },
    pic: {
      type: String,
      default: ''
    },
    title: String,
    loading: Boolean,
    noResultText: {
        type: String,
        default: '抱歉，没有找到可播放的歌曲'
      }
  },
  data() {
    return {
      bgImgHeigth: 0,
      scrollY: 0,
      maxTranslateY: 0
    }
  },
  computed: {
    bgImgStyle() {
        let zIndex = 0
        let paddingTop = '70%'
        let height = 0
        // 这个变量为了处理IOS兼容性问题
        let translateZ = 0
        if (this.scrollY > this.maxTranslateY) {
          // 当歌单滚动距离大于最大可滚动距离时，页面头部就固定住
          zIndex = 10
          height = `${RESERVED_HEIGHT}px`
          paddingTop = 0
          translateZ = 1
        }
        let scale = 1
        if (this.scrollY < 0) {
          scale = 1 + Math.abs(this.scrollY / this.bgImgHeigth)
        }
       return {
         height,
         paddingTop,
         zIndex,
         backgroundImage: `url(${this.pic})`,
         transform: `scale(${scale})translateZ(${translateZ}px)`
       }
    },
    listStyle() {
      return `top:${this.bgImgHeigth}px`
    },
    filterStyle() {
      let blur = 0
      if (this.scrollY >= 0) {
        blur = Math.min(this.maxTranslateY / this.bgImgHeigth, this.scrollY / this.bgImgHeigth) * 20
      }
      return {
        backdropFilter: `blur(${blur}px)`
      }
    },
    playBtnStyle() {
      let display = ''
      if (this.scrollY > this.maxTranslateY) {
        display = 'none'
      }
      return {
        display
      }
    },
    noResult() {
      return !this.loading && !this.songs.length
    }
  },
  mounted() {
    this.bgImgHeigth = this.$refs.bgImg.clientHeight
    this.maxTranslateY = this.bgImgHeigth - RESERVED_HEIGHT
  },
  methods: {
    goBack() {
      this.$router.back()
    },
    random() {
      this.randomPlay(this.songs)
    },
    onScroll(pos) {
      this.scrollY = -pos.y
    },
    selectItem({ song, index }) {
      this.selectPlay({ list: song, index: index })
    },
    ...mapActions(['selectPlay', 'randomPlay'])
  }
}
</script>
<style lang='scss' scoped>
  .music-list{
    height: 100%;
    position: relative;
    .back {
      position: absolute;
      top: 0;
      left: 6px;
      z-index: 20;
      transform: translateZ(2px);
      .icon-back {
        display: block;
        padding: 10px;
        font-size: $font-size-large-x;
        color: $color-theme;
      }
    }
    .title {
      position: absolute;
      top: 0;
      left: 10%;
      width: 80%;
      z-index: 20;
      transform: translateZ(2px);
      @include no-wrap();
      text-align: center;
      line-height: 40px;
      font-size: $font-size-large;
      color: $color-text;
    }
    .bg-img {
      position: relative;
      width: 100%;
      transform-origin: top;
      background-size: cover;
      .play-btn-wrapper {
        position: absolute;
        bottom: 20px;
        z-index: 10;
        width: 100%;
        .play-btn {
          box-sizing: border-box;
          width: 135px;
          padding: 7px 0;
          margin: 0 auto;
          text-align: center;
          border: 1px solid $color-theme;
          color: $color-theme;
          border-radius: 100px;
          font-size: 0;
        }
        .icon-play {
          display: inline-block;
          vertical-align: middle;
          margin-right: 6px;
          font-size: $font-size-medium-x;
        }
        .text {
          display: inline-block;
          vertical-align: middle;
          font-size: $font-size-small;
        }
      }
      .filter {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(7, 17, 27, 0.4);
      }
    }
    .list {
      position: absolute;
      bottom: 0;
      width: 100%;
      z-index: 0;
      .song-list-wrapper {
        padding: 20px 30px;
        background: $color-background;
      }
    }
  }
</style>
