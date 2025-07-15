import React, { useState } from 'react';

interface DomainInputProps {
  onAnalyze: (domain: string) => void;
  isLoading: boolean;
}

const DomainInput: React.FC<DomainInputProps> = ({ onAnalyze, isLoading }) => {
  const [domain, setDomain] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (domain.trim()) {
      onAnalyze(domain.trim());
    }
  };

  return (
    <div className="mt-8 max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3 bg-white p-2 rounded-xl shadow-lg border border-slate-200">
        <div className="flex-grow w-full flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400 ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9V3" />
            </svg>
            <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="e.g., yourwebsite.com"
            className="w-full p-3 bg-transparent text-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E67C15] rounded-lg ml-[5px]"
                disabled={isLoading}
            />
        </div>
        <button
          type="submit"
          disabled={isLoading || !domain}
          className="w-full sm:w-auto flex justify-center items-center px-6 py-3 text-base font-bold text-white bg-gray-900 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {isLoading ? (
            <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
            </>
          ) : 'Analyze Domain'}
        </button>
      </form>
    </div>
  );
};

export default DomainInput;