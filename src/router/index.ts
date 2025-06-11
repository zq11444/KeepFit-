import component from "element-plus/es/components/tree-select/src/tree-select-option.mjs";
import { createRouter, createWebHistory } from "vue-router";

// 定义路由规则
const routes = [
  {
    path: "/manager",
    children: [
      {
        path: "Manager", // 注意这里去掉了前面的/manager
        name: "Manager",
        component: () => import("@/views/manager/Manager.vue"),
      },
      {
        path: "ManagerUser",
        name: "ManagerUser",
        component: () => import("@/views/manager/ManagerUser.vue"),
      },
      {
        path: "ManagerCoach",
        name: "ManagerCoach",
        component: () => import("@/views/manager/ManagerCoach.vue"),
      },
      {
        path: "ManagerClass",
        name: "ManagerClass",
        component: () => import("@/views/manager/ManagerClass.vue"),
      },
    ],
  },
  {
    path: "/acc",
    children: [
      {
        path: "/",
        name: "login",
        component: () => import("@/views/acc/logreg.vue"),
      },
    ],
  }
];

// 创建路由实例
const router = createRouter({
    history: createWebHistory(), // 使用 HTML5 模式（无 # 号）
    routes, // 传入路由规则
});

// 导出路由
export default router;

// 路由守卫
// import { checkAuth } from '@/utils/auth';
// import { Transition } from "vue";

// router.beforeEach(async (to) => {
//     if (to.meta.requiresAuth) {
//         const { authenticated } = await checkAuth();
//         if (!authenticated) {
//             return {
//                 path: '/account/login',
//                 query: { redirect: to.fullPath }
//             };
//         }
//     }
// });
