import React from 'react';
import { FolderOpen, Server, AlertTriangle, CheckCircle, XCircle, Cpu, MemoryStick, Activity, Layers } from 'lucide-react';

const NamespaceHealth = ({ namespaces }) => {
  const getHealthColor = (failingPods, alertCount) => {
    if (failingPods > 0 || alertCount > 0) {
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    }
    return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
  };
  
  const getHealthStatus = (failingPods, alertCount) => {
    if (failingPods > 0 || alertCount > 0) {
      return 'Unhealthy';
    }
    return 'Healthy';
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Namespace Health</h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">{namespaces.length} namespaces</span>
      </div>
      
      {/* Namespace Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {namespaces.map((ns) => (
          <div key={ns.name} className="card hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <FolderOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{ns.name}</h3>
                  <span className={`badge ${getHealthColor(ns.failingPods, ns.alertCount)}`}>
                    {getHealthStatus(ns.failingPods, ns.alertCount)}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <Server className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">Pods</span>
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{ns.podCount}</p>
                {ns.failingPods > 0 && (
                  <p className="text-xs text-red-600 dark:text-red-400">{ns.failingPods} failing</p>
                )}
              </div>
              
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <Layers className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">Services</span>
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{ns.services}</p>
              </div>
              
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <Cpu className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">CPU</span>
                </div>
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{ns.cpuUsage}%</p>
                  <div className="w-12 progress-bar">
                    <div 
                      className={`progress-fill ${ns.cpuUsage > 80 ? 'bg-red-500' : ns.cpuUsage > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                      style={{ width: `${ns.cpuUsage}%` }}
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <MemoryStick className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">Memory</span>
                </div>
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{ns.memoryUsage}%</p>
                  <div className="w-12 progress-bar">
                    <div 
                      className={`progress-fill ${ns.memoryUsage > 80 ? 'bg-red-500' : ns.memoryUsage > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                      style={{ width: `${ns.memoryUsage}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Alerts */}
            {ns.alertCount > 0 && (
              <div className="flex items-center space-x-2 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                <span className="text-sm text-red-700 dark:text-red-300">{ns.alertCount} active alerts</span>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Summary Table */}
      <div className="card overflow-hidden">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Namespace Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Namespace</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pods</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Failing</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">CPU</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Memory</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Services</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Alerts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {namespaces.map((ns) => (
                <tr key={ns.name} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <FolderOpen className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{ns.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`badge ${getHealthColor(ns.failingPods, ns.alertCount)}`}>
                      {getHealthStatus(ns.failingPods, ns.alertCount)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-900 dark:text-white">{ns.podCount}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-sm font-medium ${ns.failingPods > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                      {ns.failingPods}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-900 dark:text-white">{ns.cpuUsage}%</span>
                      <div className="w-12 progress-bar">
                        <div 
                          className={`progress-fill ${ns.cpuUsage > 80 ? 'bg-red-500' : ns.cpuUsage > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                          style={{ width: `${ns.cpuUsage}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-900 dark:text-white">{ns.memoryUsage}%</span>
                      <div className="w-12 progress-bar">
                        <div 
                          className={`progress-fill ${ns.memoryUsage > 80 ? 'bg-red-500' : ns.memoryUsage > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                          style={{ width: `${ns.memoryUsage}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-900 dark:text-white">{ns.services}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-sm font-medium ${ns.alertCount > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                      {ns.alertCount}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Overall Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            <div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {namespaces.filter(ns => ns.failingPods === 0 && ns.alertCount === 0).length}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Healthy Namespaces</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            <div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {namespaces.filter(ns => ns.failingPods > 0 || ns.alertCount > 0).length}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Unhealthy Namespaces</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center space-x-3">
            <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {namespaces.reduce((acc, ns) => acc + ns.podCount, 0)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Pods</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center space-x-3">
            <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {namespaces.reduce((acc, ns) => acc + ns.failingPods, 0)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Failing Pods</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NamespaceHealth;