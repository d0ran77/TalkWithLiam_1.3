export interface SlideItem {
  id: string;
  index: number;
  numberString: string;
  title: string;
  shortTitle: string;
  superheader: string;
  headline: string;
}

export interface ModalityItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  focus: string;
  iconName: string;
}

export interface RelationalDimensionItem {
  id: string;
  number: number;
  title: string;
  kinshipTitle: string;
  kinshipSubtitle: string;
  context: string;
  shift: string;
}

export interface SpecialismItem {
  id: string;
  number?: number;
  title: string;
  subtitle?: string;
  summary?: string;
  description?: string;
  whatWeNotice?: string;
  howWeWork?: string;
  symptoms?: string[];
  therapeuticFocus?: string;
  tag?: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'Getting Started' | 'Fees & Policies' | 'Confidentiality' | 'How Sessions Work';
  tags?: string[];
}

export type FaqCategory = 'All' | 'Top 5 Most Asked' | 'Getting Started' | 'Fees & Policies' | 'Confidentiality' | 'How Sessions Work';

export interface ApproachExplainerItem {
  id: string;
  topic: string;
  shortLabel: string;
  subtitle: string;
  thePattern: string;
  inTheRoom: string;
  theShift: string;
  keywords: string[];
}

export interface ConsultationFormData {
  name: string;
  email: string;
  phone?: string;
  format: 'in-person' | 'online' | 'undecided';
  nextStep: 'free-consultation' | 'general-inquiry' | 'october-waitlist' | 'intro-call';
  message: string;
  mathAnswer?: string;
}

export interface ToastMessage {
  id: string;
  text: string;
  type?: 'success' | 'info';
}
