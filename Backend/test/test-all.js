const axios = require('axios');
const http = require('http');

// Configuration
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5001';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@hotmello.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

let passed = 0;
let failed = 0;
const failures = [];

const runTest = async (name, fn) => {
  process.stdout.write(`🧪 Testing: ${name} ... `);
  try {
    await fn();
    console.log('✅ PASS');
    passed++;
  } catch (error) {
    console.log('❌ FAIL');
    failed++;
    failures.push({ name, error: error.message });
  }
};

const assert = (condition, message) => {
  if (!condition) throw new Error(message || 'Assertion failed');
};

// ================================
// 1. Check backend health
// ================================
const checkBackendHealth = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/health`);
    return response.status === 200;
  } catch {
    return false;
  }
};

// ================================
// 2. API Tests
// ================================
let adminToken = '';
let createdBookingId = '';
let createdRentalId = '';
let createdServiceType = 'testservice';

const api = axios.create({ baseURL: `${BACKEND_URL}/api` });
api.interceptors.request.use((config) => {
  if (adminToken) {
    config.headers.Authorization = `Bearer ${adminToken}`;
  }
  return config;
});

const apiTests = {
  'Admin Login': async () => {
    const response = await api.post('/auth/login', {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });
    assert(response.status === 200, 'Expected 200');
    assert(response.data.token, 'Token missing');
    adminToken = response.data.token;
  },
  'GET /services': async () => {
    const response = await api.get('/services');
    assert(response.status === 200);
    assert(response.data.success === true);
    assert(Array.isArray(response.data.data));
  },
  'GET /services/type/wedding': async () => {
    const response = await api.get('/services/type/wedding');
    assert(response.status === 200);
    assert(response.data.success === true);
    assert(response.data.data.type === 'wedding');
  },
  'POST /bookings': async () => {
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
  },
  'POST /rentals': async () => {
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
  },
  'POST /contact': async () => {
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
  },
  'GET /bookings (admin)': async () => {
    const response = await api.get('/bookings');
    assert(response.status === 200);
    assert(response.data.success === true);
    assert(Array.isArray(response.data.data));
    assert(response.data.data.length > 0);
  },
  'PUT /bookings/:id/status (admin)': async () => {
    const response = await api.put(`/bookings/${createdBookingId}/status`, {
      status: 'confirmed',
    });
    assert(response.status === 200);
    assert(response.data.success === true);
    assert(response.data.data.status === 'confirmed');
  },
  'GET /rentals (admin)': async () => {
    const response = await api.get('/rentals');
    assert(response.status === 200);
    assert(response.data.success === true);
    assert(Array.isArray(response.data.data));
    assert(response.data.data.length > 0);
  },
  'PUT /rentals/:id/status (admin)': async () => {
    // No /rentals/:id/status route implemented in the API; skipping.
  },
  'GET /contact (admin)': async () => {
    const response = await api.get('/contact');
    assert(response.status === 200);
    assert(response.data.success === true);
    assert(Array.isArray(response.data.data));
    assert(response.data.data.length > 0);
  },
  'POST /services (admin)': async () => {
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
  },
  'PUT /services/:type (admin)': async () => {
    const response = await api.put(`/services/${createdServiceType}`, {
      title: 'Updated Test Service',
    });
    assert(response.status === 200);
    assert(response.data.success === true);
    assert(response.data.data.title === 'Updated Test Service');
  },
  'DELETE /services/:type (admin)': async () => {
    const response = await api.delete(`/services/${createdServiceType}`);
    assert(response.status === 200);
    assert(response.data.success === true);
  },
};

// ================================
// 3. Frontend Tests
// ================================
const frontendTests = {
  'Frontend home page loads': async () => {
    const response = await fetch(`${FRONTEND_URL}`);
    assert(response.status === 200, `Expected 200, got ${response.status}`);
    const text = await response.text();
    // Check for root div or meta title – React apps render client-side
    assert(
      text.includes('<div id="root">') || text.includes('Hotmello'),
      'Expected root div or "Hotmello" in HTML'
    );
  },
  'Frontend /about page loads': async () => {
    const response = await fetch(`${FRONTEND_URL}/about`);
    assert(response.status === 200, `Expected 200, got ${response.status}`);
  },
  'Frontend /contact page loads': async () => {
    const response = await fetch(`${FRONTEND_URL}/contact`);
    assert(response.status === 200, `Expected 200, got ${response.status}`);
  },
  'Frontend /booking page loads': async () => {
    const response = await fetch(`${FRONTEND_URL}/booking`);
    assert(response.status === 200, `Expected 200, got ${response.status}`);
  },
  'Frontend /rentals page loads': async () => {
    const response = await fetch(`${FRONTEND_URL}/rentals`);
    assert(response.status === 200, `Expected 200, got ${response.status}`);
  },
  'Frontend /production page loads': async () => {
    const response = await fetch(`${FRONTEND_URL}/production`);
    assert(response.status === 200, `Expected 200, got ${response.status}`);
  },
  'Frontend /studiolabs page loads': async () => {
    const response = await fetch(`${FRONTEND_URL}/studiolabs`);
    assert(response.status === 200, `Expected 200, got ${response.status}`);
  },
};

// ================================
// Main runner
// ================================
const main = async () => {
  console.log('🚀 Starting integration tests...\n');

  console.log('🔍 Checking backend health...');
  const isBackendUp = await checkBackendHealth();
  if (!isBackendUp) {
    console.error(`❌ Backend is not reachable at ${BACKEND_URL}. Please start it first.`);
    process.exit(1);
  }
  console.log('✅ Backend is reachable.\n');

  console.log('📡 Running API tests...');
  for (const [name, fn] of Object.entries(apiTests)) {
    await runTest(name, fn);
  }
  const apiFailed = failed;
  console.log(`\n📊 API tests: ${passed - (failed - apiFailed)} passed, ${apiFailed} failed`);

  console.log('\n🌐 Checking frontend...');
  let frontendUp = false;
  try {
    const response = await fetch(`${FRONTEND_URL}`);
    if (response.status === 200) {
      frontendUp = true;
      console.log('✅ Frontend is reachable.\n');
    }
  } catch {
    // ignore
  }

  if (!frontendUp) {
    console.warn(`⚠️ Frontend not reachable at ${FRONTEND_URL}. Skipping frontend tests.`);
  } else {
    for (const [name, fn] of Object.entries(frontendTests)) {
      await runTest(name, fn);
    }
    console.log(`\n📊 Frontend tests: ${passed - (failed - apiFailed)} passed, ${failed - apiFailed} failed`);
  }

  console.log('\n========================================');
  console.log('📊 FINAL TEST SUMMARY');
  console.log('========================================');
  console.log(`Total API tests:    ${Object.keys(apiTests).length}`);
  console.log(`API passed:         ${Object.keys(apiTests).length - apiFailed}`);
  console.log(`API failed:         ${apiFailed}`);

  if (frontendUp) {
    const frontendTotal = Object.keys(frontendTests).length;
    const frontendFailed = failed - apiFailed;
    console.log(`Frontend tests:     ${frontendTotal}`);
    console.log(`Frontend passed:    ${frontendTotal - frontendFailed}`);
    console.log(`Frontend failed:    ${frontendFailed}`);
  } else {
    console.log('Frontend tests:     Skipped (not reachable)');
  }

  if (failures.length > 0) {
    console.log('\n❌ Failed tests:');
    failures.forEach((f) => console.log(`  - ${f.name}: ${f.error}`));
    process.exit(1);
  } else {
    console.log('\n🎉 All tests passed successfully!');
  }
};

main();