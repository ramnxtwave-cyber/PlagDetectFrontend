/**
 * Code Editor Component
 * Textarea for code input with syntax highlighting preview
 */

import React from 'react';

const CodeEditor = ({ 
  label, 
  value, 
  onChange, 
  placeholder = 'Enter your code here...',
  rows = 15,
  error = '',
  required = false,
  disabled = false
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
          {required && <span className="text-danger-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        required={required}
        disabled={disabled}
        className={`
          w-full px-4 py-3 border rounded-lg font-mono text-sm
          focus:ring-2 focus:ring-primary-500 focus:border-transparent
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${error ? 'border-danger-500' : 'border-gray-300'}
        `}
        style={{ 
          resize: 'vertical',
          minHeight: '200px',
          maxHeight: '600px',
        }}
      />
      <div className="flex justify-between items-center mt-2">
        <div>
          {error && (
            <p className="text-sm text-danger-500 flex items-center gap-1">
              <svg 
                className="w-4 h-4" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path 
                  fillRule="evenodd" 
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
                  clipRule="evenodd" 
                />
              </svg>
              {error}
            </p>
          )}
        </div>
        <p className="text-sm text-gray-500">
          {value.length} characters, {value.split('\n').length} lines
        </p>
      </div>
    </div>
  );
};

export default CodeEditor;

