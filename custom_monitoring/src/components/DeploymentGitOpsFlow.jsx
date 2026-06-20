import React from 'react';
import { GitBranch, Clock, CheckCircle, XCircle, RefreshCw as Sync, Activity, Tag, Calendar, TrendingUp, AlertTriangle, PlayCircle, Server } from 'lucide-react';

const DeploymentGitOpsFlow = ({ data }) => {
  const getDeploymentStatusColor = (status) => {
    switch (status) {
      case 'Success': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Failed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'Rolled Back': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'InProgress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };
  
  const getDeploymentStatusIcon = (status) => {
    switch (status) {
      case 'Success': return <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case 'Failed': return <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />;
      case 'Rolled Back': return <RefreshCw className="w-4 h-4 text-orange-600 dark:text-orange-400" />;
      case 'InProgress': return <PlayCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      default: return <Activity className="w-4 h-4 text-gray-600 dark:text-gray-400" />;
    }
  };
  
  const successfulDeployments = data.deployments.filter(d => d.status === 'Success').length;
  const failedDeployments = data.deployments.filter(d => d.status === 'Failed').length;
  const rollbackDeployments = data.deployments.filter(d => d.status === 'Rolled Back').length;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Deployment & GitOps Flow</h2>
        <div className="flex items-center space-x-2">
          <GitBranch className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-gray-500 dark:text-gray-400">GitOps workflow monitoring</span>
        </div>
      </div>
      
      {/* Current Release Info */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">Current Release</h3>
          <Tag className="w-4 h-4 text-gray-400" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Version</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{data.currentRelease}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Last Deployment</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{data.lastSuccessfulDeployment}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Rollback Available</p>
            <span className={`inline-flex items-center ${data.rollbackAvailable ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
              {data.rollbackAvailable ? <CheckCircle className="w-4 h-4 mr-1" /> : <XCircle className="w-4 h-4 mr-1" />}
              {data.rollbackAvailable ? 'Yes' : 'No'}
            </span>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Release Health</p>
            <span className="text-sm font-medium text-green-600 dark:text-green-400">Healthy</span>
          </div>
        </div>
      </div>
      
      {/* Deployment Statistics */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            <div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{successfulDeployments}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Successful</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center space-x-3">
            <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{failedDeployments}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Failed</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center space-x-3">
            <RefreshCw className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            <div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{rollbackDeployments}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Rollbacks</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Deployment Timeline */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">Deployment Timeline</h3>
          <Calendar className="w-4 h-4 text-gray-400" />
        </div>
        <div className="space-y-4">
          {data.deployments.map((deployment, index) => (
            <div key={deployment.id} className="relative">
              {index !== data.deployments.length - 1 && (
                <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
              )}
              <div className="flex items-start space-x-4">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  deployment.status === 'Success' ? 'bg-green-100 dark:bg-green-900' :
                  deployment.status === 'Failed' ? 'bg-red-100 dark:bg-red-900' :
                  deployment.status === 'Rolled Back' ? 'bg-orange-100 dark:bg-orange-900' :
                  'bg-blue-100 dark:bg-blue-900'
                }`}>
                  {getDeploymentStatusIcon(deployment.status)}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{deployment.version}</span>
                      <span className={`badge ${getDeploymentStatusColor(deployment.status)}`}>
                        {deployment.status}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{deployment.timestamp}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Server className="w-3 h-3" />
                      <span>{deployment.environment}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{deployment.duration}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* GitOps Flow Visualization */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">GitOps Pipeline Status</h3>
          <Activity className="w-4 h-4 text-gray-400" />
        </div>
        <div className="flex items-center justify-between">
          {[
            { name: 'Git Push', status: 'completed', icon: GitBranch },
            { name: 'Jenkins Build', status: 'completed', icon: Activity },
            { name: 'Artifactory Push', status: 'completed', icon: Tag },
            { name: 'Argo CD Sync', status: 'completed', icon: RefreshCw },
            { name: 'Kubernetes Deploy', status: 'completed', icon: Server }
          ].map((step, index) => (
            <React.Fragment key={step.name}>
              <div className="flex flex-col items-center">
                <div className={`p-3 rounded-lg ${
                  step.status === 'completed' ? 'bg-green-100 dark:bg-green-900' :
                  step.status === 'in-progress' ? 'bg-blue-100 dark:bg-blue-900' :
                  'bg-gray-100 dark:bg-gray-700'
                }`}>
                  <step.icon className={`w-5 h-5 ${
                    step.status === 'completed' ? 'text-green-600 dark:text-green-400' :
                    step.status === 'in-progress' ? 'text-blue-600 dark:text-blue-400' :
                    'text-gray-400'
                  }`} />
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 text-center">{step.name}</p>
                <span className={`text-xs mt-1 ${
                  step.status === 'completed' ? 'text-green-600 dark:text-green-400' :
                  step.status === 'in-progress' ? 'text-blue-600 dark:text-blue-400' :
                  'text-gray-400'
                }`}>
                  {step.status === 'completed' ? '✓' : step.status === 'in-progress' ? '⟳' : '○'}
                </span>
              </div>
              {index < 4 && (
                <div className="flex-1 h-0.5 bg-green-500 mx-2" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      
      {/* Deployment Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Avg Deployment Time</span>
            <Clock className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">4m 32s</p>
          <div className="flex items-center space-x-1 mt-1">
            <TrendingUp className="w-3 h-3 text-green-600 dark:text-green-400" />
            <span className="text-xs text-green-600 dark:text-green-400">-12% vs last week</span>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Deployment Frequency</span>
            <Activity className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">3.2/day</p>
          <div className="flex items-center space-x-1 mt-1">
            <TrendingUp className="w-3 h-3 text-green-600 dark:text-green-400" />
            <span className="text-xs text-green-600 dark:text-green-400">+8% vs last week</span>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Success Rate</span>
            <CheckCircle className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">94.2%</p>
          <div className="flex items-center space-x-1 mt-1">
            <TrendingUp className="w-3 h-3 text-green-600 dark:text-green-400" />
            <span className="text-xs text-green-600 dark:text-green-400">+2% vs last week</span>
          </div>
        </div>
      </div>
      
      {/* Alerts */}
      {failedDeployments > 0 && (
        <div className="card">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Deployment Alerts</h3>
          <div className="flex items-center space-x-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
            <span className="text-sm font-medium text-red-700 dark:text-red-300">
              {failedDeployments} failed deployment(s) detected in the last 24 hours
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeploymentGitOpsFlow;