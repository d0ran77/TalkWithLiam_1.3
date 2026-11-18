export type PacTabId = 'core' | 'functional';
export type PacScenarioId = 'pulling-away' | 'saying-yes' | 'too-much';
export type CoreNodeId = 'P' | 'A' | 'C';
export type FunctionalNodeId = 'CP' | 'NP' | 'A' | 'AC' | 'FC';

export interface PacReflectionEntry {
  quote: string;
  explanation: string;
}

export interface PacNodeMeta<T extends string> {
  id: T;
  letter: string;
  circleSubLabel: string;
  fullName: string;
  title: string;
  tag: string;
}

export interface PacScenario {
  id: PacScenarioId;
  label: string;
  core: Record<CoreNodeId, PacReflectionEntry>;
  functional: Record<FunctionalNodeId, PacReflectionEntry>;
}

export const PAC_YOUTUBE_SHORT = {
  id: '5w9D2VWeX9I',
  watchUrl: 'https://youtube.com/shorts/5w9D2VWeX9I?si=KR88QuKxniVfazU-',
  embedUrl: 'https://www.youtube-nocookie.com/embed/5w9D2VWeX9I?rel=0',
  thumbnailUrl: 'https://i.ytimg.com/vi/5w9D2VWeX9I/hqdefault.jpg',
  title: 'Liam Doran explains the Parent-Adult-Child (PAC) model in Transactional Analysis',
};

export const CORE_NODES: PacNodeMeta<CoreNodeId>[] = [
  {
    id: 'P',
    letter: 'P',
    circleSubLabel: 'Parent',
    fullName: 'Parent',
    title: 'PARENT: BORROWED RULES',
    tag: 'BORROWED RULES',
  },
  {
    id: 'A',
    letter: 'A',
    circleSubLabel: 'Adult',
    fullName: 'Adult',
    title: 'ADULT: HERE & NOW',
    tag: 'HERE & NOW: HOW WE WORK',
  },
  {
    id: 'C',
    letter: 'C',
    circleSubLabel: 'Child',
    fullName: 'Child',
    title: 'CHILD: FELT EMOTION',
    tag: 'FELT EMOTION',
  },
];

export const FUNCTIONAL_NODES: PacNodeMeta<FunctionalNodeId>[] = [
  {
    id: 'CP',
    letter: 'CP',
    circleSubLabel: 'Control',
    fullName: 'Controlling Parent',
    title: 'CONTROLLING PARENT',
    tag: 'PROTECTIVE CONTROL',
  },
  {
    id: 'NP',
    letter: 'NP',
    circleSubLabel: 'Nurturing',
    fullName: 'Nurturing Parent',
    title: 'NURTURING PARENT',
    tag: 'CARE & SOOTHING',
  },
  {
    id: 'A',
    letter: 'A',
    circleSubLabel: 'Adult',
    fullName: 'Adult',
    title: 'ADULT: RELATIONAL CLARITY',
    tag: 'GROUNDED PRESENCE',
  },
  {
    id: 'AC',
    letter: 'AC',
    circleSubLabel: 'Adapted',
    fullName: 'Adapted Child',
    title: 'ADAPTED CHILD',
    tag: 'SURVIVAL COMPLIANCE',
  },
  {
    id: 'FC',
    letter: 'FC',
    circleSubLabel: 'Free Child',
    fullName: 'Free / Natural Child',
    title: 'FREE / NATURAL CHILD',
    tag: 'SPONTANEOUS TRUTH',
  },
];

export const FUNCTIONAL_FOOTNOTE =
  'Notice how Nurturing Parent and Free Child bring genuine warmth and spontaneity, while Critical Parent and Adapted Child often drive old relational loops.';

