<script lang="ts" setup>
// import EyeSlashed from "~icons/akar-icons/eye-slashed";
// import EyeOpen from "~icons/akar-icons/eye-open";

const showPassword = ref(false);

const props = defineProps<{
  disabled?: boolean;
  name?: string;
  id?: string;
  placeholder?: string;
  modelValue: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

function onInput(value: string): void {
  emit("update:modelValue", value);
}

watch(
  () => props.disabled,
  (val) => {
    if (val) showPassword.value = false;
  }
);
</script>
<template>
  <div class="mb-4 inline-flex items-stretch rounded focus:ring">
    <VInput
      :modelValue="modelValue"
      @update:model-value="onInput"
      required
      class="mb-0 w-full rounded-r-none text-slate-900 focus:ring-0"
      :name="name"
      :id="id"
      :placeholder="placeholder"
      :disabled="disabled"
      :type="showPassword ? 'text' : 'password'"
    />
    <button
      type="button"
      :disabled="disabled"
      @click="showPassword = !showPassword"
      class="rounded-r w-9 h-8.5 cursor-pointer justify-center items-center flex text-slate-100 border border-l-1 outline-none "
    >
      <i-mdi-eye-off-outline v-if="showPassword" class="h-8 w-9 p-1 text-slate-50 hover:text-slate-200 duration-200" />
      <i-mdi-eye-outline v-else class="h-8 w-9 p-1 text-slate-50 hover:text-slate-200 duration-200" />
    </button>
  </div>
</template>
