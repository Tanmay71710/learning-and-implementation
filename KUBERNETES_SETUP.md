# Kubernetes Deployment Guide

Complete guide for deploying the Script Execution Manager to Kubernetes with Artifactory integration.

## Overview

This guide provides step-by-step instructions for:
- Building and pushing Docker images to JFrog Artifactory
- Deploying the application to Kubernetes
- Configuring Kubernetes manifests
- Using Helm for advanced deployments
- Setting up CI/CD with GitHub Actions

## Prerequisites

- Kubernetes cluster (v1.20+)
- kubectl configured
- Docker installed
- JFrog Artifactory instance
- GitHub repository with Actions enabled
- Container registry access

## Architecture

```
GitHub Actions → Docker Build → Artifactory → Kubernetes Deployment
     ↓                 ↓                  ↓                    ↓
  Push Code      Build Image      Store Image       Pull & Deploy
                                    Tag Image          Run Pods
                                    Scan Image        Expose Service
```

## GitHub Actions Setup

### Required Secrets

Configure these secrets in your GitHub repository:

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `ARTIFACTORY_URL` | Artifactory server URL | `http://artifactory.example.com` |
| `ARTIFACTORY_USERNAME` | Artifactory username | `admin` |
| `ARTIFACTORY_PASSWORD` | Artifactory password/API key | `password` |
| `ARTIFACTORY_REPOSITORY` | Docker repository name | `docker-local` |
| `EMAIL_SERVER` | SMTP server for notifications | `smtp.gmail.com` |
| `EMAIL_PORT` | SMTP port | `587` |
| `EMAIL_USERNAME` | SMTP username | `your-email@gmail.com` |
| `EMAIL_PASSWORD` | SMTP password | `app-password` |
| `EMAIL_RECIPIENTS` | Email recipients | `user1@example.com,user2@example.com` |
| `KUBECONFIG` | Kubernetes kubeconfig (base64) | `base64-encoded-kubeconfig` |

### Workflow Triggers

The workflow triggers on:
- Push to `master`, `main`, or `develop` branches
- Tag pushes (v*)
- Pull requests
- Manual dispatch

### Workflow Jobs

1. **Build and Push Docker Image**
   - Builds Docker image with BuildKit
   - Tags with multiple formats (branch, SHA, semver)
   - Pushes to Artifactory
   - Sends email notification

2. **Deploy to Kubernetes**
   - Configures kubectl
   - Updates manifests with new image
   - Applies ConfigMap and Secrets
   - Deploys application
   - Verifies deployment
   - Sends notification

## Kubernetes Deployment

### Manual Deployment

#### 1. Create Namespace

```bash
kubectl create namespace script-execution-manager
```

#### 2. Create Image Pull Secret

```bash
# Generate the secret
./scripts/generate-artifactory-secret.sh

# Or create manually
kubectl create secret docker-registry artifactory-registry-secret \
  --docker-server=your-artifactory-url \
  --docker-username=your-username \
  --docker-password=your-password \
  --namespace=script-execution-manager
```

#### 3. Create ConfigMap

```bash
kubectl apply -f k8s/configmap.yaml -n script-execution-manager
```

#### 4. Create Secrets

```bash
# Update secrets.yaml with actual values
kubectl apply -f k8s/secrets.yaml -n script-execution-manager
```

#### 5. Deploy Application

```bash
kubectl apply -f k8s/deployment.yaml -n script-execution-manager
kubectl apply -f k8s/service.yaml -n script-execution-manager
```

#### 6. Verify Deployment

```bash
# Check pods
kubectl get pods -n script-execution-manager -l app=script-execution-manager

# Check service
kubectl get svc -n script-execution-manager

# Get logs
kubectl logs -n script-execution-manager -l app=script-execution-manager --tail=50

# Describe deployment
kubectl describe deployment script-execution-manager -n script-execution-manager
```

### Helm Deployment

#### 1. Install Helm

```bash
# Linux/Mac
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# Windows
choco install kubernetes-helm
```

#### 2. Create Values File

Create `helm/script-execution-manager/values-production.yaml`:

