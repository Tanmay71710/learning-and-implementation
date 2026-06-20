import React from 'react';
import { 
  LayoutDashboard, 
  Server, 
  Box, 
  FolderOpen, 
  Beaker as Flask, 
  GitBranch, 
  RefreshCw as Sync, 
  Package, 
  AlertTriangle, 
  FileText, 
  Activity, 
  Lightbulb, 
  Moon, 
  Sun, 
  User, 
  Settings,
  ChevronRight,
  X
} from 'lucide-react';

const Sidebar = ({ 
  activeSection, 
  onSectionChange, 
  isDarkMode, 
  onDarkModeToggle, 
  viewMode, 
  onViewModeChange,
  isCollapsed,
  onToggleCollapse
}) => {
  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'cluster', label: 'Cluster Health', icon: Server },
    { id: 'pods', label: 'Pod Monitoring', icon: Box },
    { id: 'namespaces', label: 'Namespaces', icon: FolderOpen },
    { id: 'flask', label: 'Flask App', icon: Flask },
    { id: 'jenkins', label: 'Jenkins', icon: GitBranch },
    { id: 'argocd', label: 'Argo CD', icon: Sync },
    { id: 'artifactory', label: 'Artifactory', icon: Package },
    { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
    { id: 'logs', label: 'Logs', icon: FileText },
    { id: 'deployments', label: 'Deployments', icon: Activity },
    { id: 'troubleshooting', label: 'Troubleshooting', icon: Lightbulb },
  ];
  
  return (
    <aside 
      className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-40 transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Logo/Brand */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">GitOps</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Monitor</p>
            </div>
          </div>
        )}
        <button 
          onClick={onToggleCollapse}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <X className="w-5 h-5" />}
        </button>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {navigationItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  activeSection === item.id
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                title={isCollapsed ? item.label : ''}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
        {/* View Mode Toggle */}
        {!isCollapsed && (
          <div className="mb-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 px-3">View Mode</p>
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => onViewModeChange('executive')}
                className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-md text-sm transition-colors ${
                  viewMode === 'executive'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Executive</span>
              </button>
              <button
                onClick={() => onViewModeChange('technical')}
                className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-md text-sm transition-colors ${
                  viewMode === 'technical'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Technical</span>
              </button>
            </div>
          </div>
        )}
        
        {/* Dark Mode Toggle */}
        <button
          onClick={onDarkModeToggle}
          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
            isDarkMode
              ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
          title={isCollapsed ? (isDarkMode ? 'Light Mode' : 'Dark Mode') : ''}
        >
          {isDarkMode ? <Sun className="w-5 h-5 flex-shrink-0" /> : <Moon className="w-5 h-5 flex-shrink-0" />}
          {!isCollapsed && <span className="text-sm font-medium">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;