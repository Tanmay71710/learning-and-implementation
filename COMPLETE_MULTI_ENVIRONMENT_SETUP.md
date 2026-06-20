# Complete Multi-Environment Infrastructure Setup

## Overview

This document provides a comprehensive overview of the multi-environment setup that covers **ALL tools** in the infrastructure, not just the main application. The multi-environment configuration now includes:

1. **Main Application** (script-execution-manager)
2. **Jenkins** (CI/CD server)
3. **Artifactory** (Docker registry and artifact repository)
4. **MinIO** (Object storage)
5. **Git** (Version control with environment-specific branches)
6. **ArgoCD** (GitOps deployment tool)
7. **GitHub Actions** (CI/CD pipeline)

## Environment Coverage Matrix

| Tool/Component | dev | staging | pub/dev | production | Status |
|---------------|-----|---------|---------|------------|--------|
| **Git Branches** | develop | staging | pub/dev | master | ✅ Complete |
| **Main Application** | ✅ | ✅ | ✅ | ✅ | ✅ Complete |
| **Kubernetes** | ✅ | ✅ | ✅ | ✅ | ✅ Complete |
| **Helm Charts** | ✅ | ✅ | ✅ | ✅ | ✅ Complete |
| **ArgoCD Apps** | ✅ | ✅ | ✅ | ✅ | ✅ Complete |
| **Environment Variables** | ✅ | ✅ | ✅ | ✅ | ✅ Complete |
| **Jenkins** | ✅ | ✅ | ✅ | ✅ | ✅ Complete |
| **Artifactory** | ✅ | ✅ | ✅ | ✅ | ✅ Complete |
| **MinIO** | ✅ | ✅ | ✅ | ✅ | ✅ Complete |
| **GitHub Actions** | ✅ | ✅ | ✅ | ✅ | ✅ Complete |

## Detailed Tool Configuration

### 1. Main Application (script-execution-manager)

**Environment-Specific Configurations:**
- **Kubernetes manifests**: `environments/{env}/k8s/`
- **Helm values**: `environments/{env}/helm-values.yaml`
- **Environment variables**: `environments/{env}/.env`
- **ArgoCD applications**: `environments/{env}/argocd-application.yaml`

**Specifications:**
- dev: 1 replica, 128-256Mi RAM, ClusterIP, SQLite
- staging: 2 replicas, 256-512Mi RAM, LoadBalancer, PostgreSQL
- pub-dev: 3 replicas, 384-768Mi RAM, LoadBalancer, PostgreSQL
- production: 5 replicas, 512Mi-1Gi RAM, LoadBalancer, PostgreSQL

### 2. Jenkins (CI/CD Server)

**Environment-Specific Configurations:**
- **Deployments**: `environments/{env}/jenkins-deployment.yaml`
- **ArgoCD applications**: `environments/{env}/jenkins-argocd.yaml`

**Specifications:**
| Environment | Namespace | Replicas | RAM | CPU | Storage | Service Type |
|------------|-----------|----------|-----|-----|---------|--------------|
| dev | jenkins-dev | 1 | 512Mi-1Gi | 250m-500m | emptyDir | ClusterIP |
| staging | jenkins-staging | 1 | 1Gi-2Gi | 500m-1000m | 20Gi PVC | LoadBalancer |
| pub-dev | jenkins-pub-dev | 1 | 1Gi-2Gi | 500m-1000m | 30Gi PVC | LoadBalancer |
| production | jenkins-prod | 2 | 2Gi-4Gi | 1000m-2000m | 50Gi PVC | LoadBalancer |

**Access URLs:**
- dev: `http://jenkins.jenkins-dev.svc.cluster.local:8080`
- staging: LoadBalancer external IP
- pub-dev: LoadBalancer external IP
- production: LoadBalancer external IP

### 3. Artifactory (Docker Registry & Artifact Repository)

**Environment-Specific Configurations:**
- **Deployments**: `environments/{env}/artifactory-deployment.yaml`
- **ArgoCD applications**: `environments/{env}/artifactory-argocd.yaml`

**Specifications:**
| Environment | Namespace | Replicas | RAM | CPU | Storage | Service Type |
|------------|-----------|----------|-----|-----|---------|--------------|
| dev | artifactory-dev | 1 | 512Mi-1Gi | 250m-500m | emptyDir | ClusterIP |
| staging | artifactory-staging | 1 | 1Gi-2Gi | 500m-1000m | 50Gi PVC | LoadBalancer |
| pub-dev | artifactory-pub-dev | 1 | 1Gi-2Gi | 500m-1000m | 100Gi PVC | LoadBalancer |
| production | artifactory-prod | 2 | 2Gi-4Gi | 1000m-2000m | 200Gi PVC | LoadBalancer |

