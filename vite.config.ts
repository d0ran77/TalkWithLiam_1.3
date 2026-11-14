import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig, Plugin} from 'vite';

interface RouteMeta {
  route: string;
  title: string;
  description: string;
}

const PUBLIC_ROUTE_PAGES: RouteMeta[] = [
  {
    route: 'slides',
    title: 'How We Work & Practice Guide | Talk with Liam',
    description:
      'Explore how relational Transactional Analysis therapy works with Liam Doran: areas of work, £30 sessions, Willerby & online availability, and FAQs.',
  },
  {
    route: 'about',
    title: 'About Liam Doran — Psychotherapeutic Counsellor',
    description:
      "Read Liam Doran's background, Ellesmere Centre training, relational philosophy, and UKCP-aligned psychotherapy practice in Willerby & online.",
  },
  {
    route: 'free-child',
    title: 'The Camera & The Free Child | Talk with Liam',
    description:
      'Visual monograph and Transactional Analysis reflections on spontaneity, presence, and the Free Child by Liam Doran.',
  },
  {
    route: 'diary',
    title: 'Availability & Booking Diary | Talk with Liam',
    description:
      'View live in-person (The Willerby Practice, East Yorkshire) and online Google Meet appointment availability with Liam Doran.',
  },
];

function generateRouteHtmlPages(): Plugin {
  return {
    name: 'generate-route-html-pages',
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      const indexHtmlPath = path.join(distDir, 'index.html');
      if (!fs.existsSync(indexHtmlPath)) return;

      const baseHtml = fs.readFileSync(indexHtmlPath, 'utf-8');

      for (const page of PUBLIC_ROUTE_PAGES) {
        const canonicalUrl = `https://talkwithliam.co.uk/${page.route}`;
        const routeHtml = baseHtml
          .replace(
            /<title>[\s\S]*?<\/title>/,
            `<title>${page.title}</title>`,
          )
          .replace(
            /<meta name="title" content="[^"]*"\s*\/?>/,
            `<meta name="title" content="${page.title}" />`,
          )
          .replace(
            /<meta name="description" content="[^"]*"\s*\/?>/,
            `<meta name="description" content="${page.description}" />`,
          )
          .replace(
            /<link rel="canonical" href="[^"]*"\s*\/?>/,
            `<link rel="canonical" href="${canonicalUrl}" />`,
          )
          .replace(
            /<meta property="og:url" content="[^"]*"\s*\/?>/,
            `<meta property="og:url" content="${canonicalUrl}" />`,
          )
          .replace(
            /<meta property="og:title" content="[^"]*"\s*\/?>/,
            `<meta property="og:title" content="${page.title}" />`,
          )
          .replace(
            /<meta property="og:description" content="[^"]*"\s*\/?>/,
            `<meta property="og:description" content="${page.description}" />`,
          )
          .replace(
            /<meta name="twitter:url" content="[^"]*"\s*\/?>/,
            `<meta name="twitter:url" content="${canonicalUrl}" />`,
          )
          .replace(
            /<meta name="twitter:title" content="[^"]*"\s*\/?>/,
            `<meta name="twitter:title" content="${page.title}" />`,
          )
          .replace(
            /<meta name="twitter:description" content="[^"]*"\s*\/?>/,
            `<meta name="twitter:description" content="${page.description}" />`,
          );

        const routeDir = path.join(distDir, page.route);
        fs.mkdirSync(routeDir, {recursive: true});
        fs.writeFileSync(path.join(routeDir, 'index.html'), routeHtml, 'utf-8');
      }
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
