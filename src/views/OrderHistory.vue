<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAuthStore } from "../stores/auth"; // Import your auth store

// Get Supabase instance from auth store
const { supabase } = useAuthStore();

// Define interfaces for orders and statistics
interface Product {
  id: string;
  name: string;
  imageSrc: string;
  imageAlt: string;
  price: number;
}

interface Order {
  id: string;
  order_number: string;
  product_id: string;
  quantity: number;
  status: 'active' | 'completed' | 'cancelled';
  date_ordered: string;
  expected_delivery: string;
  color: string;
  size: string;
  price: number;
  product_name: string;
  product_image: string;
  user_id: string;
}

interface OrderWithProduct extends Order {
  product: {
    id: string;
    name: string;
    imageSrc: string;
    imageAlt: string;
    price: number;
  };
}

// State management
const orders = ref<OrderWithProduct[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const orderStats = ref({
  total: 0,
  active: 0,
  completed: 0,
  cancelled: 0
});

// Format price function
const formatPrice = (price: number | string): string => {
  if (typeof price === "string") {
    return price.replace(/^\$/, '');
  }
  return price.toFixed(2);
};

// Generate order number (for new orders)
const generateOrderNumber = () => {
  const prefix = 'ORD';
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}-${timestamp}-${random}`;
};

// Fetch orders from Supabase
const fetchOrders = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    // Get current user
    const user = await supabase.auth.user();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Fetch orders for current user
    const { data, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('date_ordered', { ascending: false });
      
    if (fetchError) {
      throw fetchError;
    }
    
    if (data) {
      // Transform data to match the expected format
      orders.value = data.map((order: Order) => ({
        ...order,
        product: {
          id: order.product_id,
          name: order.product_name,
          imageSrc: order.product_image,
          imageAlt: order.product_name,
          price: order.price
        }
      }));
      
      // Calculate statistics
      calculateStatistics(data);
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to fetch orders';
    console.error('Error fetching orders:', err);
  } finally {
    loading.value = false;
  }
};

// Calculate order statistics
const calculateStatistics = (orderData: Order[]) => {
  orderStats.value = {
    total: orderData.length,
    active: orderData.filter(order => order.status === 'active').length,
    completed: orderData.filter(order => order.status === 'completed').length,
    cancelled: orderData.filter(order => order.status === 'cancelled').length
  };
};

// Show invoice function
const showInvoice = (orderId: string) => {
  console.log("Show invoice clicked for order:", orderId);
  // Implement invoice display logic here
};

// Buy now function (create a new order)
const buyNow = async () => {
  try {
    // You would typically get these values from a product selection
    // This is just placeholder logic based on your provided code
    const product = {
      id: 'someProductId',
      name: 'Example Product',
      price: 99.99,
      imageSrc: '/path/to/image.jpg'
    };
    
    const orderNumber = generateOrderNumber();
    const today = new Date().toISOString().split('T')[0];
    
    // Calculate expected delivery date (current date + 12 days)
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 12);
    const expectedDelivery = deliveryDate.toISOString().split('T')[0];
    
    // Get current user
    const user = await supabase.auth.user();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Prepare order data
    const orderData = {
      product_id: product.id,
      quantity: 1,
      order_number: orderNumber,
      status: 'active',
      date_ordered: today,
      expected_delivery: expectedDelivery,
      color: 'Default',
      size: 'Medium',
      price: product.price,
      product_name: product.name,
      product_image: product.imageSrc,
      user_id: user.id
    };
    
    // Insert into Supabase
    const { data, error } = await supabase
      .from('orders')
      .insert(orderData)
      .select();
      
    if (error) {
      throw error;
    }
    
    // Refresh orders after successful creation
    await fetchOrders();
    
    console.log('Order placed successfully:', data);
    
  } catch (err) {
    console.error('Error placing order:', err);
  }
};

// Fetch orders on component mount
onMounted(() => {
  fetchOrders();
});
</script>

<template>
  <div class="max-w-4xl mx-auto p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-slate-400">Order History</h1>
        <p class="text-gray-600 text-sm">Order History to Track Your Purchases and View Past Orders</p>
      </div>
      <div class="flex gap-3">
        <button 
          @click="() => showInvoice(orders[0]?.id)"
          class="border border-gray-300 cursor-pointer rounded-full px-6 py-2 text-gray-700 dark:text-slate-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
          :disabled="orders.length === 0"
        >
          Show Invoice
        </button>
        <button 
          @click="buyNow"
          class="bg-purple-700 text-white cursor-pointer rounded-full px-6 py-2 hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          Buy Now
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-purple-500 border-r-transparent border-b-purple-500 border-l-transparent"></div>
      <p class="mt-3 text-gray-600">Loading your orders...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 p-4 rounded-lg text-red-600 text-center">
      <p>{{ error }}</p>
      <button 
        @click="fetchOrders" 
        class="mt-3 bg-red-100 rounded-md px-4 py-2 text-sm hover:bg-red-200"
      >
        Try Again
      </button>
    </div>

    <div v-else>
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
        <!-- Total Orders Card -->
        <div class="border border-gray-100 rounded-lg p-5 cursor-pointer flex items-center shadow-sm hover:shadow-md transition-shadow">
          <div class="bg-purple-50 p-3 rounded-lg mr-4">
            <div class="text-purple-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
              </svg>
            </div>
          </div>
          <div>
            <h2 class="text-3xl font-bold">{{ orderStats.total }}</h2>
            <p class="text-gray-600 text-sm">Total Orders</p>
          </div>
        </div>

        <!-- Active Orders Card -->
        <div class="border border-gray-100 rounded-lg cursor-pointer p-5 flex items-center shadow-sm hover:shadow-md transition-shadow">
          <div class="bg-green-50 p-3 rounded-lg mr-4">
            <div class="text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <div>
            <h2 class="text-3xl font-bold">{{ orderStats.active }}</h2>
            <p class="text-gray-600 text-sm">Active Orders</p>
          </div>
        </div>

        <!-- Completed Orders Card -->
        <div class="border border-gray-100 rounded-lg p-5 cursor-pointer flex items-center shadow-sm hover:shadow-md transition-shadow">
          <div class="bg-yellow-50 p-3 rounded-lg mr-4">
            <div class="text-yellow-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <div>
            <h2 class="text-3xl font-bold">{{ orderStats.completed }}</h2>
            <p class="text-gray-600 text-sm">Completed</p>
          </div>
        </div>

        <!-- Cancelled Orders Card -->
        <div class="border border-gray-100 rounded-lg cursor-pointer p-5 flex items-center shadow-sm hover:shadow-md transition-shadow">
          <div class="bg-red-50 p-3 rounded-lg mr-4">
            <div class="text-red-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          <div>
            <h2 class="text-3xl font-bold">{{ orderStats.cancelled }}</h2>
            <p class="text-gray-600 text-sm">Cancelled</p>
          </div>
        </div>
      </div>

      <!-- No Orders State -->
      <div v-if="orders.length === 0" class="text-center py-10 bg-gray-50 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <h3 class="mt-3 text-lg font-medium text-gray-700">No orders found</h3>
        <p class="mt-1 text-gray-500">You haven't placed any orders yet.</p>
        <button 
          @click="buyNow"
          class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
        >
          Shop Now
        </button>
      </div>

      <!-- Order Items -->
      <div v-else class="space-y-6">
        <div 
          v-for="order in orders" 
          :key="order.id" 
          class="flex items-center cursor-pointer border-b border-gray-100 pb-6 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg p-3 transition-colors"
        >
          <div class="w-24 h-24 bg-gray-100 rounded-md overflow-hidden">
            <img :src="order.product_image" :alt="order.product_name" class="w-full h-full object-cover">
          </div>
          <div class="flex-1 ml-6">
            <h3 class="text-lg font-medium text-gray-900">{{ order.product_name }}</h3>
            <div class="mt-2 text-sm text-gray-600">
              <p>Quantity: {{ order.quantity }}</p>
              <p>Order: {{ order.order_number }}</p>
              <p v-if="order.color && order.size" class="text-xs mt-1 text-gray-500">
                {{ order.color }}, {{ order.size }}
              </p>
              <p class="text-xs mt-1 text-gray-500">Ordered on {{ order.date_ordered }}</p>
              <p v-if="order.expected_delivery" class="text-xs text-gray-500">
                Expected delivery: {{ order.expected_delivery }}
              </p>
              <p class="mt-1 text-xs font-medium" :class="{
                'text-green-600': order.status === 'completed',
                'text-blue-600': order.status === 'active',
                'text-red-600': order.status === 'cancelled'
              }">
                Status: {{ order.status.charAt(0).toUpperCase() + order.status.slice(1) }}
              </p>
            </div>
          </div>
          <div class="text-lg font-bold">${{ formatPrice(order.price) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>