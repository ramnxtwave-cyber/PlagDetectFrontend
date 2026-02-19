/**
 * Submit Code Page
 * Allows students to submit their code for plagiarism detection
 */

import React, { useState } from 'react';
import Card from '../components/Card';
import Input from '../components/Input';
import CodeEditor from '../components/CodeEditor';
import Button from '../components/Button';
import Alert from '../components/Alert';
import ApiKeyInput from '../components/ApiKeyInput';
import { submitCode } from '../api/plagiarismApi';

const SubmitCode = () => {
  // Form state
  const [formData, setFormData] = useState({
    studentId: '',
    questionId: '',
    code: '',
    language: 'javascript'
  });
  
  // API Key state
  const [apiKey, setApiKey] = useState('');
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Handle code editor change
  const handleCodeChange = (e) => {
    setFormData(prev => ({
      ...prev,
      code: e.target.value
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
    
    if (!formData.studentId.trim()) {
      newErrors.studentId = 'Student ID is required';
    }
    
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
    
    try {
      // Call API with optional API key
      const result = await submitCode({
        ...formData,
        apiKey: apiKey || undefined
      });
      
      if (result.success) {
        // Success
        setAlert({
          type: 'success',
          message: `✅ Code submitted successfully! Submission ID: ${result.data.submissionId}. Generated ${result.data.chunkCount} code chunks.`
        });
        
        // Clear form after successful submission
        setFormData({
          studentId: '',
          questionId: '',
          code: '',
          language: 'javascript'
        });
        
        // Scroll to top to see success message
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        // Error from API
        setAlert({
          type: 'error',
          message: result.error || 'Failed to submit code'
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
    <div className="max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          📝 Submit Code for Analysis
        </h1>
        <p className="text-gray-600">
          Submit your code to generate embeddings and store it in the plagiarism detection system.
        </p>
      </div>
      
      {/* Alert */}
      {alert && (
        <Alert 
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}
      
      {/* Submission Form */}
      <Card>
        <form onSubmit={handleSubmit}>
          {/* Student ID */}
          <Input
            label="Student ID"
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
            placeholder="e.g., student123"
            required
            error={errors.studentId}
            disabled={loading}
          />
          
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
          
          {/* Language Selection */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Programming Language
            </label>
            <select
              name="language"
              value={formData.language}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          {/* Code Editor */}
          <CodeEditor
            label="Your Code"
            value={formData.code}
            onChange={handleCodeChange}
            placeholder="function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}"
            required
            error={errors.code}
            disabled={loading}
          />
          
          {/* Submit Button */}
          <div className="flex gap-4">
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              disabled={loading}
              fullWidth
            >
              {loading ? 'Submitting...' : '🚀 Save Submission'}
            </Button>
            
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setFormData({
                  studentId: '',
                  questionId: '',
                  code: '',
                  language: 'javascript'
                });
                setErrors({});
                setAlert(null);
              }}
              disabled={loading}
            >
              Clear
            </Button>
          </div>
        </form>
      </Card>
      
      {/* Info Card */}
      <Card className="mt-6 bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">ℹ️ How it works:</h3>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>Your code is analyzed and converted into semantic embeddings</li>
          <li>The system extracts functions and code blocks as chunks</li>
          <li>All embeddings are stored for future similarity comparisons</li>
          <li>Processing typically takes 2-5 seconds depending on code length</li>
        </ul>
      </Card>
    </div>
  );
};

export default SubmitCode;

