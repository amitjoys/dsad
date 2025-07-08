import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircleIcon, 
  ArrowRightIcon,
  HomeIcon,
  BuildingOfficeIcon,
  CogIcon,
  StarIcon,
  ClockIcon,
  ShieldCheckIcon,
  CurrencyRupeeIcon
} from '@heroicons/react/24/outline';

const Services = () => {
  const services = [
    {
      id: 'simple',
      icon: HomeIcon,
      title: 'Affordable Simple Construction',
      subtitle: 'Cost-effective solutions for your construction needs',
      price: 'Starting from ₹1,200/sq ft',
      image: 'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e',
      description: 'Our Simple Construction service provides cost-effective solutions for both residential and commercial projects. We focus on delivering quality construction with quick turnaround times without compromising on structural integrity.',
      features: [
        'Quality materials at competitive prices',
        'Standard finishes and fixtures',
        'Quick project completion',
        'Professional supervision',
        'Basic electrical and plumbing',
        'Standard tiles and flooring',
        'Basic paint and finishing',
        'Structural warranty'
      ],
      benefits: [
        'Cost-effective construction',
        'Faster project delivery',
        'Reliable quality standards',
        'Transparent pricing'
      ],
      timeline: '4-6 months',
      warranty: '5 years structural warranty'
    },
    {
      id: 'luxury',
      icon: BuildingOfficeIcon,
      title: 'Elegant Luxury Construction',
      subtitle: 'Premium materials and finishes for sophisticated spaces',
      price: 'Starting from ₹2,000/sq ft',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811',
      description: 'Experience elegance with our Luxury Construction service. We use high-quality materials and premium finishes to create luxurious spaces that reflect your aesthetic vision and lifestyle preferences.',
      features: [
        'Premium quality materials',
        'Designer finishes and fixtures',
        'Custom interior design',
        'Advanced electrical systems',
        'Premium plumbing fixtures',
        'High-end tiles and flooring',
        'Premium paint and textures',
        'Landscaping included'
      ],
      benefits: [
        'Elegant and sophisticated design',
        'Premium material quality',
        'Custom design solutions',
        'Enhanced property value'
      ],
      timeline: '6-8 months',
      warranty: '7 years comprehensive warranty'
    },
    {
      id: 'premium',
      icon: CogIcon,
      title: 'Premium Luxury Experience',
      subtitle: 'Ultra-premium construction with exclusive features',
      price: 'Starting from ₹3,500/sq ft',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9',
      description: 'Our Premium Luxury services offer exclusive designs with meticulous attention to detail. Enjoy enhanced energy efficiency, smart home features, and sustainable construction technologies.',
      features: [
        'Ultra-premium materials',
        'Bespoke design and architecture',
        'Smart home automation',
        'Energy-efficient systems',
        'Luxury plumbing and fixtures',
        'Designer lighting solutions',
        'Premium landscaping',
        'Sustainable technologies'
      ],
      benefits: [
        'Exclusive and unique design',
        'Smart home integration',
        'Energy-efficient construction',
        'Lifetime support and maintenance'
      ],
      timeline: '8-12 months',
      warranty: '10 years comprehensive warranty'
    }
  ];

  const additionalServices = [
    {
      title: 'Renovation & Remodeling',
      description: 'Transform your existing space with our expert renovation services.',
      icon: '🔨'
    },
    {
      title: 'Interior Design',
      description: 'Complete interior design solutions for residential and commercial spaces.',
      icon: '🎨'
    },
    {
      title: 'Landscaping',
      description: 'Beautiful outdoor spaces with professional landscaping services.',
      icon: '🌳'
    },
    {
      title: 'Maintenance Services',
      description: 'Ongoing maintenance and support for your constructed projects.',
      icon: '⚙️'
    }
  ];

  return (
    <div className="Services">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-accent-600 text-white section-padding">
        <div className="container-custom text-center">
          <h1 className="text-5xl font-bold mb-6">
            Our Construction Services
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            From affordable simple construction to premium luxury experiences, we offer comprehensive 
            construction services tailored to your needs and budget.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/calculator" className="btn-accent bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20">
              Get Cost Estimate
            </Link>
            <Link to="/contact" className="btn-secondary bg-white text-primary-600 hover:bg-gray-100">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="space-y-16">
            {services.map((service, index) => (
              <div key={service.id} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}>
                <div className={`${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <div className="relative">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="rounded-lg shadow-xl w-full h-96 object-cover"
                    />
                    <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm rounded-lg p-4">
                      <service.icon className="h-8 w-8 text-primary-600" />
                    </div>
                    <div className="absolute bottom-6 right-6 bg-primary-600 text-white px-4 py-2 rounded-lg">
                      <div className="text-2xl font-bold">{service.price}</div>
                    </div>
                  </div>
                </div>

                <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div className="mb-4">
                    <h2 className="text-4xl font-bold text-gray-800 mb-2">
                      {service.title}
                    </h2>
                    <p className="text-xl text-gray-600 mb-4">
                      {service.subtitle}
                    </p>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {service.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3">Key Features</h4>
                      <ul className="space-y-2">
                        {service.features.slice(0, 4).map((feature, idx) => (
                          <li key={idx} className="flex items-start text-sm text-gray-600">
                            <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3">Benefits</h4>
                      <ul className="space-y-2">
                        {service.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-start text-sm text-gray-600">
                            <StarIcon className="h-4 w-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <ClockIcon className="h-5 w-5 text-primary-600 mb-2" />
                      <div className="text-sm text-gray-600">Timeline</div>
                      <div className="font-semibold text-gray-800">{service.timeline}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <ShieldCheckIcon className="h-5 w-5 text-primary-600 mb-2" />
                      <div className="text-sm text-gray-600">Warranty</div>
                      <div className="font-semibold text-gray-800">{service.warranty}</div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link to="/calculator" className="btn-primary flex items-center justify-center">
                      <CurrencyRupeeIcon className="h-5 w-5 mr-2" />
                      Get Quote
                    </Link>
                    <Link to="/contact" className="btn-secondary flex items-center justify-center">
                      Learn More
                      <ArrowRightIcon className="h-4 w-4 ml-2" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Additional Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Beyond construction, we offer comprehensive services to meet all your building and design needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalServices.map((service, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Our Construction Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We follow a systematic approach to ensure your project is completed on time, within budget, and to your satisfaction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Consultation',
                description: 'Initial meeting to understand your requirements and vision for the project.'
              },
              {
                step: '02',
                title: 'Design & Planning',
                description: 'Detailed architectural design and comprehensive project planning.'
              },
              {
                step: '03',
                title: 'Construction',
                description: 'Professional construction with regular progress updates and quality checks.'
              },
              {
                step: '04',
                title: 'Handover',
                description: 'Final inspection, quality assurance, and project handover with warranty.'
              }
            ].map((process, index) => (
              <div key={index} className="text-center">
                <div className="bg-primary-600 text-white text-2xl font-bold w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  {process.step}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {process.title}
                </h3>
                <p className="text-gray-600">
                  {process.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-primary-600 to-accent-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Start Your Project?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Get a free consultation and detailed quote for your construction project. 
            Our experts are ready to help you build your dream space.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="btn-secondary bg-white text-primary-600 hover:bg-gray-100">
              Get Free Consultation
            </Link>
            <Link to="/calculator" className="btn-accent bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20">
              Calculate Project Cost
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;