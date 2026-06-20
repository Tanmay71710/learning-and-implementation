# Multi-Environment Setup Guide

This document provides comprehensive information about the multi-environment setup for the Script Execution Manager project.

## Overview

The project now supports four distinct environments:
- **dev** - Development environment for internal testing
- **staging** - Pre-production environment for final testing
- **pub/dev** - Public development environment for external access
- **production** - Production environment for live traffic

## Directory Structure

```
learning/
├── environments/
│   ├── dev/
│   │   ├── k8s/                    # Kubernetes overlays for dev
│   │   │   ├── kustomization.yaml
│   │   │   ├── deployment-patch.yaml
│   │   │   ├── configmap-patch.yaml
│   │   │   └── service-patch.yaml
│   │   ├── helm-values.yaml         # Helm values for dev
│   │   ├── .env                     # Environment variables for dev
│   │   └── argocd-application.yaml  # ArgoCD application for dev
│   ├── staging/
│   │   ├── k8s/                    # Kubernetes overlays for staging
│   │   ├── helm-values.yaml         # Helm values for staging
│   │   ├── .env                     # Environment variables for staging
│   │   └── argocd-application.yaml  # ArgoCD application for staging
│   ├── pub-dev/
│   │   ├── k8s/                    # Kubernetes overlays for pub-dev
│   │   ├── helm-values.yaml         # Helm values for pub-dev
│   │   ├── .env                     # Environment variables for pub-dev
│   │   └── argocd-application.yaml  # ArgoCD application for pub-dev
│   └── production/
│       ├── k8s/                    # Kubernetes overlays for production
│       ├── helm-values.yaml         # Helm values for production
│       ├── .env                     # Environment variables for production
│       └── argocd-application.yaml  # ArgoCD application for production
├── k8s-base/                        # Base Kubernetes manifests
│   ├── kustomization.yaml
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── configmap.yaml
│   └── secrets.yaml
├── argocd/                          # ArgoCD configurations
│   ├── project.yaml
│   ├── app-of-apps.yaml
│   └── ...
└── helm/script-execution-manager/   # Base Helm chart
```

## Environment Specifications

### Development (dev)
- **Purpose**: Internal development and testing
- **Replicas**: 1
- **Resources**: 128Mi-256Mi RAM, 100m-250m CPU
- **Service Type**: ClusterIP (internal only)
- **Debug Mode**: Enabled
- **Database**: SQLite (local)
- **Branch**: `develop`
- **Namespace**: `script-execution-manager-dev`

### Staging (staging)
- **Purpose**: Pre-production testing
- **Replicas**: 2
- **Resources**: 256Mi-512Mi RAM, 250m-500m CPU
- **Service Type**: LoadBalancer (external access)
- **Debug Mode**: Disabled
- **Database**: PostgreSQL
- **Branch**: `staging`
- **Namespace**: `script-execution-manager-staging`
- **Autoscaling**: Enabled (2-5 replicas)

### Public Development (pub/dev)
- **Purpose**: Public development environment
- **Replicas**: 3
- **Resources**: 384Mi-768Mi RAM, 350m-750m CPU
- **Service Type**: LoadBalancer (external access)
- **Debug Mode**: Disabled
- **Database**: PostgreSQL
- **Branch**: `pub/dev`
- **Namespace**: `script-execution-manager-pub-dev`
- **Autoscaling**: Enabled (3-8 replicas)

### Production (production)
- **Purpose**: Production environment
- **Replicas**: 5
- **Resources**: 512Mi-1Gi RAM, 500m-1000m CPU
- **Service Type**: LoadBalancer (external access)
- **Debug Mode**: Disabled
- **Database**: PostgreSQL
- **Branch**: `master`
- **Namespace**: `script-execution-manager-prod`
- **Autoscaling**: Enabled (5-15 replicas)

## Deployment Methods

### 1. Kubernetes with Kustomize

Each environment has its own Kustomize configuration:

```bash
# Deploy to dev
kubectl apply -k environments/dev/k8s

# Deploy to staging
kubectl apply -k environments/staging/k8s

# Deploy to pub-dev
kubectl apply -k environments/pub-dev/k8s

# Deploy to production
kubectl apply -k environments/production/k8s
```

### 2. Helm Deployment

Each environment has specific Helm values:

```bash
# Deploy to dev
helm install script-execution-manager ./helm/script-execution-manager \
  -f environments/dev/helm-values.yaml \
  --namespace script-execution-manager-dev \
  --create-namespace

# Deploy to staging
helm install script-execution-manager ./helm/script-execution-manager \
  -f environments/staging/helm-values.yaml \
  --namespace script-execution-manager-staging \
  --create-namespace

# Deploy to pub-dev
helm install script-execution-manager ./helm/script-execution-manager \
  -f environments/pub-dev/helm-values.yaml \
  --namespace script-execution-manager-pub-dev \
  --create-namespace

# Deploy to production
helm install script-execution-manager ./helm/script-execution-manager \
  -f environments/production/helm-values.yaml \
  --namespace script-execution-manager-prod \
  --create-namespace
```

