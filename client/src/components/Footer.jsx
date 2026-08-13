import { BedDouble, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-primary text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BedDouble className="text-accent" size={24} />
              <span className="text-xl font-bold">Grand Hotel</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Experience luxury and comfort at its finest. We provide world-class amenities
              and exceptional service for an unforgettable stay.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-accent">Quick Links</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <Link to="/" className="block hover:text-white transition-colors">Home</Link>
              <Link to="/rooms" className="block hover:text-white transition-colors">Rooms</Link>
              <Link to="/login" className="block hover:text-white transition-colors">Login</Link>
              <Link to="/register" className="block hover:text-white transition-colors">Register</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-accent">Contact</h4>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-accent" />
                <span>123 Luxury Avenue, New York, NY 10001</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-accent" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-accent" />
                <span>info@grandhotel.com</span>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-secondary mt-8 pt-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Grand Hotel Management System. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

