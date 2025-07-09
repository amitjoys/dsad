import React, { useState, useEffect } from 'react';
import { 
  CalculatorIcon, 
  MapPinIcon, 
  BuildingOfficeIcon, 
  CurrencyRupeeIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ShareIcon,
  PrinterIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';

const Calculator = () => {
  const [formData, setFormData] = useState({
    project_type: 'residential',
    area: '',
    location: 'pune',
    materials: [],
    labor_types: [],
    quality_level: 'standard',
    foundation_type: 'slab',
    roof_type: 'flat',
    wall_type: 'brick',
    electrical_complexity: 'basic',
    plumbing_complexity: 'basic',
    flooring_type: 'basic',
    finishing_level: 'standard',
    site_preparation: true,
    include_permits: true,
    include_transportation: true,
    building_height: 1,
    parking_spaces: 0,
    garden_area: 0.0
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [availableMaterials, setAvailableMaterials] = useState([]);
  const [availableLaborTypes, setAvailableLaborTypes] = useState([]);
  const [locations, setLocations] = useState([]);

  const projectTypes = [
    { value: 'residential', label: 'Residential House', icon: '🏠' },
    { value: 'commercial', label: 'Commercial Building', icon: '🏢' },
    { value: 'villa', label: 'Villa/Luxury Home', icon: '🏡' },
    { value: 'apartment', label: 'Apartment', icon: '🏢' },
    { value: 'office', label: 'Office Space', icon: '💼' },
    { value: 'warehouse', label: 'Warehouse', icon: '🏭' },
    { value: 'industrial', label: 'Industrial Building', icon: '🏭' },
    { value: 'retail', label: 'Retail Space', icon: '🏪' }
  ];

  const foundationTypes = [
    { value: 'slab', label: 'Slab Foundation', description: 'Concrete slab on grade' },
    { value: 'basement', label: 'Basement Foundation', description: 'Full basement construction' },
    { value: 'crawl_space', label: 'Crawl Space', description: 'Raised foundation with crawl space' }
  ];

  const roofTypes = [
    { value: 'flat', label: 'Flat Roof', description: 'Standard flat concrete roof' },
    { value: 'sloped', label: 'Sloped Roof', description: 'Sloped roof with tiles' },
    { value: 'tile', label: 'Tile Roof', description: 'Clay or concrete tiles' },
    { value: 'metal', label: 'Metal Roof', description: 'Metal roofing sheets' }
  ];

  const wallTypes = [
    { value: 'brick', label: 'Brick Wall', description: 'Traditional brick masonry' },
    { value: 'concrete', label: 'Concrete Wall', description: 'RCC concrete walls' },
    { value: 'wood_frame', label: 'Wood Frame', description: 'Wooden frame construction' }
  ];

  const complexityLevels = [
    { value: 'basic', label: 'Basic', description: 'Standard installation' },
    { value: 'advanced', label: 'Advanced', description: 'Premium features' },
    { value: 'smart_home', label: 'Smart Home', description: 'Smart automation' },
    { value: 'premium', label: 'Premium', description: 'High-end fixtures' },
    { value: 'luxury', label: 'Luxury', description: 'Luxury grade materials' }
  ];

  const qualityLevels = [
    { 
      value: 'standard', 
      label: 'Standard Quality', 
      description: 'Good quality materials with standard finishes',
      multiplier: '1.0x',
      color: 'bg-blue-50 border-blue-200'
    },
    { 
      value: 'premium', 
      label: 'Premium Quality', 
      description: 'High-quality materials with premium finishes',
      multiplier: '1.4x',
      color: 'bg-purple-50 border-purple-200'
    },
    { 
      value: 'luxury', 
      label: 'Luxury Quality', 
      description: 'Ultra-premium materials with luxury finishes',
      multiplier: '1.8x',
      color: 'bg-yellow-50 border-yellow-200'
    }
  ];

  useEffect(() => {
    fetchAvailableOptions();
  }, []);

  const fetchAvailableOptions = async () => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
      
      const [materialsRes, laborRes, locationsRes] = await Promise.all([
        axios.get(`${backendUrl}/api/calculator/materials`),
        axios.get(`${backendUrl}/api/calculator/labor-types`),
        axios.get(`${backendUrl}/api/calculator/locations`)
      ]);

      setAvailableMaterials(materialsRes.data);
      setAvailableLaborTypes(laborRes.data);
      setLocations(locationsRes.data);
    } catch (err) {
      console.error('Error fetching options:', err);
      setError('Failed to load calculator options. Please refresh the page.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleCheckboxChange = (e, field) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [field]: checked
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  const handleSelectAll = (field, allOptions) => {
    const currentSelection = formData[field];
    const allSelected = allOptions.every(option => currentSelection.includes(option));
    
    setFormData(prev => ({
      ...prev,
      [field]: allSelected ? [] : [...allOptions]
    }));
  };

  const validateForm = () => {
    if (!formData.area || parseFloat(formData.area) <= 0) {
      setError('Please enter a valid area greater than 0.');
      return false;
    }
    if (formData.materials.length === 0) {
      setError('Please select at least one material.');
      return false;
    }
    if (formData.labor_types.length === 0) {
      setError('Please select at least one labor type.');
      return false;
    }
    if (formData.building_height < 1 || formData.building_height > 10) {
      setError('Building height must be between 1 and 10 floors.');
      return false;
    }
    if (formData.parking_spaces < 0) {
      setError('Parking spaces cannot be negative.');
      return false;
    }
    if (formData.garden_area < 0) {
      setError('Garden area cannot be negative.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
      
      const response = await axios.post(`${backendUrl}/api/calculator/estimate`, {
        ...formData,
        area: parseFloat(formData.area),
        building_height: parseInt(formData.building_height),
        parking_spaces: parseInt(formData.parking_spaces),
        garden_area: parseFloat(formData.garden_area)
      });

      setResult(response.data);
      // Scroll to results section
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error calculating costs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const printResult = () => {
    window.print();
  };

  const shareResult = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Construction Cost Estimate',
        text: `Construction cost estimate: ${formatCurrency(result.total_cost)} for ${formData.area} sq ft in ${formData.location}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(
        `Construction cost estimate: ${formatCurrency(result.total_cost)} for ${formData.area} sq ft in ${formData.location}`
      );
      alert('Result copied to clipboard!');
    }
  };

  return (
    <div className="Calculator min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container-custom section-padding-sm">
          <div className="text-center">
            <CalculatorIcon className="h-12 w-12 md:h-16 md:w-16 mx-auto text-primary-600 mb-4" />
            <h1 className="heading-lg mb-4">
              Construction Cost Calculator
            </h1>
            <p className="body-lg text-gray-600 max-w-4xl mx-auto">
              Get accurate construction cost estimates with real-time material prices and labor costs. 
              Our calculator uses live data to provide precise estimates for your project.
            </p>
          </div>
        </div>
      </div>

      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12">
          {/* Calculator Form */}
          <div className="calculator-card">
            <h2 className="heading-md mb-6 flex items-center">
              <BuildingOfficeIcon className="h-6 w-6 mr-3 text-primary-600" />
              Project Details
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Project Type */}
              <div>
                <label className="form-label">Project Type</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {projectTypes.map(type => (
                    <label key={type.value} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 hover:border-primary-300 transition-all duration-200">
                      <input
                        type="radio"
                        name="project_type"
                        value={type.value}
                        checked={formData.project_type === type.value}
                        onChange={handleInputChange}
                        className="mr-3 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-lg mr-2">{type.icon}</span>
                      <span className="text-sm font-medium text-gray-700">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Area */}
              <div>
                <label className="form-label">Area (Square Feet)</label>
                <div className="relative">
                  <input
                    type="number"
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    className="calculator-input pr-12"
                    placeholder="Enter area in sq ft"
                    required
                    min="100"
                    max="50000"
                    step="1"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 text-sm">sq ft</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Minimum: 100 sq ft, Maximum: 50,000 sq ft</p>
              </div>

              {/* Location */}
              <div>
                <label className="form-label">Location</label>
                <div className="relative">
                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="calculator-select pr-10"
                    required
                  >
                    {locations.map(location => (
                      <option key={location.toLowerCase()} value={location.toLowerCase()}>
                        {location}
                      </option>
                    ))}
                  </select>
                  <MapPinIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Materials */}
              <div>
                <label className="form-label">Materials Required</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-3">
                  {availableMaterials.map(material => (
                    <label key={material} className="flex items-center p-2 rounded hover:bg-gray-50 transition-colors duration-200">
                      <input
                        type="checkbox"
                        value={material}
                        checked={formData.materials.includes(material)}
                        onChange={(e) => handleCheckboxChange(e, 'materials')}
                        className="mr-3 text-primary-600 focus:ring-primary-500 rounded"
                      />
                      <span className="text-sm capitalize text-gray-700">{material}</span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">Select all materials you'll need for your project</p>
              </div>

              {/* Labor Types */}
              <div>
                <label className="form-label">Labor Types Required</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-3">
                  {availableLaborTypes.map(labor => (
                    <label key={labor} className="flex items-center p-2 rounded hover:bg-gray-50 transition-colors duration-200">
                      <input
                        type="checkbox"
                        value={labor}
                        checked={formData.labor_types.includes(labor)}
                        onChange={(e) => handleCheckboxChange(e, 'labor_types')}
                        className="mr-3 text-primary-600 focus:ring-primary-500 rounded"
                      />
                      <span className="text-sm capitalize text-gray-700">{labor.replace('_', ' ')}</span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">Select all labor types required for your project</p>
              </div>

              {/* Quality Level */}
              <div>
                <label className="form-label">Quality Level</label>
                <div className="space-y-3">
                  {qualityLevels.map(level => (
                    <label key={level.value} className={`flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                      formData.quality_level === level.value 
                        ? `${level.color} border-current` 
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        name="quality_level"
                        value={level.value}
                        checked={formData.quality_level === level.value}
                        onChange={handleInputChange}
                        className="mt-1 mr-3 text-primary-600 focus:ring-primary-500"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800 mb-1">{level.label}</div>
                        <div className="text-sm text-gray-600 mb-2">{level.description}</div>
                        <div className="text-xs text-primary-700 font-semibold">Cost multiplier: {level.multiplier}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="loading-spinner mr-3"></div>
                    Calculating...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <CalculatorIcon className="h-5 w-5 mr-2" />
                    Calculate Cost
                  </div>
                )}
              </button>
            </form>

            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start">
                  <InformationCircleIcon className="h-5 w-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            )}
          </div>

          {/* Results */}
          <div id="results-section" className="space-y-6">
            {result ? (
              <>
                {/* Total Cost */}
                <div className="calculator-result">
                  <div className="text-center">
                    <CurrencyRupeeIcon className="h-12 w-12 mx-auto text-primary-600 mb-4" />
                    <h3 className="heading-md mb-4">Total Estimated Cost</h3>
                    <div className="text-4xl lg:text-5xl font-bold text-primary-700 mb-4">
                      {formatCurrency(result.total_cost)}
                    </div>
                    <p className="body-sm text-gray-600">
                      For {formData.area} sq ft {formData.project_type} in {formData.location}
                    </p>
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div className="cost-breakdown">
                  <h4 className="heading-sm mb-4 flex items-center">
                    <ChartBarIcon className="h-5 w-5 mr-2" />
                    Cost Breakdown
                  </h4>

                  <div className="space-y-3">
                    <div className="cost-item">
                      <span className="font-medium">Materials Cost</span>
                      <span className="font-semibold">{formatCurrency(result.breakdown.materials_subtotal)}</span>
                    </div>
                    <div className="cost-item">
                      <span className="font-medium">Labor Cost</span>
                      <span className="font-semibold">{formatCurrency(result.breakdown.labor_subtotal)}</span>
                    </div>
                    <div className="cost-item">
                      <span className="font-medium">Quality Level ({result.breakdown.quality_level})</span>
                      <span className="font-semibold">{result.breakdown.quality_multiplier}x</span>
                    </div>
                    <div className="cost-item">
                      <span className="font-medium">Overhead & Profit</span>
                      <span className="font-semibold">{formatCurrency(result.breakdown.overhead_profit)}</span>
                    </div>
                    <div className="cost-item border-t-2 border-primary-200 pt-3">
                      <span className="font-bold text-lg">Total Cost</span>
                      <span className="cost-total">{formatCurrency(result.total_cost)}</span>
                    </div>
                  </div>
                </div>

                {/* Material Costs */}
                <div className="cost-breakdown">
                  <h4 className="heading-sm mb-4">Material Costs</h4>
                  <div className="space-y-2">
                    {Object.entries(result.material_costs).map(([material, cost]) => (
                      <div key={material} className="cost-item">
                        <span className="capitalize font-medium">{material}</span>
                        <span className="font-semibold">{formatCurrency(cost.total_cost)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Labor Costs */}
                <div className="cost-breakdown">
                  <h4 className="heading-sm mb-4">Labor Costs</h4>
                  <div className="space-y-2">
                    {Object.entries(result.labor_costs).map(([labor, cost]) => (
                      <div key={labor} className="cost-item">
                        <span className="capitalize font-medium">{labor.replace('_', ' ')}</span>
                        <span className="font-semibold">{formatCurrency(cost.total_cost)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={printResult}
                    className="btn-secondary flex items-center justify-center no-print"
                  >
                    <PrinterIcon className="h-5 w-5 mr-2" />
                    Print Result
                  </button>
                  <button
                    onClick={shareResult}
                    className="btn-secondary flex items-center justify-center no-print"
                  >
                    <ShareIcon className="h-5 w-5 mr-2" />
                    Share Result
                  </button>
                </div>

                {/* Disclaimer */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <div className="flex items-start">
                    <InformationCircleIcon className="h-5 w-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <h5 className="font-semibold text-yellow-800 mb-1">Important Note</h5>
                      <p className="text-sm text-yellow-700">
                        This is an estimated cost based on current market rates. Actual costs may vary based on 
                        specific requirements, site conditions, and market fluctuations. Please contact us for 
                        a detailed quote.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="calculator-card text-center py-12">
                <CalculatorIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="heading-sm text-gray-600 mb-2">No Results Yet</h3>
                <p className="body-sm text-gray-500">
                  Fill out the form on the left to get your construction cost estimate.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <CheckCircleIcon className="h-8 w-8 text-green-500 mb-3" />
            <h4 className="font-bold text-gray-800 mb-2">Accurate Estimates</h4>
            <p className="text-gray-600 text-sm">
              Our calculator uses real-time market data to provide the most accurate cost estimates.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <MapPinIcon className="h-8 w-8 text-blue-500 mb-3" />
            <h4 className="font-bold text-gray-800 mb-2">Location-Based Pricing</h4>
            <p className="text-gray-600 text-sm">
              Prices are adjusted based on your location to account for local material and labor costs.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <DocumentTextIcon className="h-8 w-8 text-purple-500 mb-3" />
            <h4 className="font-bold text-gray-800 mb-2">Detailed Breakdown</h4>
            <p className="text-gray-600 text-sm">
              Get comprehensive cost breakdowns for materials, labor, and other project expenses.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;