import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';

const RentalApplication = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedItems = location.state?.selectedItems || [];

  useEffect(() => {
    if (selectedItems.length === 0) {
      navigate('/rentals');
    }
  }, [selectedItems, navigate]);

  const [formData, setFormData] = useState({
    fullName: '',
    nicPassport: '',
    email: '',
    contactNumber: '',
    collectionDate: '',
    collectionTime: '',
    returnDate: '',
    returnTime: '',
    conditionAck: false,
    liabilityAck: false,
    droneAck: false,
    regulatoryAck: false,
    noModificationAck: false,
    declarationAck: false,
    nicImage: null,
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // ---- NEW async handleSubmit ----
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      items: selectedItems.map(item => ({
        id: item.id,
        name: item.name,
        pricePerDay: item.pricePerDay,
      })),
    };

    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
      const response = await fetch(`${baseUrl}/rentals/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.success) {
        alert('Application submitted! Check your email for details.');
        navigate('/rentals');
      }
    } catch (err) {
      alert('Submission failed. Please try again.');
    }
  };
  // ---------------------------------

  const totalPrice = selectedItems.reduce((sum, item) => sum + item.pricePerDay, 0);
  const totalFormatted = totalPrice.toLocaleString('en-US');

  return (
    <Layout>
      <div className="pt-24 pb-16 px-4 bg-absolute-black min-h-screen">
        <div className="max-w-4xl mx-auto bg-studio-surface border border-zinc-800 rounded-xl p-8">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-white text-center mb-2">
            Rental Application
          </h1>
          <p className="text-zinc-400 text-center text-sm mb-6">
            You are applying to rent the following equipment:
          </p>

          <div className="bg-zinc-900/50 rounded-lg p-4 mb-6 border border-zinc-800">
            {selectedItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center py-2 border-b border-zinc-800 last:border-0">
                <span className="text-white font-medium">{item.name}</span>
                <span className="text-[#de660e]">LKR {item.pricePerDay.toLocaleString('en-US')}/day</span>
              </div>
            ))}
            <div className="flex justify-between items-center pt-3 mt-2 border-t border-zinc-700">
              <span className="text-white font-bold">Total per day</span>
              <span className="text-[#de660e] font-bold text-lg">LKR {totalFormatted}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Lessee Details */}
            <section>
              <h2 className="font-serif text-xl text-[#de660e] border-b border-zinc-800 pb-2 mb-4">
                1. Lessee Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full bg-absolute-black border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#de660e]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">NIC / Passport No *</label>
                  <input
                    type="text"
                    name="nicPassport"
                    required
                    value={formData.nicPassport}
                    onChange={handleChange}
                    className="w-full bg-absolute-black border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#de660e]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-absolute-black border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#de660e]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Contact Number *</label>
                  <input
                    type="tel"
                    name="contactNumber"
                    required
                    value={formData.contactNumber}
                    onChange={handleChange}
                    className="w-full bg-absolute-black border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#de660e]"
                  />
                </div>
              </div>
            </section>

            {/* Rental Period */}
            <section>
              <h2 className="font-serif text-xl text-[#de660e] border-b border-zinc-800 pb-2 mb-4">
                2. Rental Period
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Collection Date *</label>
                  <input
                    type="date"
                    name="collectionDate"
                    required
                    value={formData.collectionDate}
                    onChange={handleChange}
                    className="w-full bg-absolute-black border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#de660e]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Collection Time *</label>
                  <input
                    type="time"
                    name="collectionTime"
                    required
                    value={formData.collectionTime}
                    onChange={handleChange}
                    className="w-full bg-absolute-black border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#de660e]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Return Date *</label>
                  <input
                    type="date"
                    name="returnDate"
                    required
                    value={formData.returnDate}
                    onChange={handleChange}
                    className="w-full bg-absolute-black border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#de660e]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Return Time *</label>
                  <input
                    type="time"
                    name="returnTime"
                    required
                    value={formData.returnTime}
                    onChange={handleChange}
                    className="w-full bg-absolute-black border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#de660e]"
                  />
                </div>
              </div>
              <p className="text-xs text-zinc-500 mt-2">The standard rental period is 24 hours unless otherwise agreed.</p>
            </section>

            {/* Condition Acknowledgement */}
            <section>
              <h2 className="font-serif text-xl text-[#de660e] border-b border-zinc-800 pb-2 mb-4">
                3. Condition Acknowledgement
              </h2>
              <label className="flex items-start gap-3 text-sm text-zinc-300">
                <input
                  type="checkbox"
                  name="conditionAck"
                  checked={formData.conditionAck}
                  onChange={handleChange}
                  required
                  className="mt-1 w-4 h-4 accent-[#de660e]"
                />
                <span>
                  I confirm that all equipment is received in fully operational and undamaged condition.
                  I agree to return all items in the same condition, without damage, with all accessories included.
                </span>
              </label>
            </section>

            {/* Liability and Compensation */}
            <section>
              <h2 className="font-serif text-xl text-[#de660e] border-b border-zinc-800 pb-2 mb-4">
                4. Liability and Compensation
              </h2>
              <label className="flex items-start gap-3 text-sm text-zinc-300">
                <input
                  type="checkbox"
                  name="liabilityAck"
                  checked={formData.liabilityAck}
                  onChange={handleChange}
                  required
                  className="mt-1 w-4 h-4 accent-[#de660e]"
                />
                <span>
                  I assume full responsibility for the equipment from collection until return. In the event of damage, loss, theft, or misuse,
                  I agree to fully compensate the total repair or replacement cost within 3 days of notification.
                </span>
              </label>
            </section>

            {/* Drone Usage Responsibility */}
            {selectedItems.some(item => item.category === 'Drone') && (
              <section>
                <h2 className="font-serif text-xl text-[#de660e] border-b border-zinc-800 pb-2 mb-4">
                  5. Drone Usage Responsibility
                </h2>
                <label className="flex items-start gap-3 text-sm text-zinc-300">
                  <input
                    type="checkbox"
                    name="droneAck"
                    checked={formData.droneAck}
                    onChange={handleChange}
                    required
                    className="mt-1 w-4 h-4 accent-[#de660e]"
                  />
                  <span>
                    I agree to comply with all applicable aviation laws, not to operate in restricted areas,
                    and to bear full responsibility for any third-party damage or legal consequences.
                  </span>
                </label>
              </section>
            )}

            {/* Regulatory Compliance */}
            <section>
              <h2 className="font-serif text-xl text-[#de660e] border-b border-zinc-800 pb-2 mb-4">
                6. Regulatory Compliance and Authority Interaction
              </h2>
              <label className="flex items-start gap-3 text-sm text-zinc-300">
                <input
                  type="checkbox"
                  name="regulatoryAck"
                  checked={formData.regulatoryAck}
                  onChange={handleChange}
                  required
                  className="mt-1 w-4 h-4 accent-[#de660e]"
                />
                <span>
                  I am solely responsible for obtaining any permits, approvals, or authorizations required for the operation of the equipment.
                  I shall bear full responsibility for any consequences arising from interaction with authorities.
                </span>
              </label>
            </section>

            {/* No Modification Clause */}
            <section>
              <h2 className="font-serif text-xl text-[#de660e] border-b border-zinc-800 pb-2 mb-4">
                7. No Modification Clause
              </h2>
              <label className="flex items-start gap-3 text-sm text-zinc-300">
                <input
                  type="checkbox"
                  name="noModificationAck"
                  checked={formData.noModificationAck}
                  onChange={handleChange}
                  required
                  className="mt-1 w-4 h-4 accent-[#de660e]"
                />
                <span>
                  I acknowledge that any modification, alteration, deletion, or addition made to this document without written approval
                  from the Lessor shall render this agreement null and void.
                </span>
              </label>
            </section>

            {/* Declaration */}
            <section>
              <h2 className="font-serif text-xl text-[#de660e] border-b border-zinc-800 pb-2 mb-4">
                8. Declaration and Digital Acceptance
              </h2>
              <label className="flex items-start gap-3 text-sm text-zinc-300">
                <input
                  type="checkbox"
                  name="declarationAck"
                  checked={formData.declarationAck}
                  onChange={handleChange}
                  required
                  className="mt-1 w-4 h-4 accent-[#de660e]"
                />
                <span>
                  I have read, understood, and agree to all terms and conditions. I confirm that I have not modified, altered, or tampered
                  with any part of this document. I acknowledge that submitting this document via my email constitutes my legally binding acceptance.
                </span>
              </label>
            </section>

            {/* Identity Verification – NIC image only */}
            <section>
              <h2 className="font-serif text-xl text-[#de660e] border-b border-zinc-800 pb-2 mb-4">
                9. Identity Verification
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">NIC / Passport Image *</label>
                  <input
                    type="file"
                    name="nicImage"
                    accept="image/*"
                    required
                    onChange={handleChange}
                    className="w-full text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[#de660e] file:text-black file:font-semibold hover:file:bg-[#ff7f2c]"
                  />
                  <p className="text-xs text-zinc-500 mt-1">Clear image of your National Identity Card or Passport</p>
                </div>
              </div>
            </section>

            <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => navigate('/rentals')}
                className="px-6 py-2 border border-zinc-700 text-zinc-400 rounded-full hover:bg-zinc-800 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-2 bg-[#de660e] text-black font-semibold rounded-full hover:bg-[#ff7f2c] transition"
              >
                Submit Application
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default RentalApplication;