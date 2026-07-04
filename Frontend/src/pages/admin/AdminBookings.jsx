import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../services/api';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings');
      setBookings(res.data.data);
    } catch (err) {
      console.error('Failed to fetch bookings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/bookings/${id}/status`, { status });
      fetchBookings();
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-[#de660e]/20 text-[#ff7f2c]',
      confirmed: 'bg-green-500/20 text-green-400',
      canceled: 'bg-red-500/20 text-red-400',
    };
    return colors[status] || 'bg-zinc-500/20 text-zinc-400';
  };

  return (
    <AdminLayout>
      <h1 className="font-serif text-3xl font-bold text-white mb-6">Bookings</h1>
      {loading ? (
        <div className="text-zinc-400">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left py-3 px-4 text-zinc-500 text-sm font-medium">Name</th>
                <th className="text-left py-3 px-4 text-zinc-500 text-sm font-medium">Email</th>
                <th className="text-left py-3 px-4 text-zinc-500 text-sm font-medium">Service</th>
                <th className="text-left py-3 px-4 text-zinc-500 text-sm font-medium">Date</th>
                <th className="text-left py-3 px-4 text-zinc-500 text-sm font-medium">Status</th>
                <th className="text-left py-3 px-4 text-zinc-500 text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id} className="border-b border-zinc-800 hover:bg-white/5">
                  <td className="py-3 px-4 text-white">{booking.name}</td>
                  <td className="py-3 px-4 text-zinc-400">{booking.email}</td>
                  <td className="py-3 px-4 text-zinc-400">{booking.service}</td>
                  <td className="py-3 px-4 text-zinc-400">{new Date(booking.date).toDateString()}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={booking.status}
                      onChange={(e) => updateStatus(booking._id, e.target.value)}
                      className="bg-absolute-black border border-zinc-700 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:border-[#de660e]"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="canceled">Canceled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminBookings;
