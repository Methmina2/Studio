import React, { useState } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    category: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
      const response = await fetch(`${baseUrl}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        setSuccess(true);
        setFormData({ name: '', email: '', phone: '', subject: '', category: '', message: '' });
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError(data.message || 'Something went wrong.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="pt-24 pb-16 px-4 bg-absolute-black min-h-screen">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white text-center mb-4">
            Contact Us
          </h1>
          <p className="font-sans text-zinc-400 text-center max-w-2xl mx-auto mb-12">
            Get in touch to book your session or ask any questions.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-studio-surface border border-zinc-800 rounded-xl p-8">
              {success && (
                <div className="bg-green-500/20 border border-green-500 text-green-400 p-4 rounded-lg mb-6">
                  Message sent successfully! We'll get back to you soon.
                </div>
              )}
              {error && (
                <div className="bg-red-500/20 border border-red-500 text-red-400 p-4 rounded-lg mb-6">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-absolute-black border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#de660e] transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-absolute-black border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#de660e] transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-absolute-black border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#de660e] transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full bg-absolute-black border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#de660e] transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-absolute-black border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#de660e] transition"
                  >
                    <option value="">Select a category</option>
                    <option value="general">General</option>
                    <option value="booking">Booking</option>
                    <option value="rental">Rental</option>
                    <option value="feedback">Feedback</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="4"
                    required
                    className="w-full bg-absolute-black border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#de660e] transition"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#de660e] text-black font-semibold py-3 rounded-full hover:bg-[#ff7f2c] transition disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div className="bg-studio-surface border border-zinc-800 rounded-xl p-8">
                <h2 className="font-serif text-2xl font-bold text-white mb-6">Get in Touch</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <FaEnvelope className="text-[#de660e] mt-1" size={20} />
                    <div>
                      <p className="text-sm text-zinc-400">Email</p>
                      <a href="mailto:hotmellolabs@gmail.com" className="text-white hover:text-[#de660e] transition">
                        hotmellolabs@gmail.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <FaPhone className="text-[#de660e] mt-1" size={20} />
                    <div>
                      <p className="text-sm text-zinc-400">Phone</p>
                      <a href="tel:+94701770163" className="text-white hover:text-[#de660e] transition">
                        +94 70 177 0163
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <FaMapMarkerAlt className="text-[#de660e] mt-1" size={20} />
                    <div>
                      <p className="text-sm text-zinc-400">Address</p>
                      <p className="text-white">No. 38, Uyandana, Sri Lanka, 60000</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
