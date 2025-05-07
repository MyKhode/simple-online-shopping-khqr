<script lang="ts" setup>
import { useAuthStore } from "@/stores/auth";
import { eventBus } from "@/eventBus";

const router = useRouter();
const { supabase } = useAuthStore();

onMounted(() => {
  if (supabase.auth.user()) {
    console.log("Arrived on callback page with an existing user.");
    
    setTimeout(() => {
      router.push("/");
    }, 0);
  }
});

</script>
<template>
  <LoadingIcon class="mx-auto w-16" />
</template>
