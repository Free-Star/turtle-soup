import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Game from '../views/Game.vue'
import Create from '../views/Create.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/game/:id',
      name: 'Game',
      component: Game
    },
    {
      path: '/create',
      name: 'Create',
      component: Create
    },
    {
      path: '/rules',
      name: 'Rules',
      component: () => import('../views/RulesView.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.name === 'Game' && to.params.id === 'undefined') {
    next('/')
  } else {
    next()
  }
})

export default router 