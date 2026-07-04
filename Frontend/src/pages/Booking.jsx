import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { servicesData } from '../data/serviceData';

// Filter out "Camera Rentals" from booking services
const bookingServices = servicesData.filter(
  (service) => service.title !== 'Camera Rentals'
);

const Booking = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    date: '',
    message: '',
    package: 'basic',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Set pre-selected service from URL query parameter on mount and when searchParams change
  useEffect(() => {
    const service = searchParams.get('service');
    if (service) {
      const validService = bookingServices.some(s => s.title === service);
      if (validService) {
        setFormData(prev => ({ ...prev, service }));
      }
    }
  }, [searchParams]);

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
      const response = await fetch(`${baseUrl}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        setSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          service: '',
          date: '',
          message: '',
          package: 'basic',
        });
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        setError(data.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const isProduction = formData.service === 'Production';
  const isStudioRental = formData.service === 'Studio Rentals';
  const isWedding = formData.service === 'Wedding';

  return (
    <div className="pt-24 pb-16 px-4 bg-absolute-black min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-white text-center mb-4">
          Book a Session
        </h1>
        <p className="font-sans text-zinc-400 text-center max-w-2xl mx-auto mb-12">
          Fill in the details below and we’ll get back to you within 24 hours.
        </p>

        {success && (
          <div className="bg-green-500/20 border border-green-500 text-green-400 p-4 rounded-lg mb-6 text-center">
            Booking submitted successfully! Redirecting...
          </div>
        )}
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-400 p-4 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 bg-studio-surface border border-zinc-800 rounded-xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Full Name *</label>
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
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Phone *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full bg-absolute-black border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#de660e] transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Service *</label>
            <select
              name="service"
              value={formData.service}
              onChange={handleChange}
              required
              className="w-full bg-absolute-black border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#de660e] transition"
            >
              <option value="">Select a service</option>
              {bookingServices.map((service) => (
                <option key={service.id} value={service.title}>
                  {service.title}
                </option>
              ))}
            </select>
            <p className="text-xs text-zinc-500 mt-1">
              * For Camera Rentals, please visit the{' '}
              <a href="/rentals" className="text-[#de660e] hover:underline">Rentals page</a>.
            </p>
          </div>

          {/* Package selection – conditional */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Package</label>
            {isWedding ? (
              <div className="space-y-3">
                <label className="flex items-start gap-3 p-3 rounded-lg border border-zinc-700 hover:border-[#de660e]/50 transition cursor-pointer bg-absolute-black/50">
                  <input
                    type="radio"
                    name="package"
                    value="LKR 25,000 – Basic Wedding Package"
                    checked={formData.package === 'LKR 25,000 – Basic Wedding Package'}
                    onChange={handleChange}
                    className="w-4 h-4 accent-[#de660e] mt-1"
                  />
                  <div>
                    <span className="text-white text-sm font-medium">LKR 25,000 – Basic Package</span>
                    <p className="text-zinc-400 text-xs mt-0.5">12x18 one frame enlargement</p>
                    <p className="text-zinc-400 text-xs">Main photo session at preferred location</p>
                    <p className="text-zinc-400 text-xs">Exclusive event coverage</p>
                    <p className="text-zinc-400 text-xs">Edited soft copies pack</p>
                    <p className="text-zinc-400 text-xs">All unedited soft copies</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-lg border border-zinc-700 hover:border-[#de660e]/50 transition cursor-pointer bg-absolute-black/50">
                  <input
                    type="radio"
                    name="package"
                    value="LKR 35,000 – Standard Wedding Package"
                    checked={formData.package === 'LKR 35,000 – Standard Wedding Package'}
                    onChange={handleChange}
                    className="w-4 h-4 accent-[#de660e] mt-1"
                  />
                  <div>
                    <span className="text-white text-sm font-medium">LKR 35,000 – Standard Package</span>
                    <p className="text-zinc-400 text-xs mt-0.5">12x18 one frame enlargement</p>
                    <p className="text-zinc-400 text-xs">60 thank you cards or sign board</p>
                    <p className="text-zinc-400 text-xs">Main photo session at preferred location</p>
                    <p className="text-zinc-400 text-xs">Exclusive event coverage</p>
                    <p className="text-zinc-400 text-xs">Edited soft copies pack</p>
                    <p className="text-zinc-400 text-xs">All unedited soft copies</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-lg border border-zinc-700 hover:border-[#de660e]/50 transition cursor-pointer bg-absolute-black/50">
                  <input
                    type="radio"
                    name="package"
                    value="LKR 65,000 – Premium Wedding Package"
                    checked={formData.package === 'LKR 65,000 – Premium Wedding Package'}
                    onChange={handleChange}
                    className="w-4 h-4 accent-[#de660e] mt-1"
                  />
                  <div>
                    <span className="text-white text-sm font-medium">LKR 65,000 – Premium Package</span>
                    <p className="text-zinc-400 text-xs mt-0.5">12x16 magazine album (50 pages / 25 spreads)</p>
                    <p className="text-zinc-400 text-xs">16x24 one frame enlargement</p>
                    <p className="text-zinc-400 text-xs">100 thank you cards or sign board</p>
                    <p className="text-zinc-400 text-xs">Main photo session at preferred location</p>
                    <p className="text-zinc-400 text-xs">Exclusive event coverage</p>
                    <p className="text-zinc-400 text-xs">Edited soft copies pack</p>
                    <p className="text-zinc-400 text-xs">All unedited soft copies</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-lg border border-zinc-700 hover:border-[#de660e]/50 transition cursor-pointer bg-absolute-black/50">
                  <input
                    type="radio"
                    name="package"
                    value="LKR 130,000 – Luxury Wedding Package"
                    checked={formData.package === 'LKR 130,000 – Luxury Wedding Package'}
                    onChange={handleChange}
                    className="w-4 h-4 accent-[#de660e] mt-1"
                  />
                  <div>
                    <span className="text-white text-sm font-medium">LKR 130,000 – Luxury Package</span>
                    <p className="text-zinc-400 text-xs mt-0.5">12x18 magazine album (50 pages / 25 spreads)</p>
                    <p className="text-zinc-400 text-xs">16x24 one frame enlargement</p>
                    <p className="text-zinc-400 text-xs">12x18 one frame enlargement</p>
                    <p className="text-zinc-400 text-xs">100 thank you cards or sign board</p>
                    <p className="text-zinc-400 text-xs">Main photo session at preferred location</p>
                    <p className="text-zinc-400 text-xs">Exclusive event coverage</p>
                    <p className="text-zinc-400 text-xs">Edited soft copies pack</p>
                    <p className="text-zinc-400 text-xs">All unedited soft copies</p>
                    <p className="text-[#de660e] text-xs font-medium mt-1">⭐ Single costume pre-shoot free</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-lg border border-zinc-700 hover:border-[#de660e]/50 transition cursor-pointer bg-absolute-black/50">
                  <input
                    type="radio"
                    name="package"
                    value="LKR 65,000 – Family Album Package"
                    checked={formData.package === 'LKR 65,000 – Family Album Package'}
                    onChange={handleChange}
                    className="w-4 h-4 accent-[#de660e] mt-1"
                  />
                  <div>
                    <span className="text-white text-sm font-medium">LKR 65,000 – Family Album Package</span>
                    <p className="text-zinc-400 text-xs mt-0.5">8x24 family album (20 pages / 10 spreads)</p>
                    <p className="text-zinc-400 text-xs">OR single costume pre-shoot free</p>
                    <p className="text-zinc-400 text-xs">Main photo session at preferred location</p>
                    <p className="text-zinc-400 text-xs">Exclusive event coverage</p>
                    <p className="text-zinc-400 text-xs">Edited soft copies pack</p>
                    <p className="text-zinc-400 text-xs">All unedited soft copies</p>
                  </div>
                </label>
              </div>
            ) : isProduction ? (
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 rounded-lg border border-zinc-700 hover:border-[#de660e]/50 transition cursor-pointer bg-absolute-black/50">
                  <input
                    type="radio"
                    name="package"
                    value="LKR 35,000 – Photography Only"
                    checked={formData.package === 'LKR 35,000 – Photography Only'}
                    onChange={handleChange}
                    className="w-4 h-4 accent-[#de660e]"
                  />
                  <span className="text-white text-sm">LKR 35,000 – Photography Only</span>
                </label>
                <label className="flex items-center gap-3 p-3 rounded-lg border border-zinc-700 hover:border-[#de660e]/50 transition cursor-pointer bg-absolute-black/50">
                  <input
                    type="radio"
                    name="package"
                    value="LKR 70,000 – Photography + Videography"
                    checked={formData.package === 'LKR 70,000 – Photography + Videography'}
                    onChange={handleChange}
                    className="w-4 h-4 accent-[#de660e]"
                  />
                  <span className="text-white text-sm">LKR 70,000 – Photography + Videography</span>
                </label>
              </div>
            ) : isStudioRental ? (
              <div className="space-y-2">
                <label className="flex items-start gap-3 p-3 rounded-lg border border-zinc-700 hover:border-[#de660e]/50 transition cursor-pointer bg-absolute-black/50">
                  <input
                    type="radio"
                    name="package"
                    value="1 Hour – LKR 4,500 (Studio Rental)"
                    checked={formData.package === '1 Hour – LKR 4,500 (Studio Rental)'}
                    onChange={handleChange}
                    className="w-4 h-4 accent-[#de660e] mt-1"
                  />
                  <div>
                    <span className="text-white text-sm font-medium">1 Hour – LKR 4,500</span>
                    <p className="text-zinc-400 text-xs mt-0.5">
                      Includes: lighting, backdrops, AC, changing area, packing, camera, and other items.
                    </p>
                    <p className="text-zinc-500 text-xs mt-0.5">
                      Ideal for: portraits, birthdays, TVC, fashion, clothing, branding.
                    </p>
                  </div>
                </label>
                <p className="text-xs text-zinc-500 mt-2">
                  For longer bookings (2+ hours), please mention your requirements in the special requests box below.
                </p>
              </div>
            ) : (
              <select
                name="package"
                value={formData.package}
                onChange={handleChange}
                className="w-full bg-absolute-black border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#de660e] transition"
              >
                <option value="basic">Basic</option>
                <option value="professional">Professional</option>
                <option value="premium">Premium</option>
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Preferred Date *</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full bg-absolute-black border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#de660e] transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Special Requests</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              className="w-full bg-absolute-black border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#de660e] transition"
              placeholder="Any special requirements or questions..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#de660e] text-black font-semibold py-3 rounded-full hover:bg-[#ff7f2c] transition disabled:opacity-50 text-lg"
          >
            {loading ? 'Submitting...' : 'Submit Booking Request'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Booking;

