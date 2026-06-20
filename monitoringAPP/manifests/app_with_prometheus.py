from flask import Flask, render_template, request, jsonify
import subprocess
import json
import os
import requests
from datetime import datetime
from prometheus_flask_exporter import PrometheusMetrics
from prometheus_client import Counter, Histogram, Gauge, Summary
import time
import functools

app = Flask(__name__)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///script_manager.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize database
from models import db, Script, JobExecution, DockerImage, JenkinsConfig, ArtifactoryConfig, SystemMetrics, init_db

# Initialize Prometheus metrics
metrics = PrometheusMetrics(
    app,
    path='/metrics',
    group_by_endpoint=True,
    default_label_as_endpoint=True
)

# Custom metrics
request_counter = Counter(
    'flask_http_requests_total',
    'Total HTTP requests',
    ['method', 'endpoint', 'status']
)

request_duration = Histogram(
    'flask_http_request_duration_seconds',
    'HTTP request latency',
    ['method', 'endpoint']
)

request_exceptions = Counter(
    'flask_http_request_exceptions_total',
    'Total HTTP request exceptions',
    ['exception_type']
)

# Database metrics
db_query_duration = Histogram(
    'flask_db_query_duration_seconds',
    'Database query duration',
    ['query_type']
)

db_query_errors = Counter(
    'flask_db_query_errors_total',
    'Total database query errors',
    ['query_type']
)

db_connections = Gauge(
    'flask_db_connections_active',
    'Active database connections'
)

# Jenkins metrics
jenkins_requests = Counter(
    'flask_jenkins_requests_total',
    'Total Jenkins API requests',
    ['endpoint', 'method']
)

jenkins_request_duration = Histogram(
    'flask_jenkins_request_duration_seconds',
    'Jenkins API request duration',
    ['endpoint']
)

jenkins_request_errors = Counter(
    'flask_jenkins_request_errors_total',
    'Total Jenkins API request errors',
    ['endpoint', 'error_type']
)

# Artifactory metrics
artifactory_requests = Counter(
    'flask_artifactory_requests_total',
    'Total Artifactory API requests',
    ['endpoint', 'method']
)

artifactory_request_duration = Histogram(
    'flask_artifactory_request_duration_seconds',
    'Artifactory API request duration',
    ['endpoint']
)

artifactory_request_errors = Counter(
    'flask_artifactory_request_errors_total',
    'Total Artifactory API request errors',
    ['endpoint', 'error_type']
)

# Script execution metrics
script_executions = Counter(
    'flask_script_executions_total',
    'Total script executions',
    ['script_name', 'execution_type']
)

script_execution_duration = Histogram(
    'flask_script_execution_duration_seconds',
    'Script execution duration',
    ['script_name', 'execution_type']
)

script_execution_errors = Counter(
    'flask_script_execution_errors_total',
    'Total script execution errors',
    ['script_name', 'execution_type', 'error_type']
)

# Docker metrics
docker_builds = Counter(
    'flask_docker_builds_total',
    'Total Docker builds',
    ['image_name', 'status']
)

docker_build_duration = Histogram(
    'flask_docker_build_duration_seconds',
    'Docker build duration',
    ['image_name']
)

docker_pushes = Counter(
    'flask_docker_pushes_total',
    'Total Docker pushes',
    ['image_name', 'repository', 'status']
)

docker_push_duration = Histogram(
    'flask_docker_push_duration_seconds',
    'Docker push duration',
    ['image_name', 'repository']
)

# System metrics
system_info = Gauge(
    'flask_system_info',
    'Flask application system information',
    ['version', 'environment', 'python_version']
)

# Health check metrics
health_check_status = Gauge(
    'flask_health_check_status',
    'Health check status',
    ['service']
)

# Business metrics
active_jobs = Gauge(
    'flask_active_jobs',
    'Number of active job executions'
)

total_jobs = Counter(
    'flask_total_jobs_total',
    'Total jobs processed',
    ['status']
)

# Set system info
system_info.labels(
    version='1.0.0',
    environment=os.environ.get('FLASK_ENV', 'production'),
    python_version=f"{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}"
).set(1)

# Initialize database
init_db()

# Decorator for measuring function execution time
def measure_time(metric_name):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            start_time = time.time()
            try:
                result = func(*args, **kwargs)
                duration = time.time() - start_time
                return result
            except Exception as e:
                duration = time.time() - start_time
                raise e
        return wrapper
    return decorator

