"""Multi-Agent System - A simple educational multi-agent implementation."""

__version__ = "1.0.0"
__author__ = "Multi-Agent System Demo"

from agents import Agent, AgentStatus, WorkerAgent, AnalyzerAgent, ComputerAgent
from tasks import Task, TaskPriority, TaskStatus, ProcessingTask, AnalysisTask, ComputationTask
from coordinator import Coordinator

__all__ = [
    'Agent', 'AgentStatus', 'WorkerAgent', 'AnalyzerAgent', 'ComputerAgent',
    'Task', 'TaskPriority', 'TaskStatus', 'ProcessingTask', 'AnalysisTask', 'ComputationTask',
    'Coordinator'
]