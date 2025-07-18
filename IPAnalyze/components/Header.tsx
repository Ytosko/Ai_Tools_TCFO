import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-b-2 border-[#E67C15] rounded-lg shadow-sm">
      <div className="flex items-center space-x-4">
        <img 
          src="https://togethercfo.com/index_files/63ffca0b254e8101513766b8_logo.svg" 
          alt="Together CFO Logo" 
          className="h-8 md:h-10" 
        />
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight">
          IP Analyzer
        </h1>
      </div>
    </header>
  );
};

export default Header;