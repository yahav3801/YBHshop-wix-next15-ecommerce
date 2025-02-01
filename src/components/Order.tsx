import { SUPPORT_EMAIL } from "@/lib/constants";
import { orders } from "@wix/ecom";
import { formatDate } from "date-fns";
import Link from "next/link";
import Badge from "./ui/badge";
import { cn } from "@/lib/utils";
import WixImage from "./WixImage";
interface OrderProps {
  order: orders.Order;
}
export default function Order({ order }: OrderProps) {
  const paymentStatusMap: Record<orders.PaymentStatus, string> = {
    [orders.PaymentStatus.PAID]: "Paid",
    [orders.PaymentStatus.NOT_PAID]: "Not Paid",
    [orders.PaymentStatus.FULLY_REFUNDED]: "Refunded",
    [orders.PaymentStatus.PARTIALLY_PAID]: "Partially Paid",
    [orders.PaymentStatus.PARTIALLY_REFUNDED]: "Partially Refunded",
    [orders.PaymentStatus.PENDING]: "Pending",
    [orders.PaymentStatus.UNSPECIFIED]: "no information",
    [orders.PaymentStatus.PENDING_MERCHANT]: "Pending confirmation.",
    [orders.PaymentStatus.CANCELED]: "Canceled",
    [orders.PaymentStatus.DECLINED]: "Declined",
  };

  const fulfilmentStatusMap: Record<orders.FulfillmentStatus, string> = {
    [orders.FulfillmentStatus.FULFILLED]: "Delivered",
    [orders.FulfillmentStatus.NOT_FULFILLED]: "Not sent",
    [orders.FulfillmentStatus.PARTIALLY_FULFILLED]: "Partially Delivered",
  };

  const paymentStatus = order.paymentStatus
    ? paymentStatusMap[order.paymentStatus]
    : null;

  const fulfilmentStatus = order.fulfillmentStatus
    ? fulfilmentStatusMap[order.fulfillmentStatus]
    : null;

  const shippingDestination =
    order.shippingInfo?.logistics?.shippingDestination;

  return (
    <div className="w-full space-y-5 border p-5">
      <div className="flex flex-wrap items-center gap-3">
        <span className="font-bold">Order #{order.number}</span>
        {order._createdDate && (
          <span>{formatDate(order._createdDate, "MMM d, yyyy")}</span>
        )}
        <Link
          className="ms-auto text-sm hover:underline"
          href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(`Order #${order.number} help`)}&body=${encodeURIComponent(`I need help with order #${order.number}\n\n<Describe your problem>`)}`}
        >
          Need help?
        </Link>
      </div>
      <div className="flex flex-wrap gap-3 text-sm">
        <div className="basis-96">
          <div className="space-y-0.5">
            <div className="flex items-center gap-3 font-semibold">
              <span>
                Subtotal:{order.priceSummary?.subtotal?.formattedAmount}
              </span>
              <Badge
                className={cn(
                  "bg-secondary text-secondary-foreground",
                  order.paymentStatus === orders.PaymentStatus.NOT_PAID &&
                    "bg-red-500 text-white",
                  order.paymentStatus === orders.PaymentStatus.PAID &&
                    "bg-green-500 text-white",
                )}
              >
                {paymentStatus || "no information"}
              </Badge>
            </div>
            <div className="font-semibold">
              {fulfilmentStatus || "no information"}
            </div>
          </div>
          <div className="divide-y">
            {order.lineItems?.map((lineItem) => (
              <OrderItem key={lineItem._id} item={lineItem} />
            ))}
          </div>
        </div>
        {shippingDestination && (
          <div className="space-y-0.5">
            <div className="font-semibold">Delivery address:</div>
            <p>
              {shippingDestination.contactDetails?.firstName}{" "}
              {shippingDestination.contactDetails?.lastName}
            </p>
            <p>
              {shippingDestination.address?.streetAddress?.name}{" "}
              {shippingDestination.address?.streetAddress?.number}
            </p>
            <p>
              {shippingDestination.address?.postalCode}{" "}
              {shippingDestination.address?.city}
            </p>
            <p>
              {shippingDestination.address?.subdivision ||
                shippingDestination.address?.country}
            </p>
            <p className="font-semibold">{order.shippingInfo?.title}</p>
          </div>
        )}
      </div>
    </div>
  );
}
interface OrderItemProps {
  item: orders.OrderLineItem;
}
function OrderItem({ item }: OrderItemProps) {
  return (
    <div className="flex flex-wrap gap-3 py-5 last:pb-0">
      <WixImage
        mediaIdentifier={item.image}
        width={110}
        height={110}
        alt={item.productName?.translated || "Product image"}
        className="flex-none bg-secondary"
      />
      <div className="space-y-0.5">
        <p className="line-clamp-1 font-bold">{item.productName?.translated}</p>
        <p>
          {item.quantity} x {item.price?.formattedAmount}
        </p>
        {!!item.descriptionLines?.length && (
          <p>
            {item.descriptionLines
              .map(
                (line) =>
                  line.colorInfo?.translated || line.plainText?.translated,
              )
              .join(", ")}
          </p>
        )}
      </div>
    </div>
  );
}
