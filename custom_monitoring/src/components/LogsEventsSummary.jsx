import React from 'react';
import { FileText, AlertTriangle, XCircle, Info, Search, Filter, Clock, Server, ExternalLink, ChevronRight } from 'lucide-react';

const LogsEventsSummary = ({ logs }) => {
  const getLogLevelColor = (level) => {
    switch (level) {
      case 'ERROR': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'WARN': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'INFO': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'DEBUG': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };
  
  const getLogLevelIcon = (level) => {
    switch (level) {
      case 'ERROR': return <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />;
      case 'WARN': return <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />;
      case 'INFO': return <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      default: return <FileText className="w-4 h-4 text-gray-600 dark:text-gray-400" />;
    }
  };
  
  const errorCount = logs.filter(l => l.level === 'ERROR').length;
  const warnCount = logs.filter(l => l.level === 'WARN').length;
  const infoCount = logs.filter(l => l.level === 'INFO').length;
  
  // Group logs by namespace for summary
  const logsByNamespace = logs.reduce((acc, log) => {
    if (!acc[log.namespace]) {
      acc[log.namespace] = { total: 0, errors: 0, warnings: 0 };
    }
    acc[log.namespace].total++;
    if (log.level === 'ERROR') acc[log.namespace].errors++;
    if (log.level === 'WARN') acc[log.namespace].warnings++;
    return acc;
  }, {});
  
  // Top error-producing pods
  const errorPods = logs
    .filter(l => l.level === 'ERROR')
    .reduce((acc, log) => {
      acc[log.pod] = (acc[log.pod] || 0) + 1;
      return acc;
    }, {});
  
  const topErrorPods = Object.entries(errorPods)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Logs & Events Summary</h2>
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-gray-500 dark:text-gray-400">{logs.length} recent entries</span>
        </div>
      </div>
      
      {/* Log Level Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card">
          <div className="flex items-center space-x-3">
            <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{errorCount}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Errors</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            <div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{warnCount}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Warnings</p>
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
      </div>
      
      {/* Recent Logs */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">Recent Log Entries</h3>
          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-1 text-sm text-blue-600 dark:text-blue-400 hover:underline">
              <span>View All Logs</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
        <div className="space-y-3">
          {logs.map((log) => (
            <div 
              key={log.id} 
              className={`p-3 rounded-lg border-l-4 ${
                log.level === 'ERROR' ? 'bg-red-50 dark:bg-red-900/10 border-red-500' :
                log.level === 'WARN' ? 'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-500' :
                'bg-blue-50 dark:bg-blue-900/10 border-blue-500'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="mt-0.5">
                    {getLogLevelIcon(log.level)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`badge ${getLogLevelColor(log.level)}`}>{log.level}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{log.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-900 dark:text-white mb-2">{log.message}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Server className="w-3 h-3" />
                        <span>{log.pod}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Server className="w-3 h-3" />
                        <span>{log.namespace}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400" title="View Context">
                    <Search className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400" title="Investigate">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Namespace Summary */}
      <div className="card">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Log Activity by Namespace</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(logsByNamespace).map(([namespace, stats]) => (
            <div key={namespace} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Server className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{namespace}</span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">{stats.total} entries</span>
              </div>
              <div className="flex items-center space-x-4 text-xs">
                <div className="flex items-center space-x-1">
                  <XCircle className="w-3 h-3 text-red-600 dark:text-red-400" />
                  <span className="text-gray-600 dark:text-gray-300">{stats.errors} errors</span>
                </div>
                <div className="flex items-center space-x-1">
                  <AlertTriangle className="w-3 h-3 text-yellow-600 dark:text-yellow-400" />
                  <span className="text-gray-600 dark:text-gray-300">{stats.warnings} warnings</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Top Error-Producing Pods */}
      {topErrorPods.length > 0 && (
        <div className="card">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Top Error-Producing Pods</h3>
          <div className="space-y-3">
            {topErrorPods.map(([pod, count], index) => (
              <div key={pod} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/10 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-6 h-6 bg-red-100 dark:bg-red-900 rounded-full">
                    <span className="text-xs font-medium text-red-600 dark:text-red-400">{index + 1}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{pod}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                  <span className="text-sm font-medium text-red-600 dark:text-red-400">{count} errors</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900 dark:text-white">View Raw Logs</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Access full log streams</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
          </button>
          
          <button className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <Search className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Search Events</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Query Kubernetes events</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
          </button>
          
          <button className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <Filter className="w-5 h-5 text-green-600 dark:text-green-400" />
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Advanced Filters</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Filter by time, namespace, level</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogsEventsSummary;