import Vue from 'vue'
import Router from 'vue-router'
import chat from '@/components/chat'
import login from '@/components/login'
import addStudentPage from '@/components/addStudentPage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: login
    },
    {
      path: '/chat',
      name: 'chat',
      component: chat
    },
    {
      path: '/addStudentPage',
      name: 'addStudentPage',
      component: addStudentPage
    }
  ]
})
