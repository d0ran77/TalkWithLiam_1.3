import {
  SLIDES,
  FAQS,
  SPECIALISMS,
  MODALITIES,
  APPROACH_EXPLAINERS,
  PRACTICAL_DETAILS,
} from './content.ts';
import {
  PAC_SCENARIOS,
  CORE_NODES,
  FUNCTIONAL_NODES,
  FUNCTIONAL_FOOTNOTE,
  PAC_YOUTUBE_SHORT,
} from './pacModel.ts';
import {
  DRAMA_INTRO,
  DRAMA_ROLES,
  WINNER_ROLES,
  DRAMA_SCENARIOS,
} from './dramaTriangle.ts';
import { PHOTOS } from './photos.ts';
import { PUBLIC_ROUTE_PAGES, SITE_BASE_URL, getSeoMetaForRoute } from './seoRoutes.ts';

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderAboutBody(): string {
  return `
    <article>
      <section>
        <h2>Roots &amp; Finding Equal Ground</h2>
        <p>I grew up in Rotherham in a working-class community where the unwritten rule was simple: keep your head down, do not make a fuss, and do not take up too much space. Being visible carried risk, so I learned early on that withdrawing and blending into the background was the safest way to get by.</p>
        <p>When I first walked into the Ellesmere Centre in Hull to start my psychotherapy training, that old voice was loud. I assumed everyone else came with years in mental health and heavy academic backgrounds. Instead, the room was full of ordinary, grounded people from varied backgrounds learning to sit with themselves and each other as equals.</p>
      </section>
      <section>
        <h2>Personal Therapy &amp; Coming to This Work at Nearly 50</h2>
        <p>My training put me into my own personal therapy. If you go to the gym to look after your body, why would you not do the same for your mind? I came to this work at nearly 50 after living a full, messy life. I know what it feels like when relationships hit the rocks. Very little shocks me, and you will not get awkward nodding or textbook answers from me.</p>
      </section>
      <section>
        <h2>Clinical Placement: Valued Minds &amp; Regular Supervision</h2>
        <p>In my second year, I started a clinical placement at Valued Minds in Hull and completed over 100 hours of clinical work. Sitting with people while they share their most personal experiences is an honour. As an advanced UKCP trainee, I attend regular clinical supervision with an experienced supervisor to ensure ethical oversight behind the scenes.</p>
      </section>
      <section>
        <h2>Holding Space &amp; Working Together</h2>
        <p>I reject the urge to rescue or hand out quick advice, because stepping in to fix someone discounts their own capacity. My role is to hold a steady, reliable space where grief, anger, panic, or quiet joy are welcomed without judgment.</p>
        <blockquote>&ldquo;My past may have defined who I became, but my presence will liberate me.&rdquo; &mdash; Liam Doran</blockquote>
      </section>
      <section>
        <h2>Peer Reflections</h2>
        <blockquote>&ldquo;Liam creates a warm, accepting space where I always feel genuinely heard and understood. Rather than offering quick fixes, Liam listens and helps explore experiences with curiosity and compassion.&rdquo; &mdash; Trainee Psychotherapist, Peer Consultation</blockquote>
        <blockquote>&ldquo;Liam is a creative thinker who thoughtfully integrates new ideas into his practice while remaining reflective and curious. His combination of warmth and quiet groundedness makes him a pleasure to work with.&rdquo; &mdash; Colleague Feedback, The Ellesmere Centre</blockquote>
      </section>
      <section>
        <h2>Professional Standards &amp; Practice Details</h2>
        <p>UKCP Trainee Psychotherapeutic Counsellor practising in person at ${escapeHtml(PRACTICAL_DETAILS.clinicLocations[0].address)} and UK-wide online via Google Meet. 50-minute weekly sessions are £30, starting with a free introductory consultation.</p>
      </section>
    </article>
  `;
}

