export type TriangleMode = 'drama' | 'winner';
export type DramaRoleId = 'persecutor' | 'rescuer' | 'victim';
export type WinnerRoleId = 'assertive' | 'caring' | 'vulnerable';
export type ScenarioId = 'work-deadline' | 'home-argument' | 'saying-yes';

export interface RoleDetail {
  id: string;
  mode: TriangleMode;
  counterpartId: string;
  name: string;
  tagline: string;
  badge: string;
  looksLike: string;
  hiddenCostLabel: string;
  hiddenCost: string;
  shiftTitle?: string;
  shiftSubtitle?: string;
}

export interface ScenarioDialogueStep {
  step: string;
  roleLabel: string;
  line: string;
}

export interface TriangleScenario {
  id: ScenarioId;
  label: string;
  context: string;
  dramaSteps: ScenarioDialogueStep[];
  winnerSteps: ScenarioDialogueStep[];
  takeaway: string;
}

export const DRAMA_INTRO = {
  title: 'The Drama Triangle',
  subtitle: 'How we get stuck in repeating arguments and how to step off the loop',
  paragraphs: [
    'Developed by psychiatrist Stephen Karpman, the Drama Triangle maps three unhelpful roles we slip into during conflict: Victim, Persecutor and Rescuer. When tension rises, we often bounce between these positions without realising it.',
    "Acey Choy's Winner's Triangle shows the way out. By shifting into Vulnerable, Assertive and Caring responses, you can keep your boundaries intact and handle difficult conversations honestly without getting pulled into the loop.",
    'Use the interactive model below to see how each role plays out and how to make the switch.',
  ],
};

export const DRAMA_ROLES: Record<DramaRoleId, RoleDetail> = {
  persecutor: {
    id: 'persecutor',
    mode: 'drama',
    counterpartId: 'assertive',
    name: 'The Persecutor',
    tagline: '"It\'s your fault this went wrong"',
    badge: 'DRAMA ROLE · BLAMING & CONTROLLING',
    looksLike:
      'You criticise, push hard, or keep score of what the other person failed to do. Underneath the sharp tone, you usually feel scared of losing control or being let down again.',
    hiddenCostLabel: 'The hidden cost',
    hiddenCost:
      'It shuts down honest conversation and pushes the other person straight into defending themselves or shutting off.',
    shiftTitle: 'Shift to Assertive',
    shiftSubtitle: 'Say what you need clearly without attacking',
  },
  rescuer: {
    id: 'rescuer',
    mode: 'drama',
    counterpartId: 'caring',
    name: 'The Rescuer',
    tagline: '"Let me fix this for you"',
    badge: 'DRAMA ROLE · OVER-FUNCTIONING',
    looksLike:
      'You step in unasked, smooth over conflict, or carry someone else\'s responsibility before they even ask. It feels generous in the moment, especially if you hate seeing people uncomfortable.',
    hiddenCostLabel: 'The hidden cost',
    hiddenCost:
      'Taking over silently keeps the other person stuck and leaves you quietly exhausted and resentful.',
    shiftTitle: 'Shift to Caring',
    shiftSubtitle: 'Support without taking over',
  },
  victim: {
    id: 'victim',
    mode: 'drama',
    counterpartId: 'vulnerable',
    name: 'The Victim',
    tagline: '"Nothing ever works out for me"',
    badge: 'DRAMA ROLE · POWERLESS & TRAPPED',
    looksLike:
      'You feel overwhelmed, backed into a corner, and convinced there is nothing you can do to change the situation. You might pull back into silence or wait for someone else to come and sort it out.',
    hiddenCostLabel: 'The hidden cost',
    hiddenCost:
      'Handing away your agency means you stay stuck waiting for other people to change before you can feel okay.',
    shiftTitle: 'Shift to Vulnerable',
    shiftSubtitle: 'Name what hurts while staying in your own corner',
  },
};

export const WINNER_ROLES: Record<WinnerRoleId, RoleDetail> = {
  assertive: {
    id: 'assertive',
    mode: 'winner',
    counterpartId: 'persecutor',
    name: 'Assertive',
    tagline: '"Here is where my line is"',
    badge: 'WINNER\'S STANCE · CLEAR BOUNDARIES',
    looksLike:
      'You state what works and what does not in plain, steady language without raising the temperature. You ask for what you want and respect the other person\'s right to say no.',
    hiddenCostLabel: 'Why it breaks the loop',
    hiddenCost:
      'Problems stay practical and solvable instead of turning into a character trial about who is to blame.',
  },
  caring: {
    id: 'caring',
    mode: 'winner',
    counterpartId: 'rescuer',
    name: 'Caring',
    tagline: '"I\'m here with you, how do you want to handle it?"',
    badge: 'WINNER\'S STANCE · GROUNDED SUPPORT',
    looksLike:
      'You listen warmly and stay on someone\'s side without rushing to fix their mess or absorb their stress. You trust them to make their own decisions, even when things feel uncomfortable.',
    hiddenCostLabel: 'Why it breaks the loop',
    hiddenCost:
      'Real kindness leaves both people with their dignity intact and stops quiet resentment from building.',
  },
  vulnerable: {
    id: 'vulnerable',
    mode: 'winner',
    counterpartId: 'victim',
    name: 'Vulnerable',
    tagline: '"I\'m finding this hard, and here is what I need"',
    badge: 'WINNER\'S STANCE · HONEST & PRESENT',
    looksLike:
      'You drop the armour and admit what you are feeling without pretending to be helpless or blaming anyone else. You ask for help cleanly or own your part in what comes next.',
    hiddenCostLabel: 'Why it breaks the loop',
    hiddenCost:
      'Honest vulnerability invites real connection instead of pulling someone else in to rescue or lecture you.',
  },
};

