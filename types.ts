export interface ContractFormData {
  contractType: string;
  disputeResolution: 'egyptian_courts' | 'arbitration';
  includeShariaClauses?: boolean;
  details: { [key: string]: string | undefined }; 
}

export interface ContractClause {
  titleArabic: string;
  titleEnglish: string;
  contentArabic: string;
  contentEnglish: string;
}

export interface LegalAuditChecklistItem {
  item: string;
  status: string;
  reference: string;
}

export interface LegalAuditBenchmarking {
  officialPortalValidation: string;
  cassationPrinciplesValidation: string;
  customaryPracticeValidation: string;
  shariaAuditStatement: string;
  complianceScore: number;
  verificationChecklist: LegalAuditChecklistItem[];
}

export interface LawFirmBranding {
  firmNameArabic: string;
  firmNameEnglish: string;
  registrationNumber: string; // رقم القيد بنقابة المحامين أو السجل التجاري
  phone: string;
  address: string;
  logoUrl?: string;
  authorizedCounselor?: string;
}

export interface GeneratedContract {
  contractTitleArabic?: string;
  contractTitleEnglish?: string;
  preambleArabic: string;
  preambleEnglish: string;
  recitalsArabic: string;
  recitalsEnglish: string;
  clauses: ContractClause[];
  legalNotes: string;
  shariaComplianceNotes?: string;
  certificationStatement?: string;
  legalAudit?: LegalAuditBenchmarking;
  branding?: LawFirmBranding;
}

export interface SavedContractItem {
  id: string;
  referenceId: string;
  titleArabic: string;
  titleEnglish: string;
  contractType: string;
  createdAt: string;
  contractData: GeneratedContract;
}

export type SubscriptionTier = 'free' | 'starter' | 'pro' | 'enterprise';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  title: string;
  role: 'lawyer' | 'business' | 'individual';
  tier: SubscriptionTier;
  creditsRemaining: number;
  branding?: LawFirmBranding;
  createdAt: string;
}

export interface PricingPlan {
  id: SubscriptionTier | 'pay_per_contract';
  nameAr: string;
  nameEn: string;
  priceEgp: number;
  priceUsd: number;
  periodAr: string;
  badge?: string;
  popular?: boolean;
  featuresAr: string[];
  creditsText: string;
}

declare module 'html2pdf.js';
