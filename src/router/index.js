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
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
