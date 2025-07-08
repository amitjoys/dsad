import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircleIcon, 
  StarIcon, 
  ArrowRightIcon,
  BuildingOfficeIcon,
  HomeIcon,
  CogIcon,
  CalculatorIcon,
  PhoneIcon,
  ClockIcon,
  UserGroupIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5',
      title: 'Build Your Dream Space Today',
      subtitle: 'Premium Construction Services in Pune',
      description: 'Transform your vision into reality with our expert construction services. From simple to luxury projects, we deliver excellence.'
    },
    {
      image: 'https://images.unsplash.com/photo-1485083269755-a7b559a4fe5e',
      title: 'Modern Construction Excellence',
      subtitle: 'Innovative Designs & Quality Craftsmanship',
      description: 'Experience the future of construction with our cutting-edge techniques and sustainable building practices.'
    },
    {
      image: 'https://images.unsplash.com/photo-1587582423116-ec07293f0395',
      title: 'Trusted Since 2018',
      subtitle: 'Your Reliable Construction Partner',
      description: 'With years of experience and hundreds of successful projects, we are your trusted partner in construction.'
    }
  ];

  const services = [
    {
      icon: HomeIcon,
      title: 'Affordable Simple Construction',
      description: 'Cost-effective solutions for both residential and commercial projects with quick turnaround times.',
      features: ['Quality Materials', 'Quick Delivery', 'Affordable Pricing', 'Expert Team'],
      price: 'Starting from ₹1,200/sq ft',
      image: 'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e'
    },
    {
      icon: BuildingOfficeIcon,
      title: 'Elegant Luxury Construction',
      description: 'High-quality materials and finishes to create luxurious spaces that reflect your aesthetic vision.',
      features: ['Premium Materials', 'Custom Design', 'Luxury Finishes', 'Personalized Service'],
      price: 'Starting from ₹2,000/sq ft',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811'
    },
    {
      icon: CogIcon,
      title: 'Premium Luxury Experience',
      description: 'Exclusive designs with attention to detail, enhanced energy efficiency and sustainable features.',
      features: ['Ultra-Premium Materials', 'Bespoke Design', 'Smart Features', 'Sustainable Tech'],
      price: 'Starting from ₹3,500/sq ft',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9'
    }
  ];

  const projects = [
    {
      title: 'Modern Living Space',
      description: 'Contemporary design meets functionality in this stunning residential project.',
      image: 'https://images.unsplash.com/photo-1488972685288-c3fd157d7c7a',
      category: 'Residential',
      location: 'Pune'
    },
    {
      title: 'Luxury Villa',
      description: 'Mediterranean-inspired architecture with modern amenities and luxury finishes.',
      image: 'https://images.unsplash.com/photo-1481026469463-66327c86e544',
      category: 'Villa',
      location: 'Mumbai'
    },
    {
      title: 'Commercial Space',
      description: 'Modern office design optimized for productivity and employee satisfaction.',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab',
      category: 'Commercial',
      location: 'Bangalore'
    }
  ];

  const testimonials = [
    {
      name: 'Prakash Kumar',
      role: 'Homeowner',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
      rating: 5,
      text: 'ConstructPune transformed my vision into reality. Their attention to detail and quality of work is unmatched!'
    },
    {
      name: 'Anita Desai',
      role: 'Real Estate Agent',
      image: 'https://images.unsplash.com/photo-1494790108755-2616c2b19a36',
      rating: 5,
      text: 'I recommend ConstructPune to all my clients. They deliver exceptional results on time and within budget.'
    },
    {
      name: 'Suresh Patil',
      role: 'Modern Farmer',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
      rating: 5,
      text: 'The house they built for me exceeded my expectations. Professional and reliable service!'
    }
  ];

  const stats = [
    { number: '500+', label: 'Projects Completed', icon: BuildingOfficeIcon },
    { number: '6+', label: 'Years of Experience', icon: ClockIcon },
    { number: '98%', label: 'Client Satisfaction', icon: StarIcon },
    { number: '50+', label: 'Expert Team Members', icon: UserGroupIcon }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [heroSlides.length]);

  return (
    <div className="Home">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-50" />
          </div>
        ))}
        
        <div className="relative z-10 text-center text-white max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="heading-xl mb-6 text-white animate-fade-in-up">
            {heroSlides[currentSlide].title}
          </h1>
          <p className="body-lg mb-4 text-gray-100 animate-fade-in-up max-w-3xl mx-auto" style={{ animationDelay: '0.2s' }}>
            {heroSlides[currentSlide].subtitle}
          </p>
          <p className="body-md mb-8 text-gray-200 animate-fade-in-up max-w-4xl mx-auto" style={{ animationDelay: '0.4s' }}>
            {heroSlides[currentSlide].description}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <Link to="/services" className="btn-primary text-lg px-8 py-4">
              Explore Services
            </Link>
            <Link to="/calculator" className="btn-secondary bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 text-lg px-8 py-4">
              <CalculatorIcon className="h-5 w-5 mr-2" />
              Cost Calculator
            </Link>
          </div>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding-sm bg-white border-b border-gray-100">
        <div className="container-custom">
          <div className="grid-responsive-4">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item group">
                <div className="bg-primary-100 rounded-full w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-colors duration-300">
                  <stat.icon className="h-8 w-8 md:h-10 md:w-10 text-primary-600" />
                </div>
                <div className="stat-number">
                  {stat.number}
                </div>
                <div className="stat-label">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="heading-lg mb-6">
              Explore Our Construction Services
            </h2>
            <p className="body-lg text-gray-600 max-w-4xl mx-auto">
              From affordable simple construction to premium luxury experiences, we offer comprehensive 
              construction services tailored to your needs and budget.
            </p>
          </div>

          <div className="grid-responsive gap-8 lg:gap-12">
            {services.map((service, index) => (
              <div key={index} className="card-interactive group">
                <div className="relative h-64 md:h-72 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-md">
                    <service.icon className="h-6 w-6 md:h-8 md:w-8 text-primary-600" />
                  </div>
                </div>
                
                <div className="p-6 md:p-8">
                  <h3 className="heading-md mb-4">
                    {service.title}
                  </h3>
                  <p className="body-sm text-gray-600 mb-6">
                    {service.description}
                  </p>
                  
                  <div className="mb-6">
                    <div className="text-2xl md:text-3xl font-bold text-primary-600 mb-4">
                      {service.price}
                    </div>
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-600">
                          <CheckCircleIcon className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Link
                    to="/services"
                    className="btn-primary w-full flex items-center justify-center group"
                  >
                    Learn More
                    <ArrowRightIcon className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-content">
              <h2 className="heading-lg">
                About ConstructPune
              </h2>
              <p className="body-md text-gray-600">
                Established in 2018, ConstructPune is a trusted name in the construction industry, 
                offering top-quality residential, commercial, and industrial construction services 
                in Pune and surrounding areas.
              </p>
              <p className="body-md text-gray-600">
                We specialize in delivering customized solutions that combine innovative designs, 
                superior craftsmanship, and modern technology to bring your vision to life.
              </p>
              
              <Link to="/about" className="btn-primary inline-flex items-center">
                Learn More About Us
                <ArrowRightIcon className="h-4 w-4 ml-2" />
              </Link>
            </div>
            
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/1109541/pexels-photo-1109541.jpeg"
                alt="About ConstructPune"
                className="rounded-2xl shadow-2xl w-full"
                loading="lazy"
              />
              <div className="absolute -bottom-6 -right-6 bg-primary-600 text-white p-6 rounded-2xl shadow-2xl">
                <div className="text-center">
                  <TrophyIcon className="h-8 w-8 mx-auto mb-2" />
                  <div className="text-2xl font-bold">6+</div>
                  <div className="text-sm">Years of Excellence</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="heading-lg mb-6">
              Our Recent Projects
            </h2>
            <p className="body-lg text-gray-600 max-w-4xl mx-auto">
              Take a look at some of our recent construction projects that showcase our 
              commitment to quality and innovation.
            </p>
          </div>

          <div className="grid-responsive gap-8">
            {projects.map((project, index) => (
              <div key={index} className="card-interactive group">
                <div className="relative h-64 md:h-72 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-4 right-4 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {project.category}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="heading-sm mb-3">
                    {project.title}
                  </h3>
                  <p className="body-sm text-gray-600 mb-4">
                    {project.description}
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {project.location}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/gallery" className="btn-primary">
              View All Projects
            </Link>
          </div>
        </div>
      </section>

      {/* Calculator CTA Section */}
      <section className="section-padding bg-gradient-to-r from-primary-600 to-accent-600 text-white">
        <div className="container-custom text-center">
          <CalculatorIcon className="h-16 w-16 mx-auto mb-6" />
          <h2 className="heading-lg mb-6 text-white">
            Free Construction Cost Calculator
          </h2>
          <p className="body-lg mb-8 max-w-4xl mx-auto">
            Get instant cost estimates for your construction project. Our advanced calculator 
            uses real-time material prices and labor costs to give you accurate estimates.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/calculator" className="btn-accent bg-white text-primary-600 hover:bg-gray-100">
              Try Calculator Now
            </Link>
            <Link to="/contact" className="btn-secondary bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20">
              Get Professional Quote
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="heading-lg mb-6">
              What Our Clients Say
            </h2>
            <p className="body-lg text-gray-600 max-w-4xl mx-auto">
              Don't just take our word for it. Here's what our satisfied clients have to say 
              about their experience with ConstructPune.
            </p>
          </div>

          <div className="grid-responsive gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="flex items-center mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="testimonial-quote">
                  "{testimonial.text}"
                </p>
                
                <div className="flex items-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                    loading="lazy"
                  />
                  <div>
                    <div className="testimonial-author">
                      {testimonial.name}
                    </div>
                    <div className="testimonial-role">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-primary-600 to-accent-600 text-white">
        <div className="container-custom text-center">
          <h2 className="heading-lg mb-6 text-white">
            Ready to Start Your Construction Project?
          </h2>
          <p className="body-lg mb-8 max-w-4xl mx-auto">
            Let's discuss your project requirements and provide you with a customized solution 
            that fits your budget and timeline.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="btn-secondary bg-white text-primary-600 hover:bg-gray-100">
              <PhoneIcon className="h-5 w-5 mr-2" />
              Get Free Consultation
            </Link>
            <Link to="/calculator" className="btn-accent bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20">
              <CalculatorIcon className="h-5 w-5 mr-2" />
              Calculate Project Cost
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;