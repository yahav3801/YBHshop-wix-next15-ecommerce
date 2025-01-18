import { getProductBySlug } from "@/wix-api/products";
import { notFound } from "next/navigation";
import React from "react";
import ProductDetails from "./ProductDetails";
import { title } from "process";

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
  };
}
const page = async ({ params: { slug } }: PageProps) => {
  const product = await getProductBySlug(slug);
  if (!product?._id) notFound();

  return (
    <main>
      <ProductDetails product={product} />
      {product.name}
    </main>
  );
};

export default page;
