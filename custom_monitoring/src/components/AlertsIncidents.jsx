import React, { useState } from 'react';
import { AlertTriangle, XCircle, Info, Filter, CheckCircle, Clock, Search, Bell, Shield, Server, Activity, RefreshCw as Sync, GitBranch, Zap, Package } from 'lucide-react';

const AlertsIncidents = ({ alerts }) => {
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterAcknowledged, setFilterAcknowledged] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const severities = ['all', 'Critical', 'Warning', 'Info'];
  const acknowledgedStates = ['all', 'acknowledged', 'unacknowledged'];
  
  const filteredAlerts = alerts.filter(alert => {
    const matchesSeverity = filterSeverity === 'all' || alert.severity === filterSeverity;
    const matchesAcknowledged = filterAcknowledged === 'all' || 
      (filterAcknowledged === 'acknowledged' && alert.acknowledged) ||
      (filterAcknowledged === 'unacknowledged' && !alert.acknowledged);
    const matchesSearch = searchTerm === '' || 
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.namespace.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSeverity && matchesAcknowledged && matchesSearch;
  });
  
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Critical': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'Warning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Info': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };
  
  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'Critical': return <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />;
      case 'Warning': return <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />;
      case 'Info': return <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      default: return <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />;
    }
  };
  
  const getSourceIcon = (source) => {
    switch (source.toLowerCase()) {
      case 'kubernetes': return <Server className="w-4 h-4 text-gray-400" />;
      case 'prometheus': return <Activity className="w-4 h-4 text-gray-400" />;
      case 'argocd': return <Sync className="w-4 h-4 text-gray-400" />;
      case 'jenkins': return <GitBranch className="w-4 h-4 text-gray-400" />;
      case 'flask': return <Zap className="w-4 h-4 text-gray-400" />;
      case 'artifactory': return <Package className="w-4 h-4 text-gray-400" />;
      default: return <Shield className="w-4 h-4 text-gray-400" />;
    }
  };
  
  const criticalCount = alerts.filter(a => a.severity === 'Critical').length;
  const warningCount = alerts.filter(a => a.severity === 'Warning').length;
  const infoCount = alerts.filter(a => a.severity === 'Info').length;
  const unacknowledgedCount = alerts.filter(a => !a.acknowledged).length;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Alerts & Incidents</h2>
        <div className="flex items-center space-x-2">
          <Bell className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-gray-500 dark:text-gray-400">{filteredAlerts.length} active alerts</span>
        </div>
      </div>
      
      {/* Alert Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center space-x-3">
            <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{criticalCount}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Critical</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            <div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{warningCount}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Warning</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center space-x-3">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{infoCount}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Info</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            <div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{unacknowledgedCount}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Unacknowledged</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search alerts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="appearance-none pl-10 pr-8 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {severities.map(severity => (
                <option key={severity} value={severity}>{severity === 'all' ? 'All Severities' : severity}</option>
              ))}
            </select>
          </div>
          
          <div className="relative">
            <CheckCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={filterAcknowledged}
              onChange={(e) => setFilterAcknowledged(e.target.value)}
              className="appearance-none pl-10 pr-8 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {acknowledgedStates.map(state => (
                <option key={state} value={state}>
                  {state === 'all' ? 'All Status' : state.charAt(0).toUpperCase() + state.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.map((alert) => (
          <div 
            key={alert.id} 
            className={`card hover:shadow-md transition-shadow ${
              alert.severity === 'Critical' ? 'border-l-4 border-l-red-500' :
              alert.severity === 'Warning' ? 'border-l-4 border-l-yellow-500' :
              'border-l-4 border-l-blue-500'
            } ${alert.acknowledged ? 'opacity-60' : ''}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className="mt-1">
                  {getSeverityIcon(alert.severity)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">{alert.title}</h3>
                    <span className={`badge ${getSeverityColor(alert.severity)}`}>{alert.severity}</span>
                    {alert.acknowledged && (
                      <span className="badge bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Acknowledged
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      {getSourceIcon(alert.source)}
                      <span>{alert.source}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Server className="w-3 h-3" />
                      <span>{alert.namespace}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{alert.timestamp}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                {!alert.acknowledged && (
                  <button className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" title="Acknowledge">
                    <CheckCircle className="w-4 h-4" />
                  </button>
                )}
                <button className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" title="Investigate">
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Empty State */}
      {filteredAlerts.length === 0 && (
        <div className="card text-center py-12">
          <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No alerts found</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {searchTerm || filterSeverity !== 'all' || filterAcknowledged !== 'all' 
              ? 'Try adjusting your filters or search terms' 
              : 'All systems are operating normally'}
          </p>
        </div>
      )}
    </div>
  );
};

export default AlertsIncidents;