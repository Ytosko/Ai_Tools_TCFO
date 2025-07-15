import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 bg-white/80 backdrop-blur-md shadow-sm z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <a href="/" className="flex items-center space-x-2">
            <img 
              src="https://togethercfo.com/index_files/63ffca0b254e8101513766b8_logo.svg" 
              alt="Together CFO Logo"
              className="h-8 w-auto"
            />
             <span className="text-xl font-bold text-gray-800 tracking-tighter">SEO Analyzer</span>
          </a>
          <a
            href="https://togethercfo.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-block px-4 py-2 text-sm font-semibold text-white bg-[#E67C15] rounded-md hover:bg-opacity-90 transition-colors"
          >
            Visit Together CFO
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;