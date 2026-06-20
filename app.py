from flask import Flask, render_template, request, jsonify
import subprocess
import json
import os
import requests
from datetime import datetime

app = Flask(__name__)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///script_manager.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = false

# Initialize database
from models import db, Script, JobExecution, DockerImage, JenkinsConfig, ArtifactoryConfig, SystemMetrics, init_db

# Initialize backup manager
backup_manager = backup_manager
db.init_db()