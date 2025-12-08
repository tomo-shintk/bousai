
import React from 'react';

interface CardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, icon, children }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg h-full flex flex-col">
      <div className="p-3 sm:p-4 border-b border-gray-200 flex items-center space-x-2 sm:space-x-3">
        <div className="text-blue-600 w-5 h-5 sm:w-6 sm:h-6">{icon}</div>
        <h2 className="text-base sm:text-lg font-semibold text-gray-800">{title}</h2>
      </div>
      <div className="p-3 sm:p-4 flex-grow">
        {children}
      </div>
    </div>
  );
};

export default Card;
