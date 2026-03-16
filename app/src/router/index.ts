import { createMemoryHistory, createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

import PresentationView from '../views/PresentationView.vue'
import HomeView from '../views/HomeView.vue'
import PresentationsView from '../views/PresentationsView.vue'

export const appRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/presentations',
    name: 'presentations',
    component: PresentationsView,
  },
  {
    path: '/presentations/:presentationId',
    name: 'presentation',
    component: PresentationView,
  },
]

export const createAppRouter = (useMemoryHistory = false) =>
  createRouter({
    history: useMemoryHistory
      ? createMemoryHistory(import.meta.env.BASE_URL)
      : createWebHistory(import.meta.env.BASE_URL),
    routes: appRoutes,
  })

export const router = createAppRouter()
