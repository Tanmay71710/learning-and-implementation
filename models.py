from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Script(db.Model):
    """Model for storing script information"""
    __tablename__ = 'scripts'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), unique=True, nullable=False)
    path = db.Column(db.String(500), nullable=False)
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    
    # Relationships
    executions = db.relationship('JobExecution', backref='script', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'path': self.path,
            'description': self.description,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'is_active': self.is_active
        }

class JobExecution(db.Model):
    """Model for storing job execution history"""
    __tablename__ = 'job_executions'
    
    id = db.Column(db.Integer, primary_key=True)
    script_id = db.Column(db.Integer, db.ForeignKey('scripts.id'), nullable=False)
    execution_type = db.Column(db.String(50), nullable=False)  # 'jenkins' or 'local'
    status = db.Column(db.String(50), nullable=False)  # 'queued', 'running', 'success', 'failure'
    jenkins_queue_id = db.Column(db.String(255), nullable=True)
    jenkins_build_number = db.Column(db.Integer, nullable=True)
    jenkins_job_url = db.Column(db.String(500), nullable=True)
    parameters = db.Column(db.Text, nullable=True)  # JSON string of parameters
    output = db.Column(db.Text, nullable=True)
    error_message = db.Column(db.Text, nullable=True)
    started_at = db.Column(db.DateTime, nullable=True)
    completed_at = db.Column(db.DateTime, nullable=True)
    duration_seconds = db.Column(db.Float, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'script_id': self.script_id,
            'script_name': self.script.name if self.script else None,
            'execution_type': self.execution_type,
            'status': self.status,
            'jenkins_queue_id': self.jenkins_queue_id,
            'jenkins_build_number': self.jenkins_build_number,
            'jenkins_job_url': self.jenkins_job_url,
            'parameters': self.parameters,
            'output': self.output,
            'error_message': self.error_message,
            'started_at': self.started_at.isoformat() if self.started_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
            'duration_seconds': self.duration_seconds,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class DockerImage(db.Model):
    """Model for storing Docker image information"""
    __tablename__ = 'docker_images'
    
    id = db.Column(db.Integer, primary_key=True)
    image_name = db.Column(db.String(255), nullable=False)
    tag = db.Column(db.String(100), nullable=False)
    repository = db.Column(db.String(255), nullable=False)  # Artifactory repository
    artifactory_path = db.Column(db.String(500), nullable=True)
    digest = db.Column(db.String(255), nullable=True)
    size_bytes = db.Column(db.BigInteger, nullable=True)
    build_id = db.Column(db.Integer, db.ForeignKey('job_executions.id'), nullable=True)
    pushed_to_artifactory = db.Column(db.Boolean, default=False)
    artifactory_url = db.Column(db.String(500), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    pushed_at = db.Column(db.DateTime, nullable=True)
    
    # Relationships
    build = db.relationship('JobExecution', backref='docker_images', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'image_name': self.image_name,
            'tag': self.tag,
            'repository': self.repository,
            'artifactory_path': self.artifactory_path,
            'digest': self.digest,
            'size_bytes': self.size_bytes,
            'build_id': self.build_id,
            'pushed_to_artifactory': self.pushed_to_artifactory,
            'artifactory_url': self.artifactory_url,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'pushed_at': self.pushed_at.isoformat() if self.pushed_at else None
        }

class JenkinsConfig(db.Model):
    """Model for storing Jenkins configuration and status"""
    __tablename__ = 'jenkins_config'
    
    id = db.Column(db.Integer, primary_key=True)
    jenkins_url = db.Column(db.String(500), nullable=False)
    job_name = db.Column(db.String(255), nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    last_health_check = db.Column(db.DateTime, nullable=True)
    health_status = db.Column(db.String(50), nullable=True)  # 'healthy', 'unhealthy', 'unknown'
    last_error = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'jenkins_url': self.jenkins_url,
            'job_name': self.job_name,
            'is_active': self.is_active,
            'last_health_check': self.last_health_check.isoformat() if self.last_health_check else None,
            'health_status': self.health_status,
            'last_error': self.last_error,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class ArtifactoryConfig(db.Model):
    """Model for storing Artifactory configuration"""
    __tablename__ = 'artifactory_config'
    
    id = db.Column(db.Integer, primary_key=True)
    artifactory_url = db.Column(db.String(500), nullable=False)
    repository = db.Column(db.String(255), nullable=False)
    username = db.Column(db.String(255), nullable=True)
    api_key = db.Column(db.String(255), nullable=True)
    access_token = db.Column(db.String(255), nullable=True)
    is_active = db.Column(db.Boolean, default=True)
    last_health_check = db.Column(db.DateTime, nullable=True)
    health_status = db.Column(db.String(50), nullable=True)
    last_error = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'artifactory_url': self.artifactory_url,
            'repository': self.repository,
            'username': self.username,
            'is_active': self.is_active,
            'last_health_check': self.last_health_check.isoformat() if self.last_health_check else None,
            'health_status': self.health_status,
            'last_error': self.last_error,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class SystemMetrics(db.Model):
    """Model for storing system metrics and analytics"""
    __tablename__ = 'system_metrics'
    
    id = db.Column(db.Integer, primary_key=True)
    metric_type = db.Column(db.String(50), nullable=False)  # 'job_count', 'success_rate', 'avg_duration', etc.
    metric_value = db.Column(db.Float, nullable=False)
    metric_date = db.Column(db.DateTime, default=datetime.utcnow)
    additional_data = db.Column(db.Text, nullable=True)  # JSON string for additional context
    
    def to_dict(self):
        return {
            'id': self.id,
            'metric_type': self.metric_type,
            'metric_value': self.metric_value,
            'metric_date': self.metric_date.isoformat() if self.metric_date else None,
            'additional_data': self.additional_data
        }

def init_db(app):
    """Initialize the database with the Flask app"""
    db.init_app(app)
    
    with app.app_context():
        db.create_all()
        print("Database tables created successfully")