**Repository Structure:**
- dev: `docker-local-dev` repository
- staging: `docker-local-staging` repository
- pub-dev: `docker-local-pubdev` repository
- production: `docker-local-prod` repository

**Image Tagging Strategy:**
- dev: `script-execution-manager:dev`
- staging: `script-execution-manager:staging`
- pub-dev: `script-execution-manager:pub-dev`
- production: `script-execution-manager:production` and `script-execution-manager:latest`

### 4. MinIO (Object Storage)

**Environment-Specific Configurations:**
- **Deployments**: `environments/{env}/minio-deployment.yaml`
- **ArgoCD applications**: `environments/{env}/minio-argocd.yaml`

**Specifications:**
| Environment | Namespace | Replicas | RAM | CPU | Storage | Service Type |
|------------|-----------|----------|-----|-----|---------|--------------|
| dev | minio-dev | 1 | 256Mi-512Mi | 100m-250m | emptyDir | ClusterIP |
| staging | minio-staging | 1 | 512Mi-1Gi | 250m-500m | 20Gi PVC | LoadBalancer |
| pub-dev | minio-pub-dev | 1 | 512Mi-1Gi | 250m-500m | 50Gi PVC | LoadBalancer |
| production | minio-prod | 2 | 1Gi-2Gi | 500m-1000m | 100Gi PVC | LoadBalancer |

**Bucket Structure:**
- dev: `script-execution-manager-dev`
- staging: `script-execution-manager-staging`
- pub-dev: `script-execution-manager-pubdev`
- production: `script-execution-manager-prod`

### 5. Git (Version Control)

**Environment-Specific Branches:**
- `develop` → dev environment
- `staging` → staging environment
- `pub/dev` → pub-dev environment
- `master` → production environment

**Branch Protection:**
- master: Required reviews, status checks, strict mode
- staging: Required reviews, status checks
- pub/dev: Required reviews, status checks
- develop: Optional reviews, recommended for teams

### 6. ArgoCD (GitOps Deployment)

**Environment-Specific Applications:**
Each tool has its own ArgoCD application per environment:

**Main Application:**
- `script-execution-manager-dev` (develop branch)
- `script-execution-manager-staging` (staging branch)
- `script-execution-manager-pub-dev` (pub/dev branch)
- `script-execution-manager-production` (master branch)

**Jenkins:**
- `jenkins-dev` (develop branch)
- `jenkins-staging` (staging branch)
- `jenkins-pub-dev` (pub/dev branch)
- `jenkins-production` (master branch)

**Artifactory:**
- `artifactory-dev` (develop branch)
- `artifactory-staging` (staging branch)
- `artifactory-pub-dev` (pub/dev branch)
- `artifactory-production` (master branch)

**MinIO:**
- `minio-dev` (develop branch)
- `minio-staging` (staging branch)
- `minio-pub-dev` (pub/dev branch)
- `minio-production` (master branch)

### 7. GitHub Actions (CI/CD Pipeline)

**Environment-Based Deployment:**
The workflow automatically detects environment based on branch:
- Push to `develop` → deploys all tools to dev environment
- Push to `staging` → deploys all tools to staging environment
- Push to `pub/dev` → deploys all tools to pub-dev environment
- Push to `master` → deploys all tools to production environment

**Manual Deployment:**
Workflow dispatch supports environment selection for:
- Individual tool deployment
- Specific environment targeting
- Custom image tagging

## Complete Environment Architecture

### Development Environment
```
dev (develop branch)
├── script-execution-manager-dev
│   ├── 1 replica, 128-256Mi RAM
│   ├── ClusterIP service
│   └── SQLite database
├── jenkins-dev
│   ├── 1 replica, 512Mi-1Gi RAM
│   ├── ClusterIP service
│   └── emptyDir storage
├── artifactory-dev
│   ├── 1 replica, 512Mi-1Gi RAM
│   ├── ClusterIP service
│   └── docker-local-dev repository
└── minio-dev
    ├── 1 replica, 256Mi-512Mi RAM
    ├── ClusterIP service
    └── script-execution-manager-dev bucket
```

