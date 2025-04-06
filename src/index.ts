interface MailtigerConfig {
  token: string;
  maxRetries?: number;
  timeout?: number;
}

interface EmailSearchParams {
  subject?: string;
  sender?: string;
}

interface Email {
  id: string;
  subject: string;
  sender: string;
  body: string;
  receivedAt: string;
}

interface ApiResponse {
  email: string;
  verificationLink: string;
}

interface ApiError extends Error {
  status?: number;
  code?: string;
}

export const mailtiger = ({ 
  token,
  maxRetries = 3,
  timeout = 30000
}: MailtigerConfig) => {
  // Validate token
  if (!token) {
    throw new Error('Token is required');
  }

  // Validate configuration
  if (maxRetries < 0) {
    throw new Error('maxRetries must be a non-negative number');
  }
  if (timeout <= 0) {
    throw new Error('timeout must be a positive number');
  }

  // Make API call with retry logic
  const fetchData = async (endpoint: string, options: RequestInit, retryCount = 0): Promise<any> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(`https://api.mailtiger.com${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error: ApiError = new Error(`API request failed with status ${response.status}`);
        error.status = response.status;
        
        if (response.status === 401) {
          error.message = 'Invalid or expired token';
          error.code = 'INVALID_TOKEN';
        } else if (response.status === 404) {
          error.message = 'Resource not found';
          error.code = 'NOT_FOUND';
        } else if (response.status >= 500) {
          error.message = 'Server error occurred';
          error.code = 'SERVER_ERROR';
        }

        throw error;
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === 'AbortError') {
        const timeoutError: ApiError = new Error(`Request timed out after ${timeout}ms`);
        timeoutError.code = 'TIMEOUT';
        throw timeoutError;
      }

      if (error instanceof TypeError && error.message.includes('fetch')) {
        const networkError: ApiError = new Error('Network connection failed');
        networkError.code = 'NETWORK_ERROR';
        throw networkError;
      }

      if (retryCount < maxRetries) {
        const isRetryable = 
          (error as ApiError).code === 'SERVER_ERROR' || 
          (error as ApiError).code === 'NETWORK_ERROR' ||
          (error as ApiError).code === 'TIMEOUT';

        if (isRetryable) {
          const delay = Math.min(Math.pow(2, retryCount) * 1000, 30000);
          await new Promise(resolve => setTimeout(resolve, delay));
          return fetchData(endpoint, options, retryCount + 1);
        }
      }

      throw error;
    }
  };

  // Create a new email address
  const createEmail = async (): Promise<string> => {
    const response = await fetchData('/emails', {
      method: 'POST',
    });
    return response.email;
  };

  // Get emails with optional filters
  const getEmails = async (params?: EmailSearchParams): Promise<Email[]> => {
    const queryParams = new URLSearchParams();
    if (params?.subject) queryParams.append('subject', params.subject);
    if (params?.sender) queryParams.append('sender', params.sender);

    const endpoint = `/emails${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return fetchData(endpoint, {
      method: 'GET',
    });
  };

  return {
    createEmail,
    getEmails,
  };
};