export const DRAMA_SCENARIOS: TriangleScenario[] = [
  {
    id: 'work-deadline',
    label: 'A Tense Work Deadline',
    context: 'A project is running late and stress is spiking between two colleagues.',
    dramaSteps: [
      {
        step: '01 · VICTIM',
        roleLabel: 'Starts overwhelmed',
        line: '"I\'m drowning in all of this, nobody gave me clear numbers and I can\'t keep up."',
      },
      {
        step: '02 · RESCUER',
        roleLabel: 'Jumps in to fix',
        line: '"Leave it with me, I\'ll stay up late and finish your section so we don\'t miss it."',
      },
      {
        step: '03 · FLIPS TO PERSECUTOR',
        roleLabel: 'Resentment boils over',
        line: '"I\'m sick of always carrying your workload. Why can\'t you ever just plan ahead?"',
      },
    ],
    winnerSteps: [
      {
        step: '01 · VULNERABLE',
        roleLabel: 'Names the stretch honestly',
        line: '"I\'ve fallen behind on the figures and I\'m worried about hitting Friday\'s deadline."',
      },
      {
        step: '02 · CARING',
        roleLabel: 'Supports without taking over',
        line: '"That sounds full-on. Do you want to spend ten minutes mapping what\'s realistic?"',
      },
      {
        step: '03 · ASSERTIVE',
        roleLabel: 'Holds clear capacity',
        line: '"I can review your final draft tomorrow at two, though I can\'t take on writing it."',
      },
    ],
    takeaway:
      'Notice how the Rescuer often turns into the Persecutor once exhaustion kicks in. Clear limits early on prevent both.',
  },
  {
    id: 'home-argument',
    label: 'An Unresolved Argument at Home',
    context: 'The same disagreement about household load keeps circling back every Sunday evening.',
    dramaSteps: [
      {
        step: '01 · PERSECUTOR',
        roleLabel: 'Starts keeping score',
        line: '"You never notice what needs doing around here unless I spell everything out for you."',
      },
      {
        step: '02 · VICTIM',
        roleLabel: 'Feels attacked and shuts down',
        line: '"Whatever I do is never good enough for you anyway, so what is the point in trying?"',
      },
      {
        step: '03 · RESCUER / FLIP',
        roleLabel: 'Sweeps it under the rug',
        line: '"Forget it, I\'ll just sort it all myself like usual. Let\'s not spoil the whole night."',
      },
    ],
    winnerSteps: [
      {
        step: '01 · ASSERTIVE',
        roleLabel: 'Addresses the issue, not the person',
        line: '"I\'m feeling stretched thin with the week ahead. Can we divide up tonight\'s jobs?"',
      },
      {
        step: '02 · VULNERABLE',
        roleLabel: 'Drops the defensive wall',
        line: '"When things feel rushed on Sundays, I worry I\'m letting you down and I freeze up."',
      },
      {
        step: '03 · CARING',
        roleLabel: 'Keeps warmth in the room',
        line: '"I don\'t want you feeling on trial. Let\'s sit down for five minutes and split it fairly."',
      },
    ],
    takeaway:
      'In the Drama Triangle, everyone takes a turn feeling wronged. Stepping out means talking about the workload without making each other the enemy.',
  },
  {
    id: 'saying-yes',
    label: 'Saying Yes When You Mean No',
    context: 'A friend asks for a big favour at the end of an already exhausting week.',
    dramaSteps: [
      {
        step: '01 · RESCUER',
        roleLabel: 'Says yes out of guilt',
        line: '"Of course I\'ll drive across town to help, don\'t worry about me, I\'ll make it work."',
      },
      {
        step: '02 · VICTIM',
        roleLabel: 'Feels trapped by their own yes',
        line: '"Everyone leans on me and nobody ever checks whether I have any energy left."',
      },
      {
        step: '03 · PERSECUTOR',
        roleLabel: 'Snaps silently or pulls away',
        line: '"They\'re so selfish for asking when they know how flat out I\'ve been lately."',
      },
    ],
    winnerSteps: [
      {
        step: '01 · VULNERABLE',
        roleLabel: 'Checks in with reality',
        line: '"I want to be there for them, and the truth is I\'m running on empty tonight."',
      },
      {
        step: '02 · ASSERTIVE',
        roleLabel: 'Gives an honest no',
        line: '"I\'m sorry, I can\'t make tonight work, I need to rest and switch off after this week."',
      },
      {
        step: '03 · CARING',
        roleLabel: 'Offers what actually fits',
        line: '"I hope tonight goes okay. I\'m free for a coffee on Sunday if you want to talk it through."',
      },
    ],
    takeaway:
      'A resentful yes turns you into both Victim and silent Persecutor. A kind, clean no keeps the relationship honest.',
  },
];

export const DRAMA_TO_WINNER: Record<DramaRoleId, WinnerRoleId> = {
  persecutor: 'assertive',
  rescuer: 'caring',
  victim: 'vulnerable',
};

export const WINNER_TO_DRAMA: Record<WinnerRoleId, DramaRoleId> = {
  assertive: 'persecutor',
  caring: 'rescuer',
  vulnerable: 'victim',
};
