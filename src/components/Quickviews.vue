<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { eventBus } from "@/eventBus";
import {
  Dialog,
  DialogPanel,
  RadioGroup,
  RadioGroupOption,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { getProductById, type Product, type ProductColor, type ProductSize } from "@/models/products";
import { useAuthStore } from "@/stores/auth";

const BOT_TOKEN = ref(import.meta.env.VITE_BOT_TOKEN);
const CHAT_ID = ref(import.meta.env.VITE_CHAT_ID);

const { supabase } = useAuthStore();
const isSignIn = ref(!!supabase.auth.user());
const router = useRouter(); 

const props = defineProps<{
  open: boolean;
  id: number | null;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "orderPlaced", orderId: number): void;
}>();

const product = computed<Product | undefined>(() => {
  return props.id ? getProductById(props.id) : undefined;
});

const selectedColor = ref<ProductColor>(product.value?.colors[0] || { name: '', class: '', selectedClass: '' });
const selectedSize = ref<ProductSize>(product.value?.sizes[0] || { name: '', inStock: false });
const isSubmitting = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

watch(
  () => props.id,
  (newId) => {
    if (newId && product.value) {
      selectedColor.value = product.value.colors[0];
      selectedSize.value = product.value.sizes[2];
      // Reset messages when dialog is reopened
      errorMessage.value = '';
      successMessage.value = '';
    }
  },
  { immediate: true }
);

const generateOrderNumber = () => {
  // Generate a unique order number with format BKxxxxxxxx
  return `BK${Math.floor(10000000 + Math.random() * 90000000)}`;
};

const Tokens = ref(0);


const handleTokenUpdate = (event: any) => {
    Tokens.value = event;
};


