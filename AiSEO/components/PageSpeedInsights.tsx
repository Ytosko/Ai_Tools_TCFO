import React from 'react';
import { PsiData, PsiMetric, PsiDeviceData } from '../types';

const getScoreColor = (score: number, type: 'bg' | 'text' | 'border') => {
  const colorClasses = {
    bg: ['bg-red-100', 'bg-orange-100', 'bg-green-100'],
    text: ['text-red-700', 'text-orange-700', 'text-green-700'],
    border: ['border-red-500', 'border-orange-500', 'border-green-500'],
  };
  if (score >= 90) return colorClasses[type][2];
  if (score >= 50) return colorClasses[type][1];
  return colorClasses[type][0];
};

const VitalBadge: React.FC<{ metric: PsiMetric }> = ({ metric }) => (
    <div className={`p-3 rounded-lg border-l-4 ${getScoreColor(metric.score, 'border')} ${getScoreColor(metric.score, 'bg')}`}>
        <div className="flex justify-between items-center">
            <p className={`text-sm font-medium ${getScoreColor(metric.score, 'text')}`}>{metric.title.replace(/\s\(.*\)/, '')}</p>
            <p className={`text-sm font-bold ${getScoreColor(metric.score, 'text')}`}>{metric.displayValue}</p>
        </div>
    </div>
);

const PsiDeviceCard: React.FC<{ title: string; data: PsiDeviceData }> = ({ title, data }) => (
    <div className="w-full">
        <div className="flex items-center gap-4 mb-4">
             <h4 className="text-lg font-bold text-gray-800">{title}</h4>
             <span className={`px-3 py-1 text-sm font-bold rounded-full ${getScoreColor(data.score, 'bg')} ${getScoreColor(data.score, 'text')}`}>
                Score: {data.score}
             </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {data.metrics.map(metric => (
                <VitalBadge key={metric.id} metric={metric} />
            ))}
        </div>
    </div>
);

const DataUnavailableCard: React.FC<{ device: 'Mobile' | 'Desktop' }> = ({ device }) => (
    <div className="w-full bg-slate-50/50 border border-dashed border-slate-300 rounded-lg p-4 flex flex-col justify-center items-center h-full min-h-[150px]">
        <h4 className="text-lg font-bold text-gray-500">{device}</h4>
        <p className="text-sm text-gray-400 mt-2 text-center">Performance data could not be loaded for this device.</p>
    </div>
);

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
        <p className="font-bold">Error Loading Performance Data</p>
        <p className="text-sm">{message}</p>
    </div>
);

const CoreVitals: React.FC<{ psiData: PsiData | null; isLoading: boolean; error: string | null | undefined }> = ({ psiData, isLoading, error }) => {
  return (
    <div>
      <h3 className="text-xl font-bold text-gray-900 mb-4">Core Web Vitals</h3>
      
      {isLoading && <SectionLoader text="Analyzing Core Web Vitals..." />}
      
      {error && !isLoading && <SectionError message={error} />}

      {psiData && !isLoading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
          {psiData.mobile ? (
            <PsiDeviceCard title="Mobile" data={psiData.mobile} />
          ) : (
            <DataUnavailableCard device="Mobile" />
          )}
          {psiData.desktop ? (
            <PsiDeviceCard title="Desktop" data={psiData.desktop} />
          ) : (
            <DataUnavailableCard device="Desktop" />
          )}
        </div>
      )}
      
      {!psiData && !isLoading && !error && (
         <div className="text-center py-10 bg-slate-50/50 rounded-lg border-dashed border-slate-300">
             <p className="text-gray-500">Performance data is unavailable.</p>
         </div>
      )}
    </div>
  );
};

export default CoreVitals;