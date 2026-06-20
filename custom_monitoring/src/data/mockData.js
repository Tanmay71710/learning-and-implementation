// Mock data generators for GitOps monitoring dashboard

const generateTimeSeriesData = (hours = 24, baseValue = 50, variance = 20) => {
  const data = [];
  const now = new Date();
  for (let i = hours; i >= 0; i--) {
    const timestamp = new Date(now - i * 3600000);
    const value = baseValue + (Math.random() - 0.5) * variance * 2;
    data.push({
      timestamp: timestamp.toISOString(),
      value: Math.max(0, Math.min(100, value)),
      hour: timestamp.getHours()
    });
  }
  return data;
};

const generatePodData = () => {
  const namespaces = ['flask', 'jenkins', 'argocd', 'artifactory', 'monitoring', 'gitops'];
  const statuses = ['Running', 'Running', 'Running', 'Running', 'Pending', 'Failed', 'CrashLoopBackOff', 'OOMKilled'];
  const pods = [];
  
  namespaces.forEach(ns => {
    const podCount = Math.floor(Math.random() * 8) + 3;
    for (let i = 0; i < podCount; i++) {
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const restarts = status === 'CrashLoopBackOff' ? Math.floor(Math.random() * 10) + 5 : 
                      status === 'Failed' ? Math.floor(Math.random() * 3) + 1 :
                      Math.floor(Math.random() * 2);
      
      pods.push({
        id: `pod-${ns}-${i}`,
        name: `${ns}-pod-${i}-${Math.random().toString(36).substr(2, 5)}`,
        namespace: ns,
        status: status,
        restarts: restarts,
        cpu: Math.random() * 2,
        memory: Math.random() * 1024,
        age: `${Math.floor(Math.random() * 30) + 1}d`,
        ready: status === 'Running' ? `${Math.floor(Math.random() * 2) + 1}/${Math.floor(Math.random() * 2) + 1}` : '0/1',
        health: status === 'Running' && restarts < 2 ? 'Healthy' : 
               status === 'Running' ? 'Warning' : 'Critical'
      });
    }
  });
  
  return pods;
};

const generateNamespaceData = () => {
  return [
    {
      name: 'flask',
      status: 'Active',
      podCount: 8,
      failingPods: 1,
      cpuUsage: 45,
      memoryUsage: 62,
      services: 3,
      alertCount: 2
    },
    {
      name: 'jenkins',
      status: 'Active',
      podCount: 5,
      failingPods: 0,
      cpuUsage: 72,
      memoryUsage: 81,
      services: 2,
      alertCount: 0
    },
    {
      name: 'argocd',
      status: 'Active',
      podCount: 6,
      failingPods: 0,
      cpuUsage: 38,
      memoryUsage: 55,
      services: 4,
      alertCount: 1
    },
    {
      name: 'artifactory',
      status: 'Active',
      podCount: 4,
      failingPods: 0,
      cpuUsage: 56,
      memoryUsage: 73,
      services: 2,
      alertCount: 0
    },
    {
      name: 'monitoring',
      status: 'Active',
      podCount: 12,
      failingPods: 2,
      cpuUsage: 68,
      memoryUsage: 79,
      services: 5,
      alertCount: 3
    },
    {
      name: 'gitops',
      status: 'Active',
      podCount: 3,
      failingPods: 0,
      cpuUsage: 25,
      memoryUsage: 41,
      services: 2,
      alertCount: 0
    }
  ];
};

const generateFlaskAppData = () => {
  return {
    status: 'Healthy',
    uptime: '45d 12h 30m',
    requestCount: 1547892,
    errorRate: 0.12,
    avgResponseTime: 145,
    p95Latency: 320,
    activeRequests: 234,
    healthEndpoint: 'OK',
    endpoints: [
      { name: '/api/health', status: 'Healthy', latency: 12, errorRate: 0 },
      { name: '/api/users', status: 'Healthy', latency: 89, errorRate: 0.05 },
      { name: '/api/data', status: 'Warning', latency: 234, errorRate: 0.8 },
      { name: '/api/admin', status: 'Healthy', latency: 156, errorRate: 0.02 }
    ],
    incidents: [
      { title: 'High latency on /api/data', severity: 'Warning', time: '2h ago' },
      { title: 'Memory spike detected', severity: 'Info', time: '5h ago' }
    ]
  };
};

