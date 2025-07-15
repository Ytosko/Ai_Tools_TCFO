import React, { useState, useCallback } from 'react';
import { AppState, AnalysisResult, ChatMessage, PsiData } from './types';
import { analyzeUrl, fetchPsiData } from './services/analysisService';
import { getSeoSuggestions, createChatSession, sendChatMessage } from './services/geminiService';
import Header from './components/Header';
import DomainInput from './components/DomainInput';
import Loader from './components/Loader';
import AnalysisDashboard from './components/AnalysisDashboard';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    url: '',
    isLoading: false,
    isPsiLoading: false,
    isSuggestionsLoading: false,
    error: null,
    analysisResult: null,
    chatSession: null,
    chatMessages: [],
    isChatLoading: false,
  });

  const handleAnalysis = useCallback(async (domain: string) => {
    // 1. Reset state for a new analysis
    setState({
      url: domain,
      isLoading: true,
      isPsiLoading: false,
      isSuggestionsLoading: false,
      error: null,
      analysisResult: null,
      chatSession: null,
      chatMessages: [],
      isChatLoading: false,
    });

    try {
      const url = domain.startsWith('http') ? domain : `https://www.${domain}`;

      // 2. Fetch critical data first (meta, server)
      const { metaData, serverDetails } = await analyzeUrl(url);

      // 3. Render initial results immediately
      const initialResult: AnalysisResult = { url, metaData, serverDetails, psiData: null, seoSuggestions: null };
      setState(s => ({ ...s, isLoading: false, analysisResult: initialResult }));

      // 4. Asynchronously fetch PSI data
      setState(s => ({ ...s, isPsiLoading: true }));
      let psiData: PsiData | null = null;
      try {
        psiData = await fetchPsiData(url);
        setState(s => ({
          ...s,
          isPsiLoading: false,
          analysisResult: { ...s.analysisResult!, psiData: psiData, psiError: null }
        }));
      } catch (psiErr) {
        const errorMessage = psiErr instanceof Error ? psiErr.message : 'An unknown error occurred while fetching PageSpeed data.';
        console.error("PSI Error:", psiErr);
        setState(s => ({
          ...s,
          isPsiLoading: false,
          analysisResult: { ...s.analysisResult!, psiData: null, psiError: errorMessage }
        }));
      }

      // 5. Asynchronously generate SEO suggestions
      setState(s => ({ ...s, isSuggestionsLoading: true }));
      try {
        const seoSuggestions = await getSeoSuggestions(metaData, psiData, serverDetails, url);
        setState(s => ({
          ...s,
          isSuggestionsLoading: false,
          analysisResult: { ...s.analysisResult!, seoSuggestions: seoSuggestions, suggestionsError: null }
        }));
      } catch (suggestionErr) {
        const errorMessage = suggestionErr instanceof Error ? suggestionErr.message : 'An unknown error occurred while generating suggestions.';
        console.error("Suggestion Error:", suggestionErr);
        setState(s => ({
          ...s,
          isSuggestionsLoading: false,
          analysisResult: { ...s.analysisResult!, seoSuggestions: null, suggestionsError: errorMessage }
        }));
      }

      // 6. Setup chat session with whatever data was successfully fetched
      const finalAnalysisResult = { url, metaData, serverDetails, psiData };
      const chatSession = await createChatSession(url, finalAnalysisResult as AnalysisResult);
      setState(s => ({
        ...s,
        chatSession,
        chatMessages: [{ role: 'model', content: `Hello! I'm ready to help you with your site, ${url}. Ask me anything about its SEO or design.` }]
      }));

    } catch (err) { // Catches critical errors from analyzeUrl
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred. Please check the domain and try again.';
      setState(s => ({ ...s, isLoading: false, error: errorMessage }));
    }
  }, []);

  const handleSendMessage = useCallback(async (message: string) => {
    if (!state.chatSession || !state.analysisResult) return;

    // Add user message and an empty placeholder for the model's response
    setState(s => ({
      ...s,
      isChatLoading: true,
      chatMessages: [
        ...s.chatMessages,
        { role: 'user', content: message },
        { role: 'model', content: '' } // Placeholder for streaming response
      ],
    }));

    try {
      // The sendChatMessage function now returns a stream
      const stream = await sendChatMessage(state.chatSession, message);

      // Process the stream
      for await (const chunk of stream) {
        const chunkText = chunk.text;
        setState(s => {
          const newMessages = [...s.chatMessages];
          // Update the last message (the model's placeholder)
          newMessages[newMessages.length - 1].content += chunkText;
          return { ...s, chatMessages: newMessages };
        });
      }

    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'Sorry, I encountered an error.';
      setState(s => {
        const newMessages = [...s.chatMessages];
        // Update the last message with the error
        newMessages[newMessages.length - 1].content = errorMessage;
        return { ...s, chatMessages: newMessages };
      });
    } finally {
      // Stop loading indicator when stream is done
      setState(s => ({ ...s, isChatLoading: false }));
    }
  }, [state.chatSession, state.analysisResult]);

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800 flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8 md:py-12 flex-grow">
        <div data-no-print className="relative text-center max-w-4xl mx-auto py-16 md:py-20">
          <div aria-hidden="true" className="absolute inset-0 top-0 -z-10 h-full w-full bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
            The Ultimate <span className="text-[#E67C15]">SEO Analyzer</span>
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-600">
            Enter your domain to unlock a comprehensive analysis of its SEO health, performance metrics, and social presence, powered by AI.
          </p>
          <DomainInput onAnalyze={handleAnalysis} isLoading={state.isLoading} />
        </div>

        {state.isLoading && <Loader />}

        {state.error && (
          <div data-no-print className="mt-8 max-w-2xl mx-auto bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{state.error}</span>
          </div>
        )}

        {state.analysisResult && !state.isLoading && (
          <AnalysisDashboard
            result={state.analysisResult}
            isPsiLoading={state.isPsiLoading}
            isSuggestionsLoading={state.isSuggestionsLoading}
            chatMessages={state.chatMessages}
            isChatLoading={state.isChatLoading}
            onSendMessage={handleSendMessage}
          />
        )}
      </main>
      <footer className="text-center py-6 border-t border-slate-200 bg-white">
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Together CFO SEO Analyzer. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
};

export default App;