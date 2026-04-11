import { createRouter, createWebHistory } from 'vue-router'
import ExpenseRecord from '@/pages/expenses/ExpenseRecord.vue' 
// import Expensemembers from '@/pages/expenses/Expensemembers.vue'
// import Expenseslist from '@/pages/expenses/Expenseslist.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/expenses/new' },
    {
      path: '/expenses/new',
      name: 'ExpenseRecord',
      component: ExpenseRecord,
    },
    // {
    //   path: '/expensemembers',
    //   name: 'expensemembers',
    //   component: Expensemembers, // 연결 완료
    // },
    // {
    //  // 예림님 파일 생기면 주석 해제
    // {
    //   path: '/travels/:id/expenseslist',
    //   name: 'expenseslist',
    //   component: () => import('@/pages/expenses/Expenseslist.vue'),
    // },
    // },
    // {
    //   path: "/travels/:id",
    //   name: "main2",
    //   component: () => import('@/pages/Main2.vue'),
    // },
  ],
})

export default router