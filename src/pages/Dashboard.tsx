import { useEffect, useState } from 'react';
import { User, Car, Calendar, Star, MapPin, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Ride, GuideBooking, Guide } from '../lib/supabase';

interface RideWithDriver extends Ride {
  drivers?: {
    vehicle_type: string;
    vehicle_number: string;
    rating: number;
  };
}

interface BookingWithGuide extends GuideBooking {
  guides?: Guide & {
    profiles?: {
      full_name: string;
    };
  };
  destinations?: {
    name: string;
  };
}

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { user, profile } = useAuth();
  const [rides, setRides] = useState<RideWithDriver[]>([]);
  const [guideBookings, setGuideBookings] = useState<BookingWithGuide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  async function loadUserData() {
    setLoading(true);

    const { data: ridesData } = await supabase
      .from('rides')
      .select(`
        *,
        drivers:driver_id (
          vehicle_type,
          vehicle_number,
          rating
        )
      `)
      .eq('tourist_id', user!.id)
      .order('created_at', { ascending: false });

    const { data: bookingsData } = await supabase
      .from('guide_bookings')
      .select(`
        *,
        guides:guide_id (
          id,
          hourly_rate,
          rating,
          profiles:user_id (
            full_name
          )
        ),
        destinations:destination_id (
          name
        )
      `)
      .eq('tourist_id', user!.id)
      .order('created_at', { ascending: false });

    if (ridesData) setRides(ridesData as RideWithDriver[]);
    if (bookingsData) setGuideBookings(bookingsData as BookingWithGuide[]);
    setLoading(false);
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'ongoing':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Please sign in to view your dashboard</p>
          <button
            onClick={() => onNavigate('signin')}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-semibold"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center">
            <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-emerald-600">
              {profile?.full_name.charAt(0) || 'U'}
            </div>
            <div className="ml-6">
              <h1 className="text-3xl font-bold text-gray-900">{profile?.full_name}</h1>
              <p className="text-gray-600 mt-1">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800 capitalize">
                  {profile?.user_type}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Rides</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{rides.length}</p>
              </div>
              <Car className="h-12 w-12 text-emerald-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Guide Bookings</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{guideBookings.length}</p>
              </div>
              <User className="h-12 w-12 text-emerald-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Bookings</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {[...rides, ...guideBookings].filter(
                    (item) => item.status === 'pending' || item.status === 'accepted' || item.status === 'confirmed' || item.status === 'ongoing'
                  ).length}
                </p>
              </div>
              <Calendar className="h-12 w-12 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">My Rides</h2>
              <button
                onClick={() => onNavigate('rides')}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition text-sm font-semibold"
              >
                Book Ride
              </button>
            </div>

            {loading ? (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
              </div>
            ) : rides.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <Car className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No rides booked yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {rides.map((ride) => (
                  <div key={ride.id} className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <Car className="h-10 w-10 text-emerald-600 mr-3" />
                        <div>
                          <p className="font-semibold text-gray-900 capitalize">
                            {ride.drivers?.vehicle_type || ride.vehicle_preference}
                          </p>
                          {ride.drivers && (
                            <p className="text-sm text-gray-600">{ride.drivers.vehicle_number}</p>
                          )}
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(ride.status)}`}>
                        {ride.status}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-start">
                        <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                        <div>
                          <p className="text-gray-600">From: {ride.pickup_location}</p>
                          <p className="text-gray-600">To: {ride.dropoff_location}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-400 mr-2" />
                        <p className="text-gray-600">
                          {new Date(ride.pickup_time).toLocaleString()}
                        </p>
                      </div>
                      {ride.drivers && (
                        <div className="flex items-center pt-2 border-t">
                          <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                          <span className="text-gray-700 font-semibold">{ride.drivers.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Guide Bookings</h2>
              <button
                onClick={() => onNavigate('guides')}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition text-sm font-semibold"
              >
                Book Guide
              </button>
            </div>

            {loading ? (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
              </div>
            ) : guideBookings.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <User className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No guide bookings yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {guideBookings.map((booking) => (
                  <div key={booking.id} className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <User className="h-10 w-10 text-emerald-600 mr-3" />
                        <div>
                          <p className="font-semibold text-gray-900">
                            {booking.guides?.profiles?.full_name || 'Guide'}
                          </p>
                          {booking.destinations && (
                            <p className="text-sm text-gray-600">{booking.destinations.name}</p>
                          )}
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <p className="text-gray-600">
                          {new Date(booking.booking_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-400 mr-2" />
                        <p className="text-gray-600">{booking.duration_hours} hours</p>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                          <span className="text-gray-700 font-semibold">{booking.guides?.rating}</span>
                        </div>
                        <span className="text-lg font-bold text-emerald-600">₹{booking.total_cost}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
