
import { Inquiry, AuthVerification } from '../types';

/**
 * Lumina Neural Vault - The persistence layer for the Digital Studio.
 * Handles inquiries, brand assets, and user identity.
 */
class NeuralVault {
  private static instance: NeuralVault;
  private storageKey = 'lumina_vault_v1';

  private constructor() {
    this.initializeVault();
  }

  public static getInstance(): NeuralVault {
    if (!NeuralVault.instance) {
      NeuralVault.instance = new NeuralVault();
    }
    return NeuralVault.instance;
  }

  private initializeVault() {
    if (!localStorage.getItem(this.storageKey)) {
      const initialData = {
        inquiries: [],
        visions: [],
        audits: [],
        theses: [],
        session: null,
        metadata: {
          lastSync: new Date().toISOString(),
          version: "1.0.0"
        }
      };
      localStorage.setItem(this.storageKey, JSON.stringify(initialData));
    }
  }

  private getData() {
    return JSON.parse(localStorage.getItem(this.storageKey) || '{}');
  }

  private saveData(data: any) {
    data.metadata.lastSync = new Date().toISOString();
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  // --- Inquiry Management ---
  public saveInquiry(inquiry: Inquiry) {
    const data = this.getData();
    data.inquiries.unshift(inquiry);
    this.saveData(data);
    return inquiry;
  }

  public getInquiries(): Inquiry[] {
    return this.getData().inquiries || [];
  }

  // --- Vision & Asset Management ---
  public saveVision(vision: { id: string; industry: string; keyword: string; data: any }) {
    const data = this.getData();
    data.visions.unshift({ ...vision, createdAt: new Date().toISOString() });
    this.saveData(data);
  }

  public getVisions() {
    return this.getData().visions || [];
  }

  public saveThesis(content: string) {
    const data = this.getData();
    data.theses.unshift({ content, createdAt: new Date().toISOString() });
    this.saveData(data);
  }

  // --- Session Management ---
  public setSession(session: any) {
    const data = this.getData();
    data.session = session;
    this.saveData(data);
  }

  public getSession() {
    return this.getData().session;
  }

  public clearSession() {
    const data = this.getData();
    data.session = null;
    this.saveData(data);
  }

  public clearAll() {
    localStorage.removeItem(this.storageKey);
    this.initializeVault();
  }
}

export const vault = NeuralVault.getInstance();
