import { useEffect, useState } from 'react';
import { Search, Star, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase, Guide } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface GuideWithProfile extends Guide {
  profiles?: {
    full_name: string;
    avatar_url: string | null;
  };
}

interface GuidesProps {
  onNavigate: (page: string) => void;
}

export default function Guides({ onNavigate }: GuidesProps) {
  const { user } = useAuth();
  const [guides, setGuides] = useState<GuideWithProfile[]>([]);
  const [filteredGuides, setFilteredGuides] = useState<GuideWithProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [bookingGuide, setBookingGuide] = useState<GuideWithProfile | null>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [duration, setDuration] = useState(4);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    loadGuides();
  }, []);

  useEffect(() => {
    filterGuides();
  }, [searchQuery, guides]);

  async function loadGuides() {
    setLoading(true);
    const { data } = await supabase
      .from('guides')
      .select(`
        *,
        profiles:user_id (
          full_name,
          avatar_url
        )
      `)
      .eq('available', true)
      .order('rating', { ascending: false });

    if (data) {
      setGuides(data as GuideWithProfile[]);
    }
    setLoading(false);
  }

  function filterGuides() {
    let filtered = guides;

    if (searchQuery) {
      filtered = filtered.filter(
        (g) =>
          g.profiles?.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          g.specialization.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
          g.languages.some((l) => l.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredGuides(filtered);
  }

  async function handleBooking(e: React.FormEvent) {
    e.preventDefault();

    if (!user) {
      setError('Please sign in to book a guide');
      setTimeout(() => onNavigate('signin'), 2000);
      return;
    }

    if (!bookingGuide) return;

    setError('');
    setBookingLoading(true);

    try {
      const totalCost = bookingGuide.hourly_rate * duration;

      const { error: bookingError } = await supabase.from('guide_bookings').insert({
        tourist_id: user.id,
        guide_id: bookingGuide.id,
        booking_date: bookingDate,
        duration_hours: duration,
        total_cost: totalCost,
        status: 'pending',
      });

      if (bookingError) throw bookingError;

      setSuccess(true);
      setBookingGuide(null);
      setTimeout(() => {
        setSuccess(false);
        onNavigate('dashboard');
      }, 2000);
    } catch (err) {
      setError('Failed to book guide. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Guide Booked!</h2>
          <p className="text-gray-600">Your guide has been successfully booked. Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Local Guides</h1>
          <p className="text-xl text-gray-600">Connect with experienced guides who know India inside out</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, specialization, or language..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading guides...</p>
          </div>
        ) : filteredGuides.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600">No guides found</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredGuides.map((guide) => (
              <div
                key={guide.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition"
              >
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-32"></div>
                <div className="p-6 -mt-16">
                  <div className="bg-white w-24 h-24 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-3xl font-bold text-emerald-600 mx-auto mb-4">
                    {guide.profiles?.full_name.charAt(0) || 'G'}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">
                    {guide.profiles?.full_name || 'Guide'}
                  </h3>
                  <div className="flex items-center justify-center mb-4">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="ml-1 font-semibold text-gray-700">{guide.rating}</span>
                    <span className="ml-2 text-sm text-gray-500">({guide.total_bookings} bookings)</span>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-1">Specialization:</p>
                      <div className="flex flex-wrap gap-2">
                        {guide.specialization.map((spec, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-1">Languages:</p>
                      <div className="flex flex-wrap gap-2">
                        {guide.languages.map((lang, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                          >
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-sm text-gray-600">{guide.experience_years} years exp.</span>
                      <span className="text-lg font-bold text-emerald-600">₹{guide.hourly_rate}/hr</span>
                    </div>
                  </div>

                  {guide.bio && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{guide.bio}</p>
                  )}

                  <button
                    onClick={() => setBookingGuide(guide)}
                    className="w-full py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-semibold"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {bookingGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Book {bookingGuide.profiles?.full_name}</h2>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleBooking} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Booking Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (hours)
                </label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  required
                />
              </div>

              <div className="bg-emerald-50 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700">Hourly Rate:</span>
                  <span className="font-semibold">₹{bookingGuide.hourly_rate}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700">Duration:</span>
                  <span className="font-semibold">{duration} hours</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-emerald-200">
                  <span className="font-bold text-gray-900">Total:</span>
                  <span className="font-bold text-emerald-600 text-xl">₹{bookingGuide.hourly_rate * duration}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setBookingGuide(null)}
                  className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="flex-1 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {bookingLoading ? 'Booking...' : 'Confirm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
