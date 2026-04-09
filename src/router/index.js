import { createRouter, createWebHistory } from 'vue-router'
import ExpenseMembers from '@/pages/ExpenseMembers.vue'

const routes = [
  {
    path: '/expense/:travelId/members',
    name: 'expensemembers',
    component: ExpenseMembers,
  },
    {
    path: '/',
    redirect: '/expense/1/members', // 임시 합칠때 주석처리
  },
  
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router