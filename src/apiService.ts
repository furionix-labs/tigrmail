import axios from 'axios';
import axiosRetry from 'axios-retry';

const api = axios.create({
  baseURL: 'https://api.tigrmail.com',
  timeout: 3 * 60 * 1000, // 3 minutes
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosRetry(api, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: () => true,
});

export { api };