import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white border-t border-gray-200 py-4 px-4 sm:px-6 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
        {/* Copyright text */}
        <div className="text-gray-500 text-sm order-2 sm:order-1">
          © 2025 Northshore Medical & Aesthetic Center. All rights reserved.
        </div>
        
        {/* Links */}
        <div className="flex items-center gap-8 order-1 sm:order-2">
          <a 
            href="#help" 
            className="text-gray-500 text-sm hover:text-gray-700 transition-colors whitespace-nowrap"
          >
            Help
          </a>
          <a 
            href="#privacy" 
            className="text-gray-500 text-sm hover:text-gray-700 transition-colors whitespace-nowrap"
          >
            Privacy Policy
          </a>
          <a 
            href="#terms" 
            className="text-gray-500 text-sm hover:text-gray-700 transition-colors whitespace-nowrap"
          >
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;