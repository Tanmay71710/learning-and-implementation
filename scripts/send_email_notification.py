#!/usr/bin/env python3
"""
Email notification script for GitHub Actions
Sends detailed code quality reports to configured recipients
"""

import smtplib
import json
import os
import sys
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
from datetime import datetime


def load_pylint_report():
    """Load pylint report if available"""
    try:
        with open('pylint-report.json', 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return None


def load_bandit_report():
    """Load bandit report if available"""
    try:
        with open('bandit-report.json', 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return None


def create_email_body(pylint_data, bandit_data, context):
    """Create detailed email body with linting results"""
    
    body = f"""
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; }}
            .header {{ background-color: #667eea; color: white; padding: 20px; }}
            .section {{ margin: 20px 0; padding: 15px; border-left: 4px solid #667eea; }}
            .success {{ background-color: #d4edda; border-left-color: #28a745; }}
            .warning {{ background-color: #fff3cd; border-left-color: #ffc107; }}
            .error {{ background-color: #f8d7da; border-left-color: #dc3545; }}
            table {{ border-collapse: collapse; width: 100%; }}
            th, td {{ border: 1px solid #ddd; padding: 8px; text-align: left; }}
            th {{ background-color: #667eea; color: white; }}
        </style>
    </head>
    <body>
        <div class="header">
            <h2>🔍 Code Quality Check Report</h2>
        </div>
        
        <div class="section">
            <h3>Repository Information</h3>
            <table>
                <tr><th>Repository</th><td>{context['repository']}</td></tr>
                <tr><th>Branch</th><td>{context['branch']}</td></tr>
                <tr><th>Commit</th><td>{context['commit']}</td></tr>
                <tr><th>Author</th><td>{context['author']}</td></tr>
                <tr><th>Status</th><td>{context['status']}</td></tr>
                <tr><th>Timestamp</th><td>{context['timestamp']}</td></tr>
            </table>
        </div>
    """
    
    # Pylint Results
    if pylint_data:
        score = pylint_data.get('score', 'N/A')
        score_class = 'success' if score >= 8 else ('warning' if score >= 5 else 'error')
        
        body += f"""
        <div class="section {score_class}">
            <h3>📊 Pylint Analysis</h3>
            <p><strong>Overall Score:</strong> {score}/10</p>
        """
        
        if pylint_data.get('messages'):
            body += """
            <h4>Issues Found:</h4>
            <table>
                <tr><th>Type</th><th>File</th><th>Line</th><th>Message</th></tr>
            """
            
            for msg in pylint_data['messages'][:20]:  # Limit to first 20 issues
                body += f"""
                <tr>
                    <td>{msg.get('type', 'N/A')}</td>
                    <td>{msg.get('path', 'N/A')}</td>
                    <td>{msg.get('line', 'N/A')}</td>
                    <td>{msg.get('message', 'N/A')}</td>
                </tr>
                """
            
            if len(pylint_data['messages']) > 20:
                body += f"<tr><td colspan='4'>... and {len(pylint_data['messages']) - 20} more issues</td></tr>"
            
            body += "</table>"
        
        body += "</div>"
    
    # Bandit Security Results
    if bandit_data:
        issues = bandit_data.get('results', [])
        security_class = 'success' if not issues else 'error'
        
        body += f"""
        <div class="section {security_class}">
            <h3>🔒 Security Analysis (Bandit)</h3>
        """
        
        if issues:
            body += f"<p><strong>Security Issues Found:</strong> {len(issues)}</p>"
            body += "<table><tr><th>Severity</th><th>File</th><th>Issue</th></tr>"
            
            for issue in issues[:10]:  # Limit to first 10 issues
                body += f"""
                <tr>
                    <td>{issue.get('issue_severity', 'N/A')}</td>
                    <td>{issue.get('filename', 'N/A')}</td>
                    <td>{issue.get('issue_text', 'N/A')}</td>
                </tr>
                """
            
            if len(issues) > 10:
                body += f"<tr><td colspan='3'>... and {len(issues) - 10} more security issues</td></tr>"
            
            body += "</table>"
        else:
            body += "<p>✅ No security issues found</p>"
        
        body += "</div>"
    
    body += f"""
        <div class="section">
            <h3>🔗 Links</h3>
            <p><strong>Workflow Run:</strong> <a href="{context['workflow_url']}">{context['workflow_url']}</a></p>
            <p><strong>Commit:</strong> <a href="{context['commit_url']}">{context['commit_url']}</a></p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #666;">
            <p>This is an automated message from GitHub Actions</p>
        </div>
    </body>
    </html>
    """
    
    return body


def send_email(recipients, subject, body, smtp_config, attachments=None):
    """Send email with optional attachments"""
    
    msg = MIMEMultipart('alternative')
    msg['Subject'] = subject
    msg['From'] = smtp_config['from']
    msg['To'] = ', '.join(recipients)
    
    # Attach HTML body
    html_part = MIMEText(body, 'html')
    msg.attach(html_part)
    
    # Attach files if provided
    if attachments:
        for file_path in attachments:
            if os.path.exists(file_path):
                with open(file_path, 'rb') as f:
                    part = MIMEBase('application', 'octet-stream')
                    part.set_payload(f.read())
                    encoders.encode_base64(part)
                    part.add_header(
                        'Content-Disposition',
                        f'attachment; filename= {os.path.basename(file_path)}'
                    )
                    msg.attach(part)
    
    # Send email
    try:
        with smtplib.SMTP(
            smtp_config['server'],
            smtp_config['port'],
            timeout=30
        ) as server:
            if smtp_config.get('use_tls', False):
                server.starttls()
            
            if smtp_config.get('username') and smtp_config.get('password'):
                server.login(smtp_config['username'], smtp_config['password'])
            
            server.send_message(msg)
        
        print("Email sent successfully")
        return True
    
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False


def main():
    """Main function to send email notification"""
    
    # Get environment variables
    recipients = os.getenv('EMAIL_RECIPIENTS', '').split(',')
    recipients = [email.strip() for email in recipients if email.strip()]
    
    if not recipients:
        print("No email recipients configured")
        sys.exit(1)
    
    # SMTP configuration
    smtp_config = {
        'server': os.getenv('EMAIL_SERVER', 'smtp.gmail.com'),
        'port': int(os.getenv('EMAIL_PORT', '587')),
        'username': os.getenv('EMAIL_USERNAME'),
        'password': os.getenv('EMAIL_PASSWORD'),
        'from': os.getenv('EMAIL_FROM', 'GitHub Actions <noreply@github.com>'),
        'use_tls': os.getenv('EMAIL_USE_TLS', 'true').lower() == 'true'
    }
    
    # Context information
    context = {
        'repository': os.getenv('GITHUB_REPOSITORY', 'Unknown'),
        'branch': os.getenv('GITHUB_REF_NAME', 'Unknown'),
        'commit': os.getenv('GITHUB_SHA', 'Unknown'),
        'author': os.getenv('GITHUB_ACTOR', 'Unknown'),
        'status': os.getenv('JOB_STATUS', 'Unknown'),
        'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'workflow_url': os.getenv('GITHUB_SERVER_URL', '') + '/' + os.getenv('GITHUB_REPOSITORY', '') + '/actions/runs/' + os.getenv('GITHUB_RUN_ID', ''),
        'commit_url': os.getenv('GITHUB_SERVER_URL', '') + '/' + os.getenv('GITHUB_REPOSITORY', '') + '/commit/' + os.getenv('GITHUB_SHA', '')
    }
    
    # Load reports
    pylint_data = load_pylint_report()
    bandit_data = load_bandit_report()
    
    # Create email body
    body = create_email_body(pylint_data, bandit_data, context)
    
    # Create subject
    status_emoji = "✅" if context['status'] == 'success' else "❌"
    pylint_score = pylint_data.get('score', 'N/A') if pylint_data else 'N/A'
    subject = f"{status_emoji} Code Quality Check - {context['repository']} - Pylint: {pylint_score}"
    
    # Attachments
    attachments = []
    if os.path.exists('pylint-report.json'):
        attachments.append('pylint-report.json')
    if os.path.exists('bandit-report.json'):
        attachments.append('bandit-report.json')
    
    # Send email
    success = send_email(recipients, subject, body, smtp_config, attachments)
    
    sys.exit(0 if success else 1)


if __name__ == '__main__':
    main()