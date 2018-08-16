import Vue from 'vue'
import App from './App'
import { request } from './utils/wx'

Vue.config.productionTip = false
App.mpType = 'app'
Vue.prototype.$http = request
const app = new Vue(App)
app.$mount()

export default {
  // 这个字段走 app.json
  config: {
    // 页面前带有 ^ 符号的，会被编译成首页，其他页面可以选填，我们会自动把 webpack entry 里面的入口页面加进去
    pages: [
      'pages/index/main', // 登录页
      '^pages/student/main', // 主页
      'pages/level/main', // 选关页面
      'pages/rank/main', // 排行榜
      'pages/stu-wrongBook/main', // 学生错题集
      'pages/teacher-wrongBook/main', // 教师查看错题集
      'pages/teacher-rank/main', // 教师查看排名
      'pages/answer/main', // 答题界面
      'pages/top10/main' // 排行前十
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#ffcc66',
      navigationBarTitleText: '语文闯关',
      navigationBarTextStyle: 'black'
    }
  }
}
