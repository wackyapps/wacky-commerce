// *********************
// Role of the component: Button for adding product to the cart on the single product page
// Name of the component: AddToCartSingleProductBtn.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <AddToCartSingleProductBtn product={product} quantityCount={quantityCount}  />
// Input parameters: SingleProductBtnProps interface
// Output: Button with adding to cart functionality
// *********************
"use client";

import React from "react";
import { useProductStore } from "@/app/_zustand/store";
import toast from "react-hot-toast";

const AddToCartSingleProductBtn = ({
  product,
  quantityCount,
  selectedVariant,
}: SingleProductBtnProps) => {
  const { addToCart, calculateTotals, setShowCartDrawer } = useProductStore();

  const handleAddToCart = () => {
    addToCart({
      id: product?.id.toString(),
      title: product?.title,
      image: product?.mainImage,
      amount: quantityCount,
      variant: selectedVariant,
    });
    calculateTotals();
    setShowCartDrawer(true);
    toast.success("Product added to the cart");
  };
  return (
    <button
      onClick={handleAddToCart}
      className="daisy-btn w-[200px] text-lg border border-gray-300  font-normal bg-white text-blue-500 hover:bg-blue-500 hover:text-white hover:border-blue-500 hover:scale-110 transition-all uppercase ease-in max-[500px]:w-full"
    >
      Add to cart
    </button>
  );
};

export default AddToCartSingleProductBtn;