function renderHowWeWorkBody(): string {
  return `
    <article>
      <section>
        <h2>Two Humans in a Room</h2>
        <p>Therapy is simply two human beings sitting down together in a quiet room, meeting with honest, unhurried presence. We all carry survival strategies, defences, and scripts built during childhood to keep ourselves safe. My goal is to provide a space dependable enough that you can gently begin to set that weight down.</p>
        <blockquote>&ldquo;I bring a lifetime of lived experience into the therapy room. It has helped me connect with everyone I have worked with so far.&rdquo; &mdash; Liam Doran</blockquote>
      </section>
      <section>
        <h2>Three Core Principles</h2>
        <h3>No Pedestals (Equals)</h3>
        <p>I am a human being, just like you. No silent nodding and no talking down to you. There is no judgement here, and the door is open for any conversation. We work as equal partners, taking an honest look at what hurts.</p>
        <h3>A Safe Container</h3>
        <p>Whether you carry deep fatigue, hidden grief, or anxiety that makes you want to withdraw, there is steady room for all of it.</p>
        <h3>Real Meeting</h3>
        <p>I bring my whole self, including my working-class roots and lived experience, so you can practice being seen without having to perform.</p>
      </section>
      <section>
        <h2>Where We Meet</h2>
        <p>In-person counselling at The Willerby Practice, 1b The Square, Willerby, East Yorkshire (HU10 7UA)—convenient for Hull, Cottingham, Hessle, Anlaby, North Ferriby, Swanland, and Beverley—and UK-wide online therapy via Google Meet.</p>
      </section>
    </article>
  `;
}

function renderApproachBody(): string {
  return `
    <article>
      <section>
        <h2>Real Connection. No Formulas, No Blank Screens.</h2>
        <p>I work relationally using Transactional Analysis and humanistic principles. Rather than handing you generic worksheets or ticking diagnostic boxes, we sit down to understand what is happening in your life in real time.</p>
        <blockquote>&ldquo;This work is more than just theory; it is about being human and real.&rdquo; &mdash; Liam Doran</blockquote>
      </section>
      <section>
        <h2>How We Work Together</h2>
        <h3>1. Collaborating as Equals (I&rsquo;m OK, You&rsquo;re OK)</h3>
        <p>We meet on level ground and explicitly reject the urge to rescue or fix you. We work together as equal partners on what you want to change.</p>
        <h3>2. Making Sense of Old Blueprints (Scripts)</h3>
        <p>The coping strategies that kept you safe growing up often become invisible scripts in adulthood. We explore those patterns with gentle curiosity so old defences can be updated.</p>
        <h3>3. Room for the Quiet &amp; the Nervous System</h3>
        <p>Shifts often happen when we stop forcing answers, use breath, and give your nervous system permission to settle down from high alert.</p>
      </section>
      <section>
        <h2>What to Expect in Session One</h2>
        <ul>
          <li><strong>No prepared speech:</strong> Starting with &ldquo;things just feel off&rdquo; is plenty.</li>
          <li><strong>An unhurried pace:</strong> No ticking countdown or rapid-fire questioning.</li>
          <li><strong>A straightforward conversation:</strong> What brought you in, what you want to change, and how we work together.</li>
          <li><strong>No pressure:</strong> You set the pace, and we do not rush into heavy history until you feel ready.</li>
        </ul>
      </section>
      <section>
        <h2>Relational Patterns We Explore</h2>
        ${APPROACH_EXPLAINERS.map(
          (item) => `
            <article>
              <h3>${escapeHtml(item.topic)}</h3>
              <p><em>${escapeHtml(item.subtitle)}</em></p>
              <p><strong>The pattern:</strong> ${escapeHtml(item.thePattern)}</p>
              <p><strong>In the room:</strong> ${escapeHtml(item.inTheRoom)}</p>
              <p><strong>The shift:</strong> ${escapeHtml(item.theShift)}</p>
            </article>
          `,
        ).join('')}
      </section>
    </article>
  `;
}

function renderAreasOfWorkBody(): string {
  return `
    <article>
      <section>
        <h2>Practical, Grounded Support for Real Life</h2>
        <p>Every emotional struggle usually starts as a survival strategy that made sense at the time. We work together to untangle old scripts and patterns that leave you feeling stuck, exhausted, or on edge.</p>
      </section>
      <section>
        <h2>Core Areas of Work</h2>
        ${SPECIALISMS.map(
          (item) => `
            <article>
              <h3>${item.number}. ${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.subtitle)}</p>
              <p><strong>In the room:</strong> ${escapeHtml(item.howWeWork)}</p>
            </article>
          `,
        ).join('')}
      </section>
      <section>
        <h2>Therapeutic Modalities Integrated</h2>
        ${MODALITIES.map(
          (mod) => `
            <article>
              <h3>${escapeHtml(mod.title)} &mdash; ${escapeHtml(mod.subtitle)}</h3>
              <p>${escapeHtml(mod.description)} ${escapeHtml(mod.focus)}</p>
            </article>
          `,
        ).join('')}
      </section>
    </article>
  `;
}

