<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  buttonColor: {
    type: String,
    required: true,
  },
  textColor: {
    type: String,
    default: "white",
  },
  url: {
    type: String,
    default: "",
  },
  title: {
    type: String,
    default: "Button",
  },
});
const buttonClasses = computed(() => [
  "text-xs",
  "font-medium",
  "px-1",
  "mx-0.5",
  "rounded-sm",
  props.buttonColor, // Dynamic button color
  props.textColor ? `text-${props.textColor}` : "text-white", // Dynamic text color
]);
</script>

<template>
  <component
    :is="url ? 'a' : 'span'"
    :href="url"
    :class="buttonClasses"
    :style="{ color: textColor }"
  >
    {{ title }}
  </component>
</template>