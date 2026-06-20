# Database and Artifactory Integration Guide

This document provides comprehensive information about the database integration and JFrog Artifactory setup for the Script Execution Manager.

## Database Integration

### Overview
The application now uses SQLAlchemy ORM with SQLite database (configurable for other databases) to store:
- Script information and metadata
- Job execution history
- Docker image records
- Jenkins configuration status
- Artifactory configuration status
- System metrics and analytics

### Database Models

#### 1. Script Model
Stores script information and metadata:
- `id`: Primary key
- `name`: Script filename (unique)
- `path`: Full file system path
- `description`: Script description
- `created_at`, `updated_at`: Timestamps
- `is_active`: Active status flag

#### 2. JobExecution Model
Tracks all script executions:
- `id`: Primary key
- `script_id`: Foreign key to Script
- `execution_type`: 'jenkins' or 'local'
- `status`: 'queued', 'running', 'success', 'failure'
- `jenkins_queue_id`: Jenkins queue identifier
- `jenkins_build_number`: Jenkins build number
- `jenkins_job_url`: Jenkins job URL
- `parameters`: JSON string of parameters
- `output`: Script output
- `error_message`: Error details
- `started_at`, `completed_at`: Execution timestamps
- `duration_seconds`: Execution duration

#### 3. DockerImage Model
Manages Docker image information:
- `id`: Primary key
- `image_name`: Docker image name
- `tag`: Image tag
- `repository`: Artifactory repository
- `artifactory_path`: Path in Artifactory
- `digest`: Image digest
- `size_bytes`: Image size
- `build_id`: Associated job execution
- `pushed_to_artifactory`: Push status
- `artifactory_url`: Full Artifactory URL
- `created_at`, `pushed_at`: Timestamps

#### 4. JenkinsConfig Model
Stores Jenkins configuration and health status:
- `id`: Primary key
- `jenkins_url`: Jenkins server URL
- `job_name`: Default job name
- `is_active`: Active status
- `last_health_check`: Last health check time
- `health_status`: 'healthy', 'unhealthy', 'unknown'
- `last_error`: Last error message
- `created_at`, `updated_at`: Timestamps

#### 5. ArtifactoryConfig Model
Stores Artifactory configuration and health status:
- `id`: Primary key
- `artifactory_url`: Artifactory server URL
- `repository`: Default repository
- `username`, `api_key`, `access_token`: Authentication
- `is_active`: Active status
- `last_health_check`: Last health check time
- `health_status`: Health status
- `last_error`: Last error message
- `created_at`, `updated_at`: Timestamps

#### 6. SystemMetrics Model
Stores system analytics:
- `id`: Primary key
- `metric_type`: Type of metric
- `metric_value`: Metric value
- `metric_date`: Timestamp
- `additional_data`: JSON for additional context

### Database Configuration

#### Environment Variables
```env
DATABASE_URL=sqlite:///script_manager.db
```

#### Supported Databases
- SQLite (default): `sqlite:///script_manager.db`
- PostgreSQL: `postgresql://user:password@localhost/dbname`
- MySQL: `mysql://user:password@localhost/dbname`
- Oracle: `oracle://user:password@localhost/dbname`

### Database API Endpoints

#### Get Job History
```http
GET /api/history?limit=50
```
Returns recent job execution records.

#### Get Statistics
```http
GET /api/statistics
```
Returns execution statistics including success rates.

#### Get Database Scripts
```http
GET /api/scripts/db
```
Returns scripts stored in database.

#### Get Execution Details
```http
GET /api/executions/<execution_id>
```
Returns detailed information about a specific execution.

### Database Operations

#### Automatic Operations
- Script records are created automatically on first execution
- Job executions are tracked automatically
- Health checks update configuration records
- Docker image pushes create database records

#### Manual Database Access
```python
from models import db, Script, JobExecution

# Get all scripts
scripts = Script.query.all()

# Get recent executions
recent_executions = JobExecution.query.order_by(JobExecution.created_at.desc()).limit(10).all()

# Get statistics
total_executions = JobExecution.query.count()
successful = JobExecution.query.filter_by(status='success').count()
```

### Database Migration

For production use, consider using Flask-Migrate for database migrations:

```bash
pip install Flask-Migrate

# Initialize migration
flask db init

# Create migration
flask db migrate -m "Initial migration"

# Apply migration
flask db upgrade
```

## JFrog Artifactory Integration

### Overview
The application integrates with JFrog Artifactory for Docker image storage and management. This includes:
- Docker image building and pushing
- Image metadata storage in database
- Artifactory health monitoring
- Image repository management

### Artifactory Configuration

#### Environment Variables
```env
ARTIFACTORY_URL=http://localhost:8082
ARTIFACTORY_USERNAME=your_artifactory_username
ARTIFACTORY_PASSWORD=your_artifactory_password
ARTIFACTORY_REPOSITORY=docker-local
ARTIFACTORY_API_KEY=your_artifactory_api_key
```

#### Artifactory Setup

1. **Install Artifactory**
   ```bash
   # Using Docker
   docker run -d --name artifactory \
     -p 8082:8082 -p 8081:8081 \
     releases-docker.jfrog.io/jfrog/artifactory-oss:latest
   ```

2. **Create Docker Repository**
   - Log in to Artifactory (default: admin/password)
   - Navigate to Administration → Repositories → Repositories → Local
   - Click "New Local Repository"
   - Choose "Docker" as package type
   - Set repository name (e.g., `docker-local`)
   - Configure settings and save

