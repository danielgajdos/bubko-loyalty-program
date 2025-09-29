// Debug script to check environment variables
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('All env vars:', import.meta.env);

// Test API connection
fetch('/api/health')
  .then(response => response.json())
  .then(data => console.log('Local API test:', data))
  .catch(error => console.log('Local API error:', error));

// Test external API connection
const apiUrl = import.meta.env.VITE_API_URL || '/api';
fetch(`${apiUrl}/health`)
  .then(response => response.json())
  .then(data => console.log('External API test:', data))
  .catch(error => console.log('External API error:', error));