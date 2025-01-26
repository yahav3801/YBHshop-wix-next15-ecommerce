import { getWixClient, WixClient } from "@/lib/wix-client.base";
import { collections } from "@wix/stores";
import { cache } from "react";

export const getCollectionBySlug = cache(
  async (wixClient: WixClient, slug: string) => {
    const { collection } =
      await wixClient.collections.getCollectionBySlug(slug);
    return collection || null;
  },
);

export const getCollection = cache(
  async (wixClient: WixClient): Promise<collections.Collection[]> => {
    const collections = await wixClient.collections
      .queryCollections()
      .ne("_id", "00000000-000000-000000-000000000001") //all products
      .ne("_id", "a6f78b58-cd56-28b3-6e56-d84077fa0650") //featured products (already shows on homepage)
      .find();

    return collections.items;
  },
);
