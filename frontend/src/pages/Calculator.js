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
    quality_level: 'standard'
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
    { value: 'warehouse', label: 'Warehouse', icon: '🏭' }
  ];

  const qualityLevels = [
    { 
      value: 'standard', 
      label: 'Standard Quality', 
      description: 'Good quality materials with standard finishes',
      multiplier: '1.0x'
    },
    { 
      value: 'premium', 
      label: 'Premium Quality', 
      description: 'High-quality materials with premium finishes',
      multiplier: '1.4x'
    },
    { 
      value: 'luxury', 
      label: 'Luxury Quality', 
      description: 'Ultra-premium materials with luxury finishes',
      multiplier: '1.8x'
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
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
      
      const response = await axios.post(`${backendUrl}/api/calculator/estimate`, {
        ...formData,
        area: parseFloat(formData.area)
      });

      setResult(response.data);
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
        <div className="container-custom py-8">
          <div className="text-center">
            <CalculatorIcon className="h-16 w-16 mx-auto text-primary-600 mb-4" />
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Construction Cost Calculator
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get accurate construction cost estimates with real-time material prices and labor costs. 
              Our calculator uses live data to provide precise estimates for your project.
            </p>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator Form */}
          <div className="calculator-card">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <BuildingOfficeIcon className="h-6 w-6 mr-2 text-primary-600" />
              Project Details
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Project Type */}
              <div>
                <label className="form-label">Project Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {projectTypes.map(type => (
                    <label key={type.value} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="project_type"
                        value={type.value}
                        checked={formData.project_type === type.value}
                        onChange={handleInputChange}
                        className="mr-3"
                      />
                      <span className="text-lg mr-2">{type.icon}</span>
                      <span className="text-sm font-medium">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Area */}
              <div>
                <label className="form-label">Area (Square Feet)</label>
                <input
                  type="number"
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  className="calculator-input"
                  placeholder="Enter area in sq ft"
                  required
                  min="100"
                  max="50000"
                />
              </div>

              {/* Location */}
              <div>
                <label className="form-label">Location</label>
                <div className="relative">
                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="calculator-select"
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
                <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                  {availableMaterials.map(material => (
                    <label key={material} className="flex items-center p-2 border rounded hover:bg-gray-50">
                      <input
                        type="checkbox"
                        value={material}
                        checked={formData.materials.includes(material)}
                        onChange={(e) => handleCheckboxChange(e, 'materials')}
                        className="mr-2"
                      />
                      <span className="text-sm capitalize">{material}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Labor Types */}
              <div>
                <label className="form-label">Labor Types Required</label>
                <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                  {availableLaborTypes.map(labor => (
                    <label key={labor} className="flex items-center p-2 border rounded hover:bg-gray-50">
                      <input
                        type="checkbox"
                        value={labor}
                        checked={formData.labor_types.includes(labor)}
                        onChange={(e) => handleCheckboxChange(e, 'labor_types')}
                        className="mr-2"
                      />
                      <span className="text-sm capitalize">{labor.replace('_', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Quality Level */}
              <div>
                <label className="form-label">Quality Level</label>
                <div className="space-y-3">
                  {qualityLevels.map(level => (
                    <label key={level.value} className="flex items-start p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="quality_level"
                        value={level.value}
                        checked={formData.quality_level === level.value}
                        onChange={handleInputChange}
                        className="mt-1 mr-3"
                      />
                      <div>
                        <div className="font-medium text-gray-800">{level.label}</div>
                        <div className="text-sm text-gray-600">{level.description}</div>
                        <div className="text-xs text-primary-600 font-medium">Cost multiplier: {level.multiplier}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-4 text-lg"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="loading-spinner mr-2"></div>
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
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{error}</p>
              </div>
            )}
          </div>

          {/* Results */}
          <div className="space-y-6">
            {result ? (
              <>
                {/* Total Cost */}
                <div className="calculator-result">
                  <div className="text-center">
                    <CurrencyRupeeIcon className="h-12 w-12 mx-auto text-primary-600 mb-4" />
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Total Estimated Cost</h3>
                    <div className="text-4xl font-bold text-primary-600 mb-2">
                      {formatCurrency(result.total_cost)}
                    </div>
                    <p className="text-gray-600">
                      For {formData.area} sq ft {formData.project_type} in {formData.location}
                    </p>
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div className="cost-breakdown">
                  <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <ChartBarIcon className="h-5 w-5 mr-2" />
                    Cost Breakdown
                  </h4>

                  <div className="space-y-3">
                    <div className="cost-item">
                      <span>Materials Cost</span>
                      <span className="font-semibold">{formatCurrency(result.breakdown.materials_subtotal)}</span>
                    </div>
                    <div className="cost-item">
                      <span>Labor Cost</span>
                      <span className="font-semibold">{formatCurrency(result.breakdown.labor_subtotal)}</span>
                    </div>
                    <div className="cost-item">
                      <span>Quality Level ({result.breakdown.quality_level})</span>
                      <span className="font-semibold">{result.breakdown.quality_multiplier}x</span>
                    </div>
                    <div className="cost-item">
                      <span>Overhead & Profit</span>
                      <span className="font-semibold">{formatCurrency(result.breakdown.overhead_profit)}</span>
                    </div>
                    <div className="cost-item border-t-2 border-primary-200 pt-2">
                      <span className="font-bold">Total Cost</span>
                      <span className="cost-total">{formatCurrency(result.total_cost)}</span>
                    </div>
                  </div>
                </div>

                {/* Material Costs */}
                <div className="cost-breakdown">
                  <h4 className="text-lg font-bold text-gray-800 mb-4">Material Costs</h4>
                  <div className="space-y-2">
                    {Object.entries(result.material_costs).map(([material, cost]) => (
                      <div key={material} className="cost-item">
                        <span className="capitalize">{material}</span>
                        <span className="font-semibold">{formatCurrency(cost.total_cost)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Labor Costs */}
                <div className="cost-breakdown">
                  <h4 className="text-lg font-bold text-gray-800 mb-4">Labor Costs</h4>
                  <div className="space-y-2">
                    {Object.entries(result.labor_costs).map(([labor, cost]) => (
                      <div key={labor} className="cost-item">
                        <span className="capitalize">{labor.replace('_', ' ')}</span>
                        <span className="font-semibold">{formatCurrency(cost.total_cost)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={printResult}
                    className="btn-secondary flex items-center justify-center"
                  >
                    <PrinterIcon className="h-5 w-5 mr-2" />
                    Print Result
                  </button>
                  <button
                    onClick={shareResult}
                    className="btn-secondary flex items-center justify-center"
                  >
                    <ShareIcon className="h-5 w-5 mr-2" />
                    Share Result
                  </button>
                </div>

                {/* Disclaimer */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <InformationCircleIcon className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                    <div>
                      <h5 className="font-medium text-yellow-800">Important Note</h5>
                      <p className="text-sm text-yellow-700 mt-1">
                        This is an estimated cost based on current market rates. Actual costs may vary based on 
                        specific requirements, site conditions, and market fluctuations. Please contact us for 
                        a detailed quote.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="calculator-card text-center">
                <CalculatorIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-bold text-gray-600 mb-2">No Results Yet</h3>
                <p className="text-gray-500">
                  Fill out the form on the left to get your construction cost estimate.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <CheckCircleIcon className="h-8 w-8 text-green-500 mb-3" />
            <h4 className="font-bold text-gray-800 mb-2">Accurate Estimates</h4>
            <p className="text-gray-600 text-sm">
              Our calculator uses real-time market data to provide the most accurate cost estimates.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <MapPinIcon className="h-8 w-8 text-blue-500 mb-3" />
            <h4 className="font-bold text-gray-800 mb-2">Location-Based Pricing</h4>
            <p className="text-gray-600 text-sm">
              Prices are adjusted based on your location to account for local material and labor costs.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
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