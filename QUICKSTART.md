# Quick Start Guide

Get the Script Execution Manager up and running in minutes!

## Prerequisites Check

Ensure you have:
- Python 3.8 or higher
- pip package manager
- (Optional) Jenkins server

## Quick Setup (5 minutes)

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your settings
```

For testing without Jenkins, you can use local execution mode.

### 3. Test with Example Scripts

Example scripts are already provided in the `scripts/` directory:
- `system_info.sh` - Displays system information
- `parameters.sh` - Demonstrates parameter handling
- `long_task.sh` - Simulates a long-running task

### 4. Run the Application

```bash
python app.py
```

The application will start on `http://localhost:5000`

### 5. Open Web Interface

Navigate to `http://localhost:5000` in your browser

## Testing Without Jenkins

1. Uncheck "Use Jenkins for execution" in the web interface
2. Select a script from the dropdown
3. Click "Execute Script"
4. View the output in the console output section

## Testing With Jenkins

1. Ensure Jenkins is running and accessible
2. Configure the Jenkins job following `JENKINS_SETUP.md`
3. Update `.env` with your Jenkins credentials
4. Check "Use Jenkins for execution"
5. Execute scripts and monitor in the Job Monitor section

## Docker Quick Start

### Using Docker Compose (Includes Jenkins)

```bash
# Copy environment file
cp .env.example .env

# Edit .env with your Jenkins credentials
# Start services
docker-compose up -d

# Access Flask app at http://localhost:5000
# Access Jenkins at http://localhost:8080
```

### Using Docker Only (Flask App)

```bash
# Build the image
docker build -t script-execution-manager .

# Run the container
docker run -p 5000:5000 \
  -e JENKINS_URL=http://your-jenkins:8080 \
  -e JENKINS_USERNAME=your_username \
  -e JENKINS_PASSWORD=your_password \
  -v $(pwd)/scripts:/app/scripts \
  script-execution-manager
```

## Common Issues

### Port Already in Use

Change the port in `app.py`:
```python
app.run(debug=True, host='0.0.0.0', port=5001)
```

### Scripts Not Executing

Make scripts executable:
```bash
chmod +x scripts/*.sh
```

### Jenkins Connection Failed

1. Verify Jenkins URL in `.env`
2. Check Jenkins is running: `curl http://localhost:8080`
3. Verify username and API token
4. Check network connectivity

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Follow [JENKINS_SETUP.md](JENKINS_SETUP.md) for Jenkins configuration
- Add your own scripts to the `scripts/` directory
- Customize the web interface in `templates/index.html`

## Support

For detailed troubleshooting, refer to the main README.md file.