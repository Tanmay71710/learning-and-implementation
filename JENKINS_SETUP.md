# Jenkins Job Configuration for Script Execution Manager

This document provides instructions for configuring a Jenkins job to work with the Script Execution Manager.

## Manual Setup Instructions

### 1. Create New Job

1. Log in to Jenkins
2. Click "New Item"
3. Enter job name: `script-execution-job` (or customize in .env)
4. Select "Freestyle project"
5. Click "OK"

### 2. Configure Job Parameters

1. In the job configuration page, check "This project is parameterized"
2. Add a "String Parameter":
   - Name: `SCRIPT_NAME`
   - Description: "Name of the script to execute"
   - Default Value: (leave empty)

### 3. Configure Build Environment

1. Check "Use secret text(s) or file(s)" if you need additional credentials
2. Add any required environment variables

### 4. Add Build Step

1. Under "Build", click "Add build step"
2. Select "Execute shell"
3. Add the following script:

```bash
#!/bin/bash
# Navigate to scripts directory
cd /path/to/your/scripts

# Make script executable
chmod +x "$SCRIPT_NAME"

# Execute the script
./"$SCRIPT_NAME"

# Check exit code
if [ $? -eq 0 ]; then
    echo "Script executed successfully"
else
    echo "Script execution failed"
    exit 1
fi
```

**Important**: Replace `/path/to/your/scripts` with the actual path to your scripts directory on the Jenkins server.

### 5. Configure Post-Build Actions (Optional)

1. Add "Email Notifications" if you want email alerts
2. Add "Archive the artifacts" if your scripts generate output files
3. Configure "Publish JUnit test results" if your scripts generate test reports

### 6. Enable Remote Builds

1. Under "Build Triggers", check "Trigger builds remotely"
2. Set an authentication token (e.g., `script-execution-token`)
3. Note: You may need to configure CSRF protection in Jenkins global security

### 7. Save Configuration

Click "Save" to save the job configuration.

## Alternative: Jenkins Pipeline Configuration

If you prefer using Jenkins Pipeline (Jenkinsfile), create a `Jenkinsfile` in your project:

```groovy
pipeline {
    agent any
    
    parameters {
        string(name: 'SCRIPT_NAME', description: 'Name of the script to execute')
    }
    
    stages {
        stage('Execute Script') {
            steps {
                script {
                    sh """
                        cd /path/to/your/scripts
                        chmod +x "${params.SCRIPT_NAME}"
                        ./"${params.SCRIPT_NAME}"
                    """
                }
            }
        }
    }
    
    post {
        success {
            echo 'Script executed successfully'
        }
        failure {
            echo 'Script execution failed'
        }
    }
}
```

## Docker Compose Setup

If using the provided docker-compose.yml:

1. Start the services:
```bash
docker-compose up -d
```

2. Access Jenkins at `http://localhost:8080`
3. Complete the Jenkins setup wizard
4. Install suggested plugins
5. Create admin user
6. Configure the job as described above

## Security Considerations

1. **Authentication**: Use API tokens instead of passwords
2. **Authorization**: Restrict who can trigger builds
3. **CSRF Protection**: Configure Jenkins CSRF settings properly
4. **Script Validation**: Validate script names to prevent path traversal
5. **Resource Limits**: Set timeout and resource limits on jobs

## Troubleshooting

### Job Not Triggering

- Check Jenkins URL in .env file
- Verify username and API token
- Ensure job name matches exactly
- Check Jenkins logs for errors

### Script Not Found

- Verify scripts directory path in Jenkins configuration
- Ensure Jenkins agent has access to the scripts directory
- Check file permissions

### Permission Issues

- Ensure Jenkins user has execute permissions on scripts
- Check directory permissions
- Consider running Jenkins with appropriate user

## Advanced Configuration

### Multiple Script Directories

You can modify the job to support multiple script directories:

```bash
#!/bin/bash
SCRIPT_DIR="/path/to/scripts/$CATEGORY"
cd "$SCRIPT_DIR"
./"$SCRIPT_NAME"
```

Add a `CATEGORY` parameter to the Jenkins job.

### Output Capture

To capture and archive script output:

```bash
#!/bin/bash
cd /path/to/your/scripts
./"$SCRIPT_NAME" > output.log 2>&1
EXIT_CODE=$?
echo "Exit code: $EXIT_CODE"
exit $EXIT_CODE
```

Then add "Archive the artifacts" post-build action to capture `output.log`.

### Notification Integration

Add Slack or email notifications in post-build actions to get notified when scripts complete.

## Testing the Configuration

1. Manually trigger the job from Jenkins UI with a test script
2. Check the console output for errors
3. Verify the script executes correctly
4. Test triggering from the Flask application

## Maintenance

- Regularly update Jenkins and plugins
- Monitor disk space for build history
- Clean up old builds periodically
- Review and update scripts as needed