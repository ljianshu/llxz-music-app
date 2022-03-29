import BScroll from '@better-scroll/core'
import Pullup from '@better-scroll/pull-up'
import { ref, onMounted } from 'vue'

BScroll.use(Pullup)

export default function usePullUpLoad (requestData, preventPullUpLoad) {
  const isPullUpLoad = ref(false)
  const rootRef = ref(null)

  onMounted(() => {
    this.bscroll = new BScroll(rootRef.value, {
      pullUpLoad: true
    })
    this.bscroll.on('pullingUp', this.pullingUpHandler)
  })

  return {
    isPullUpLoad
  }
}

  // data () {
  //   return {
  //     isPullUpLoad: false,
  //     data: 30
  //   }
  // },
  // mounted () {
  //   this.initBscroll()
  // },
  // methods: {
  //   initBscroll () {
  //     this.bscroll = new BScroll(this.$refs.scroll, {
  //       pullUpLoad: true
  //     })

  //     this.bscroll.on('pullingUp', this.pullingUpHandler)
  //   },
  //   async pullingUpHandler () {
  //     this.isPullUpLoad = true

  //     await this.requestData()

  //     this.bscroll.finishPullUp()
  //     this.bscroll.refresh()
  //     this.isPullUpLoad = false
  //   },
  //   async requestData () {
  //     try {
  //       const newData = await this.ajaxGet(/* url */)
  //       this.data += newData
  //     } catch (err) {
  //       // handle err
  //       console.log(err)
  //     }
  //   },
  //   ajaxGet (/* url */) {
  //     return new Promise(resolve => {
  //       setTimeout(() => {
  //         resolve(20)
  //       }, 1000)
  //     })
  //   }
  // }
