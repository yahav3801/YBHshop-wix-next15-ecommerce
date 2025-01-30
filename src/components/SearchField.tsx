"use client";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Input } from "./ui/input";
import { SearchIcon, X } from "lucide-react";
import { Button } from "./ui/button";

interface SearchFieldProps {
  className?: string;
}

const SearchField = ({ className }: SearchFieldProps) => {
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const q = (form.q as HTMLInputElement).value.trim();

    router.push(`/shop?q=${encodeURIComponent(q)}`);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value);
  }

  return (
    <form
      onSubmit={handleSubmit}
      onReset={() => setInputValue("")}
      method="GET"
      action={"/shop"}
      className={cn("grow", className)}
    >
      <div className="relative">
        <Input
          name="q"
          placeholder="Search"
          className="pe-16"
          value={inputValue}
          onChange={handleInputChange}
        />
        <div>
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 transform text-muted-foreground"
          >
            <SearchIcon className="size-5" />
          </button>

          {inputValue && (
            <button
              type="reset"
              className="absolute right-9 top-1/2 -translate-y-1/2 transform text-muted-foreground"
            >
              <X className="size-5" />
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

export default SearchField;
