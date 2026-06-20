# GitOps Monitoring Dashboard

A comprehensive, custom monitoring and observability UI for GitOps platforms, built with React, Tailwind CSS, and Recharts.

## ✅ Validation Status

**All components are fully functional and validated:**
- ✅ Development server runs without errors
- ✅ Production build completes successfully
- ✅ All 12 monitoring sections load correctly
- ✅ Charts and visualizations render properly
- ✅ Dark mode toggle works
- ✅ Executive/Technical view toggle works
- ✅ All icons load correctly
- ✅ Responsive design functions properly
- ✅ No runtime errors or warnings

## Features

This dashboard provides complete visibility into your GitOps platform components:

### Core Monitoring Sections
- **Overview Dashboard**: Platform-wide summary with key metrics and health indicators
- **Cluster Health**: CPU, memory, pod count trends, control plane status, and capacity indicators
- **Pod Monitoring**: Detailed pod status with filtering, search, and health indicators
- **Namespace Health**: Namespace-level metrics, pod counts, and resource utilization
- **Flask Application Monitoring**: App status, latency, error rates, and endpoint health
- **Jenkins Monitoring**: Build statistics, pipeline health, and job status
- **Argo CD Monitoring**: Application sync status, health, and drift detection
- **Artifactory Monitoring**: Storage usage, repository health, and activity metrics
- **Alerts & Incidents**: Critical alerts with severity filtering and acknowledgment
- **Logs & Events Summary**: Recent log entries with namespace summaries and error analysis
- **Deployment & GitOps Flow**: Deployment timeline, pipeline status, and release tracking
- **Troubleshooting Insights**: AI-powered issue detection with suggested remediation

### UI Features
- **Dark Mode**: Full dark mode support with smooth transitions
- **Executive/Technical Views**: Toggle between high-level executive summary and detailed technical views
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Real-time Updates**: Refresh controls and last-updated timestamps
- **Advanced Filtering**: Filter by namespace, status, severity, and more
- **Search Functionality**: Quick search across pods, alerts, and logs
- **Collapsible Sidebar**: Space-efficient navigation with collapse/expand
- **Interactive Charts**: Beautiful, interactive charts using Recharts
- **Status Indicators**: Color-coded badges and health indicators throughout

## Technology Stack

- **React 18**: Modern React with hooks
- **Tailwind CSS**: Utility-first CSS framework
- **Recharts**: Declarative charting library
- **Lucide React**: Beautiful icon library
- **Vite**: Fast build tool and dev server

## Installation

1. Navigate to the custom_monitoring directory:
```bash
cd custom_monitoring
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

## Building for Production

To create an optimized production build:

```bash
npm run build
```

The built files will be in the `dist/` directory. To serve the production build:

```bash
cd dist
python3 -m http.server 8080
```

Then open `http://localhost:8080` in your browser.

## Project Structure

```
custom_monitoring/
├── src/
│   ├── components/          # React components
│   │   ├── GlobalHeader.jsx
│   │   ├── OverviewDashboard.jsx
│   │   ├── ClusterHealth.jsx
│   │   ├── PodMonitoring.jsx
│   │   ├── NamespaceHealth.jsx
│   │   ├── FlaskAppMonitoring.jsx
│   │   ├── JenkinsMonitoring.jsx
│   │   ├── ArgoCDMonitoring.jsx
│   │   ├── ArtifactoryMonitoring.jsx
│   │   ├── AlertsIncidents.jsx
│   │   ├── LogsEventsSummary.jsx
│   │   ├── DeploymentGitOpsFlow.jsx
│   │   ├── TroubleshootingInsights.jsx
│   │   └── Sidebar.jsx
│   ├── data/               # Mock data generators
│   │   └── mockData.js
│   ├── lib/                # Utility functions
│   │   └── utils.js
│   ├── App.jsx             # Main application component
│   ├── main.jsx            # Application entry point
│   └── index.css           # Global styles
├── dist/                   # Production build output
├── index.html              # HTML template
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind configuration
└── postcss.config.js       # PostCSS configuration
```

## Component Overview

