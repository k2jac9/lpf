import React from 'react';
import { Link } from 'react-router-dom';
import { FileCheck, Database, Search, Shield, ArrowRight, Scale, Github, Mail, Twitter } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/shared/Button';

const HomePage: React.FC = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-primary-500 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Trusted Records Hub
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Verifiable professional reviews for legal professionals powered by blockchain technology.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Button 
                size="lg"
                variant="secondary"
                as={Link}
                to="/register"
                className="font-semibold"
              >
                Get Started
              </Button>
              <Button 
                size="lg"
                variant="outline"
                as={Link}
                to="/how-it-works"
                className="font-semibold text-white border-white hover:bg-primary-400"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Trusted Records Hub</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our platform provides the tools legal professionals need to create verifiable and transparent reviews.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6 transition-transform duration-300 transform hover:translate-y-[-5px]">
              <div className="w-16 h-16 bg-primary-100 text-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileCheck className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Immutable Records</h3>
              <p className="text-gray-600">
                All reviews are permanently recorded on the Aptos and Stellar blockchain, ensuring they cannot be altered or deleted.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="text-center p-6 transition-transform duration-300 transform hover:translate-y-[-5px]">
              <div className="w-16 h-16 bg-secondary-100 text-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Database className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Blockchain Verification</h3>
              <p className="text-gray-600">
                Each review is linked to a unique blockchain transaction for transparent verification.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="text-center p-6 transition-transform duration-300 transform hover:translate-y-[-5px]">
              <div className="w-16 h-16 bg-primary-100 text-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Searchable Database</h3>
              <p className="text-gray-600">
                Easily search and find verified reviews based on case type, jurisdiction, or keywords.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="text-center p-6 transition-transform duration-300 transform hover:translate-y-[-5px]">
              <div className="w-16 h-16 bg-secondary-100 text-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Professional Security</h3>
              <p className="text-gray-600">
                Designed for legal professionals with privacy and security built into every aspect.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our simple process makes it easy to create and verify legal reviews on the blockchain.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md relative">
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-2">Create a Review</h3>
              <p className="text-gray-600 mb-4">
                Draft your legal review with our easy-to-use template system designed for legal professionals.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md relative">
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-2">Submit for Verification</h3>
              <p className="text-gray-600 mb-4">
                Submit your review to be cryptographically signed and permanently recorded on the Aptos blockchain.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md relative">
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-2">Share Verified Reviews</h3>
              <p className="text-gray-600 mb-4">
                Share your blockchain-verified review with clients, colleagues, or the court with full confidence.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Button
              variant="primary"
              size="lg"
              rightIcon={<ArrowRight className="h-5 w-5" />}
              as={Link}
              to="/register"
            >
              Start Creating Verified Reviews
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Legal Professionals Say</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Hear from other legal professionals who are already using Trusted Records Hub.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <img
                  src="https://images.pexels.com/photos/3778680/pexels-photo-3778680.jpeg?auto=compress&cs=tinysrgb&w=150"
                  alt="Sarah Chen"
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="text-lg font-semibold">Sarah Chen</h4>
                  <p className="text-gray-600 text-sm">Intellectual Property Attorney</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "Trusted Records Hub has revolutionized how I provide expert opinions. My clients appreciate the added layer of trust that blockchain verification provides."
              </p>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <img
                  src="https://images.pexels.com/photos/3785104/pexels-photo-3785104.jpeg?auto=compress&cs=tinysrgb&w=150"
                  alt="Michael Johnson"
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="text-lg font-semibold">Michael Johnson</h4>
                  <p className="text-gray-600 text-sm">Corporate Law Partner</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "The ability to provide verifiable contract reviews has strengthened our firm's reputation and given our clients peace of mind in high-stakes negotiations."
              </p>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <img
                  src="https://images.pexels.com/photos/5668770/pexels-photo-5668770.jpeg?auto=compress&cs=tinysrgb&w=150"
                  alt="Elena Rodriguez"
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="text-lg font-semibold">Elena Rodriguez</h4>
                  <p className="text-gray-600 text-sm">Compliance Officer</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "Trusted Records Hub has streamlined our compliance reviews and created an immutable audit trail that has simplified our regulatory reporting requirements."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-500 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Legal Reviews?</h2>
            <p className="text-xl mb-8">
              Join the growing community of legal professionals using blockchain verification to establish trust and transparency.
            </p>
            <Button
              variant="secondary"
              size="lg"
              as={Link}
              to="/register"
              className="font-semibold"
            >
              Create Your Account
            </Button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default HomePage;