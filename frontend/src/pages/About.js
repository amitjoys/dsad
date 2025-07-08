import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircleIcon, 
  UserGroupIcon, 
  TrophyIcon, 
  ClockIcon,
  ShieldCheckIcon,
  StarIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  CogIcon,
  HomeIcon
} from '@heroicons/react/24/outline';

const About = () => {
  const stats = [
    { number: '500+', label: 'Projects Completed', icon: BuildingOfficeIcon },
    { number: '6+', label: 'Years of Experience', icon: ClockIcon },
    { number: '98%', label: 'Client Satisfaction', icon: StarIcon },
    { number: '50+', label: 'Expert Team Members', icon: UserGroupIcon }
  ];

  const values = [
    {
      icon: ShieldCheckIcon,
      title: 'Quality Assurance',
      description: 'We maintain the highest standards of quality in every project, ensuring durable and reliable construction.'
    },
    {
      icon: ClockIcon,
      title: 'Timely Delivery',
      description: 'Our projects are completed on schedule without compromising on quality or safety standards.'
    },
    {
      icon: CheckCircleIcon,
      title: 'Transparency',
      description: 'Clear communication and transparent pricing with no hidden costs or surprises.'
    },
    {
      icon: TrophyIcon,
      title: 'Excellence',
      description: 'Commitment to excellence in design, construction, and customer service.'
    }
  ];

  const team = [
    {
      name: 'Rajesh Sharma',
      role: 'CEO & Founder',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
      description: 'With over 15 years of experience in construction and project management.'
    },
    {
      name: 'Priya Patel',
      role: 'Chief Architect',
      image: 'https://images.unsplash.com/photo-1494790108755-2616c2b19a36',
      description: 'Award-winning architect specializing in modern residential and commercial design.'
    },
    {
      name: 'Amit Kumar',
      role: 'Project Manager',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
      description: 'Expert in construction management and quality control with 12+ years experience.'
    },
    {
      name: 'Sneha Desai',
      role: 'Interior Designer',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
      description: 'Creative interior designer with expertise in luxury and contemporary design.'
    }
  ];

  const milestones = [
    {
      year: '2018',
      title: 'Company Founded',
      description: 'ConstructPune was established with a vision to provide quality construction services.'
    },
    {
      year: '2019',
      title: 'First Major Project',
      description: 'Completed our first major residential complex with 50+ units.'
    },
    {
      year: '2020',
      title: 'Commercial Expansion',
      description: 'Expanded into commercial construction with office buildings and retail spaces.'
    },
    {
      year: '2021',
      title: 'Luxury Division',
      description: 'Launched premium luxury construction services for high-end clientele.'
    },
    {
      year: '2022',
      title: 'Technology Integration',
      description: 'Integrated smart home technology and sustainable construction practices.'
    },
    {
      year: '2023',
      title: 'Regional Expansion',
      description: 'Expanded operations to Mumbai, Bangalore, and other major cities.'
    },
    {
      year: '2024',
      title: 'Digital Innovation',
      description: 'Launched online cost calculator and digital project management tools.'
    }
  ];

  return (
    <div className="About">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-accent-600 text-white section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6">
                About ConstructPune
              </h1>
              <p className="text-xl mb-6">
                Building dreams since 2018, we are your trusted partner in construction excellence.
              </p>
              <p className="text-lg mb-8 opacity-90">
                Established in 2018, ConstructPune is a trusted name in the construction industry, 
                offering top-quality residential, commercial, and industrial construction services 
                in Pune and surrounding areas.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/contact" className="btn-secondary bg-white text-primary-600 hover:bg-gray-100">
                  Get In Touch
                </Link>
                <Link to="/gallery" className="btn-accent bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20">
                  View Our Work
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/1109541/pexels-photo-1109541.jpeg"
                alt="About ConstructPune"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-primary-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-10 w-10 text-primary-600" />
                </div>
                <div className="text-4xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                To provide exceptional construction services while maintaining the highest standards 
                of safety, quality, and sustainability. We are committed to transforming our clients' 
                visions into reality through innovative designs and superior craftsmanship.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                We believe in building not just structures, but lasting relationships with our clients, 
                partners, and communities. Every project we undertake is a testament to our dedication 
                to excellence and our passion for creating spaces that inspire and endure.
              </p>
            </div>
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">
                Our Vision
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                To be the leading construction company in India, recognized for our commitment to 
                quality, innovation, and sustainability. We envision a future where every space we 
                create contributes to better living and working environments.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                We strive to set new standards in the construction industry through the adoption of 
                cutting-edge technologies, sustainable practices, and continuous innovation in design 
                and construction methodologies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These values guide everything we do and define who we are as a company.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="bg-primary-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-10 w-10 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Our Leadership Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Meet the experienced professionals who lead ConstructPune to deliver exceptional results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-primary-600 font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {member.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From our humble beginnings to becoming a trusted construction partner across India.
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary-200"></div>
            
            {milestones.map((milestone, index) => (
              <div key={index} className={`relative mb-8 flex items-center ${
                index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
              }`}>
                <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}>
                  <div className={`bg-white rounded-lg shadow-lg p-6 ${
                    index % 2 === 0 ? 'text-right' : 'text-left'
                  }`}>
                    <div className="text-primary-600 font-bold text-lg mb-2">
                      {milestone.year}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {milestone.title}
                    </h3>
                    <p className="text-gray-600">
                      {milestone.description}
                    </p>
                  </div>
                </div>
                
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary-600 rounded-full border-4 border-white shadow-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards & Certifications */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Awards & Certifications
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Recognition for our commitment to excellence in construction and customer service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Best Construction Company 2023',
                organization: 'Maharashtra Construction Awards',
                year: '2023'
              },
              {
                title: 'Excellence in Residential Construction',
                organization: 'India Construction Excellence Awards',
                year: '2022'
              },
              {
                title: 'ISO 9001:2015 Certified',
                organization: 'Quality Management System',
                year: '2021'
              },
              {
                title: 'Green Building Certification',
                organization: 'Indian Green Building Council',
                year: '2022'
              },
              {
                title: 'Customer Choice Award',
                organization: 'Construction Today Magazine',
                year: '2023'
              },
              {
                title: 'Innovation in Construction',
                organization: 'Construction Innovation Awards',
                year: '2023'
              }
            ].map((award, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 text-center">
                <TrophyIcon className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {award.title}
                </h3>
                <p className="text-gray-600 mb-2">
                  {award.organization}
                </p>
                <p className="text-primary-600 font-semibold">
                  {award.year}
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
            Ready to Work With Us?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join hundreds of satisfied clients who have trusted ConstructPune with their construction needs. 
            Let's build something amazing together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="btn-secondary bg-white text-primary-600 hover:bg-gray-100">
              <PhoneIcon className="h-5 w-5 mr-2" />
              Get In Touch
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

export default About;