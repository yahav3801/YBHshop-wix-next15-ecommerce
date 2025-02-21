import { WIX_STORES_APP_ID } from "@/lib/constants";
import { WixClient } from "@/lib/wix-client.base";
import { cache } from "react";

export type ProductsSort = "last_updated" | "price_desc" | "price_asc";
interface queryProductsFilter {
  q?: string;
  collectionIds?: string[] | string;
  sort?: ProductsSort;
  priceMin?: number;
  priceMax?: number;
  skip?: number;
  limit?: number;
}
export async function queryProducts(
  wixClient: WixClient,
  {
    collectionIds,
    sort = "last_updated",
    skip,
    limit,
    q,
    priceMin,
    priceMax,
  }: queryProductsFilter,
) {
  let query = wixClient.products.queryProducts();
  if (q) {
    const allResults = await query.find();
    const searchTerms = q.toLowerCase().split(" ");
    const matchingIds = allResults.items
      .filter((item: any) =>
        searchTerms.some((term) => item.name.toLowerCase().includes(term)),
      )
      .map((item) => item._id);
    query = wixClient.products.queryProducts().in("_id", matchingIds);
  }

  const collectionIdsArray = collectionIds
    ? Array.isArray(collectionIds)
      ? collectionIds
      : [collectionIds]
    : [];
  if (collectionIdsArray.length > 0) {
    query = query.hasSome("collectionIds", collectionIdsArray);
  }
  switch (sort) {
    case "price_asc":
      query = query.ascending("price");
      break;
    case "price_desc":
      query = query.descending("price");
      break;
    case "last_updated":
      query = query.descending("lastUpdated");
      break;
  }

  if (priceMin) {
    query = query.ge("priceData.price", priceMin);
  }
  if (priceMax) {
    query = query.le("priceData.price", priceMax);
  }
  if (limit) query = query.limit(limit);

  if (skip) query = query.skip(skip);

  return query.find();
}

export const getProductBySlug = cache(
  async (wixClient: WixClient, slug: string) => {
    const { items } = await wixClient.products
      .queryProducts()
      .eq("slug", slug)
      .limit(1)
      .find();

    const product = items[0];
    if (!product || !product.visible) {
      return null;
    }
    return product;
  },
);

export async function getProductById(wixClient: WixClient, productId: string) {
  const result = await wixClient.products.getProduct(productId);
  return result.product;
}

export async function getRelatedProducts(
  wixClient: WixClient,
  productId: string,
) {
  const result = await wixClient.recommendations.getRecommendation(
    [
      {
        _id: "68ebce04-b96a-4c52-9329-08fc9d8c1253", //from the same categories
        appId: WIX_STORES_APP_ID,
      },
      {
        _id: "d5aac1e1-2e53-4d11-85f7-7172710b4783", //frequently bought together
        appId: WIX_STORES_APP_ID,
      },
    ],
    {
      items: [
        {
          appId: WIX_STORES_APP_ID,
          catalogItemId: productId,
        },
      ],
      minimumRecommendedItems: 3,
    },
  );
  const productIds = result.recommendation?.items
    .map((item) => item.catalogItemId)
    .filter((id) => id !== undefined);

  if (!productIds || !productIds.length) return [];

  const productsResults = await wixClient.products
    .queryProducts()
    .in("_id", productIds)
    .limit(4)
    .find();

  return productsResults.items;
}
