import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import SignInMain from '../pages/auth/SignInMain.vue';
import SignUp from '../pages/auth/SignUp.vue';
import MainPage from '../pages/Mainpage.vue';
import TravelsNew from '../pages/Travelsnew.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'Main', component: MainPage },
    { path: '/travels-new', name: 'TravelsNew', component: TravelsNew },
    { path: '/signin', name: 'signin', component: SignInMain },
    { path: '/signup', name: 'signup', component: SignUp },
    { path: '/:pathMatch(.*)*', redirect: { name: 'signin' } },
  ],
});

const publicNames = ['signin', 'signup'];

router.beforeEach((to) => {
  const authStore = useAuthStore();
  if (!publicNames.includes(to.name) && !authStore.isLoggedIn) {
    return { name: 'signin', query: { fromname: to.name } };
  }
});

export default router;
