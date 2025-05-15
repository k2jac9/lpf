import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, Github, Mail, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and tagline */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center">
              <Scale className="h-8 w-8 text-primary-500" />
              <span className="ml-2 text-xl font-semibold text-primary-500">LegalVerify</span>
            </Link>
            <p className="mt-2 text-sm text-gray-600">
              Verifiable professional reviews for legal professionals powered by blockchain technology.
            </p>
            <div className="mt-4 flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-primary-500 transition-colors duration-200">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-gray-500 hover:text-primary-500 transition-colors duration-200">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
              <a href="#" className="text-gray-500 hover:text-primary-500 transition-colors duration-200">
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </a>
            </div>
          </div>

          {/* Product links */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Product</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/features" className="text-sm text-gray-600 hover:text-primary-500 transition-colors duration-200">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-sm text-gray-600 hover:text-primary-500 transition-colors duration-200">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/blockchain" className="text-sm text-gray-600 hover:text-primary-500 transition-colors duration-200">
                  Blockchain
                </Link>
              </li>
              <li>
                <Link to="/verification" className="text-sm text-gray-600 hover:text-primary-500 transition-colors duration-200">
                  Verification
                </Link>
              </li>
            </ul>
          </div>

          {/* Support links */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Support</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/documentation" className="text-sm text-gray-600 hover:text-primary-500 transition-colors duration-200">
                  Documentation
                </Link>
              </li>
              <li>
                <Link to="/guides" className="text-sm text-gray-600 hover:text-primary-500 transition-colors duration-200">
                  Guides
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="text-sm text-gray-600 hover:text-primary-500 transition-colors duration-200">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-gray-600 hover:text-primary-500 transition-colors duration-200">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Company links */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Company</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/about" className="text-sm text-gray-600 hover:text-primary-500 transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-sm text-gray-600 hover:text-primary-500 transition-colors duration-200">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-sm text-gray-600 hover:text-primary-500 transition-colors duration-200">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/press" className="text-sm text-gray-600 hover:text-primary-500 transition-colors duration-200">
                  Press
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between">
            <p className="text-sm text-gray-500">
              &copy; {currentYear} LegalVerify. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <Link to="/privacy" className="text-sm text-gray-500 hover:text-primary-500 transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm text-gray-500 hover:text-primary-500 transition-colors duration-200">
                Terms of Service
              </Link>
              <Link to="/legal" className="text-sm text-gray-500 hover:text-primary-500 transition-colors duration-200">
                Legal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;