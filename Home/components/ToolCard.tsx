
import React from 'react';
import { Link } from 'react-router-dom';
import type { Tool } from '../constants';

interface ToolCardProps {
  tool: Tool;
}

const ArrowRightIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className || 'w-6 h-6'}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
    </svg>
);


const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  return (
    <div 
      onClick={() => window.open(`https://tools.togethercfo.com/${tool.path}`, '_blank')}
      role="button"
      tabIndex={0}
      className="group block rounded-xl border border-gray-200 bg-white p-8 shadow-sm ring-1 ring-transparent hover:ring-brand focus:outline-none focus:ring-2 focus:ring-brand transition-all duration-300 ease-in-out hover:shadow-2xl hover:shadow-brand/20 hover:-translate-y-1"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-gray-900 group-hover:text-brand transition-colors duration-300">
            {tool.name}
          </h3>
          <p className="mt-2 text-base text-gray-600">
            {tool.description}
          </p>
        </div>
        <div className="mt-6 sm:mt-0 sm:ml-8 flex-shrink-0">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-brand/10 group-hover:bg-brand transition-colors duration-300">
                <ArrowRightIcon className="h-7 w-7 text-brand group-hover:text-white transition-colors duration-300" />
            </div>
        </div>
      </div>
    </div>
  );
};

export default ToolCard;
