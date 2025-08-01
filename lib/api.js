import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3',
  headers: {
    'x-cg-demo-api-key': process.env.NEXT_PUBLIC_COINGECKO_API_KEY,
  },
});

export default api;
