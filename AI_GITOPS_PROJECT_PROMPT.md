# Complete GitOps Project Implementation Prompt

You are a senior DevOps architect with expertise in building end-to-end GitOps projects. Create a complete GitOps project from scratch with the following specifications:

## Project Overview

**Project Name:** Script Execution Manager
**Project Description:** A web-based interface for executing scripts and monitoring jobs using Jenkins, with comprehensive CI/CD pipeline, artifact management, and GitOps deployment using Argo CD.

**Purpose:** Demonstrate a production-ready GitOps workflow with automated code quality checks, Docker image building and pushing to JFrog Artifactory, and Kubernetes deployment managed by Argo CD.

## Technology Stack

### Core Technologies
- **Flask** - Python web framework for the main application
- **JFrog Artifactory** - Universal artifact repository for Docker images and build artifacts
- **Jenkins** - CI/CD automation server for job execution and pipeline automation
- **Kubernetes** - Container orchestration platform for deployment
- **GitHub Actions** - CI/CD pipeline automation
- **Argo CD** - GitOps operator for continuous deployment

### Supporting Technologies
- **SQLite/PostgreSQL** - Database for application data
- **Docker** - Containerization platform
- **Traefik** - Ingress controller (built into k3s)
- **k3s** - Lightweight Kubernetes distribution for local development
- **Python Testing Tools** - Pylint, Flake8, Black, Bandit for code quality

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                     Git Repository (Source of Truth)                       │
│         github.com/Tanmay71710/learning-and-implementation         │
└─────────────────────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                  GitHub Actions (CI Pipeline)                              │
│  • Code Quality Checks (Pylint, Flake8, Black, Bandit)               │
│  • Docker Image Build (multi-platform support)                            │
│  • Push to JFrog Artifactory                                           │
│  • Update Kubernetes manifests                                             │
│  • Trigger ArgoCD synchronization                                       │
│  • Email notifications                                              │
└─────────────────────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    Argo CD (GitOps Operator)                             │
│  • Monitor Git repository for manifest changes                             │
│  • Automatically sync to Kubernetes cluster                             │
│  • Self-heal and prune resources                                          │
│  • Health monitoring and alerting                                          │
└─────────────────────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                   Kubernetes Cluster (k3s)                             │
│  • Deploy application with rolling update                                  │
│  • Manage ConfigMaps and Secrets                                            │
│  • Load balancing with Traefik Ingress                                    │
│  • Health checks and auto-scaling                                            │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Project Structure

Create the following directory structure:

```
script-execution-manager/
├── app.py                      # Main Flask application
├── models.py                   # Database models (SQLAlchemy)
├── requirements.txt              # Python dependencies
├── requirements-dev.txt          # Development dependencies
├── Dockerfile                   # Docker image definition
├── docker-compose.yml             # Local development setup
├── .env.example               # Environment variables template
├── .env                       # Environment variables (local)
├── .pylintrc                  # Pylint configuration
├── k8s/                        # Kubernetes manifests
│   ├── deployment.yaml          # Application deployment
│   ├── service.yaml             # Service configuration
│   ├── configmap.yaml           # Configuration data
│   └── secrets.yaml             # Sensitive data
├── helm/                       # Helm chart for deployment
│   └── script-execution-manager/
│       ├── Chart.yaml
│       ├── values.yaml
│       └── templates/
├── argocd/                      # ArgoCD configuration
│   ├── namespace.yaml            # ArgoCD namespace
│   ├── project.yaml             # ArgoCD project
│   ├── application.yaml         # ArgoCD application
│   ├── app-of-apps.yaml         # Multi-environment setup
│   ├── argocd-cm.yaml            # ArgoCD configuration
│   ├── argocd-rbac-cm.yaml        # RBAC configuration
│   └── argocd-cmd-params-cm.yaml # CLI parameters
├── k8s-demo/                   # Demo application manifests
│   └── nginx-deployment.yaml      # Demo nginx deployment
├── scripts/                     # Executable scripts
│   ├── send_email_notification.py
│   └── generate-artifactory-secret.sh
├── templates/                   # HTML templates for Flask app
│   └── index.html
└── README.md                     # Project documentation
```

## Implementation Requirements

### 1. Flask Application

**Core Features:**
- REST API for script execution
- Web interface for job monitoring
- Jenkins integration with fallback to local execution
- Artifactory integration for Docker image management
- Database integration (SQLite/PostgreSQL/MySQL)
- Health check endpoints for Kubernetes probes
- Email notification capability

