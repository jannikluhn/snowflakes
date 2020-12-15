import Vue from 'vue'
import VueRouter from 'vue-router'
import Buefy from 'buefy'

Vue.use(Buefy)
Vue.use(VueRouter)
Vue.config.productionTip = false

import App from './App.vue'
import Main from './Main.vue'
import Detail from './Detail.vue'

Vue.prototype.window = window

const routes = [
  { path: '/', component: Main },
  { path: '/snowflake/:id(0x[0-9a-f]{64})', component: Detail },
]
const router = new VueRouter({
  routes
})

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
