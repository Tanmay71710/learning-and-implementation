from flask import Flask, render_template, request, jsonify
import subprocess
import json
import os
import requests
from datetime import datetime
from models import db, Script, JobExecution, DockerImage, JenkinsConfig, ArtifactoryConfig, SystemMetrics, init_db

app = Flask(__name__)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///script_manager.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize database
init_db(app)

# Configuration
JENKINS_URL = os.environ.get('JENKINS_URL', 'http://localhost:8080')
JENKINS_USERNAME = os.environ.get('JENKINS_USERNAME', '')
JENKINS_PASSWORD = os.environ.get('JENKINS_PASSWORD', '')
JENKINS_JOB_NAME = os.environ.get('JENKINS_JOB_NAME', 'script-execution-job')

# Artifactory Configuration
ARTIFACTORY_URL = os.environ.get('ARTIFACTORY_URL', 'http://localhost:8082')
ARTIFACTORY_USERNAME = os.environ.get('ARTIFACTORY_USERNAME', '')
ARTIFACTORY_PASSWORD = os.environ.get('ARTIFACTORY_PASSWORD', '')
ARTIFACTORY_REPOSITORY = os.environ.get('ARTIFACTORY_REPOSITORY', 'docker-local')
ARTIFACTORY_API_KEY = os.environ.get('ARTIFACTORY_API_KEY', '')

SCRIPTS_DIR = os.path.join(os.path.dirname(__file__), 'scripts')

def get_jenkins_crumb():
    """Get Jenkins CRUMB token for CSRF protection"""
    try:
        auth = (JENKINS_USERNAME, JENKINS_PASSWORD) if JENKINS_USERNAME else None
        response = requests.get(f"{JENKINS_URL}/crumbIssuer/api/json", auth=auth)
        if response.status_code == 200:
            return response.json().get('crumb')
        return None
    except Exception as e:
        print(f"Error getting Jenkins crumb: {e}")
        return None

def trigger_jenkins_job(script_name, parameters=None):
    """Trigger a Jenkins job to execute a script"""
    try:
        auth = (JENKINS_USERNAME, JENKINS_PASSWORD) if JENKINS_USERNAME else None
        crumb = get_jenkins_crumb()
        
        # Build the job URL
        job_url = f"{JENKINS_URL}/job/{JENKINS_JOB_NAME}/build"
        
        # Prepare parameters
        params = {'SCRIPT_NAME': script_name}
        if parameters:
            params.update(parameters)
        
        headers = {}
        if crumb:
            headers['Jenkins-Crumb'] = crumb
        
        response = requests.post(job_url, params=params, auth=auth, headers=headers)
        
        if response.status_code in [200, 201]:
            # Extract queue ID from location header if available
            queue_url = response.headers.get('Location', '')
            queue_id = queue_url.split('queue/item/')[-1].rstrip('/') if queue_url else None
            return {'success': True, 'queue_id': queue_id, 'message': 'Job triggered successfully'}
        else:
            return {'success': False, 'error': f'Failed to trigger job: {response.status_code} - {response.text}'}
    
    except Exception as e:
        return {'success': False, 'error': f'Error triggering Jenkins job: {str(e)}'}

def get_jenkins_job_status(queue_id=None):
    """Get the status of a Jenkins job"""
    try:
        auth = (JENKINS_USERNAME, JENKINS_PASSWORD) if JENKINS_USERNAME else None
        
        if queue_id:
            # Check queue status
            queue_url = f"{JENKINS_URL}/queue/item/{queue_id}/api/json"
            response = requests.get(queue_url, auth=auth)
            
            if response.status_code == 200:
                queue_data = response.json()
                
                if 'executable' in queue_data:
                    # Job has started
                    build_number = queue_data['executable']['number']
                    job_url = f"{JENKINS_URL}/job/{JENKINS_JOB_NAME}/{build_number}/api/json"
                    build_response = requests.get(job_url, auth=auth)
                    
                    if build_response.status_code == 200:
                        build_data = build_response.json()
                        return {
                            'status': build_data['result'] or 'RUNNING',
                            'build_number': build_number,
                            'timestamp': datetime.fromtimestamp(build_data['timestamp'] / 1000).isoformat(),
                            'url': build_data['url'],
                            'console': f"{build_data['url']}/console"
                        }
                else:
                    return {
                        'status': 'QUEUED',
                        'why': queue_data.get('why', 'Job is in queue'),
                        'timestamp': datetime.fromtimestamp(queue_data['timestamp'] / 1000).isoformat()
                    }
        
        # Get last build status if no queue ID
        job_url = f"{JENKINS_URL}/job/{JENKINS_JOB_NAME}/lastBuild/api/json"
        response = requests.get(job_url, auth=auth)
        
        if response.status_code == 200:
            build_data = response.json()
            return {
                'status': build_data['result'] or 'RUNNING',
                'build_number': build_data['number'],
                'timestamp': datetime.fromtimestamp(build_data['timestamp'] / 1000).isoformat(),
                'url': build_data['url'],
                'console': f"{build_data['url']}/console"
            }
        
        return {'status': 'UNKNOWN', 'error': 'Could not fetch job status'}
    
    except Exception as e:
        return {'status': 'ERROR', 'error': str(e)}

