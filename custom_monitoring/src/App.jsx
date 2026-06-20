import React, { useState, useEffect } from 'react';
import { mockData } from './data/mockData';
import GlobalHeader from './components/GlobalHeader';
import Sidebar from './components/Sidebar';
import OverviewDashboard from './components/OverviewDashboard';
import ClusterHealth from './components/ClusterHealth';
import PodMonitoring from './components/PodMonitoring';
import NamespaceHealth from './components/NamespaceHealth';
import FlaskAppMonitoring from './components/FlaskAppMonitoring';
import JenkinsMonitoring from './components/JenkinsMonitoring';
import ArgoCDMonitoring from './components/ArgoCDMonitoring';
import ArtifactoryMonitoring from './components/ArtifactoryMonitoring';
import AlertsIncidents from './components/AlertsIncidents';
import LogsEventsSummary from './components/LogsEventsSummary';
import DeploymentGitOpsFlow from './components/DeploymentGitOpsFlow';
import TroubleshootingInsights from './components/TroubleshootingInsights';

function App() {
  const [activeSection, setActiveSection] = useState('overview');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [viewMode, setViewMode] = useState('technical');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentEnvironment, setCurrentEnvironment] = useState('production');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  
  // Calculate header metrics
  const healthScore = 85; // Mock calculation
  const clusterStatus = 'Healthy';
  const activeAlerts = mockData.alerts.filter(a => !a.acknowledged).length;
  const criticalIssues = mockData.alerts.filter(a => a.severity === 'Critical' && !a.acknowledged).length;
  const syncIssues = mockData.argocd.outOfSyncApplications;
  
  // Handle dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);
  
  // Handle refresh
  const handleRefresh = () => {
    setLastUpdated(new Date());
    // In a real app, this would fetch fresh data
  };
  
  // Handle search
  const handleSearch = (term) => {
    setSearchTerm(term);
  };
  
  // Render active section
  const renderActiveSection = () => {
    switch (activeSection) {
      case 'overview':
        return <OverviewDashboard data={mockData.overview} />;
      case 'cluster':
        return <ClusterHealth data={mockData.clusterHealth} />;
      case 'pods':
        return <PodMonitoring pods={mockData.pods} />;
      case 'namespaces':
        return <NamespaceHealth namespaces={mockData.namespaces} />;
      case 'flask':
        return <FlaskAppMonitoring data={mockData.flaskApp} />;
      case 'jenkins':
        return <JenkinsMonitoring data={mockData.jenkins} />;
      case 'argocd':
        return <ArgoCDMonitoring data={mockData.argocd} />;
      case 'artifactory':
        return <ArtifactoryMonitoring data={mockData.artifactory} />;
      case 'alerts':
        return <AlertsIncidents alerts={mockData.alerts} />;
      case 'logs':
        return <LogsEventsSummary logs={mockData.logs} />;
      case 'deployments':
        return <DeploymentGitOpsFlow data={mockData.deployments} />;
      case 'troubleshooting':
        return <TroubleshootingInsights insights={mockData.troubleshooting} />;
      default:
        return <OverviewDashboard data={mockData.overview} />;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Sidebar */}
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        isDarkMode={isDarkMode}
        onDarkModeToggle={() => setIsDarkMode(!isDarkMode)}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      
      {/* Main Content */}
      <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        {/* Header */}
        <GlobalHeader
          projectName="GitOps Platform"
          healthScore={healthScore}
          clusterStatus={clusterStatus}
          activeAlerts={activeAlerts}
          criticalIssues={criticalIssues}
          syncIssues={syncIssues}
          onRefresh={handleRefresh}
          onEnvironmentChange={setCurrentEnvironment}
          currentEnvironment={currentEnvironment}
          lastUpdated={lastUpdated.toLocaleTimeString()}
          onSearch={handleSearch}
        />
        
        {/* Main Content Area */}
        <main className="p-6">
          {/* View Mode Indicator */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">Current View:</span>
              <span className={`badge ${viewMode === 'executive' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'}`}>
                {viewMode === 'executive' ? 'Executive Summary' : 'Technical Operations'}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <span>Environment:</span>
              <span className="font-medium text-gray-900 dark:text-white">{currentEnvironment}</span>
            </div>
          </div>
          
          {/* Content */}
          {renderActiveSection()}
        </main>
      </div>
    </div>
  );
}

export default App;