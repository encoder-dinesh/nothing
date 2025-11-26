import { ArrowRight, Car, Users, MapPin, Star, Shield, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase, Destination } from '../lib/supabase';

interface HomeProps {
  onNavigate: (page: string) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  const [popularDestinations, setPopularDestinations] = useState<Destination[]>([]);

  useEffect(() => {
    loadPopularDestinations();
  }, []);

  async function loadPopularDestinations() {
    const { data } = await supabase
      .from('destinations')
      .select('*')
      .eq('popular', true)
      .limit(6);

    if (data) setPopularDestinations(data);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Explore India Like Never Before
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Your trusted travel companion for discovering India's rich heritage, stunning landscapes, and vibrant culture.
              Book rides, find local guides, and create unforgettable memories.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => onNavigate('rides')}
                className="px-8 py-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Book a Ride <ArrowRight className="inline ml-2 h-5 w-5" />
              </button>
              <button
                onClick={() => onNavigate('destinations')}
                className="px-8 py-4 bg-white text-emerald-600 border-2 border-emerald-600 rounded-lg hover:bg-emerald-50 transition text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Explore Destinations
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Car className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Reliable Rides</h3>
              <p className="text-gray-600 leading-relaxed">
                Book verified drivers with comfortable vehicles for your tourist destinations. Safe, affordable, and on-time service guaranteed.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Local Guides</h3>
              <p className="text-gray-600 leading-relaxed">
                Connect with experienced local guides who know the hidden gems and stories of every destination in India.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <MapPin className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Top Destinations</h3>
              <p className="text-gray-600 leading-relaxed">
                Discover India's most beautiful places, from ancient temples to pristine beaches and majestic mountains.
              </p>
            </div>
          </div>

          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Popular Destinations</h2>
              <p className="text-xl text-gray-600">Start your journey at India's most loved tourist spots</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {popularDestinations.map((destination) => (
                <div
                  key={destination.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition transform hover:-translate-y-2 cursor-pointer"
                  onClick={() => onNavigate('destinations')}
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={destination.image_url}
                      alt={destination.name}
                      className="w-full h-full object-cover hover:scale-110 transition duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{destination.name}</h3>
                      <div className="flex items-center">
                        <Star className="h-5 w-5 text-yellow-400 fill-current" />
                        <span className="ml-1 text-gray-700 font-semibold">{destination.rating}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-2">{destination.city}, {destination.state}</p>
                    <p className="text-gray-500 text-sm line-clamp-2">{destination.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <button
                onClick={() => onNavigate('destinations')}
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-semibold"
              >
                View All Destinations <ArrowRight className="inline ml-2 h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-12 mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose TravelIndia?</h2>
              <p className="text-xl text-gray-600">Your safety and satisfaction are our top priorities</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-10 w-10 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Verified & Safe</h3>
                <p className="text-gray-600">All drivers and guides are background-checked and verified for your safety</p>
              </div>

              <div className="text-center">
                <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-10 w-10 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">24/7 Support</h3>
                <p className="text-gray-600">Round-the-clock customer support to assist you throughout your journey</p>
              </div>

              <div className="text-center">
                <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-10 w-10 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Best Rated</h3>
                <p className="text-gray-600">Highly rated by thousands of satisfied travelers across India</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl shadow-2xl p-12 text-center text-white">
            <h2 className="text-4xl font-bold mb-4">Ready to Start Your Adventure?</h2>
            <p className="text-xl mb-8 opacity-90">Join thousands of travelers exploring India with ease and comfort</p>
            <button
              onClick={() => onNavigate('signup')}
              className="px-8 py-4 bg-white text-emerald-600 rounded-lg hover:bg-gray-100 transition text-lg font-semibold shadow-lg"
            >
              Get Started Today
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
