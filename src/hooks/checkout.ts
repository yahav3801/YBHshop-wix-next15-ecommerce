import { useState } from "react";
import { useToast } from "./use-toast";
import {
  getCheckoutUrlForCurrentCart,
  getCheckoutUrlForProduct,
  GetCheckoutUrlForProductParams,
} from "@/wix-api/checkout";
import { wixBrowserClient } from "@/lib/wix-client.browser";

export function useCartCheckout() {
  const { toast } = useToast();
  const [pending, setPenging] = useState(false);
  async function startCheckoutFlow() {
    setPenging(true);
    try {
      const checkoutUrl = await getCheckoutUrlForCurrentCart(wixBrowserClient);
      window.location.href = checkoutUrl;
    } catch (error) {
      setPenging(false);
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to load Checkout. please try again.",
      });
    }
  }
  return { startCheckoutFlow, pending };
}

export function useQuickCheckout() {
  const { toast } = useToast();
  const [pending, setPenging] = useState(false);
  async function startCheckoutFlow(values: GetCheckoutUrlForProductParams) {
    setPenging(true);
    try {
      const checkoutUrl = await getCheckoutUrlForProduct(
        wixBrowserClient,
        values,
      );
      window.location.href = checkoutUrl;
    } catch (error) {
      setPenging(false);
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to load Checkout. please try again.",
      });
    }
  }
  return { startCheckoutFlow, pending };
}
