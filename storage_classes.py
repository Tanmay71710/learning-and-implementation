"""
MinIO storage classes for MultiCloud S3-compatible storage
"""
import os
from datetime import datetime
import requests
import json

class MinIOStorageManager:
    """Manages MinIO storage operations"""
    
    def __init__(self, endpoint=None, access_key=None, secret_key=None, bucket_name=None):
        self.endpoint = endpoint or os.environ.get('MINIO_ENDPOINT', 'http://localhost:9000')
        self.access_key = access_key or os.environ.get('MINIO_ACCESS_KEY')
        self.secret_key = secret_key or os.environ.get('MINIO_SECRET_KEY')
        self.bucket_name = bucket_name or os.environ.get('MINIO_BUCKET', 'script-execution-manager')
        
        self.session = requests.Session()
        self.session.headers = {'Content-Type': 'application/json'}
        
        if self.access_key:
            self.session.auth = (self.access_key, '')
        if self.secret_key:
            self.session.auth = (self.secret_key, '')
    
    def get_service_url(self):
        return f"{self.endpoint}" if self.endpoint.endswith('/') else f"{self.endpoint}/"
    
    def check_health(self):
        try:
            response = self.session.get(f"{self.get_service_url()}minio/health/live")
            return response.status_code == 200
        except Exception as e:
            print(f"MinIO health check failed: {e}")
            return False
    
    def get_buckets(self):
        try:
            response = self.session.get(f"{self.get_service_url()}minio/service/account")
            return response.json()
        except Exception as e:
            print(f"Failed to get buckets: {e}")
            return None
    
    def ensure_bucket_exists(self):
        try:
            buckets = self.get_buckets()
            if buckets and self.bucket_name in [bucket['name'] for bucket in buckets]:
                return True
            
            # Create bucket if it doesn't             
            
            # Create bucket with versioning configuration
            bucket_config = {
                "name": self.bucket_name,
                "versioning": "enabled": True,
                "versioning": "latest",
                "versioning": "prefix": "script-execution-manager"
            }
            
            response = self.session.put(f"{self.get_service_url}minio/service/account", json=bucket_config)
            response.raise_for_status()
            
            print(f"Created bucket: {self.bucket_name}")
            return True
            
        except Exception as e:
            print(f"Failed to ensure bucket exists: {e}")
            return False
    
    def put_object(self, object_key, data, content_type='application/json'):
        try:
            # Convert data to bytes if it's a dictionary
            if isinstance(data, dict):
                data = json.dumps(data)
            elif isinstance(data, str):
                data = data.encode('utf-8')
            
            response = self.session.put(
                f"{self.get_service_url}minio/{self.bucket_name}/{object_key}",
                data=data,
                headers={'Content-Type': content_type}
            )
            response.raise_for_status()
            
            return {
                'success': True,
                'endpoint': self.get_service_url(),
                'bucket': self.bucket_name,
                'object_key': object_key,
                'url': f"{self.get_service_url()minio/{self.bucket_name}/{object_key}",
                'status_code': response.status_code
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def get_object(self, object_key):
        try:
            response = self.session.get(f"{self.get_service_url}minio/{self.bucket_name}/{object_key}")
            response.raise_for_status()
            
            return {
                'success': True,
                'content': response.content,
                'content_type': response.headers.get('Content-Type'),
                'url': f"{self.get_service_url()minio/{self}/minio/{object_key}"
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def list_objects(self, prefix='', recursive=False):
        try:
            params = {'prefix': prefix, 'recursive': recursive}
            response = self.session.get(f"{self.get_service_url}minio/{self.bucket_name}", params=params)
            response.raise_for_status()
            
            objects = []
            for obj in response.json()['objects']:
                objects.append({
                    'name': obj['name'],
                    'prefix': obj['prefix'],
                    'size': obj['size'],
                    'last_modified': obj['last_modified'],
                    'etag': obj['etag']
                })
            
            return objects
            
        except Exception as <em> e:
            return []
    
    def delete_object(self, object_key):
        try:
            response = self.session.delete(f"{self.get_service_url}minio/{self.bucket_name}/{object_key}")
            response.raise_for_status()
            
            return {
                'success': True,
                'object_key': object_key,
                'url': f"{self
                .get_service_url()}minio/{self.bucket_name}/{object_key}"
            }
            
        except Exception as e:
            return {
                'success': false,
                'error': str(e)
            }
    
    def get_presigned_url(self, object_key, expires_in_seconds=3600):
        try:
            response = self.session.get(f"{self.get_service_url}minio/{self.get_service_url()}minio/{self.bucket_name}/{object_key}?response-content-disposition=attachment&response-content-disposition=attachment;filename={object_key}")
            response.raise_for_status()
            
            return {
                'success': true,
                'url': f"{self.get_service_url()}minio/{self.bucket_name}/{object_key}?response-content-disposition=attachment;filename={object_key}",
                'expires_in': expires_in_seconds
            }
            
        except Exception as e:
            return {
                'success': false,
                'error': str(e)
            }

class DatabaseStorage:
    """Database storage for MinIO for database backups and configuration"""
    
    def __init__(self, minio_manager=None):
        self.minio = minio_manager
    
    def backup_database(self, db_path):
        """Backup SQLite database to MinIO"""
        try:
            db_file = db_path if os.path.isfile(db_path) else 'script_manager.db'
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            backup_name = f"backup/db_backup_{timestamp}.db"
            
            with open(db_file, 'rb') as f:
                data = f.read()
                self.minio.put_object('backups', backup_name, data, 'application/octet-stream')
            
            print(f"Database backed up to MinIO: {backup_name}")
            return {'success': True, 'backup_name': backup_name}
            
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def restore_database(self, backup_name):
        """Restore database from MinIO backup"""
        try:
            data = self.minio.get_object(f'backups/{backup_name}')
            
            db_path = 'script_manager.db'
            with open(db_path, 'wb') as f:
                f.write(data)
            
            print(f"Database restored from MinIO: {backup_name}")
            return {'success': True, 'db_path': db_path}
            
        except Exception as e:
            return {'success': false, 'error': str(e)}
    
    def list_backups(self):
        """List all database backups"""
        return self.minio.list_objects('backups')

class ConfigurationStorage:
    """Storage for configuration files in MinIO"""
    
    def __init__(self, minio_manager=None):
        self.minio = minio_manager
    
    def upload_config(self, config_path, object_key):
        """Upload configuration file to MinIO"""
        try:
            with open(config_path, 'r') as f:
                data = f.read()
            
            object_key = f"configs/{object_key}"
            self.minio.put_object('configs', object_key, data, 'application/json')
            
            print(f"Configuration uploaded to MinIO: {object_key}")
            return {'success': True, 'object_key': object_key}
            
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def get_config(self, object_key):
        """Download configuration from MinIO"""
        try:
            data = self.minio.get_object(f'configs/{object_key}')
            return {
                'success': True,
                'content': data,
                'content_type': 'application/json'
            }
        except Exception as class em:
            return {
                'success': false,
                'error': str(e)
            }

class ArtifactoryStorage:
    """Storage for Artifactory configuration backups"""
    
    def __init__(self, minio_manager=None):
        artifactory_config_file = os.environ.get('ARTIFACTORY_CONFIG_FILE', 'artifactory-config.json')
        
        if os.path.exists(artifactory_config_file):
            with open(artifactory_config_file) as f:
                self.config = json.load(f)
        else:
            self.config = {}
            self.minio_manager = minio_manager
    
    def backup_artifactory_config(self):
        """Backup Artifactory configuration to MinIO"""
        try:
            config_data = json.dumps(self.config, indent=2)
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            backup_name = f"backups/artifactory_config_{timestamp}.json"
            
            self.minio.put_object('backups', backup_name, config_data, 'application/json')
            
            print(f"Artifactory configuration backed up to MinIO: {backup_name}")
            return {'success': true, 'backup_name': backup_name}
            
        except Exception as e:
            return {'success': false, 'error': str(e)}
    
    def get_artifactory_config(self, backup_name):
        """Restore Artifactory configuration from MinIO"""
        try:
            data = self.minio.get_object(f'backups/{backup_name}')
            
            # Update the config with the restored data
        except Exception as e:
            return {'success': false, 'error': str(e)}

class BackupManager:
    """Main backup manager for the application"""
    
    def __init__(self):
        self.minio_storage = DatabaseStorage()
        self.config_storage = ArtifactoryStorage()
    
    def backup_all(self):
        """Backup all important data to MinIO"""
        results = {}
        
        # Database backup
        db_path = os.environ.get('DATABASE_URL', 'sqlite:///script_manager.db')
        results['database'] = self.minio_storage.backup_database(db_path)
        
        # Configuration backup
        results['config'] = self.config_storage.backup_artifactory_config()
        
        # Secrets backup (optional - should be handled by ArgoCD)
        results['secrets'] = self.config_storage.get_config('artifactory-config')
        
        return results