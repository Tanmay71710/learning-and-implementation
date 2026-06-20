# Comprehensive Monitoring and Observability Implementation Guide

## Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Installation Steps](#installation-steps)
4. [Configuration](#configuration)
5. [Deployment](#deployment)
6. [Verification](#verification)
7. [Troubleshooting](#troubleshooting)
8. [Maintenance](#maintenance)

## Overview

This guide provides step-by-step instructions for implementing a comprehensive monitoring and observability solution for your GitOps project. The solution includes:

- **Prometheus**: Metrics collection and storage
- **Grafana**: Visualization and dashboards
- **Alertmanager**: Alert routing and notifications
- **Loki**: Log aggregation
- **Promtail**: Log collection agent
- **kube-state-metrics**: Kubernetes resource metrics
- **node-exporter**: System-level metrics
- **Application exporters**: Custom metrics for Flask, Jenkins, ArgoCD, Artifactory

## Prerequisites

### System Requirements
- Kubernetes cluster (v1.20+)
- kubectl configured with cluster access
- Helm 3.x installed
- 20GB+ persistent storage available
- 4GB+ RAM for monitoring components
- Multi-cluster support (if applicable)

### Software Requirements
```bash
# Install Helm
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# Verify installation
helm version

# Add required Helm repositories
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add grafana https://grafana.github.io/helm-charts
helm repo update
```

### Network Requirements
- Ingress controller configured (for external access)
- DNS configured for Grafana/Alertmanager endpoints
- Network policies allowing monitoring component communication
- Firewall rules for external alert notifications (Slack, PagerDuty, etc.)

## Installation Steps

### Step 1: Create Monitoring Namespace

```bash
# Create monitoring namespace
kubectl create namespace monitoring

# Create namespace labels for network policies
kubectl label namespace monitoring monitoring=enabled
```

### Step 2: Install Prometheus Stack

```bash
# Install kube-prometheus-stack
helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --values monitoringAPP/manifests/prometheus-stack-values.yaml \
  --set prometheus.prometheusSpec.serviceMonitorSelectorNilUsesHelmValues=false \
  --set prometheus.prometheusSpec.podMonitorSelectorNilUsesHelmValues=false \
  --set prometheus.prometheusSpec.ruleSelectorNilUsesHelmValues=false \
  --wait --timeout 10m
```

### Step 3: Install Loki Stack

```bash
# Install Loki for log aggregation
helm install loki grafana/loki-stack \
  --namespace monitoring \
  --values monitoringAPP/manifests/loki-stack-values.yaml \
  --wait --timeout 10m
```

### Step 4: Configure Application Monitoring

#### 4.1 Update Flask Application

```bash
# Add Prometheus dependencies to requirements.txt
echo "prometheus-flask-exporter==0.22.4" >> requirements.txt
echo "prometheus-client==0.18.0" >> requirements.txt

# Update Flask application with Prometheus integration
# Copy the content from monitoringAPP/manifests/app_with_prometheus.py to your app.py

# Rebuild and deploy Flask application
docker build -t script-execution-manager:latest .
kubectl set image deployment/script-execution-manager script-execution-manager=script-execution-manager:latest
```

#### 4.2 Configure Jenkins Monitoring

```bash
# Apply Jenkins Prometheus configuration
kubectl apply -f monitoringAPP/manifests/jenkins-prometheus-config.yaml

# Install Prometheus Plugin in Jenkins
# 1. Access Jenkins UI
# 2. Navigate to Manage Jenkins -> Manage Plugins
# 3. Search for "Prometheus Plugin"
# 4. Install and restart Jenkins
# 5. Configure Prometheus in Manage Jenkins -> Configure System
```

#### 4.3 Configure ArgoCD Monitoring

```bash
# Apply ArgoCD Prometheus configuration
kubectl apply -f monitoringAPP/manifests/argocd-prometheus-config.yaml

# Update ArgoCD configuration to enable metrics
kubectl patch configmap argocd-cmd-params-cm -n argocd --patch "$(cat monitoringAPP/manifests/argocd-prometheus-config.yaml)"
```

#### 4.4 Configure Artifactory Monitoring

```bash
# Apply Artifactory Prometheus configuration
kubectl apply -f monitoringAPP/manifests/artifactory-prometheus-config.yaml

# Create Artifactory credentials secret
kubectl create secret generic artifactory-credentials \
  --from-literal=username=admin \
  --from-literal=password=dev-password \
  -n artifactory-dev
```

### Step 5: Deploy Grafana Dashboards

```bash
# Create ConfigMap for Grafana dashboards
kubectl create configmap grafana-dashboards \
  --namespace monitoring \
  --from-file=monitoringAPP/manifests/grafana-dashboard-cluster-overview.json \
  --from-file=monitoringAPP/manifests/grafana-dashboard-flask-app.json \
  --from-file=monitoringAPP/manifests/grafana-dashboard-jenkins.json \
  --from-file=monitoringAPP/manifests/grafana-dashboard-argocd.json \
  --from-file=monitoringAPP/manifests/grafana-dashboard-artifactory.json

# Label ConfigMap for automatic dashboard loading
kubectl label configmap grafana-dashboards grafana_dashboard=1
```

### Step 6: Configure GitOps Deployment

```bash
# Apply ArgoCD applications for monitoring stack
kubectl apply -f monitoringAPP/manifests/argocd-prometheus-application.yaml
kubectl apply -f monitoringAPP/manifests/argocd-loki-application.yaml

# Verify applications are created
kubectl get applications -n argocd
```

## Configuration

### Prometheus Configuration

#### Custom Scrape Configurations
Edit `monitoringAPP/manifests/prometheus-stack-values.yaml` to add custom scrape configurations:

```yaml
prometheus:
  prometheusSpec:
    additionalScrapeConfigs:
      - job_name: 'custom-application'
        static_configs:
          - targets: ['custom-app:8080']
```

#### Recording Rules
Add recording rules for complex queries:

```yaml
additionalPrometheusRules:
  - name: recording-rules
    rules:
      - record: job:request_rate
        expr: sum(rate(http_requests_total[5m])) by (job)
```

### Alertmanager Configuration

#### Notification Channels
Configure Slack, PagerDuty, or email notifications:

```yaml
alertmanager:
  config:
    global:
      slack_api_url: 'https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK'
      pagerduty_url: 'https://events.pagerduty.com/v2/enqueue'
```

#### Custom Alert Rules
Add custom alert rules in the Prometheus configuration:

```yaml
additionalPrometheusRules:
  - name: custom-alerts
    rules:
      - alert: CustomAlert
        expr: custom_metric > threshold
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Custom alert triggered"
```

### Grafana Configuration

#### Data Sources
Configure additional data sources:

```yaml
grafana:
  additionalDataSources:
    - name: Loki
      type: loki
      url: http://loki.monitoring.svc.cluster.local:3100
```

#### Authentication
Configure OAuth or LDAP authentication:

```yaml
grafana:
  grafana.ini:
    auth.generic_oauth:
      enabled: true
      client_id: your-client-id
      client_secret: your-client-secret
```

### Loki Configuration

#### Log Retention
Configure log retention policies:

```yaml
loki:
  config:
    limits_config:
      retention_period: 168h  # 7 days
```

#### Storage Configuration
Configure storage backend:

```yaml
loki:
  persistence:
    enabled: true
    size: 20Gi
    storageClass: standard
```

## Deployment

### Manual Deployment

#### Deploy to Development Environment
```bash
# Set context to dev cluster
kubectl config use-context dev-cluster

# Deploy monitoring stack
helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --values monitoringAPP/manifests/prometheus-stack-values.yaml \
  --set global.environment=dev

helm install loki grafana/loki-stack \
  --namespace monitoring \
  --values monitoringAPP/manifests/loki-stack-values.yaml \
  --set global.environment=dev
```

#### Deploy to Production Environment
```bash
# Set context to production cluster
kubectl config use-context prod-cluster

# Deploy monitoring stack with production values
helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --values monitoringAPP/manifests/prometheus-stack-values.yaml \
  --values monitoringAPP/environments/production/prometheus-values.yaml \
  --set global.environment=production

helm install loki grafana/loki-stack \
  --namespace monitoring \
  --values monitoringAPP/manifests/loki-stack-values.yaml \
  --values monitoringAPP/environments/production/loki-values.yaml \
  --set global.environment=production
```

### GitOps Deployment

#### Deploy via ArgoCD
```bash
# Apply ArgoCD applications
kubectl apply -f monitoringAPP/manifests/argocd-prometheus-application.yaml
kubectl apply -f monitoringAPP/manifests/argocd-loki-application.yaml

# Sync applications
argocd app sync prometheus-stack
argocd app sync loki-stack
```

#### Multi-Environment GitOps
```bash
# Apply environment-specific applications
kubectl apply -f monitoringAPP/environments/dev/monitoring/argocd-application.yaml
kubectl apply -f monitoringAPP/environments/staging/monitoring/argocd-application.yaml
kubectl apply -f monitoringAPP/environments/production/monitoring/argocd-application.yaml
```

## Verification

### Verify Prometheus

```bash
# Check Prometheus pods
kubectl get pods -n monitoring -l app.kubernetes.io/name=prometheus

# Check Prometheus targets
kubectl port-forward -n monitoring svc/prometheus-kube-prometheus-prometheus 9090:9090
# Access http://localhost:9090/targets

# Verify metrics are being scraped
curl http://localhost:9090/api/v1/targets
```

### Verify Grafana

```bash
# Check Grafana pods
kubectl get pods -n monitoring -l app.kubernetes.io/name=grafana

# Access Grafana UI
kubectl port-forward -n monitoring svc/prometheus-grafana 3000:3000
# Access http://localhost:3000
# Default credentials: admin/admin

# Verify dashboards are loaded
# Navigate to Dashboards -> Manage
```

### Verify Alertmanager

```bash
# Check Alertmanager pods
kubectl get pods -n monitoring -l app.kubernetes.io/name=alertmanager

# Access Alertmanager UI
kubectl port-forward -n monitoring svc/prometheus-kube-prometheus-alertmanager 9093:9093
# Access http://localhost:9093

# Verify alerts are firing
# Check Alertmanager UI for active alerts
```

### Verify Loki

```bash
# Check Loki pods
kubectl get pods -n monitoring -l app=loki

# Check Promtail pods
kubectl get pods -n monitoring -l app=promtail

# Verify log ingestion
kubectl logs -n monitoring -l app=promtail --tail=50
```

### Verify Application Metrics

```bash
# Check Flask application metrics
kubectl port-forward -n script-execution-manager-dev svc/script-execution-manager 5000:5000
curl http://localhost:5000/metrics

# Check Jenkins metrics
kubectl port-forward -n jenkins-dev svc/jenkins 8080:8080
curl http://localhost:8080/prometheus

# Check ArgoCD metrics
kubectl port-forward -n argocd svc/argocd-metrics 8082:8082
curl http://localhost:8082/metrics

# Check Artifactory metrics
kubectl port-forward -n artifactory-dev svc/artifactory-prometheus-exporter 9521:9521
curl http://localhost:9521/metrics
```

## Troubleshooting

### Common Issues

#### Prometheus Not Scraping Targets
```bash
# Check Prometheus configuration
kubectl get configmap -n monitoring prometheus-kube-prometheus-prometheus -o yaml

# Check ServiceMonitor resources
kubectl get servicemonitor -A

# Verify pod annotations
kubectl get pod <pod-name> -o yaml | grep prometheus.io
```

#### Grafana Dashboards Not Loading
```bash
# Check dashboard ConfigMaps
kubectl get configmap -n monitoring -l grafana_dashboard=1

# Verify Grafana sidecar configuration
kubectl logs -n monitoring -l app.kubernetes.io/name=grafana -c grafana-sc-dashboard

# Restart Grafana
kubectl rollout restart deployment prometheus-grafana -n monitoring
```

#### Alertmanager Not Sending Alerts
```bash
# Check Alertmanager configuration
kubectl get secret -n monitoring prometheus-kube-prometheus-alertmanager -o yaml

# Verify webhook URLs are accessible
curl -X POST https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK

# Check Alertmanager logs
kubectl logs -n monitoring -l app.kubernetes.io/name=alertmanager
```

#### Loki Not Ingesting Logs
```bash
# Check Promtail configuration
kubectl get configmap -n monitoring promtail -o yaml

# Verify Promtail can reach Loki
kubectl exec -n monitoring -l app=promtail -- curl http://loki.monitoring.svc.cluster.local:3100/ready

# Check Promtail logs
kubectl logs -n monitoring -l app=promtail
```

### Debug Commands

```bash
# Check monitoring component health
kubectl get pods -n monitoring
kubectl get svc -n monitoring
kubectl get pvc -n monitoring

# Check resource usage
kubectl top pods -n monitoring
kubectl top nodes

# Check logs
kubectl logs -n monitoring -l app.kubernetes.io/name=prometheus
kubectl logs -n monitoring -l app.kubernetes.io/name=grafana
kubectl logs -n monitoring -l app.kubernetes.io/name=alertmanager

# Port-forward for local access
kubectl port-forward -n monitoring svc/prometheus-kube-prometheus-prometheus 9090:9090
kubectl port-forward -n monitoring svc/prometheus-grafana 3000:3000
kubectl port-forward -n monitoring svc/prometheus-kube-prometheus-alertmanager 9093:9093
```

## Maintenance

### Regular Maintenance Tasks

#### Backup Configurations
```bash
# Backup Prometheus configuration
kubectl get configmap -n monitoring prometheus-kube-prometheus-prometheus -o yaml > prometheus-backup.yaml

# Backup Grafana dashboards
kubectl get configmap -n monitoring -l grafana_dashboard=1 -o yaml > grafana-dashboards-backup.yaml

# Backup Alertmanager configuration
kubectl get secret -n monitoring prometheus-kube-prometheus-alertmanager -o yaml > alertmanager-backup.yaml
```

#### Update Monitoring Stack
```bash
# Update Helm charts
helm repo update
helm upgrade prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --values monitoringAPP/manifests/prometheus-stack-values.yaml

helm upgrade loki grafana/loki-stack \
  --namespace monitoring \
  --values monitoringAPP/manifests/loki-stack-values.yaml
```

#### Clean Up Old Metrics
```bash
# Configure Prometheus retention
# Edit prometheus-stack-values.yaml
prometheus:
  prometheusSpec:
    retention: 15d  # Adjust as needed
    retentionSize: 10GB
```

#### Monitor Monitoring Stack
```bash
# Set up monitoring for monitoring components
# Add self-monitoring ServiceMonitors
kubectl apply -f monitoringAPP/manifests/self-monitoring.yaml
```

### Scaling Considerations

#### Scale Prometheus for High Cardinality
```yaml
prometheus:
  prometheusSpec:
    replicas: 2
    resources:
      limits:
        cpu: 2000m
        memory: 4Gi
      requests:
        cpu: 1000m
        memory: 2Gi
```

#### Scale Loki for High Log Volume
```yaml
loki:
  replicas: 3
  resources:
    limits:
      cpu: 1000m
      memory: 2Gi
    requests:
      cpu: 500m
      memory: 1Gi
```

### Disaster Recovery

#### Restore from Backup
```bash
# Restore Prometheus configuration
kubectl apply -f prometheus-backup.yaml

# Restore Grafana dashboards
kubectl apply -f grafana-dashboards-backup.yaml

# Restore Alertmanager configuration
kubectl apply -f alertmanager-backup.yaml
```

#### Emergency Procedures
```bash
# If monitoring stack is unresponsive, scale down and up
kubectl scale deployment prometheus-kube-prometheus-prometheus -n monitoring --replicas=0
kubectl scale deployment prometheus-kube-prometheus-prometheus -n monitoring --replicas=1

# Clear persistent storage if corrupted (WARNING: data loss)
kubectl delete pvc -n monitoring prometheus-prometheus-kube-prometheus-prometheus-db-prometheus-prometheus-kube-prometheus-prometheus-0
```

## Next Steps

1. **Customize Dashboards**: Modify dashboards for your specific needs
2. **Configure Alerts**: Set up alert routing for your team
3. **Set Up Notification Channels**: Configure Slack, PagerDuty, email
4. **Implement Advanced Features**: Add distributed tracing, metrics aggregation
5. **Document Runbooks**: Create operational procedures for common issues
6. **Train Team**: Provide training on monitoring stack usage

## Support

For issues and questions:
- Check the troubleshooting section above
- Review logs from affected components
- Verify configuration files
- Check component health status
- Review documentation for individual components

This comprehensive monitoring solution provides complete observability for your GitOps project, ensuring you have the visibility needed to maintain reliable operations.