import { env } from "@/env";
import { files } from "@wix/media";
import { members } from "@wix/members";
import { redirects } from "@wix/redirects";
import { reviews } from "@wix/reviews";
import { collections, products } from "@wix/stores";
import { createClient, OAuthStrategy, Tokens } from "@wix/sdk";
import {
  backInStockNotifications,
  checkout,
  currentCart,
  orders,
  recommendations,
} from "@wix/ecom";

export function getWixClient(tokens: Tokens | undefined) {
  return createClient({
    modules: {
      files,
      members,
      redirects,
      reviews,
      collections,
      products,
      backInStockNotifications,
      checkout,
      currentCart,
      orders,
      recommendations,
    },
    auth: OAuthStrategy({
      clientId: env.NEXT_PUBLIC_WIX_CLIENT_ID,
      tokens,
    }),
  });
}

export type WixClient = ReturnType<typeof getWixClient>;
