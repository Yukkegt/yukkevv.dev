import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import db from "@astrojs/db";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  adapter: cloudflare(),
  output: 'server',
  site: 'https://yukkevv.dev',
  integrations: [mdx(), sitemap(), db()]
});