const axios = require('axios');

const BASE = process.env.BACKEND_URL ? `${process.env.BACKEND_URL.replace(/\/$/, '')}/api` : 'http://localhost:5001/api';
async function run(){
  try{
    const login = await axios.post(`${BASE}/auth/login`, { email: process.env.ADMIN_EMAIL || 'admin@hotmello.com', password: process.env.ADMIN_PASSWORD || 'admin123' });
    const token = login.data.token;
    console.log('token', token.substring(0,20));
    const api = axios.create({ baseURL: BASE, headers: { Authorization: `Bearer ${token}` } });
    const data = { name: 'Test Rental Item', category: 'Camera', pricePerDay: 1000, description: 'desc', specs: JSON.stringify(['a','b']), available: true };
    const res = await api.post('/rentals', data);
    console.log('RES', res.status, res.data);
  }catch(e){
    console.error('ERR', e.response?.status, e.response?.data);
    console.error(e.message);
    process.exit(1);
  }
}
run();