**Configuration Requirements:**
- Flask environment variables for configuration
- Database connection string
- Jenkins API credentials
- Artifactory credentials
- Health check endpoints (/api/jenkins/health, /api/artifactory/health)
- Environment separation (development, staging, production)

**Docker Configuration:**
- Python 3.9-slim base image
- Multi-stage Docker build for optimization
- Health check configuration
- Non-root user for security
- Environment variable injection

### 2. JFrog Artifactory

**Repository Configuration:**
- Docker repository (docker-local)
- Maven repository (maven-local)
- Generic repository (generic-local)
- Virtual repository for aggregation

**Configuration Requirements:**
- Repository URL: http://artifactory-service:8082
- Admin credentials for initial setup
- API key for CI/CD automation
- Storage quota configuration
- Cleanup policies for old artifacts

**Integration Points:**
- Docker image storage for CI/CD pipeline
- Build artifact storage
- Dependency proxy for external repositories

### 3. Jenkins Configuration

**Pipeline Configuration:**
- Declarative pipeline (Jenkinsfile)
- Agent configuration for distributed builds
- Credential management for external services
- Webhook integration for external triggers

**Job Configuration:**
- Script execution job with parameters
- Build artifact archiving
- Console output capture
- Email notifications on failure

**Security Configuration:**
- RBAC for access control
- CSRF protection
- Secret management
- Agent authentication

### 4. Kubernetes Deployment

**Manifests Required:**
- Deployment with rolling update strategy
- Service (LoadBalancer or ClusterIP)
- ConfigMap for environment variables
- Secret for sensitive data
- Ingress for external access
- Health checks (liveness/readiness probes)
- Resource limits and requests

**Configuration Requirements:**
- Target cluster: https://kubernetes.default.svc
- Namespace: script-execution-manager
- Docker image reference from Artifactory
- Health check configuration
- Resource limits and requests
- Ingress controller: Traefik

### 5. GitHub Actions Workflows

**Workflow Configuration:**
- Code quality check workflow (Pylint, Flake8, Black, Bandit)
- Docker build and push workflow (multi-platform support)
- Argo CD sync workflow (triggers ArgoCD synchronization)

**Secrets Configuration:**
- Artifactory credentials
- Kubernetes kubeconfig (base64 encoded)
- Email server credentials for notifications

**Triggers:**
- Push to master branch → Production deployment
- Push to develop branch → Staging deployment
- Pull requests → Code quality checks
- Manual dispatch for manual workflows

### 6. Argo CD Configuration

**Installation:**
- Use official ArgoCD manifests from argoproj
- Deploy in argocd namespace
- Configure custom ConfigMaps for repository access and OIDC

**Application Configuration:**
- Application name: script-execution-manager
- Source: GitHub repository
- Target branch: master (production)
- Destination: Kubernetes cluster
- Sync policy: automated with prune and self-healing

**Project Configuration:**
- Single project for all applications
- Multiple destinations for multi-environment support
- Resource whitelisting for security
- RBAC configuration for access control

## Configuration Details

### Flask Application Configuration

**Environment Variables:**
```yaml
FLASK_ENV=production
FLASK_DEBUG=0
DATABASE_URL=sqlite:///script_manager.db
JENKINS_URL=http://jenkins-service:8080
JENKINS_USERNAME=admin
JENKINS_PASSWORD=admin
JENKINS_JOB_NAME=script-execution-job
ARTIFACTORY_URL=http://artifactory-service:8082
ARTIFACTORY_USERNAME=admin
ARTIFACTORY_PASSWORD=password
ARTIFACTORY_REPOSITORY=docker-local
ARTIFACTORY_API_KEY=your-artifactory-api-key
```

### Kubernetes Deployment Configuration

**Deployment Specifications:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: script-execution-manager
  labels:
    app: script-execution-manager
    version: v1
spec:
  replicas: 3
  selector:
    matchLabels:
      app: script-execution-manager
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  template:
    metadata:
      labels:
        app: script-execution-manager
        version: v1
    spec:
      containers:
      - name: script-execution-manager
        image: ARTIFACTORY_URL/ARTIFACTORY_REPOSITORY/script-execution-manager:IMAGE_TAG
        imagePullPolicy: Always
        ports:
        - containerPort: 5000
          name: http
          protocol: TCP
        env:
        - name: FLASK_ENV
          valueFrom:
            configMapKeyRef:
              name: script-execution-manager-config
              key: flask_env
        - name: FLASK_DEBUG
          valueFrom:
            configMapKeyRef:
              name: script-execution-manager-config
              key: flask_debug
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /api/jenkins/health
            port: 5000
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /api/jenkins/health
            port: 5000
          initialDelaySeconds: 10
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 3
```

### ArgoCD Application Configuration

**Application Specifications:**
```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: script-execution-manager
  namespace: argocd
  finalizers:
  - resources-finalizer.argocd.argoproj.io
