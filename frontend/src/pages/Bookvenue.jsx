import { useEffect, useMemo, useState } from 'react';
import { Calendar, Clock, MapPin, FileText, Send } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { bookingsApi, venuesApi } from '../lib/api';

const Bookvenue = () => {
  const [venues, setVenues] = useState([]);
  const [venue, setVenue] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('11:00');
  const [purpose, setPurpose] = useState('class');
  const [title, setTitle] = useState('');
  const [attendees, setAttendees] = useState(1);
  const [notes, setNotes] = useState('');
  const [loadingVenues, setLoadingVenues] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoadingVenues(true);
      setError('');
      try {
        const res = await venuesApi.list();
        setVenues(res?.data || []);
      } catch (e) {
        setError(e?.message || 'Failed to load venues');
        setVenues([]);
      } finally {
        setLoadingVenues(false);
      }
    };

    load();
  }, []);

  const purposeOptions = useMemo(
    () => [
      { value: 'class', label: 'Class' },
      { value: 'meeting', label: 'Meeting' },
      { value: 'seminar', label: 'Seminar' },
      { value: 'workshop', label: 'Workshop' },
      { value: 'exam', label: 'Exam' },
      { value: 'event', label: 'Event' },
      { value: 'other', label: 'Other' },
    ],
    []
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!venue) return setError('Please select a venue');
    if (!date) return setError('Please select a date');
    if (!title.trim()) return setError('Please enter a booking title');
    if (!attendees || Number(attendees) < 1) return setError('Attendees must be at least 1');

    const start = new Date(`${date}T${startTime}`);
    const end = new Date(`${date}T${endTime}`);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return setError('Invalid date/time');
    }
    if (end <= start) {
      return setError('End time must be after start time');
    }

    setSubmitting(true);
    try {
      await bookingsApi.create({
        venue,
        title: title.trim(),
        purpose,
        attendees: Number(attendees),
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        notes: notes?.trim() || undefined,
      });

      setSuccess('Booking request submitted successfully');
      setVenue('');
      setTitle('');
      setAttendees(1);
      setNotes('');
    } catch (err) {
      setError(err?.message || 'Failed to submit booking');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-gradient-to-br from-purple-50 to-blue-50 overflow-hidden">
      <Sidebar activePage="book-venue" />

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          <header className="mb-5 sm:mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-purple-600">Book a Venue</h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Fill out the form below to request a venue for your extra class or event.</p>
            </div>
          </header>

          <section className="bg-white shadow-lg rounded-2xl p-4 sm:p-6 md:p-8 border border-purple-50">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {error ? (
                <div className="text-xs sm:text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                  {error}
                </div>
              ) : null}
              {success ? (
                <div className="text-xs sm:text-sm text-green-700 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
                  {success}
                </div>
              ) : null}

              {/* Select Venue */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Select Venue</label>
                <div className="flex items-center gap-2">
                  <MapPin className="text-purple-500 flex-shrink-0" size={20} />
                  <select
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    className="flex-1 py-2.5 sm:py-3 px-3 sm:px-4 border border-gray-200 rounded-xl bg-gray-50 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition"
                    disabled={loadingVenues}
                  >
                    <option value="">Select Venue</option>
                    {venues.map((v) => (
                      <option key={v._id} value={v._id}>
                        {v.name} ({v.type}, cap {v.capacity})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Title & Attendees */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Booking Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full py-2.5 sm:py-3 px-3 sm:px-4 border border-gray-200 rounded-xl bg-gray-50 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition"
                    placeholder="e.g., Extra Class - DBMS"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Expected Attendees</label>
                  <input
                    type="number"
                    min={1}
                    value={attendees}
                    onChange={(e) => setAttendees(e.target.value)}
                    className="w-full py-2.5 sm:py-3 px-3 sm:px-4 border border-gray-200 rounded-xl bg-gray-50 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Date</label>
                  <div className="flex items-center gap-2">
                    <Calendar className="text-purple-500 flex-shrink-0" size={18} />
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="flex-1 py-2.5 sm:py-3 px-3 border border-gray-200 rounded-xl bg-gray-50 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Start Time</label>
                  <div className="flex items-center gap-2">
                    <Clock className="text-purple-500 flex-shrink-0" size={18} />
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="flex-1 py-2.5 sm:py-3 px-3 border border-gray-200 rounded-xl bg-gray-50 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">End Time</label>
                  <div className="flex items-center gap-2">
                    <Clock className="text-purple-500 flex-shrink-0" size={18} />
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="flex-1 py-2.5 sm:py-3 px-3 border border-gray-200 rounded-xl bg-gray-50 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition"
                    />
                  </div>
                </div>
              </div>

              {/* Purpose */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Purpose</label>
                <div className="flex items-center gap-2">
                  <FileText className="text-purple-500 flex-shrink-0" size={20} />
                  <select
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="flex-1 py-2.5 sm:py-3 px-3 sm:px-4 border border-gray-200 rounded-xl bg-gray-50 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition"
                  >
                    {purposeOptions.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Additional Notes <span className="text-xs text-gray-400">(optional)</span></label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full py-2.5 sm:py-3 px-3 sm:px-4 border border-gray-200 rounded-xl bg-gray-50 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition"
                  placeholder="Any special requirements or notes"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-purple-600 active:bg-purple-700 text-white py-3 px-8 rounded-xl font-medium shadow-md hover:bg-purple-700 transition active:scale-98 text-xs sm:text-sm"
                >
                  <Send size={16} />
                  <span>{submitting ? 'Submitting…' : 'Submit Request'}</span>
                </button>
              </div>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Bookvenue;
