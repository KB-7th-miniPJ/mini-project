import { createRouter, createWebHistory } from "vue-router"
import Main2        from "@/pages/Main2.vue"
import Expenseslist from "@/pages/Expenseslist.vue"

const router = createRouter({
  history: createWebHistory(),
  routes: [

    { path: "/", redirect: "/travels/1" },

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
  ],
})

export default router