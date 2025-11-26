import { useState, useEffect } from 'react';
import { Car, MapPin, Calendar, Users, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Driver } from '../lib/supabase';

interface BookRideProps {
  onNavigate: (page: string) => void;
}

export default function BookRide({ onNavigate }: BookRideProps) {
  const { user } = useAuth();
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [vehiclePreference, setVehiclePreference] = useState<string>('sedan');
  const [availableDrivers, setAvailableDrivers] = useState<Driver[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const vehicleTypes = [
    { value: 'sedan', label: 'Sedan', capacity: 4, price: '₹12/km' },
    { value: 'suv', label: 'SUV', capacity: 6, price: '₹18/km' },
    { value: 'luxury', label: 'Luxury', capacity: 4, price: '₹30/km' },
    { value: 'tempo', label: 'Tempo Traveller', capacity: 12, price: '₹25/km' },
  ];

  useEffect(() => {
    if (vehiclePreference) {
      loadAvailableDrivers();
    }
  }, [vehiclePreference]);

  async function loadAvailableDrivers() {
    const { data } = await supabase
      .from('drivers')
      .select('*')
      .eq('vehicle_type', vehiclePreference)
      .eq('available', true)
      .order('rating', { ascending: false })
      .limit(3);

    if (data) {
      setAvailableDrivers(data);
      if (data.length > 0) {
        setSelectedDriver(data[0]);
      }
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!user) {
      setError('Please sign in to book a ride');
      setTimeout(() => onNavigate('signin'), 2000);
      return;
    }

    if (!selectedDriver) {
      setError('No drivers available for the selected vehicle type');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const { error: rideError } = await supabase.from('rides').insert({
        tourist_id: user.id,
        driver_id: selectedDriver.id,
        pickup_location: pickupLocation,
        dropoff_location: dropoffLocation,
        pickup_time: pickupTime,
        passengers: passengers,
        vehicle_preference: vehiclePreference,
        status: 'pending',
      });

      if (rideError) throw rideError;

      setSuccess(true);
      setTimeout(() => {
        onNavigate('dashboard');
      }, 2000);
    } catch (err) {
      setError('Failed to book ride. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Ride Booked!</h2>
          <p className="text-gray-600">Your ride has been successfully booked. Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Car className="h-8 w-8 text-emerald-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Book Your Ride</h1>
          <p className="text-xl text-gray-600">Safe, comfortable, and reliable transportation to your destination</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pickup Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    placeholder="Enter pickup location"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dropoff Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={dropoffLocation}
                    onChange={(e) => setDropoffLocation(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    placeholder="Enter dropoff location"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pickup Date & Time
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="datetime-local"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Passengers
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={passengers}
                    onChange={(e) => setPassengers(parseInt(e.target.value))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Vehicle Type
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {vehicleTypes.map((vehicle) => (
                  <button
                    key={vehicle.value}
                    type="button"
                    onClick={() => setVehiclePreference(vehicle.value)}
                    className={`p-4 rounded-xl border-2 transition ${
                      vehiclePreference === vehicle.value
                        ? 'border-emerald-600 bg-emerald-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <Car className={`h-8 w-8 mx-auto mb-2 ${
                      vehiclePreference === vehicle.value ? 'text-emerald-600' : 'text-gray-400'
                    }`} />
                    <p className="font-semibold text-sm text-gray-900">{vehicle.label}</p>
                    <p className="text-xs text-gray-500 mt-1">{vehicle.capacity} seats</p>
                    <p className="text-xs font-semibold text-emerald-600 mt-1">{vehicle.price}</p>
                  </button>
                ))}
              </div>
            </div>

            {availableDrivers.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Available Drivers ({availableDrivers.length})
                </label>
                <div className="space-y-3">
                  {availableDrivers.map((driver) => (
                    <div
                      key={driver.id}
                      onClick={() => setSelectedDriver(driver)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                        selectedDriver?.id === driver.id
                          ? 'border-emerald-600 bg-emerald-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">Driver #{driver.id.slice(0, 8)}</p>
                          <p className="text-sm text-gray-600">{driver.vehicle_type.toUpperCase()} - {driver.vehicle_number}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center">
                            <span className="text-yellow-400 mr-1">★</span>
                            <span className="font-semibold">{driver.rating}</span>
                          </div>
                          <p className="text-xs text-gray-500">{driver.total_rides} rides</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !selectedDriver}
              className="w-full py-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-semibold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Booking...' : 'Confirm Booking'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
