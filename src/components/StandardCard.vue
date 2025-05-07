<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import axios from "axios";
import { eventBus } from "@/eventBus";
import { useRouter } from "vue-router";

const BOT_TOKEN = ref(import.meta.env.VITE_BOT_TOKEN);
const CHAT_ID = ref(import.meta.env.VITE_CHAT_ID);

const props = defineProps<{
    title: string;
    price: number;
    tokens: string;
}>();

const router = useRouter(); 
const { supabase } = useAuthStore();
const isSignIn = ref(!!supabase.auth.user());
const qrCodeData = ref<string | null>(null);
const transactionId = ref<string | null>(null);
let socket: WebSocket | null = null;

const user = supabase.auth.user();


const countdownTime = ref(120);
const isCountdownActive = ref(false);
let countdownTimer: ReturnType<typeof setTimeout> | null = null;

// onMounted(() => {
//     console.log(`User info: ${user?.user_metadata.full_name}`);
//     console.log(`User info: ${user?.email}`);
// });

const startCountdown = () => {
    isCountdownActive.value = true;
    countdownTime.value = 120; // Reset countdown

    const tick = () => {
        if (countdownTime.value > 0) {
            countdownTime.value--;
            countdownTimer = setTimeout(tick, 1000);
        } else {
            isCountdownActive.value = false;
        }
    };

    tick();
};

const resetCountdown = () => {
    if (countdownTimer) {
        clearTimeout(countdownTimer);
    }
    countdownTime.value = 120;
    isCountdownActive.value = false;
};

const handleBuyNow = async () => {
    if (!isSignIn.value) {
        const ok = confirm("Please sign in to use this feature.");
        if (ok) {
            router.push("/signin"); // ✅ Now it works
        }
        return;
    }
    if (isSignIn.value) {
        try {
            transactionId.value = `txn_${new Date().getTime()}`;
            // const response = await axios.post("http://localhost:7777/generate-khqr", {
            const response = await axios.post("https://payment.ikhode.site/generate-khqr", {
                amount: props.price,
                transactionId: transactionId.value,
                username: user?.user_metadata.full_name,
                email: user?.email,
                profile: user?.user_metadata?.avatar_url,
                device: `${/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? "Phone" : "PC"}`
            });

            if (response.data.qrCodeData) {
                qrCodeData.value = response.data.qrCodeData;

                startCountdown();
                isCountdownActive.value = true;
            }
        } catch (error) {
            console.error("Error generating QR code:", error);
        }
    } else {
        alert("Please sign in to make a purchase.");
    }
};