def execute_local_script(script_name, parameters=None):
    """Execute a script locally (fallback method)"""
    try:
        script_path = os.path.join(SCRIPTS_DIR, script_name)
        
        if not os.path.exists(script_path):
            return {'success': False, 'error': 'Script not found'}
        
        # Make script executable
        os.chmod(script_path, 0o755)
        
        # Execute script
        result = subprocess.run(
            [script_path],
            capture_output=True,
            text=True,
            timeout=300  # 5 minute timeout
        )
        
        return {
            'success': result.returncode == 0,
            'output': result.stdout,
            'error': result.stderr,
            'return_code': result.returncode
        }
    
    except subprocess.TimeoutExpired:
        return {'success': False, 'error': 'Script execution timed out'}
    except Exception as e:
        return {'success': False, 'error': str(e)}

# Database helper functions
def get_or_create_script(script_name):
    """Get existing script or create new one"""
    script = Script.query.filter_by(name=script_name).first()
    if not script:
        script_path = os.path.join(SCRIPTS_DIR, script_name)
        script = Script(
            name=script_name,
            path=script_path,
            description=f"Script: {script_name}"
        )
        db.session.add(script)
        db.session.commit()
    return script

def create_job_execution(script_name, execution_type, parameters=None, jenkins_queue_id=None):
    """Create a new job execution record"""
    script = get_or_create_script(script_name)
    
    execution = JobExecution(
        script_id=script.id,
        execution_type=execution_type,
        status='queued',
        jenkins_queue_id=jenkins_queue_id,
        parameters=json.dumps(parameters) if parameters else None,
        started_at=datetime.utcnow()
    )
    
    db.session.add(execution)
    db.session.commit()
    
    return execution

def update_job_status(execution_id, status, **kwargs):
    """Update job execution status and additional information"""
    execution = JobExecution.query.get(execution_id)
    if execution:
        execution.status = status
        
        if 'jenkins_build_number' in kwargs:
            execution.jenkins_build_number = kwargs['jenkins_build_number']
        if 'jenkins_job_url' in kwargs:
            execution.jenkins_job_url = kwargs['jenkins_job_url']
        if 'output' in kwargs:
            execution.output = kwargs['output']
        if 'error_message' in kwargs:
            execution.error_message = kwargs['error_message']
        
        if status in ['success', 'failure']:
            execution.completed_at = datetime.utcnow()
            if execution.started_at:
                duration = execution.completed_at - execution.started_at
                execution.duration_seconds = duration.total_seconds()
        
        db.session.commit()
    return execution

def get_job_history(limit=50):
    """Get recent job execution history"""
    return JobExecution.query.order_by(JobExecution.created_at.desc()).limit(limit).all()

def get_script_statistics():
    """Get execution statistics for scripts"""
    total_executions = JobExecution.query.count()
    successful_executions = JobExecution.query.filter_by(status='success').count()
    failed_executions = JobExecution.query.filter_by(status='failure').count()
    
    success_rate = (successful_executions / total_executions * 100) if total_executions > 0 else 0
    
    return {
        'total_executions': total_executions,
        'successful_executions': successful_executions,
        'failed_executions': failed_executions,
        'success_rate': success_rate
    }

@app.route('/')
def index():
    """Render the main web interface"""
    # Get list of available scripts
    scripts = []
    if os.path.exists(SCRIPTS_DIR):
        scripts = [f for f in os.listdir(SCRIPTS_DIR) if os.path.isfile(os.path.join(SCRIPTS_DIR, f))]
    
    return render_template('index.html', scripts=scripts)

@app.route('/api/scripts', methods=['GET'])
def get_scripts():
    """Get list of available scripts"""
    try:
        scripts = []
        if os.path.exists(SCRIPTS_DIR):
            scripts = [f for f in os.listdir(SCRIPTS_DIR) if os.path.isfile(os.path.join(SCRIPTS_DIR, f))]
        return jsonify({'success': True, 'scripts': scripts})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/execute', methods=['POST'])
