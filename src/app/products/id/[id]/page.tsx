import { getWixServerClient } from "@/lib/wix-client.server";
import { getProductById } from "@/wix-api/products";
import { notFound, redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: any;
}

export default async function Page({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  if (resolvedParams.id === "someId") {
    redirect(
      `/products/i-m-a-product-1?${new URLSearchParams(resolvedSearchParams)}`,
    );
  }

  const product = await getProductById(
    await getWixServerClient(),
    resolvedParams.id,
  );

  if (!product) notFound();

  redirect(
    `/products/${product.slug}?${new URLSearchParams(resolvedSearchParams)}`,
  );
}
