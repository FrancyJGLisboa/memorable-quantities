import OpenAI from 'openai';

// Get API key from system environment variable
const apiKey = process.env.DEEPSEEK_API_KEY || process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY;

if (!apiKey) {
  console.error('Missing DEEPSEEK_API_KEY environment variable');
  throw new Error('Missing DEEPSEEK_API_KEY environment variable. Make sure it is set in your system environment.');
}

// Initialize the client with DeepSeek's configuration
const deepSeekClient = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey,
});

export default deepSeekClient; 