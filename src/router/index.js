import { useAuthStore } from '@/stores/auth';
import { createRouter, createWebHistory } from 'vue-router';
import SignInMain from '../pages/auth/SignInMain.vue';
import SignUp from '../pages/auth/SignUp.vue';
import MainPage from '../pages/Mainpage.vue';
import TravelsNew from '../pages/Travelsnew.vue';
import Main2        from "@/pages/Main2.vue"
import Expenseslist from "@/pages/Expenseslist.vue"
import Settlements from '@/pages/Settlements.vue';
import ExpenseRecord from '@/pages/expenses/ExpenseRecord.vue' 
import ExpenseMembers from '@/pages/ExpenseMembers.vue'

const routes = [
  {
    path: '/',
    name: 'Main',
    component: MainPage
  },
  {
    path: '/travels-new',
    name: 'TravelsNew',
    component: TravelsNew
  },
  // {
  //   path: '/travels/:id',
  //   name: 'TravelDetail',
  //   component: MainPage
  // },
  { path: '/signin', name: 'signin', component: SignInMain },
  { path: '/signup', name: 'signup', component: SignUp },
   {
      path: "/travels/:id",
      name: "main2",
      component: Main2,
    },

    {
      path: "/travels/:id/expenseslist",
      name: "expenseslist",
      component: Expenseslist,
    },
    {
    path: '/travels/:travelId/settlement',
    name: 'travel-settlements',
    component: Settlements,
  },    
  {
      path: '/expenses/new',
      name: 'ExpenseRecord',
      component: ExpenseRecord,
    },  
      {
    path: '/expense/:travelId/members',
    name: 'expensemembers',
    component: ExpenseMembers,
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



      { path: '/:pathMatch(.*)*', redirect: { name: 'signin' } },
];

const router = createRouter({
  history: createWebHistory(),
  routes 
});

const publicNames = ['signin', 'signup'];
export default router;


// const router = createRouter({
//   history: createWebHistory(import.meta.env.BASE_URL),
//   routes: [
//     { path: '/main', name: 'Main', component: MainPage },
//     { path: '/travels-new', name: 'TravelsNew', component: TravelsNew },
//     { path: '/signin', name: 'signin', component: SignInMain },
//     { path: '/signup', name: 'signup', component: SignUp },
//     { path: '/:pathMatch(.*)*', redirect: { name: 'signin' } },
//   ],
// });

// const routes = [
//   {
//     path: '/',
//     name: 'Main',
//     component: MainPage
//   },
//   {
//     path: '/travels-new',
//     name: 'TravelsNew',
//     component: TravelsNew
//   },
//   {
//     path: '/travels/:id',
//     name: 'TravelDetail',
//     component: MainPage
//   },
//   { path: '/signin', name: 'signin', component: SignInMain },
//   { path: '/signup', name: 'signup', component: SignUp },
//   { path: '/:pathMatch(.*)*', redirect: { name: 'signin' } },
// ];


// router.beforeEach((to) => {
//   const authStore = useAuthStore();
//   if (!publicNames.includes(to.name) && !authStore.isLoggedIn) {
//     return { name: 'signin', query: { fromname: to.name } };
//   }
// });


