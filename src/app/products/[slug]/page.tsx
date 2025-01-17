import { getProductBySlug } from "@/wix-api/products";
import { notFound } from "next/navigation";
import React from "react";
import ProductDetails from "./ProductDetails";

interface PageProps {
  params: {
    slug: string;
  };
}

const page = async ({ params }: PageProps) => {
  const product = await getProductBySlug((await params).slug);
  if (!product?._id) notFound();

  return (
    <main>
      <ProductDetails product={product} />
      {product.name}
    </main>
  );
};

export default page;
