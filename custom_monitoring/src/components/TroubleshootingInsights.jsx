import React from 'react';
import { AlertTriangle, XCircle, AlertCircle, Info, Lightbulb, Zap, Server, Activity, CheckCircle, ExternalLink, ChevronRight } from 'lucide-react';

const TroubleshootingInsights = ({ insights }) => {
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Critical': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-300 dark:border-red-700';
      case 'Warning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700';
      case 'Info': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-300 dark:border-blue-700';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-700';
    }
  };
  
  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'Critical': return <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />;
      case 'Warning': return <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />;
      case 'Info': return <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />;
    }
  };
  
  const getSeverityBg = (severity) => {
    switch (severity) {
      case 'Critical': return 'bg-red-50 dark:bg-red-900/10 border-l-4 border-l-red-500';
      case 'Warning': return 'bg-yellow-50 dark:bg-yellow-900/10 border-l-4 border-l-yellow-500';
      case 'Info': return 'bg-blue-50 dark:bg-blue-900/10 border-l-4 border-l-blue-500';
      default: return 'bg-gray-50 dark:bg-gray-700 border-l-4 border-l-gray-500';
    }
  };
  
  const criticalCount = insights.filter(i => i.severity === 'Critical').length;
  const warningCount = insights.filter(i => i.severity === 'Warning').length;
  const infoCount = insights.filter(i => i.severity === 'Info').length;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Troubleshooting Insights</h2>
        <div className="flex items-center space-x-2">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          <span className="text-sm text-gray-500 dark:text-gray-400">AI-powered issue detection</span>
        </div>
      </div>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card">
          <div className="flex items-center space-x-3">
            <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{criticalCount}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Critical Issues</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            <div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{warningCount}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Warnings</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center space-x-3">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{infoCount}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Recommendations</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Insights Cards */}
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <div 
            key={insight.id} 
            className={`card hover:shadow-md transition-shadow ${getSeverityBg(insight.severity)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className="mt-1">
                  {getSeverityIcon(insight.severity)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">{insight.title}</h3>
                    <span className={`badge ${getSeverityColor(insight.severity)}`}>{insight.severity}</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Likely Cause</p>
                      <p className="text-sm text-gray-900 dark:text-white">{insight.cause}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Impacted Component</p>
                      <div className="flex items-center space-x-2">
                        <Server className="w-4 h-4 text-gray-400" />
                        <p className="text-sm text-gray-900 dark:text-white">{insight.component}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <Lightbulb className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">Suggested Action</p>
                        <p className="text-sm text-gray-900 dark:text-white">{insight.action}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <button className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" title="Investigate">
                  <Activity className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" title="Apply Fix">
                  <Zap className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" title="View Details">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Run Diagnostics</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Automated health check</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
          </button>
          
          <button className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <Zap className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Auto-Remediate</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Apply suggested fixes</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
          </button>
          
          <button className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Mark Resolved</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Dismiss all insights</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
          </button>
        </div>
      </div>
      
      {/* System Health Score */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">System Health Score</h3>
          <div className="flex items-center space-x-2">
            <div className="w-32 progress-bar">
              <div 
                className={`progress-fill ${criticalCount === 0 && warningCount <= 2 ? 'bg-green-500' : criticalCount === 0 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${Math.max(0, 100 - (criticalCount * 20) - (warningCount * 10))}%` }}
              />
            </div>
            <span className={`text-lg font-semibold ${criticalCount === 0 && warningCount <= 2 ? 'text-green-600 dark:text-green-400' : criticalCount === 0 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}>
              {Math.max(0, 100 - (criticalCount * 20) - (warningCount * 10))}%
            </span>
          </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {criticalCount === 0 && warningCount <= 2 ? 'System is operating normally' : 
           criticalCount === 0 ? 'System has some warnings that should be addressed' :
           'System requires immediate attention'}
        </p>
      </div>
    </div>
  );
};

export default TroubleshootingInsights;