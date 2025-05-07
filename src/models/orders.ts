// src/models/orders.ts
import { ref } from "vue";
import { getProductById, type Product } from "./products";

export type OrderStatus = 'active' | 'completed' | 'cancelled';

export interface Order {
  id: number;
  productId: number;
  quantity: number;
  orderNumber: string;
  status: OrderStatus;
  dateOrdered: string;
  expectedDelivery?: string;
}

export interface OrderWithProduct extends Order {
  product: Product;
}

export interface OrderStatistics {
  total: number;
  active: number;
  completed: number;
  cancelled: number;
}

const orders = ref<Order[]>([
  {
    id: 1,
    productId: 3,
    quantity: 1,
    orderNumber: "BK98601090",
    status: "active",
    dateOrdered: "2025-04-28",
    expectedDelivery: "2025-05-10"
  },
  {
    id: 2,
    productId: 4,
    quantity: 1,
    orderNumber: "BK98601090",
    status: "active",
    dateOrdered: "2025-04-28",
    expectedDelivery: "2025-05-10"
  }
]);

export const orderStatistics = ref<OrderStatistics>({
  total: 36,
  active: 2,
  completed: 24,
  cancelled: 12
});

export const getOrderItems = (): OrderWithProduct[] => {
  return orders.value.map(order => {
    const product = getProductById(order.productId);
    if (!product) {
      throw new Error(`Product with ID ${order.productId} not found`);
    }
    return {
      ...order,
      product
    };
  });
};

export const getOrderById = (id: number): OrderWithProduct | undefined => {
  const order = orders.value.find(order => order.id === id);
  if (!order) return undefined;
  
  const product = getProductById(order.productId);
  if (!product) return undefined;
  
  return {
    ...order,
    product
  };
};

export default { orders, orderStatistics, getOrderItems, getOrderById };