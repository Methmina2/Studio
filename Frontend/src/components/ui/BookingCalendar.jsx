import React, { useState } from 'react';

const BookingCalendar = ({ serviceType, onSelectDate }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [packageTier, setPackageTier] = useState('basic');

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    if (onSelectDate) onSelectDate(e.target.value);
  };

  return (
    <div className="bg-charcoal/50 p-6 rounded-xl border border-white/10">
      <h3 className="font-serif text-xl text-gold mb-4">Book Your {serviceType}</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white/70 mb-1">Select Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="w-full bg-obsidian border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/70 mb-1">Package</label>
          <select
            value={packageTier}
            onChange={(e) => setPackageTier(e.target.value)}
            className="w-full bg-obsidian border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold"
          >
            <option value="basic">Basic</option>
            <option value="professional">Professional</option>
            <option value="premium">Premium</option>
          </select>
        </div>
        <button className="w-full btn-gold">Check Availability</button>
      </div>
    </div>
  );
};

export default BookingCalendar;