def execute_script():
    """Execute a script via Jenkins or locally"""
    try:
        data = request.get_json()
        script_name = data.get('script_name')
        parameters = data.get('parameters', {})
        use_jenkins = data.get('use_jenkins', True)
        
        if not script_name:
            return jsonify({'success': False, 'error': 'Script name is required'}), 400
        
        # Create job execution record
        execution = create_job_execution(script_name, 'jenkins' if use_jenkins else 'local', parameters)
        
        if use_jenkins:
            result = trigger_jenkins_job(script_name, parameters)
            if result.get('success') and result.get('queue_id'):
                update_job_status(execution.id, 'running', jenkins_queue_id=result.get('queue_id'))
                result['execution_id'] = execution.id
            else:
                update_job_status(execution.id, 'failure', error_message=result.get('error'))
        else:
            result = execute_local_script(script_name, parameters)
            if result.get('success'):
                update_job_status(execution.id, 'success', output=result.get('output'))
            else:
                update_job_status(execution.id, 'failure', error_message=result.get('error'))
            result['execution_id'] = execution.id
        
        if result.get('success'):
            return jsonify(result)
        else:
            return jsonify(result), 500
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/status/<queue_id>', methods=['GET'])
def get_job_status(queue_id):
    """Get the status of a job execution"""
    try:
        status = get_jenkins_job_status(queue_id)
        return jsonify(status)
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/jenkins/health', methods=['GET'])
def jenkins_health():
    """Check Jenkins connectivity"""
    try:
        auth = (JENKINS_USERNAME, JENKINS_PASSWORD) if JENKINS_USERNAME else None
        response = requests.get(f"{JENKINS_URL}/api/json", auth=auth, timeout=5)
        
        # Update database with health check result
        jenkins_config = JenkinsConfig.query.first()
        if not jenkins_config:
            jenkins_config = JenkinsConfig(
                jenkins_url=JENKINS_URL,
                job_name=JENKINS_JOB_NAME
            )
            db.session.add(jenkins_config)
        
        jenkins_config.last_health_check = datetime.utcnow()
        
        if response.status_code == 200:
            jenkins_config.health_status = 'healthy'
            jenkins_config.last_error = None
            db.session.commit()
            return jsonify({'success': True, 'message': 'Jenkins is reachable'})
        else:
            jenkins_config.health_status = 'unhealthy'
            jenkins_config.last_error = f'Jenkins returned status {response.status_code}'
            db.session.commit()
            return jsonify({'success': False, 'error': f'Jenkins returned status {response.status_code}'}), 503
    
    except Exception as e:
        # Update database with error
        jenkins_config = JenkinsConfig.query.first()
        if jenkins_config:
            jenkins_config.health_status = 'unhealthy'
            jenkins_config.last_error = str(e)
            jenkins_config.last_health_check = datetime.utcnow()
            db.session.commit()
        return jsonify({'success': False, 'error': str(e)}), 503

