import axios from 'axios';

const api = axios.create({
  // URL do seu backend Python
  baseURL: 'http://127.0.0.1:8000', 
});

export default api;