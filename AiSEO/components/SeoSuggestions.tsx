import React from 'react';

// An enhanced markdown-to-HTML parser that handles paragraphs, lists, headers, links, and inline styles.
const EnhancedMarkdown: React.FC<{ text: string }> = ({ text }) => {
    const processInline = (line: string): string => {
        return line
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-[#E67C15] hover:underline font-semibold">$1</a>')
            .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-800">$1</strong>')
            .replace(/`([^`]+)`/g, '<code class="bg-slate-200 text-slate-800 rounded px-1 py-0.5 text-sm font-mono">$1</code>');
    };

    const html = text
        .split('\n\n')
        .map(block => {
            if (!block.trim()) return '';

            // Headers
            if (block.startsWith('### ')) return `<h4 class="text-lg font-bold mt-4 mb-2 text-gray-800">${processInline(block.substring(4))}</h4>`;
            if (block.startsWith('## ')) return `<h3 class="text-xl font-bold mt-5 mb-2 text-gray-900">${processInline(block.substring(3))}</h3>`;
            if (block.startsWith('# ')) return `<h2 class="text-2xl font-extrabold mt-6 mb-3 text-gray-900">${processInline(block.substring(2))}</h2>`;
            
            // Lists (both ul and ol)
            if (block.match(/^(?:\s*[-*]|\s*\d+\.)\s/)) {
                const listItems = block.split('\n').filter(Boolean).map(item => {
                    const content = processInline(item.replace(/^(?:\s*[-*]|\s*\d+\.)\s/, ''));
                    return `<li class="flex items-start gap-3"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#E67C15] flex-shrink-0 mt-1" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg><span>${content}</span></li>`;
                }).join('');

                const listTag = block.match(/^\s*\d+\./) ? 'ol' : 'ul';
                return `<${listTag} class="space-y-3 list-inside">${listItems}</${listTag}>`;
            }

            // Horizontal Rule
            if (block.match(/^(?:---|\*\*\*|___)\s*$/)) {
                return '<hr class="my-6 border-slate-200" />';
            }
            
            // Paragraphs
            return `<p class="text-base text-gray-700 leading-relaxed">${processInline(block).replace(/\n/g, '<br />')}</p>`;
        })
        .join('');

    return <div className="space-y-4" dangerouslySetInnerHTML={{ __html: html }} />;
};


const SectionLoader: React.FC<{ text: string }> = ({ text }) => (
    <div className="text-center py-10">
      <div className="flex justify-center items-center space-x-2">
        <div className="w-4 h-4 bg-slate-300 rounded-full animate-pulse"></div>
        <div className="w-4 h-4 bg-slate-300 rounded-full animate-pulse [animation-delay:0.2s]"></div>
        <div className="w-4 h-4 bg-slate-300 rounded-full animate-pulse [animation-delay:0.4s]"></div>
      </div>
      <p className="mt-3 text-sm text-gray-500 font-medium">{text}</p>
    </div>
);

const SectionError: React.FC<{ message: string }> = ({ message }) => (
    <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 rounded-md" role="alert">
        <p className="font-bold">Error Generating Suggestions</p>
        <p className="text-sm">{message}</p>
    </div>
);


interface SeoSuggestionsProps {
  suggestions: string | null;
  isLoading: boolean;
  error: string | null | undefined;
}

const SeoSuggestions: React.FC<SeoSuggestionsProps> = ({ suggestions, isLoading, error }) => {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-100">
        <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-[#E67C15] to-orange-400 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900">AI-Powered SEO Suggestions</h3>
        </div>

        {isLoading && <SectionLoader text="Generating AI suggestions..." />}
        {error && <SectionError message={error} />}
        
        {suggestions && !isLoading && !error && (
            <div className="text-gray-700">
                <EnhancedMarkdown text={suggestions} />
            </div>
        )}
    </div>
  );
};

export default SeoSuggestions;