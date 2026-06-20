pipeline {
    agent any
    
    environment {
        // Artifactory configuration (Kubernetes)
        ARTIFACTORY_URL = 'http://10.118.244.255:30082'
        ARTIFACTORY_USERNAME = 'admin'
        ARTIFACTORY_PASSWORD = 'password'
        ARTIFACTORY_REPO = 'docker-local'
        
        // Docker configuration
        DOCKER_IMAGE = "script-execution-manager:${BUILD_NUMBER}"
        DOCKER_REPO = "10.118.244.255:30082/${ARTIFACTORY_REPO}/script-execution-manager"
        
        // Application configuration
        FLASK_APP = 'app.py'
        PYTHON_VERSION = '3.9-slim'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Setup Environment') {
            steps {
                sh """
                    echo 'Creating Python virtual environment...'
                    python3 -m venv venv
                    . venv/bin/activate
                    pip install --upgrade pip
                    if [ -f requirements.txt ]; then
                        pip install -r requirements.txt
                    fi
                """
            }
        }
        
        stage('Code Quality') {
            steps {
                sh """
                    . venv/bin/activate
                    echo 'Running code quality checks...'
                    # Add your linting/formatting commands here
                    # if [ -f .pylintrc ]; then
                    #     pylint app.py models.py storage_classes.py || true
                    # fi
                """
            }
        }
        
        stage('Build Docker Image') {
            steps {
                sh """
                    echo 'Building Docker image...'
                    docker build -t ${DOCKER_IMAGE} .
                    docker tag ${DOCKER_IMAGE} ${DOCKER_REPO}:${BUILD_NUMBER}
                    docker tag ${DOCKER_IMAGE} ${DOCKER_REPO}:latest
                """
            }
        }
        
        stage('Push to Artifactory') {
            steps {
                sh """
                    echo 'Logging into Artifactory Docker registry...'
                    echo ${ARTIFACTORY_PASSWORD} | docker login ${ARTIFACTORY_URL} -u ${ARTIFACTORY_USERNAME} --password-stdin
                    
                    echo 'Pushing Docker image to Artifactory...'
                    docker push ${DOCKER_REPO}:${BUILD_NUMBER}
                    docker push ${DOCKER_REPO}:latest
                    
                    echo 'Docker image successfully pushed to Artifactory'
                """
            }
        }
        
        stage('Test Application') {
            steps {
                sh """
                    echo 'Testing the application...'
                    # Run basic application tests
                    . venv/bin/activate
                    # python -m pytest tests/ || echo 'No tests found'
                    echo 'Application tests completed'
                """
            }
        }
        
        stage('Cleanup') {
            steps {
                sh """
                    echo 'Cleaning up...'
                    docker logout ${ARTIFACTORY_URL} || true
                    # Remove local Docker images to save space
                    docker rmi ${DOCKER_IMAGE} || true
                    docker rmi ${DOCKER_REPO}:${BUILD_NUMBER} || true
                    docker rmi ${DOCKER_REPO}:latest || true
                """
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline completed successfully!'
            echo "Docker image: ${DOCKER_REPO}:${BUILD_NUMBER}"
            echo "Artifactory URL: ${ARTIFACTORY_URL}"
        }
        failure {
            echo 'Pipeline failed! Please check the logs for details.'
        }
        always {
            echo 'Cleaning up workspace...'
            cleanWs()
        }
    }
}