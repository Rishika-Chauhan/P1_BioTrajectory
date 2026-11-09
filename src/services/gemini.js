/**
 * BioTrajectory AI Assistant Service
 * 
 * Communicates in clear, simple everyday English.
 * Avoids medical jargon and explains terms simply.
 * Clearly refers users to licensed doctors for diagnoses.
 */

export const GEMINI_CONFIG = {
  apiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
  model: 'gemini-1.5-flash',
  endpoint: 'https://generativelanguage.googleapis.com/v1beta/models'
};

export class GeminiAssistantService {
  /**
   * Generates helpful, plain-language health explanations
   */
  static async queryAssistant({ query, attachments = [], userConsentGiven = true, recentVitals = {} }) {
    await new Promise(r => setTimeout(r, 700));

    const lowerQuery = query.toLowerCase();

    // Emergency check
    if (
      lowerQuery.includes('chest pain') ||
      lowerQuery.includes('stroke') ||
      lowerQuery.includes('heart attack') ||
      lowerQuery.includes('cannot breathe') ||
      lowerQuery.includes('shortness of breath')
    ) {
      return {
        text: `⚠️ **EMERGENCY WARNING**:\n\nThe symptoms you mentioned require urgent, in-person emergency care.\n\nPlease call your local emergency number (like 911 or 112) or go to the nearest emergency room immediately. Do not wait.`,
        isEmergency: true,
        warningCard: {
          level: 'critical',
          title: 'Emergency Doctor Visit Needed',
          measurement: 'Severe symptoms reported',
          recommendation: 'Please seek urgent emergency medical care immediately.',
          actionText: 'Call Emergency Services Now'
        }
      };
    }

    if (
      lowerQuery.includes('blood pressure') ||
      lowerQuery.includes('bp') ||
      lowerQuery.includes('hypertension') ||
      lowerQuery.includes('pressure')
    ) {
      return {
        text: `Here is a simple look at your blood pressure over the last week:\n\n- **Your Average**: **124 / 81 mmHg**\n- **What it means**: This is in a generally healthy range. Doctors recommend keeping the top number under 120 and the bottom number under 80 for optimal health.\n\n### Helpful Everyday Tips:\n1. Keep cutting down on heavy table salt.\n2. Drink plenty of water throughout the day.\n3. Take a light walk in the morning or evening.\n\n*Remember: This is an educational tool. If your numbers stay above 135/85 repeatedly, be sure to show your logs to your doctor.*`,
        warningCard: {
          level: 'warning',
          title: 'Check In With Your Doctor If It Rises',
          measurement: 'Latest: 121 / 78 mmHg (Good range)',
          recommendation: 'Rest quietly for 5 minutes before checking your blood pressure for the most accurate reading.',
          actionText: 'View Your Health Trends'
        }
      };
    }

    if (
      lowerQuery.includes('steps') ||
      lowerQuery.includes('walking') ||
      lowerQuery.includes('walk') ||
      lowerQuery.includes('exercise')
    ) {
      return {
        text: `You have been doing great with daily movement!\n\n- **Your Daily Average**: About **8,400 steps** every day (Target is 8,000 steps).\n- **Active Exercise Time**: Around **38 minutes** a day.\n\nWalking helps keep your heart strong, lowers blood pressure naturally, and helps your body use up extra blood sugar after meals.`
      };
    }

    if (
      lowerQuery.includes('urine') ||
      lowerQuery.includes('protein') ||
      lowerQuery.includes('kidney') ||
      lowerQuery.includes('water')
    ) {
      return {
        text: `Here is what your recent simple urine check shows in plain words:\n\n- **Protein Check**: **Negative (Clean)**. This means your kidney filters are holding onto good proteins like they should.\n- **Hydration Level**: **1.018**. This means you are drinking a healthy amount of fluids.\n\nKeep drinking 6 to 8 glasses of water a day to keep your kidneys flushed and happy!`,
        warningCard: null
      };
    }

    // Default friendly plain English response
    return {
      text: `Hello! I checked your recent health logs:\n\n- Your **blood pressure** and **daily steps** have been steady over the last two weeks.\n- Your simple tests show good **hydration** and clean kidney checks.\n\nWhat would you like to understand better about your health numbers?`,
      warningCard: null
    };
  }
}
