import { getWixServerClient } from "@/lib/wix-client.server";
import { getLoggedInMember } from "@/wix-api/members";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";
import MemberInfoForm from "./MemberInfoForm";
import Orders from "./Orders";

export const metadata: Metadata = {
  title: "Profile",
  description: "Profile page",
};
const Page = async () => {
  const member = await getLoggedInMember(await getWixServerClient());
  if (!member) notFound();
  return (
    <main className="mx-auto max-w-2xl space-y-10 px-5 py-10">
      <h1 className="text-center text-3xl font-bold md:text-4xl">
        Your profile
      </h1>
      <MemberInfoForm member={member} />
      <Orders />
    </main>
  );
};

export default Page;