3. **Generate API Key**
   - Navigate to Administration → Profile → API Keys
   - Click "Generate API Key"
   - Copy and store the API key securely

### Artifactory API Endpoints

#### Health Check
```http
GET /api/artifactory/health
```
Checks Artifactory connectivity and updates database.

#### Get Docker Images
```http
GET /api/artifactory/images
```
Returns all Docker images stored in database.

#### Push Image
```http
POST /api/artifactory/push
Content-Type: application/json

{
  "image_name": "my-app",
  "tag": "latest",
  "execution_id": 123
}
```
Registers a Docker image push to Artifactory.

#### Build and Push Image
```http
POST /api/docker/build
Content-Type: application/json

{
  "dockerfile_path": "Dockerfile",
  "image_name": "script-execution-manager",
  "tag": "latest",
  "execution_id": 123
}
```
Builds Docker image and pushes to Artifactory.

### Docker Integration Workflow

#### 1. Build Image
```bash
docker build -t my-app:latest .
```

#### 2. Tag for Artifactory
```bash
docker tag my-app:latest \
  localhost:8082/docker-local/my-app:latest
```

#### 3. Login to Artifactory
```bash
docker login localhost:8082
```

#### 4. Push to Artifactory
```bash
docker push localhost:8082/docker-local/my-app:latest
```

### Artifactory Best Practices

#### Repository Organization
- Use separate repositories for different environments (dev, staging, prod)
- Implement repository cleanup policies
- Use descriptive naming conventions
- Implement access control and permissions

#### Image Tagging
- Use semantic versioning (e.g., v1.0.0, v1.0.1)
- Use 'latest' for development only
- Use git commit hashes for reproducibility
- Use environment-specific tags (dev, staging, prod)

#### Security
- Rotate API keys regularly
- Use separate credentials for different environments
- Implement repository permissions
- Scan images for vulnerabilities
- Use Artifactory Xray for security scanning

### Docker Compose Integration

The updated `docker-compose.yml` includes Artifactory service:

```yaml
artifactory:
  image: releases-docker.jfrog.io/jfrog/artifactory-oss:latest
  ports:
    - "8082:8082"
    - "8081:8081"
  environment:
    - ARTIFACTORY_ADMIN_USERNAME=${ARTIFACTORY_ADMIN_USERNAME:-admin}
    - ARTIFACTORY_ADMIN_PASSWORD=${ARTIFACTORY_ADMIN_PASSWORD:-password}
  volumes:
    - artifactory_data:/var/opt/jfrog/artifactory
  networks:
    - app-network
```

### Monitoring and Maintenance

#### Health Checks
- Automated health checks every 5 minutes
- Database records health status
- Alerts on connection failures

#### Cleanup and Maintenance
- Regular database cleanup of old records
- Artifactory repository cleanup policies
- Monitor storage usage
- Review and optimize database queries

#### Backup Strategies
- Regular database backups
- Artifactory repository backups
- Configuration backups
- Disaster recovery planning

## Troubleshooting

### Database Issues

#### Database Locked Error
```bash
# Check for locked database
lsof script_manager.db

# Kill process if needed
kill -9 <PID>
```

#### Migration Issues
```bash
# Reset database (development only)
rm script_manager.db
python app.py  # Database will be recreated
```

### Artifactory Issues

#### Connection Refused
- Verify Artifactory is running
- Check URL and port configuration
- Verify network connectivity
- Check firewall rules

#### Authentication Failures
- Verify username and password
- Check API key validity
- Ensure user has proper permissions
- Check authentication method

#### Docker Push Failures
- Verify Docker login
- Check repository exists
- Verify image tag format
- Check available disk space

### Performance Optimization

#### Database Optimization
- Add indexes on frequently queried fields
- Use connection pooling
- Implement query caching
- Regular database maintenance

#### Artifactory Optimization
- Use CDN for distribution
- Implement repository caching
- Optimize storage layout
- Monitor and cleanup old images

## Security Considerations

### Database Security
- Use strong database passwords
- Implement proper user permissions
- Encrypt sensitive data
- Regular security audits
- Backup and recovery plans

### Artifactory Security
- Use HTTPS in production
- Implement access control
- Regular credential rotation
- Security scanning integration
- Audit logging

### Docker Security
- Scan images for vulnerabilities
- Use minimal base images
- Implement image signing
- Regular dependency updates
- Runtime security monitoring

## Advanced Configuration

### Database Replication
For high availability, consider database replication:
- Master-slave replication
- Load balancing
- Automatic failover
- Consistent backups

### Artifactory High Availability
- Artifactory HA configuration
- Load balancing
- Geographic distribution
- Disaster recovery

### Integration with CI/CD
- Jenkins pipeline integration
- GitLab CI integration
- GitHub Actions integration
- Automated testing and deployment

## Monitoring and Analytics

### Database Monitoring
- Query performance monitoring
- Connection pool monitoring
- Storage usage tracking
- Performance metrics

### Artifactory Monitoring
- Repository usage metrics
- Download/upload statistics
- Performance monitoring
- User activity tracking

### System Metrics
- CPU and memory usage
- Network performance
- Disk I/O metrics
- Application performance

This comprehensive integration provides a robust foundation for managing script executions, Docker images, and artifacts with full traceability and monitoring capabilities.