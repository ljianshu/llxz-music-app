import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import lazyPlugin from 'vue3-lazy'
import '@/assets/scss/index.scss'
import loadingDirective from './components/base/loading/directive'
import noResultDirective from './components/base/no-result/directive'

const app = createApp(App)

app.use(store).use(router).use(lazyPlugin, {
  loading: require('@/assets/images/default.png')
}).directive('loading', loadingDirective).directive('no-result', noResultDirective)

app.mount('#app')
