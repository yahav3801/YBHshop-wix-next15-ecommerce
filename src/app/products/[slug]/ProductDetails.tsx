"use client";
import Badge from "@/components/ui/badge";
import { products } from "@wix/stores";
import React, { useState } from "react";
import ProductOptions from "./ProductOptions";
import { checkInStock, findVariant } from "@/lib/utils";
import ProductPrice from "./ProductPrice";
import ProductMedia from "./ProductMedia";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { InfoIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import AddToCartButton from "@/components/AddToCartButton";

interface ProductDetailsProps {
  product: products.Product;
}

const ProductDetails = ({ product }: ProductDetailsProps) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >(
    product.productOptions
      ?.map((option) => ({
        [option.name || ""]: option.choices?.[0]?.description || "",
      }))
      ?.reduce((acc, curr) => ({ ...acc, ...curr }), {}) || {},
  );

  const selectedVariables = findVariant(product, selectedOptions);
  const inStock = checkInStock(product, selectedOptions);

  const availableQuantity =
    selectedVariables?.stock?.quantity ?? product.stock?.quantity;

  const availableQuantityExceeded =
    !!availableQuantity && quantity > availableQuantity;

  const selectedOptionsMedia = product.productOptions?.flatMap((option) => {
    const selectedChoice = option.choices?.find(
      (choice) => choice.description === selectedOptions[option.name || ""],
    );
    return selectedChoice?.media?.items ?? [];
  });

  return (
    <div className="flex flex-col gap-10 md:flex-row lg:gap-20">
      <ProductMedia
        media={
          !!selectedOptionsMedia?.length
            ? selectedOptionsMedia
            : product.media?.items
        }
      ></ProductMedia>
      <div className="basis-3/5 space-y-5">
        <div className="space-y-2.5">
          <h1 className="text-3xl font-bold lg:text-4xl">{product.name}</h1>
          {product.brand && (
            <div className="text-muted-foreground">{product.brand}</div>
          )}
          {product.ribbon && <Badge className="block">{product.ribbon}</Badge>}
        </div>
        {product.description && (
          <div
            dangerouslySetInnerHTML={{ __html: product.description }}
            className="prose dark:prose-invert"
          />
        )}
        <ProductPrice
          product={product}
          selectedVariant={selectedVariables}
        ></ProductPrice>
        <ProductOptions
          selectedOptions={selectedOptions}
          setSelectedOptions={setSelectedOptions}
          product={product}
        ></ProductOptions>

        <div className="space-y-1.5">
          <Label htmlFor="quantity">Quantity</Label>
          <div className="flex items-center gap-2.5">
            <Input
              name="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-20"
              disabled={!inStock}
              min={1}
            />
            {!!availableQuantity &&
              (availableQuantityExceeded || availableQuantity < 10) && (
                <span className="text-destructive">
                  Only {availableQuantity} left in stock
                </span>
              )}
          </div>
        </div>
        {inStock ? (
          <AddToCartButton
            className="w-full"
            disabled={availableQuantityExceeded || quantity < 1}
            product={product}
            selectedOptions={selectedOptions}
            quantity={quantity}
          />
        ) : (
          "Out of stock"
        )}
        {!!product.additionalInfoSections?.length && (
          <div className="space-y-1.5 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <InfoIcon className="size-5" />
              <span>Additional Info about this product</span>
            </span>
            <Accordion type="multiple">
              {product.additionalInfoSections?.map((section) => (
                <AccordionItem
                  value={section.title || ""}
                  key={section.title || ""}
                >
                  <AccordionTrigger>{section.title}</AccordionTrigger>
                  <AccordionContent>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: section.description || "",
                      }}
                      className="prose text-sm text-muted-foreground"
                    ></div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
