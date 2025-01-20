import { Tokens } from "@wix/sdk";
import { getWixClient } from "./wix-client.base";
import { cookies } from "next/headers";
import { WIX_SESSION_COOKIE } from "./constants";

export async function getWixServerClient() {
  let tokens: Tokens | undefined;
  try {
    tokens = JSON.parse(
      (await cookies()).get(WIX_SESSION_COOKIE)?.value || "{}",
    );
  } catch (error) {}
  return getWixClient(tokens);
}
