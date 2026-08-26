import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/guild/:id',
      name: 'guild-overview',
      component: () => import('../views/GuildOverviewView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/guild/:id/settings',
      name: 'guild-settings',
      component: () => import('../views/GuildSettingsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/guild/:id/modlog',
      name: 'guild-modlog',
      component: () => import('../views/ModlogView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/guild/:id/commands',
      name: 'guild-commands',
      component: () => import('../views/CommandsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/guild/:id/polls-tickets',
      name: 'guild-polls-tickets',
      component: () => import('../views/PollsTicketsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/leaderboard/:id',
      name: 'leaderboard',
      component: () => import('../views/LeaderboardView.vue'),
    },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.user) {
    return { name: 'home' }
  }
})

export default router
