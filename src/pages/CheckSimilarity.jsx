/**
 * Check Similarity Page
 * Allows checking code against existing submissions for plagiarism
 */

import React, { useState } from 'react';
import Card from '../components/Card';
import Input from '../components/Input';
import CodeEditor from '../components/CodeEditor';
import Button from '../components/Button';
import Alert from '../components/Alert';
import ApiKeyInput from '../components/ApiKeyInput';
import SimilarityCard from '../components/SimilarityCard';
import ChunkCard from '../components/ChunkCard';
import { checkSimilarity } from '../api/plagiarismApi';

const CheckSimilarity = () => {
  // Form state
  const [formData, setFormData] = useState({
    questionId: '',
    code: '',
    language: 'javascript',
    similarityThreshold: 0.75,
    maxResults: 5
  });
  
  // API Key state
  const [apiKey, setApiKey] = useState('');
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null);
  const [results, setResults] = useState(null);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Detect language from code content
  const detectLanguage = (code) => {
    const trimmedCode = code.trim();
    
    // Python detection
    if (trimmedCode.match(/^(def|class|import|from|if __name__|print\()/m) ||
        trimmedCode.includes('def ') || 
        trimmedCode.includes('import ') ||
        trimmedCode.match(/:\s*$/m)) {
      return 'python';
    }
    
    // Java detection
    if (trimmedCode.match(/public\s+(class|static|void)|import\s+java\.|System\.out/)) {
      return 'java';
    }
    
    // C++ detection
    if (trimmedCode.match(/#include\s*<|std::|cout|cin|namespace/) ||
        trimmedCode.includes('std::')) {
      return 'cpp';
    }
    
    // JavaScript detection (default)
    if (trimmedCode.match(/function|const\s+\w+\s*=|let\s+\w+\s*=|var\s+\w+\s*=|=>|console\.log/)) {
      return 'javascript';
    }
    
    // If unclear but has Python-like indentation
    if (trimmedCode.split('\n').some(line => line.match(/^    [a-z]/))) {
      return 'python';
    }
    
    // Default to javascript
    return 'javascript';
  };
  
  // Handle code editor change
  const handleCodeChange = (e) => {
    const newCode = e.target.value;
    const detectedLang = detectLanguage(newCode);
    
    setFormData(prev => ({
      ...prev,
      code: newCode,
      language: detectedLang  // Auto-detect language
    }));
    
    if (errors.code) {
      setErrors(prev => ({
        ...prev,
        code: ''
      }));
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.questionId.trim()) {
      newErrors.questionId = 'Question ID is required';
    }
    
    if (!formData.code.trim()) {
      newErrors.code = 'Code cannot be empty';
    } else if (formData.code.trim().length < 10) {
      newErrors.code = 'Code is too short (minimum 10 characters)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate
    if (!validateForm()) {
      setAlert({
        type: 'error',
        message: 'Please fix the errors in the form'
      });
      return;
    }
    
    setLoading(true);
    setAlert(null);
    setResults(null);
    
    try {
      // Call API with optional API key
      const result = await checkSimilarity({
        ...formData,
        apiKey: apiKey || undefined
      });
      
      if (result.success) {
        const data = result.data;
        
        // Check if any matches found
        if (data.summary.totalMatchedSubmissions === 0) {
          setAlert({
            type: 'success',
            message: '✅ No similar submissions found! This code appears to be original.'
          });
        } else if (data.summary.highSimilarity > 0) {
          setAlert({
            type: 'warning',
            message: `⚠️ Found ${data.summary.highSimilarity} highly similar submission(s)! Please review the matches below.`
          });
        } else {
          setAlert({
            type: 'info',
            message: `Found ${data.summary.totalMatchedSubmissions} moderately similar submission(s).`
          });
        }
        
        setResults(data);
      } else {
        setAlert({
          type: 'error',
          message: result.error || 'Failed to check similarity'
        });
      }
    } catch (error) {
      setAlert({
        type: 'error',
        message: 'An unexpected error occurred. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🔍 Check for Plagiarism
        </h1>
        <p className="text-gray-600">
          Submit code to check for semantic similarity with existing submissions.
        </p>
      </div>
      
      {/* Check Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card title="Input">
          <form onSubmit={handleSubmit}>
            {/* Question ID */}
            <Input
              label="Question ID"
              name="questionId"
              value={formData.questionId}
              onChange={handleChange}
              placeholder="e.g., fibonacci-problem"
              required
              error={errors.questionId}
              disabled={loading}
            />
            
            {/* OpenAI API Key */}
            <ApiKeyInput
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            
            {/* Language */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Programming Language
                <span className="ml-2 text-xs font-normal text-green-600">
                  ✨ Auto-detected
                </span>
              </label>
              <select
                name="language"
                value={formData.language}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            {/* Similarity Threshold */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Similarity Threshold: {(formData.similarityThreshold * 100).toFixed(0)}%
              </label>
              <input
                type="range"
                name="similarityThreshold"
                min="0.5"
                max="0.95"
                step="0.05"
                value={formData.similarityThreshold}
                onChange={handleChange}
                disabled={loading}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>50% (Lenient)</span>
                <span>95% (Strict)</span>
              </div>
            </div>
            
            {/* Max Results */}
            <Input
              label="Maximum Results"
              name="maxResults"
              type="number"
              min="1"
              max="20"
              value={formData.maxResults}
              onChange={handleChange}
              disabled={loading}
            />
            
            {/* Code Editor */}
            <CodeEditor
              label="Code to Check"
              value={formData.code}
              onChange={handleCodeChange}
              placeholder="const fib = (n) => {
  if (n < 2) return n;
  return fib(n - 1) + fib(n - 2);
}"
              required
              error={errors.code}
              disabled={loading}
              rows={12}
            />
            
            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              disabled={loading}
              fullWidth
            >
              {loading ? 'Analyzing...' : '🔍 Check for Plagiarism'}
            </Button>
          </form>
        </Card>
        
        {/* Settings Info */}
        <Card title="Settings Guide">
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">Similarity Threshold</h4>
              <ul className="text-gray-600 space-y-1 list-disc list-inside">
                <li><strong>95%+</strong>: Nearly identical code</li>
                <li><strong>85-95%</strong>: Very similar (high confidence)</li>
                <li><strong>75-85%</strong>: Similar approach (moderate)</li>
                <li><strong>60-75%</strong>: Same algorithm (low confidence)</li>
                <li><strong>&lt;60%</strong>: Different implementations</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">How it works</h4>
              <p className="text-gray-600">
                The system uses semantic embeddings to detect similarity beyond simple text matching.
                It can identify paraphrased code, renamed variables, and restructured implementations.
              </p>
            </div>
            
            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-yellow-800 text-xs">
                <strong>Note:</strong> Processing may take 3-10 seconds depending on code length and number of chunks.
              </p>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Alert */}
      {alert && (
        <Alert 
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}
      
      {/* Results Section */}
      {results && (
        <div className="space-y-6">
          {/* Final Decision (New - Dual Layer Detection) */}
          {results.final_decision && (
            <Card title="⚖️ Final Decision">
              <div className="space-y-4">
                {/* Decision Badge */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className={`inline-block px-4 py-2 rounded-lg font-bold text-lg ${
                      results.final_decision.decision === 'PLAGIARISM_CONFIRMED' 
                        ? 'bg-danger-100 text-danger-700'
                        : results.final_decision.decision === 'PLAGIARISM_LIKELY' || results.final_decision.decision === 'SUSPICIOUS'
                        ? 'bg-orange-100 text-orange-700'
                        : results.final_decision.decision === 'LOW_CONFIDENCE_MATCH'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-success-100 text-success-700'
                    }`}>
                      {results.final_decision.decision.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-800">
                      {(results.final_decision.confidence * 100).toFixed(0)}%
                    </div>
                    <div className="text-sm text-gray-600">Confidence</div>
                  </div>
                </div>
                
                {/* Detection Methods */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-2">🏠</span>
                      <h4 className="font-semibold text-gray-800">Local Detection</h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      Embeddings + Vector Search
                    </p>
                    <p className="text-lg font-bold text-blue-700 mt-2">
                      {results.final_decision.localMatchCount} matches found
                    </p>
                  </div>
                  
                  <div className={`p-4 rounded-lg border ${
                    results.final_decision.externalApiAvailable 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-2">🌐</span>
                      <h4 className="font-semibold text-gray-800">External Verification</h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      {results.final_decision.externalApiAvailable 
                        ? 'Third-party API Check' 
                        : 'Unavailable'}
                    </p>
                    <p className={`text-lg font-bold mt-2 ${
                      results.final_decision.externalApiAvailable 
                        ? 'text-green-700' 
                        : 'text-gray-500'
                    }`}>
                      {results.final_decision.externalApiAvailable 
                        ? `${results.final_decision.externalMatchCount} matches found`
                        : 'Not available'}
                    </p>
                  </div>
                </div>
                
                {/* Reasons */}
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Analysis:</h4>
                  <ul className="space-y-2">
                    {results.final_decision.reasons.map((reason, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-primary-500 mr-2">•</span>
                        <span className="text-gray-700">{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          )}
          
          {/* Summary */}
          <Card title="📊 Local Detection Summary">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl font-bold text-gray-800">
                  {results.summary.totalMatchedSubmissions}
                </div>
                <div className="text-sm text-gray-600 mt-1">Total Matches</div>
              </div>
              
              <div className="text-center p-4 bg-danger-50 rounded-lg">
                <div className="text-3xl font-bold text-danger-600">
                  {results.summary.highSimilarity}
                </div>
                <div className="text-sm text-gray-600 mt-1">High Similarity</div>
              </div>
              
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-3xl font-bold text-orange-600">
                  {results.summary.moderateSimilarity}
                </div>
                <div className="text-sm text-gray-600 mt-1">Moderate</div>
              </div>
              
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">
                  {(results.summary.maxSimilarity * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600 mt-1">Max Similarity</div>
              </div>
            </div>
          </Card>
          
          {/* External API Results (New) - Dual Detection Methods */}
          {results.external_result && (
            <Card title="🌐 External API Verification (Dual Detection)">
              {results.external_result.available ? (
                <div className="space-y-4">
                  {/* Overview */}
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                    <div>
                      <p className="font-semibold text-green-800">✅ External API Check Completed</p>
                      <p className="text-sm text-green-600 mt-1">
                        Dual Detection: Copy Detection + AST Analysis
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-700">
                        {results.external_result.matches.length}
                      </div>
                      <div className="text-sm text-green-600">Total Matches</div>
                    </div>
                  </div>
                  
                  {/* Copy Detection Results */}
                  {results.external_result.copyDetect && (
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-blue-800 flex items-center">
                          <span className="mr-2">📋</span>
                          Copy Detection
                        </h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          results.external_result.copyDetect.matchesFound
                            ? 'bg-danger-100 text-danger-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {results.external_result.copyDetect.matchesFound ? 'Matches Found' : 'No Matches'}
                        </span>
                      </div>
                      {results.external_result.copyDetect.matches.length > 0 && (
                        <div className="space-y-2">
                          {results.external_result.copyDetect.matches.map((match, idx) => (
                            <div key={idx} className="p-3 bg-white rounded border border-blue-200">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold text-gray-800">
                                  Student: {match.matchedStudentId}
                                </span>
                                <span className="px-2 py-1 bg-danger-100 text-danger-700 rounded text-xs font-semibold">
                                  {(match.similarityScore * 100).toFixed(1)}%
                                </span>
                              </div>
                              {match.matchedCode && (
                                <pre className="text-xs text-gray-600 overflow-x-auto bg-gray-50 p-2 rounded">
                                  {match.matchedCode.substring(0, 150)}
                                  {match.matchedCode.length > 150 && '...'}
                                </pre>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      {results.external_result.copyDetect.matches.length === 0 && (
                        <p className="text-sm text-blue-600">No direct copy matches detected</p>
                      )}
                    </div>
                  )}
                  
                  {/* AST-Based Detection (Language Agnostic) */}
                  {(results.external_result.astDetect || results.external_result.treeSitterPython) && (
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-purple-800 flex items-center">
                          <span className="mr-2">🌳</span>
                          AST-Based Detection
                          {results.external_result.astDetect?.language && (
                            <span className="ml-2 text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded">
                              {results.external_result.astDetect.language.toUpperCase()}
                            </span>
                          )}
                        </h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          (results.external_result.astDetect?.matchesFound || results.external_result.treeSitterPython?.matchesFound)
                            ? 'bg-danger-100 text-danger-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {(results.external_result.astDetect?.matchesFound || results.external_result.treeSitterPython?.matchesFound) ? 'Matches Found' : 'No Matches'}
                        </span>
                      </div>
                      {((results.external_result.astDetect?.matches?.length || 0) > 0 || (results.external_result.treeSitterPython?.matches?.length || 0) > 0) && (
                        <div className="space-y-2">
                          {(results.external_result.astDetect?.matches || results.external_result.treeSitterPython?.matches || []).map((match, idx) => (
                            <div key={idx} className="p-3 bg-white rounded border border-purple-200">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold text-gray-800">
                                  Student: {match.matchedStudentId}
                                </span>
                                <span className="px-2 py-1 bg-danger-100 text-danger-700 rounded text-xs font-semibold">
                                  {(match.similarityScore * 100).toFixed(1)}%
                                </span>
                              </div>
                              {match.matchedCode && (
                                <pre className="text-xs text-gray-600 overflow-x-auto bg-gray-50 p-2 rounded">
                                  {match.matchedCode.substring(0, 150)}
                                  {match.matchedCode.length > 150 && '...'}
                                </pre>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      {((results.external_result.astDetect?.matches?.length || 0) === 0 && (results.external_result.treeSitterPython?.matches?.length || 0) === 0) && (
                        <p className="text-sm text-purple-600">No structural matches detected</p>
                      )}
                    </div>
                  )}
                  
                  {results.external_result.matches.length === 0 && (
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-green-700">
                        ✅ No matches found by external API verification
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="font-semibold text-yellow-800">⚠️ External API Unavailable</p>
                  <p className="text-sm text-yellow-600 mt-1">
                    {results.external_result.error || results.external_result.reason || 'External verification service is currently unavailable'}
                  </p>
                  <p className="text-sm text-yellow-600 mt-2">
                    ℹ️ Results are based on local detection only
                  </p>
                </div>
              )}
            </Card>
          )}
          
          {/* Similar Submissions */}
          {results.similarSubmissions && results.similarSubmissions.length > 0 && (
            <Card title="🎯 Similar Submissions">
              <div className="space-y-4">
                {results.similarSubmissions.map((submission, index) => (
                  <SimilarityCard 
                    key={submission.submissionId} 
                    submission={submission}
                    index={index}
                  />
                ))}
              </div>
            </Card>
          )}
          
          {/* Similar Chunks */}
          {results.similarChunks && results.similarChunks.length > 0 && (
            <Card title="🧩 Similar Code Chunks">
              <p className="text-sm text-gray-600 mb-4">
                These are specific functions or code blocks that match with other submissions:
              </p>
              <div className="space-y-3">
                {results.similarChunks.map((chunk, index) => (
                  <ChunkCard 
                    key={`${chunk.submissionId}-${chunk.matchedChunkIndex}-${index}`}
                    chunk={chunk}
                    index={index}
                  />
                ))}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default CheckSimilarity;