# Database query tracking
def track_db_query(query_type):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            start_time = time.time()
            try:
                result = func(*args, **kwargs)
                duration = time.time() - start_time
                db_query_duration.labels(query_type=query_type).observe(duration)
                return result
            except Exception as e:
                duration = time.time() - start_time
                db_query_duration.labels(query_type=query_type).observe(duration)
                db_query_errors.labels(query_type=query_type).inc()
                raise e
        return wrapper
    return decorator

# External API call tracking
def track_external_api_call(api_name, metric_prefix):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            start_time = time.time()
            try:
                result = func(*args, **kwargs)
                duration = time.time() - start_time
                if metric_prefix == 'jenkins':
                    jenkins_request_duration.labels(endpoint=api_name).observe(duration)
                    jenkins_requests.labels(endpoint=api_name, method='unknown').inc()
                elif metric_prefix == 'artifactory':
                    artifactory_request_duration.labels(endpoint=api_name).observe(duration)
                    artifactory_requests.labels(endpoint=api_name, method='unknown').inc()
                return result
            except Exception as e:
                duration = time.time() - start_time
                if metric_prefix == 'jenkins':
                    jenkins_request_duration.labels(endpoint=api_name).observe(duration)
                    jenkins_request_errors.labels(endpoint=api_name, error_type=type(e).__name__).inc()
                elif metric_prefix == 'artifactory':
                    artifactory_request_duration.labels(endpoint=api_name).observe(duration)
                    artifactory_request_errors.labels(endpoint=api_name, error_type=type(e).__name__).inc()
                raise e
        return wrapper
    return decorator

@app.before_request
def before_request():
    request.start_time = time.time()

@app.after_request
def after_request(response):
    if hasattr(request, 'start_time'):
        duration = time.time() - request.start_time
        request_duration.labels(method=request.method, endpoint=request.endpoint).observe(duration)
        request_counter.labels(method=request.method, endpoint=request.endpoint, status=response.status_code).inc()
    return response

@app.errorhandler(Exception)
def handle_exception(e):
    request_exceptions.labels(exception_type=type(e).__name__).inc()
    return jsonify({'error': str(e)}), 500

# Health check endpoint
@app.route('/health')
def health_check():
    health_status = {
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat()
    }
    
    # Check Jenkins health
    try:
        jenkins_url = os.environ.get('JENKINS_URL')
        if jenkins_url:
            response = requests.get(f"{jenkins_url}/api/json", timeout=5)
            health_status['jenkins'] = 'healthy' if response.status_code == 200 else 'unhealthy'
            health_check_status.labels(service='jenkins').set(1 if response.status_code == 200 else 0)
        else:
            health_status['jenkins'] = 'not_configured'
            health_check_status.labels(service='jenkins').set(0)
    except Exception as e:
        health_status['jenkins'] = 'unhealthy'
        health_check_status.labels(service='jenkins').set(0)
    
    # Check Artifactory health
    try:
        artifactory_url = os.environ.get('ARTIFACTORY_URL')
        if artifactory_url:
            response = requests.get(f"{artifactory_url}/api/system/ping", timeout=5)
            health_status['artifactory'] = 'healthy' if response.status_code == 200 else 'unhealthy'
            health_check_status.labels(service='artifactory').set(1 if response.status_code == 200 else 0)
        else:
            health_status['artifactory'] = 'not_configured'
            health_check_status.labels(service='artifactory').set(0)
    except Exception as e:
        health_status['artifactory'] = 'unhealthy'
        health_check_status.labels(service='artifactory').set(0)
    
    # Check database health
    try:
        db.session.execute(db.text("SELECT 1"))
        health_status['database'] = 'healthy'
        health_check_status.labels(service='database').set(1)
    except Exception as e:
        health_status['database'] = 'unhealthy'
        health_check_status.labels(service='database').set(0)
    
    overall_status = 'healthy' if all(v in ['healthy', 'not_configured'] for v in health_status.values() if v != 'status' and v != 'timestamp') else 'unhealthy'
    health_status['status'] = overall_status
    
    return jsonify(health_status), 200 if overall_status == 'healthy' else 503

# Metrics endpoint is automatically handled by PrometheusMetrics
# The metrics are available at /metrics

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)