const generateJenkinsData = () => {
  return {
    totalBuilds: 1234,
    successfulBuilds: 1089,
    failedBuilds: 145,
    successRate: 88.2,
    latestBuild: {
      number: 1234,
      status: 'Success',
      duration: '4m 32s',
      timestamp: '15 min ago'
    },
    runningJobs: 3,
    failedJobs: 1,
    avgBuildTime: '5m 12s',
    queueLength: 2,
    executorUtilization: 67,
    agentHealth: 'Healthy',
    recentBuilds: [
      { number: 1234, status: 'Success', duration: '4m 32s', job: 'flask-app-build' },
      { number: 1233, status: 'Success', duration: '3m 45s', job: 'infra-deploy' },
      { number: 1232, status: 'Failed', duration: '2m 18s', job: 'test-suite' },
      { number: 1231, status: 'Success', duration: '5m 02s', job: 'flask-app-build' },
      { number: 1230, status: 'Success', duration: '4m 15s', job: 'security-scan' }
    ]
  };
};

const generateArgoCDData = () => {
  return {
    totalApplications: 15,
    syncedApplications: 12,
    outOfSyncApplications: 2,
    degradedApplications: 1,
    lastSyncTime: '5 min ago',
    failedSyncCount: 3,
    automatedSyncEnabled: true,
    applications: [
      { name: 'flask-app', project: 'flask', environment: 'dev', syncStatus: 'Synced', health: 'Healthy' },
      { name: 'flask-app', project: 'flask', environment: 'staging', syncStatus: 'Synced', health: 'Healthy' },
      { name: 'flask-app', project: 'flask', environment: 'production', syncStatus: 'OutOfSync', health: 'Healthy' },
      { name: 'jenkins', project: 'ci-cd', environment: 'dev', syncStatus: 'Synced', health: 'Healthy' },
      { name: 'argocd', project: 'gitops', environment: 'production', syncStatus: 'Synced', health: 'Healthy' },
      { name: 'artifactory', project: 'infrastructure', environment: 'production', syncStatus: 'Synced', health: 'Degraded' },
      { name: 'monitoring', project: 'observability', environment: 'production', syncStatus: 'OutOfSync', health: 'Healthy' },
      { name: 'nginx-ingress', project: 'infrastructure', environment: 'production', syncStatus: 'Synced', health: 'Healthy' }
    ],
    syncActivity: generateTimeSeriesData(12, 8, 3)
  };
};

const generateArtifactoryData = () => {
  return {
    status: 'Healthy',
    storageUsed: '450 GB',
    storageTotal: '1 TB',
    storagePercentage: 45,
    artifactCount: 125678,
    uploadActivity: generateTimeSeriesData(24, 50, 30),
    downloadActivity: generateTimeSeriesData(24, 80, 40),
    failureRate: 0.02,
    responseTime: 89,
    repositories: [
      { name: 'docker-local', type: 'Docker', artifacts: 45678, status: 'Healthy' },
      { name: 'maven-local', type: 'Maven', artifacts: 32145, status: 'Healthy' },
      { name: 'npm-local', type: 'NPM', artifacts: 28934, status: 'Healthy' },
      { name: 'helm-local', type: 'Helm', artifacts: 18921, status: 'Warning' }
    ]
  };
};

const generateAlertsData = () => {
  return [
    { id: 1, severity: 'Critical', title: 'Pod crash loop detected', source: 'Kubernetes', namespace: 'flask', timestamp: '5 min ago', acknowledged: false },
    { id: 2, severity: 'Warning', title: 'High memory usage on monitoring pod', source: 'Prometheus', namespace: 'monitoring', timestamp: '15 min ago', acknowledged: false },
    { id: 3, severity: 'Critical', title: 'ArgoCD application out of sync', source: 'ArgoCD', namespace: 'flask', timestamp: '30 min ago', acknowledged: true },
    { id: 4, severity: 'Warning', title: 'Jenkins build queue length high', source: 'Jenkins', namespace: 'jenkins', timestamp: '1 hour ago', acknowledged: false },
    { id: 5, severity: 'Info', title: 'Certificate expiration warning', source: 'Cert-manager', namespace: 'gitops', timestamp: '2 hours ago', acknowledged: false },
    { id: 6, severity: 'Critical', title: 'Node not ready', source: 'Kubernetes', namespace: 'system', timestamp: '3 hours ago', acknowledged: true },
    { id: 7, severity: 'Warning', title: 'API latency spike detected', source: 'Flask', namespace: 'flask', timestamp: '4 hours ago', acknowledged: false },
    { id: 8, severity: 'Info', title: 'Storage usage threshold warning', source: 'Artifactory', namespace: 'artifactory', timestamp: '6 hours ago', acknowledged: true }
  ];
};

