import Vue from 'vue'
import App from './App.vue'
import router from '@/router/index.js'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import store from '@/store/index.js'

Vue.use(ElementUI)

import 'normalize.css'
import moment from 'moment'
Vue.prototype.$moment = moment

Vue.config.productionTip = false

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
