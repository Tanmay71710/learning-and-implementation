# GitHub Actions Code Quality Check Setup

This repository includes a comprehensive GitHub Actions workflow that automatically checks code quality using multiple linting tools and sends email notifications to configured recipients.

## Features

- **Automated Code Quality Checks**: Runs on every push and pull request
- **Multiple Linting Tools**: Pylint, Flake8, Black, isort, Bandit
- **Security Scanning**: Bandit security linter for vulnerability detection
- **Email Notifications**: Sends detailed reports to multiple recipients
- **PR Comments**: Automatically comments on pull requests with results
- **Customizable Configuration**: Pylint configuration file included
- **Report Artifacts**: Saves detailed reports as workflow artifacts

## Workflow Triggers

The workflow runs on:
- Push to `master`, `main`, or `develop` branches
- Pull requests to `master`, `main`, or `develop` branches
- Manual workflow dispatch

## Required GitHub Secrets

Configure the following secrets in your GitHub repository settings (Settings → Secrets and variables → Actions):

### Email Configuration (Required for email notifications)

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `EMAIL_SERVER` | SMTP server address | `smtp.gmail.com` |
| `EMAIL_PORT` | SMTP server port | `587` |
| `EMAIL_USERNAME` | SMTP username | `your-email@gmail.com` |
| `EMAIL_PASSWORD` | SMTP password/app password | `your-app-password` |
| `EMAIL_RECIPIENTS` | Comma-separated email addresses | `user1@example.com,user2@example.com` |
| `EMAIL_FROM` | From email address | `GitHub Actions <noreply@github.com>` |

### Slack Configuration (Optional)

| Secret Name | Description |
|-------------|-------------|
| `SLACK_WEBHOOK_URL` | Slack incoming webhook URL for notifications |

## Setup Instructions

### 1. Configure GitHub Secrets

1. Go to your repository on GitHub
2. Navigate to Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add the required secrets mentioned above

### 2. Email Provider Setup

#### Gmail Setup
1. Enable 2-factor authentication on your Google account
2. Go to Google Account settings → Security
3. Enable "App passwords"
4. Generate a new app password for "GitHub Actions"
5. Use this app password as `EMAIL_PASSWORD`

#### Outlook/Office 365 Setup
- Server: `smtp.office365.com`
- Port: `587`
- Use your regular email password or app password

#### SMTP Server Setup
For other email providers, use their SMTP server details:
- Server: Provider's SMTP server address
- Port: Usually 587 (TLS) or 465 (SSL)
- Username: Your email address
- Password: Your email password

### 3. Configure Recipients

Set the `EMAIL_RECIPIENTS` secret with comma-separated email addresses:
```
user1@example.com,user2@example.com,team@company.com
```

### 4. Customize Pylint Configuration (Optional)

Edit `.pylintrc` to customize Pylint rules:
- Adjust maximum line length
- Enable/disable specific checks
- Configure good/bad variable names
- Set complexity limits

## Linting Tools Included

### Pylint
- Comprehensive Python code analysis
- Gives a score out of 10
- Checks for errors, code smells, and style issues
- Customizable via `.pylintrc`

### Flake8
- Style guide enforcement (PEP8)
- Error detection
- Complexity analysis
- Maximum line length enforcement

### Black
- Code formatting check
- Ensures consistent code style
- No configuration needed (opinionated formatter)

### isort
- Import statement sorting
- Ensures consistent import order
- Compatible with Black formatting

### Bandit
- Security vulnerability scanner
- Finds common security issues
- Checks for unsafe functions
- Reports security best practice violations

## Workflow Steps

