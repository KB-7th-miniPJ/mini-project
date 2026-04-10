import { useAuthStore } from '@/stores/auth';
import { createRouter, createWebHistory } from 'vue-router';
import SignInMain from '../pages/auth/SignInMain.vue';
import SignUp from '../pages/auth/SignUp.vue';
import MainPage from '../pages/Mainpage.vue';
import TravelsNew from '../pages/Travelsnew.vue';
import Main2 from '@/pages/Main2.vue';
import Expenseslist from '@/pages/Expenseslist.vue';
import Settlements from '@/pages/Settlements.vue';
import ExpenseRecord from '@/pages/expenses/ExpenseRecord.vue';
import ExpenseMembers from '@/pages/ExpenseMembers.vue';

const routes = [
  {
    path: '/',
    name: 'Main',
    component: MainPage,
  },
  {
    path: '/travels-new',
    name: 'TravelsNew',
    component: TravelsNew,
  },
  { path: '/signin', name: 'signin', component: SignInMain },
  { path: '/signup', name: 'signup', component: SignUp },
  {
    path: '/travels/:id',
    name: 'main2',
    component: Main2,
  },

  {
    path: '/travels/:id/expenseslist',
    name: 'expenseslist',
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

  { path: '/:pathMatch(.*)*', redirect: { name: 'signin' } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const publicNames = ['signin', 'signup'];
export default router;

// 로그인 검증로직 임의로 추가해봄
// json-server-auth 방식에서 다르게 검증한다면, router.beforeEach 부분 지워도됨
router.beforeEach((to, from) => {
  const authStore = useAuthStore();
  if (!publicNames.includes(to.name) && !authStore.user) {
    return { name: 'signin' };
  }
});