function renderFeesBody(): string {
  return `
    <article>
      <section>
        <h2>Transparent, Consistent &amp; Dependable Support</h2>
        <p>As a UKCP trainee in the final stages of advanced clinical training (qualifying July 2027), I offer fully supervised, high-quality individual psychotherapy at £30 per 50-minute session.</p>
      </section>
      <section>
        <h2>In-Person &amp; Online Formats</h2>
        <h3>In-Person Therapy &mdash; £30 per 50-minute session</h3>
        <address>The Willerby Practice, 1b The Square, Willerby, East Yorkshire, HU10 7UA</address>
        <p>A calm, discreet consulting room on the second floor (access via stairs; no lift). Free parking is available in Willerby Square beside Sainsbury&rsquo;s Local and along adjacent bays, with quick links from Hull, Cottingham, Hessle, Kirk Ella, Anlaby, North Ferriby, Swanland, and Beverley (bus routes 54, 56, 66, 154, X46).</p>
        <h3>Online Therapy UK-Wide &mdash; £30 per 50-minute session</h3>
        <p>Secure, confidential video counselling via Google Meet across the United Kingdom, offering identical depth without travel.</p>
      </section>
      <section>
        <h2>Our Mutual Agreement</h2>
        <dl>
          <dt>Initial Free Consultation</dt>
          <dd>An informal introductory video chat to meet, ask questions, and check fit with zero obligation.</dd>
          <dt>Concession &amp; Sliding-Scale Slots</dt>
          <dd>${escapeHtml(PRACTICAL_DETAILS.rates.concessions)}.</dd>
          <dt>48-Hour Notice Policy</dt>
          <dd>Weekly continuity keeps the work steady; cancellations or rescheduling require 48 hours&rsquo; notice.</dd>
        </dl>
      </section>
    </article>
  `;
}

function renderContactBody(): string {
  return `
    <article>
      <section>
        <h2>Arrange a Free Introductory Consultation</h2>
        <p>You can get in touch directly by email, WhatsApp, phone, or enquiry form for Face-to-Face sessions in Willerby / Hull or Online Video therapy UK-wide.</p>
        <dl>
          <dt>Email</dt>
          <dd><a href="mailto:${escapeHtml(PRACTICAL_DETAILS.email)}">${escapeHtml(PRACTICAL_DETAILS.email)}</a></dd>
          <dt>Phone &amp; SMS</dt>
          <dd><a href="tel:${escapeHtml(PRACTICAL_DETAILS.phoneRaw)}">${escapeHtml(PRACTICAL_DETAILS.phoneDisplay)}</a></dd>
          <dt>WhatsApp</dt>
          <dd><a href="${escapeHtml(PRACTICAL_DETAILS.social.whatsapp)}">Message Liam on WhatsApp</a></dd>
          <dt>In-Person Practice</dt>
          <dd>${escapeHtml(PRACTICAL_DETAILS.clinicLocations[0].address)} (${escapeHtml(PRACTICAL_DETAILS.clinicLocations[0].stations)})</dd>
          <dt>Online Practice</dt>
          <dd>Google Meet Video Sessions &mdash; Monday to Friday, UK-wide</dd>
        </dl>
      </section>
      <section>
        <h2>Confidentiality &amp; Crisis Signposting</h2>
        <p>All enquiries are strictly confidential under the UKCP Ethical Framework and UK GDPR. If you need immediate crisis support right now:</p>
        <ul>
          ${PRACTICAL_DETAILS.emergencyResources
            .map(
              (res) =>
                `<li><strong>${escapeHtml(res.name)}:</strong> ${escapeHtml(res.contact)} &mdash; ${escapeHtml(res.description)}</li>`,
            )
            .join('')}
        </ul>
      </section>
    </article>
  `;
}

