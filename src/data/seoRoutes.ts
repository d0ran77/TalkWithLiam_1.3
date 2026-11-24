export interface SeoRouteMeta {
  route: string; // '' for root, or 'about', 'how-we-work', etc.
  breadcrumbLabel: string;
  title: string;
  description: string;
  heading: string;
  summary: string;
  ogImage?: string;
  ogImageAlt?: string;
}

export const SITE_BASE_URL = 'https://talkwithliam.co.uk';

export const ROOT_SEO_META: SeoRouteMeta = {
  route: '',
  breadcrumbLabel: 'Home',
  title: 'Counselling in Hull & Willerby | Talk With Liam - Psychotherapeutic Counselling',
  description:
    'Grounded, Adult-to-Adult psychotherapeutic counselling in Willerby (near Hull) and UK-wide online. £30 per session with a free initial consultation. No waiting lists.',
  heading: 'Talk With Liam - Psychotherapeutic Counselling',
  summary:
    'Grounded, direct, and relational psychotherapeutic counselling in Willerby, East Yorkshire (HU10 7UA) and UK-wide online with Liam Doran, UKCP Trainee Member.',
  ogImage: `${SITE_BASE_URL}/favicon1.jpeg`,
  ogImageAlt: 'Talk With Liam - Psychotherapeutic Counselling',
};