### Staging Environment
```
staging (staging branch)
├── script-execution-manager-staging
│   ├── 2 replicas, 256-512Mi RAM
│   ├── LoadBalancer service
│   ├── PostgreSQL database
│   └── Autoscaling (2-5 replicas)
├── jenkins-staging
│   ├── 1 replica, 1Gi-2Gi RAM
│   ├── LoadBalancer service
│   └── 20Gi PVC storage
├── artifactory-staging
│   ├── 1 replica, 1Gi-2Gi RAM
│   ├── LoadBalancer service
│   └── docker-local-staging repository (50Gi)
└── minio-staging
    ├── 1 replica, 512Mi-1Gi RAM
    ├── LoadBalancer service
    └── script-execution-manager-staging bucket (20Gi)
```

### Public Development Environment
```
pub/dev (pub/dev branch)
├── script-execution-manager-pub-dev
│   ├── 3 replicas, 384-768Mi RAM
│   ├── LoadBalancer service
│   ├── PostgreSQL database
│   └── Autoscaling (3-8 replicas)
├── jenkins-pub-dev
│   ├── 1 replica, 1Gi-2Gi RAM
│   ├── LoadBalancer service
│   └── 30Gi PVC storage
├── artifactory-pub-dev
│   ├── 1 replica, 1Gi-2Gi RAM
│   ├── LoadBalancer service
│   └── docker-local-pubdev repository (100Gi)
└── minio-pub-dev
    ├── 1 replica, 512Mi-1Gi RAM
    ├── LoadBalancer service
    └── script-execution-manager-pubdev bucket (50Gi)
```

### Production Environment
```
production (master branch)
├── script-execution-manager-prod
│   ├── 5 replicas, 512Mi-1Gi RAM
│   ├── LoadBalancer service
│   ├── PostgreSQL database
│   └── Autoscaling (5-15 replicas)
├── jenkins-prod
│   ├── 2 replicas, 2Gi-4Gi RAM
│   ├── LoadBalancer service
│   └── 50Gi PVC storage
├── artifactory-prod
│   ├── 2 replicas, 2Gi-4Gi RAM
│   ├── LoadBalancer service
│   └── docker-local-prod repository (200Gi)
└── minio-prod
    ├── 2 replicas, 1Gi-2Gi RAM
    ├── LoadBalancer service
    └── script-execution-manager-prod bucket (100Gi)
```

## Deployment Workflow

### Complete Multi-Tool Deployment

When you push to a branch, the following happens automatically:

1. **GitHub Actions Trigger:**
   - Detects environment based on branch
   - Builds Docker images with environment-specific tags
   - Pushes images to corresponding Artifactory repository

2. **ArgoCD Sync:**
   - Detects changes in git repository
   - Syncs all environment-specific applications
   - Deploys/updates all tools in the target environment

3. **Tool Deployment Order:**
   1. Infrastructure tools (MinIO, Artifactory)
   2. CI/CD tools (Jenkins)
   3. Main application (script-execution-manager)

### Manual Tool-Specific Deployment

You can deploy individual tools to specific environments:

```bash
# Deploy only Jenkins to staging
kubectl apply -f environments/staging/jenkins-deployment.yaml

# Deploy only Artifactory to production
kubectl apply -f environments/production/artifactory-deployment.yaml

# Deploy only MinIO to dev
kubectl apply -f environments/dev/minio-deployment.yaml
```

## Inter-Tool Communication

### Service Discovery

Each environment has its own service endpoints:

**Development:**
- Jenkins: `http://jenkins.jenkins-dev.svc.cluster.local:8080`
- Artifactory: `http://artifactory.artifactory-dev.svc.cluster.local:8080`
- MinIO: `http://minio.minio-dev.svc.cluster.local:9000`

**Staging:**
- Jenkins: `http://jenkins.jenkins-staging.svc.cluster.local:8080`
- Artifactory: `http://artifactory.artifactory-staging.svc.cluster.local:8080`
- MinIO: `http://minio.minio-staging.svc.cluster.local:9000`

**Public Development:**
- Jenkins: `http://jenkins.jenkins-pub-dev.svc.cluster.local:8080`
- Artifactory: `http://artifactory.artifactory-pub-dev.svc.cluster.local:8080`
- MinIO: `http://minio.minio-pub-dev.svc.cluster.local:9000`

**Production:**
- Jenkins: `http://jenkins.jenkins-prod.svc.cluster.local:8080`
- Artifactory: `http://artifactory.artifactory-prod.svc.cluster.local:8080`
- MinIO: `http://minio.minio-prod.svc.cluster.local:9000`

### Environment Variables Configuration

Each environment's `.env` file contains the correct service URLs:

