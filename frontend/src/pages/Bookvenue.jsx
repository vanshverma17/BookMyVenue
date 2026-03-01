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
    <div className="flex h-screen w-full bg-gradient-to-br from-purple-50 to-blue-50 overflow-hidden">
      <Sidebar activePage="book-venue" />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto">
          <header className="mb-6">
            <div>
              <h1 className="text-3xl font-bold text-purple-600">Book a Venue</h1>
              <p className="text-sm text-gray-600 mt-1">Fill out the form below to request a venue for your extra class or event.</p>
            </div>
          </header>

          <section className="bg-white shadow-lg rounded-2xl p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error ? (
                <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
                  {error}
                </div>
              ) : null}
              {success ? (
                <div className="text-sm text-green-700 bg-green-50 border border-green-100 rounded-lg px-4 py-3">
                  {success}
                </div>
              ) : null}

              {/* Select Venue */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Venue</label>
                <div className="flex items-center gap-2">
                  <MapPin className="text-purple-500" />
                  <select
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    className="flex-1 py-3 px-4 border border-gray-200 rounded-lg bg-gray-50"
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full py-3 px-4 border border-gray-200 rounded-lg bg-gray-50"
                    placeholder="e.g., Extra Class - DBMS"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Attendees</label>
                  <input
                    type="number"
                    min={1}
                    value={attendees}
                    onChange={(e) => setAttendees(e.target.value)}
                    className="w-full py-3 px-4 border border-gray-200 rounded-lg bg-gray-50"
                  />
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <div className="flex items-center gap-2">
                    <Calendar className="text-purple-500" />
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="flex-1 py-3 px-3 border border-gray-200 rounded-lg bg-gray-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start</label>
                  <div className="flex items-center gap-2">
                    <Clock className="text-purple-500" />
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="flex-1 py-3 px-3 border border-gray-200 rounded-lg bg-gray-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End</label>
                  <div className="flex items-center gap-2">
                    <Clock className="text-purple-500" />
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="flex-1 py-3 px-3 border border-gray-200 rounded-lg bg-gray-50"
                    />
                  </div>
                </div>
              </div>

              {/* Purpose */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Purpose</label>
                <div className="flex items-center gap-2">
                  <FileText className="text-purple-500" />
                  <select
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="flex-1 py-3 px-4 border border-gray-200 rounded-lg bg-gray-50"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes <span className="text-xs text-gray-400">(optional)</span></label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="w-full py-3 px-4 border border-gray-200 rounded-lg bg-gray-50"
                  placeholder="Any special requirements or notes"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 bg-purple-600 text-white py-3 px-6 rounded-full hover:bg-purple-700 transition"
                >
                  <Send size={16} />
                  {submitting ? 'Submitting…' : 'Submit Request'}
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
