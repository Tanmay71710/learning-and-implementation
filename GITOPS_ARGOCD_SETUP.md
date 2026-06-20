# GitOps with ArgoCD - Complete Guide

Complete guide for implementing ArgoCD as the source of truth for GitOps deployment of the Script Execution Manager.

## Overview

This guide implements a complete GitOps workflow where ArgoCD manages Kubernetes deployments based on Git repository state, providing:
- Declarative GitOps deployment model
- Multi-environment support (dev, staging, production)
- Automated synchronization between Git and Kubernetes
- Application health monitoring
- Rollback capabilities
- RBAC and security controls

## Architecture

```
Git Repository (Source of Truth)
    ↓
    Push/PR/Merge
    ↓
GitHub Actions (CI Pipeline)
    ↓
    Build & Push Docker Image
    ↓
    Update Git Manifests
    ↓
ArgoCD (GitOps Operator)
    ↓
    Monitor Git Repository
    ↓
    Sync to Kubernetes
    ↓
Kubernetes Cluster
    ↓
    Deploy Application
```

## Prerequisites

- Kubernetes cluster (v1.20+)
- ArgoCD installed
- GitHub repository with Kubernetes manifests
- kubectl configured
- Container registry (JFrog Artifactory)
- GitHub Actions enabled

## ArgoCD Installation

### Quick Installation

```bash
# Install ArgoCD
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Verify installation
kubectl get pods -n argocd -l app.kubernetes.io/name=argocd-server
```

### Custom Installation

Use the provided manifests in the `argocd/` directory:

```bash
# Create namespace
kubectl apply -f argocd/namespace.yaml

# Install ArgoCD with custom configuration
kubectl apply -f argocd/argocd-cm.yaml
kubectl apply -f argocd/argocd-rbac-cm.yaml

# Install ArgoCD
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

### Access ArgoCD UI

```bash
# Port-forward to access ArgoCD UI
kubectl port-forward svc/argocd-server -n argocd 8080:44343

# Get initial admin password
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath='{.data.password}' | base64 -d
```

Access at: `http://localhost:8080`

## ArgoCD Project Setup

### Create Project

Use the provided project configuration:

```bash
kubectl apply -f argocd/project.yaml
```

### Project Configuration

The project includes:
- **Source Repository**: GitHub repository with Kubernetes manifests
- **Destinations**: Multiple Kubernetes clusters (dev, staging, production)
- **Resource Whitelisting**: Controlled resource types
- **RBAC**: Admin and developer roles
- **Sync Windows**: Automated sync policies

### Project Details

- **Name**: `script-execution-manager`
- **Source**: `https://github.com/Kanmay71710/learning-and-implementation`
- **Destinations**: 3 environments (in-cluster, staging, production)
- **Namespaces**: script-execution-manager, script-execution-manager-staging, script-execution-manager-prod

## Application Configuration

### Create Application

Apply the application manifest:

```bash
kubectl apply -f argocd/application.yaml
```

### Application Details

- **Name**: `script-execution-manager`
- **Source Path**: `k8s/` directory in repository
- **Target Revision**: `master` branch
- **Sync Policy**: Automated with pruning and self-healing
- **Health Checks**: Enabled for application monitoring

### Sync Policy

```yaml
syncPolicy:
  automated:
    prune: true        # Remove resources not in Git
    selfHeal: true      # Auto-revert manual changes
  syncOptions:
  - CreateNamespace=true  # Auto-create namespaces
```

## Multi-Environment Setup

### App of Apps Pattern

Use the App of Apps for managing multiple environments:

```bash
kubectl apply -f argocd/app-of-apps.yaml
```

### Environment Configuration

| Environment | Branch | Namespace | Cluster |
|-------------|---------|------------|---------|
| Production | master | script-execution-manager-prod | production-cluster |
| Staging | develop | script-execution-manager-environment | staging-cluster |
| Development | develop | script-execution-manager-dev | in-cluster |

### Branch Strategy

