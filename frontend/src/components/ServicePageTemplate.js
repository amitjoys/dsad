import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  CheckCircleIcon,
  StarIcon,
  CurrencyRupeeIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

const ServicePageTemplate = ({ serviceSlug }) => {
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

  useEffect(() => {
    fetchServiceData();
  }, [serviceSlug]);

  const fetchServiceData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/services/${serviceSlug}`);
      setService(response.data);
    } catch (error) {
      console.error('Error fetching service data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await axios.post(`${API_BASE_URL}/api/contact`, {
        ...contactForm,
        service_type: service?.title,
      });
      setSubmitted(true);
      setContactForm({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      alert('Error submitting form. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    setContactForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Service Not Found</h1>
          <p className="text-gray-600 mb-8">The service you're looking for doesn't exist.</p>
          <Link to="/services" className="btn-primary">
            Back to Services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="ServicePage">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-accent-600 text-white section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6">{service.title}</h1>
              <p className="text-xl mb-8 leading-relaxed">{service.description}</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#contact"
                  className="btn-accent bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
                >
                  Get Free Quote
                </a>
                <a
                  href="tel:+91-1234567890"
                  className="btn-secondary bg-white text-primary-600 hover:bg-gray-100 flex items-center justify-center"
                >
                  <PhoneIcon className="h-5 w-5 mr-2" />
                  Call Now
                </a>
              </div>
            </div>
            <div>
              {service.images && service.images.length > 0 && (
                <img
                  src={service.images[0]}
                  alt={service.title}
                  className="rounded-lg shadow-xl w-full h-96 object-cover"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Service Content */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: service.content }} />
              </div>

              {/* Features */}
              {service.features && service.features.length > 0 && (
                <div className="mt-12">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Service Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {service.features.map((feature, index) => (
                      <div key={index} className="flex items-start">
                        <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Pricing Card */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Pricing Information</h3>
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-primary-600 mb-2">
                    ₹{service.pricing_info?.starting_price}
                  </div>
                  <div className="text-gray-600">{service.pricing_info?.unit}</div>
                </div>
                
                {service.pricing_info?.factors && service.pricing_info.factors.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Pricing Factors:</h4>
                    <ul className="space-y-2">
                      {service.pricing_info.factors.map((factor, index) => (
                        <li key={index} className="flex items-start text-sm text-gray-600">
                          <StarIcon className="h-4 w-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                          {factor}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="mt-6">
                  <a
                    href="#contact"
                    className="btn-primary w-full text-center block"
                  >
                    Get Detailed Quote
                  </a>
                </div>
              </div>

              {/* Contact Info Card */}
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
                <h3 className="text-xl font-bold text-primary-800 mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <a
                    href="tel:+91-1234567890"
                    className="flex items-center text-primary-700 hover:text-primary-800"
                  >
                    <PhoneIcon className="h-5 w-5 mr-3" />
                    +91-1234567890
                  </a>
                  <a
                    href="mailto:info@constructpune.in"
                    className="flex items-center text-primary-700 hover:text-primary-800"
                  >
                    <EnvelopeIcon className="h-5 w-5 mr-3" />
                    info@constructpune.in
                  </a>
                </div>
                
                <div className="mt-6 pt-6 border-t border-primary-200">
                  <div className="flex items-center text-primary-700 mb-2">
                    <ClockIcon className="h-5 w-5 mr-3" />
                    <span className="font-medium">Working Hours</span>
                  </div>
                  <div className="text-sm text-primary-600">
                    <div>Mon - Sat: 9:00 AM - 7:00 PM</div>
                    <div>Sunday: 10:00 AM - 5:00 PM</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      {service.images && service.images.length > 1 && (
        <section className="section-padding bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Work Gallery</h2>
              <p className="text-xl text-gray-600">
                See examples of our {service.title.toLowerCase()}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {service.images.slice(1).map((image, index) => (
                <div key={index} className="rounded-lg overflow-hidden shadow-md">
                  <img
                    src={image}
                    alt={`${service.title} example ${index + 1}`}
                    className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Form Section */}
      <section id="contact" className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Get a Free Quote</h2>
              <p className="text-xl text-gray-600">
                Ready to start your {service.title.toLowerCase()} project? Contact us for a detailed quote.
              </p>
            </div>

            {submitted ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
                <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-green-800 mb-2">Thank You!</h3>
                <p className="text-green-600">
                  Your quote request has been submitted successfully. We'll contact you within 24 hours.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-8">
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={contactForm.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={contactForm.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={contactForm.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Details
                    </label>
                    <textarea
                      name="message"
                      value={contactForm.message}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Tell us about your project requirements, area, timeline, etc."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div className="text-center">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn-primary px-8 py-3 text-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {submitting ? 'Submitting...' : 'Get Free Quote'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Other Services</h2>
            <p className="text-xl text-gray-600">
              Explore our other construction and design services
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link to="/calculator" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group">
              <CurrencyRupeeIcon className="h-12 w-12 text-primary-600 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Cost Calculator</h3>
              <p className="text-gray-600 mb-4">Get instant cost estimates for your construction project</p>
              <div className="flex items-center text-primary-600 font-medium">
                Calculate Now <ArrowRightIcon className="h-4 w-4 ml-2" />
              </div>
            </Link>
            
            <Link to="/services" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group">
              <ShieldCheckIcon className="h-12 w-12 text-primary-600 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">All Services</h3>
              <p className="text-gray-600 mb-4">View our complete range of construction services</p>
              <div className="flex items-center text-primary-600 font-medium">
                View All Services <ArrowRightIcon className="h-4 w-4 ml-2" />
              </div>
            </Link>
            
            <Link to="/contact" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group">
              <EnvelopeIcon className="h-12 w-12 text-primary-600 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Contact Us</h3>
              <p className="text-gray-600 mb-4">Get in touch for personalized consultation</p>
              <div className="flex items-center text-primary-600 font-medium">
                Contact Now <ArrowRightIcon className="h-4 w-4 ml-2" />
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicePageTemplate;