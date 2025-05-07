// src/models/products.ts
import { ref } from "vue";

export interface ProductColor {
  name: string;
  class: string;
  selectedClass: string;
}

export interface ProductSize {
  name: string;
  inStock: boolean;
}

export interface Product {
  id: number;
  name: string;
  price: string | number;
  href: string;
  imageSrc: string;
  imageAlt: string;
  color?: string;
  rating: number;
  reviewCount: number;
  colors: ProductColor[];
  sizes: ProductSize[];
}

const products = ref<Product[]>([
  {
    id: 1,
    name: "Basic Tee",
    href: "#",
    imageSrc: "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-01.jpg",
    imageAlt: "Two each of gray, white, and black shirts arranged on table.",
    price: "2500",
    color: "Black",
    rating: 3.9,
    reviewCount: 117,
    colors: [
      { name: "White", class: "bg-white", selectedClass: "ring-gray-400" },
      { name: "Gray", class: "bg-gray-200", selectedClass: "ring-gray-400" },
      { name: "Black", class: "bg-gray-900", selectedClass: "ring-gray-900" },
    ],
    sizes: [
      { name: "XXS", inStock: true },
      { name: "XS", inStock: true },
      { name: "S", inStock: true },
      { name: "M", inStock: true },
      { name: "L", inStock: true },
      { name: "XL", inStock: true },
      { name: "XXL", inStock: true },
      { name: "XXXL", inStock: false },
    ],
  },
  {
    id: 2,
    name: "Basic Tee",
    href: "#",
    imageSrc: "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-02.jpg",
    imageAlt: "Front of men's Basic Tee in black.",
    price: "5000",
    color: "Aspen White",
    rating: 4.2,
    reviewCount: 85,
    colors: [
      { name: "White", class: "bg-white", selectedClass: "ring-gray-400" },
      { name: "Gray", class: "bg-gray-200", selectedClass: "ring-gray-400" },
      { name: "Black", class: "bg-gray-900", selectedClass: "ring-gray-900" },
    ],
    sizes: [
      { name: "XXS", inStock: true },
      { name: "XS", inStock: true },
      { name: "S", inStock: true },
      { name: "M", inStock: true },
      { name: "L", inStock: true },
      { name: "XL", inStock: true },
      { name: "XXL", inStock: true },
      { name: "XXXL", inStock: false },
    ],
  },
  {
    id: 3,
    name: "Basic Tee",
    href: "#",
    imageSrc: "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-03.jpg",
    imageAlt: "Front of men's Basic Tee in black.",
    price: "2000",
    color: "Charcoal",
    rating: 4.2,
    reviewCount: 85,
    colors: [
      { name: "White", class: "bg-white", selectedClass: "ring-gray-400" },
      { name: "Gray", class: "bg-gray-200", selectedClass: "ring-gray-400" },
      { name: "Black", class: "bg-gray-900", selectedClass: "ring-gray-900" },
    ],
    sizes: [
      { name: "XXS", inStock: true },
      { name: "XS", inStock: true },
      { name: "S", inStock: true },
      { name: "M", inStock: true },
      { name: "L", inStock: true },
      { name: "XL", inStock: true },
      { name: "XXL", inStock: true },
      { name: "XXXL", inStock: false },
    ],
  },
  {
    id: 4,
    name: "Artwork Tee",
    href: "#",
    imageSrc: "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-04.jpg",
    imageAlt: "Front of men's Basic Tee in black.",
    price: "3500",
    color: "Iso Dots",
    rating: 4.2,
    reviewCount: 85,
    colors: [
      { name: "White", class: "bg-white", selectedClass: "ring-gray-400" },
      { name: "Gray", class: "bg-gray-200", selectedClass: "ring-gray-400" },
      { name: "Black", class: "bg-gray-900", selectedClass: "ring-gray-900" },
    ],
    sizes: [
      { name: "XXS", inStock: true },
      { name: "XS", inStock: true },
      { name: "S", inStock: true },
      { name: "M", inStock: true },
      { name: "L", inStock: true },
      { name: "XL", inStock: true },
      { name: "XXL", inStock: true },
      { name: "XXXL", inStock: false },
    ],
  },
]);

export const getProductById = (id: number): Product | undefined => {
  return products.value.find(product => product.id === id);
};

export const getAllProducts = (): Product[] => {
  return products.value;
};

export default { products, getProductById, getAllProducts };