function renderFaqBody(): string {
  const categories = ['Getting Started', 'Fees & Policies', 'Confidentiality', 'How Sessions Work'] as const;
  return `
    <article>
      ${categories
        .map((cat) => {
          const items = FAQS.filter((f) => f.category === cat);
          return `
            <section>
              <h2>${escapeHtml(cat)}</h2>
              ${items
                .map(
                  (faq) =>
                    `<article><h3>${escapeHtml(faq.question)}</h3><p>${escapeHtml(faq.answer)}</p></article>`,
                )
                .join('')}
            </section>
          `;
        })
        .join('')}
    </article>
  `;
}

function renderSlidesOverviewBody(): string {
  return `
    <article>
      <section>
        <h2>Practice Chapters</h2>
        <ol>
          ${SLIDES.map(
            (slide) =>
              `<li><strong>${escapeHtml(slide.title)}:</strong> ${escapeHtml(slide.headline)}</li>`,
          ).join('')}
        </ol>
      </section>
      ${renderHowWeWorkBody()}
      ${renderAreasOfWorkBody()}
      ${renderFeesBody()}
    </article>
  `;
}

function renderPacModelBody(): string {
  return `
    <article>
      <section>
        <h2>What is the PAC Model?</h2>
        <h3>A straightforward map of how you think, feel and react</h3>
        <p>In Transactional Analysis, the PAC model breaks your personality down into three distinct parts: Parent, Adult and Child. Depending on what is happening in the room, you shift between these states.</p>
        <p>Use the interactive model below to see how each part shows up in daily life and why your reactions can sometimes feel out of character.</p>
      </section>
      <section>
        <h2>The Core Model (P-A-C)</h2>
        <p>Transactional Analysis psychoeducation exploring internal Parent, Adult, and Child ego states across everyday relational situations.</p>
        ${PAC_SCENARIOS.map(
          (scenario) =>
            `<article><h3>${escapeHtml(scenario.label)}</h3>${CORE_NODES.map(
              (node) =>
                `<div><h4>${escapeHtml(node.title)}</h4><blockquote>${escapeHtml(scenario.core[node.id].quote)}</blockquote><p>${escapeHtml(scenario.core[node.id].explanation)}</p></div>`,
            ).join('')}</article>`,
        ).join('')}
      </section>
      <section>
        <h2>In Relationship (Functional Ego States: CP, NP, A, AC, FC)</h2>
        ${PAC_SCENARIOS.map(
          (scenario) =>
            `<article><h3>${escapeHtml(scenario.label)}</h3>${FUNCTIONAL_NODES.map(
              (node) =>
                `<div><h4>${escapeHtml(node.title)}</h4><blockquote>${escapeHtml(scenario.functional[node.id].quote)}</blockquote><p>${escapeHtml(scenario.functional[node.id].explanation)}</p></div>`,
            ).join('')}</article>`,
        ).join('')}
        <p>${escapeHtml(FUNCTIONAL_FOOTNOTE)}</p>
      </section>
      <section>
        <h2>Short Video Explainer</h2>
        <p><a href="${escapeHtml(PAC_YOUTUBE_SHORT.watchUrl)}">${escapeHtml(PAC_YOUTUBE_SHORT.title)}</a></p>
      </section>
    </article>
  `;
}

