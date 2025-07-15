import React, { useRef } from 'react';
import { AnalysisResult, ChatMessage } from '../types';
import PlatformPreviews from './PlatformPreviews';
import CoreVitals from './PageSpeedInsights';
import MissingTagsTable from './MissingTagsTable';
import SeoSuggestions from './SeoSuggestions';
import AssistantChat from './AssistantChat';
import ReportGenerator from './ReportGenerator';
import ServerHostingDetails from './ServerHostingDetails';

interface AnalysisDashboardProps {
  result: AnalysisResult;
  isPsiLoading: boolean;
  isSuggestionsLoading: boolean;
  chatMessages: ChatMessage[];
  isChatLoading: boolean;
  onSendMessage: (message: string) => void;
}

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ result, isPsiLoading, isSuggestionsLoading, chatMessages, isChatLoading, onSendMessage }) => {
  const reportContentRef = useRef<HTMLDivElement>(null);
  const allSectionsLoaded = !isPsiLoading && !isSuggestionsLoading;

  return (
    <div className="mt-4 animate-fade-in">
        <div className="animate-fade-in-up" data-no-print>
          <ReportGenerator reportContentRef={reportContentRef} result={result} />
        </div>
        
        <div ref={reportContentRef} className="space-y-12">
            <div className="lg:col-span-3">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center animate-fade-in-up">Analysis for: <span className="text-[#E67C15]">{result.url}</span></h2>
            </div>
            
            <section className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                 <PlatformPreviews metaData={result.metaData} url={result.url} />
            </section>

            <section className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                 <ServerHostingDetails details={result.serverDetails} />
            </section>

            <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-100 space-y-8 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                <CoreVitals 
                    psiData={result.psiData} 
                    isLoading={isPsiLoading} 
                    error={result.psiError} 
                />
                <hr className="border-slate-200" />
                <MissingTagsTable metaData={result.metaData} />
            </section>

            <section className="force-page-break animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                <SeoSuggestions 
                    suggestions={result.seoSuggestions}
                    isLoading={isSuggestionsLoading}
                    error={result.suggestionsError}
                />
            </section>
        </div>

        {allSectionsLoaded && (
            <div className="mt-16 animate-fade-in-up" data-no-print style={{ animationDelay: '500ms' }}>
                <AssistantChat
                    messages={chatMessages}
                    isLoading={isChatLoading}
                    onSendMessage={onSendMessage}
                />
            </div>
        )}
    </div>
  );
};

export default AnalysisDashboard;