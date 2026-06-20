import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { RefreshCw as Sync, CheckCircle, XCircle, AlertTriangle, Clock, GitBranch, Activity, Filter } from 'lucide-react';

const ArgoCDMonitoring = ({ data }) => {
  const [filterProject, setFilterProject] = useState('all');
  const [filterEnvironment, setFilterEnvironment] = useState('all');
  const [filterSyncStatus, setFilterSyncStatus] = useState('all');
  
  const projects = ['all', ...new Set(data.applications.map(app => app.project))];
  const environments = ['all', ...new Set(data.applications.map(app => app.environment))];
  const syncStatuses = ['all', 'Synced', 'OutOfSync'];
  
  const filteredApplications = data.applications.filter(app => {
    const matchesProject = filterProject === 'all' || app.project === filterProject;
    const matchesEnvironment = filterEnvironment === 'all' || app.environment === filterEnvironment;
    const matchesSyncStatus = filterSyncStatus === 'all' || app.syncStatus === filterSyncStatus;
    return matchesProject && matchesEnvironment && matchesSyncStatus;
  });
  
  const getSyncStatusColor = (status) => {
    switch (status) {
      case 'Synced': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'OutOfSync': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };
  
  const getHealthColor = (health) => {
    switch (health) {
      case 'Healthy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Degraded': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'Progressing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };
  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Hour: {label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Argo CD Monitoring</h2>
        <div className="flex items-center space-x-2">
          <Sync className={`w-4 h-4 ${data.automatedSyncEnabled ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`} />
          <span className={`text-sm ${data.automatedSyncEnabled ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
            Auto-sync {data.automatedSyncEnabled ? 'Enabled' : 'Disabled'}
          </span>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Total Applications</span>
            <GitBranch className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">{data.totalApplications}</p>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Synced</span>
            <CheckCircle className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-lg font-semibold text-green-600 dark:text-green-400">{data.syncedApplications}</p>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Out of Sync</span>
            <AlertTriangle className="w-4 h-4 text-gray-400" />
          </div>
          <p className={`text-lg font-semibold ${data.outOfSyncApplications > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-gray-900 dark:text-white'}`}>
            {data.outOfSyncApplications}
          </p>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Degraded</span>
            <XCircle className="w-4 h-4 text-gray-400" />
          </div>
          <p className={`text-lg font-semibold ${data.degradedApplications > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
            {data.degradedApplications}
          </p>
        </div>
      </div>
      
      {/* Sync Activity Chart */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">Sync Activity (12 Hours)</h3>
          <Activity className="w-4 h-4 text-gray-400" />
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data.syncActivity}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeOpacity={0.1} />
            <XAxis 
              dataKey="hour" 
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              stroke="#9ca3af"
            />
            <YAxis 
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              stroke="#9ca3af"
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={{ fill: '#3b82f6', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
              className="appearance-none pl-10 pr-8 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
            >
              {projects.map(project => (
                <option key={project} value={project}>{project === 'all' ? 'All Projects' : project}</option>
              ))}
            </select>
          </div>
          
          <div className="flex-1 relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={filterEnvironment}
              onChange={(e) => setFilterEnvironment(e.target.value)}
              className="appearance-none pl-10 pr-8 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
            >
              {environments.map(env => (
                <option key={env} value={env}>{env === 'all' ? 'All Environments' : env}</option>
              ))}
            </select>
          </div>
          
          <div className="flex-1 relative">
            <Sync className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={filterSyncStatus}
              onChange={(e) => setFilterSyncStatus(e.target.value)}
              className="appearance-none pl-10 pr-8 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
            >
              {syncStatuses.map(status => (
                <option key={status} value={status}>{status === 'all' ? 'All Sync Statuses' : status}</option>
              ))}
            </select>
          </div>
          
          <button className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Applications Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Application</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Project</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Environment</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Sync Status</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Health</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredApplications.map((app, index) => (
                <tr 
                  key={index} 
                  className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                    app.syncStatus === 'OutOfSync' ? 'bg-orange-50 dark:bg-orange-900/10' : ''
                  } ${app.health === 'Degraded' ? 'bg-red-50 dark:bg-red-900/10' : ''}`}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <GitBranch className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{app.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-600 dark:text-gray-300">{app.project}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-600 dark:text-gray-300">{app.environment}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`badge ${getSyncStatusColor(app.syncStatus)}`}>{app.syncStatus}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`badge ${getHealthColor(app.health)}`}>{app.health}</span>
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
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Last Sync</span>
            <Clock className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">{data.lastSyncTime}</p>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Failed Syncs</span>
            <XCircle className="w-4 h-4 text-gray-400" />
          </div>
          <p className={`text-lg font-semibold ${data.failedSyncCount > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
            {data.failedSyncCount}
          </p>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Sync Rate</span>
            <Activity className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-lg font-semibold text-green-600 dark:text-green-400">
            {((data.syncedApplications / data.totalApplications) * 100).toFixed(1)}%
          </p>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Health Rate</span>
            <CheckCircle className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-lg font-semibold text-green-600 dark:text-green-400">
            {(((data.totalApplications - data.degradedApplications) / data.totalApplications) * 100).toFixed(1)}%
          </p>
        </div>
      </div>
      
      {/* Alerts */}
      {data.outOfSyncApplications > 0 && (
        <div className="card">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Sync Alerts</h3>
          <div className="flex items-center space-x-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
              {data.outOfSyncApplications} application(s) out of sync
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArgoCDMonitoring;