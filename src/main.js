import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import dayjs from 'dayjs'
import '@/elementUI/index'
import '@/assets/global.less'
import '@/vueQuillEditor'

Vue.prototype.$formatDate = dataObj => {
  return dayjs(dataObj).format('YYYY-MM-DD HH:mm:ss')
}

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
