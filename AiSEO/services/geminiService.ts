import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { MetaData, PsiData, AnalysisResult, ServerDetails } from '../types';

if (!process.env.API_KEY) {
    // This is a placeholder check. The execution environment is expected to have the API_KEY.
    console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const getSeoSuggestions = async (metaData: MetaData, psiData: PsiData | null, serverDetails: ServerDetails, url: string): Promise<string> => {
    const psiContent = psiData
        ? `**Google PageSpeed Insights:**
      - Mobile Score: ${psiData.mobile.score}/100
      - Desktop Score: ${psiData.desktop.score}/100
      - Mobile LCP: ${psiData.mobile.metrics.find(m => m.id === 'largest-contentful-paint')?.displayValue || 'N/A'}
      - Desktop LCP: ${psiData.desktop.metrics.find(m => m.id === 'largest-contentful-paint')?.displayValue || 'N/A'}
      - Mobile CLS: ${psiData.mobile.metrics.find(m => m.id === 'cumulative-layout-shift')?.displayValue || 'N/A'}
      - Desktop CLS: ${psiData.desktop.metrics.find(m => m.id === 'cumulative-layout-shift')?.displayValue || 'N/A'}`
        : `**Google PageSpeed Insights:**
      - Data could not be loaded for this site. The analysis will proceed without performance metrics.`;

    const prompt = `
      Act as a world-class SEO expert and senior web developer. Analyze the following data for the website: ${url}
      
      **Meta Data:**
      - Title: ${metaData.title} (Length: ${metaData.title.length})
      - Description: ${metaData.description} (Length: ${metaData.description.length})
      - Canonical: ${metaData.canonical || 'Not found'}
      - OG Title: ${metaData.ogTitle || 'Not found'}
      - OG Description: ${metaData.ogDescription || 'Not found'}
      - OG Image: ${metaData.ogImage || 'Not found'}
      - Twitter Card: ${metaData.twitterCard || 'Not found'}
      - H1 Tags: ${metaData.headings.filter(h => h.tag === 'h1').length}
      - Total Headings: ${metaData.headings.length}
      - Favicon: ${metaData.favicon ? 'Found' : 'Not found'}
      - robots.txt: ${metaData.robotsTxtStatus}
      
      ${psiContent}
      
      **Server & Hosting Details:**
      - Hosting Provider: ${serverDetails.hostingProvider || 'Not detected'}
      - CDN: ${serverDetails.cdnProvider || 'Not detected'}
      - Server: ${serverDetails.serverSignature || 'Not detected'}
      - HSTS Enabled: ${serverDetails.isHstsEnabled ? 'Yes' : 'No'}
      - SSL Enabled: ${serverDetails.sslEnabled ? 'Yes' : 'No'}

      Based on ALL this data (SEO, Performance, and Server), provide a concise, actionable, and prioritized list of improvement suggestions.
      Use Markdown for formatting. Group suggestions into categories like 'On-Page SEO', 'Social Media Presence', 'Performance & Core Web Vitals', and 'Server & Security'.
      If performance data is missing, acknowledge it and focus on other areas.
      Start with a brief, encouraging summary of the site's strengths.
      Be specific in your recommendations (e.g., "Shorten the meta description to under 160 characters" instead of "Improve meta description").
    `;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating SEO suggestions:", error);
        throw new Error("There was an error generating SEO suggestions. Please try again later.");
    }
};

export const createChatSession = async (url: string, analysisResult: AnalysisResult): Promise<Chat> => {
    const systemInstruction = `You are 'Together CFO SEO Analyzer', an expert SEO and web design assistant. You are analyzing the domain: ${url}. 
  All your answers must strictly relate to this domain, its SEO, its performance, its content, or potential design improvements.
  You have the full analysis context available to you. Some data may be missing if it failed to load; acknowledge this if relevant to the user's question.
  If the user asks a question unrelated to this context (e.g., 'what is the capital of France?', 'write a poem'), you MUST respond with EXACTLY this text and nothing more: 'I’m here to assist with your domain and its SEO/design improvements. Please ask questions related to your website.'
  Keep your answers concise and helpful. Use markdown for formatting when appropriate.`;

    const history = [
        {
            role: "user",
            parts: [{ text: `Here is the full SEO and performance analysis for my site ${url}. Please use this as context for all my future questions: ${JSON.stringify(analysisResult)}` }]
        },
        {
            role: "model",
            parts: [{ text: `Understood. I have the complete analysis for ${url}. I am ready to answer your questions regarding its SEO and design.` }]
        }
    ];

    const chat: Chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: systemInstruction,
        },
        history,
    });

    return chat;
};

export const sendChatMessage = async (chat: Chat, message: string): Promise<any> => {
    try {
        const responseStream = await chat.sendMessageStream({ message });
        return responseStream;
    } catch (error) {
        console.error("Error in chat session:", error);
        throw new Error("I'm sorry, I encountered a problem processing your request.");
    }
};