"use client";
import LoadingButton from "@/components/LoadingButton";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { wixBrowserClient } from "@/lib/wix-client.browser";
import { getProductReviews } from "@/wix-api/reviews";
import { useInfiniteQuery } from "@tanstack/react-query";
import { reviews } from "@wix/reviews";
import { products } from "@wix/stores";
import { CornerDownRight, StarIcon } from "lucide-react";
import Image from "next/image";
import logo from "@/assets/logo.png";
interface ProductReviewsProps {
  product: products.Product;
}
export default function ProductReviews({ product }: ProductReviewsProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ["product-reviews", product._id],
      queryFn: async ({ pageParam }) => {
        if (!product._id) throw Error("Product ID is missing");

        const pageSize = 2;

        return getProductReviews(await wixBrowserClient, {
          productId: product._id,
          limit: pageSize,
          cursor: pageParam,
        });
      },
      select: (data) => ({
        ...data,
        pages: data.pages.map((page) => ({
          ...page,
          items: page.items.filter(
            (item) =>
              item.moderation?.moderationStatus ===
              reviews.ModerationModerationStatus.APPROVED,
          ),
        })),
      }),
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage) => lastPage.cursors?.next,
    });
  const reviewItems = data?.pages.flatMap((page) => page.items) || [];
  return (
    <div className="space-y-5">
      {status === "pending" && <ProductReviewsLoadingSkeletons />}
      {status === "error" && (
        <p className="text-destructive">Error loading reviews</p>
      )}
      {status === "success" && !reviewItems.length && !hasNextPage && (
        <p>No reviews yet</p>
      )}
      <div>
        {reviewItems.map((review) => (
          <Review key={review._id} review={review} />
        ))}
      </div>
      {hasNextPage && (
        <LoadingButton
          loading={isFetchingNextPage}
          onClick={() => fetchNextPage()}
        >
          Load more reviews
        </LoadingButton>
      )}
    </div>
  );
}

interface reviewProps {
  review: reviews.Review;
}
function Review({
  review: { author, content, reviewDate, reply },
}: reviewProps) {
  return (
    <div className="py-5 first:pt-0 last:pb-0">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon
              key={i}
              className={cn(
                "size-5 text-primary",
                i < (content?.rating || 0) && "fill-primary",
              )}
            />
          ))}
          {content?.title && <h3 className="font-bold">{content.title}</h3>}
        </div>
        <p className="text-sm text-muted-foreground">
          by {author?.authorName || "Anonymous"}{" "}
          {reviewDate && <> on {new Date(reviewDate).toLocaleDateString()}</>}
        </p>
        {content?.body && (
          <div className="whitespace-pre-wrap">{content.body}</div>
        )}
      </div>
      {reply?.message && (
        <div className="ms-10 mt-2.5 space-y-1 border-t pt-2.5">
          <div className="flex items-center gap-2">
            <CornerDownRight className="size-5" />
            <Image
              className="size-5"
              src={logo}
              alt="logo"
              width={24}
              height={24}
            />
            <span className="font-bold">YBH Shop Team</span>
          </div>
          <div className="whitespace-pre-line">{reply.message}</div>
        </div>
      )}
    </div>
  );
}
export function ProductReviewsLoadingSkeletons() {
  return (
    <div className="space-y-10">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="space-y-1.5">
          <Skeleton className="h-8 w-52" />
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-16 w-72" />
        </div>
      ))}
    </div>
  );
}
