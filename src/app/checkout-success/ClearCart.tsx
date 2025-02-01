"use client";
import { useClearCart } from "@/hooks/cart";
import React, { useEffect } from "react";

const ClearCart = () => {
  const { mutate } = useClearCart();
  useEffect(mutate, [mutate]);
  return null;
};

export default ClearCart;
