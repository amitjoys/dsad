import React, { useState } from 'react';
import { 
  MagnifyingGlassIcon, 
  XMarkIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  MapPinIcon,
  CalendarIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const projects = [
    {
      id: 1,
      title: 'Modern Living Space',
      description: 'Contemporary design meets functionality in this stunning 2500 sq ft residential project.',
      image: 'https://images.unsplash.com/photo-1488972685288-c3fd157d7c7a',
      category: 'residential',
      location: 'Pune',
      year: '2023',
      area: '2500 sq ft',
      type: 'Luxury Construction'
    },
    {
      id: 2,
      title: 'Luxury Villa',
      description: 'Mediterranean-inspired architecture with modern amenities and premium finishes.',
      image: 'https://images.unsplash.com/photo-1481026469463-66327c86e544',
      category: 'villa',
      location: 'Mumbai',
      year: '2023',
      area: '4500 sq ft',
      type: 'Premium Luxury'
    },
    {
      id: 3,
      title: 'Commercial Office Space',
      description: 'Modern office design optimized for productivity and employee satisfaction.',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab',
      category: 'commercial',
      location: 'Bangalore',
      year: '2023',
      area: '8000 sq ft',
      type: 'Commercial Construction'
    },
    {
      id: 4,
      title: 'Residential Apartment',
      description: 'Efficient space utilization with modern design elements.',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9',
      category: 'residential',
      location: 'Pune',
      year: '2022',
      area: '1200 sq ft',
      type: 'Simple Construction'
    },
    {
      id: 5,
      title: 'Industrial Warehouse',
      description: 'Large-scale industrial construction with advanced logistics design.',
      image: 'https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg',
      category: 'industrial',
      location: 'Chennai',
      year: '2023',
      area: '15000 sq ft',
      type: 'Industrial Construction'
    },
    {
      id: 6,
      title: 'Luxury Penthouse',
      description: 'Ultra-premium penthouse with breathtaking city views and luxury amenities.',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811',
      category: 'villa',
      location: 'Mumbai',
      year: '2023',
      area: '3500 sq ft',
      type: 'Premium Luxury'
    },
    {
      id: 7,
      title: 'Construction Site Progress',
      description: 'Ongoing construction project showcasing our systematic approach.',
      image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5',
      category: 'construction',
      location: 'Pune',
      year: '2024',
      area: '5000 sq ft',
      type: 'Ongoing Project'
    },
    {
      id: 8,
      title: 'Modern Architecture',
      description: 'Innovative architectural design with sustainable features.',
      image: 'https://images.unsplash.com/photo-1485083269755-a7b559a4fe5e',
      category: 'residential',
      location: 'Hyderabad',
      year: '2023',
      area: '3200 sq ft',
      type: 'Luxury Construction'
    },
    {
      id: 9,
      title: 'Construction Planning',
      description: 'Detailed planning and blueprint development for residential project.',
      image: 'https://images.pexels.com/photos/1109541/pexels-photo-1109541.jpeg',
      category: 'planning',
      location: 'Pune',
      year: '2024',
      area: '2800 sq ft',
      type: 'Design & Planning'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Projects', icon: BuildingOfficeIcon },
    { id: 'residential', label: 'Residential', icon: BuildingOfficeIcon },
    { id: 'commercial', label: 'Commercial', icon: BuildingOfficeIcon },
    { id: 'villa', label: 'Villas', icon: BuildingOfficeIcon },
    { id: 'industrial', label: 'Industrial', icon: BuildingOfficeIcon },
    { id: 'construction', label: 'Construction', icon: BuildingOfficeIcon },
    { id: 'planning', label: 'Planning', icon: BuildingOfficeIcon }
  ];

  const filteredProjects = selectedCategory === 'all' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  const openModal = (project) => {
    setSelectedImage(project);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    const currentIndex = filteredProjects.findIndex(p => p.id === selectedImage.id);
    const nextIndex = (currentIndex + 1) % filteredProjects.length;
    setSelectedImage(filteredProjects[nextIndex]);
  };

  const prevImage = () => {
    const currentIndex = filteredProjects.findIndex(p => p.id === selectedImage.id);
    const prevIndex = (currentIndex - 1 + filteredProjects.length) % filteredProjects.length;
    setSelectedImage(filteredProjects[prevIndex]);
  };

  return (
    <div className="Gallery">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-accent-600 text-white section-padding">
        <div className="container-custom text-center">
          <h1 className="text-5xl font-bold mb-6">
            Project Gallery
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Explore our portfolio of successful construction projects. From residential homes to 
            commercial buildings, see the quality and craftsmanship we deliver.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
              <span className="text-2xl font-bold">{projects.length}+</span>
              <span className="text-sm block">Projects Completed</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
              <span className="text-2xl font-bold">98%</span>
              <span className="text-sm block">Client Satisfaction</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
              <span className="text-2xl font-bold">6+</span>
              <span className="text-sm block">Years Experience</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center px-6 py-3 rounded-lg transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <category.icon className="h-5 w-5 mr-2" />
                {category.label}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="group relative bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                onClick={() => openModal(project)}
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 flex items-center justify-center">
                    <MagnifyingGlassIcon className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="absolute top-4 right-4 bg-primary-600 text-white px-2 py-1 rounded text-xs">
                    {project.type}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {project.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <MapPinIcon className="h-4 w-4 mr-1" />
                      {project.location}
                    </div>
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      {project.year}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <BuildingOfficeIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-bold text-gray-600 mb-2">No Projects Found</h3>
              <p className="text-gray-500">
                No projects match the selected category. Try selecting a different category.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl mx-auto">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <XMarkIcon className="h-8 w-8" />
            </button>

            {/* Navigation Buttons */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
            >
              <ArrowLeftIcon className="h-8 w-8" />
            </button>
            
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
            >
              <ArrowRightIcon className="h-8 w-8" />
            </button>

            {/* Image */}
            <img
              src={selectedImage.image}
              alt={selectedImage.title}
              className="max-w-full max-h-[70vh] object-contain rounded-lg"
            />

            {/* Image Info */}
            <div className="bg-white rounded-lg p-6 mt-4">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {selectedImage.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {selectedImage.description}
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Location:</span>
                  <div className="font-semibold">{selectedImage.location}</div>
                </div>
                <div>
                  <span className="text-gray-500">Year:</span>
                  <div className="font-semibold">{selectedImage.year}</div>
                </div>
                <div>
                  <span className="text-gray-500">Area:</span>
                  <div className="font-semibold">{selectedImage.area}</div>
                </div>
                <div>
                  <span className="text-gray-500">Type:</span>
                  <div className="font-semibold">{selectedImage.type}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;