```bash
# Development (.env)
JENKINS_URL=http://jenkins.jenkins-dev.svc.cluster.local:8080
ARTIFACTORY_URL=http://artifactory.artifactory-dev.svc.cluster.local:8080
MINIO_ENDPOINT=http://minio.minio-dev.svc.cluster.local:9000

# Staging (.env)
JENKINS_URL=http://jenkins.jenkins-staging.svc.cluster.local:8080
ARTIFACTORY_URL=http://artifactory.artifactory-staging.svc.cluster.local:8080
MINIO_ENDPOINT=http://minio.minio-staging.svc.cluster.local:9000
```

## Security Considerations

### Credential Management

Each environment uses separate credentials:

- **Jenkins**: Different admin passwords per environment
- **Artifactory**: Separate admin credentials and API keys
- **MinIO**: Unique root user credentials
- **Database**: Separate database users and passwords

### Network Policies

- **dev**: Internal cluster communication only
- **staging**: Restricted external access with authentication
- **pub-dev**: Controlled external access
- **production**: Strict external access with security groups and authentication

### Secrets Management

All environment-specific secrets are managed via:
- Kubernetes Secrets (per namespace)
- Environment-specific `.env` files
- GitHub Secrets (for CI/CD)
- ArgoCD Secrets (for GitOps)

## Monitoring and Logging

### Per-Environment Monitoring

Each environment has separate monitoring:
- **Metrics**: Resource usage, application performance
- **Logs**: Centralized logging with environment tags
- **Alerts**: Environment-specific alerting rules
- **Dashboards**: Separate Grafana dashboards per environment

### Tool-Specific Monitoring

- **Jenkins**: Build metrics, queue length, executor utilization
- **Artifactory**: Storage usage, repository metrics, access logs
- **MinIO**: Bucket usage, request metrics, storage capacity
- **Main Application**: Request metrics, error rates, performance metrics

## Disaster Recovery

### Backup Strategy

Each environment has separate backup policies:
- **dev**: Daily backups, 7-day retention
- **staging**: Daily backups, 30-day retention
- **pub-dev**: Hourly backups, 14-day retention
- **production**: Hourly backups, 90-day retention

### Tool-Specific Backups

- **Jenkins**: Job configurations, build history
- **Artifactory**: Repository metadata, artifacts
- **MinIO**: Bucket data, metadata
- **Main Application**: Database backups, application state

## Cost Optimization

### Resource Scaling

Environment-specific resource allocation:
- **dev**: Minimal resources for cost efficiency
- **staging**: Moderate resources for testing
- **pub-dev**: Higher resources for external access
- **production**: Maximum resources with autoscaling

### Storage Management

- **dev**: ephemeral storage (emptyDir)
- **staging**: moderate persistent storage
- **pub-dev**: higher persistent storage
- **production**: maximum persistent storage with redundancy

## Maintenance

### Environment Promotion

When promoting changes between environments:
1. Test in dev environment
2. Promote infrastructure changes (Jenkins, Artifactory, MinIO)
3. Promote application changes
4. Validate integration between tools
5. Monitor performance and stability

### Tool Updates

- **Jenkins**: Update plugins and core version per environment
- **Artifactory**: Update version and migrate repositories
- **MinIO**: Update version and migrate buckets
- **Main Application**: Update application and dependencies

## Troubleshooting

### Cross-Environment Issues

**Problem:** Application can't connect to Jenkins in staging
**Solution:** 
- Check Jenkins service in staging namespace
- Verify environment variables in staging `.env`
- Check network policies between namespaces

**Problem:** Docker push to Artifactory fails in production
**Solution:**
- Verify Artifactory credentials in GitHub Secrets
- Check Artifactory service availability in production
- Verify repository exists in production Artifactory

### Tool-Specific Issues

**Jenkins Issues:**
- Check Jenkins pod status in respective namespace
- Verify Jenkins service and endpoints
- Review Jenkins logs for errors

**Artifactory Issues:**
- Check Artifactory pod status and storage
- Verify repository configuration
- Check Artifactory logs for storage issues

**MinIO Issues:**
- Check MinIO pod status and storage
- Verify bucket existence and permissions
- Review MinIO logs for access issues

## Summary

The multi-environment setup now provides **complete infrastructure isolation** across all tools:

✅ **Complete Tool Coverage**: All infrastructure tools have environment-specific configurations
✅ **Git Integration**: Branch-based environment management
✅ **ArgoCD GitOps**: Automated deployment for all tools
✅ **CI/CD Pipeline**: Environment-aware build and deployment
✅ **Security**: Separate credentials and access controls per environment
✅ **Scalability**: Environment-specific resource allocation
✅ **Monitoring**: Per-environment monitoring and logging
✅ **Disaster Recovery**: Environment-specific backup strategies

This comprehensive setup ensures that each environment is completely isolated and can be managed independently while maintaining consistency across the infrastructure.