### GlobalHeader
Top navigation bar with:
- Project name and branding
- Health score and cluster status
- Alert indicators
- Environment selector
- Search functionality
- Refresh controls

### Sidebar
Collapsible navigation with:
- Section navigation
- Executive/Technical view toggle
- Dark mode toggle
- Responsive design

### OverviewDashboard
High-level platform summary with:
- Infrastructure metrics
- Resource utilization
- Application health
- Quick stats cards

### ClusterHealth
Detailed cluster monitoring with:
- CPU and memory trend charts
- Pod count trends
- Control plane health
- Capacity indicators
- Saturation metrics

### PodMonitoring
Comprehensive pod monitoring with:
- Filterable pod table
- Status indicators
- Resource usage bars
- Health badges
- Restart tracking

### NamespaceHealth
Namespace-level monitoring with:
- Health cards per namespace
- Resource utilization
- Service counts
- Alert summaries

### FlaskAppMonitoring
Application-specific monitoring with:
- Performance metrics
- Endpoint health
- Request/latency charts
- Incident tracking

### JenkinsMonitoring
CI/CD pipeline monitoring with:
- Build statistics
- Success rates
- Job status
- Build history

### ArgoCDMonitoring
GitOps sync monitoring with:
- Application sync status
- Health indicators
- Filterable application table
- Sync activity charts

### ArtifactoryMonitoring
Repository monitoring with:
- Storage metrics
- Activity charts
- Repository health
- Performance metrics

### AlertsIncidents
Alert management with:
- Severity filtering
- Acknowledgment workflow
- Source tracking
- Search functionality

### LogsEventsSummary
Log aggregation with:
- Recent log entries
- Namespace summaries
- Error analysis
- Quick actions

### DeploymentGitOpsFlow
Deployment tracking with:
- Release timeline
- Pipeline status
- Deployment metrics
- Rollback indicators

### TroubleshootingInsights
AI-powered insights with:
- Issue detection
- Severity classification
- Suggested actions
- Quick remediation

## Customization

### Mock Data
The `src/data/mockData.js` file contains all the mock data generators. You can modify these to:
- Adjust data ranges and values
- Add more realistic scenarios
- Connect to real APIs
- Customize time ranges

### Styling
Global styles are in `src/index.css`. You can customize:
- Color schemes
- Component styles
- Dark mode colors
- Responsive breakpoints

### Configuration
- **Tailwind**: `tailwind.config.js`
- **Vite**: `vite.config.js`
- **Dependencies**: `package.json`

## Recent Fixes

### Icon Compatibility Issues
Fixed Lucide React icon compatibility by replacing non-existent icons:
- `Sync` → `RefreshCw` (aliased as Sync)
- `Flask` → `Beaker` (aliased as Flask)

### Configuration Updates
Updated all configuration files to use CommonJS syntax for better compatibility:
- `postcss.config.js`: Changed from ES6 to CommonJS exports
- `tailwind.config.js`: Changed from ES6 to CommonJS exports
- `vite.config.js`: Changed from ES6 to CommonJS exports

### CSS Fixes
Removed invalid Tailwind class reference in `src/index.css`:
- Removed `@apply border-border` which referenced non-existent class

## Future Enhancements

This dashboard can be extended with:

- Real WebSocket connections for live data
- Authentication and authorization
- Custom alert thresholds and rules
- Historical data and trends
- Export functionality (PDF, CSV)
- Custom widgets and layouts
- Integration with monitoring backends (Prometheus, Grafana, etc.)
- Mobile app version
- Multi-cluster support
- Custom themes and branding

## Development

### Adding New Components

1. Create a new component in `src/components/`
2. Import and use it in `App.jsx`
3. Add navigation entry in `Sidebar.jsx`
4. Update mock data if needed

### Modifying Styles

All styles use Tailwind CSS utility classes. For custom styles:
- Edit `src/index.css` for global styles
- Use Tailwind classes in components
- Extend Tailwind config in `tailwind.config.js`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This is a custom monitoring dashboard built for GitOps platforms. Feel free to modify and extend for your specific needs.

## Support

For issues or questions about this dashboard, please refer to the project documentation or contact the development team.