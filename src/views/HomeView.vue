<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import Quickviews from "@/components/Quickviews.vue";
import { getAllProducts } from "@/models/products";

const { supabase } = useAuthStore();
const isSignIn = ref(!!supabase.auth.user());
const user = supabase.auth.user();

// Get products from centralized product config
const products = getAllProducts();

const selectedProductId = ref<number | null>(null);
const showQuickview = ref(false);

const openQuickview = (id: number) => {
  console.log("Opening Quickview for ID:", id);
  selectedProductId.value = id;
  showQuickview.value = true;
};
</script>

<template>
<div class="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
    <h2 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Customers also purchased</h2>
    <div class="mt-6 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        <div 
            v-for="product in products" 
            :key="product.id" 
            @click="openQuickview(product.id)" 
            class="group relative cursor-pointer"
        >
            <img
                :src="product.imageSrc"
                :alt="product.imageAlt"
                class="aspect-square w-full rounded-md bg-gray-200 dark:bg-gray-700 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
            />
            <div class="mt-4 flex justify-between">
                <div>
                    <h3 class="text-sm text-gray-700 dark:text-gray-300">
                        <a :href="product.href">
                            <span aria-hidden="true" class="absolute inset-0" />
                            {{ product.name }}
                        </a>
                    </h3>
                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ product.color || '' }}</p>
                </div>
                <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {{ new Intl.NumberFormat('km-KH', { style: 'currency', currency: 'KHR' }).format(Number(product.price)) }}
                </p>
            </div>
        </div>
    </div>
    <Quickviews :open="showQuickview" :id="selectedProductId" @close="showQuickview = false" />
</div>
</template>