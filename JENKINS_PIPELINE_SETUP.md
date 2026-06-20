# Jenkins Pipeline Setup

This repository now includes a Jenkins pipeline for automated CI/CD.

## Manual Jenkins Configuration Required

Since Jenkins CSRF protection prevents automated configuration, please complete these steps manually:

### 1. Configure Artifactory Credentials in Jenkins

1. Go to `Manage Jenkins` → `Credentials` → `System` → `Global credentials`
2. Click `Add Credentials`
3. Select:
   - Kind: `Username with password`
   - Scope: `Global`
   - Username: `admin`
   - Password: `password`
   - ID: `artifactory-credentials`
   - Description: `Artifactory Admin Credentials`
4. Click `Create`

### 2. Configure Artifactory Server in Jenkins (Optional)

1. Go to `Manage Jenkins` → `Configure System`
2. Scroll to `Artifactory` section
3. Click `Add Artifactory Server`
4. Configure:
   - Name: `Artifactory Server`
   - Artifactory URL: `http://10.118.244.255:9082`
   - Credentials: Select `artifactory-credentials`
5. Click `Test Connection` to verify
6. Click `Save`

### 3. Configure Email Notifications (Optional)

1. Go to `Manage Jenkins` → `Configure System`
2. Scroll to `E-mail Notification` section
3. Configure your SMTP server settings
4. Click `Save`

## Create Jenkins Pipeline Job

1. Go to Jenkins dashboard → `New Item`
2. Enter item name: `script-execution-manager`
3. Select `Pipeline` and click `OK`
4. Configure:
   - **Pipeline** section:
     - Definition: `Pipeline script from SCM`
     - SCM: `Git`
     - Repository URL: Your repository URL
     - Script Path: `Jenkinsfile`
5. Click `Save`

## Pipeline Stages

The Jenkinsfile includes the following stages:

1. **Checkout** - Clone the repository
2. **Setup Environment** - Create Python virtual environment and install dependencies
3. **Code Quality** - Run linting and formatting checks
4. **Build Docker Image** - Build Docker image for the application
5. **Push to Artifactory** - Push Docker image to Artifactory registry
6. **Deploy to Kubernetes** - Deploy to Kubernetes (only on main/master branches)
7. **Cleanup** - Clean up Docker images and workspace

## Environment Variables

The pipeline uses these environment variables (configured in Jenkinsfile):

- `ARTIFACTORY_URL`: http://10.118.244.255:9082
- `ARTIFACTORY_CREDENTIALS`: Jenkins credentials ID
- `ARTIFACTORY_REPO`: docker-local
- `DOCKER_IMAGE`: script-execution-manager:BUILD_NUMBER
- `DOCKER_REPO`: Artifactory Docker repository path

## Running the Pipeline

1. Make sure you have configured the credentials as above
2. Go to the Jenkins job you created
3. Click `Build Now`
4. Monitor the console output for progress

## Troubleshooting

### Docker Login Issues
If you encounter Docker login issues with Artifactory:
1. Verify Artifactory is running: `docker ps | grep artifactory`
2. Check Artifactory URL is correct: http://10.118.244.255:9082
3. Verify credentials are correct (admin/password)

### Kubernetes Deployment Issues
The Kubernetes deployment stage is conditional and only runs on main/master branches. If you don't have Kubernetes set up, this stage will be skipped or you can remove it from the Jenkinsfile.

### Permission Issues
Make sure Jenkins has permission to:
- Access Docker socket
- Execute kubectl commands (if using Kubernetes)
- Write to the workspace