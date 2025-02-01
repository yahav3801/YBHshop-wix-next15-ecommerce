import React from "react";
import { ButtonProps } from "./ui/button";
import { useCartCheckout } from "@/hooks/checkout";
import LoadingButton from "./LoadingButton";

const CheckoutButton = (props: ButtonProps) => {
  const { startCheckoutFlow, pending } = useCartCheckout();
  return (
    <LoadingButton loading={pending} onClick={startCheckoutFlow} {...props}>
      Checkout
    </LoadingButton>
  );
};

export default CheckoutButton;
