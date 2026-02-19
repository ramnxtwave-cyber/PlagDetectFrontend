/**
 * API Key Input Component
 * Allows users to enter their OpenAI API key
 */

import React, { useState, useEffect } from 'react';

const ApiKeyInput = ({ value, onChange, className = '' }) => {
  const [showKey, setShowKey] = useState(false);
  const [stored, setStored] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('openai_api_key');
    if (savedKey && !value) {
      onChange({ target: { value: savedKey } });
      setStored(true);
    }
  }, []);

  // Save to localStorage when changed
  const handleChange = (e) => {
    const newValue = e.target.value;
    onChange(e);
    
    if (newValue) {
      localStorage.setItem('openai_api_key', newValue);
      setStored(true);
    } else {
      localStorage.removeItem('openai_api_key');
      setStored(false);
    }
  };

  const clearKey = () => {
    localStorage.removeItem('openai_api_key');
    onChange({ target: { value: '' } });
    setStored(false);
  };

  return (
    <div className={`mb-4 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-semibold text-gray-700">
          OpenAI API Key
          <span className="text-xs text-gray-500 ml-2">(Optional - uses server default if empty)</span>
        </label>
        {stored && (
          <button
            type="button"
            onClick={clearKey}
            className="text-xs text-danger-600 hover:text-danger-700"
          >
            Clear Stored Key
          </button>
        )}
      </div>
      
      <div className="relative">
        <input
          type={showKey ? 'text' : 'password'}
          value={value}
          onChange={handleChange}
          placeholder="sk-proj-..."
          className="w-full px-4 py-3 pr-24 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
        />
        <button
          type="button"
          onClick={() => setShowKey(!showKey)}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-xs text-gray-600 hover:text-gray-800"
        >
          {showKey ? '🙈 Hide' : '👁️ Show'}
        </button>
      </div>
      
      <div className="mt-2 space-y-1">
        <p className="text-xs text-gray-600">
          💡 Your API key is stored locally in your browser and sent directly to the backend.
        </p>
        {value && value.startsWith('sk-') && (
          <p className="text-xs text-success-600">
            ✓ Valid API key format detected
          </p>
        )}
        {value && !value.startsWith('sk-') && (
          <p className="text-xs text-danger-600">
            ⚠️ API keys should start with "sk-"
          </p>
        )}
      </div>
      
      <details className="mt-3">
        <summary className="text-xs text-primary-600 cursor-pointer hover:text-primary-700">
          Where to get an API key?
        </summary>
        <div className="mt-2 p-3 bg-gray-50 rounded text-xs text-gray-700">
          <ol className="list-decimal list-inside space-y-1">
            <li>Go to <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-primary-600 underline">platform.openai.com/api-keys</a></li>
            <li>Sign in or create an account</li>
            <li>Click "Create new secret key"</li>
            <li>Copy the key (starts with "sk-")</li>
            <li>Paste it here</li>
          </ol>
          <p className="mt-2 text-yellow-700">
            ⚠️ Cost: ~$0.00001-0.00002 per submission
          </p>
        </div>
      </details>
    </div>
  );
};

export default ApiKeyInput;

