import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone, Github, Twitter, Linkedin } from 'lucide-react'

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-lg" />
              <span className="text-lg font-bold text-white">VoteSecure</span>
            </div>
            <p className="text-sm">Secure online election management system</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-primary-400">Home</Link></li>
              <li><Link to="/elections" className="hover:text-primary-400">Elections</Link></li>
              <li><Link to="/about" className="hover:text-primary-400">About</Link></li>
              <li><Link to="/contact" className="hover:text-primary-400">Contact</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-primary-400">Help Center</a></li>
              <li><a href="#" className="hover:text-primary-400">Documentation</a></li>
              <li><a href="#" className="hover:text-primary-400">FAQ</a></li>
              <li><a href="#" className="hover:text-primary-400">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail size={16} />
                <a href="mailto:info@votesecure.com">info@votesecure.com</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} />
                <a href="tel:+1234567890">+1 (234) 567-890</a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} />
                <span>123 Main St, City, Country</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-gray-800 my-8" />

        {/* Bottom */}
        <div className="flex justify-between items-center flex-wrap gap-4">
          <p className="text-sm">&copy; 2026 VoteSecure. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-primary-400"><Github size={20} /></a>
            <a href="#" className="hover:text-primary-400"><Twitter size={20} /></a>
            <a href="#" className="hover:text-primary-400"><Linkedin size={20} /></a>
          </div>
        </div>
      </div>
    </footer>
  )
}
