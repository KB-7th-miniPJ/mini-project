import { createRouter, createWebHistory } from 'vue-router'
import ExpenseRecord from '@/pages/expenses/ExpenseRecord.vue' 
// import Expensemembers from '@/pages/expenses/Expensemembers.vue'
// import Expenseslist from '@/pages/expenses/Expenseslist.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
    path: '/', // 첫 접속 주소
    redirect: '/expenses/new' // 지출 기록 페이지로 자동 이동
   },
    // 내 페이지: 지출 기록
    {
      path: '/expenses/new', // 혹은 원래 쓰시던 경로
      name: 'ExpenseRecord',
      component: ExpenseRecord,
    },
    // 2. 혜성님 인원 선택 페이지 등록
    // {
    //   path: '/expensemembers',
    //   name: 'Expensemembers',
    //   component: Expensemembers,
    // },
    // // 3. 예림님 지출 목록 페이지 등록
    // {
    //   path: '/expenseslist',
    //   name: 'expenseslist',
    //   component: Expenseslist,
    // },
    // {
    //   path: "/travels/:id",
    //   name: "main2",
    //   component: Main2,
    // },
  ],
})

export default router