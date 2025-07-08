import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bars3Icon, XMarkIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsOpen(false);
  }, [location]);

  useEffect(() => {
    // Prevent body scroll when mobile menu is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/services', label: 'Services' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/about', label: 'About Us' },
    { path: '/calculator', label: 'Calculator' },
    { path: '/contact', label: 'Contact' }
  ];

  return (
    <>
      {/* Top bar with contact info - Hidden on mobile */}
      <div className="bg-primary-600 text-white py-2 px-4 text-sm hidden md:block">
        <div className="container-custom flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <a 
              href="tel:+91-1234567890" 
              className="flex items-center space-x-2 hover:text-primary-200 transition-colors duration-200"
              aria-label="Call us"
            >
              <PhoneIcon className="h-4 w-4" />
              <span>+91-1234567890</span>
            </a>
            <a 
              href="mailto:info@constructpune.in" 
              className="flex items-center space-x-2 hover:text-primary-200 transition-colors duration-200"
              aria-label="Email us"
            >
              <EnvelopeIcon className="h-4 w-4" />
              <span>info@constructpune.in</span>
            </a>
          </div>
          <div className="hidden lg:block">
            <span className="text-primary-200 font-medium">Build Your Dream Space Today</span>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white shadow-lg backdrop-blur-md' 
            : 'bg-white/95 backdrop-blur-sm'
        }`} 
        style={{ marginTop: window.innerWidth >= 768 ? '36px' : '0' }}
      >
        <div className="container-custom">
          <div className="flex justify-between items-center py-3 md:py-4">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-3 z-50 relative" 
              onClick={closeMenu}
              aria-label="ConstructPune Home"
            >
              <div className="bg-primary-600 text-white p-2 rounded-lg shadow-md">
                <svg className="h-6 w-6 md:h-8 md:w-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2zM5 5v14h14V5H5zm2 10h2v2H7v-2zm0-4h2v2H7v-2zm0-4h2v2H7V7zm4 8h2v2h-2v-2zm0-4h2v2h-2v-2zm0-4h2v2h-2V7zm4 8h2v2h-2v-2zm0-4h2v2h-2v-2zm0-4h2v2h-2V7z"/>
                </svg>
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-800">ConstructPune</h1>
                <p className="text-xs md:text-sm text-gray-600 leading-none">Since 2018</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`nav-link ${
                    isActive(link.path)
                      ? 'bg-primary-100 text-primary-700 font-semibold'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'
                  }`}
                  aria-current={isActive(link.path) ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* CTA Button - Desktop */}
            <div className="hidden lg:block">
              <Link
                to="/contact"
                className="btn-primary text-sm font-semibold"
              >
                Get Quote
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="lg:hidden p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200 z-50 relative"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Overlay */}
        {isOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={closeMenu}
            aria-hidden="true"
          />
        )}

        {/* Mobile Navigation Menu */}
        <div className={`lg:hidden fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="flex flex-col h-full">
            {/* Mobile header with contact info */}
            <div className="bg-primary-600 text-white p-4 pt-20">
              <div className="space-y-3">
                <a 
                  href="tel:+91-1234567890" 
                  className="flex items-center space-x-3 text-sm hover:text-primary-200 transition-colors"
                  onClick={closeMenu}
                >
                  <PhoneIcon className="h-4 w-4" />
                  <span>+91-1234567890</span>
                </a>
                <a 
                  href="mailto:info@constructpune.in" 
                  className="flex items-center space-x-3 text-sm hover:text-primary-200 transition-colors"
                  onClick={closeMenu}
                >
                  <EnvelopeIcon className="h-4 w-4" />
                  <span>info@constructpune.in</span>
                </a>
              </div>
            </div>

            {/* Mobile navigation links */}
            <div className="flex-1 overflow-y-auto py-6">
              <nav className="px-4 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={closeMenu}
                    className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                      isActive(link.path)
                        ? 'bg-primary-100 text-primary-700 font-semibold'
                        : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'
                    }`}
                    aria-current={isActive(link.path) ? 'page' : undefined}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Mobile CTA */}
            <div className="p-4 border-t border-gray-200">
              <Link
                to="/contact"
                onClick={closeMenu}
                className="btn-primary w-full text-center block"
              >
                Get Quote
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer for fixed navigation */}
      <div className={`${window.innerWidth >= 768 ? 'h-24 md:h-28' : 'h-16 md:h-20'}`}></div>
    </>
  );
};

export default Navbar;