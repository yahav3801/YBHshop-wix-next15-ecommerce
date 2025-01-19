import { WIX_STORES_APP_ID } from "@/lib/constants";
import { findVariant } from "@/lib/utils";
import { getWixClient } from "@/lib/wix-client.base";
import { products } from "@wix/stores";

export async function getCart() {
  const wixClient = getWixClient();
  try {
    return await wixClient.currentCart.getCurrentCart();
  } catch (error) {
    if (
      (error as any).details.applicationError.code === "OWNED_CART_NOT_FOUND"
    ) {
      return null;
    } else {
      throw error;
    }
  }
}
interface AddToCartValues {
  product: products.Product;
  selectedOptions: Record<string, string>;
  quantity: number;
}
export async function addToCart({
  product,
  selectedOptions,
  quantity,
}: AddToCartValues) {
  const wixClient = getWixClient();
  const selectedvariant = findVariant(product, selectedOptions);

  return wixClient.currentCart.addToCurrentCart({
    lineItems: [
      {
        catalogReference: {
          appId: WIX_STORES_APP_ID,
          catalogItemId: product._id,
          options: selectedvariant
            ? {
                variantId: selectedvariant._id,
              }
            : { options: selectedOptions },
        },
        quantity,
      },
    ],
  });
}
