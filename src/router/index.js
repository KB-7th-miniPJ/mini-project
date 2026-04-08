import Settlements from '@/pages/settlements/Settlements.vue';
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/travels/:travelId/settlement',
    name: 'travel-settlements',
    component: Settlements,
  },
];
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
