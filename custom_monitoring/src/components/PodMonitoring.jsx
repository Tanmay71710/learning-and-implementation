import React, { useState } from 'react';
import { Activity, Search, Filter, RefreshCw, FileText, AlertTriangle, CheckCircle, XCircle, Clock, Cpu, MemoryStick } from 'lucide-react';

const PodMonitoring = ({ pods }) => {
  const [filterNamespace, setFilterNamespace] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const namespaces = ['all', ...new Set(pods.map(p => p.namespace))];
  const statuses = ['all', 'Running', 'Pending', 'Failed', 'CrashLoopBackOff', 'OOMKilled'];
  
  const filteredPods = pods.filter(pod => {
    const matchesNamespace = filterNamespace === 'all' || pod.namespace === filterNamespace;
    const matchesStatus = filterStatus === 'all' || pod.status === filterStatus;
    const matchesSearch = searchTerm === '' || pod.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesNamespace && matchesStatus && matchesSearch;
  });
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'Running': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Failed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'CrashLoopBackOff': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'OOMKilled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };
  
  const getHealthColor = (health) => {
    switch (health) {
      case 'Healthy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Warning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Critical': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };
  
  const isCritical = (pod) => {
    return pod.status === 'Failed' || pod.status === 'CrashLoopBackOff' || pod.status === 'OOMKilled' || pod.restarts > 3;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Pod Monitoring</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <span>{filteredPods.length} of {pods.length} pods</span>
        </div>
      </div>
      
      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search pods..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Namespace Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={filterNamespace}
              onChange={(e) => setFilterNamespace(e.target.value)}
              className="appearance-none pl-10 pr-8 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {namespaces.map(ns => (
                <option key={ns} value={ns}>{ns === 'all' ? 'All Namespaces' : ns}</option>
              ))}
            </select>
          </div>
          
          {/* Status Filter */}
          <div className="relative">
            <Activity className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="appearance-none pl-10 pr-8 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status === 'all' ? 'All Statuses' : status}</option>
              ))}
            </select>
          </div>
          
          {/* Refresh */}
          <button className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Pod Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pod Name</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Namespace</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Restarts</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">CPU</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Memory</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Age</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ready</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Health</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredPods.map((pod) => (
                <tr 
                  key={pod.id} 
                  className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                    isCritical(pod) ? 'bg-red-50 dark:bg-red-900/10' : ''
                  }`}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      {isCritical(pod) && <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />}
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{pod.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-600 dark:text-gray-300">{pod.namespace}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`badge ${getStatusColor(pod.status)}`}>{pod.status}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-sm font-medium ${pod.restarts > 3 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                      {pod.restarts}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-900 dark:text-white">{pod.cpu.toFixed(2)}</span>
                      <div className="w-16 progress-bar">
                        <div 
                          className="progress-fill bg-blue-500" 
                          style={{ width: `${Math.min(pod.cpu * 20, 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-900 dark:text-white">{pod.memory.toFixed(0)}</span>
                      <div className="w-16 progress-bar">
                        <div 
                          className="progress-fill bg-purple-500" 
                          style={{ width: `${Math.min(pod.memory / 10, 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">{pod.age}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-900 dark:text-white">{pod.ready}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`badge ${getHealthColor(pod.health)}`}>{pod.health}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" title="View Logs">
                        <FileText className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" title="View Details">
                        <Activity className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            <div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{pods.filter(p => p.health === 'Healthy').length}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Healthy Pods</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            <div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{pods.filter(p => p.health === 'Warning').length}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Warning Pods</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center space-x-3">
            <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{pods.filter(p => p.health === 'Critical').length}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Critical Pods</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center space-x-3">
            <RefreshCw className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{pods.reduce((acc, p) => acc + p.restarts, 0)}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Restarts</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PodMonitoring;