spec:
  project: script-execution-manager
  source:
    repoURL: https://github.com/Tanmay71710/learning-and-implementation
    targetRevision: master
    path: k8s
  destination:
    server: https://kubernetes.default.svc
    namespace: script-execution-manager
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
    - CreateNamespace=true
  ignoreDifferences:
    - group: apps
      kind: Deployment
      jsonPointers:
      - /spec/replicas
  revisionHistoryLimit: 3
```

## Security Requirements

### 1. Secrets Management

- **Flask Application Secrets:**
  - Database credentials
  - Jenkins API tokens
  - Artifactory credentials
  - Email service credentials

- **Kubernetes Secrets:**
  - Image pull secrets for Artifactory
  - Application configuration secrets
  - Jenkins service account tokens

- **GitHub Actions Secrets:**
  - Artifactory credentials
  - Kubernetes kubeconfig (base64)
  - Email server credentials

### 2. Access Control

- **ArgoCD RBAC:**
  - Admin role for full access
  - Developer role for application management
  - Readonly role for monitoring only

- **Jenkins RBAC:**
  - Admin user for configuration
  - Service account for automation
  - Developer user for job configuration

- **Kubernetes RBAC:**
  - Namespace isolation between applications
  - Service accounts for application access
  - Cluster-admin for cluster management

### 3. Network Security

- **Ingress Configuration:**
  - Use TLS termination at ingress level
  - Implement network policies for pod communication
  - Configure IP whitelisting for admin access

- **Service Mesh:**
  - Implement network policies for microservices
  - Use TLS for all service communication
  - Implement mTLS for service-to-service communication

## Deployment Strategy

### 1. Development Environment

- **Cluster:** Local k3s cluster
- **Branch:** develop
- **Namespace:** script-execution-manager-dev
- **Image Tag:** develop-latest
- **Sync Policy:** Manual sync, no prune
- **Deployment Strategy:** Rolling update

### 2. Staging Environment

- **Cluster:** Staging Kubernetes cluster
- **Branch:** develop
- **Namespace:** script-execution-manager-staging
- **Image Tag:** staging-latest
- **Sync Policy:** Automated sync with prune
- **Deployment Strategy:** Rolling update

### 3. Production Environment

- **Cluster:** Production Kubernetes cluster
- **Branch:** master
- **Namespace:** Application namespace
- **Image Tag:** Semantic version (e.g., v1.0.0)
- **Sync Policy:** Automated sync with prune and self-heal
- **Deployment Strategy:** Rolling update with health checks

## Implementation Steps

### Phase 1: Project Setup

1. **Initialize Git Repository:**
   - Create repository on GitHub
   - Initialize with README.md and .gitignore
   - Set up branch protection rules
   - Configure issue templates

2. **Create Directory Structure:**
   - Create all required directories
   - Set up basic README files
   - Configure .gitignore

### Phase 2: Application Development

1. **Develop Flask Application:**
   - Create app.py with REST API endpoints
   - Implement database models with SQLAlchemy
   - Create HTML templates for web interface
   - Implement Jenkins integration
   - Add Artifactory integration
   - Configure health check endpoints

2. **Add Dependencies:**
   - Create requirements.txt with Flask, SQLAlchemy, requests
   - Create requirements-dev.txt with testing tools
   - Add .pylintrc configuration

3. **Configure Environment:**
   - Create .env.example with all required variables
   - Document each variable purpose
   - Add example values

### Phase 3: Containerization

1. **Create Dockerfile:**
   - Use Python 3.9-slim as base image
   - Implement multi-stage build for optimization
   - Configure health checks
   - Set up non-root user for security
   - Copy application code and dependencies

2. **Create docker-compose.yml:**
   - Define Flask application service
   - Add Jenkins service
   - Add Artifactory service
   - Configure networking between services
   - Add persistent volumes for data

### Phase 4: Kubernetes Deployment

1. **Create Kubernetes Manifests:**
   - Create deployment.yaml for application
   - Create service.yaml for load balancing
   - Create configmap.yaml for configuration
   - Create secrets.yaml for sensitive data
   - Add ingress configuration for external access

2. **Configure Resource Management:**
   - Set resource requests and limits
   - Configure Horizontal Pod Autoscaler
   - Set up network policies
   - Configure persistent storage

### Phase 5: ArgoCD Installation

1. **Install ArgoCD:**
   - Create argocd namespace
   - Apply official ArgoCD manifests
   - Configure custom ConfigMaps

2. **Configure ArgoCD:**
   - Create ArgoCD project
   - Configure repository access
   - Configure RBAC policies
   - Create ArgoCD application

### Phase 6: CI/CD Configuration

1. **GitHub Actions Workflows:**
   - Create code quality check workflow
   - Create Docker build and push workflow
   - Create ArgoCD sync workflow

2. **Configure Secrets:**
   - Add Artifactory credentials to GitHub Secrets
   - Add Kubernetes kubeconfig to GitHub Secrets
   - Add email service credentials to GitHub Secrets

### Phase 7: Testing and Validation

1. **Unit Testing:**
   - Run pytest for unit tests
   - Check code quality with linting tools
   - Validate database models

2. **Integration Testing:**
   - Test Jenkins integration
   - Test Artifactory integration
   - Test GitHub Actions workflows

3. **Deployment Testing:**
   - Deploy to development environment
   - Test deployment locally
   - Validate health checks
   - Test rollback procedures

4. **Production Validation:**
   - Deploy to staging environment
   - Test staging deployment
   - Perform load testing
   - Validate monitoring and logging

## Configuration Requirements

### 1. Environment Variables

**Required Environment Variables:**
```yaml
# Flask Configuration
FLASK_ENV=production
FLASK_DEBUG=0
DATABASE_URL=sqlite:///script_manager.db

