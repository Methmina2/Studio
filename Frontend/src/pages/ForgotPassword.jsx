import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await api.post('/auth/forgot-password', { email });
      setMessage(response.data.message || 'If that email exists, a reset link has been sent.');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to send reset instructions.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-absolute-black px-4 py-10">
      <div className="w-full max-w-md bg-studio-surface border border-zinc-800 rounded-3xl p-8">
        <h1 className="font-serif text-3xl font-bold text-white text-center mb-3">Forgot Password</h1>
        <p className="text-zinc-400 text-sm text-center mb-6">
          Enter your admin email and we’ll send a secure reset link.
        </p>
        {message && <div className="bg-emerald-500/10 border border-emerald-500 text-emerald-300 p-3 rounded-lg mb-4 text-sm">{message}</div>}
        {error && <div className="bg-red-500/10 border border-red-500 text-red-300 p-3 rounded-lg mb-4 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Admin Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-2xl border border-zinc-700 bg-absolute-black px-4 py-3 text-white focus:border-[#de660e] focus:outline-none"
              placeholder="admin@hotmello.com"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#de660e] px-4 py-3 text-black font-semibold hover:bg-[#ff7f2c] transition disabled:opacity-60"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-zinc-400">
          <Link to="/admin/login" className="text-[#de660e] hover:text-[#ff7f2c] transition">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