export const PUBLIC_ROUTE_PAGES: SeoRouteMeta[] = [
  {
    route: 'about',
    breadcrumbLabel: 'About Liam',
    title: 'About Liam Doran | Counselling in Willerby & Online',
    description:
      "Read Liam Doran's working-class roots, Ellesmere Centre training, Valued Minds placement & grounded therapy approach in Willerby, Hull and online.",
    heading: 'About Liam Doran',
    summary:
      'UKCP trainee psychotherapeutic counsellor based in Willerby, East Yorkshire and online UK-wide. Grounded, direct, and relational therapy.',
    ogImage: `${SITE_BASE_URL}/favicon1.jpeg`,
    ogImageAlt: 'About Liam Doran — Talk with Liam Psychotherapeutic Counselling',
  },
  {
    route: 'how-we-work',
    breadcrumbLabel: 'How We Work',
    title: 'How We Work | Transactional Analysis Therapy in Hull & Online | Talk With Liam',
    description:
      'Straightforward, human-to-human Transactional Analysis psychotherapy. Learn how sessions work in-person at Willerby Square or online across the UK.',
    heading: 'Two Humans in a Room',
    summary:
      'No pedestals and no scripts. Equal adult-to-adult relational therapy in Willerby, East Yorkshire and online across the UK.',
  },
  {
    route: 'approach',
    breadcrumbLabel: 'How We Work Together',
    title: 'Transactional Analysis Approach | Talk with Liam UK',
    description:
      'How relational Transactional Analysis helps untangle old survival scripts, nervous system overwhelm & repeating loops in Willerby and online UK-wide.',
    heading: 'How We Work Together',
    summary:
      'Grounded, integrative Transactional Analysis focusing on the real relationship in the room rather than worksheets.',
  },
  {
    route: 'areas-of-work',
    breadcrumbLabel: 'Areas of Work',
    title: 'Areas of Work: Anxiety, Burnout & Trauma | Liam Doran',
    description:
      'Support in Willerby, Hull & online UK-wide for anxiety, panic, burnout, low mood, grief, trauma & relationship patterns. £30 weekly sessions.',
    heading: 'Areas of Work',
    summary:
      'Practical, grounded support for anxiety, panic, relationship patterns, burnout, depression, and feeling stuck.',
  },
  {
    route: 'fees',
    breadcrumbLabel: 'Fees & Practice',
    title: 'Counselling Fees & Free Initial Consultation | Talk With Liam (Hull & Online)',
    description:
      'Transparent therapy fees: £30 per 50-minute session, concession slots available, and a free initial consultation in Willerby, Hull or online across the UK.',
    heading: 'Fees, Space & Our Mutual Agreement',
    summary:
      '£30 per 50-minute session in person at 1b The Square, Willerby (HU10 7UA) or online UK-wide. Free introductory consultation available.',
  },
  {
    route: 'contact',
    breadcrumbLabel: 'Contact',
    title: 'Contact & Free Intro Chat | Talk with Liam Willerby',
    description:
      'Message Liam Doran on WhatsApp, email talkwithliamtherapy@gmail.com, or call +44 7344 145282 for a free introductory chat in Willerby or online UK-wide.',
    heading: 'Get in Touch',
    summary:
      'Message on WhatsApp, email talkwithliamtherapy@gmail.com, or call +44 7344 145282 to arrange a free introductory consultation.',
  },
  {
    route: 'faq',
    breadcrumbLabel: 'FAQs & Guide',
    title: 'Counselling FAQs & Practice Guide | Liam Doran',
    description:
      'Answers on £30 fees, concessions, GP referrals, NHS medical records, 48-hour notice, accessibility at Willerby Square & what to expect in session one.',
    heading: 'Practice Guide & FAQs',
    summary:
      'Answers to common questions about starting therapy, privacy, GP referrals, and visiting The Willerby Practice.',
  },
  {
    route: 'slides',
    breadcrumbLabel: 'Practice Overview',
    title: 'Practice Overview | Talk with Liam Counselling UK',
    description:
      'Explore how we work, areas of focus, £30 fees, The Willerby Practice (HU10 7UA), online Google Meet sessions, FAQs & contact options with Liam Doran.',
    heading: 'Practice Overview',
    summary:
      'Grounded, direct, and relational counselling for individuals in Willerby, Hull, and online for £30 per 50-minute session.',
  },
  {
    route: 'pac-model',
    breadcrumbLabel: 'The PAC Model',
    title: 'The PAC Model: Transactional Analysis | Talk with Liam',
    description:
      'Interactive Transactional Analysis guide to Parent, Adult & Child ego states (P-A-C and CP, NP, A, AC, FC) across conflict & boundaries by Liam Doran.',
    heading: 'How We Work: The PAC Model',
    summary:
      'Transactional Analysis psychoeducation guide by Liam Doran (UKCP Trainee Psychotherapeutic Counsellor) showing how Parent, Adult, and Child ego states operate internally and in relationships.',
  },
  {
    route: 'drama-triangle',
    breadcrumbLabel: 'The Drama Triangle',
    title: "Drama Triangle & Winner's Triangle | Talk with Liam",
    description:
      "See how Persecutor, Rescuer and Victim roles loop in conflict, and how Assertive, Caring and Vulnerable responses help you step off.",
    heading: 'The Drama Triangle',
    summary:
      'How we get stuck in repeating arguments and how to step off the loop: an interactive Transactional Analysis guide by Liam Doran.',
  },
  {
    route: 'free-child',
    breadcrumbLabel: 'The Free Child',
    title: 'The Camera & The Free Child | Talk with Liam UK',
    description:
      "Transactional Analysis essay on Eric Berne's Free Child and Adapted Child ego states alongside 35mm street photography from Hull and East Yorkshire.",
    heading: 'The Camera and The Free Child',
    summary:
      'Transactional Analysis reflections on curiosity, spontaneity, and reclaiming the Free Child in everyday life.',
    ogImage: `${SITE_BASE_URL}/favicon1.jpeg`,
    ogImageAlt: 'The Camera and The Free Child — Talk with Liam',
  },
];

export const SLIDE_INDEX_TO_ROUTE = [
  'how-we-work',
  'approach',
  'areas-of-work',
  'fees',
  'contact',
  'faq',
] as const;

export function getSeoMetaForRoute(route: string): SeoRouteMeta {
  const normalized = route.replace(/^\/+|\/+$/g, '').toLowerCase();
  if (!normalized) return ROOT_SEO_META;
  return PUBLIC_ROUTE_PAGES.find((p) => p.route === normalized) || ROOT_SEO_META;
}