# Database API endpoints
@app.route('/api/history', methods=['GET'])
def get_history():
    """Get job execution history"""
    try:
        limit = request.args.get('limit', 50, type=int)
        history = get_job_history(limit)
        return jsonify({
            'success': True,
            'history': [execution.to_dict() for execution in history]
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/statistics', methods=['GET'])
def get_statistics():
    """Get execution statistics"""
    try:
        stats = get_script_statistics()
        return jsonify({'success': True, 'statistics': stats})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/scripts/db', methods=['GET'])
def get_scripts_db():
    """Get scripts from database"""
    try:
        scripts = Script.query.filter_by(is_active=True).all()
        return jsonify({
            'success': True,
            'scripts': [script.to_dict() for script in scripts]
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/executions/<int:execution_id>', methods=['GET'])
def get_execution_details(execution_id):
    """Get details of a specific execution"""
    try:
        execution = JobExecution.query.get(execution_id)
        if execution:
            return jsonify({'success': True, 'execution': execution.to_dict()})
        else:
            return jsonify({'success': False, 'error': 'Execution not found'}), 404
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Artifactory integration functions
def artifactory_health_check():
    """Check Artifactory connectivity"""
    try:
        auth = (ARTIFACTORY_USERNAME, ARTIFACTORY_PASSWORD) if ARTIFACTORY_USERNAME else None
        headers = {}
        if ARTIFACTORY_API_KEY:
            headers['X-JFrog-Art-Api'] = ARTIFACTORY_API_KEY
        
        response = requests.get(f"{ARTIFACTORY_URL}/artifactory/api/system/ping", auth=auth, headers=headers, timeout=5)
        
        # Update database with health check result
        artifactory_config = ArtifactoryConfig.query.first()
        if not artifactory_config:
            artifactory_config = ArtifactoryConfig(
                artifactory_url=ARTIFACTORY_URL,
                repository=ARTIFACTORY_REPOSITORY,
                username=ARTIFACTORY_USERNAME
            )
            db.session.add(artifactory_config)
        
        artifactory_config.last_health_check = datetime.utcnow()
        
        if response.status_code == 200:
            artifactory_config.health_status = 'healthy'
            artifactory_config.last_error = None
            db.session.commit()
            return True
        else:
            artifactory_config.health_status = 'unhealthy'
            artifactory_config.last_error = f'Artifactory returned status {response.status_code}'
            db.session.commit()
            return False
    
    except Exception as e:
        artifactory_config = ArtifactoryConfig.query.first()
        if artifactory_config:
            artifactory_config.health_status = 'unhealthy'
            artifactory_config.last_error = str(e)
            artifactory_config.last_health_check = datetime.utcnow()
            db.session.commit()
        return False

def push_docker_image_to_artifactory(image_name, tag, execution_id=None):
    """Push Docker image to Artifactory"""
    try:
        # This would typically involve Docker commands or Docker Registry API
        # For now, we'll create a database record and simulate the push
        
        artifactory_path = f"{ARTIFACTORY_REPOSITORY}/{image_name}:{tag}"
        artifactory_url = f"{ARTIFACTORY_URL}/artifactory/{artifactory_path}"
        
        docker_image = DockerImage(
            image_name=image_name,
            tag=tag,
            repository=ARTIFACTORY_REPOSITORY,
            artifactory_path=artifactory_path,
            artifactory_url=artifactory_url,
            build_id=execution_id,
            pushed_to_artifactory=True,
            pushed_at=datetime.utcnow()
        )
        
        db.session.add(docker_image)
        db.session.commit()
        
        return {
            'success': True,
            'artifactory_url': artifactory_url,
            'image_id': docker_image.id
        }
    
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }

# Artifactory API endpoints
@app.route('/api/artifactory/health', methods=['GET'])
def check_artifactory_health():
    """Check Artifactory connectivity"""
    try:
        is_healthy = artifactory_health_check()
        if is_healthy:
            return jsonify({'success': True, 'message': 'Artifactory is reachable'})
        else:
            return jsonify({'success': False, 'error': 'Artifactory is not reachable'}), 503
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 503

@app.route('/api/artifactory/images', methods=['GET'])
def get_docker_images():
    """Get Docker images from Artifactory"""
    try:
        images = DockerImage.query.order_by(DockerImage.created_at.desc()).all()
        return jsonify({
            'success': True,
            'images': [image.to_dict() for image in images]
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/artifactory/push', methods=['POST'])
def push_image():
    """Push Docker image to Artifactory"""
    try:
        data = request.get_json()
        image_name = data.get('image_name')
        tag = data.get('tag', 'latest')
        execution_id = data.get('execution_id')
        
        if not image_name:
            return jsonify({'success': False, 'error': 'Image name is required'}), 400
        
        result = push_docker_image_to_artifactory(image_name, tag, execution_id)
        
        if result.get('success'):
            return jsonify(result)
        else:
            return jsonify(result), 500
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/docker/build', methods=['POST'])
def build_docker_image():
    """Build Docker image and push to Artifactory"""
    try:
        data = request.get_json()
        dockerfile_path = data.get('dockerfile_path', 'Dockerfile')
        image_name = data.get('image_name', 'script-execution-manager')
        tag = data.get('tag', 'latest')
        execution_id = data.get('execution_id')
        
        # Build Docker image
        build_command = f"docker build -t {image_name}:{tag} -f {dockerfile_path} ."
        result = subprocess.run(build_command, shell=True, capture_output=True, text=True)
        
        if result.returncode != 0:
            return jsonify({'success': False, 'error': result.stderr}), 500
        
        # Tag for Artifactory
        artifactory_tag = f"{ARTIFACTORY_URL}/{ARTIFACTORY_REPOSITORY}/{image_name}:{tag}"
        tag_command = f"docker tag {image_name}:{tag} {artifactory_tag}"
        tag_result = subprocess.run(tag_command, shell=True, capture_output=True, text=True)
        
        if tag_result.returncode != 0:
            return jsonify({'success': False, 'error': tag_result.stderr}), 500
        
        # Push to Artifactory
        push_command = f"docker push {artifactory_tag}"
        push_result = subprocess.run(push_command, shell=True, capture_output=True, text=True)
        
        if push_result.returncode != 0:
            return jsonify({'success': False, 'error': push_result.stderr}), 500
        
        # Create database record
        docker_image_record = push_docker_image_to_artifactory(image_name, tag, execution_id)
        
        return jsonify({
            'success': True,
            'message': 'Docker image built and pushed successfully',
            'image': docker_image_record
        })
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)