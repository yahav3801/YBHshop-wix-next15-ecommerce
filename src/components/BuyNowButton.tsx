import React from "react";
import { ButtonProps } from "./ui/button";
import { products } from "@wix/stores";
import { useQuickCheckout } from "@/hooks/checkout";
import LoadingButton from "./LoadingButton";
import { cn } from "@/lib/utils";
import { CreditCardIcon } from "lucide-react";

interface BuyNowButtonProps extends ButtonProps {
  product: products.Product;
  quantity: number;
  selectedOptions: Record<string, string>;
}
const BuyNowButton = ({
  product,
  quantity,
  selectedOptions,
  className,
  ...props
}: BuyNowButtonProps) => {
  const { startCheckoutFlow, pending } = useQuickCheckout();
  return (
    <LoadingButton
      className={cn("flex gap-3", className)}
      loading={pending}
      variant={"secondary"}
      onClick={() => startCheckoutFlow({ product, quantity, selectedOptions })}
      {...props}
    >
      <CreditCardIcon />
      Buy Now
    </LoadingButton>
  );
};

export default BuyNowButton;