const generateLogsData = () => {
  return [
    { id: 1, level: 'ERROR', message: 'Connection timeout to database', pod: 'flask-app-7d8f9', namespace: 'flask', timestamp: '2 min ago' },
    { id: 2, level: 'WARN', message: 'Memory usage approaching threshold', pod: 'monitoring-prometheus-3k4l5', namespace: 'monitoring', timestamp: '10 min ago' },
    { id: 3, level: 'ERROR', message: 'Failed to pull image: registry timeout', pod: 'jenkins-agent-2m3n4', namespace: 'jenkins', timestamp: '25 min ago' },
    { id: 4, level: 'INFO', message: 'Deployment completed successfully', pod: 'argocd-application-controller', namespace: 'argocd', timestamp: '30 min ago' },
    { id: 5, level: 'ERROR', message: 'Health check failed for /api/data', pod: 'flask-app-7d8f9', namespace: 'flask', timestamp: '45 min ago' },
    { id: 6, level: 'WARN', message: 'Sync failed for application monitoring', pod: 'argocd-repo-server', namespace: 'argocd', timestamp: '1 hour ago' }
  ];
};

const generateDeploymentData = () => {
  return {
    currentRelease: 'v2.3.1',
    lastSuccessfulDeployment: '2 hours ago',
    rollbackAvailable: true,
    deployments: [
      { id: 1, version: 'v2.3.1', environment: 'production', status: 'Success', timestamp: '2 hours ago', duration: '5m 32s' },
      { id: 2, version: 'v2.3.0', environment: 'staging', status: 'Success', timestamp: '5 hours ago', duration: '4m 18s' },
      { id: 3, version: 'v2.3.1', environment: 'dev', status: 'Success', timestamp: '8 hours ago', duration: '3m 45s' },
      { id: 4, version: 'v2.2.9', environment: 'production', status: 'Rolled Back', timestamp: '1 day ago', duration: '2m 12s' },
      { id: 5, version: 'v2.2.8', environment: 'production', status: 'Success', timestamp: '2 days ago', duration: '6m 05s' }
    ]
  };
};

const generateTroubleshootingData = () => {
  return [
    { id: 1, title: 'High pod restart count', severity: 'Warning', cause: 'Memory pressure', component: 'flask-app-7d8f9', action: 'Check memory limits and usage' },
    { id: 2, title: 'Node readiness degraded', severity: 'Critical', cause: 'Disk pressure', component: 'node-3', action: 'Free up disk space or add storage' },
    { id: 3, title: 'ArgoCD sync mismatch', severity: 'Warning', cause: 'Git repository drift', component: 'flask-app-production', action: 'Sync with git repository' },
    { id: 4, title: 'Jenkins build queue high', severity: 'Info', cause: 'Limited executors', component: 'jenkins-master', action: 'Scale up Jenkins agents' },
    { id: 5, title: 'Artifactory storage threshold', severity: 'Warning', cause: 'High artifact count', component: 'artifactory', action: 'Clean up old artifacts' },
    { id: 6, title: 'Failed readiness probe', severity: 'Critical', cause: 'Application not responding', component: 'monitoring-grafana', action: 'Check application logs and restart' }
  ];
};

const generateClusterHealthData = () => {
  return {
    clusterName: 'gitops-production',
    status: 'Healthy',
    nodes: {
      total: 5,
      ready: 4,
      notReady: 1
    },
    cpuUsage: generateTimeSeriesData(24, 45, 15),
    memoryUsage: generateTimeSeriesData(24, 62, 10),
    podCount: generateTimeSeriesData(24, 38, 5),
    storage: {
      used: '450 GB',
      total: '1 TB',
      percentage: 45
    },
    controlPlane: {
      apiServer: 'Healthy',
      etcd: 'Healthy',
      scheduler: 'Healthy',
      controllerManager: 'Healthy'
    }
  };
};

const generateOverviewData = () => {
  const pods = generatePodData();
  const runningPods = pods.filter(p => p.status === 'Running').length;
  const warningPods = pods.filter(p => p.status === 'Pending' || p.health === 'Warning').length;
  const failedPods = pods.filter(p => p.status === 'Failed' || p.status === 'CrashLoopBackOff' || p.status === 'OOMKilled').length;
  
  return {
    totalClusters: 3,
    totalNamespaces: 6,
    totalPods: pods.length,
    runningPods,
    warningPods,
    failedPods,
    cpuUsage: 45,
    memoryUsage: 62,
    deploymentsHealthy: 12,
    deploymentsTotal: 15,
    argocdSynced: 12,
    argocdOutOfSync: 3,
    jenkinsSuccessRate: 88.2,
    artifactoryAvailability: 99.9,
    flaskAppStatus: 'Healthy'
  };
};

export const mockData = {
  clusterHealth: generateClusterHealthData(),
  pods: generatePodData(),
  namespaces: generateNamespaceData(),
  flaskApp: generateFlaskAppData(),
  jenkins: generateJenkinsData(),
  argocd: generateArgoCDData(),
  artifactory: generateArtifactoryData(),
  alerts: generateAlertsData(),
  logs: generateLogsData(),
  deployments: generateDeploymentData(),
  troubleshooting: generateTroubleshootingData(),
  overview: generateOverviewData()
};