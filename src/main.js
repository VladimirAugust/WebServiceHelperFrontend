import Vue from 'vue'
import App from './App.vue'
import router from "./router"

Vue.prototype.$api_host = "http://194-67-91-36.cloudvps.regruhosting.ru/"
Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App),
}).$mount('#app')