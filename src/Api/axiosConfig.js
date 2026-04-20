import axios from 'axios';

const api = axios.create({
  baseURL: 'http://doroob.runasp.net/api/v1', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;