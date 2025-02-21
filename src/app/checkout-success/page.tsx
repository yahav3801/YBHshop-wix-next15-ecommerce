import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Order from "@/components/Order";
import { getWixServerClient } from "@/lib/wix-client.server";
import { getLoggedInMember } from "@/wix-api/members";
import { getOrder } from "@/wix-api/orders";
import ClearCart from "./ClearCart";

export const metadata: Metadata = {
  title: "Checkout success",
};

interface PageProps {
  searchParams: { orderId?: string };
}

export default async function Page({ searchParams }: PageProps) {
  const orderId = searchParams?.orderId;
  if (!orderId) notFound();

  const wixClient = await getWixServerClient();
  const [order, loggedInMember] = await Promise.all([
    getOrder(wixClient, orderId),
    getLoggedInMember(wixClient),
  ]);

  if (!order) notFound();

  const orderCreatedDate = order._createdDate
    ? new Date(order._createdDate)
    : null;

  return (
    <main className="mx-auto flex max-w-3xl flex-col items-center space-y-5 px-5 py-10">
      <h1 className="text-3xl font-bold">We received your order!</h1>
      <p>A summary of your order was sent to your email address.</p>
      <h2 className="text-2xl font-bold">Order details</h2>
      <Order order={order} />
      {loggedInMember && (
        <Link href="/profile" className="block text-primary hover:underline">
          View all your orders
        </Link>
      )}
      {orderCreatedDate &&
        orderCreatedDate.getTime() > Date.now() - 60_000 * 5 && <ClearCart />}
    </main>
  );
}
