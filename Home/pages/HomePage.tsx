
import React from 'react';
import { TOOLS } from '../constants';
import ToolCard from '../components/ToolCard';
import type { Tool } from '../constants';

const HomePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl">
          Our Suite of Tools
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
          Powerful, AI-driven tools designed to help your business thrive.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="grid gap-8">
          {TOOLS.map((tool: Tool) => (
            <ToolCard key={tool.name} tool={tool} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
