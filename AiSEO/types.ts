import { Chat } from '@google/genai';

export interface MetaData {
  title: string;
  titleSource: 'title_tag' | 'meta_name_title' | 'js_rendered' | 'none';
  description: string;
  canonical: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  twitterCard: string | null;
  twitterTitle: string | null;
  twitterDescription: string | null;
  twitterImage: string | null;
  headings: { tag: string; text: string; }[];
  favicon: string | null;
  robotsTxt: string | null;
  robotsTxtStatus: 'found' | 'not_found' | 'error';
}

export interface PsiMetric {
  id: string;
  title: string;
  displayValue: string;
  score: number;
}

export interface PsiDeviceData {
  score: number;
  metrics: PsiMetric[];
}

export interface PsiData {
  mobile: PsiDeviceData | null;
  desktop: PsiDeviceData | null;
}

export interface ServerDetails {
  ipAddress: string | null;
  ipv6Address: string | null;
  hostingProvider: string | null;
  isHstsEnabled: boolean;
  serverSignature: string | null;
  cdnProvider: string | null;
  sslEnabled: boolean;
  otherHeaders: Record<string, string>;
}

export interface AnalysisResult {
  url: string;
  metaData: MetaData;
  psiData: PsiData | null;
  serverDetails: ServerDetails;
  seoSuggestions: string | null;
  psiError?: string | null;
  suggestionsError?: string | null;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface AppState {
  url: string;
  isLoading: boolean; // For initial analysis (meta/server)
  isPsiLoading: boolean;
  isSuggestionsLoading: boolean;
  error: string | null; // For critical errors in initial analysis
  analysisResult: AnalysisResult | null;
  chatSession: Chat | null;
  chatMessages: ChatMessage[];
  isChatLoading: boolean;
}