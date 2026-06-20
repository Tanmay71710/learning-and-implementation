import React from 'react';
import { Server, HardDrive, Cpu, MemoryStick, CheckCircle, AlertTriangle, XCircle, Activity, RefreshCw as Sync, GitBranch, Package, Zap, TrendingUp, TrendingDown } from 'lucide-react';

const SummaryCard = ({ title, value, subtitle, icon: Icon, trend, trendValue, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    yellow: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400',
    red: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
    purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
    orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
  };
  
  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <div className={`flex items-center text-xs ${trend === 'up' ? 'text-red-600' : 'text-green-600'}`}>
            {trend === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
            {trendValue}
          </div>
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{value}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      {subtitle && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
};

const OverviewDashboard = ({ data }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Overview Dashboard</h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">Platform-wide summary</span>
      </div>
      
      {/* Infrastructure Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard 
          title="Total Clusters" 
          value={data.totalClusters} 
          subtitle="Across all environments"
          icon={Server}
          color="blue"
        />
        <SummaryCard 
          title="Namespaces" 
          value={data.totalNamespaces} 
          subtitle="Active namespaces"
          icon={HardDrive}
          color="purple"
        />
        <SummaryCard 
          title="Running Pods" 
          value={data.runningPods} 
          subtitle={`${data.warningPods} warning, ${data.failedPods} failed`}
          icon={CheckCircle}
          color="green"
        />
        <SummaryCard 
          title="Total Pods" 
          value={data.totalPods} 
          subtitle="All pod states"
          icon={Activity}
          color="blue"
        />
      </div>
      
      {/* Resource Utilization */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard 
          title="CPU Usage" 
          value={`${data.cpuUsage}%`} 
          subtitle="Cluster-wide utilization"
          icon={Cpu}
          color="orange"
          trend="up"
          trendValue="+2.3%"
        />
        <SummaryCard 
          title="Memory Usage" 
          value={`${data.memoryUsage}%`} 
          subtitle="Cluster-wide utilization"
          icon={MemoryStick}
          color="orange"
          trend="up"
          trendValue="+1.8%"
        />
        <SummaryCard 
          title="Healthy Deployments" 
          value={`${data.deploymentsHealthy}/${data.deploymentsTotal}`} 
          subtitle="Deployment health"
          icon={CheckCircle}
          color="green"
        />
        <SummaryCard 
          title="Failed Pods" 
          value={data.failedPods} 
          subtitle="Requires attention"
          icon={XCircle}
          color="red"
          trend={data.failedPods > 0 ? 'up' : 'down'}
          trendValue={data.failedPods > 0 ? '+1' : '0'}
        />
      </div>
      
      {/* Application Health */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard 
          title="ArgoCD Synced" 
          value={`${data.argocdSynced}/${data.argocdSynced + data.argocdOutOfSync}`} 
          subtitle={`${data.argocdOutOfSync} out of sync`}
          icon={Sync}
          color={data.argocdOutOfSync > 0 ? 'yellow' : 'green'}
        />
        <SummaryCard 
          title="Jenkins Success Rate" 
          value={`${data.jenkinsSuccessRate}%`} 
          subtitle="Build success rate"
          icon={GitBranch}
          color="green"
          trend="up"
          trendValue="+0.5%"
        />
        <SummaryCard 
          title="Artifactory Availability" 
          value={`${data.artifactoryAvailability}%`} 
          subtitle="Service uptime"
          icon={Package}
          color="green"
        />
        <SummaryCard 
          title="Flask App Status" 
          value={data.flaskAppStatus} 
          subtitle="Application health"
          icon={Zap}
          color={data.flaskAppStatus === 'Healthy' ? 'green' : 'red'}
        />
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{data.runningPods}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Healthy Pods</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{data.warningPods}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Warning Pods</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{data.failedPods}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Failed Pods</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{data.totalPods}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Pods</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewDashboard;