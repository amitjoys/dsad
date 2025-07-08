import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../contexts/AdminContext';
import axios from 'axios';
import {
  MagnifyingGlassIcon,
  ChartBarIcon,
  DocumentTextIcon,
  TagIcon,
  SparklesIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';

const AdminSEO = () => {
  const navigate = useNavigate();
  const { isAuthenticated, API_BASE_URL } = useAdmin();
  const [activeTab, setActiveTab] = useState('optimize');
  const [loading, setLoading] = useState(false);
  const [seoData, setSeoData] = useState([]);
  const [optimizationResult, setOptimizationResult] = useState(null);
  const [auditResult, setAuditResult] = useState(null);
  
  const [optimizeForm, setOptimizeForm] = useState({
    page_path: '',
    content: '',
    target_keywords: '',
  });

  const [auditPath, setAuditPath] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin');
      return;
    }
    if (activeTab === 'data') {
      fetchSEOData();
    }
  }, [isAuthenticated, navigate, activeTab]);

  const fetchSEOData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/admin/seo/data`);
      setSeoData(response.data);
    } catch (error) {
      console.error('Error fetching SEO data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOptimize = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const keywords = optimizeForm.target_keywords.split(',').map(k => k.trim()).filter(k => k);
      
      const response = await axios.post(`${API_BASE_URL}/api/admin/seo/optimize`, {
        page_path: optimizeForm.page_path,
        content: optimizeForm.content,
        target_keywords: keywords,
      });
      
      setOptimizationResult(response.data);
    } catch (error) {
      console.error('Error optimizing content:', error);
      alert('Error optimizing content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAudit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/admin/seo/audit/${encodeURIComponent(auditPath)}`);
      setAuditResult(response.data);
    } catch (error) {
      console.error('Error running audit:', error);
      alert('Error running SEO audit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="mr-4 p-2 rounded-md text-gray-400 hover:text-gray-600"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">SEO Management</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tabs */}
          <div className="mb-6">
            <nav className="flex space-x-8">
              {[
                { id: 'optimize', name: 'Content Optimization', icon: SparklesIcon },
                { id: 'audit', name: 'SEO Audit', icon: ChartBarIcon },
                { id: 'data', name: 'SEO Data', icon: DocumentTextIcon },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="h-5 w-5 mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Content Optimization Tab */}
          {activeTab === 'optimize' && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Content Optimization</h3>
                <p className="text-sm text-gray-500">Optimize your content for better search engine rankings</p>
              </div>
              <div className="p-6">
                <form onSubmit={handleOptimize} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Page Path
                    </label>
                    <input
                      type="text"
                      value={optimizeForm.page_path}
                      onChange={(e) => setOptimizeForm(prev => ({ ...prev, page_path: e.target.value }))}
                      placeholder="/services/painting-services"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content
                    </label>
                    <textarea
                      value={optimizeForm.content}
                      onChange={(e) => setOptimizeForm(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Enter the content you want to optimize..."
                      rows={8}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Keywords (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={optimizeForm.target_keywords}
                      onChange={(e) => setOptimizeForm(prev => ({ ...prev, target_keywords: e.target.value }))}
                      placeholder="painting services, interior painting, exterior painting"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? 'Optimizing...' : 'Optimize Content'}
                  </button>
                </form>

                {/* Optimization Results */}
                {optimizationResult && (
                  <div className="mt-8 space-y-6">
                    <h4 className="text-lg font-medium text-gray-900">Optimization Results</h4>
                    
                    {/* SEO Score */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-2">SEO Score</h5>
                        <div className={`text-3xl font-bold ${getScoreColor(optimizationResult.seo_score)}`}>
                          {optimizationResult.seo_score}/100
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-2">Readability Score</h5>
                        <div className={`text-3xl font-bold ${getScoreColor(optimizationResult.readability_score)}`}>
                          {optimizationResult.readability_score}/100
                        </div>
                      </div>
                    </div>

                    {/* Keyword Analysis */}
                    <div>
                      <h5 className="font-medium text-gray-900 mb-3">Keyword Analysis</h5>
                      <div className="space-y-2">
                        {Object.entries(optimizationResult.keyword_analysis).map(([keyword, data]) => (
                          <div key={keyword} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium">{keyword}</span>
                            <div className="text-right">
                              <div className="text-sm text-gray-600">Count: {data.count}</div>
                              <div className="text-sm text-gray-600">Density: {data.density}%</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Title Suggestions */}
                    <div>
                      <h5 className="font-medium text-gray-900 mb-3">Title Suggestions</h5>
                      <div className="space-y-2">
                        {optimizationResult.title_suggestions.map((title, index) => (
                          <div key={index} className="p-3 bg-blue-50 rounded-lg">
                            <div className="font-medium text-blue-900">{title}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Content Suggestions */}
                    {optimizationResult.content_suggestions.length > 0 && (
                      <div>
                        <h5 className="font-medium text-gray-900 mb-3">Content Suggestions</h5>
                        <div className="space-y-2">
                          {optimizationResult.content_suggestions.map((suggestion, index) => (
                            <div key={index} className="p-3 bg-yellow-50 rounded-lg">
                              <div className="text-yellow-800">{suggestion}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SEO Audit Tab */}
          {activeTab === 'audit' && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">SEO Audit</h3>
                <p className="text-sm text-gray-500">Run comprehensive SEO audit for any page</p>
              </div>
              <div className="p-6">
                <form onSubmit={handleAudit} className="mb-6">
                  <div className="flex gap-4">
                    <input
                      type="text"
                      value={auditPath}
                      onChange={(e) => setAuditPath(e.target.value)}
                      placeholder="Enter page path (e.g., /services/painting)"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors"
                    >
                      {loading ? 'Auditing...' : 'Run Audit'}
                    </button>
                  </div>
                </form>

                {/* Audit Results */}
                {auditResult && (
                  <div className="space-y-6">
                    <h4 className="text-lg font-medium text-gray-900">Audit Results for {auditResult.page_path}</h4>
                    
                    {/* Overall Scores */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-2">SEO Score</h5>
                        <div className={`text-3xl font-bold ${getScoreColor(auditResult.seo_score)}`}>
                          {auditResult.seo_score}/100
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-2">Performance Score</h5>
                        <div className={`text-3xl font-bold ${getScoreColor(auditResult.performance_score)}`}>
                          {auditResult.performance_score}/100
                        </div>
                      </div>
                    </div>

                    {/* Audit Checks */}
                    <div className="space-y-4">
                      {Object.entries(auditResult).filter(([key]) => key.endsWith('_check')).map(([checkType, checkData]) => (
                        <div key={checkType} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium text-gray-900 capitalize">
                              {checkType.replace('_check', '').replace('_', ' ')}
                            </h5>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(checkData.status)}`}>
                              {checkData.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{checkData.suggestion}</p>
                          {checkData.length && (
                            <p className="text-xs text-gray-500 mt-1">Length: {checkData.length} characters</p>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Recommendations */}
                    {auditResult.recommendations && (
                      <div>
                        <h5 className="font-medium text-gray-900 mb-3">Recommendations</h5>
                        <div className="space-y-2">
                          {auditResult.recommendations.map((rec, index) => (
                            <div key={index} className="p-3 bg-blue-50 rounded-lg">
                              <div className="text-blue-800">{rec}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SEO Data Tab */}
          {activeTab === 'data' && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">SEO Data</h3>
                <p className="text-sm text-gray-500">View and manage SEO data for all pages</p>
              </div>
              <div className="p-6">
                {loading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                  </div>
                ) : seoData.length > 0 ? (
                  <div className="space-y-4">
                    {seoData.map((data, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-900">{data.page_path}</h4>
                          <span className="text-sm text-gray-500">
                            {new Date(data.updated_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{data.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {data.keywords.map((keyword, idx) => (
                            <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No SEO data found</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSEO;