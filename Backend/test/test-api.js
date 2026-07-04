const axios = require('axios');

const BASE_URL = process.env.BACKEND_URL ? `${process.env.BACKEND_URL.replace(/\/$/, '')}/api` : 'http://localhost:5001/api';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@hotmello.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

let adminToken = '';
let createdBookingId = '';
let createdRentalId = '';
let createdServiceType = 'testservice';

const api = axios.create({ baseURL: BASE_URL });
api.interceptors.request.use((config) => {
  if (adminToken) {
    config.headers.Authorization = `Bearer ${adminToken}`;
  }
  return config;
});

const runTest = async (name, fn) => {
  console.log(`\n🧪 Testing: ${name}`);
  try {
    await fn();
    console.log(`✅ ${name} passed`);
  } catch (error) {
    console.error(`❌ ${name} failed:`, error.message);
    if (error.response) {
      console.error('   Response status:', error.response.status);
      console.error('   Response data:', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
};

const assert = (condition, message) => {
  if (!condition) throw new Error(message || 'Assertion failed');
};

console.log('🚀 Starting API tests...');

(async () => {
  // 1. Admin Login
  await runTest('Admin Login', async () => {
    const response = await api.post('/auth/login', {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });
    assert(response.status === 200, 'Expected 200');
    assert(response.data.token, 'Token missing');
    adminToken = response.data.token;
    console.log(`   Token set: ${adminToken.substring(0, 20)}...`);
  });

  // 2. Public endpoints
  await runTest('GET /services', async () => {
    const response = await api.get('/services');
    assert(response.status === 200);
    assert(response.data.success === true);
    assert(Array.isArray(response.data.data));
  });

  await runTest('GET /services/type/:type (wedding)', async () => {
    const response = await api.get('/services/type/wedding');
    assert(response.status === 200);
    assert(response.data.success === true);
    assert(response.data.data.type === 'wedding');
  });

  await runTest('POST /bookings', async () => {
    const bookingData = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '1234567890',
      service: 'Wedding',
      date: new Date().toISOString(),
      message: 'Test booking',
      package: 'premium',
    };
    const response = await api.post('/bookings', bookingData);
    assert(response.status === 201);
    assert(response.data.success === true);
    assert(response.data.data._id);
    createdBookingId = response.data.data._id;
  });

  await runTest('POST /rentals', async () => {
    // Admin creates a rental item (name, category, pricePerDay)
    const rentalItem = {
      name: 'Test Rental Item',
      category: 'Camera',
      pricePerDay: 1200,
      description: 'Automated test item',
      specs: JSON.stringify(['spec1', 'spec2']),
      available: true,
    };
    const response = await api.post('/rentals', rentalItem);
    assert(response.status === 201);
    assert(response.data.success === true);
    assert(response.data.data._id);
    createdRentalId = response.data.data._id;
  });

  await runTest('POST /contact', async () => {
    const contactData = {
      name: 'Contact Tester',
      email: 'contact@example.com',
      phone: '1234567890',
      subject: 'Test Subject',
      category: 'General',
      message: 'Test message',
    };
    const response = await api.post('/contact', contactData);
    assert(response.status === 201);
    assert(response.data.success === true);
    assert(response.data.data._id);
  });

  // 3. Admin protected endpoints
  await runTest('GET /bookings (admin)', async () => {
    const response = await api.get('/bookings');
    assert(response.status === 200);
    assert(response.data.success === true);
    assert(Array.isArray(response.data.data));
    assert(response.data.data.length > 0);
  });

  await runTest('PUT /bookings/:id/status (admin)', async () => {
    const response = await api.put(`/bookings/${createdBookingId}/status`, {
      status: 'confirmed',
    });
    assert(response.status === 200);
    assert(response.data.success === true);
    assert(response.data.data.status === 'confirmed');
  });

  await runTest('GET /rentals (admin)', async () => {
    const response = await api.get('/rentals');
    assert(response.status === 200);
    assert(response.data.success === true);
    assert(Array.isArray(response.data.data));
    assert(response.data.data.length > 0);
  });

  // Note: No dedicated /rentals/:id/status route exists; use PUT /rentals/:id for updates.

  await runTest('GET /contact (admin)', async () => {
    const response = await api.get('/contact');
    assert(response.status === 200);
    assert(response.data.success === true);
    assert(Array.isArray(response.data.data));
    assert(response.data.data.length > 0);
  });

  await runTest('POST /services (admin)', async () => {
    const newService = {
      type: createdServiceType,
      title: 'Test Service',
      description: 'Test',
      imageUrls: ['/images/test.jpg'],
      price: '$100',
      details: { test: true },
    };
    const response = await api.post('/services', newService);
    assert(response.status === 201);
    assert(response.data.success === true);
    assert(response.data.data.type === createdServiceType);
  });

  await runTest('PUT /services/:type (admin)', async () => {
    const response = await api.put(`/services/${createdServiceType}`, {
      title: 'Updated Test Service',
    });
    assert(response.status === 200);
    assert(response.data.success === true);
    assert(response.data.data.title === 'Updated Test Service');
  });

  await runTest('DELETE /services/:type (admin)', async () => {
    const response = await api.delete(`/services/${createdServiceType}`);
    assert(response.status === 200);
    assert(response.data.success === true);
  });

  console.log('\n🎉 All tests passed successfully!');
})();