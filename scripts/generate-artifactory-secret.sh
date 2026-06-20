#!/bin/bash
# Script to generate Kubernetes docker-registry secret for Artifactory

# Configuration
ARTIFACTORY_URL="${ARTIFACTORY_URL:-http://localhost:8082}"
ARTIFACTORY_USERNAME="${ARTIFACTORY_USERNAME:-admin}"
ARTIFACTORY_PASSWORD="${ARTIFACTORY_PASSWORD:-password}"
SECRET_NAME="${SECRET_NAME:-artifactory-registry-secret}"
NAMESPACE="${NAMESPACE:-default}"

# Create dockerconfigjson
AUTH=$(echo -n "${ARTIFACTORY_USERNAME}:${ARTIFACTORY_PASSWORD}" | base64 -w 0)
DOCKER_CONFIG_JSON=$(echo -n "{\"auths\":{\"${ARTIFACTORY_URL}\":{\"username\":\"${ARTIFACTORY_USERNAME}\",\"password\":\"${ARTIFACTORY_PASSWORD}\",\"auth\":\"${AUTH}\"}}}" | base64 -w 0)

# Create Kubernetes secret
kubectl create secret docker-registry ${SECRET_NAME} \
  --docker-server=${ARTIFACTORY_URL} \
  --docker-username=${ARTIFACTORY_USERNAME} \
  --docker-password=${ARTIFACTORY_PASSWORD} \
  --docker-email=admin@example.com \
  --namespace=${NAMESPACE} \
  --dry-run=client -o yaml > k8s/artifactory-registry-secret.yaml

echo "Generated Kubernetes secret file: k8s/artifactory-registry-secret.yaml"
echo "Secret name: ${SECRET_NAME}"
echo "Namespace: ${NAMESPACE}"
echo ""
echo "To apply the secret, run:"
echo "kubectl apply -f k8s/artifactory-registry-secret.yaml"