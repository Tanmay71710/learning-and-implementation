# Prometheus metrics integration for Flask application
# Add this to your Flask application (app.py)

from prometheus_flask_exporter import PrometheusMetrics
from prometheus_client import Counter, Histogram, Gauge, Summary
import time
import functools

# Initialize Prometheus metrics
def setup_prometheus_metrics(app):
    """
    Setup Prometheus metrics for Flask application
    """
    
    # Enable Prometheus metrics for Flask
    metrics = PrometheusMetrics(
        app,
        path='/metrics',
        group_by_endpoint=True,
        default_label_as_endpoint=True
    )
    
    # Custom metrics
    
    # Request metrics
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
        ['script_name', 'execution_type']  # execution_type: jenkins, local
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
        ['image_name', 'status']  # status: success, failure
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
    
    # Set system info
    import os
    import sys
    system_info.labels(
        version='1.0.0',
        environment=os.environ.get('FLASK_ENV', 'production'),
        python_version=sys.version
    ).set(1)
    
    # Health check metrics
    health_check_status = Gauge(
        'flask_health_check_status',
        'Health check status',
        ['service']  # service: jenkins, artifactory, database
    )
    
    # Business metrics
    active_jobs = Gauge(
        'flask_active_jobs',
        'Number of active job executions'
    )
    
    total_jobs = Counter(
        'flask_total_jobs_total',
        'Total jobs processed',
        ['status']  # status: success, failure, running
    )
    
    return metrics

# Decorator for measuring function execution time
def measure_time(metric_name):
    """
    Decorator to measure function execution time with Prometheus metrics
    """
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            start_time = time.time()
            try:
                result = func(*args, **kwargs)
                duration = time.time() - start_time
                # Record successful execution
                return result
            except Exception as e:
                duration = time.time() - start_time
                # Record error
                raise e
        return wrapper
    return decorator

# Database query tracking
def track_db_query(query_type):
    """
    Decorator to track database query metrics
    """
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            start_time = time.time()
            try:
                result = func(*args, **kwargs)
                duration = time.time() - start_time
                # Record successful query
                return result
            except Exception as e:
                duration = time.time() - start_time
                # Record query error
                raise e
        return wrapper
    return decorator

# External API call tracking
def track_external_api_call(api_name, metric_prefix):
    """
    Decorator to track external API call metrics
    """
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            start_time = time.time()
            try:
                result = func(*args, **kwargs)
                duration = time.time() - start_time
                # Record successful API call
                return result
            except Exception as e:
                duration = time.time() - start_time
                # Record API error
                raise e
        return wrapper
    return decorator

# Example usage in your Flask application:
"""
from flask import Flask
from prometheus_integration import setup_prometheus_metrics, track_db_query, track_external_api_call

app = Flask(__name__)
metrics = setup_prometheus_metrics(app)

@app.route('/api/execute')
def execute_script():
    # Your existing code here
    pass

@track_db_query('select')
def get_scripts_from_db():
    # Your database query code
    pass

@track_external_api_call('jenkins', 'flask_jenkins')
def call_jenkins_api():
    # Your Jenkins API call code
    pass
"""