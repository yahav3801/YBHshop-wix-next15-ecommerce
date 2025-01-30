"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductsSort } from "@/wix-api/products";

import { collections } from "@wix/stores";
import { useRouter, useSearchParams } from "next/navigation";

import React, {
  useEffect,
  useOptimistic,
  useState,
  useTransition,
} from "react";

interface SearchFilterLayoutProps {
  collections: collections.Collection[];
  children: React.ReactNode;
}
const SearchFilterLayout = ({
  collections,
  children,
}: SearchFilterLayoutProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [optimisticFilters, setOptimisticFilters] = useOptimistic({
    collection: searchParams.getAll("collection"),
    price_min: searchParams.get("price_min") || undefined,
    price_max: searchParams.get("price_max") || undefined,
    sort: searchParams.get("sort") || undefined,
  });
  const [isPending, startTransition] = useTransition();
  function updateFilters(updates: Partial<typeof optimisticFilters>) {
    const newState = { ...optimisticFilters, ...updates };
    const newSearchParams = new URLSearchParams(searchParams);

    Object.entries(newState).forEach(([key, value]) => {
      newSearchParams.delete(key);
      if (Array.isArray(value)) {
        value.forEach((v) => newSearchParams.append(key, v));
      } else if (value) {
        newSearchParams.set(key, value);
      }
    });

    newSearchParams.delete("page");

    startTransition(() => {
      setOptimisticFilters(newState);
      router.push(`?${newSearchParams.toString()}`);
    });
  }
  return (
    <main className="group flex flex-col items-center justify-center gap-10 px-5 py-5 lg:flex-row lg:items-start">
      <aside
        data-pending={isPending ? "pending" : undefined}
        className="h-fit space-y-5 lg:sticky lg:top-10 lg:w-64"
      >
        <CollectionsFilter
          collections={collections}
          selectedCollectionIds={optimisticFilters.collection}
          updateCollectionIds={(collectionIds) =>
            updateFilters({ collection: collectionIds })
          }
        />
        <PriceFilter
          minDefaultInput={optimisticFilters.price_min}
          maxDefaultInput={optimisticFilters.price_max}
          updatePriceRange={(min, max) =>
            updateFilters({ price_min: min, price_max: max })
          }
        />
      </aside>
      <div className="w-full max-w-7xl space-y-5">
        <div className="flex justify-center lg:justify-end">
          <SortFilter
            sort={optimisticFilters.sort}
            updateSort={(sort) => updateFilters({ sort })}
          />
        </div>
        {children}
      </div>
    </main>
  );
};

export default SearchFilterLayout;

interface CollectionFilterProps {
  collections: collections.Collection[];
  selectedCollectionIds: string[];
  updateCollectionIds: (collectionIds: string[]) => void;
}

function CollectionsFilter({
  collections,
  selectedCollectionIds,
  updateCollectionIds,
}: CollectionFilterProps) {
  return (
    <div className="space-y-3">
      <div className="font-bold">Collections</div>
      <ul className="space-y-1.5">
        {collections.map((collection) => {
          const collectionId = collection._id;
          if (!collectionId) return null;
          return (
            <li key={collectionId}>
              <label className="flex cursor-pointer items-center gap-2 font-medium">
                <Checkbox
                  id={collectionId}
                  checked={selectedCollectionIds.includes(collectionId)}
                  onCheckedChange={(checked) => {
                    updateCollectionIds(
                      checked
                        ? [...selectedCollectionIds, collectionId]
                        : selectedCollectionIds.filter(
                            (id) => id !== collectionId,
                          ),
                    );
                  }}
                />
                <span className="line-clamp-1 break-all">
                  {collection.name}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
      {selectedCollectionIds.length > 0 && (
        <button
          onClick={() => updateCollectionIds([])}
          className="text-sm text-primary hover:underline"
        >
          Clear
        </button>
      )}
    </div>
  );
}

interface PriceFilterProps {
  minDefaultInput: string | undefined;
  maxDefaultInput: string | undefined;
  updatePriceRange: (min: string | undefined, max: string | undefined) => void;
}
function PriceFilter({
  minDefaultInput,
  maxDefaultInput,
  updatePriceRange,
}: PriceFilterProps) {
  const [minInput, setMinInput] = useState(minDefaultInput);
  const [maxInput, setMaxInput] = useState(maxDefaultInput);
  useEffect(() => {
    setMinInput(minDefaultInput || "");
    setMaxInput(maxDefaultInput || "");
  }, [minDefaultInput, maxDefaultInput]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    updatePriceRange(minInput, maxInput);
  }

  return (
    <div className="space-y-3">
      <div className="font-bold">Price range</div>
      <form onSubmit={onSubmit} className="flex items-center gap-2">
        <Input
          min={0}
          max={maxInput}
          type="number"
          value={minInput}
          name="min"
          placeholder="Min"
          onChange={(e) => setMinInput(e.target.value)}
          className="w-20"
        />
        <span>-</span>
        <Input
          min={minInput || 0}
          type="number"
          value={maxInput}
          name="max"
          placeholder="max"
          onChange={(e) => setMaxInput(e.target.value)}
          className="w-20"
        />
        <Button type="submit">Apply</Button>
      </form>
      {(!!minDefaultInput || !!maxDefaultInput) && (
        <button
          className="text-sm text-primary hover:underline"
          onClick={() => updatePriceRange(undefined, undefined)}
        >
          Clear
        </button>
      )}
    </div>
  );
}

interface sortFilterProps {
  sort: string | undefined;
  updateSort: (sort: ProductsSort) => void;
}
function SortFilter({ sort, updateSort }: sortFilterProps) {
  return (
    <Select value={sort || "last_updated"} onValueChange={updateSort}>
      <SelectTrigger className="w-fit gap-2 text-start">
        <span>
          Sort by: <SelectValue />
        </span>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="last_updated">Newest</SelectItem>
        <SelectItem value="price_asc">Price (low to high)</SelectItem>
        <SelectItem value="price_desc">Price (high to low)</SelectItem>
      </SelectContent>
    </Select>
  );
}
