"use client";
import Badge from "@/components/ui/badge";
import WixImage from "@/components/WixImage";
import { products } from "@wix/stores";
import React, { useState } from "react";
import ProductOptions from "./ProductOptions";
import { checkInStock, findVariant } from "@/lib/utils";
import ProductPrice from "./ProductPrice";
import ProductMedia from "./ProductMedia";

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
  return (
    <div className="flex flex-col gap-10 md:flex-row lg:gap-20">
      <ProductMedia media={product.media?.items}></ProductMedia>
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
        <div>Selected Options: {JSON.stringify(selectedOptions)}</div>
        <div>
          Selected variables: {JSON.stringify(selectedVariables?.choices)}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
