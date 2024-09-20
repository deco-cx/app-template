import { setupGithooks } from "https://deno.land/x/githooks@0.0.4/githooks.ts";

await setupGithooks();

const generateDeco = () => import("jsr:@deco/deco/scripts/bundle");

await generateDeco();
