import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import Menu from '../views/PageMenu.vue'
import Recap from '../views/PageRecap.vue'
import Home from '../views/PageInsight.vue'
import Cashier from '../views/PageCashier.vue'
import NotFound from '../views/PageNotFound.vue'
import Landing from '../views/PageHome.vue'
import Login from '../views/PageLogin.vue'
import Register from '../views/PageRegister.vue'
import CashierTransactionActive from '../components/CashierTransactionActive.vue'
import CashierTransactionHistory from '../components/CashierTransactionHistory.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Landing',
    component: Landing
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresGuest: true }
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: '/menu',
    name: 'Menu',
    component: Menu,
    meta: { requiresAuth: true },
  },
  {
    path: '/recap',
    name: 'Recap',
    component: Recap,
    meta: { requiresAuth: true },
  },
  {
    path: '/cashier',
    component: Cashier,
    children: [
      {
        path: '/history',
        name: 'CashierTransactionHistory',
        component: CashierTransactionHistory,
        meta: { requiresAuth: true },
      },
      {
        path: '',
        name: 'CashierTransactionActive',
        component: CashierTransactionActive,
        meta: { requiresAuth: true },
      },
    ]
  },
  {
    path: '/logout',
    name: 'Logout',
    meta: { requiresAuth: true },
    beforeEnter (to, from, next) {
      store.dispatch('auth/signOut')
      .then(() => next({name: 'Home'}))
    }
  },
  {
    path: '*',
    name: 'NotFound',
    component: NotFound
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  linkExactActiveClass: "active disabled active-menu", // set design of active class (reactive navbar)
})

router.beforeEach((to, from, next) => {
  store.dispatch('auth/initAuthentication')
  .then(user => {
    if (to.matched.some(route => route.meta.requiresAuth)) { // if the routes has meta of requiresAuth
      // protected route
      if (user) {
        next()
      } else {
        next({name: 'Login', query: {redirectTo: to.path}}) // redirect to sign in page when user tries to do auth required access
      }
    } else if (to.matched.some(route => route.meta.requiresGuest)) { // if the routes has meta of requiresGuest
      // protected route
      if (!user) { // proceed only if no auth user exist
        next()
      } else {
        next({name: 'Home'}) // navigate to home when user exist
      }
    } else { // if the routes doesnt require meta of requiresAuth, just navigate
      next()
    }
  })
})

export default router
