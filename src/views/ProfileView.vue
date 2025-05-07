<script setup lang="ts">
import { supabase } from "@/services/supabase";
import { User } from "@supabase/supabase-js";

const user = supabase.auth.user() as User;
const metadata = user.user_metadata;
const name = ref(metadata?.full_name || user.email);

const password = ref("");
const nickname = ref(name.value);

const loading = ref(false);

/* Change Password */
async function changePassword() {
  loading.value = true;
  const { error } = await supabase.auth.update({
    password: password.value,
  });
  alert(error?.message || "password successfully changed");
  password.value = "";
  loading.value = false;
}

/* Change Nickname */
async function changeNickname() {
  loading.value = true;
  const { error } = await supabase.auth.update({
    data: { nickname: nickname.value },
  });
  if (error) alert(error.message);
  else {
    alert("nickname successfully changed");
    name.value = nickname.value;
  }
  loading.value = false;
}
</script>

<template>
  <h1 class="mb-2 text-3xl font-medium">User Profile</h1>
  <p class="mb-4 text-xl">Hi, {{ name }}</p>


  <div class="bg-gray-100 dark:bg-gray-800 overflow-hidden shadow rounded-lg border">

    <div class="px-4 py-5 sm:px-6 flex items-center">
      <img class="w-15 h-15 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500"
        :src="user.user_metadata.avatar_url" alt="Bordered avatar">

      <div class="px-4 py-5 sm:px-6">
        <h3 class="text-lg leading-6 font-medium text-gray-800 dark:text-gray-200">
          User Profile
        </h3>
        <p class="mt-1 max-w-2xl text-sm text-gray-600 dark:text-gray-400">
          This is some information about the user.
        </p>
      </div>
    </div>
    <div class="border-t border-gray-300 dark:border-gray-700 px-4 py-5 sm:p-0">
      <dl class="sm:divide-y sm:divide-gray-300 dark:sm:divide-gray-700">
        <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-600 dark:text-gray-400">
            Full name
          </dt>
          <dd class="mt-1 text-sm text-gray-800 dark:text-gray-200 sm:mt-0 sm:col-span-2">
            {{ name }}
          </dd>
        </div>
        <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-600 dark:text-gray-400">
            Email address
          </dt>
          <dd class="mt-1 text-sm text-gray-800 dark:text-gray-200 sm:mt-0 sm:col-span-2">
            {{ user.email }}
          </dd>
        </div>
        <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-600 dark:text-gray-400">
            Phone number
          </dt>
          <dd class="mt-1 text-sm text-gray-800 dark:text-gray-200 sm:mt-0 sm:col-span-2">
            {{ metadata?.phone || "Not provided" }}
          </dd>
        </div>
        <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-600 dark:text-gray-400">
            Address
          </dt>
          <dd class="mt-1 text-sm text-gray-800 dark:text-gray-200 sm:mt-0 sm:col-span-2">
            {{ metadata?.address || "Not provided" }}
          </dd>
        </div>
        <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-600 dark:text-gray-400">
            Provider OAuth
          </dt>
          <dd class="mt-1 text-sm text-gray-800 dark:text-gray-200 sm:mt-0 sm:col-span-2">
            {{ user.app_metadata.provider || "Not provided" }}
          </dd>
        </div>
        <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-600 dark:text-gray-400">
            Joined at
          </dt>
          <dd class="mt-1 text-sm text-gray-800 dark:text-gray-200 sm:mt-0 sm:col-span-2">
            {{ user.created_at }}
          </dd>
        </div>
      </dl>
    </div>
    <div class="inline-grid grid-cols-1 p-6 gap-8 md:grid-cols-2">
      <form class="inline-flex flex-col space-y-2" @submit.prevent="changePassword">
        <VLabel for="password">Change your password</VLabel>
        <VPasswordInput :disabled="loading" v-model="password" class="inline-block" name="password" id="password"
          placeholder="Choose a new password" />
        <VButton :disabled="loading" class="bg-teal-700">Change Password</VButton>
      </form>
      <form class="inline-flex flex-col space-y-2" @submit.prevent="changeNickname">
        <VLabel for="nickname">Change your nickname</VLabel>
        <VInput :disabled="loading" required v-model="nickname" class="inline-block" name="nickname" id="nickname"
          placeholder="Choose a new nickname" />
        <VButton :disabled="loading" class="bg-teal-700">Change Nickname</VButton>
      </form>
    </div>
  </div>
</template>
