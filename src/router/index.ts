import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/planer', name: 'planer', component: () => import('@/views/PlanerView.vue'), meta: { requiresAuth: true } },
    { path: '/strains', name: 'strains', component: () => import('@/views/StrainsView.vue'), meta: { requiresAuth: true } },
    { path: '/login', name: 'login', component: () => import('@/views/LoginView.vue') },
  ],
})

let authReady: Promise<void> | null = null

router.beforeEach(async to => {
  const auth = useAuthStore()

  if (!auth.ready) {
    // Warte genau einmal auf den ersten Auth-Callback
    authReady ||= new Promise<void>(resolve => {
      const int = setInterval(() => {
        if (auth.ready) {
          clearInterval(int)
          resolve()
        }
      }, 20)
    })
    await authReady
  }

  if (to.meta.requiresAuth && !auth.user) {
    return { name: 'login', query: { next: to.fullPath } }
  }
})

export default router
