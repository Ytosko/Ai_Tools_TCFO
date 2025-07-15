import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="mt-12 text-center">
      <div className="inline-flex items-center space-x-3">
        <div className="w-8 h-8 bg-[#E67C15] rounded-full animate-bounce"></div>
        <div className="w-8 h-8 bg-gray-800 rounded-full animate-bounce [animation-delay:-.3s]"></div>
        <div className="w-8 h-8 bg-[#E67C15] rounded-full animate-bounce [animation-delay:-.5s]"></div>
      </div>
      <p className="mt-4 text-lg text-gray-600 font-semibold">
        Performing magic... analyzing your site!
      </p>
    </div>
  );
};

export default Loader;