export const PAC_SCENARIOS: PacScenario[] = [
  {
    id: 'pulling-away',
    label: 'Pulling Away in Conflict',
    core: {
      P: {
        quote: "If you show anger or hurt, you'll ruin the relationship. Keep a lid on it.",
        explanation:
          'Automatic protective rules absorbed early on about whether conflict is safe.',
      },
      A: {
        quote:
          "I'm feeling defensive right now, and I need a beat to figure out what's actually going on between us.",
        explanation:
          'Grounded presence; staying in the room without shutting down or attacking.',
      },
      C: {
        quote:
          "I'm scared I'm about to be abandoned or blamed, so I'm going quiet to stay safe.",
        explanation:
          'Old nervous-system survival strategies triggered when closeness feels risky.',
      },
    },
    functional: {
      CP: {
        quote:
          "You always make things dramatic: there's no point talking when you're like this.",
        explanation:
          'Using distance, cold logic, or blame to shut down vulnerability and regain control.',
      },
      NP: {
        quote:
          "Are you okay? Forget what I was upset about, let me make sure you're alright.",
        explanation:
          'Jumping straight into soothing or rescuing the other person to avoid staying with mutual tension.',
      },
      A: {
        quote:
          "We're both activated right now. Let's take ten minutes and come back to this honestly.",
        explanation:
          'Naming what is happening in the room without attacking, rescuing, or disappearing.',
      },
      AC: {
        quote: "I'll just agree with whatever you want so this stops.",
        explanation:
          'Going compliant, walking on eggshells, or retreating into silence to stay safe.',
      },
      FC: {
        quote:
          'I feel hurt and frustrated right now, and I want us to work through it.',
        explanation:
          'Direct, unguarded emotional honesty expressed without hostility or shame.',
      },
    },
  },
  {
    id: 'saying-yes',
    label: 'Saying "Yes" When You Mean "No"',
    core: {
      P: {
        quote: 'Good people put everyone else first. Having needs is selfish.',
        explanation:
          'Inherited standards around duty, politeness, and earning approval.',
      },
      A: {
        quote:
          "I care about them, AND I don't have the capacity for this today. I can be honest kindly.",
        explanation:
          "Holding both your needs and the other person's reality at the same time.",
      },
      C: {
        quote:
          "If I disappoint them, they won't like me anymore: I have to keep the peace.",
        explanation:
          'The younger part of you trying to secure belonging by accommodating.',
      },
    },
    functional: {
      CP: {
        quote: "You owe them this: don't be lazy or ungrateful.",
        explanation:
          'Policing yourself with harsh rules, or quietly resenting the other person for asking.',
      },
      NP: {
        quote: "Of course I'll sort it out for you, don't worry about me.",
        explanation:
          "Over-functioning and taking care of everyone else's comfort at the expense of your own limits.",
      },
      A: {
        quote: "I'd love to help, though I can't take that on this week.",
        explanation: 'Offering a clean, guilt-free boundary that respects both people.',
      },
      AC: {
        quote: 'Sure, no problem at all! (while feeling a knot in your stomach).',
        explanation:
          'Automatically pleasing and accommodating out of fear of rejection or conflict.',
      },
      FC: {
        quote: "Honestly, I'm knackered and just want a quiet night in.",
        explanation:
          'Spontaneous, straightforward truth about what you actually want and need.',
      },
    },
  },
  {
    id: 'too-much',
    label: 'Feeling "Too Much" for Someone',
    core: {
      P: {
        quote:
          'Stop overthinking and dial it back. Nobody wants to deal with heavy emotions.',
        explanation:
          'Internalised messages that taught you to edit yourself to fit in.',
      },
      A: {
        quote:
          "My feelings are real and valid here; I don't have to shrink myself to be met.",
        explanation:
          'Relating to another person on equal footing, without apologising for existing.',
      },
      C: {
        quote: "I'm ashamed of needing reassurance, so I'll hide how I really feel.",
        explanation: 'Vulnerability mixed with the old fear of rejection.',
      },
    },
    functional: {
      CP: {
        quote: "Pull yourself together: you're being needy and exhausting.",
        explanation:
          'Turning inward with self-criticism before the other person even has a chance to respond.',
      },
      NP: {
        quote:
          "It's fine, really: you've got enough on your plate without my stuff.",
        explanation:
          "Taking care of the other person's bandwidth while leaving yourself completely unsupported.",
      },
      A: {
        quote:
          "I'm carrying a lot today and could really use a listening ear: do you have the space?",
        explanation:
          'Checking in openly and letting the other person answer for themselves.',
      },
      AC: {
        quote: "I'm totally fine, just tired!",
        explanation:
          'Hiding behind a polite mask and editing your real feelings so you remain easy to be around.',
      },
      FC: {
        quote:
          "I'm really struggling today and it feels good just to say it out loud.",
        explanation:
          'Allowing yourself to be fully seen, imperfect and human, without apology.',
      },
    },
  },
];
