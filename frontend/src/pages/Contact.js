import React, { useState } from 'react';
import { 
  PhoneIcon, 
  EnvelopeIcon, 
  MapPinIcon, 
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service_type: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const serviceTypes = [
    'Affordable Simple Construction',
    'Elegant Luxury Construction',
    'Premium Luxury Experience',
    'Renovation & Remodeling',
    'Interior Design',
    'Landscaping',
    'Maintenance Services',
    'Consultation Only',
    'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
      
      await axios.post(`${backendUrl}/api/contact`, formData);
      
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        service_type: '',
        message: ''
      });
    } catch (err) {
      setError(err.response?.data?.detail || 'Error submitting form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="Contact">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-accent-600 text-white section-padding">
        <div className="container-custom text-center">
          <h1 className="text-5xl font-bold mb-6">
            Contact Us
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Ready to start your construction project? Get in touch with our team for a free consultation 
            and detailed quote. We're here to help bring your vision to life.
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Get Free Consultation
              </h2>
              <p className="text-gray-600 mb-8">
                Fill out the form below and we'll get back to you within 24 hours with a detailed 
                response to your inquiry.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="form-label">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                    placeholder="Enter your email address"
                  />
                </div>

                <div>
                  <label className="form-label">Service Type</label>
                  <select
                    name="service_type"
                    value={formData.service_type}
                    onChange={handleInputChange}
                    className="form-input"
                  >
                    <option value="">Select a service</option>
                    {serviceTypes.map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="5"
                    className="form-textarea"
                    required
                    placeholder="Tell us about your project requirements, timeline, and any specific needs..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-4 text-lg"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="loading-spinner mr-2"></div>
                      Sending Message...
                    </div>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </form>

              {success && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                    <p className="text-green-800">
                      Thank you for your message! We'll get back to you within 24 hours.
                    </p>
                  </div>
                </div>
              )}

              {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <ExclamationCircleIcon className="h-5 w-5 text-red-600 mr-2" />
                    <p className="text-red-800">{error}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                  Contact Information
                </h3>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary-100 rounded-full p-3">
                      <PhoneIcon className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Phone</h4>
                      <p className="text-gray-600">+91-1234567890</p>
                      <p className="text-sm text-gray-500">Mon-Sat: 9:00 AM - 6:00 PM</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-primary-100 rounded-full p-3">
                      <EnvelopeIcon className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Email</h4>
                      <p className="text-gray-600">info@constructpune.in</p>
                      <p className="text-sm text-gray-500">We respond within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-primary-100 rounded-full p-3">
                      <MapPinIcon className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Address</h4>
                      <p className="text-gray-600">
                        123 Construction Street<br />
                        Pune, Maharashtra 411001<br />
                        India
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-primary-100 rounded-full p-3">
                      <ClockIcon className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Business Hours</h4>
                      <p className="text-gray-600">
                        Monday - Saturday: 9:00 AM - 6:00 PM<br />
                        Sunday: 10:00 AM - 4:00 PM
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                  Why Choose ConstructPune?
                </h3>
                
                <div className="space-y-4">
                  {[
                    'Free consultation and detailed quotes',
                    'Transparent pricing with no hidden costs',
                    'Experienced team of 50+ professionals',
                    'Quality materials and modern construction techniques',
                    'On-time project completion guarantee',
                    'Comprehensive warranty and after-sales support',
                    '500+ successful projects completed',
                    '98% client satisfaction rate'
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircleIcon className="h-5 w-5 text-green-500" />
                      <span className="text-gray-600">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Visit Our Office
            </h2>
            <p className="text-xl text-gray-600">
              Drop by our office for a face-to-face consultation and to see our sample materials.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.2777777777777!2d73.8567!3d18.5204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c6ba00000000%3A0x0!2sPune%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="ConstructPune Office Location"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Common questions about our construction services and process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                question: 'How long does a typical construction project take?',
                answer: 'Project timelines vary based on size and complexity. Simple construction takes 4-6 months, luxury projects 6-8 months, and premium projects 8-12 months.'
              },
              {
                question: 'Do you provide free cost estimates?',
                answer: 'Yes, we provide free detailed cost estimates after an initial consultation. You can also use our online calculator for quick estimates.'
              },
              {
                question: 'What areas do you serve?',
                answer: 'We primarily serve Pune and surrounding areas, with expanded services in Mumbai, Bangalore, Delhi, and other major cities.'
              },
              {
                question: 'Do you handle permits and approvals?',
                answer: 'Yes, we assist with all necessary permits and approvals required for your construction project.'
              },
              {
                question: 'What warranty do you provide?',
                answer: 'We provide 5-10 years structural warranty depending on the service level, plus comprehensive after-sales support.'
              },
              {
                question: 'Can I customize the construction package?',
                answer: 'Absolutely! All our packages are customizable to meet your specific requirements and budget.'
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;