function renderDramaTriangleBody(): string {
  const dramaRoles = Object.values(DRAMA_ROLES);
  const winnerRoles = Object.values(WINNER_ROLES);
  return `
    <article>
      <section>
        <h2>${escapeHtml(DRAMA_INTRO.subtitle)}</h2>
        ${DRAMA_INTRO.paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join('')}
      </section>
      <section>
        <h2>The Drama Triangle (The Trap)</h2>
        ${dramaRoles
          .map(
            (role) => `
              <article>
                <h3>${escapeHtml(role.name)} &mdash; ${escapeHtml(role.tagline)}</h3>
                <p><strong>What it looks like:</strong> ${escapeHtml(role.looksLike)}</p>
                <p><strong>${escapeHtml(role.hiddenCostLabel)}:</strong> ${escapeHtml(role.hiddenCost)}</p>
                ${
                  role.shiftTitle
                    ? `<p><strong>${escapeHtml(role.shiftTitle)}:</strong> ${escapeHtml(role.shiftSubtitle || '')}</p>`
                    : ''
                }
              </article>
            `,
          )
          .join('')}
      </section>
      <section>
        <h2>The Winner&rsquo;s Triangle (The Way Out)</h2>
        ${winnerRoles
          .map(
            (role) => `
              <article>
                <h3>${escapeHtml(role.name)} &mdash; ${escapeHtml(role.tagline)}</h3>
                <p><strong>What it looks like:</strong> ${escapeHtml(role.looksLike)}</p>
                <p><strong>${escapeHtml(role.hiddenCostLabel)}:</strong> ${escapeHtml(role.hiddenCost)}</p>
              </article>
            `,
          )
          .join('')}
      </section>
      <section>
        <h2>Real-Life Scenarios: Same Moment, Two Completely Different Conversations</h2>
        ${DRAMA_SCENARIOS.map(
          (scenario) => `
            <article>
              <h3>${escapeHtml(scenario.label)}</h3>
              <p>${escapeHtml(scenario.context)}</p>
              <h4>In The Drama Triangle (The Trap)</h4>
              <ol>
                ${scenario.dramaSteps
                  .map(
                    (s) =>
                      `<li><strong>${escapeHtml(s.step)} (${escapeHtml(s.roleLabel)}):</strong> ${escapeHtml(s.line)}</li>`,
                  )
                  .join('')}
              </ol>
              <h4>In The Winner&rsquo;s Triangle (The Way Out)</h4>
              <ol>
                ${scenario.winnerSteps
                  .map(
                    (s) =>
                      `<li><strong>${escapeHtml(s.step)} (${escapeHtml(s.roleLabel)}):</strong> ${escapeHtml(s.line)}</li>`,
                  )
                  .join('')}
              </ol>
              <p>${escapeHtml(scenario.takeaway)}</p>
            </article>
          `,
        ).join('')}
      </section>
      <section>
        <h2>Working With Relationship Loops in Therapy</h2>
        <p>Spotting which corner of the triangle you reach for under pressure isn&rsquo;t about judging yourself. Sessions are £30 (in-person at The Willerby Practice, HU10 7UA or online UK-wide), starting with a free initial chat.</p>
      </section>
    </article>
  `;
}

function renderFreeChildBody(): string {
  return `
    <article>
      <section>
        <h2>1. The World Before the Mask &mdash; Childhood as an Unscripted Expedition</h2>
        <p>Think back to childhood&mdash;not the idealised, sepia-tinted version, but the visceral reality. Bruised knees from falling off bikes, hands covered in dirt, breathless curiosity, and fierce loyalties.</p>
        <p>In Transactional Analysis (TA), this state is called the Free Child (or Natural Child). It is the part of each of us capable of direct feeling, joyful wonder, belly laughter, grief, and uninhibited spontaneity.</p>
      </section>
      <section>
        <h2>2. Putting the Armor On &mdash; The Exhaustion of the Adapted Child</h2>
        <p>Then we learn how to survive. The Adapted Child develops protective survival scripts: &ldquo;Be Perfect,&rdquo; &ldquo;Please Others,&rdquo; or &ldquo;Be Strong.&rdquo; These adaptations were brilliant strategies to keep us safe when we were small, yet many of us grow into adulthood and never take the armor off.</p>
      </section>
      <section>
        <h2>3. The Discipline of 35mm Film &mdash; Learning to Surrender Control</h2>
        <p>This is why I shoot manual 35mm mechanical film. A 35mm camera gives you 36 exposures and no screen. You tolerate grain, light leaks, and the fact that you cannot control the outcome. It is a physical exercise in letting go of perfectionism and meeting the world as it actually is.</p>
      </section>
      <section>
        <h2>4. Down Here, It&rsquo;s Our Time &mdash; Bringing the Free Child into the Room</h2>
        <p>When you step into the consulting room in Willerby (HU10 7UA) or join on video, the performance stops. You are invited to set down the backpack of the competent adult in a safe container where tears, quiet anger, and long-forgotten spontaneity are welcome.</p>
      </section>
      <section>
        <h2>Analogue 35mm Photography Stills</h2>
        ${PHOTOS.map(
          (photo) => `
            <article>
              <h3>${escapeHtml(photo.title)} (${escapeHtml(photo.location)})</h3>
              <p><strong>${escapeHtml(photo.captionTitle)}</strong> ${escapeHtml(photo.captionText)} ${escapeHtml(photo.fullDescription || '')}</p>
            </article>
          `,
        ).join('')}
      </section>
    </article>
  `;
}

