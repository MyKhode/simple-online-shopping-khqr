<script lang="ts" setup>
import { useAuthStore } from "@/stores/auth";
const { supabase } = useAuthStore();

const reRoute = computed(() => {
  if (supabase.auth.user())
    return {
      to: "/",
      text: "Home",
    };
  return {
    to: "/signin",
    text: "Sign In",
  };
});
</script>
<template>
  <link rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200">

  <main class="flex items-center justify-center w-full min-h-screen py-8 text-gray-900 page md:py-16 ">
    <div class="relative flex flex-col items-center w-full gap-8 px-8 md:px-18 xl:px-40 md:gap-16">
      <h1 class="text-9xl md:text-[300px] w-full select-none  text-center font-black  text-gray-400">
        404</h1>
      <p class="text-3xl font-bold capitalize">You have discovered a secret place</p>
      <p class="text-2xl font-medium break-words text-dull">Unfortunately, this is only a 404 page. You may have
        mistyped the address, or the page has been moved to another URL.</p>
      <div class="flex flex-col justify-between w-full gap-8 md:flex-row md:gap-32 xl:px-16">
        <router-link to="/"
          class="flex items-center justify-center w-full gap-4 p-3 font-semibold capitalize border-2 border-blue-500 rounded shadow-lg md:w-fit hover:bg-blue-500 md:p-6 focus:outline-none hover:scale-105 active:scale-90 hover:shadow-xl ">
          <span class="rotate-180 material-symbols-outlined">arrow_right_alt</span>
          Go back to Previous Page
        </router-link>
        <a to="/"
          class="rounded flex w-full md:w-fit group items-center gap-4 justify-center border-2 border-green-500 font-semibold hover:bg-green-500 p-3 md:p-6 capitalize focus:outline-none hover:scale-105 active:scale-90 shadow-lg hover:shadow-xl ">
          <span class="material-symbols-outlined">home</span>
          <router-link :to="reRoute.to" class="self-center">Go Back To {{
            reRoute.text
            }} Page</router-link>
        </a>
      </div>
    </div>
  </main>
</template>
