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
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                     Git Repository (Source of Truth)                       │
│         github.com/Tanmay71710/learning-and-implementation         │
└─────────────────────────────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                  GitHub Actions (CI Pipeline)                              │
│  • Code Quality Checks (Pylint, Flake8, Black, Bandit)               │
│  • Docker Image Build (multi-platform support)                            │
│  • Push to JFrog Artifactory                                           │
│  • Update Kubernetes manifests                                             │
│  • Trigger ArgoCD synchronization                                       │
│  • Email notifications                                              │
└─────────────────────────────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                    Argo CD (GitOps Operator)                             │
│  • Monitor Git repository for manifest changes                             │
│  • Automatically sync to Kubernetes cluster                             │
│  • Self-heal and prune resources                                          │
│  • Health monitoring and alerting                                          │
└─────────────────────────────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                   Kubernetes Cluster (k3s)                             │
│  • Deploy application with rolling update                                  │
│  • Manage ConfigMaps and Secrets                                            │
│  • Load balancing with Traefik Ingress                                    │
│  • Health checks and auto-scaling                                            │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
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
- Source repository: https://github.com/Tanmay71710/learning-and-implementation
- Target branch: master (production)
- Destination: Kubernetes cluster
- Namespace: script-execution-manager
- Sync policy: automated with prune and self-healing

**Project Configuration:**
- Single project for all applications
- Multiple destinations for multi-environment support
- Resource whitelisting for security
- RBAC configuration for access control