import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/planner', name: 'planner', component: () => import('@/views/PlannerView.vue'), meta: { requiresAuth: true } },
    { path: '/login', name: 'login', component: () => import('@/views/LoginView.vue') },
  ],
})

router.beforeEach(async to => {
  const auth = useAuthStore()
  await auth.initOnce()
  if (to.meta.requiresAuth && !auth.user) {
    return { name: 'login', query: { next: to.fullPath } }
  }
})

export default router
