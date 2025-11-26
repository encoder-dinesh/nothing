import { MapPin, Phone, Mail, Facebook, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center mb-4">
              <MapPin className="h-8 w-8 text-emerald-500" />
              <span className="ml-2 text-xl font-bold">TravelIndia</span>
            </div>
            <p className="text-gray-400 text-sm">
              Your trusted companion for exploring the incredible beauty and diversity of India.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-emerald-500 transition">About Us</a></li>
              <li><a href="#" className="hover:text-emerald-500 transition">Destinations</a></li>
              <li><a href="#" className="hover:text-emerald-500 transition">Book Ride</a></li>
              <li><a href="#" className="hover:text-emerald-500 transition">Find Guides</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-emerald-500 transition">Help Center</a></li>
              <li><a href="#" className="hover:text-emerald-500 transition">Safety</a></li>
              <li><a href="#" className="hover:text-emerald-500 transition">Terms of Service</a></li>
              <li><a href="#" className="hover:text-emerald-500 transition">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                +91 1800 123 4567
              </li>
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                support@travelindia.com
              </li>
              <li className="flex items-center space-x-3 mt-4">
                <a href="#" className="hover:text-emerald-500 transition">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="hover:text-emerald-500 transition">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="hover:text-emerald-500 transition">
                  <Instagram className="h-5 w-5" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 text-center text-gray-400 text-sm">
          <p>&copy; 2025 TravelIndia. All rights reserved. Made with care for travelers exploring India.</p>
        </div>
      </div>
    </footer>
  );
}
