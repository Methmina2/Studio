import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../services/api';
import { FaUsers, FaCalendarCheck, FaCamera, FaEnvelope } from 'react-icons/fa';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ bookings: 0, rentals: 0, contacts: 0, services: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError('');

      try {
        const requests = [
          api.get('/bookings'),
          api.get('/rentals'),
          api.get('/contact'),
          api.get('/services'),
        ];

        const results = await Promise.allSettled(requests);
        const nextStats = { bookings: 0, rentals: 0, contacts: 0, services: 0 };
        const failed = [];

        results.forEach((result, index) => {
          const keyMap = ['bookings', 'rentals', 'contacts', 'services'];
          const key = keyMap[index];

          if (result.status === 'fulfilled') {
            const data = result.value?.data?.data;
            nextStats[key] = Array.isArray(data) ? data.length : 0;
          } else {
            failed.push(key);
          }
        });

        setStats(nextStats);

        if (failed.length > 0) {
          setError(`Some dashboard data could not be loaded: ${failed.join(', ')}`);
        }
      } catch (err) {
        console.error('Failed to fetch stats', err);
        setError('Unable to load dashboard data right now.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { label: 'Bookings', value: stats.bookings, icon: FaCalendarCheck, color: 'text-blue-400' },
    { label: 'Rentals', value: stats.rentals, icon: FaCamera, color: 'text-[#ff7f2c]' },
    { label: 'Contacts', value: stats.contacts, icon: FaEnvelope, color: 'text-green-400' },
    { label: 'Services', value: stats.services, icon: FaUsers, color: 'text-purple-400' },
  ];

  return (
    <AdminLayout>
      <h1 className="font-serif text-3xl font-bold text-white mb-6">Dashboard</h1>
      {error && (
        <div className="mb-4 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-300">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <div key={card.label} className="bg-studio-surface border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-sm">{card.label}</p>
                {loading ? (
                  <div className="h-8 w-16 bg-zinc-800 animate-pulse rounded mt-1"></div>
                ) : (
                  <p className="text-3xl font-bold text-white">{card.value}</p>
                )}
              </div>
              <card.icon className={`w-8 h-8 ${card.color}`} />
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
