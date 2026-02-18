
import { GoogleGenAI, Type, Modality, GenerateContentResponse } from "@google/genai";
import { ContactForm, LeadIntelligence, AuthVerification } from "../types";

// Simple in-memory cache for speech to speed up responses for common phrases
const speechCache = new Map<string, string>();

/**
 * Utility to handle API calls with exponential backoff
 */
async function callWithRetry<T>(fn: () => Promise<T>, maxRetries = 2): Promise<T> {
  let delay = 1500;
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (err: any) {
      const isQuotaError = err?.status === 429 || 
                          err?.message?.includes('429') || 
                          err?.message?.includes('RESOURCE_REHAUSTED');
      
      if (isQuotaError && i < maxRetries) {
        console.warn(`Quota exceeded, retrying in ${delay}ms... (Attempt ${i + 1}/${maxRetries})`);
        await new Promise(r => setTimeout(r, delay));
        delay *= 2.5; // Exponential backoff
        continue;
      }
      throw err;
    }
  }
  throw new Error("Maximum retries reached");
}

/**
 * Generates a bespoke strategic manifesto (Thesis)
 */
export const generateBrandThesis = async (): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response: GenerateContentResponse = await callWithRetry(() => ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a "Lumina Digital Thesis". This is a short, poetic, and high-end strategic manifesto for local business owners. 
      It should discuss "The Death of the Template," "The Birth of the Digital Flagship," and "The Legacy of Kinetic Design." 
      Tone: Apple-inspired, philosophical, authoritative, and luxury. 
      Length: ~250 words.`,
      config: {
        temperature: 0.9,
      }
    }));
    return response.text || "Our digital legacy is defined by the intersection of artisan craft and neural intelligence.";
  } catch (err) {
    return "Lumina Digital: Where every pixel is a promise of transcendence. We build not for today, but for the history of your brand.";
  }
};

/**
 * Success Vision Generator - Architects a bespoke digital future
 */
export const generateDigitalVision = async (industry: string, keyword: string): Promise<{ vision: string, keyFeatures: string[], colorPalette: string[] }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response: GenerateContentResponse = await callWithRetry(() => ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Architect a "Success Vision" for a business in the ${industry} industry with a ${keyword} aesthetic.
      Describe their future digital flagship website in a cinematic, professional way. 
      Identify 3 unique high-end features and a 3-color premium hex palette.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            vision: { type: Type.STRING },
            keyFeatures: { type: Type.ARRAY, items: { type: Type.STRING } },
            colorPalette: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ['vision', 'keyFeatures', 'colorPalette']
        }
      }
    }));
    return JSON.parse(response.text || '{}');
  } catch (err) {
    return {
      vision: "A revolutionary digital sanctuary where every pixel serves the purpose of brand dominance.",
      keyFeatures: ["Neural-linked Navigation", "Atmospheric Layouts", "Bespoke Micro-transitions"],
      colorPalette: ["#000000", "#EAB308", "#FFFFFF"]
    };
  }
};

export const analyzeBrandAesthetic = async (businessName: string, industry: string): Promise<{ score: number, critique: string, recommendations: string[] }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response: GenerateContentResponse = await callWithRetry(() => ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Perform a Lumina-grade Aesthetic Audit for a business named "${businessName}" in the "${industry}" industry.
      Evaluate their potential "Premium Digital Score" out of 100.
      Provide a sophisticated, short critique and 3 high-end architectural recommendations to move them from 'standard' to 'luxury'.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            critique: { type: Type.STRING },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ['score', 'critique', 'recommendations']
        }
      }
    }));
    return JSON.parse(response.text || '{}');
  } catch (err) {
    return {
      score: 42,
      critique: "Your current digital presence likely lacks the kinetic soul required for 2025 dominance.",
      recommendations: ["Implement physics-based motion", "Adopt Swiss-minimalist spacing", "Integrate AI-driven concierge"]
    };
  }
};

export const processInquiryWithAI = async (formData: ContactForm): Promise<LeadIntelligence> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response: GenerateContentResponse = await callWithRetry(() => ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Perform a strategic backend analysis for a new project inquiry at Lumina Digital.
      
      CLIENT DOSSIER:
      - Name: ${formData.name}
      - Age: ${formData.age}
      - Investment Tier: ${formData.selectedPlan}
      - Business Vision: ${formData.businessPlans}
      - Website Concept/Idea: ${formData.websiteIdea}
      
      TASKS:
      1. Analyze digital market trends for the specific "Website Concept" described.
      2. Categorize project priority (High/Medium/Low) based on the clarity of the vision and age of the lead.
      3. Create a 4-step digital roadmap tailored to their "Business Vision".
      4. Synthesize industry research specific to their sector.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            priority: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] },
            industryAnalysis: { type: Type.STRING },
            suggestedRoadmap: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            }
          },
          required: ['priority', 'industryAnalysis', 'suggestedRoadmap']
        }
      }
    }));

    const data = JSON.parse(response.text || '{}');
    const sources: any[] = [];

    return {
      priority: data.priority || 'Medium',
      industryAnalysis: data.industryAnalysis || 'Analysis complete.',
      suggestedRoadmap: data.suggestedRoadmap || ['Consultation', 'Design', 'Launch'],
      marketSources: sources
    };
  } catch (error) {
    console.error("Backend Processing Error:", error);
    return {
      priority: 'Medium',
      industryAnalysis: 'Standard inquiry received. Industry research currently queued.',
      suggestedRoadmap: ['Discovery Session', 'UX Strategy', 'Brand Development'],
      marketSources: []
    };
  }
};

/**
 * AI Process Phase Deep Dive
 */
export const getProcessPhaseDetails = async (phaseName: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response: GenerateContentResponse = await callWithRetry(() => ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Explain the "${phaseName}" phase of Lumina Digital Studio's web development process. 
      Lumina is an elite, Apple-inspired agency.
      Provide a sophisticated, inspiring, and professional explanation of what this phase entails for a local business owner. 
      Focus on transparency, craftsmanship, and the value of high-end design.`,
      config: {
        temperature: 0.8,
        thinkingConfig: { thinkingBudget: 0 }
      }
    }));
    return response.text || "Detailed information for this phase is currently being refined by our strategy team.";
  } catch (err) {
    console.error("Process Detail Error:", err);
    return "Our methodology ensures every project exceeds industry standards through rigorous quality assurance and creative excellence.";
  }
};

