import { getProductBySlug, getRelatedProducts } from "@/wix-api/products";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";
import ProductDetails from "./ProductDetails";
import { Metadata } from "next/types";
import { getWixServerClient } from "@/lib/wix-client.server";
import { recommendations } from "@wix/ecom";
import { delay } from "@/lib/utils";
import Product from "@/components/Products";
import { Skeleton } from "@/components/ui/skeleton";
import { products } from "@wix/stores";
import { getLoggedInMember } from "@/wix-api/members";
import CreateProductReviewButton from "@/components/reviews/CreateProductReviewButton";
import ProductReviews, {
  ProductReviewsLoadingSkeletons,
} from "./ProductReviews";

interface PageProps {
  params: {
    slug: string;
  };
}
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(await getWixServerClient(), slug);
  if (!product) notFound();

  const mainImage = product.media?.mainMedia?.image;
  return {
    title: product.name,
    description: "Get this item on YBH Shop",
    openGraph: {
      images: mainImage?.url
        ? [
            {
              url: mainImage.url,
              width: mainImage.width,
              height: mainImage.height,
              alt: mainImage.altText || "",
            },
          ]
        : undefined,
    },
  };
}
export default async function page({ params }: PageProps) {
  const { slug } = await params;

  const product = await getProductBySlug(await getWixServerClient(), slug);
  if (!product?._id) notFound();

  return (
    <main className="mx-auto max-w-7xl space-y-10 px-5 py-10">
      <ProductDetails product={product} />
      <Suspense fallback={<RelatedProductsLoadingSkeletons />}>
        <RelatedProducts productId={product._id} />
      </Suspense>
      <hr />
      <div className="space-y-5">
        <h2 className="text-2xl font-bold">Buyer reviews</h2>
        <Suspense fallback={<ProductReviewsLoadingSkeletons />}>
          <ProductReviewsSection product={product} />
        </Suspense>
      </div>
    </main>
  );
}

interface RelatedProductsProps {
  productId: string;
}
async function RelatedProducts({ productId }: RelatedProductsProps) {
  const relatedProducts = await getRelatedProducts(
    await getWixServerClient(),
    productId,
  );

  if (!relatedProducts.length) return null;

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold">Related Products</h2>
      <div className="flex grid-cols-2 flex-col gap-5 sm:grid lg:grid-cols-4">
        {relatedProducts.map((product) => (
          <Product key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}

function RelatedProductsLoadingSkeletons() {
  return (
    <div className="flex grid-cols-2 flex-col gap-5 pt-12 sm:grid lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-[26rem] w-full" />
      ))}
    </div>
  );
}

interface ProductReviewsSectionProps {
  product: products.Product;
}
async function ProductReviewsSection({ product }: ProductReviewsSectionProps) {
  const wixClient = await getWixServerClient();
  const loggedInMember = await getLoggedInMember(wixClient);

  return (
    <div className="space-y-5">
      <CreateProductReviewButton
        product={product}
        loggedInMember={loggedInMember}
      />
      <ProductReviews product={product} />
    </div>
  );
}
