/**
 * Card Component
 * Container for content sections
 */

import React from 'react';

const Card = ({ 
  children, 
  title, 
  className = '',
  noPadding = false 
}) => {
  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-200 ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        </div>
      )}
      <div className={noPadding ? '' : 'p-6'}>
        {children}
      </div>
    </div>
  );
};

export default Card;