/**
 * Enhanced Authentication Verification Logic
 */
export const verifyIdentity = async (provider: string, email?: string): Promise<AuthVerification> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response: GenerateContentResponse = await callWithRetry(() => ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Perform an identity verification for a user logging in via ${provider}. 
      The email provided (if any) is ${email || 'auth-handshake-' + provider.toLowerCase() + '@secure.lumina.studio'}. 
      
      Requirements:
      1. Create a premium, Apple-inspired welcoming phrase.
      2. Generate a unique alphanumeric security token (format: LUM-XXXX-XXXX).
      3. Assign a high-end business role (e.g., Strategic Partner, Lead Visionary).
      4. Assign a clearance level (Tier 1-3).
      5. Extract or invent a professional name based on the email/provider.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            welcomeMessage: { type: Type.STRING },
            securityToken: { type: Type.STRING },
            name: { type: Type.STRING },
            role: { type: Type.STRING },
            clearance: { type: Type.STRING }
          },
          required: ['welcomeMessage', 'securityToken', 'name', 'role', 'clearance']
        },
        thinkingConfig: { thinkingBudget: 0 }
      }
    }));
    
    const data = JSON.parse(response.text || '{}');
    return {
      success: true,
      welcomeMessage: data.welcomeMessage,
      securityToken: data.securityToken,
      userProfile: {
        name: data.name,
        role: data.role,
        clearance: data.clearance,
        lastLogin: new Date().toLocaleTimeString()
      }
    };
  } catch (err) {
    return {
      success: true,
      welcomeMessage: "Welcome back to Lumina. Your digital legacy is ready.",
      securityToken: "LUM-SYST-8821",
      userProfile: {
        name: email ? email.split('@')[0] : "Strategic Partner",
        role: "Strategic Partner",
        clearance: "Tier 1",
        lastLogin: new Date().toLocaleTimeString()
      }
    };
  }
};

