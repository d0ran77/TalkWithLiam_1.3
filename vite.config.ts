import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig, Plugin} from 'vite';
import {FAQS} from './src/data/content.ts';
import {
  PAC_SCENARIOS,
  CORE_NODES,
  FUNCTIONAL_NODES,
  FUNCTIONAL_FOOTNOTE,
  PAC_YOUTUBE_SHORT,
} from './src/data/pacModel.ts';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

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
      'Two humans in a room. Grounded, direct, and relational counselling for individuals in Willerby, Hull, and online. Learn what happens when you sit down together.',
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
      'Grounded, direct, and relational counselling for individuals in Willerby, Hull, and online for £30 per 50-minute session.',
  },
  {
    route: 'pac-model',
    title: 'How We Work: The PAC Model (Transactional Analysis) | Talk with Liam',
    description:
      'Explore the Parent-Adult-Child (PAC) psychoeducation guide: Core ego states and Functional relational states (CP, NP, A, AC, FC) across conflict and boundaries with Liam Doran.',
    heading: 'How We Work: The PAC Model',
    summary:
      'Transactional Analysis psychoeducation guide by Liam Doran (UKCP Trainee Psychotherapeutic Counsellor) showing how Parent, Adult, and Child ego states operate internally and in relationships.',
  },
  {
    route: 'drama-triangle',
    title: "The Drama Triangle & Winner's Triangle | Talk with Liam",
    description:
      "Explore Stephen Karpman's Drama Triangle (Persecutor, Rescuer, Victim) and Acey Choy's Winner's Triangle (Assertive, Caring, Vulnerable) with real-life examples.",
    heading: 'The Drama Triangle',
    summary:
      'How we get stuck in repeating arguments and how to step off the loop: an interactive Transactional Analysis guide by Liam Doran.',
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

      const faqFallbackHtml = `<section><h2>Frequently Asked Questions</h2>${FAQS.map(
        (faq) =>
          `<article><h3>${escapeHtml(faq.question)}</h3><p>${escapeHtml(faq.answer)}</p></article>`,
      ).join('')}</section>`;

      const pacFallbackHtml = `<section><h2>What is the PAC Model?</h2><h3>A straightforward map of how you think, feel and react</h3><p>In Transactional Analysis, the PAC model breaks your personality down into three distinct parts: Parent, Adult and Child. Depending on what is happening in the room, you shift between these states.</p><p>Use the interactive model below to see how each part shows up in daily life and why your reactions can sometimes feel out of character.</p></section><section><h2>The Core Model (P-A-C)</h2><p>Transactional Analysis psychoeducation exploring internal Parent, Adult, and Child ego states across everyday relational situations.</p>${PAC_SCENARIOS.map(
        (scenario) =>
          `<article><h3>${escapeHtml(scenario.label)}</h3>${CORE_NODES.map(
            (node) =>
              `<div><h4>${escapeHtml(node.title)}</h4><blockquote>${escapeHtml(scenario.core[node.id].quote)}</blockquote><p>${escapeHtml(scenario.core[node.id].explanation)}</p></div>`,
          ).join('')}</article>`,
      ).join('')}</section><section><h2>In Relationship (Functional Ego States: CP, NP, A, AC, FC)</h2>${PAC_SCENARIOS.map(
        (scenario) =>
          `<article><h3>${escapeHtml(scenario.label)}</h3>${FUNCTIONAL_NODES.map(
            (node) =>
              `<div><h4>${escapeHtml(node.title)}</h4><blockquote>${escapeHtml(scenario.functional[node.id].quote)}</blockquote><p>${escapeHtml(scenario.functional[node.id].explanation)}</p></div>`,
          ).join('')}</article>`,
      ).join('')}<p>${escapeHtml(FUNCTIONAL_FOOTNOTE)}</p></section><section><h2>Short Video Explainer</h2><p><a href="${escapeHtml(PAC_YOUTUBE_SHORT.watchUrl)}">${escapeHtml(PAC_YOUTUBE_SHORT.title)}</a></p></section>`;

      const pacJsonLd = JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Article',
            '@id': 'https://talkwithliam.co.uk/pac-model#article',
            headline: 'How We Work: The PAC Model (Transactional Analysis Psychoeducation)',
            description:
              'Interactive psychoeducation guide to Transactional Analysis Parent, Adult, and Child ego states and how they express in relationships.',
            educationalUse: 'Psychoeducation',
            about: [
              'Transactional Analysis',
              'Parent Adult Child PAC Model',
              'Functional Ego States',
              'Relational Psychotherapy',
            ],
            author: {
              '@id': 'https://talkwithliam.co.uk/#practitioner',
            },
            publisher: {
              '@id': 'https://talkwithliam.co.uk/#business',
            },
            mainEntityOfPage: 'https://talkwithliam.co.uk/pac-model',
            inLanguage: 'en-GB',
          },
          {
            '@type': 'VideoObject',
            '@id': 'https://talkwithliam.co.uk/pac-model#video',
            name: PAC_YOUTUBE_SHORT.title,
            description:
              'A brief psychoeducational introduction by Liam Doran explaining how Parent, Adult, and Child ego states work in Transactional Analysis.',
            thumbnailUrl: PAC_YOUTUBE_SHORT.thumbnailUrl,
            contentUrl: PAC_YOUTUBE_SHORT.watchUrl,
            embedUrl: PAC_YOUTUBE_SHORT.embedUrl,
            uploadDate: '2026-01-01T00:00:00Z',
            author: {
              '@id': 'https://talkwithliam.co.uk/#practitioner',
            },
          },
        ],
      });

      const dramaFallbackHtml = `<section><h2>The Drama Triangle (The Trap)</h2><p>Stephen Karpman identified three roles we slip into during conflict: Persecutor, Rescuer and Victim.</p></section><section><h2>The Winner's Triangle (The Way Out)</h2><p>Acey Choy showed how each role shifts into grounded presence: Assertive, Caring and Vulnerable.</p></section>`;

      const dramaJsonLd = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        '@id': 'https://talkwithliam.co.uk/drama-triangle#article',
        headline: "The Drama Triangle & Winner's Triangle (Transactional Analysis)",
        description:
          "How we get stuck in repeating arguments and how to step off the loop using Stephen Karpman's Drama Triangle and Acey Choy's Winner's Triangle.",
        educationalUse: 'Psychoeducation',
        about: ['Transactional Analysis', 'Drama Triangle', "Winner's Triangle", 'Relational Psychotherapy'],
        author: { '@id': 'https://talkwithliam.co.uk/#practitioner' },
        publisher: { '@id': 'https://talkwithliam.co.uk/#business' },
        mainEntityOfPage: 'https://talkwithliam.co.uk/drama-triangle',
        inLanguage: 'en-GB',
      });

      for (const page of PUBLIC_ROUTE_PAGES) {
        const canonicalUrl = `https://talkwithliam.co.uk/${page.route}`;
        const extraBody =
          page.route === 'faq'
            ? faqFallbackHtml
            : page.route === 'pac-model'
              ? pacFallbackHtml
              : page.route === 'drama-triangle'
                ? dramaFallbackHtml
                : '';
        const seoFallback = `<div id="root"><main style="max-width:42rem;margin:3rem auto;padding:1.5rem;font-family:sans-serif;color:#18181B"><h1>${page.heading}</h1><p>${page.summary}</p>${extraBody}<nav><a href="/">Home</a> | <a href="/about">About Liam</a> | <a href="/how-we-work">How We Work</a> | <a href="/pac-model">The PAC Model</a> | <a href="/drama-triangle">The Drama Triangle</a> | <a href="/areas-of-work">Areas of Work</a> | <a href="/fees">Fees (£30)</a> | <a href="/contact">Contact</a> | <a href="/faq">FAQs</a></nav></main></div>`;
        let routeHtml = baseHtml
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

        if (page.route === 'pac-model') {
          routeHtml = routeHtml.replace(
            '</head>',
            `    <script type="application/ld+json">${pacJsonLd}</script>\n  </head>`,
          );
        } else if (page.route === 'drama-triangle') {
          routeHtml = routeHtml.replace(
            '</head>',
            `    <script type="application/ld+json">${dramaJsonLd}</script>\n  </head>`,
          );
        }

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
