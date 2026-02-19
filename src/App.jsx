/**
 * Main App Component
 * Handles routing and navigation between pages
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import SubmitCode from './pages/SubmitCode';
import CheckSimilarity from './pages/CheckSimilarity';
import { checkHealth } from './api/plagiarismApi';

// Navigation Component
const Navigation = () => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  const linkClass = (path) => {
    const base = "px-6 py-3 rounded-lg font-semibold transition-all duration-200";
    return isActive(path)
      ? `${base} bg-white text-primary-600 shadow-md`
      : `${base} text-white hover:bg-white hover:bg-opacity-20`;
  };
  
  return (
    <nav className="bg-gradient-to-r from-primary-600 to-primary-700 shadow-lg mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="text-3xl">🔍</span>
                Plagiarism Detector
              </h1>
            </div>
          </div>
          
          {/* Navigation Links */}
          <div className="flex items-center gap-4">
            <Link to="/" className={linkClass('/')}>
              📝 Submit Code
            </Link>
            <Link to="/check" className={linkClass('/check')}>
              🔍 Check Similarity
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Footer Component
const Footer = () => {
  return (
    <footer className="mt-12 py-6 text-center text-white">
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-sm">
          Powered by OpenAI Embeddings & PostgreSQL pgvector
        </p>
        <p className="text-xs mt-2 opacity-80">
          Semantic Code Similarity Detection System
        </p>
      </div>
    </footer>
  );
};

// Main App Component
const App = () => {
  const [serverStatus, setServerStatus] = useState('checking');
  
  // Check server health on mount
  useEffect(() => {
    const checkServerHealth = async () => {
      const result = await checkHealth();
      setServerStatus(result.success ? 'online' : 'offline');
    };
    
    checkServerHealth();
    
    // Check every 30 seconds
    const interval = setInterval(checkServerHealth, 30000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        {/* Server Status Banner */}
        {serverStatus === 'offline' && (
          <div className="bg-danger-500 text-white text-center py-2 text-sm">
            ⚠️ Unable to connect to backend server. Please ensure the server is running on http://localhost:3000
          </div>
        )}
        
        {serverStatus === 'checking' && (
          <div className="bg-yellow-500 text-white text-center py-2 text-sm">
            🔄 Checking server connection...
          </div>
        )}
        
        {/* Navigation */}
        <Navigation />
        
        {/* Main Content */}
        <main className="flex-grow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route path="/" element={<SubmitCode />} />
              <Route path="/check" element={<CheckSimilarity />} />
              <Route path="*" element={
                <div className="text-center py-20">
                  <h1 className="text-4xl font-bold text-white mb-4">404 - Page Not Found</h1>
                  <Link to="/" className="text-white underline">Go Home</Link>
                </div>
              } />
            </Routes>
          </div>
        </main>
        
        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
};

export default App;

