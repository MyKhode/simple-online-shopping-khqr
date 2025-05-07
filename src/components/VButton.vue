<script lang="ts" setup>
import LoadingIcon from "~icons/ant-design/loading-outlined";
import { computed } from "vue";

const props = defineProps<{
  loading?: boolean;
  buttonColor?: string;
}>();

// Define button styles
const buttonStyles = {
  blue: "bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80",
  green: "bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80",
  cyan: "bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80",
  teal: "bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-lg shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80",
  red: "bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80",
  pink: "bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-pink-300 dark:focus:ring-pink-800 shadow-lg shadow-pink-500/50 dark:shadow-lg dark:shadow-pink-800/80",
  purple: "bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-purple-800/80"
};

// Compute the button class dynamically
const buttonClass = computed(() =>
  props.buttonColor ? buttonStyles[props.buttonColor as keyof typeof buttonStyles] : buttonStyles.blue
);
</script>

<template>
  <button
    class="mb-4 w-full rounded cursor-pointer py-2 text-sm text-white px-5 md:py-2.5 font-medium shadow-lg focus:ring-4 focus:outline-none text-center"
    :class="buttonClass"
  >
    <slot v-if="!props.loading" />
    <LoadingIcon v-else class="mx-auto h-5 animate-spin" data-cy="loading" />
  </button>
</template>