- **master**: Production deployments
- **develop**: Staging and development deployments
- **feature/***: Development/testing only

## GitHub Actions Integration

### GitOps Workflow

The `.github/workflows/argocd-gitops.yml` workflow:

**Jobs:**

1. **Trigger ArgoCD Sync**
   - Installs ArgoCD CLI
   - Configures ArgoCD context
   - Triggers sync for appropriate environment
   - Waits for health checks
   - Sends email notifications

2. **Update Manifests**
   - Updates image tags in Git
   - Commits and pushes changes
   - Triggers ArgoCD sync
   - Waits for deployment health

### Required Secrets

Add these to GitHub Secrets:

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `ARGOCD_URL` | ArgoCD server URL | `https://argocd.example.com` |
| `ARGOCD_USERNAME` | ArgoCD username | `admin` |
| `workflow_dispatch` | Manual workflow trigger | Enabled |

### Workflow Triggers

- Push to `master` → Production sync
- Push to `develop` → Staging sync
- Push to `feature/*` → Development sync
- Tag pushes → Production sync
- Manual dispatch with environment selection

## GitOps Workflow

### Development Workflow

1. **Make Changes**: Modify Kubernetes manifests in `k8s/` directory
2. **Commit Changes**: Git commit with descriptive message
3. **Push to Git**: `git push origin develop`
4. **Automatic Sync**: ArgoCD detects changes and syncs to Kubernetes
5. **Health Verification**: ArgoCD verifies application health
6. **Rollback if Needed**: Revert problematic changes

### Deployment Workflow

1. **Code Changes**: Update application code
2. **Build Image**: GitHub Actions builds Docker image
3. Push to Artifactory: Image stored in Artifactory
4. **Update Manifests**: GitHub Actions updates image tag in Git
5. **ArgoCD Sync**: Detects manifest changes
6. **Deploy to Kubernetes: Rolling update of pods
7. **Health Check**: Application health verification

## ArgoCD Configuration

### Application Configuration

The application manifest includes:

- **Source**: Git repository and path
- **Destination**: Kubernetes cluster and namespace
- **Sync Policy**: Automated sync with pruning and self-healing
- **Health Checks**: Application health monitoring
- **Revision History**: Keep track of deployment history

### Sync Strategy

```yaml
syncPolicy:
  automated:
    prune: true        # Remove resources not in Git
    selfHeal: true      # Auto-revert manual changes
  syncOptions:
  - CreateNamespace=true
  - ServerSideApply=true
```

### Resource Management

```yaml
clusterResourceWhitelist:
  - group: ''
    kind: Namespace
  - group: apps
    kind: Deployment
  - group: ''
    kind: Service
```

## Security Configuration

### RBAC Setup

The project includes two roles:

**Admin Role:**
- Full access to all resources
- Can modify applications, clusters, repositories
- Can execute commands in pods

**Developer Role:**
- Application management access
- Can view and sync applications
- Can execute commands in pods
- Cannot modify project configuration

### Secrets Management

- **Image Pull Secrets**: For Artifactory authentication
- **Application Secrets**: Database credentials, API keys
- **ArgoCD Secrets**: For cluster authentication
- **RBAC Secrets**: For API authentication

## Monitoring and Observability

### Application Health

ArgoCD provides built-in health checks:

```yaml
healthStatus:
  live:
    enabled: true
```

### Sync Status Monitoring

Monitor sync status via:
- ArgoCD UI dashboard
- ArgoCD CLI: `argocd app get <app-name>`
- Webhooks for sync notifications
- Metrics via Prometheus

### Application Metrics

Expose application metrics:
```yaml
resources:
  limits:
    cpu: 500m
    memory: 512Mi
  requests:
    cmu: 250m
    memory: 256Mi
```

## Rollback and Recovery

### Manual Rollback

```bash
# Rollback to previous revision
argocd app rollback script-execution-manager-prod

# Rollback to specific revision
argocd app rollback script-execution-manager-prod --revision 2

# View revision history
argocd app history script-execution-manager-prod
```

### Auto-Rollback

Configure auto-rollback in sync policy:

```yaml
syncPolicy:
  retry:
    limit: 5
    backoff:
      duration: 5s
      factor: 2
      maxDuration: 3m
```

## Best Practices

### GitOps Best Practices

- **Single Source of Truth**: Git is the only place for deployment configuration
- **Declarative Configuration**: All infrastructure as code
- **Immutable Infrastructure**: Don't manually modify Kubernetes resources
- **Version Control**: Tag releases with semantic versioning
- **Branch Protection**: Require PRs for production changes
- **Security**: Use RBAC and secrets management

### ArgoCD Best Practices

- **Use App of Apps**: For multi-environment management
- **Enable Notifications**: Webhooks for sync status
- **Resource Limits**: Set appropriate resource constraints
- **Health Checks**: Configure proper health checks
- **RBAC**: Implement proper access controls
- **Backup Configuration**: Regular backup of ArgoCD configuration

### Git Repository Structure

```
repository/
├── k8s/                    # Kubernetes manifests
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── configmap.yaml
│   └── secrets.yaml
├── argocd/                 # ArgoCD configuration
│   ├── namespace.yaml
│   ├── project.yaml
│   ├── application.yaml
│   └── app-of-apps.yaml
├── helm/                   # Helm charts
│   └── script-execution-manager/
└── Dockerfile              # Application definition
```

## Troubleshooting

### Sync Failures

```bash
# Check application status
argocd app get script-execution-manager-prod

# View sync history
argocd app history script-execution-manager

# Manual sync
argocd app sync script-execution-manager --debug

# Check pod logs
kubectl logs -n argocd -l app.kubernetes.io/name=argocd-application-controller
```

### Connection Issues

```bash
# Verify ArgoCD server connectivity
curl -k -v https://argocd-server.argocd

# Check ArgoCD server logs
kubectl logs -n argocd -l app.kubernetes.io/name=argocd-server
```

### Resource Conflicts

```bash
# Check for resource conflicts
argocd app diff script-execution-manager-prod

# Force sync to resolve conflicts
argocd app sync script-execution-manager --force
```

## Advanced Configuration

### Webhook Configuration

Set up webhooks for notifications:

```yaml
metadata:
  annotations:
    notifications.argoproj.io/subscribe.on-sync-status-unknown: |
      slack:
        channels: '#deployments'
        message: |
          Application '{{.app.metadata.name}}' is {{.status}}.
          Details: {{.syncStatus}}
```

### Pre-Sync Hooks

```yaml
spec:
  hooks:
  - name: pre-sync
    command: ["/bin/bash", "-c", "echo 'Pre-sync hook executing'"]
```

### Post-Sync Hooks

```yaml
spec:
  hooks:
  - name: post-sync
    command: ["/bin/bash", "-c", "echo 'Post-sync hook executing'"]
```

## Migration from Manual Deployment

### Migration Steps

1. **Export Current State**
   ```bash
   kubectl get all -n script-execution-manager -o yaml > current-state.yaml
   ```

2. **Backup Configuration**
   ```bash
   kubectl get configmaps -n script-execution-manager -o yaml > configmaps-backup.yaml
   kubectl get secrets -n script-execution-manager -o yaml > secrets-backup.yaml
   ```

3. **Install ArgoCD**
   ```bash
   kubectl create namespace argocd
   kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
   ```

4. **Create ArgoCD Project**
   ```bash
   kubectl apply -f argocd/project.yaml
   ```

5. **Create Application**
   ```bash
   kubectl apply -f argocd/application.yaml
   ```

6. **Verify Deployment**
   ```bash
   argocd app get script-execution-manager-prod
   kubectl get pods -n script-execution-manager
   ```

## CI/CD Pipeline Integration

### Complete GitOps Pipeline

1. **Developer** → Pushes code changes
2. **GitHub Actions** → Builds Docker image, updates manifests
3. **Git Repository** → Single source of truth
4. **ArgoCD** → Monitors Git, syncs to Kubernetes
5. **Kubernetes** → Deploys application
6. **Monitoring** → Health checks and alerts

### GitHub Actions + ArgoCD

The combined workflow provides:
- **CI**: Build, test, security scanning
- **CD**: Automated deployment via ArgoCD
- **GitOps**: Git as single source of truth
- **Rollback**: Easy rollback via Git
- **Audit Trail**: Complete deployment history

## Monitoring and Alerting

### ArgoCD Metrics

Enable Prometheus metrics in ArgoCD:

```yaml
spec:
  metrics:
    enabled: true
    applicationLabels:
      - env: production
      - region: us-west-2
```

### Alerting Setup

Configure alerts for:
- Sync failures
- Health check failures
- Deployment errors
- Resource limit breaches

## Backup and Recovery

### Configuration Backup

```bash
# Backup ArgoCD configuration
kubectl get applications.argoproj.io -n argocd -o yaml > argocd-backup.yaml
kubectl get appprojects.argoproj.io -n argocd -o yaml > project-backup.yaml
```

### Disaster Recovery

```bash
# Restore ArgoCD configuration
kubectl apply -f argocd-backup.yaml
kubectl apply -f project-backup.yaml

# Force sync to restore state
argocd app sync script-execution-manager-prod --force
```

This GitOps implementation with ArgoCD provides a complete, production-ready deployment pipeline with Git as the single source of truth.