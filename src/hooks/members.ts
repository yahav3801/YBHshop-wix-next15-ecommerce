import { useRouter } from "next/navigation";
import { useToast } from "./use-toast";
import { useMutation } from "@tanstack/react-query";
import { updateMemberInfo, updateMemberInfoValues } from "@/wix-api/members";
import { wixBrowserClient } from "@/lib/wix-client.browser";

export function useUpdateMember() {
  const { toast } = useToast();
  const router = useRouter();

  return useMutation({
    mutationFn: (variables: updateMemberInfoValues) =>
      updateMemberInfo(wixBrowserClient, variables),
    onSuccess() {
      toast({
        title: "Success!",
        description: "Profile info updated",
      });
      setTimeout(() => {
        router.refresh();
      }, 2000);
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
