import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig, Plugin} from 'vite';
import {PUBLIC_ROUTE_PAGES, SITE_BASE_URL} from './src/data/seoRoutes.ts';
import {
  escapeHtml,
  buildRouteBodyHtml,
  buildRouteFooterNavHtml,
  buildRouteJsonLd,
} from './src/data/seoPrerender.ts';

function generateRouteHtmlPages(): Plugin {
  return {
    name: 'generate-route-html-pages',
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      const indexHtmlPath = path.join(distDir, 'index.html');
      if (!fs.existsSync(indexHtmlPath)) return;

      const baseHtml = fs.readFileSync(indexHtmlPath, 'utf-8');
      const footerNavHtml = buildRouteFooterNavHtml();

      for (const page of PUBLIC_ROUTE_PAGES) {
        const canonicalUrl = `${SITE_BASE_URL}/${page.route}`;
        const safeTitle = escapeHtml(page.title);
        const safeDescription = escapeHtml(page.description);
        const safeHeading = escapeHtml(page.heading);
        const safeSummary = escapeHtml(page.summary);
        const safeCanonical = escapeHtml(canonicalUrl);
        const safeOgImage = escapeHtml(page.ogImage || `${SITE_BASE_URL}/favicon1.jpeg`);
        const safeOgImageAlt = escapeHtml(page.ogImageAlt || page.title);

        const bodyHtml = buildRouteBodyHtml(page.route);
        const seoFallback = `<div id="root"><main data-seo-fallback="true" style="max-width:46rem;margin:3rem auto;padding:1.5rem;font-family:sans-serif;color:#18181B"><h1>${safeHeading}</h1><p>${safeSummary}</p>${bodyHtml}${footerNavHtml}</main></div>`;

        let routeHtml = baseHtml
          .replace('<div id="root"></div>', seoFallback)
          .replace(/<title>[\s\S]*?<\/title>/, `<title>${safeTitle}</title>`)
          .replace(
            /<meta name="title" content="[^"]*"\s*\/?>/,
            `<meta name="title" content="${safeTitle}" />`,
          )
          .replace(
            /<meta name="description" content="[^"]*"\s*\/?>/,
            `<meta name="description" content="${safeDescription}" />`,
          )
          .replace(
            /<link rel="canonical" href="[^"]*"\s*\/?>/,
            `<link rel="canonical" href="${safeCanonical}" />`,
          )
          .replace(
            /<meta property="og:url" content="[^"]*"\s*\/?>/,
            `<meta property="og:url" content="${safeCanonical}" />`,
          )
          .replace(
            /<meta property="og:title" content="[^"]*"\s*\/?>/,
            `<meta property="og:title" content="${safeTitle}" />`,
          )
          .replace(
            /<meta property="og:description" content="[^"]*"\s*\/?>/,
            `<meta property="og:description" content="${safeDescription}" />`,
          )
          .replace(
            /<meta property="og:image" content="[^"]*"\s*\/?>/,
            `<meta property="og:image" content="${safeOgImage}" />`,
          )
          .replace(
            /<meta property="og:image:secure_url" content="[^"]*"\s*\/?>/,
            `<meta property="og:image:secure_url" content="${safeOgImage}" />`,
          )
          .replace(
            /<meta property="og:image:alt" content="[^"]*"\s*\/?>/,
            `<meta property="og:image:alt" content="${safeOgImageAlt}" />`,
          )
          .replace(
            /<meta name="twitter:url" content="[^"]*"\s*\/?>/,
            `<meta name="twitter:url" content="${safeCanonical}" />`,
          )
          .replace(
            /<meta name="twitter:title" content="[^"]*"\s*\/?>/,
            `<meta name="twitter:title" content="${safeTitle}" />`,
          )
          .replace(
            /<meta name="twitter:description" content="[^"]*"\s*\/?>/,
            `<meta name="twitter:description" content="${safeDescription}" />`,
          )
          .replace(
            /<meta name="twitter:image" content="[^"]*"\s*\/?>/,
            `<meta name="twitter:image" content="${safeOgImage}" />`,
          )
          .replace(
            /<meta name="twitter:image:alt" content="[^"]*"\s*\/?>/,
            `<meta name="twitter:image:alt" content="${safeOgImageAlt}" />`,
          );

        const routeJsonLd = buildRouteJsonLd(page.route);
        const routeJsonLdTag = `<script id="route-jsonld" type="application/ld+json">${routeJsonLd}</script>`;

        // Strip root FAQ JSON-LD block on sub-routes so only /faq carries FAQPage schema,
        // and inject this route's dedicated JSON-LD graph in its place.
        routeHtml = routeHtml.replace(
          /<!-- ROUTE_FAQ_JSONLD_START -->[\s\S]*?<!-- ROUTE_FAQ_JSONLD_END -->/,
          routeJsonLdTag,
        );

        const routeDir = path.join(distDir, page.route);
        fs.mkdirSync(routeDir, {recursive: true});
        fs.writeFileSync(path.join(routeDir, 'index.html'), routeHtml, 'utf-8');
      }

      const rootLandingFallback = `<div id="root"><main data-seo-fallback="true" style="max-width:46rem;margin:3rem auto;padding:1.5rem;font-family:sans-serif;color:#18181B"><h1>Talk with Liam &mdash; Psychotherapeutic Counselling</h1><p>Grounded, direct, and relational counselling for individuals in Willerby, Hull, and online. A straight-talking space to work through anxiety, burnout, trauma, or feeling stuck, starting with a free introductory chat.</p><blockquote><p>&ldquo;How can I best help you today? Is it by helping you solve a problem, by just listening, or by encouraging you to get things off your chest without interruption?&rdquo;</p><cite>&mdash; Prof. Windy Dryden</cite></blockquote>${footerNavHtml}</main></div>`;
      fs.writeFileSync(
        indexHtmlPath,
        baseHtml.replace('<div id="root"></div>', rootLandingFallback),
        'utf-8',
      );
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), generateRouteHtmlPages()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
