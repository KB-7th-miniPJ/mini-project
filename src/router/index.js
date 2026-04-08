import { createRouter, createWebHistory } from "vue-router";
import Main2 from "@/pages/Main2.vue";
import Expenseslist from "@/pages/Expenseslist.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/expenseslist",
      name: "expenseslist",
      component: Expenseslist,
    },
   { path: "/", redirect: "/travels/11" },
    {
      path: "/travels/:id",
      name: "main2",
      component: Main2,
    },
  ],
});

export default router;