# Jenkins Configuration
JENKINS_URL=http://jenkins-service:8080
JENKINS_USERNAME=admin
JENKINS_PASSWORD=admin
JENKINS_JOB_NAME=script-execution-job

# Artifactory Configuration
ARTIFACTORY_URL=http://artifactory-service:8082
ARTIFACTORY_USERNAME=admin
ARTIFACTORY_PASSWORD=password
ARTIFACTORY_REPOSITORY=docker-local
ARTIFACTORY_API_KEY=your-artifactory-api-key

# Kubernetes Configuration
KUBERNETES_NAMESPACE=script-execution-manager
CONTAINER_REGISTRY=artifactory.local:8082
IMAGE_PULL_SECRET=artifactory-registry-secret

# ArgoCD Configuration
ARGOCD_URL=http://argocd-server.argocd.svc.cluster.local
ARGOCD_USERNAME=admin
ARGOCD_PASSWORD=admin
ARGOCD_NAMESPACE=argocd
```

### 2. Docker Image Configuration

**Dockerfile Requirements:**
- Base image: python:3.9-slim
- Work directory: /app
- Exposed port: 5000
- Health check: /api/jenkins/health
- Environment variable injection
- Security: Non-root user

**Docker Compose Configuration:**
- Flask service on port 5000
- Jenkins service on port 8080
- Artifactory service on port 8082
- Network: custom bridge network
- Persistent volumes for data persistence

### 3. ArgoCD Configuration

**Application Configuration:**
- Project name: script-execution-manager
- Source repository: https://github.com/Tanmay71710/## 3. GitOps Workflow

### Development Workflow

1. Developer makes changes to application code
2. Push changes to develop branch
3. GitHub Actions runs code quality checks
4. Tests pass automatically on PR
5. Merge to develop branch
6. Docker image is built and pushed to Artifactory
7. ArgoCD syncs changes to staging environment
8. Testing and validation in staging

### Production Workflow

1. Developer merges PR to master branch
2. GitHub Actions triggers production deployment workflow
3. Docker image is built and pushed to Artifactory
4. GitHub Actions updates image tag in manifests
5. ArgoCD detects changes in Git repository
6. ArgoCD syncs changes to production environment
7. Kubernetes performs rolling update of pods
8. Application deployed with new version

## Best Practices

### 1. GitOps Principles

- Use Git as single source of truth
- Never make manual changes to deployed resources
- All changes must go through Git
- Use descriptive commit messages
- Implement branch protection rules
- Use semantic versioning for releases

### 2. Security Best Practices

- Never commit secrets to repository
- Use environment variables for sensitive data
- Use RBAC for access control
- Implement network policies
- Use HTTPS/TLS for all external access
- Regular security audits

### 3. Deployment Best Practices

- Use rolling updates for zero-downtime
- Implement health checks and readiness probes
- Set resource limits and requests
- Configure Horizontal Pod Autoscaler
- Use persistent storage for stateful applications
- Implement proper logging and monitoring

### 4. Monitoring and Observability

- Implement comprehensive logging
- Set up health checks and monitoring
- Configure alerts for critical failures
- Implement distributed tracing
- Set up log aggregation
- Create dashboards for monitoring

### 5. Testing Strategy

- Unit tests for application code
- Integration tests for external integrations
- End-to-end testing for complete workflow
- Load testing for performance
- Security scanning for vulnerabilities

## Testing and Validation

### 1. Validation Steps

1. **Application Testing:**
   - Test Flask API endpoints
   - Validate database operations
   - Test Jenkins integration
   - Test Artifactory integration

2. **Pipeline Testing:**
   - Test GitHub Actions workflows
   - Validate Docker build process
   - Test Kubernetes deployment
   - Test ArgoCD synchronization

3. **Deployment Testing:**
   - Test deployment to development environment
   - Validate health checks
   - Test rollback procedures
   - Test multi-environment deployment

### 2. Verification Checklist

- [ ] Application builds and runs locally
- [ ] Docker image builds successfully
- [ ] Container registry accessible from cluster
- [ ] Kubernetes manifests are valid YAML
- [ ] ArgoCD can access Git repository
- [ ] ArgoCD can sync to cluster
- [ ] Application is accessible via ingress
- [ ] Health checks are passing
- [ ] Rollback procedures work correctly

## Error Handling

### 1. Common Error Scenarios

**Docker Build Failures:**
- Check Dockerfile syntax
- Verify build context
- Validate base image availability
- Check registry access

**Kubernetes Deployment Failures:**
- Validate manifest YAML syntax
- Check namespace existence
- Verify resource requirements
- Check image pull secrets

**ArgoCD Sync Failures:**
- Verify Git repository access
- Check network connectivity
- Validate application manifest syntax
- Check project permissions

**Application Startup Failures:**
- Check environment variables
- Verify database connectivity
- Check resource availability
- Review application logs

### 2. Recovery Procedures

**Deployment Rollback:**
- Use ArgoCD rollback: `argocd app rollback application-name`
- Use Kubernetes rollback: `kubectl rollout undo deployment/app`
- Revert Git commit if needed

**Secret Rotation:**
- Update secrets in environment variables
- Update GitHub Secrets
- Update Kubernetes Secrets
- Update ArgoCD configuration

**Infrastructure Recovery:**
- Recreate Kubernetes cluster if needed
- Reinstall ArgoCD if needed
- Restore from configuration backup

## Additional Considerations

### 1. Scalability

- Use Horizontal Pod Autoscaler for application scaling
- Implement cluster autoscaling for infrastructure scaling
- Use ApplicationSet for multi-app management
- Implement load balancing for high availability

### 2. Multi-Cluster Deployment

- Configure ArgoCD for multi-cluster management
- Set up cluster federation
- Implement disaster recovery across clusters
- Configure cluster peering

### 3. Advanced Features

- Implement ApplicationSet for multi-app management
- Configure Notifications for sync status
- Implement progressive delivery strategies
- Implement custom resource filters
- Implement pre/post sync hooks

### 4. Developer Experience

- Create developer-friendly documentation
- Implement self-service application creation
- Set up automated testing
- Provide debugging tools and dashboards
- Implement automated deployment workflows

## Success Criteria

The project is considered successfully implemented when:

1. Flask application runs and is accessible
2. Jenkins can execute scripts and monitor jobs
3. Docker images are built and pushed to Artifactory
4. GitHub Actions workflows run successfully
5. ArgoCD syncs changes from Git to cluster
6. Kubernetes deployment is accessible and healthy
7. All health checks are passing
8. Rollback procedures work correctly
9. Security measures are in place
10. Documentation is comprehensive and complete

## Deliverables

1. **Source Code:** Complete, well-structured codebase
2. **Documentation:** Comprehensive documentation for each technology
3. **Docker Images:** Production-ready container images
4. **Kubernetes Manifests:** Production-ready YAML manifests
5. **CI/CD Workflows:** Automated GitHub Actions workflows
6. **Configuration Files:** All configuration files properly configured
7. **Testing Evidence:** Test results and validation reports
8. **Deployment Scripts:** Setup and installation scripts
9. **Security Documentation:** Security configuration guidelines
10. **Troubleshooting Guides: Comprehensive troubleshooting documentation

## Notes

- Use semantic versioning for releases
- Implement proper branch protection rules
- Use environment-specific configurations
- Implement proper secret management
- Regular security audits
- Monitor and optimize performance
- Document all configurations and procedures
- Test thoroughly before production deployment
- Implement backup and disaster recovery procedures