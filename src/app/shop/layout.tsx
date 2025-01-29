import { getWixServerClient } from "@/lib/wix-client.server";
import { getCollection } from "@/wix-api/collections";
import React from "react";
import SearchFilterLayout from "./SearchFilterLayout";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const collections = await getCollection(await getWixServerClient());
  return (
    <SearchFilterLayout collections={collections}>
      {children}
    </SearchFilterLayout>
  );
}