### 3. ArgoCD GitOps

Each environment has its own ArgoCD Application:

```bash
# Apply the environment-specific ArgoCD application
kubectl apply -f environments/dev/argocd-application.yaml
kubectl apply -f environments/staging/argocd-application.yaml
kubectl apply -f environments/pub-dev/argocd-application.yaml
kubectl apply -f environments/production/argocd-application.yaml
```

Or use the App-of-Apps pattern:

```bash
kubectl apply -f argocd/app-of-apps.yaml
```

### 4. GitHub Actions CI/CD

The GitHub Actions workflow automatically deploys to the appropriate environment based on the branch:

- `develop` branch → dev environment
- `staging` branch → staging environment
- `pub/dev` branch → pub-dev environment
- `master`/`main` branch → production environment

Manual deployment with workflow dispatch:

1. Go to Actions tab in GitHub
2. Select "Build and Push Docker Image to Artifactory"
3. Click "Run workflow"
4. Select the target environment
5. Optionally specify image tag and deployment options

## Environment Configuration

### Environment Variables

Each environment has its own `.env` file with specific configurations:

```bash
# Load environment-specific variables
cp environments/dev/.env .env
# or
cp environments/staging/.env .env
# etc.
```

### Database Configuration

- **dev**: SQLite database (`sqlite:///script_manager_dev.db`)
- **staging**: PostgreSQL (`postgresql://user:password@postgres-staging:5432/script_manager_staging`)
- **pub-dev**: PostgreSQL (`postgresql://user:password@postgres-pubdev:5432/script_manager_pubdev`)
- **production**: PostgreSQL (`postgresql://user:password@postgres-prod:5432/script_manager_prod`)

### Service URLs

Each environment uses different service URLs:

- **dev**: `http://script-execution-manager-dev.svc.cluster.local`
- **staging**: LoadBalancer external IP
- **pub-dev**: LoadBalancer external IP
- **production**: LoadBalancer external IP

## Branch Strategy

The project follows a strict branch strategy:

- `master` - Production code (deploys to production)
- `staging` - Staging code (deploys to staging)
- `pub/dev` - Public development code (deploys to pub-dev)
- `develop` - Development code (deploys to dev)

### Git Workflow

1. Create feature branches from `develop`
2. Test changes in dev environment
3. Merge to `staging` for staging deployment
4. Merge to `pub/dev` for public development deployment
5. Merge to `master` for production deployment

## Monitoring and Logging

### Accessing Logs

```bash
# Get logs for specific environment
kubectl logs -l app=script-execution-manager -n script-execution-manager-dev
kubectl logs -l app=script-execution-manager -n script-execution-manager-staging
kubectl logs -l app=script-execution-manager -n script-execution-manager-pub-dev
kubectl logs -l app=script-execution-manager -n script-execution-manager-prod
```

### Monitoring Deployment Status

```bash
# Check deployment status
kubectl rollout status deployment/script-execution-manager -n script-execution-manager-dev
kubectl get pods -l app=script-execution-manager -n script-execution-manager-dev
```

## Security Considerations

### Secrets Management

- Never commit actual secrets to the repository
- Use environment-specific secret management
- Rotate secrets regularly
- Use different credentials for each environment

### Network Policies

- **dev**: Internal cluster access only
- **staging**: Restricted external access
- **pub-dev**: Controlled external access
- **production**: Strict external access with security groups

### Access Control

- Use ArgoCD RBAC for environment-specific access
- Implement namespace-based access control
- Use service accounts with minimal permissions

## Troubleshooting

### Common Issues

1. **Deployment fails in specific environment**
   - Check environment-specific configuration
   - Verify namespace exists
   - Check resource limits

2. **Wrong environment deployed**
   - Verify branch naming
   - Check GitHub Actions environment detection
   - Review ArgoCD application configuration

3. **Resource constraints**
   - Adjust environment-specific resource limits
   - Check cluster capacity
   - Review autoscaling configuration

## Best Practices

1. **Always test in dev first** before promoting to staging
2. **Use staging for final testing** before production deployment
3. **Monitor resource usage** in each environment
4. **Keep environment configurations synchronized** when making changes
5. **Use separate databases** for each environment
6. **Implement proper rollback strategies** for each environment
7. **Tag Docker images with environment identifiers**
8. **Monitor logs and metrics** per environment
9. **Regular security audits** for all environments
10. **Document environment-specific procedures**

## Maintenance

### Updating Configuration

When updating configuration:

1. Update the base manifests in `k8s-base/`
2. Update environment-specific overlays if needed
3. Test in dev environment first
4. Promote changes through environments
5. Update documentation

### Adding New Environments

To add a new environment:

1. Create new directory under `environments/`
2. Copy and modify existing environment configuration
3. Create Kustomize overlays
4. Create Helm values file
5. Create environment-specific .env file
6. Create ArgoCD application
7. Update GitHub Actions workflow
8. Update documentation

## Support

For issues or questions:
- Check environment-specific logs
- Review ArgoCD application status
- Verify GitHub Actions workflow runs
- Consult this documentation
- Contact DevOps team