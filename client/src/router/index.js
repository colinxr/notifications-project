import { createRouter, createWebHistory } from "vue-router"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../views/Home.vue"),
    },
    {
      path: "/about",
      name: "about",
      component: () => import("../views/About.vue"),
    },
    {
      path: "/notifications/preview/:id",
      name: "notifications-preview",
      component: () => import("../views/notifications/Preview.vue"),
    },
  ],
})

router.beforeEach((to, from, next) => {
  console.log(to)
  if (to.name !== "home") return next()

  // If userId is not provided, set it to 1
  if (!to.query.userId)
    return next({ ...to, query: { ...to.query, userId: 1 } })

  return next()
})

export default router