const sendToTelegram = async (message: string) => {
    const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN.value}/sendMessage`;

    try {
        const response = await fetch(TELEGRAM_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: CHAT_ID.value,
                text: message, // No escaping needed
                // Remove parse_mode to send plain text
            }),
        });

        const result = await response.json();
        if (!response.ok) {
            console.error("Failed to send Telegram message:", result);
        }
    } catch (error) {
        console.error("Error sending message to Telegram:", error);
    }
};



onMounted(() => {
    // socket = new WebSocket("ws://localhost:8080/ws");
    // socket = new WebSocket("wss://payment.ikhode.site:8080/ws");
    // socket = new WebSocket("wss://payment.ikhode.site:8080");
    socket = new WebSocket("wss://payment.ikhode.site/ws/");


    socket.onmessage = async (event) => {
        const data = JSON.parse(event.data);

        if (data.type === "payment_success" && data.transactionId === transactionId.value) {
            resetCountdown();
            isCountdownActive.value = false;
            eventBus.emit("Token-Updated-Event");


            // alert(`Payment successful! Amount: ${data.amount}`);

            // Convert payment amount to tokens
            const newTokens = data.amount * 4010;

            // Fetch current tokens
            const { data: userToken, error } = await supabase
                .from("user_profiles")
                .select("token")
                .eq("user_id", user?.id)
                .single();

            if (error) {
                console.error("Error fetching user token:", error);
                return;
            }

            // Convert token from text to number (default to 0 if null)
            const currentTokens = userToken?.token ? parseInt(userToken.token, 10) : 0;

            // Calculate the new token balance
            const updatedTokens = currentTokens + newTokens;

            // Update token balance in Supabase (convert number back to string for storage)
            const { error: updateError } = await supabase
                .from("user_profiles")
                .update({ token: updatedTokens.toString() }) // Convert back to string
                .eq("user_id", user?.id);

            if (updateError) {
                console.error("Error updating tokens:", updateError);
            } else {
                // console.log(`Tokens updated successfully! New Balance: ${updatedTokens}`);
                // Emit globally using eventBus
                eventBus.emit("Request-token-event", { message: updatedTokens });
            }

            const message = [
                `Username: ${user?.user_metadata?.full_name || "Anonymous"}`,
                `Email: ${user?.email || "Anonymous"}`,
                `Profile: ${user?.user_metadata?.avatar_url || "Anonymous"}`,
                `Tokens: ${props.price * 4000}`,
                ` -> App ID: Top Up`,
                ` -> Amount: ${props.price}`,
                ` -> Transaction ID: ${data.transactionId || "N/A"}`,
                ` -> Device: ${/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? "Phone" : "PC"}`,
            ].join("\n");

            await sendToTelegram(message);

        }
    };

    socket.onclose = () => {
        console.log("WebSocket connection closed");
    };
});

const saveQRCode = () => {
    if (!qrCodeData.value) return;

    const link = document.createElement("a");
    link.href = qrCodeData.value;
    link.download = "khqr_code.png"; // Filename for the saved QR code
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};



onUnmounted(() => {
    if (socket) {
        socket.close();
    }
});
</script>

<template>
    <div>
        <div
            class="relative flex flex-col rounded-lg bg-slate-200 dark:bg-slate-800 shadow-sm p-0 md:p-2 my-0 border border-slate-300 dark:border-slate-600">

            <div class="h-7 md:h-9.5 xl:hidden flex absolute top-3 left-3 justify-center">
                <img src="/images/bakong.png" class="mx-auto rounded-md object-cover" alt="bakong logo by Ikhode Site">
            </div>

            <div
                class="pb-2 md:mt-4 xl:pb-8 m-0 mb-3 xl:mb-8 text-center border-b border-slate-300 dark:border-slate-600">

                <p v-if="props.title == 'Popular'" class="mt-4 text-red-600 md:mt-0 text-sm uppercase font-semibold">
                    <span class="text-red-500">{{ props.title }}</span>
                </p>
                <p v-else-if="props.title == 'Premium'" class="mt-4 md:mt-0 text-sm uppercase font-semibold">
                    <span class="text-yellow-500">{{ props.title }}</span>
                </p>
                <p v-else class="mt-4 md:mt-0 text-sm uppercase font-semibold">
                    <span class="text-lime-500">{{ props.title }}</span>
                </p>
                <h1
                    class="flex justify-center gap-1 mt-4 font-bold text-slate-900 dark:text-white text-xl md:text-2xl lg:text-4xl">
                    <span class="text-3xl"></span>
                    {{ props.price.toLocaleString("en-US", { style: "currency", currency: "USD" }) }}
                </h1>
            </div>
            <div class="p-0">
                <ul class="flex flex-col gap-4">
                    <li class="flex items-center justify-center gap-4 md:truncate">
                        <span
                            class="hidden xl:inline p-1 border rounded-full border-slate-400 dark:border-slate-500 bg-slate-300 dark:bg-slate-700">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                                stroke="currentColor" class="w-4 h-4 text-slate-700 dark:text-slate-300">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
                            </svg>
                        </span>
                        <p class="text-slate-700 m-auto lg:m-0 dark:text-slate-300">
                            <span class="hidden xl:inline">{{ props.price.toLocaleString("en-US", {
                                style: "currency",
                                currency: "USD"
                            }) }} = </span> {{
                                    props.tokens }} tokens
                        </p>
                    </li>
                </ul>
            </div>
            <div class="p-0 mt-3 xl:mt-8">
                <button
                    class="w-full px-0 md:px-1 py-2.5 mr-0 mb-0 gap-0 md:gap-2 text-xs font-medium rounded-xs md:rounded-lg text-center inline-flex items-center justify-center text-gray-900 cursor-pointer bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700"
                    type="button" @click="handleBuyNow">

                    <div class="h-5 hidden xl:flex justify-center">
                        <img src="/images/bakong.png" class="mx-auto rounded-md object-cover"
                            alt="bakong logo by Ikhode Site">
                    </div>
                    Pay with Bakong KHQR
                </button>
            </div>
            <!-- QR Code Display -->
            <div v-if="qrCodeData && isCountdownActive"
                class="fixed z-999 inset-0 flex items-center justify-center bg-slate-900/80 bg-opacity-50 p-5">
                <div
                    class="relative bg-white dark:bg-slate-800 p-5 md:p-10 rounded-lg border border-slate-300 dark:border-slate-600 w-full max-w-md shadow-lg">
                    <!-- QR Code Image -->
                    <img :src="qrCodeData" alt="KHQR Code" class="w-full h-auto max-w-xs mx-auto" />

                    <!-- Close Button -->
                    <button @click="qrCodeData = null; resetCountdown()"
                        class="absolute cursor-pointer top-2 right-2 p-3 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg">
                        <!-- <i class="fa-solid fa-xmark text-slate-700 dark:text-slate-300 px-1"></i> -->
                        <span class="iconify" data-icon="fa6-solid:xmark"></span>
                    </button>

                    <!-- Countdown Timer -->
                    <p v-if="isCountdownActive" class="text-center text-red-500 text-sm md:text-lg mt-2">
                        Payment expires in {{ countdownTime }}s
                    </p>

                    <!-- Save QR Code Button -->
                    <button @click="saveQRCode"
                        class="mt-4 flex cursor-pointer items-center justify-center gap-2 w-full bg-yellow-600 text-white py-2 rounded-md shadow-md hover:bg-yellow-700">
                        <i class="fa-solid fa-download"></i> Save QR Code
                    </button>
                </div>
            </div>


        </div>
    </div>
</template>