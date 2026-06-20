import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Package, HardDrive, Activity, TrendingUp, AlertTriangle, CheckCircle, Database, Upload, Download } from 'lucide-react';

const ArtifactoryMonitoring = ({ data }) => {
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
  
  const getRepoStatusColor = (status) => {
    switch (status) {
      case 'Healthy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Warning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Critical': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };
  
  const isStorageHigh = data.storagePercentage > 80;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Artifactory Monitoring</h2>
        <span className={`badge ${data.status === 'Healthy' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
          {data.status}
        </span>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Artifacts</span>
            <Package className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">{data.artifactCount.toLocaleString()}</p>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Storage Used</span>
            <HardDrive className="w-4 h-4 text-gray-400" />
          </div>
          <p className={`text-lg font-semibold ${isStorageHigh ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
            {data.storageUsed}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">of {data.storageTotal}</p>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Response Time</span>
            <Activity className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">{data.responseTime}ms</p>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Failure Rate</span>
            <AlertTriangle className="w-4 h-4 text-gray-400" />
          </div>
          <p className={`text-lg font-semibold ${data.failureRate > 0.1 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
            {data.failureRate}%
          </p>
        </div>
      </div>
      
      {/* Storage Usage */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">Storage Usage</h3>
          <Database className="w-4 h-4 text-gray-400" />
        </div>
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-300">{data.storageUsed} / {data.storageTotal}</span>
            <span className={`text-sm font-medium ${isStorageHigh ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
              {data.storagePercentage}%
            </span>
          </div>
          <div className="progress-bar">
            <div 
              className={`progress-fill ${isStorageHigh ? 'bg-red-500' : data.storagePercentage > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
              style={{ width: `${data.storagePercentage}%` }}
            />
          </div>
        </div>
      </div>
      
      {/* Activity Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">Upload Activity (24h)</h3>
            <Upload className="w-4 h-4 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={data.uploadActivity}>
              <defs>
                <linearGradient id="colorUpload" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient>
              </defs>
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
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#22c55e" 
                fillOpacity={1} 
                fill="url(#colorUpload)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">Download Activity (24h)</h3>
            <Download className="w-4 h-4 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={data.downloadActivity}>
              <defs>
                <linearGradient id="colorDownload" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
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
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#3b82f6" 
                fillOpacity={1} 
                fill="url(#colorDownload)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Repository Health */}
      <div className="card">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Repository Health</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.repositories.map((repo, index) => (
            <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Package className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{repo.name}</span>
                </div>
                <span className={`badge ${getRepoStatusColor(repo.status)}`}>{repo.status}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">{repo.type}</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{repo.artifacts.toLocaleString()} artifacts</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Availability</span>
            <CheckCircle className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-lg font-semibold text-green-600 dark:text-green-400">99.9%</p>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Avg Upload Speed</span>
            <Upload className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">45 MB/s</p>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Avg Download Speed</span>
            <Download className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">120 MB/s</p>
        </div>
      </div>
      
      {/* Storage Warning */}
      {isStorageHigh && (
        <div className="card">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Storage Warning</h3>
          <div className="flex items-center space-x-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
            <span className="text-sm font-medium text-red-700 dark:text-red-300">
              Storage usage is critical ({data.storagePercentage}%). Consider cleaning up old artifacts.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtifactoryMonitoring;