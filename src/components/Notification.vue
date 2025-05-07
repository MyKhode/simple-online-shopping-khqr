<script setup>
import { ref, onMounted, watch } from "vue";

const props = defineProps({
  value: {
    type: String,
    required: true,
  },
  typeNotification: {
    type: String,
    required: true,
  },
  isNotificational: {
    type: Boolean,
    required: false,
  },
});

const audio = ref(null);
const isAudioAllowed = ref(false); // Track if user interacted

const isNotificational = ref(props.isNotificational);
watch(props, () => {
  isNotificational.value = props.isNotificational;
})

const initAudio = () => {
  if (!audio.value) {
    audio.value = new Audio("/audio/notification.wav");
    audio.value.load();
  }
};

const playAudio = () => {
  if (isAudioAllowed.value && audio.value) {
    audio.value.currentTime = 0; // Reset for repeated notifications
    audio.value.play().catch((error) => {
      console.error("Audio play failed:", error);
    });
  }
};

onMounted(() => {
  initAudio();

  // Wait for user interaction (e.g., click anywhere on the page)
  document.addEventListener("click", () => {
    isAudioAllowed.value = true;
    if(!props.isNotificational) playAudio();
  }, { once: true }); // Run only once after first interaction
});

watch(props, () => {
  if(!props.isNotificational) playAudio();
});
</script>

<template>
  <div id="toast-success"
    class="fixed flex lg:right-10 lg:top-20 right-2 top-2 z-30 dark:text-gray-400 dark:bg-gray-800 mb-4 w-full max-w-xs items-center rounded-lg bg-white p-4 text-gray-500 shadow"
    role="alert">
    <!-- success notification -->
    <div v-if="props.typeNotification === 'success'" 
      class="animate-pulse dark:bg-green-800 dark:text-green-200 inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500">
      <span class="iconify" data-icon="fluent-color:heart-48"></span>
      <span class="sr-only">Check icon</span>
    </div>
    <div v-else-if="props.typeNotification === 'warning'"
      class="animate-pulse dark:bg-yellow-800 dark:text-yellow-200 inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-yellow-100 text-yellow-500">
      <span class="iconify" data-icon="fluent-color:warning-32"></span>
      <span class="sr-only">Warning icon</span>
    </div>
    <div v-else-if="props.typeNotification === 'happy'"
      class="animate-pulse bg-slate-200 dark:bg-gray-500 dark:text-yellow-200 inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-yellow-500">
      <span class="iconify" data-icon="fa-regular:face-smile"></span>
      <span class="sr-only">Happy icon</span>
    </div>
    <div v-else-if="props.typeNotification === 'error'"
      class="animate-pulse dark:bg-red-800 dark:text-red-200 inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500">
      <span class="iconify" data-icon="fluent-color:dismiss-circle-48"></span>
      <span class="sr-only">Error icon</span>
    </div>
    <div class="ms-3 text-sm font-normal">{{ props.value }}</div>
    <button type="button"
      class="animate-pulse dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700 -mx-1.5 -my-1.5 ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-900 focus:ring-2 focus:ring-gray-300"
      data-dismiss-target="#toast-success" aria-label="Close">
      <span class="sr-only">Close</span>
      <span class="iconify" data-icon="fa-solid:xmark"></span>
    </button>
  </div>
</template>