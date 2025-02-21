"use client";
import { useClearCart } from "@/hooks/cart";
import { useEffect } from "react";

const ClearCart = () => {
  const { mutate } = useClearCart();
  useEffect(mutate, [mutate]);
  return null;
};

export default ClearCart;
