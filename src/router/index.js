import { createRouter, createWebHistory } from 'vue-router';
import MainPage from '../pages/Mainpage.vue';
import TravelsNew from '../pages/Travelsnew.vue';

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
  {
    path: '/travels/:id',
    name: 'TravelDetail',
    component: MainPage
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
