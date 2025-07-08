import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../contexts/AdminContext';
import axios from 'axios';
import {
  UsersIcon,
  EnvelopeIcon,
  CalculatorIcon,
  CogIcon,
  ArrowRightIcon,
  HomeIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { admin, isAuthenticated, logout, API_BASE_URL } = useAdmin();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin');
      return;
    }
    fetchStats();
  }, [isAuthenticated, navigate]);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin/dashboard/stats`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  const statCards = [
    {
      name: 'Total Users',
      value: stats?.total_users || 0,
      icon: UsersIcon,
      color: 'bg-blue-500',
      href: '/admin/users',
    },
    {
      name: 'Contact Submissions',
      value: stats?.total_contacts || 0,
      icon: EnvelopeIcon,
      color: 'bg-green-500',
      href: '/admin/contacts',
    },
    {
      name: 'Cost Calculations',
      value: stats?.total_calculations || 0,
      icon: CalculatorIcon,
      color: 'bg-purple-500',
      href: '/admin/calculations',
    },
    {
      name: 'Service Pages',
      value: stats?.total_services || 0,
      icon: CogIcon,
      color: 'bg-orange-500',
      href: '/admin/services',
    },
  ];

  const adminMenuItems = [
    {
      name: 'SEO Management',
      description: 'Optimize pages for search engines',
      icon: ChartBarIcon,
      href: '/admin/seo',
      color: 'bg-indigo-500',
    },
    {
      name: 'Service Pages',
      description: 'Manage service pages content',
      icon: CogIcon,
      href: '/admin/services',
      color: 'bg-blue-500',
    },
    {
      name: 'User Management',
      description: 'View and manage users',
      icon: UsersIcon,
      href: '/admin/users',
      color: 'bg-green-500',
    },
    {
      name: 'Back to Website',
      description: 'Return to main website',
      icon: HomeIcon,
      href: '/',
      color: 'bg-gray-500',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Welcome, {admin?.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Stats Grid */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Overview</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {statCards.map((stat) => (
                <div
                  key={stat.name}
                  className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(stat.href)}
                >
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className={`${stat.color} p-3 rounded-md`}>
                          <stat.icon className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            {stat.name}
                          </dt>
                          <dd className="text-3xl font-semibold text-gray-900">
                            {stat.value}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Admin Menu */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Admin Tools</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {adminMenuItems.map((item) => (
                <div
                  key={item.name}
                  className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-md transition-shadow group"
                  onClick={() => navigate(item.href)}
                >
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className={`${item.color} p-3 rounded-md group-hover:scale-110 transition-transform`}>
                          <item.icon className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                      <ArrowRightIcon className="h-5 w-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Contacts */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Contacts</h3>
              </div>
              <div className="p-6">
                {stats?.recent_contacts?.length > 0 ? (
                  <div className="space-y-4">
                    {stats.recent_contacts.map((contact, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{contact.name}</p>
                          <p className="text-sm text-gray-500">{contact.email}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">
                            {new Date(contact.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No recent contacts</p>
                )}
              </div>
            </div>

            {/* Recent Calculations */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Calculations</h3>
              </div>
              <div className="p-6">
                {stats?.recent_calculations?.length > 0 ? (
                  <div className="space-y-4">
                    {stats.recent_calculations.map((calc, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            ₹{calc.total_cost?.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-500">{calc.location}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">
                            {new Date(calc.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No recent calculations</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;