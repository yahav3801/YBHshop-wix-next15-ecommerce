import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
export const env = createEnv({
  server: {
    WIX_API_KEY: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_BASE_URL: z.string().url(),
    NEXT_PUBLIC_WIX_CLIENT_ID: z.string().min(1),
    NEXT_PUBLIC_WIX_SITE_ID: z.string().min(1),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_WIX_CLIENT_ID: process.env.NEXT_PUBLIC_WIX_CLIENT_ID,
    NEXT_PUBLIC_WIX_SITE_ID: process.env.NEXT_PUBLIC_WIX_SITE_ID,
  },
});
