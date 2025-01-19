import React from "react";
import { Button, ButtonProps } from "./ui/button";
import { products } from "@wix/stores";
import { addToCart } from "@/wix-api/cart";
interface AddToCartButtonProps extends ButtonProps {
  product: products.Product;
  selectedOptions: Record<string, string>;
  quantity: number;
}

const AddToCartButton = ({
  product,
  selectedOptions,
  quantity,
  className,
  ...props
}: AddToCartButtonProps) => {
  return (
    <Button
      onClick={() => addToCart({ product, selectedOptions, quantity })}
      {...props}
    >
      Add to Cart
    </Button>
  );
};

export default AddToCartButton;
