/**
 * API Service Layer
 * Handles all communication with the backend plagiarism detection API
 */

import axios from 'axios';

// Base URL for the API - adjust if backend is on different host/port
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout for embedding generation
});

// Request interceptor for logging (optional)
apiClient.interceptors.request.use(
  (config) => {
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('[API Response Error]', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/**
 * Check if the backend server is healthy
 * @returns {Promise<Object>} Health status
 */
export const checkHealth = async () => {
  try {
    const response = await apiClient.get('/api/health');
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || error.message || 'Failed to connect to server',
    };
  }
};

/**
 * Submit code for plagiarism detection
 * @param {Object} submissionData - { studentId, questionId, code, language, apiKey }
 * @returns {Promise<Object>} Submission result with ID and chunk info
 */
export const submitCode = async (submissionData) => {
  try {
    const { studentId, questionId, code, language = 'javascript', apiKey } = submissionData;
    
    // Validate required fields
    if (!studentId || !questionId || !code) {
      throw new Error('Missing required fields: studentId, questionId, and code are required');
    }
    
    if (code.trim().length === 0) {
      throw new Error('Code cannot be empty');
    }
    
    // Add API key to headers if provided
    const config = apiKey ? {
      headers: {
        'X-OpenAI-API-Key': apiKey
      }
    } : {};
    
    const response = await apiClient.post('/api/submit', {
      studentId,
      questionId,
      code,
      language,
    }, config);
    
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || error.message || 'Failed to submit code',
    };
  }
};

/**
 * Check code similarity with existing submissions
 * @param {Object} checkData - { questionId, code, similarityThreshold, maxResults, apiKey }
 * @returns {Promise<Object>} Similarity results with matched submissions and chunks
 */
export const checkSimilarity = async (checkData) => {
  try {
    const { 
      questionId, 
      code, 
      language = 'javascript',
      similarityThreshold = 0.75,
      maxResults = 5,
      apiKey 
    } = checkData;
    
    // Validate required fields
    if (!questionId || !code) {
      throw new Error('Missing required fields: questionId and code are required');
    }
    
    if (code.trim().length === 0) {
      throw new Error('Code cannot be empty');
    }
    
    // Add API key to headers if provided
    const config = apiKey ? {
      headers: {
        'X-OpenAI-API-Key': apiKey
      }
    } : {};
    
    const response = await apiClient.post('/api/check', {
      questionId,
      code,
      language,
      similarityThreshold,
      maxResults,
    }, config);
    
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || error.message || 'Failed to check similarity',
    };
  }
};

/**
 * Get all submissions for a specific question
 * @param {string} questionId - Question identifier
 * @returns {Promise<Object>} List of submissions
 */
export const getSubmissionsByQuestion = async (questionId) => {
  try {
    if (!questionId) {
      throw new Error('Question ID is required');
    }
    
    const response = await apiClient.get(`/api/submissions/${questionId}`);
    
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || error.message || 'Failed to get submissions',
    };
  }
};

/**
 * Get a specific submission by ID
 * @param {number} submissionId - Submission ID
 * @returns {Promise<Object>} Submission details
 */
export const getSubmissionById = async (submissionId) => {
  try {
    if (!submissionId) {
      throw new Error('Submission ID is required');
    }
    
    const response = await apiClient.get(`/api/submission/${submissionId}`);
    
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || error.message || 'Failed to get submission',
    };
  }
};

// Export the API client for custom requests if needed
export default apiClient;

