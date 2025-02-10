"use client";
import { members } from "@wix/members";
import { products } from "@wix/stores";
import { useState } from "react";
import { Button } from "../ui/button";
import CreateProductReviewDialog from "./CreateProductReviewDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

interface CreateProductReviewButtonProps {
  product: products.Product;
  loggedInMember: members.Member | null;
}
export default function CreateProductReviewButton({
  product,
  loggedInMember,
}: CreateProductReviewButtonProps) {
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  return (
    <>
      <Button
        disabled={!loggedInMember}
        onClick={() => setShowReviewDialog(true)}
      >
        {loggedInMember ? "Write a review" : "Log in to write a review"}
      </Button>
      <CreateProductReviewDialog
        product={product}
        open={showReviewDialog}
        onOpenChange={setShowReviewDialog}
        onSubmitted={() => {
          setShowReviewDialog(false);
          setShowConfirmationDialog(true);
        }}
      />
      <ReviewSubmittedDialog
        open={showConfirmationDialog}
        onOpenChange={setShowConfirmationDialog}
      />
    </>
  );
}

interface ReviewSubmittedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
function ReviewSubmittedDialog({
  open,
  onOpenChange,
}: ReviewSubmittedDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thank you for your review!</DialogTitle>
          <DialogDescription>
            Your review has been submitted successfully and will be visible once
            it has been approved.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
