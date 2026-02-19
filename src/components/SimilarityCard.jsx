/**
 * Similarity Card Component
 * Displays a single similarity result with score and code preview
 */

import React, { useState } from 'react';

const SimilarityCard = ({ submission, index }) => {
  const [expanded, setExpanded] = useState(false);
  
  // Determine similarity level and color
  const getSimilarityLevel = (score) => {
    if (score >= 0.95) return { level: 'Very High', color: 'text-danger-600', bg: 'bg-danger-50', badge: 'bg-danger-500' };
    if (score >= 0.85) return { level: 'High', color: 'text-orange-600', bg: 'bg-orange-50', badge: 'bg-orange-500' };
    if (score >= 0.75) return { level: 'Moderate', color: 'text-yellow-600', bg: 'bg-yellow-50', badge: 'bg-yellow-500' };
    return { level: 'Low', color: 'text-green-600', bg: 'bg-green-50', badge: 'bg-green-500' };
  };
  
  const similarityInfo = getSimilarityLevel(submission.similarity);
  const percentage = (submission.similarity * 100).toFixed(1);
  
  return (
    <div className={`border-2 rounded-lg p-5 ${similarityInfo.bg} border-gray-200 hover:shadow-md transition-shadow`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-gray-700 font-bold text-sm">
            #{index + 1}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">
              Student: <span className="text-primary-600">{submission.studentId}</span>
            </h3>
            <p className="text-sm text-gray-600">
              Submission ID: {submission.submissionId}
            </p>
          </div>
        </div>
        
        {/* Similarity Badge */}
        <div className="text-right">
          <div className={`inline-block px-3 py-1 rounded-full text-white text-sm font-bold ${similarityInfo.badge}`}>
            {percentage}%
          </div>
          <p className={`text-xs mt-1 font-medium ${similarityInfo.color}`}>
            {similarityInfo.level} Similarity
          </p>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
        <div 
          className={`h-2 rounded-full ${similarityInfo.badge}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {/* Code Preview */}
      <div className="mb-3">
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
        >
          {expanded ? '▼' : '▶'} 
          {expanded ? 'Hide' : 'Show'} Code Preview
        </button>
        
        {expanded && submission.codePreview && (
          <pre className="mt-2 p-3 bg-gray-900 text-gray-100 rounded-lg text-xs overflow-x-auto font-mono">
            {submission.codePreview}
          </pre>
        )}
      </div>
      
      {/* Metadata */}
      <div className="flex gap-4 text-xs text-gray-600">
        <span>📄 Code Length: {submission.codeLength} chars</span>
      </div>
    </div>
  );
};

export default SimilarityCard;

