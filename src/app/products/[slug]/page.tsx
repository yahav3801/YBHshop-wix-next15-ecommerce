import { getProductBySlug } from "@/wix-api/products";
import { notFound } from "next/navigation";
import React from "react";
import ProductDetails from "./ProductDetails";
import { Metadata } from "next/types";
import { delay } from "@/lib/utils";
interface PageProps {
  params: {
    slug: string;
  };
}
export async function generateMetadata({
  params: { slug },
}: PageProps): Promise<Metadata> {
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const mainImage = product.media?.mainMedia?.image;
  return {
    title: product.name,
    description: "Get this item on Flow Shop",
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
export default async function page({ params: { slug } }: PageProps) {
  await delay(2000);
  const product = await getProductBySlug(slug);
  if (!product?._id) notFound();

  return (
    <main className="mx-auto max-w-7xl space-y-10 px-5 py-10">
      <ProductDetails product={product} />
    </main>
  );
}
