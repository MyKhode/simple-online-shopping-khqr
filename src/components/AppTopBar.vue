<script lang="ts" setup>
import { Ref, inject, ref, onMounted, onUnmounted } from "vue";
import { isDarkKey } from "@/symbols";
import { supabase } from "@/services/supabase";
import { eventBus } from "@/eventBus";
import { useRouter } from "vue-router";

const router = useRouter();

// Define Props & Emits
const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{ (e: "update:modelValue", value: boolean): void }>();

// Theme Mode
const isDark = inject(isDarkKey) as Ref<boolean>;
const toggleDark = () => (isDark.value = !isDark.value);

// User Authentication & Tokens
const user = ref(supabase.auth.user());
const isSignIn = ref(!!user.value);
const token = ref<number>(0);
const isLoading = ref(false);

const fetchToken = async (): Promise<void> => {
  isLoading.value = true;
  if (!user.value) {
    isLoading.value = false;
    return;
  }

  try {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("token")
      .eq("user_id", user.value.id)
      .single();

    if (error) throw error;
    if (data) token.value = data.token;

    eventBus.emit("user-token-event", token.value);
  } catch (err) {
    console.error("Error fetching token:", err);
  } finally {
    isLoading.value = false;
  }
};

const updateToken = async (minusToken: number) => {
  if (!user.value) return;

  const newTokenValue = Math.max(0, token.value - minusToken); // Ensure token doesn't go below 0

  try {
    const { error } = await supabase
      .from("user_profiles")
      .update({ token: newTokenValue })
      .eq("user_id", user.value.id);

    if (error) throw error;
    token.value = newTokenValue;
    // console.log(`Token updated successfully! New Token: ${newTokenValue}`);
  } catch (err) {
    console.error("Error updating token:", err);
  }
};

// Event Handlers
const TokenUpdatedEvent = async () => {
  await fetchToken();
};

const handleTokenTransaction = async (event: unknown) => {
  if (typeof event === "number") {
    await updateToken(event);
  }
  fetchToken();
};

const handleLoginCallback = async (data: any) => {
  console.log("Received event:", data);
  fetchToken();
  isSignIn.value = true;
};

// Lifecycle Hooks
onMounted(() => {
  // console.log("Registering event listeners...");

  eventBus.on("Token-Updated-Event", TokenUpdatedEvent);
  eventBus.on("Request-token-event", handleTokenTransaction);
  eventBus.on("sign-in", handleLoginCallback);
  fetchToken();

  supabase.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_IN") {
      user.value = session?.user || null;
      isSignIn.value = !!user.value;
      fetchToken();
    } else if (event === "SIGNED_OUT") {
      user.value = null;
      isSignIn.value = false;
      token.value = 0;
    }
  });
});

onUnmounted(() => {
  eventBus.off("Token-Updated-Event", TokenUpdatedEvent);
  eventBus.off("Request-token-event", handleTokenTransaction);
  eventBus.off("sign-in", handleLoginCallback);
});

const goBack = () => {
  router.back(); // This will navigate back to the previous route
};
</script>


<template>
  <header
    class="sticky top-0 z-30 flex items-center justify-between p-3 shadow bg-gradient-to-l md:bg-gradient-to-r bg-slate-300 dark:bg-gradient-to-r dark:from-slate-900 dark:to-slate-700">
    <!-- Menu Button -->
    <v-icon-button @click="emit('update:modelValue', !props.modelValue)">
      <span
        class="iconify cursor-pointer hover:scale-110 hover:text-lime-500 duration-300 text-3xl font-semibold text-gray-900 dark:text-white"
        data-icon="mingcute:menu-fill"></span>
    </v-icon-button>
<!-- 
    <div class="justify-between flex-1 flex md:hidden">
      <button type="button" @click="goBack"
        class="relative rounded-sm inline-flex cursor-pointer items-center px-2 py-2 text-sm 5xl:text-xl font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 opacity-50">
        <span class="iconify" data-icon="fa-solid:angle-left"></span>
        <span class="px-2"> Previous</span>
      </button>
    </div> -->
    <!-- User Token Info & Theme Toggle -->
    <div class="flex items-center space-x-4">
      <div v-if="isSignIn" title="User Remaining Tokens">
        <div role="status" v-if="isLoading">
          <svg aria-hidden="true" class="inline w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-rose-600"
            viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor" />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill" />
          </svg>
          <span class="mx-3">Loading...</span>
        </div>
        <router-link v-else to="/top-up" class="flex items-center space-x-1 cursor-pointer">
          <span>{{ new Intl.NumberFormat('en-KH', { style: 'currency', currency: 'KHR' }).format(token) }}</span>
          <span class="iconify text-2xl font-semibold text-gray-900 dark:text-white"
            data-icon="mingcute:binance-coin-bnb-fill"></span>
        </router-link>
      </div>

      <router-link v-else to="/signin">
        <div class="flex items-center space-x-1 cursor-pointer" title="Sign up now and get 250 tokens free">
          Sign In
        </div>
      </router-link>

      <!-- Theme Switch -->
      <!-- <v-icon-button @click="toggleDark()" title="Switch Theme">
        <i-carbon-sun class="h-6 w-6 cursor-pointer dark:hidden" />
        <i-carbon-moon class="hidden h-6 w-6 cursor-pointer dark:block" />
      </v-icon-button> -->
      <button @click="toggleDark()" class="flex items-center space-x-1 cursor-pointer" title="Sign Out">
        <span class="iconify text-4xl font-semibold text-gray-900 dark:text-white dark:hidden"
          data-icon="meteocons:haze-day-fill"></span>
        <span class="iconify text-4xl font-semibold text-gray-900 dark:text-white hidden dark:block"
          data-icon="meteocons:haze-night-fill"></span>
      </button>
    </div>
  </header>
</template>
