import { products } from "@wix/stores";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateProductReview } from "@/hooks/reviews";
import { Label } from "../ui/label";
import WixImage from "../WixImage";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import LoadingButton from "../LoadingButton";
import StarRatingInput from "./StarRatingInput";

const formSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Title must be at least 5 characters long")
    .max(100, "Title must be at most 100 characters long")
    .or(z.literal("")),
  body: z
    .string()
    .trim()
    .min(10, "Review must be at least 10 characters long")
    .max(3000, "Review must be at most 3000 characters long")
    .or(z.literal("")),
  rating: z.number().int().min(1, "Please rate this product").max(5),
});

type FormValues = z.infer<typeof formSchema>;
interface CreateProductReviewDialogProps {
  product: products.Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitted: () => void;
}
export default function CreateProductReviewDialog({
  product,
  open,
  onOpenChange,
  onSubmitted,
}: CreateProductReviewDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      body: "",
      rating: 0,
    },
  });

  const mutation = useCreateProductReview();

  async function onSubmit({ title, body, rating }: FormValues) {
    if (!product._id) throw Error("Product ID is missing");
    mutation.mutate(
      { productId: product._id, rating, body, title },
      {
        onSuccess: onSubmitted,
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Write a review</DialogTitle>
          <DialogDescription>
            Did you like this product? Share your experience with others!
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-5">
          <div className="space-y-2">
            <Label>Product</Label>
            <div className="flex items-center gap-3">
              <WixImage
                mediaIdentifier={product.media?.mainMedia?.image?.url}
                width={50}
                height={50}
              />
              <span className="font-bold">{product.name}</span>
            </div>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating</FormLabel>
                    <FormControl>
                      <StarRatingInput
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="body"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell others about your experience..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      Write a detailed review to help other shoppers.
                    </FormDescription>
                  </FormItem>
                )}
              />
              <LoadingButton type="submit" loading={mutation.isPending}>
                Submit
              </LoadingButton>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
