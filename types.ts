
export enum PlanType {
  REGULAR = 'Regular',
  ADVANCE = 'Advance',
  PREMIUM = 'Premium'
}

export interface PricingPlan {
  id: string;
  name: PlanType;
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
}

export interface ContactForm {
  name: string;
  age: string;
  email: string;
  phone: string;
  businessPlans: string;
  websiteIdea: string;
  selectedPlan: PlanType | string;
}

export interface LeadIntelligence {
  priority: 'High' | 'Medium' | 'Low';
  industryAnalysis: string;
  suggestedRoadmap: string[];
  marketSources: { title: string; uri: string }[];
}

export interface Inquiry extends ContactForm {
  id: string;
  createdAt: string;
  intelligence?: LeadIntelligence;
}

// Fixed missing interface used for user authentication and profile data
export interface AuthVerification {
  success: boolean;
  welcomeMessage: string;
  securityToken: string;
  userProfile: {
    name: string;
    role: string;
    clearance: string;
    lastLogin: string;
  };
}