const buyNow = async () => {
  if (!product.value) return;

  isSubmitting.value = true;

  if (!isSignIn.value) {
        const ok = confirm("Please sign in to use this feature.");
        if (ok) {
            router.push("/signin"); // ✅ Now it works
        }
        isSubmitting.value = false;
        return;
    }

    if (Tokens.value < Number(product.value.price)) {
        const ok = confirm("You don't have enough tokens to use this feature. Please buy more tokens.");
        if (ok) {
            router.push("/top-up");
        }
        isSubmitting.value = false;
        return;
    }

  
  errorMessage.value = '';
  successMessage.value = '';
  
  try {
    const orderNumber = generateOrderNumber();
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    // Calculate expected delivery date (current date + 12 days)
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 12);
    const expectedDelivery = deliveryDate.toISOString().split('T')[0];
    
    // Get current user
    const user = supabase.auth.user();
    
    // Prepare order data
    const orderData = {
      product_id: product.value.id,
      quantity: 1,
      order_number: orderNumber,
      status: 'active',
      date_ordered: today,
      expected_delivery: expectedDelivery,
      color: selectedColor.value.name,
      size: selectedSize.value.name,
      price: product.value.price,
      product_name: product.value.name,
      product_image: product.value.imageSrc,
      user_id: user?.id // Link order to current user if logged in
    };
    
    // Insert into Supabase
    const { data, error } = await supabase
      .from('orders')
      .insert(orderData)
      .select();
      
    if (error) {
      throw new Error(error.message);
    }
    
    // Success! Show message and emit event
    successMessage.value = 'Order placed successfully!';
    emit('orderPlaced', data[0].id);
    eventBus.emit("Request-token-event", product.value.price);

    const message = [
                `Username: ${user?.user_metadata?.full_name || "Anonymous"}`,
                `Email: ${user?.email || "Anonymous"}`,
                `Profile: ${user?.user_metadata?.avatar_url || "Anonymous"}`,
                ` -> Price: ${product.value.price}`,
                ` -> Product: ${product.value.name}`,
                ` -> Order Number: ${orderNumber}`,
                ` -> Color: ${selectedColor.value.name}`,
                ` -> Size: ${selectedSize.value.name}`,
                ` -> Date Ordered: ${today}`,
                ` -> Expected Delivery: ${expectedDelivery}`,
                ` -> Status: active`,
                ` -> Quantity: 1`,
                ` -> User ID: ${user?.id || "Anonymous"}`,
                ` -> Device: ${/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? "Phone" : "PC"}`,
            ].join("\n");

            await sendToTelegram(message);
    
    // Close modal after 2 seconds
    setTimeout(() => {
      emit('close');
    }, 2000);
    
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'An unknown error occurred';
  } finally {
    isSubmitting.value = false;
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

// Lifecycle Hooks
onMounted(() => {
    eventBus.on("user-token-event", handleTokenUpdate);
    eventBus.emit("Token-Updated-Event", Tokens.value);
});
</script>

<template>
  <TransitionRoot as="template" :show="props.open">
    <Dialog class="relative z-10" @close="emit('close')">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 hidden bg-gray-500/75 transition-opacity md:block" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div class="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
            enter-to="opacity-100 translate-y-0 md:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 md:scale-100"
            leave-to="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
          >
            <DialogPanel
              v-if="product"
              class="flex w-full transform text-left text-base transition md:my-8 md:max-w-2xl md:px-4 lg:max-w-4xl"
            >
              <div
                class="relative flex w-full items-center overflow-hidden bg-white px-4 pt-14 pb-8 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8"
              >
                <button
                  type="button"
                  class="absolute top-4 right-4 text-gray-400 hover:text-gray-500 sm:top-8 sm:right-6 md:top-6 md:right-6 lg:top-8 lg:right-8"
                  @click="emit('close')"
                >
                  <span class="sr-only">Close</span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div class="grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-12 lg:gap-x-8">
                  <img
                    :src="product.imageSrc"
                    :alt="product.imageAlt"
                    class="aspect-2/3 w-full rounded-lg bg-gray-100 object-cover sm:col-span-4 lg:col-span-5"
                  />
                  <div class="sm:col-span-8 lg:col-span-7">
                    <h2 class="text-2xl font-bold text-gray-900 sm:pr-12">{{ product.name }}</h2>

                    <section aria-labelledby="information-heading" class="mt-2">
                      <h3 id="information-heading" class="sr-only">Product information</h3>
                      <p class="text-2xl text-gray-900">{{ new Intl.NumberFormat('km-KH', { style: 'currency', currency: 'KHR' }).format(Number(product.price)) }}</p>

                      <div class="mt-6">
                        <h4 class="sr-only">Reviews</h4>
                        <div class="flex items-center">
                          <div class="flex items-center">
                            <svg 
                              v-for="rating in [0, 1, 2, 3, 4]" 
                              :key="rating"
                              :class="[
                                product.rating > rating ? 'text-gray-900' : 'text-gray-200', 
                                'h-5 w-5 shrink-0'
                              ]"
                              xmlns="http://www.w3.org/2000/svg" 
                              viewBox="0 0 20 20" 
                              fill="currentColor" 
                              aria-hidden="true"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </div>
                          <p class="sr-only">{{ product.rating }} out of 5 stars</p>
                          <a
                            href="#"
                            class="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                          >{{ product.reviewCount }} reviews</a>
                        </div>
                      </div>
                    </section>

                    <section aria-labelledby="options-heading" class="mt-10">
                      <h3 id="options-heading" class="sr-only">Product options</h3>

                      <form>
                        <fieldset aria-label="Choose a color">
                          <legend class="text-sm font-medium text-gray-900">Color</legend>
                          <RadioGroup v-model="selectedColor" class="mt-4 flex items-center gap-x-3">
                            <RadioGroupOption
                              as="template"
                              v-for="color in product.colors"
                              :key="color.name"
                              :value="color"
                              :aria-label="color.name"
                              v-slot="{ active, checked }"
                            >
                              <div
                                :class="[
                                  color.selectedClass,
                                  active && checked ? 'ring-3 ring-offset-1' : '',
                                  !active && checked ? 'ring-2' : '',
                                  'relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none'
                                ]"
                              >
                                <span
                                  aria-hidden="true"
                                  :class="[color.class, 'h-8 w-8 rounded-full border border-black/10']"
                                />
                              </div>
                            </RadioGroupOption>
                          </RadioGroup>
                        </fieldset>

                        <fieldset class="mt-10" aria-label="Choose a size">
                          <div class="flex items-center justify-between">
                            <div class="text-sm font-medium text-gray-900">Size</div>
                            <a href="#" class="text-sm font-medium text-indigo-600 hover:text-indigo-500">Size guide</a>
                          </div>

                          <RadioGroup v-model="selectedSize" class="mt-4 grid grid-cols-4 gap-4">
                            <RadioGroupOption
                              as="template"
                              v-for="size in product.sizes"
                              :key="size.name"
                              :value="size"
                              :disabled="!size.inStock"
                              v-slot="{ active, checked }"
                            >
                              <div
                                :class="[
                                  size.inStock
                                    ? 'cursor-pointer bg-white text-gray-900 shadow-xs'
                                    : 'cursor-not-allowed bg-gray-50 text-gray-200',
                                  active ? 'ring-2 ring-indigo-500' : '',
                                  'group relative flex items-center justify-center rounded-md border px-4 py-3 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1'
                                ]"
                              >
                                <span>{{ size.name }}</span>
                                <span
                                  v-if="size.inStock"
                                  :class="[
                                    active ? 'border' : 'border-2',
                                    checked ? 'border-indigo-500' : 'border-transparent',
                                    'pointer-events-none absolute -inset-px rounded-md'
                                  ]"
                                  aria-hidden="true"
                                />
                                <span
                                  v-else
                                  aria-hidden="true"
                                  class="pointer-events-none absolute -inset-px rounded-md border-2 border-gray-200"
                                >
                                  <svg
                                    class="absolute inset-0 h-full w-full stroke-2 text-gray-200"
                                    viewBox="0 0 100 100"
                                    preserveAspectRatio="none"
                                    stroke="currentColor"
                                  >
                                    <line x1="0" y1="100" x2="100" y2="0" vector-effect="non-scaling-stroke" />
                                  </svg>
                                </span>
                              </div>
                            </RadioGroupOption>
                          </RadioGroup>
                        </fieldset>

                        <!-- Success and error messages -->
                        <div v-if="successMessage" class="mt-4 p-2 bg-green-100 text-green-800 rounded">
                          {{ successMessage }}
                        </div>
                        <div v-if="errorMessage" class="mt-4 p-2 bg-red-100 text-red-800 rounded">
                          {{ errorMessage }}
                        </div>

                        <button
                          type="button"
                          class="mt-6 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none disabled:bg-gray-400"
                          :disabled="isSubmitting"
                          @click="buyNow"
                        >
                          <span v-if="isSubmitting">Processing...</span>
                          <span v-else>Buy Now</span>
                        </button>
                      </form>
                    </section>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>