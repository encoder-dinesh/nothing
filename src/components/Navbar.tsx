import { useState } from 'react';
import { Menu, X, User, LogOut, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export default function Navbar({ onNavigate, currentPage }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    onNavigate('home');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate('home')}>
            <MapPin className="h-8 w-8 text-emerald-600" />
            <span className="ml-2 text-xl font-bold text-gray-800">TravelIndia</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => onNavigate('home')}
              className={`${currentPage === 'home' ? 'text-emerald-600' : 'text-gray-600'} hover:text-emerald-600 transition font-medium`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('destinations')}
              className={`${currentPage === 'destinations' ? 'text-emerald-600' : 'text-gray-600'} hover:text-emerald-600 transition font-medium`}
            >
              Destinations
            </button>
            <button
              onClick={() => onNavigate('rides')}
              className={`${currentPage === 'rides' ? 'text-emerald-600' : 'text-gray-600'} hover:text-emerald-600 transition font-medium`}
            >
              Book Ride
            </button>
            <button
              onClick={() => onNavigate('guides')}
              className={`${currentPage === 'guides' ? 'text-emerald-600' : 'text-gray-600'} hover:text-emerald-600 transition font-medium`}
            >
              Local Guides
            </button>

            {user ? (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="flex items-center space-x-2 text-gray-600 hover:text-emerald-600 transition"
                >
                  <User className="h-5 w-5" />
                  <span>{profile?.full_name || 'Profile'}</span>
                </button>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => onNavigate('signin')}
                  className="text-gray-600 hover:text-emerald-600 transition font-medium"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onNavigate('signup')}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-emerald-600"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 pt-2 pb-4 space-y-2">
            <button
              onClick={() => { onNavigate('home'); setIsMenuOpen(false); }}
              className="block w-full text-left px-3 py-2 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition"
            >
              Home
            </button>
            <button
              onClick={() => { onNavigate('destinations'); setIsMenuOpen(false); }}
              className="block w-full text-left px-3 py-2 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition"
            >
              Destinations
            </button>
            <button
              onClick={() => { onNavigate('rides'); setIsMenuOpen(false); }}
              className="block w-full text-left px-3 py-2 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition"
            >
              Book Ride
            </button>
            <button
              onClick={() => { onNavigate('guides'); setIsMenuOpen(false); }}
              className="block w-full text-left px-3 py-2 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition"
            >
              Local Guides
            </button>

            {user ? (
              <>
                <button
                  onClick={() => { onNavigate('dashboard'); setIsMenuOpen(false); }}
                  className="block w-full text-left px-3 py-2 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => { handleSignOut(); setIsMenuOpen(false); }}
                  className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => { onNavigate('signin'); setIsMenuOpen(false); }}
                  className="block w-full text-left px-3 py-2 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition"
                >
                  Sign In
                </button>
                <button
                  onClick={() => { onNavigate('signup'); setIsMenuOpen(false); }}
                  className="block w-full text-center px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