```yaml
replicaCount: 5

image:
  repository: your-artifactory-url/docker-local/script-execution-manager
  tag: v1.0.0
  pullPolicy: Always

imagePullSecrets:
  - name: artifactory-registry-secret

service:
  type: LoadBalancer
  port: 80
  targetPort: 5000

resources:
  limits:
    cpu: 1000m
    memory: 1Gi
  requests:
    cpu: 500m
    memory: 512Mi

autoscaling:
  enabled: true
  minReplicas: 3
  maxReplicas: 10
  targetCPUUtilizationPercentage: 70

config:
  flaskEnv: production
  flaskDebug: "0"
  logLevel: WARNING

secrets:
  databaseUrl: postgresql://user:password@postgres:5432/dbname
  jenkinsUrl: http://jenkins:8080
  jenkinsUsername: your-username
  jenkinsPassword: your-password
  artifactoryUrl: http://artifactory:8082
  artifactoryUsername: your-username
  artifactoryPassword: your-password
```

#### 3. Deploy with Helm

```bash
# Add Helm repository (if using)
helm repo add myrepo https://charts.example.com

# Install the chart
helm install script-execution-manager helm/script-execution-manager \
  -f helm/script-execution-manager/values-production.yaml \
  -n script-execution-manager \
  --create-namespace

# Upgrade existing deployment
helm upgrade script-execution-manager helm/script-execution-manager \
  -f helm/script-execution-manager/values-production.yaml \
  -n script-execution-manager
```

#### 4. Verify Helm Deployment

```bash
# Check release status
helm status script-execution-manager -n script-execution-manager

# Get release values
helm get values script-execution-manager -n script-execution-manager

# List releases
helm list -n script-execution-manager

# Get manifest
helm get manifest script-execution-manager -n script-execution-manager
```

## Artifactory Integration

### Configure Artifactory for Docker

#### 1. Create Docker Repository

1. Log in to Artifactory
2. Navigate to Administration → Repositories
3. Click "New Local Repository"
4. Select "Docker" as package type
5. Set repository name (e.g., `docker-local`)
6. Configure settings:
   - Tag retention policy
   - Access control
   - Proxy settings
7. Click "Create"

#### 2. Generate API Key

1. Navigate to Administration → Profile → API Keys
2. Click "Generate API Key"
3. Set expiry date
4. Copy and store the key securely

#### 3. Configure Access Control

1. Go to repository permissions
2. Add users/groups with appropriate access
3. Set read/write permissions
4. Configure anonymous access if needed

### Docker Configuration

#### Login to Artifactory

```bash
docker login your-artifactory-url
```

#### Tag Image for Artifactory

```bash
docker tag script-execution-manager:latest \
  your-artifactory-url/docker-local/script-execution-manager:latest
```

#### Push to Artifactory

```bash
docker push your-artifactory-url/docker-local/script-execution-manager:latest
```

## Kubernetes Configuration

### Resource Management

#### CPU and Memory Limits

```yaml
resources:
  requests:
    cpu: 250m
    memory: 256Mi
  limits:
    cpu: 500m
    memory: 512Mi
```

#### Auto-scaling

```yaml
autoscaling:
  enabled: true
  minReplicas: 2
  maxReplicas: 10
  targetCPUUtilizationPercentage: 80
```

### Health Checks

#### Liveness Probe

```yaml
livenessProbe:
  httpGet:
    path: /api/jenkins/health
    port: 5000
  initialDelaySeconds: 30
  periodSeconds: 10
  failureThreshold: 3
```

#### Readiness Probe

```yaml
readinessProbe:
  httpGet:
    path: /api/jenkins/health
    port: 5000
  initialDelaySeconds: 10
  periodSeconds: 5
  failureThreshold: 3
```

### Security Configuration

#### Pod Security Context

```yaml
podSecurityContext:
  runAsNonRoot: true
  runAsUser: 1000
  fsGroup: 1000
```

#### Container Security Context

```yaml
securityContext:
  allowPrivilegeEscalation: false
  readOnlyRootFilesystem: true
  capabilities:
    drop:
    - ALL
```

## Monitoring and Logging

### View Logs

```bash
# All pods
kubectl logs -l app=script-execution-manager -n script-execution-manager

# Specific pod
kubectl logs pod/script-execution-manager-xxx -n script-execution-manager

# Follow logs
kubectl logs -f -l app=script-execution-manager -n script-execution-manager
```

### Monitor Deployment

```bash
# Watch pod status
kubectl get pods -l app=script-execution-manager -n script-execution-manager -w

# Check deployment status
kubectl rollout status deployment/script-execution-manager -n script-execution-manager

# Get events
kubectl get events -n script-execution-manager --sort-by='.lastTimestamp'
```

