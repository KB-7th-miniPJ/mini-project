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
    redirect: '/expense/travel1/members', // 임시로 travel1 합칠때 주석처리
  },
  // {
  //   path: '/',
  //   redirect: '/expense/new', // 지출내역경로
  // },

  // 나중에 지출내역 등 추가
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router