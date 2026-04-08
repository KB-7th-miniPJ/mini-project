import { createRouter, createWebHistory } from 'vue-router'
import ExpenseMembers from '@/pages/ExpenseMembers.vue'

const routes = [
  {
    path: '/expense/:travelId/members',
    name: 'ExpenseMembers',
    component: ExpenseMembers,
  },
    {
    path: '/',
    redirect: '/expense/travel3/members', // 임시로 travel11로 리다이렉트
  },
  // 나중에 지출내역 등 추가
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router