### Access Application

```bash
# Port forwarding
kubectl port-forward svc/script-execution-manager 8080:80 \
  -n script-execution-manager

# LoadBalancer
kubectl get svc script-execution-manager -n script-execution-manager

# Ingress (if configured)
kubectl get ingress -n script-execution-manager
```

## Troubleshooting

### Pod Not Starting

```bash
# Check pod status
kubectl describe pod script-execution-manager-xxx -n script-execution-manager

# Check logs
kubectl logs script-execution-manager-xxx -n script-execution-manager

# Check events
kubectl get events -n script-execution-manager
```

### Image Pull Errors

```bash
# Verify image pull secret
kubectl get secret artifactory-registry-secret -n script-execution-manager -o yaml

# Test image pull manually
kubectl run test-pod --image=your-artifactory-url/docker-local/script-execution-manager:latest \
  --image-pull-secret=artifactory-registry-secret -n script-execution-manager
```

### Service Not Accessible

```bash
# Check service endpoints
kubectl get endpoints script-execution-manager -n script-execution-manager

# Check service details
kubectl describe svc script-execution-manager -n script-execution-manager

# Test connectivity
kubectl run test-pod --image=busybox -n script-execution-manager --rm -it -- wget -O- http://script-execution-manager/api/jenkins/health
```

### Rollback Deployment

```bash
# Rollback to previous revision
kubectl rollout undo deployment/script-execution-manager -n script-execution-manager

# Rollback to specific revision
kubectl rollout undo deployment/script-execution-manager --to-revision=2 -n script-execution-manager

# Check rollout history
kubectl rollout history deployment/script-execution-manager -n script-execution-manager
```

## Advanced Configuration

### Ingress Configuration

Create `k8s/ingress.yaml`:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: script-execution-manager-ingress
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  tls:
  - hosts:
    - script-execution.example.com
    secretName: script-execution-manager-tls
  rules:
  - host: script-execution.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: script-execution-manager
            port:
              number: 80
```

### Persistent Volume

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: script-execution-manager-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
  storageClassName: standard
```

### ConfigMap for Environment Variables

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  APP_ENV: production
  LOG_LEVEL: INFO
  MAX_WORKERS: "4"
```

## CI/CD Pipeline

### Complete Workflow

1. **Code Push** → Triggers GitHub Actions
2. **Build Image** → Docker builds with BuildKit
3. **Push to Artifactory** → Image stored with tags
4. **Security Scan** → Vulnerability scanning
5. **Update Kubernetes** → Update image tag in manifests
6. **Deploy to Cluster** → Apply new configuration
7. **Health Check** → Verify deployment
8. **Notification** → Send email to team

### Branch Strategy

- **main/master**: Production deployment
- **develop**: Staging deployment
- **feature/***: Development/testing
- **release/***: Pre-production

### Rollback Strategy

```bash
# Quick rollback
kubectl rollout undo deployment/script-execution-manager -n script-execution-manager

# Helm rollback
helm rollback script-execution-manager -n script-execution-manager

# GitHub Actions rollback
# Manually trigger workflow with specific tag
```

## Best Practices

### Image Management
- Use semantic versioning for tags
- Implement image retention policies
- Scan images for vulnerabilities
- Use multi-stage builds for optimization
- Tag images with git commit SHA

### Kubernetes Management
- Use namespace for isolation
- Implement resource quotas
- Use network policies
- Enable pod security policies
- Regular backup of configurations

### Security
- Rotate secrets regularly
- Use RBAC for access control
- Implement network policies
- Use secrets management tools
- Regular security audits

### Monitoring
- Implement Prometheus monitoring
- Set up Grafana dashboards
- Configure alerting rules
- Log aggregation with ELK
- Performance monitoring

## Maintenance

### Regular Tasks

- Update Kubernetes manifests
- Rotate secrets and certificates
- Monitor resource usage
- Update Helm charts
- Review and optimize configurations

### Disaster Recovery

- Backup Kubernetes configurations
- Document recovery procedures
- Test disaster recovery plan
- Maintain backup Artifactory
- Regular restore testing

## Support

For issues and questions:
- Check Kubernetes logs: `kubectl logs`
- Review GitHub Actions logs
- Verify Artifactory connectivity
- Check network policies
- Review resource quotas

This comprehensive guide provides everything needed to deploy and manage the Script Execution Manager on Kubernetes with Artifactory integration.