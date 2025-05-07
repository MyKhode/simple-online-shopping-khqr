import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "./stores/auth";
import { pinia } from "./stores";
import { emit } from "process";
import { eventBus } from "@/eventBus";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/signin",
      component: () => import("@/layouts/AuthLayout.vue"),
      meta: { requiresNoAuth: true },
      children: [
        { path: "/signin", name: "signIn", component: () => import("@/views/auth/SignIn.vue") },
        { path: "/signup", name: "signUp", component: () => import("@/views/auth/SignUp.vue") },
        { path: "/forgotpassword", name: "forgotPassword", component: () => import("@/views/auth/ForgotPassword.vue") },
      ],
    },
    {
      path: "/resetpassword",
      component: () => import("@/layouts/AuthLayout.vue"),
      children: [
        {
          path: "/resetpassword",
          name: "resetPassword",
          component: () => import("@/views/auth/ResetPassword.vue"),
          beforeEnter: (to) => {
            if (!to.hash.includes("type=recovery")) {
              const { supabase } = useAuthStore();
              return supabase.auth.user() ? "/" : "/signin";
            }
          },
        },
        {
          path: "/callback",
          name: "callback",
          component: () => import("@/views/auth/AuthCallback.vue"),
          beforeEnter: (to) => {
            const hashParams = Object.fromEntries(new URLSearchParams(to.hash.replace("#", "")));
            const requiredParams = ["access_token", "expires_in", "provider_token", "refresh_token", "token_type"];
            if (!requiredParams.every((key) => key in hashParams)) return "/";
          },
        },
        { path: "/:pathMatch(.*)*", name: "NotFound", component: () => import("@/views/NotFound.vue") },
      ],
    },
    {
      path: "/",
      component: () => import("@/layouts/DashboardLayout.vue"),
      children: [
        { path: "/", name: "home", component: () => import("@/views/HomeView.vue") }, // Public route
        { path: "/profile", name: "profile", component: () => import("@/views/ProfileView.vue"), meta: { requiresAuth: true } },
        { path: "/order-history", name: "order history", component: () => import("@/views/OrderHistory.vue"), meta: { requiresAuth: true } },
        { path: "/top-up", name: "Top Up", component: () => import("@/views/TopUp.vue"), meta: { requiresAuth: false } },
      ],
    },
  ],
});

const { supabase } = useAuthStore(pinia);
supabase.auth.onAuthStateChange((event) => {
  console.log(event);
  eventBus.emit("sign-in", event);
  if (event === "SIGNED_OUT") router.push("/signin");
  if (event === "SIGNED_IN" && router.currentRoute.value.name === "callback") {
    setTimeout(() => router.push({ name: "home" }), 0);
  }
});

router.beforeEach((to) => {
  const { supabase } = useAuthStore();
  if (to.meta.requiresAuth && !supabase.auth.user()) return { path: "/signin" };
  if (to.meta.requiresNoAuth && supabase.auth.user()) return { path: "/" };
});

// router.afterEach((to, from) => {
//   window.scrollTo(0, 0);
// });
// Scroll to top on route change

export default router;
