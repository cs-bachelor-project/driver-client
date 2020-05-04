import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  { path: '/', name: 'index', component: () => import('../components/index.vue'), meta: { requiresAuth: true }, },

  { path: '/login', name: 'login', component: () => import('../components/auth/login.vue'), meta: { requiresVisitor: true }, },

  { path: '/settings', name: 'settings', component: () => import('../components/auth/settings.vue'), meta: { requiresAuth: true }, },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  let loggedIn = new Vue().isLoggedIn()

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!loggedIn) {
      next({
        name: 'login',
      })
    } else {
      next()
    }
  } else if (to.matched.some(record => record.meta.requiresVisitor)) {
    if (loggedIn) {
      next({
        name: 'index',
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
