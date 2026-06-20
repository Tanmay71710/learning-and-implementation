# Script Execution Manager with Jenkins Integration

A web-based interface for executing scripts and monitoring jobs using Jenkins. This application provides a Flask API with a modern web UI for managing script execution, complete with database integration and JFrog Artifactory support for Docker image management.

## Features

- **Web Interface**: Modern, responsive UI for script execution
- **Jenkins Integration**: Trigger and monitor Jenkins jobs
- **Local Execution**: Fallback to local script execution
- **Real-time Monitoring**: Track job status and view console output
- **Parameter Support**: Pass JSON parameters to scripts
- **Health Checks**: Monitor Jenkins and Artifactory connectivity
- **Database Integration**: SQLite/PostgreSQL/MySQL support for job history and analytics
- **Docker Image Management**: Build and push Docker images to JFrog Artifactory
- **Job History**: Complete audit trail of all script executions
- **Statistics Dashboard**: Execution analytics and success rates
- **Artifact Repository**: Integration with JFrog Artifactory for Docker image storage
- **GitHub Actions**: Automated code quality checks with email notifications

## Prerequisites

- Python 3.8+
- Jenkins server (optional, can run in local mode)
- JFrog Artifactory server (optional, for Docker image storage)
- Docker (optional, for Docker image building and pushing)
- pip package manager

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd learning
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your Jenkins credentials
```

## Configuration

Edit the `.env` file with your Jenkins, Artifactory, and database configuration:

```env
# Jenkins Configuration
JENKINS_URL=http://localhost:8080
JENKINS_USERNAME=your_username
JENKINS_PASSWORD=your_api_token
JENKINS_JOB_NAME=script-execution-job

# Artifactory Configuration
ARTIFACTORY_URL=http://localhost:8082
ARTIFACTORY_USERNAME=your_artifactory_username
ARTIFACTORY_PASSWORD=your_artifactory_password
ARTIFACTORY_REPOSITORY=docker-local
ARTIFACTORY_API_KEY=your_artifactory_api_key

# Database Configuration
DATABASE_URL=sqlite:///script_manager.db
```

### Database Setup

The application automatically creates the SQLite database on first run. For other databases:

```env
# PostgreSQL
DATABASE_URL=postgresql://user:password@localhost/dbname

