<script setup lang="ts">
import { ref } from "vue";
import { RouterLink } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import Breadcrumb from "@/components/BreadCrumb.vue"; // Import the Breadcrumb component


const { supabase } = useAuthStore();
const isSignIn = ref(!!supabase.auth.user());

const breadcrumbs = ref([
  { name: "Home", url: "/" },
  { name: "Tokens Top Up", url: "/top-up" },
]);
</script>

<template>
    <div class="w-full h-5 relative">
        <Breadcrumb :breadcrumbs="breadcrumbs" class="absolute top-3 left-0 md:left-3"/>
    </div>
    <div class="relative w-full md:w-[74vw] mx-auto pt-10 md:pt-20 ">


      <h1 class="px-4 md:px-8 mx-auto font-bold text-start text-2xl md:text-3xl lg:text-4xl">
        Tokens Top Up Card
      </h1>
      <p
        class="px-4 md:px-8 text-start text-sm md:text-base lg:text-lg mx-auto mt-3 text-gray-500 dark:text-gray-400"
      >
        Enjoy fast transactions and secure payments with Bakong Bank. You can pay using any bank in Cambodia.
      </p>
      <div
        class="w-full h-px max-w-6xl mx-auto my-3 md:my-4"
        style="
          background-image: linear-gradient(
            90deg,
            rgba(149, 131, 198, 0) 1.46%,
            rgba(149, 131, 198, 0.6) 40.83%,
            rgba(149, 131, 198, 0.3) 65.57%,
            rgba(149, 131, 198, 0) 107.92%
          );
        "
      ></div>
    </div>

<div class="flex w-[90vw] md:w-[70vw] mx-auto items-center p-4 mb-4 text-sm text-yellow-800 border border-yellow-300 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300 dark:border-yellow-800" role="alert">
  <svg class="shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
  </svg>
  <span class="sr-only">Info</span>
  <div>
    <span class="font-medium">Important notice</span> If you encounter any issues with your top-up, please visit our contact page or reach out to our team with your transaction details. We will respond within 24 hours. <a href="https://bio.ikhode.site/" target="_blank" class="underline text-cyan-600">contact</a>
  </div>
</div>

    <section class="w-[90vw] md:w-[70vw] mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <standardCard :title="'Basic'" :price="0.12" :tokens="'480'" class="snap-center" />
        <standardCard :title="'Popular'" :price="0.25" :tokens="'1002'" class="snap-center" />
        <standardCard :title="'Basic'" :price="0.50" :tokens="'2004'" class="snap-center" />
        <standardCard :title="'Basic'" :price="1.00" :tokens="'4009'" class="snap-center" />
        <standardCard :title="'Basic'" :price="2.50" :tokens="'10022'" class="snap-center" />
        <standardCard :title="'Basic'" :price="5.00" :tokens="'20045'" class="snap-center" />
        <standardCard :title="'Premium'" :price="10.00" :tokens="'40090'" class="snap-center" />
    </section>
    
</template>