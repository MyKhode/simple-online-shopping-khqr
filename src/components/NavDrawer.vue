<template>
  <!-- background blur on smaller screens -->
  <transition enter-from-class="opacity-0" leave-to-class="opacity-0">
    <div
      class="absolute z-40 h-full w-full backdrop-blur-sm backdrop-filter transition-opacity lg:hidden"
      v-if="modelValue"
    ></div>
  </transition>

  <!-- nav drawer -->
  <transition
    enter-from-class="-translate-x-full"
    leave-to-class="-translate-x-full"
  >
    <div
      v-if="modelValue"
      ref="navContainer"
      class="bg-gradient-to-b from-slate-200 via-slate-400 to-slate-500 dark:bg-gradient-to-b dark:from-slate-600 dark:via-slate-800 dark:to-slate-900 fixed z-60 flex h-full max-h-full w-64 flex-col justify-between divide-y overflow-y-auto shadow-lg transition-transform dark:shadow-none"
    >
      <nav class="py-2 text-slate-900 dark:text-slate-50 font-bold">
        <router-link to="/" class="flex items-center rounded p-2 hover:bg-slate-200 dark:hover:bg-slate-600 duration-500 text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-slate-500">
          <img src="/favicon-32x32.png" class="absolute h-8 w-8" />
          
          <span class="ml-10"><span class="text-yellow-500">R</span><span class="text-cyan-500">D</span> / IKHODE AI STUDIO</span>
          <!-- <i-simple-icons-vuedotjs class="ml-2 h-4 w-4" />
          <i-simple-icons-supabase class="ml-2 h-4 w-4" /> -->
        </router-link>
      </nav>

      <nav class="flex flex-shrink-0 flex-grow flex-col space-y-2 py-2 text-gray-900 dark:text-slate-400">
        <router-link
          v-for="{ text, to, icon } in navLinks"
          v-wave
          class="flex items-center rounded p-2 hover:bg-slate-200/70 dark:hover:bg-slate-600/60 duration-500 text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-slate-500"
          exact-active-class="rounded-md text-gray-900 dark:text-white bg-gradient-to-r from-gray-400 to-gray-200 dark:from-slate-300 dark:to-slate-500"
          :to="to"
        >
          <span class="iconify mr-2 h-4 w-4" :data-icon="icon"></span>
          <span>{{ text }}</span>
        </router-link>
      </nav>

      <nav class="py-2" v-if="isSignIn">
        <button @click="signOut" class="flex items-center cursor-pointer rounded p-2 hover:bg-slate-200/20 dark:hover:bg-slate-600/20 duration-500 text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-slate-500 w-full text-slate-50">
          <i-carbon-logout class="mr-2 h-4 w-4" />
          Sign Out
        </button>
      </nav>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { breakpointsTailwind } from "@vueuse/core";
import { supabase } from "@/services/supabase";
import { eventBus } from "@/eventBus";

const isSignIn = ref(!!supabase.auth.user());

defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

/* close the nav whenever clicked outside on small screens */
const breakpoints = useBreakpoints(breakpointsTailwind);
const lgAndLarger = breakpoints.greater("lg");
const navContainer = ref(null);
onClickOutside(navContainer, () => {
  if (!lgAndLarger.value) emit("update:modelValue", false);
});

/* main navigation links for side drawer */
const navLinks = [
  {
    text: "Home",
    to: "/",
    icon: "fluent-color:home-32",
  },
  {
    text: "All Applications",
    to: "/app",
    icon: "fluent-color:diversity-16",
  },
  {
    text: "Ai Voice Changer",
    to: "/app/voice-ai-changer",
    icon: "ri:voice-ai-line",
  },
  {
    text: "Token Top Up",
    to: "/top-up",
    icon: "mingcute:binance-coin-bnb-fill",
  },
  {
    text: "User's Profile",
    to: "/profile",
    icon: "fluent-color:person-available-24",
  },
  {
    text: "Order History",
    to: "/order-history",
    icon: "fa6-solid:file-invoice-dollar",
  },
];

onMounted(() => {
  eventBus.on("sign-in", () => {
    isSignIn.value = true;
  });
  eventBus.on("sign-out", () => {
    isSignIn.value = false;
  });
});

async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) alert(error.message);
}
</script>

<!-- <style scoped>
@reference "tailwindcss";

.nav-button {
  @apply flex items-center rounded p-2 hover:bg-lime-100 dark:hover:bg-slate-600 duration-500 text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-slate-500;
}
</style> -->
