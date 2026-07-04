import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../services/api';

// Setup the localizer for react-big-calendar
const localizer = momentLocalizer(moment);

const AdminCalendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get('/bookings');
        const bookings = res.data.data;

        // Map bookings to calendar events
        const calendarEvents = bookings.map((booking) => ({
          id: booking._id,
          title: `${booking.name} - ${booking.service}`,
          start: new Date(booking.date),
          end: new Date(booking.date), // same day, or add +1 hour if needed
          allDay: true,
          resource: booking, // store full booking data for details
        }));

        setEvents(calendarEvents);
      } catch (err) {
        console.error('Failed to fetch bookings', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Event style getter – color by service type
  const eventStyleGetter = (event) => {
    const service = event.resource?.service?.toLowerCase() || '';
    let backgroundColor = '#3b82f6'; // default blue

    if (service.includes('wedding')) backgroundColor = '#ec4899'; // pink
    else if (service.includes('production')) backgroundColor = '#8b5cf6'; // purple
    else if (service.includes('studio')) backgroundColor = '#06b6d4'; // cyan

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.9,
        color: 'white',
        border: '0px',
        display: 'block',
      },
    };
  };

  // Handle event click – show details in a modal or alert
  const handleSelectEvent = (event) => {
    setSelectedEvent(event.resource);
  };

  // Close modal
  const closeModal = () => setSelectedEvent(null);

  return (
    <AdminLayout>
      <h1 className="font-serif text-3xl font-bold text-white mb-6">Calendar</h1>
      <p className="text-zinc-400 mb-6">All bookings displayed by date. Click on an event for details.</p>

      {loading ? (
        <div className="text-zinc-400">Loading...</div>
      ) : (
        <div className="bg-studio-surface border border-zinc-800 rounded-xl p-4" style={{ height: '70vh' }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            eventPropGetter={eventStyleGetter}
            onSelectEvent={handleSelectEvent}
            views={['month', 'week', 'day']}
            defaultView="month"
            popup
          />
        </div>
      )}

      {/* Modal for event details */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div className="bg-studio-surface border border-zinc-800 rounded-xl max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-serif text-2xl font-bold text-white mb-4">Booking Details</h2>
            <div className="space-y-2 text-zinc-300">
              <p><span className="text-zinc-500">Name:</span> {selectedEvent.name}</p>
              <p><span className="text-zinc-500">Email:</span> {selectedEvent.email}</p>
              <p><span className="text-zinc-500">Phone:</span> {selectedEvent.phone}</p>
              <p><span className="text-zinc-500">Service:</span> {selectedEvent.service}</p>
              <p><span className="text-zinc-500">Date:</span> {new Date(selectedEvent.date).toDateString()}</p>
              <p><span className="text-zinc-500">Package:</span> {selectedEvent.package}</p>
              <p><span className="text-zinc-500">Status:</span> 
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                  selectedEvent.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                  selectedEvent.status === 'canceled' ? 'bg-red-500/20 text-red-400' :
                  'bg-[#de660e]/20 text-[#ff7f2c]'
                }`}>
                  {selectedEvent.status}
                </span>
              </p>
              {selectedEvent.message && (
                <p><span className="text-zinc-500">Message:</span> {selectedEvent.message}</p>
              )}
            </div>
            <button
              onClick={closeModal}
              className="mt-4 bg-[#de660e] text-black px-6 py-2 rounded-full font-semibold hover:bg-[#ff7f2c] transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminCalendar;
