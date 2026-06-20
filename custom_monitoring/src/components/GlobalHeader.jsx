import React from 'react';
import { Activity, AlertTriangle, RefreshCw, Search, RefreshCw as Sync, Clock, Server, Shield, ChevronDown } from 'lucide-react';

const GlobalHeader = ({ 
  projectName, 
  healthScore, 
  clusterStatus, 
  activeAlerts, 
  criticalIssues, 
  syncIssues,
  onRefresh,
  onEnvironmentChange,
  currentEnvironment,
  lastUpdated,
  onSearch
}) => {
  const environments = ['dev', 'staging', 'production'];
  
  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section - Project Name and Health */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">{projectName}</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">GitOps Platform</p>
            </div>
          </div>
          
          {/* Health Score */}
          <div className="hidden md:flex items-center space-x-2 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-lg">
            <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-green-700 dark:text-green-300">
              Health: {healthScore}%
            </span>
          </div>
          
          {/* Cluster Status */}
          <div className="hidden lg:flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-lg">
            <Server className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              {clusterStatus}
            </span>
          </div>
        </div>
        
        {/* Center Section - Environment Selector */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <select 
              value={currentEnvironment}
              onChange={(e) => onEnvironmentChange(e.target.value)}
              className="appearance-none bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
            >
              {environments.map(env => (
                <option key={env} value={env}>{env.charAt(0).toUpperCase() + env.slice(1)}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
        </div>
        
        {/* Right Section - Alerts and Controls */}
        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <div className="hidden md:flex items-center relative">
            <Search className="absolute left-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              onChange={(e) => onSearch(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-48"
            />
          </div>
          
          {/* Alert Indicators */}
          <div className="flex items-center space-x-2">
            {activeAlerts > 0 && (
              <div className="flex items-center space-x-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                <span className="text-xs font-medium text-yellow-700 dark:text-yellow-300">{activeAlerts}</span>
              </div>
            )}
            {criticalIssues > 0 && (
              <div className="flex items-center space-x-1 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                <span className="text-xs font-medium text-red-700 dark:text-red-300">{criticalIssues}</span>
              </div>
            )}
            {syncIssues > 0 && (
              <div className="flex items-center space-x-1 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded-lg">
                <Sync className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                <span className="text-xs font-medium text-orange-700 dark:text-orange-300">{syncIssues}</span>
              </div>
            )}
          </div>
          
          {/* Refresh Button */}
          <button 
            onClick={onRefresh}
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Refresh data"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          
          {/* Last Updated */}
          <div className="hidden lg:flex items-center space-x-1 text-gray-500 dark:text-gray-400">
            <Clock className="w-4 h-4" />
            <span className="text-xs">{lastUpdated}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default GlobalHeader;