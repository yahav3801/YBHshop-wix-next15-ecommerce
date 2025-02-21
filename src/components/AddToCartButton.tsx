import React from "react";
import { ButtonProps } from "./ui/button";
import { products } from "@wix/stores";
import LoadingButton from "./LoadingButton";
import { useAddItemToCart } from "@/hooks/cart";
import { cn } from "@/lib/utils";
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
  const mutation = useAddItemToCart();
  return (
    <LoadingButton
      loading={mutation.isPending}
      className={cn("flex gap-3", className)}
      onClick={() => mutation.mutate({ product, selectedOptions, quantity })}
      {...props}
    >
      Add to Cart
    </LoadingButton>
  );
};

export default AddToCartButton;
