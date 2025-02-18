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
import { useRef } from "react";
import { Button } from "../ui/button";
import { CircleAlert, ImageUp, Loader2, X } from "lucide-react";
import useMediaUpload, { MediaAttachment } from "./useMediaUpload";
import { cn } from "@/lib/utils";

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

  const { attachments, startUpload, removeAttachment, clearAttachments } =
    useMediaUpload();
  async function onSubmit({ title, body, rating }: FormValues) {
    if (!product._id) throw Error("Product ID is missing");
    mutation.mutate(
      {
        productId: product._id,
        rating,
        body,
        title,
        media: attachments
          .filter((m) => m.url)
          .map((m) => ({
            url: m.url!,
            type: m.file.type.startsWith("image") ? "image" : "video",
          })),
      },
      {
        onSuccess: () => {
          form.reset();
          clearAttachments();
          onSubmitted();
        },
      },
    );
  }

  const uploadInProgress = attachments.some((m) => m.state === "uploading");

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
              <div className="flex flex-wrap gap-5">
                {attachments.map((att) => (
                  <AttachmentPreview
                    key={att.id}
                    attachment={att}
                    onRemoveClick={removeAttachment}
                  />
                ))}
                <AddMediaButton
                  onFileSelected={startUpload}
                  disabled={
                    attachments.filter((a) => a.state !== "failed").length >= 5
                  }
                />
              </div>
              {attachments.filter((a) => a.state !== "failed").length >= 5 && (
                <div className="text-m flex items-center gap-2 text-muted-foreground">
                  <CircleAlert />
                  <span>You may upload a maximum of 5 attachments.</span>
                </div>
              )}

              <LoadingButton
                disabled={uploadInProgress}
                type="submit"
                loading={mutation.isPending}
              >
                Submit
              </LoadingButton>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface AddMediaButtonProps {
  onFileSelected: (file: File) => void;
  disabled: boolean;
}
function AddMediaButton({ onFileSelected, disabled }: AddMediaButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Button
        type="button"
        disabled={disabled}
        title="Add media"
        variant="outline"
        size={"icon"}
        onClick={() => fileInputRef.current?.click()}
      >
        <ImageUp className="scale-125" />
      </Button>
      <input
        type="file"
        accept="image/*, video/*"
        ref={fileInputRef}
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          if (files.length) {
            onFileSelected(files[0]);
            e.target.value = "";
          }
        }}
        disabled={disabled}
        className="sr-only hidden"
      />
    </>
  );
}

interface attachmentPreviewProps {
  attachment: MediaAttachment;
  onRemoveClick: (id: string) => void;
}

function AttachmentPreview({
  attachment: { id, file, url, state },
  onRemoveClick,
}: attachmentPreviewProps) {
  return (
    <div
      className={cn(
        "relative size-fit",
        state === "failed" && "outline outline-1 outline-destructive",
      )}
    >
      {file.type.startsWith("image") ? (
        <WixImage
          mediaIdentifier={url}
          scaleToFill={false}
          placeholder={URL.createObjectURL(file)}
          alt="attachment Preview"
          className={cn(
            "max-h-24 max-w-24 object-contain",
            !url && "opacity-50",
          )}
        />
      ) : (
        <video
          controls
          className={cn("max-h-24 max-w-24", !url && "opacity-50")}
        >
          <source src={url || URL.createObjectURL(file)} type={file.type} />
        </video>
      )}
      {state === "uploading" && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
          <Loader2 className="animate-spin" />
        </div>
      )}
      {state === "failed" && (
        <div
          title="failed to upload media"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform"
        >
          <CircleAlert className="text-destructive" />
        </div>
      )}
      <button
        title="remove media"
        type="button"
        onClick={() => onRemoveClick(id)}
        className="absolute -right-1.5 -top-1.5 border bg-background"
      >
        <X size={20} />
      </button>
    </div>
  );
}
