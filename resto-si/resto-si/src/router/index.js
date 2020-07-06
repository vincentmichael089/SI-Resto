import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/PageHome.vue'
import Menu from '../views/PageMenu.vue'
import Recap from '../views/PageRecap.vue'
import Insight from '../views/PageInsight.vue'
import Cashier from '../views/PageCashier.vue'

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
    path: '/insight',
    name: 'Insight',
    component: Insight
  },
  {
    path: '/cashier',
    name: 'Cashier',
    component: Cashier
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  linkExactActiveClass: "active disabled active-menu", // set design of active class (reactive navbar)
})

export default router
