import React from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Server, Cpu, MemoryStick, HardDrive, CheckCircle, XCircle, Activity, Database, Globe } from 'lucide-react';

const ClusterHealth = ({ data }) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };
  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{formatTime(label)}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toFixed(1)}%
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
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Cluster Health</h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">{data.clusterName}</span>
      </div>
      
      {/* Cluster Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Status</span>
            <Server className="w-4 h-4 text-gray-400" />
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${data.status === 'Healthy' ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className={`text-lg font-semibold ${data.status === 'Healthy' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {data.status}
            </span>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Nodes</span>
            <Server className="w-4 h-4 text-gray-400" />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-lg font-semibold text-gray-900 dark:text-white">{data.nodes.ready}/{data.nodes.total}</span>
            {data.nodes.notReady > 0 && (
              <span className="text-xs text-red-600 dark:text-red-400">({data.nodes.notReady} not ready)</span>
            )}
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Storage</span>
            <HardDrive className="w-4 h-4 text-gray-400" />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-lg font-semibold text-gray-900 dark:text-white">{data.storage.percentage}%</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{data.storage.used}/{data.storage.total}</span>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Control Plane</span>
            <Activity className="w-4 h-4 text-gray-400" />
          </div>
          <span className="text-lg font-semibold text-green-600 dark:text-green-400">Healthy</span>
        </div>
      </div>
      
      {/* CPU and Memory Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">CPU Usage Trend</h3>
            <Cpu className="w-4 h-4 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={data.cpuUsage}>
              <defs>
                <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
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
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#3b82f6" 
                fillOpacity={1} 
                fill="url(#colorCpu)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">Memory Usage Trend</h3>
            <MemoryStick className="w-4 h-4 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={data.memoryUsage}>
              <defs>
                <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
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
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#8b5cf6" 
                fillOpacity={1} 
                fill="url(#colorMemory)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Pod Count Trend */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">Pod Count Trend</h3>
          <Activity className="w-4 h-4 text-gray-400" />
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data.podCount}>
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
              stroke="#10b981" 
              strokeWidth={2}
              dot={{ fill: '#10b981', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Control Plane Health */}
      <div className="card">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Control Plane Health</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">API Server</p>
              <p className="text-xs text-green-600 dark:text-green-400">{data.controlPlane.apiServer}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">etcd</p>
              <p className="text-xs text-green-600 dark:text-green-400">{data.controlPlane.etcd}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Scheduler</p>
              <p className="text-xs text-green-600 dark:text-green-400">{data.controlPlane.scheduler}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Controller</p>
              <p className="text-xs text-green-600 dark:text-green-400">{data.controlPlane.controllerManager}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Capacity and Saturation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Capacity Indicators</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs text-gray-500 dark:text-gray-400">CPU Capacity</span>
                <span className="text-xs text-gray-900 dark:text-white">45%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill bg-blue-500" style={{ width: '45%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs text-gray-500 dark:text-gray-400">Memory Capacity</span>
                <span className="text-xs text-gray-900 dark:text-white">62%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill bg-purple-500" style={{ width: '62%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs text-gray-500 dark:text-gray-400">Storage Capacity</span>
                <span className="text-xs text-gray-900 dark:text-white">{data.storage.percentage}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill bg-orange-500" style={{ width: `${data.storage.percentage}%` }} />
              </div>
            </div>
          </div>
        </div>
        
        <div className="card">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Saturation Indicators</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Database className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-500 dark:text-gray-400">Disk Pressure</span>
              </div>
              <span className="text-xs text-green-600 dark:text-green-400">Normal</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MemoryStick className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-500 dark:text-gray-400">Memory Pressure</span>
              </div>
              <span className="text-xs text-green-600 dark:text-green-400">Normal</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-500 dark:text-gray-400">CPU Pressure</span>
              </div>
              <span className="text-xs text-green-600 dark:text-green-400">Normal</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-500 dark:text-gray-400">Network Pressure</span>
              </div>
              <span className="text-xs text-green-600 dark:text-green-400">Normal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClusterHealth;