/**
 * Chunk Card Component
 * Displays a matched code chunk with similarity score
 */

import React, { useState } from 'react';

const ChunkCard = ({ chunk, index }) => {
  const [showDetails, setShowDetails] = useState(false);
  
  const percentage = (chunk.similarity * 100).toFixed(1);
  const isHighSimilarity = chunk.similarity >= 0.85;
  
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-sm font-semibold text-gray-700">
            Match #{index + 1} - Student: <span className="text-primary-600">{chunk.studentId}</span>
          </p>
          <p className="text-xs text-gray-500">
            Submission ID: {chunk.submissionId} | Chunk #{chunk.matchedChunkIndex}
          </p>
        </div>
        <span className={`px-2 py-1 rounded text-xs font-bold text-white ${
          isHighSimilarity ? 'bg-danger-500' : 'bg-orange-500'
        }`}>
          {percentage}%
        </span>
      </div>
      
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="text-sm text-primary-600 hover:underline mb-2"
      >
        {showDetails ? '▼ Hide' : '▶ Show'} Matched Code
      </button>
      
      {showDetails && (
        <div className="space-y-2">
          {chunk.queryChunkPreview && (
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-1">Your Code:</p>
              <pre className="p-2 bg-blue-50 rounded text-xs overflow-x-auto font-mono border border-blue-200">
                {chunk.queryChunkPreview}
              </pre>
            </div>
          )}
          
          {chunk.matchedChunkText && (
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-1">Matched Code:</p>
              <pre className="p-2 bg-orange-50 rounded text-xs overflow-x-auto font-mono border border-orange-200">
                {chunk.matchedChunkText}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChunkCard;

