import { wixBrowserClient } from "@/lib/wix-client.browser";
import { addToCart, AddToCartValues, getCart } from "@/wix-api/cart";
import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { currentCart } from "@wix/ecom";
import { useToast } from "./use-toast";
const queryKey: QueryKey = ["cart"];
export function useCart(initialData: currentCart.Cart | null) {
  return useQuery({
    queryKey,
    queryFn: () => getCart(wixBrowserClient),
    initialData,
  });
}

export function useAddItemToCart() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (values: AddToCartValues) =>
      addToCart(wixBrowserClient, values),
    onSuccess(data) {
      toast({
        title: "Success!",
        description: "Item added to cart",
      });
      queryClient.cancelQueries({ queryKey });
      queryClient.setQueryData(queryKey, data.cart);
    },
    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request please try again.",
      });
    },
  });
}
