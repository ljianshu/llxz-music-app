<template>
  <div class="recommend">
    <div class="slider-wrapper">
      <div class="slider-content">
        <slider :sliders='sliders' v-if="sliders.length"></slider>
      </div>
    </div>
    <div class="recommend-list">
      <h1 class="list-title">热门歌单推荐</h1>
      <ul>
        <li v-for="item in albums" class="item" :key="item.id">
          <div class="icon">
            <img width="60" height="60" v-lazy="item.pic">
          </div>
          <div class="text">
            <h2 class="name">
              {{item.username}}
            </h2>
            <p class="title">
              {{item.title}}
            </p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Slider from '@/components/base/slider/slider'
import { getRecommend } from '@/service/recommend'
export default {
  name: 'Recommend',
  components: {
    Slider
  },
  data() {
    return {
      sliders: [],
      albums: []
    }
  },
  async created() {
    const result = await getRecommend()
    this.sliders = result.sliders
    this.albums = result.albums
  }

}
</script>

<style lang="scss" scoped>
.recommend{
  .recommend-list{
    .list-title{
      height: 65px;
      line-height: 65px;
      text-align: center;
      font-size: $font-size-medium;
      color: $color-theme;
    }
    .item{
      display: flex;
      align-items: center;
      padding: 0 20px 20px 20px;
      box-sizing: border-box;
      .icon{
        flex:0 0 60px;
        padding-right: 20px;
      }
      .text{
        display: flex;
        flex-direction: column;
        justify-content: center;
        font-size: $font-size-medium;
        line-height: 20px;
        flex:1;
        overflow: hidden;
        .name {
            margin-bottom: 10px;
            color: $color-text;
          }
          .title {
            color: $color-text-d;
          }
      }
    }
  }
}
</style>
