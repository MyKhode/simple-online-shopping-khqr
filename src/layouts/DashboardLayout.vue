<script lang="ts" setup>
import { breakpointsTailwind } from "@vueuse/core";
import { ref, watch } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import standardCard from "@/components/StandardCard.vue";
import LoadingScreen from "@/components/LoadingScreen.vue";

const { supabase } = useAuthStore();
const isSignIn = ref(!!supabase.auth.user());

const user = supabase.auth.user();

/* after navigation on small screens, close the nav drawer */
const breakpoints = useBreakpoints(breakpointsTailwind);
const lgAndLarger = breakpoints.greater("lg");
const open = ref(false);
const route = useRoute();
watch(route, () => {
  if (!lgAndLarger.value) open.value = false;
  const layoutId = document.getElementById('layout-scroll-container');
  if (layoutId) {
    layoutId.scrollTop = 0;
  }
});

onMounted(() => {
  open.value = lgAndLarger.value;
});
</script>

<template>
  <!-- 
  <div class="absolute z-50 inset-0 flex items-center justify-center">
    <LoadingScreen v-if="isSignIn" />
  </div> -->

  <div
    class="flex h-full w-full max-w-full transition-colors scroll-smooth overflow-x-hidden scrollbar-hide overflow-y-auto">

    <NavDrawer v-model="open" />
    <div
      class="flex h-full max-h-full max-w-full flex-grow flex-col bg-zinc-100 text-zinc-900 transition-all dark:bg-zinc-900 dark:text-zinc-100"
      :class="{ 'lg:pl-64': open }">
      <AppTopBar v-model="open" />
      <main id="layout-scroll-container"
        class="flex-grow overflow-x-hidden scroll-smooth overflow-auto px-0 lg:px-4 py-2 bg-gradient-to-b md:bg-gradient-to-r md:dark:bg-gradient-to-r dark:bg-gradient-to-t bg-slate-300 dark:from-slate-900 dark:to-slate-700">
        <router-view />
      </main>
      <AppFooter />
      <!-- <div class="absolute "></div> -->
      <!-- <div class="absolute z-0 inset-0 h-full w-full  bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"> </div> -->
    </div>
  </div>
</template>
