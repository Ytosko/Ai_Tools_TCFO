
import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-3" aria-label="Back to Homepage">
            <img 
              src="https://togethercfo.com/index_files/63ffca0b254e8101513766b8_logo.svg" 
              alt="Together CFO Logo" 
              className="h-8 w-auto" 
            />
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-700 tracking-tight">
            Together CFO <span className="text-brand">Tools</span>
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
