#!/bin/bash

# Multi-Environment Setup Verification Script
# This script verifies that all required files and configurations are in place

echo "=========================================="
echo "Multi-Environment Setup Verification"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counter for issues
issues=0

# Function to check file existence
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1 exists"
        return 0
    else
        echo -e "${RED}✗${NC} $1 missing"
        ((issues++))
        return 1
    fi
}

# Function to check directory existence
check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $1 exists"
        return 0
    else
        echo -e "${RED}✗${NC} $1 missing"
        ((issues++))
        return 1
    fi
}

echo "Checking base Kubernetes configuration..."
check_dir "k8s-base"
check_file "k8s-base/kustomization.yaml"
check_file "k8s-base/deployment.yaml"
check_file "k8s-base/service.yaml"
check_file "k8s-base/configmap.yaml"
check_file "k8s-base/secrets.yaml"
echo ""

echo "Checking development environment..."
check_dir "environments/dev"
check_file "environments/dev/k8s/kustomization.yaml"
check_file "environments/dev/k8s/deployment-patch.yaml"
check_file "environments/dev/k8s/configmap-patch.yaml"
check_file "environments/dev/k8s/service-patch.yaml"
check_file "environments/dev/helm-values.yaml"
check_file "environments/dev/.env"
check_file "environments/dev/argocd-application.yaml"
echo ""

echo "Checking staging environment..."
check_dir "environments/staging"
check_file "environments/staging/k8s/kustomization.yaml"
check_file "environments/staging/k8s/deployment-patch.yaml"
check_file "environments/staging/k8s/configmap-patch.yaml"
check_file "environments/staging/k8s/service-patch.yaml"
check_file "environments/staging/helm-values.yaml"
check_file "environments/staging/.env"
check_file "environments/staging/argocd-application.yaml"
echo ""

echo "Checking pub-dev environment..."
check_dir "environments/pub-dev"
check_file "environments/pub-dev/k8s/kustomization.yaml"
check_file "environments/pub-dev/k8s/deployment-patch.yaml"
check_file "environments/pub-dev/k8s/configmap-patch.yaml"
check_file "environments/pub-dev/k8s/service-patch.yaml"
check_file "environments/pub-dev/helm-values.yaml"
check_file "environments/pub-dev/.env"
check_file "environments/pub-dev/argocd-application.yaml"
echo ""

echo "Checking production environment..."
check_dir "environments/production"
check_file "environments/production/k8s/kustomization.yaml"
check_file "environments/production/k8s/deployment-patch.yaml"
check_file "environments/production/k8s/configmap-patch.yaml"
check_file "environments/production/k8s/service-patch.yaml"
check_file "environments/production/helm-values.yaml"
check_file "environments/production/.env"
check_file "environments/production/argocd-application.yaml"
echo ""

echo "Checking ArgoCD configuration..."
check_file "argocd/project.yaml"
check_file "argocd/app-of-apps.yaml"
echo ""

echo "Checking GitHub Actions workflow..."
check_file ".github/workflows/docker-build-push-k8s.yml"
echo ""

echo "Checking documentation..."
check_file "MULTI_ENVIRONMENT_SETUP.md"
check_file "MULTI_ENVIRONMENT_REFACTORING_SUMMARY.md"
echo ""

echo "=========================================="
if [ $issues -eq 0 ]; then
    echo -e "${GREEN}All checks passed!${NC}"
    echo "Multi-environment setup is complete."
else
    echo -e "${RED}$issues issue(s) found!${NC}"
    echo "Please review the missing files above."
fi
echo "=========================================="

exit $issues