# MySQL
DATABASE_URL=mysql://user:password@localhost/dbname
```

For detailed database setup and Artifactory integration, see [DATABASE_ARTIFACTORY_SETUP.md](DATABASE_ARTIFACTORY_SETUP.md).

### Jenkins Setup

1. Create a Jenkins job named `script-execution-job` (or customize the name in .env)
2. Configure the job as a Freestyle project
3. Add a string parameter named `SCRIPT_NAME`
4. Add a build step that executes scripts from your workspace
5. Enable "Trigger builds remotely" with an authentication token if needed

Example Jenkins build step (for shell scripts):
```bash
#!/bin/bash
cd /path/to/your/scripts
./$SCRIPT_NAME
```

## Usage

1. Start the Flask application:
```bash
python app.py
```

2. Open your browser and navigate to:
```
http://localhost:5000
```

3. Place your executable scripts in the `scripts/` directory

4. Use the web interface to:
   - Select a script from the dropdown
   - Add optional JSON parameters
   - Choose Jenkins or local execution
   - Monitor job status in real-time

## API Endpoints

### Core Endpoints

### GET `/`
Render the main web interface

### GET `/api/scripts`
Get list of available scripts from file system

### GET `/api/scripts/db`
Get list of scripts stored in database

### POST `/api/execute`
Execute a script
```json
{
  "script_name": "example.sh",
  "parameters": {"key": "value"},
  "use_jenkins": true
}
```

### GET `/api/status/<queue_id>`
Get status of a specific job

### GET `/api/jenkins/health`
Check Jenkins connectivity and update database

### Database Endpoints

### GET `/api/history?limit=50`
Get job execution history from database

### GET `/api/statistics`
Get execution statistics and success rates

### GET `/api/executions/<execution_id>`
Get detailed information about a specific execution

### Artifactory Endpoints

### GET `/api/artifactory/health`
Check Artifactory connectivity and update database

### GET `/api/artifactory/images`
Get list of Docker images stored in database

### POST `/api/artifactory/push`
Register a Docker image push to Artifactory
```json
{
  "image_name": "my-app",
  "tag": "latest",
  "execution_id": 123
}
```

### POST `/api/docker/build`
Build Docker image and push to Artifactory
```json
{
  "dockerfile_path": "Dockerfile",
  "image_name": "script-execution-manager",
  "tag": "latest",
  "execution_id": 123
}
```

## Example Scripts

Create executable scripts in the `scripts/` directory:

### Example: `hello.sh`
```bash
#!/bin/bash
echo "Hello from script execution manager!"
date
```

### Example: `backup.sh`
```bash
#!/bin/bash
echo "Starting backup..."
# Your backup logic here
echo "Backup completed at $(date)"
```

Make sure scripts are executable:
```bash
chmod +x scripts/*.sh
```

## Project Structure

```
learning/
├── .github/
│   └── workflows/
│       └── code-quality-check.yml  # GitHub Actions workflow
├── app.py                      # Main Flask application
├── models.py                   # Database models
├── requirements.txt            # Python dependencies
├── requirements-dev.txt        # Development dependencies
├── .env.example               # Environment variables template
├── .pylintrc                  # Pylint configuration
├── Dockerfile                 # Container definition
├── docker-compose.yml         # Multi-container setup with Artifactory
├── templates/
│   └── index.html             # Web interface
├── scripts/                   # Directory for executable scripts
│   └── send_email_notification.py  # Email notification script
├── DATABASE_ARTIFACTORY_SETUP.md  # Database and Artifactory guide
├── GITHUB_ACTIONS_SETUP.md    # GitHub Actions setup guide
└── README.md                  # This file
```

## Features in Detail

### Web Interface
- Modern gradient design with responsive layout
- Real-time Jenkins status indicator
- Script selection dropdown
- JSON parameter input
- Job monitoring with status updates
- Console output viewing

### Jenkins Integration
- Automatic CRUMB token handling
- Queue management
- Build status tracking
- Console output linking
- Health monitoring

### Local Execution
- Direct script execution
- Output capture
- Error handling
- Timeout protection (5 minutes)

## Docker Deployment

### Docker Compose with Artifactory

The updated `docker-compose.yml` includes Artifactory for Docker image storage:

```bash
# Copy and configure environment
cp .env.example .env
# Edit .env with all required credentials

# Start all services
docker-compose up -d

# Services included:
# - Flask app (port 5000)
# - Jenkins (port 8080)
# - Artifactory (port 8082, 8081)
```

### Individual Docker Deployment

```bash
# Build the image
docker build -t script-execution-manager .

# Run the container
docker run -p 5000:5000 \
  -e JENKINS_URL=http://your-jenkins:8080 \
  -e ARTIFACTORY_URL=http://your-artifactory:8082 \
  -e DATABASE_URL=sqlite:///script_manager.db \
  -v $(pwd)/scripts:/app/scripts \
  -v $(pwd)/script_manager.db:/app/script_manager.db \
  script-execution-manager
```

## CI/CD with GitHub Actions

### Automated Code Quality Checks

The project includes a comprehensive GitHub Actions workflow that automatically:
- Runs code quality checks (Pylint, Flake8, Black, isort)
- Performs security scanning with Bandit
- Sends email notifications to configured recipients
- Comments on pull requests with analysis results

### Setup Instructions

1. **Configure GitHub Secrets** in your repository settings:
   - `EMAIL_SERVER`: SMTP server address
   - `EMAIL_PORT`: SMTP server port
   - `EMAIL_USERNAME`: SMTP username
   - `EMAIL_PASSWORD`: SMTP password/app password
   - `EMAIL_RECIPIENTS`: Comma-separated email addresses

2. **Email Provider Setup**:
   - For Gmail: Enable 2FA and generate app password
   - For Outlook: Use SMTP server `smtp.office365.com`
   - For other providers: Use their SMTP details

3. **Customize Configuration**:
   - Edit `.github/workflows/code-quality-check.yml`
   - Adjust `.pylintrc` for Pylint rules
   - Modify email script for custom notifications

### Workflow Triggers

- Push to `master`, `main`, or `develop` branches
- Pull requests to main branches
- Manual workflow dispatch

For detailed setup instructions, see [GITHUB_ACTIONS_SETUP.md](GITHUB_ACTIONS_SETUP.md).

## Troubleshooting

### Jenkins Connection Issues
- Verify Jenkins URL is correct
- Check username and password/API token
- Ensure Jenkins is accessible from your network
- Check Jenkins security settings

### Artifactory Connection Issues
- Verify Artifactory URL is correct (default port 8082)
- Check username and password/API key
- Ensure Docker repository exists in Artifactory
- Verify network connectivity to Artifactory
- Check Artifactory service is running

### Database Issues
- Check database file permissions
- Verify DATABASE_URL is correct
- Ensure sufficient disk space
- For SQLite, check file is not locked
- Consider database migration for schema changes

### Script Execution Problems
- Verify scripts are executable (`chmod +x`)
- Check script permissions
- Ensure scripts have proper shebang lines
- Review script paths in Jenkins configuration

### Docker Build Issues
- Verify Docker daemon is running
- Check Dockerfile syntax
- Ensure sufficient disk space for images
- Verify Docker registry connectivity
- Check Docker login credentials

### Port Already in Use
Change the port in `app.py`:
```python
app.run(debug=True, host='0.0.0.0', port=5001)  # Use port 5001
```

### GitHub Actions Issues
- Verify GitHub Secrets are properly configured
- Check SMTP server credentials and permissions
- Ensure email provider allows SMTP access
- Review workflow logs for specific error messages
- Test email configuration independently
- Check for rate limiting from email provider

## Security Considerations

- Store sensitive credentials in environment variables
- Use Jenkins API tokens instead of passwords
- Use Artifactory API keys instead of passwords
- Restrict script directory permissions
- Implement authentication for production use
- Use HTTPS in production environments
- Regularly rotate API keys and passwords
- Implement database encryption for sensitive data
- Use Artifactory security scanning for Docker images
- Regular security audits and updates

## Development

To run in development mode:
```bash
export FLASK_ENV=development
export FLASK_DEBUG=1
python app.py
```

## Production Deployment

For production deployment:
- Use a production WSGI server (Gunicorn, uWSGI)
- Set `FLASK_ENV=production`
- Implement proper authentication
- Use HTTPS
- Configure firewall rules
- Set up logging and monitoring

Example with Gunicorn:
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

## License

This project is provided as-is for educational and development purposes.

## Support

For issues and questions, please refer to the project documentation or contact your system administrator.