import Vue from 'vue'
import VueRouter from 'vue-router'
import Menu from '../views/PageMenu.vue'
import Recap from '../views/PageRecap.vue'
import Home from '../views/PageInsight.vue'
import Cashier from '../views/PageCashier.vue'
import CashierTransactionActive from '../components/CashierTransactionActive.vue'
import CashierTransactionHistory from '../components/CashierTransactionHistory.vue'
import NotFound from '../views/PageNotFound.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/menu',
    name: 'Menu',
    component: Menu
  },
  {
    path: '/recap',
    name: 'Recap',
    component: Recap
  },
  {
    path: '/cashier',
    component: Cashier,
    children: [
      {
        path: '/history',
        name: 'CashierTransactionHistory',
        component: CashierTransactionHistory
      },
      {
        path: '',
        name: 'CashierTransactionActive',
        component: CashierTransactionActive
      },
    ]
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

export default router
