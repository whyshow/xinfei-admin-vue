import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入 axios
import axios from 'axios'
import {Message} from "element-ui";
//设置请求根路径
//axios.defaults.baseURL = 'http://127.0.0.1:8080/'
axios.defaults.baseURL = 'http://api.ccit.club/'
// axios.defaults.baseURL = 'http://192.168.8.128:9090/'
axios.defaults.headers.common['usertoken'] = localStorage.getItem("usertoken")
axios.defaults.headers.common['username'] = localStorage.getItem("username")

//挂载 axios 全局
Vue.prototype.$http = axios
Vue.config.productionTip = false
router.beforeEach((to,from,next)=>{
  if (to.meta.title){
    document.title = to.meta.title
  }
  next()
})
new Vue({
  router,
  render: function (h) { return h(App) }
}).$mount('#app')
