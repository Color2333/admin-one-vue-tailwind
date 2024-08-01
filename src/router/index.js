import { createRouter, createWebHashHistory } from 'vue-router'
import Style from '@/views/StyleView.vue'
import Home from '@/views/HomeView.vue'

const routes = [
  {
    meta: { title: 'Select style' },
    path: '/',
    name: 'style',
    component: Style
  },
  {
    meta: { title: 'Dashboard' },
    path: '/dashboard',
    name: 'dashboard',
    component: Home
  },
  {
    meta: { title: 'Tables' },
    path: '/tables',
    name: 'tables',
    component: () => import('@/views/TablesView.vue')
  },
  {
    meta: { title: 'Forms' },
    path: '/forms',
    name: 'forms',
    component: () => import('@/views/FormsView.vue')
  },
  {
    meta: { title: 'Profile' },
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/ProfileView.vue')
  },
  {
    meta: { title: 'Ui' },
    path: '/ui',
    name: 'ui',
    component: () => import('@/views/UiView.vue')
  },
  {
    meta: { title: 'Responsive layout' },
    path: '/responsive',
    name: 'responsive',
    component: () => import('@/views/ResponsiveView.vue')
  },
  {
    meta: { title: 'Login' },
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue')
  },
  {
    meta: { title: 'Error' },
    path: '/error',
    name: 'error',
    component: () => import('@/views/ErrorView.vue')
  },
  {
    meta: { title: '10903' },
    path: '/10903',
    name: '10903',
    component: () => import('@/views/10903.vue')
  },
  {
    meta: { title: '10905' },
    path: '/10905',
    name: '10905',
    component: () => import('@/views/10905.vue')
  },
  {
    meta: { title: '气象仪' },
    path: '/observation',
    name: 'observation',
    component: () => import('@/views/WeatherObserver.vue')
  },
  {
    meta: { title: '综合大屏数据' },
    path: '/ObservationDashboard',
    name: 'ObservationDashboard',
    component: () => import('@/views/ObservationDashboard.vue')
  },
  // 添加一个重定向到默认页面
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  }
})

export default router