1. **Checkout Code**: Gets the latest code from repository
2. **Set up Python**: Configures Python 3.11 environment
3. **Install Dependencies**: Installs all linting tools and project dependencies
4. **Run Black**: Checks code formatting
5. **Run isort**: Checks import sorting
6. **Run Flake8**: Checks style guide compliance
7. **Run Bandit**: Security vulnerability scanning
8. **Run Pylint**: Comprehensive code analysis
9. **Generate Pylint Score**: Extracts and displays score
10. **Upload Reports**: Saves reports as workflow artifacts
11. **Comment PR**: Adds results to pull requests (if applicable)
12. **Send Email**: Sends detailed email notification
13. **Send Slack**: Optional Slack notification

## Email Notification Content

Emails include:
- Repository information (name, branch, commit)
- Author and timestamp
- Overall status
- Pylint score and detailed issues
- Security analysis results
- Links to workflow run and commit
- Attached reports (JSON format)

## Customization Options

### Modify Triggers
Edit `.github/workflows/code-quality-check.yml` to change when the workflow runs:

```yaml
on:
  push:
    branches: [ master, main, develop, feature/* ]  # Add more branches
  pull_request:
    branches: [ master, main, develop ]
  schedule:
    - cron: '0 0 * * *'  # Run daily at midnight
```

### Add More Linters
Add additional linting steps in the workflow:

```yaml
- name: Run MyPy
  run: |
    pip install mypy
    mypy .
  continue-on-error: true
```

### Customize Email Content
Edit `scripts/send_email_notification.py` to modify email template and content.

### Change Python Version
Modify the Python version in the workflow:

```yaml
- name: Set up Python
  uses: actions/setup-python@v4
  with:
    python-version: '3.12'  # Change to desired version
```

## Troubleshooting

### Email Not Sending
1. Verify SMTP server settings are correct
2. Check email password/app password
3. Ensure email provider allows SMTP access
4. Check GitHub Actions logs for error messages
5. Test SMTP credentials manually

### Workflow Failing
1. Check GitHub Actions logs for specific errors
2. Ensure all dependencies are in requirements.txt
3. Verify Python version compatibility
4. Check for syntax errors in Python files

### Pylint Score Too Low
1. Review Pylint messages in workflow logs
2. Fix reported issues in code
3. Adjust Pylint configuration if needed
4. Consider disabling certain checks if not applicable

### Permission Issues
1. Ensure GitHub Actions has permissions to send emails
2. Check repository settings for Actions permissions
3. Verify secrets are properly configured

## Best Practices

1. **Regular Monitoring**: Review email notifications regularly
2. **Fix Issues Promptly**: Address linting issues as they arise
3. **Keep Dependencies Updated**: Regularly update linting tools
4. **Customize Rules**: Adapt Pylint rules to project needs
5. **Use Branch Protection**: Require checks before merging
6. **Monitor Score Trends**: Track Pylint score over time
7. **Security First**: Pay attention to Bandit security findings

## Advanced Configuration

### Branch Protection Rules
Require the code quality check to pass before merging:
1. Go to Settings → Branches
2. Add branch protection rule
3. Require status checks to pass
4. Select "Code Quality Check and Notification"

### Scheduled Runs
Add scheduled runs for regular quality checks:

```yaml
on:
  schedule:
    - cron: '0 9 * * 1'  # Every Monday at 9 AM
    - cron: '0 0 * * *'  # Every day at midnight
```

### Conditional Email Sending
Send emails only on failures or specific conditions:

```yaml
- name: Send Email Notification
  if: failure()  # Only send on failure
  uses: dawidd6/action-send-mail@v3
  # ... rest of configuration
```

## Integration with CI/CD

This workflow integrates seamlessly with existing CI/CD pipelines:
- Can be required before deployment
- Works alongside other GitHub Actions
- Provides quality gates for merges
- Supports automated deployment decisions

## Support and Maintenance

For issues or questions:
1. Check GitHub Actions logs first
2. Review this documentation
3. Test email configuration independently
4. Verify linting tool compatibility
5. Check for GitHub Actions service status

## License

This workflow configuration is part of the Script Execution Manager project and follows the same license terms.