import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import ScheduleView from '@/views/ScheduleView.vue'
import TeamsView from '@/views/TeamsView.vue'
import CawfView from '@/views/CawfView.vue'
import ContactView from '@/views/ContactView.vue'

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/schedule', name: 'Schedule', component: ScheduleView },
  { path: '/teams', name: 'Teams', component: TeamsView },
  { path: '/cawf', name: 'CAWF', component: CawfView },
  { path: '/contact', name: 'Contact', component: ContactView },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/views/AdminView.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/RegistrationView.vue')
  },
  {
    // Shop route: added conditionally below for localhost only
    path: '/register',
    name: 'Register',
    component: () => import('@/views/RegistrationView.vue')
  }
]

// Conditionally add Shop route only when running on localhost
const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
if (isLocalhost) {
  routes.push({
    path: '/shop',
    name: 'Shop',
    component: () => import('@/views/ShopView.vue')
  })
}

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
