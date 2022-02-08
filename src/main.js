import Vue from 'vue'
import App from './App.vue'
import router from "./router"

Vue.prototype.$api_host = "http://127.0.0.1:8000/"
Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App),
}).$mount('#app')