import PaginationBar from "@/components/PaginationBar";
import Product from "@/components/Products";
import { Skeleton } from "@/components/ui/skeleton";
import { delay } from "@/lib/utils";
import { getWixServerClient } from "@/lib/wix-client.server";
import { queryProducts } from "@/wix-api/products";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";
interface PageProps {
  searchParams: {
    q?: string;
    page?: string;
    collection?: string[];
  };
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Results for "${q}"` : "Products",
  };
}
const page = async ({ searchParams }: PageProps) => {
  const { q, page = "1", collection: collectionIds } = await searchParams;

  const title = q ? `Results for "${q}"` : "Products";
  return (
    <div className="space-y-10 group-has-[[data-pending]]:animate-pulse">
      <h1 className="text-center text-3xl font-bold md:text-4xl">{title}</h1>
      <Suspense fallback={<LoadingSkeleton />} key={`${q}-${page}`}>
        <ProductResults
          q={q}
          page={parseInt(page)}
          collectionIds={collectionIds}
        />
      </Suspense>
    </div>
  );
};

export default page;

interface ProductResultsProps {
  q?: string;
  page: number;
  collectionIds?: string[];
}

async function ProductResults({ q, page, collectionIds }: ProductResultsProps) {
  const pageSize = 12;
  const products = await queryProducts(await getWixServerClient(), {
    q,
    limit: pageSize,
    skip: (page - 1) * pageSize,
    collectionIds,
  });
  if (page > (products.totalPages || 1)) notFound();

  return (
    <div className="space-y-10">
      <p className="text-center text-xl">
        {products.totalCount}{" "}
        {products.totalCount === 1 ? "product found" : "products found"}
      </p>
      <div className="gird-cols-2 flex flex-col gap-5 sm:grid xl:grid-cols-3 2xl:grid-cols-4">
        {products.items.map((product) => (
          <Product key={product._id} product={product} />
        ))}
      </div>
      <PaginationBar currentPage={page} totalPages={products.totalPages || 1} />
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-10">
      <Skeleton className="mx-auto h-9 w-52" />
      <div className="gird-cols-2 flex flex-col gap-5 sm:grid xl:grid-cols-3 2xl:grid-cols-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} className="h-[26rem]" />
        ))}
      </div>
    </div>
  );
}
