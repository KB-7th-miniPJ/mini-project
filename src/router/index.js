import { createRouter, createWebHistory } from 'vue-router';
import SignInMain from '../pages/auth/SignInMain.vue';
import SignUp from '../pages/auth/SignUp.vue';
import TravelBuild from '../pages/auth/TravelBuild.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/signin' },
    { path: '/signin', name: 'signin', component: SignInMain },
    { path: '/signup', name: 'signup', component: SignUp },
    { path: '/travelbuild', name: 'travelbuild', component: TravelBuild },
    { path: '/:pathMatch(.*)*', redirect: '/signin' },
  ],
});

export default router;
