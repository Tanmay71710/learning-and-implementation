import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { GitBranch, CheckCircle, XCircle, Clock, Server, Activity, TrendingUp, Users, PlayCircle, AlertTriangle } from 'lucide-react';

const JenkinsMonitoring = ({ data }) => {
  const buildTrendData = Array.from({ length: 7 }, (_, i) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
    successful: Math.floor(Math.random() * 20) + 10,
    failed: Math.floor(Math.random() * 5) + 1
  }));
  
  const successFailureData = [
    { name: 'Successful', value: data.successfulBuilds, color: '#22c55e' },
    { name: 'Failed', value: data.failedBuilds, color: '#ef4444' }
  ];
  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{label}</p>
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
  
  const getBuildStatusColor = (status) => {
    switch (status) {
      case 'Success': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Failed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Jenkins Monitoring</h2>
        <div className="flex items-center space-x-2">
          <Server className={`w-4 h-4 ${data.agentHealth === 'Healthy' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
          <span className={`text-sm ${data.agentHealth === 'Healthy' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {data.agentHealth}
          </span>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Total Builds</span>
            <GitBranch className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">{data.totalBuilds.toLocaleString()}</p>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Success Rate</span>
            <TrendingUp className="w-4 h-4 text-gray-400" />
          </div>
          <p className={`text-lg font-semibold ${data.successRate >= 80 ? 'text-green-600 dark:text-green-400' : data.successRate >= 60 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}>
            {data.successRate}%
          </p>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Avg Build Time</span>
            <Clock className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">{data.avgBuildTime}</p>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Executor Utilization</span>
            <Activity className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">{data.executorUtilization}%</p>
          <div className="mt-2 progress-bar">
            <div 
              className={`progress-fill ${data.executorUtilization > 80 ? 'bg-red-500' : data.executorUtilization > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
              style={{ width: `${data.executorUtilization}%` }}
            />
          </div>
        </div>
      </div>
      
      {/* Build Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            <div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{data.successfulBuilds}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Successful</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center space-x-3">
            <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{data.failedBuilds}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Failed</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center space-x-3">
            <PlayCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{data.runningJobs}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Running</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center space-x-3">
            <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{data.queueLength}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">In Queue</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">Build Trend (7 Days)</h3>
            <TrendingUp className="w-4 h-4 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={buildTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeOpacity={0.1} />
              <XAxis 
                dataKey="day" 
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                stroke="#9ca3af"
              />
              <YAxis 
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                stroke="#9ca3af"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="successful" stackId="a" fill="#22c55e" />
              <Bar dataKey="failed" stackId="a" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">Success vs Failure</h3>
            <GitBranch className="w-4 h-4 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={successFailureData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {successFailureData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Latest Build */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">Latest Build</h3>
          <span className={`badge ${getBuildStatusColor(data.latestBuild.status)}`}>
            {data.latestBuild.status}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Build Number</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">#{data.latestBuild.number}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Duration</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{data.latestBuild.duration}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Timestamp</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{data.latestBuild.timestamp}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Status</p>
            <span className={`badge ${getBuildStatusColor(data.latestBuild.status)}`}>
              {data.latestBuild.status}
            </span>
          </div>
        </div>
      </div>
      
      {/* Recent Build History */}
      <div className="card overflow-hidden">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Recent Build History</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Build</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Job</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {data.recentBuilds.map((build, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="py-3 px-4">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">#{build.number}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-600 dark:text-gray-300">{build.job}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`badge ${getBuildStatusColor(build.status)}`}>{build.status}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-900 dark:text-white">{build.duration}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Alerts */}
      {(data.failedJobs > 0 || data.queueLength > 5) && (
        <div className="card">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Alerts</h3>
          <div className="space-y-3">
            {data.failedJobs > 0 && (
              <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                  <span className="text-sm font-medium text-red-700 dark:text-red-300">{data.failedJobs} failed jobs detected</span>
                </div>
              </div>
            )}
            {data.queueLength > 5 && (
              <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                  <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">Build queue length is high ({data.queueLength})</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JenkinsMonitoring;