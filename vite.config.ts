import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig, Plugin} from 'vite';

interface RouteMeta {
  route: string;
  title: string;
  description: string;
  heading: string;
  summary: string;
}

const PUBLIC_ROUTE_PAGES: RouteMeta[] = [
  {
    route: 'about',
    title: 'About Liam Doran | Psychotherapeutic Counselling in Willerby & Online',
    description:
      "Read Liam Doran's personal background, Ellesmere Centre training, and grounded, direct, relational approach to psychotherapy in Willerby, Hull, and online.",
    heading: 'About Liam Doran',
    summary:
      'UKCP trainee psychotherapeutic counsellor based in Willerby, East Yorkshire and online UK-wide. Grounded, direct, and relational therapy.',
  },
  {
    route: 'how-we-work',
    title: 'How We Work | Talk with Liam Counselling',
    description:
      'Two humans in a room. Grounded, direct, and relational counselling in Willerby, Hull, and online. Learn what happens when you sit down together.',
    heading: 'Two Humans in a Room',
    summary:
      'No pedestals and no scripts. Equal adult-to-adult relational therapy in Willerby, East Yorkshire and online across the UK.',
  },
  {
    route: 'approach',
    title: 'Relational Transactional Analysis Approach | Talk with Liam',
    description:
      'Explore how Transactional Analysis and relational psychotherapy help you spot old survival scripts and build real change in Willerby and online.',
    heading: 'How We Work Together',
    summary:
      'Grounded, integrative Transactional Analysis focusing on the real relationship in the room rather than worksheets.',
  },
  {
    route: 'areas-of-work',
    title: 'Areas of Work: Anxiety, Burnout & Trauma | Talk with Liam',
    description:
      'Grounded, direct counselling in Willerby, Hull, and online for anxiety, panic, burnout, trauma, relationship patterns, and feeling stuck.',
    heading: 'Areas of Work',
    summary:
      'Practical, grounded support for anxiety, panic, relationship patterns, burnout, depression, and feeling stuck.',
  },
  {
    route: 'fees',
    title: 'Fees (£30) & The Willerby Practice | Talk with Liam',
    description:
      'Transparent £30 per 50-minute counselling sessions in Willerby (HU10 7UA) and online via Google Meet, starting with a free introductory chat.',
    heading: 'Fees, Space & Our Mutual Agreement',
    summary:
      '£30 per 50-minute session in person at 1b The Square, Willerby or online UK-wide. Free introductory consultation available.',
  },
  {
    route: 'contact',
    title: 'Contact & Free Intro Chat | Talk with Liam',
    description:
      'Get in touch with Liam Doran by WhatsApp, phone (+44 7344 145282), or email to arrange a free introductory counselling chat in Willerby or online.',
    heading: 'Get in Touch',
    summary:
      'Message on WhatsApp, email talkwithliamtherapy@gmail.com, or call +44 7344 145282 to arrange a free introductory consultation.',
  },
  {
    route: 'faq',
    title: 'Practice Guide & FAQs | Talk with Liam',
    description:
      'Clear answers on confidentiality, NHS medical records, first consultations, accessibility at The Willerby Practice, and how relational therapy differs from worksheets.',
    heading: 'Practice Guide & FAQs',
    summary:
      'Answers to common questions about starting therapy, privacy, GP referrals, and visiting The Willerby Practice.',
  },
  {
    route: 'slides',
    title: 'Practice Overview | Talk with Liam Counselling',
    description:
      'Browse how we work, areas of work, £30 session fees, Willerby and online details, contact options, and FAQs for Talk with Liam.',
    heading: 'Practice Overview',
    summary:
      'Grounded, direct, and relational counselling in Willerby, Hull, and online for £30 per 50-minute session.',
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
        const seoFallback = `<div id="root"><main style="max-width:42rem;margin:3rem auto;padding:1.5rem;font-family:sans-serif;color:#18181B"><h1>${page.heading}</h1><p>${page.summary}</p><nav><a href="/">Home</a> | <a href="/about">About Liam</a> | <a href="/how-we-work">How We Work</a> | <a href="/areas-of-work">Areas of Work</a> | <a href="/fees">Fees (£30)</a> | <a href="/contact">Contact</a> | <a href="/faq">FAQs</a></nav></main></div>`;
        const routeHtml = baseHtml
          .replace('<div id="root"></div>', seoFallback)
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