export function buildRouteBodyHtml(route: string): string {
  switch (route) {
    case 'about':
      return renderAboutBody();
    case 'how-we-work':
      return renderHowWeWorkBody();
    case 'approach':
      return renderApproachBody();
    case 'areas-of-work':
      return renderAreasOfWorkBody();
    case 'fees':
      return renderFeesBody();
    case 'contact':
      return renderContactBody();
    case 'faq':
      return renderFaqBody();
    case 'slides':
      return renderSlidesOverviewBody();
    case 'pac-model':
      return renderPacModelBody();
    case 'drama-triangle':
      return renderDramaTriangleBody();
    case 'free-child':
      return renderFreeChildBody();
    default:
      return '';
  }
}

export function buildRouteFooterNavHtml(): string {
  const links = [
    `<a href="/">Home</a>`,
    ...PUBLIC_ROUTE_PAGES.map(
      (p) => `<a href="/${escapeHtml(p.route)}">${escapeHtml(p.breadcrumbLabel)}</a>`,
    ),
  ];
  return `<nav aria-label="Site sections" style="margin-top:2rem;padding-top:1rem;border-top:1px solid #e4e4e7">${links.join(' | ')}</nav>`;
}

export function buildRouteJsonLd(route: string): string {
  const meta = getSeoMetaForRoute(route);
  const pageUrl = `${SITE_BASE_URL}/${route}`;
  const breadcrumb = {
    '@type': 'BreadcrumbList',
    '@id': `${pageUrl}#breadcrumb`,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${SITE_BASE_URL}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: meta.breadcrumbLabel,
        item: pageUrl,
      },
    ],
  };

  if (route === 'about') {
    return JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        breadcrumb,
        {
          '@type': ['AboutPage', 'ProfilePage'],
          '@id': `${pageUrl}#webpage`,
          url: pageUrl,
          name: meta.title,
          description: meta.description,
          inLanguage: 'en-GB',
          mainEntity: { '@id': `${SITE_BASE_URL}/#practitioner` },
          primaryImageOfPage: {
            '@type': 'ImageObject',
            url: `${SITE_BASE_URL}/potrait.webp`,
            caption: 'Liam Doran — UKCP Trainee Psychotherapeutic Counsellor',
          },
          breadcrumb: { '@id': `${pageUrl}#breadcrumb` },
        },
      ],
    });
  }

  if (route === 'areas-of-work') {
    return JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        breadcrumb,
        {
          '@type': 'MedicalWebPage',
          '@id': `${pageUrl}#webpage`,
          url: pageUrl,
          name: meta.title,
          description: meta.description,
          inLanguage: 'en-GB',
          about: SPECIALISMS.map((s) => ({
            '@type': 'MedicalCondition',
            name: s.title,
            description: `${s.subtitle} ${s.howWeWork}`,
          })),
          author: { '@id': `${SITE_BASE_URL}/#practitioner` },
          breadcrumb: { '@id': `${pageUrl}#breadcrumb` },
        },
      ],
    });
  }

  if (route === 'fees') {
    return JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        breadcrumb,
        {
          '@type': 'WebPage',
          '@id': `${pageUrl}#webpage`,
          url: pageUrl,
          name: meta.title,
          description: meta.description,
          inLanguage: 'en-GB',
          mainEntity: { '@id': `${SITE_BASE_URL}/#business` },
          breadcrumb: { '@id': `${pageUrl}#breadcrumb` },
        },
      ],
    });
  }

  if (route === 'contact') {
    return JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        breadcrumb,
        {
          '@type': 'ContactPage',
          '@id': `${pageUrl}#webpage`,
          url: pageUrl,
          name: meta.title,
          description: meta.description,
          inLanguage: 'en-GB',
          mainEntity: { '@id': `${SITE_BASE_URL}/#business` },
          breadcrumb: { '@id': `${pageUrl}#breadcrumb` },
        },
      ],
    });
  }

  if (route === 'faq') {
    return JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        breadcrumb,
        {
          '@type': 'FAQPage',
          '@id': `${pageUrl}#faq`,
          url: pageUrl,
          name: meta.title,
          description: meta.description,
          inLanguage: 'en-GB',
          mainEntity: FAQS.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        },
      ],
    });
  }

  if (route === 'pac-model') {
    return JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        breadcrumb,
        {
          '@type': 'Article',
          '@id': `${pageUrl}#article`,
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
          author: { '@id': `${SITE_BASE_URL}/#practitioner` },
          publisher: { '@id': `${SITE_BASE_URL}/#business` },
          mainEntityOfPage: pageUrl,
          inLanguage: 'en-GB',
        },
        {
          '@type': 'DefinedTermSet',
          '@id': `${pageUrl}#terms`,
          name: 'Transactional Analysis PAC Ego States',
          hasDefinedTerm: [...CORE_NODES, ...FUNCTIONAL_NODES].map((n) => ({
            '@type': 'DefinedTerm',
            name: n.fullName,
            termCode: n.id,
            description: n.title,
          })),
        },
        {
          '@type': 'VideoObject',
          '@id': `${pageUrl}#video`,
          name: PAC_YOUTUBE_SHORT.title,
          description:
            'A brief psychoeducational introduction by Liam Doran explaining how Parent, Adult, and Child ego states work in Transactional Analysis.',
          thumbnailUrl: PAC_YOUTUBE_SHORT.thumbnailUrl,
          contentUrl: PAC_YOUTUBE_SHORT.watchUrl,
          embedUrl: PAC_YOUTUBE_SHORT.embedUrl,
          uploadDate: '2026-01-01T00:00:00Z',
          author: { '@id': `${SITE_BASE_URL}/#practitioner` },
        },
      ],
    });
  }

  if (route === 'drama-triangle') {
    return JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        breadcrumb,
        {
          '@type': 'Article',
          '@id': `${pageUrl}#article`,
          headline: "The Drama Triangle & Winner's Triangle (Transactional Analysis)",
          description:
            "How we get stuck in repeating arguments and how to step off the loop using Stephen Karpman's Drama Triangle and Acey Choy's Winner's Triangle.",
          educationalUse: 'Psychoeducation',
          about: [
            'Transactional Analysis',
            'Karpman Drama Triangle',
            "Acey Choy Winner's Triangle",
            'Relational Psychotherapy',
          ],
          author: { '@id': `${SITE_BASE_URL}/#practitioner` },
          publisher: { '@id': `${SITE_BASE_URL}/#business` },
          mainEntityOfPage: pageUrl,
          inLanguage: 'en-GB',
        },
        {
          '@type': 'DefinedTermSet',
          '@id': `${pageUrl}#terms`,
          name: "Drama Triangle & Winner's Triangle Stances",
          hasDefinedTerm: [
            ...Object.values(DRAMA_ROLES),
            ...Object.values(WINNER_ROLES),
          ].map((role) => ({
            '@type': 'DefinedTerm',
            name: role.name,
            description: `${role.looksLike} ${role.hiddenCost}`,
          })),
        },
      ],
    });
  }

  if (route === 'free-child') {
    return JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        breadcrumb,
        {
          '@type': 'Article',
          '@id': `${pageUrl}#article`,
          headline: 'The Camera and The Free Child',
          description:
            "Transactional Analysis essay exploring Eric Berne's Free Child and Adapted Child ego states through 35mm street photography in East Yorkshire.",
          educationalUse: 'Psychoeducation',
          about: ['Free Child', 'Adapted Child', 'Transactional Analysis', '35mm Street Photography'],
          author: { '@id': `${SITE_BASE_URL}/#practitioner` },
          publisher: { '@id': `${SITE_BASE_URL}/#business` },
          mainEntityOfPage: pageUrl,
          inLanguage: 'en-GB',
          associatedMedia: PHOTOS.map((photo) => ({
            '@type': 'ImageObject',
            contentUrl: `${SITE_BASE_URL}${photo.src}`,
            name: photo.title,
            description: `${photo.captionTitle} ${photo.captionText}`,
            contentLocation: photo.location,
          })),
        },
      ],
    });
  }

  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      breadcrumb,
      {
        '@type': route === 'slides' ? 'CollectionPage' : 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: meta.title,
        description: meta.description,
        inLanguage: 'en-GB',
        isPartOf: { '@id': `${SITE_BASE_URL}/#website` },
        breadcrumb: { '@id': `${pageUrl}#breadcrumb` },
      },
    ],
  });
}