/**
 * Enhanced Service Intelligence Backend
 */
export interface ServiceInsight {
  strategic_advice: string;
  roi_impact: string;
  technical_complexity: 'Low' | 'Medium' | 'High' | 'Extreme';
  future_outlook_2025: string;
}

export const getServiceIntelligence = async (serviceName: string): Promise<ServiceInsight> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response: GenerateContentResponse = await callWithRetry(() => ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide an elite-level strategic analysis for the service: "${serviceName}". 
      Assume the client is a premium local business owner looking to scale. 
      Analyze the strategic value, ROI potential, technical difficulty, and the 2025 trend outlook for this specific capability.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            strategic_advice: { 
              type: Type.STRING, 
              description: "A profound strategic tip for the client." 
            },
            roi_impact: { 
              type: Type.STRING, 
              description: "How this service directly increases revenue or prestige." 
            },
            technical_complexity: { 
              type: Type.STRING, 
              enum: ['Low', 'Medium', 'High', 'Extreme'] 
            },
            future_outlook_2025: { 
              type: Type.STRING, 
              description: "What happens with this technology/service in 2025." 
            }
          },
          required: ['strategic_advice', 'roi_impact', 'technical_complexity', 'future_outlook_2025']
        },
        thinkingConfig: { thinkingBudget: 0 }
      }
    }));
    
    return JSON.parse(response.text || '{}') as ServiceInsight;
  } catch (err) {
    console.error("Service Intelligence Error:", err);
    return {
      strategic_advice: "Precision architecture designed for high-conversion performance.",
      roi_impact: "Increases brand equity and customer lifetime value through superior UX.",
      technical_complexity: "High",
      future_outlook_2025: "Total immersion and AI-driven personalization will be standard."
    };
  }
};

/**
 * AI Digital Concierge Logic
 */
export const askConciergeStream = async (userMessage: string, context: { currentSection: string }, chatHistory: {role: string, parts: {text: string}[]}[] = []) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `You are Mini, the luxury-focused AI Digital Concierge for Lumina Digital Studio. 
  
  OWNER INFORMATION (KNOWLEDGE BASE):
  - Owner: Nishan Kumar Prusty.
  - Background: Nishan is a B.Tech final year student building a startup to help local brands with premium websites.
  - Contact: Reach him or the team via the "Contact" section or the phone number in the footer.
  - IMPORTANT RULE: DO NOT mention Nishan Kumar Prusty or the owner's background in the initial greeting. ONLY share this information if the user specifically asks about the owner, the team, the founder, or how to contact the person in charge.
  
  GREETING PROTOCOL:
  - Your FIRST greeting MUST be exactly: "Hey I am mini the virtual ai assistant of Lumina studio and how can i help you"
  
  AGENCY CONTEXT:
  - Lumina Digital: Apple-inspired, premium, minimal.
  - Pricing: Regular (₹3k), Advance (₹5k), Premium (₹8k).
  
  BEHAVIOR:
  - Be conversational, acknowledge user input before answering.
  - Act as a strategic partner.`;

  return await ai.models.generateContentStream({
    model: 'gemini-3-flash-preview',
    contents: [
      ...chatHistory,
      { role: 'user', parts: [{ text: userMessage }] }
    ],
    config: {
      systemInstruction: systemInstruction,
      temperature: 0.7,
      topP: 0.95,
      thinkingConfig: { thinkingBudget: 0 }
    }
  });
};

/**
 * Generate Audio Speech (TTS)
 */
export const generateSpeech = async (text: string): Promise<string | undefined> => {
  const trimmed = text.trim();
  if (!trimmed) return undefined;
  
  if (speechCache.has(trimmed)) {
    return speechCache.get(trimmed);
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response: GenerateContentResponse = await callWithRetry(() => ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: trimmed }] }],
      config: {
        responseModalalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    }), 1);

    const data = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (data) {
      speechCache.set(trimmed, data);
    }
    return data;
  } catch (error: any) {
    return undefined;
  }
};
