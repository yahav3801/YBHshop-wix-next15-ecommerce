"use client";
import { products } from "@wix/stores";
import React from "react";

interface ProductDetailsProps {
  product: products.Product;
}

const ProductDetails = ({ product }: ProductDetailsProps) => {
  return <div>ProductDetails</div>;
};

export default ProductDetails;
