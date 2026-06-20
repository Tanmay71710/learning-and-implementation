"""Task classes for the multi-agent system."""

from dataclasses import dataclass, field
from enum import Enum
from typing import Any, Dict, Optional
from datetime import datetime
import uuid


class TaskPriority(Enum):
    """Priority levels for tasks."""
    LOW = 1
    MEDIUM = 2
    HIGH = 3
    URGENT = 4


class TaskStatus(Enum):
    """Status of a task."""
    PENDING = "pending"
    ASSIGNED = "assigned"
    COMPLETED = "completed"
    FAILED = "failed"


@dataclass
class Task:
    """Base task class for the multi-agent system."""
    
    task_id: str = field(default_factory=lambda: str(uuid.uuid4()))
    task_type: str = "generic"
    description: str = ""
    data: Dict[str, Any] = field(default_factory=dict)
    priority: TaskPriority = TaskPriority.MEDIUM
    status: TaskStatus = TaskStatus.PENDING
    created_at: datetime = field(default_factory=datetime.now)
    assigned_to: Optional[str] = None
    result: Optional[Any] = None
    error: Optional[str] = None
    
    def assign(self, agent_id: str):
        """Assign the task to an agent."""
        self.assigned_to = agent_id
        self.status = TaskStatus.ASSIGNED
    
    def complete(self, result: Any):
        """Mark the task as completed with a result."""
        self.result = result
        self.status = TaskStatus.COMPLETED
    
    def fail(self, error: str):
        """Mark the task as failed with an error message."""
        self.error = error
        self.status = TaskStatus.FAILED
    
    def __repr__(self) -> str:
        return (f"Task(id={self.task_id[:8]}, type={self.task_type}, "
                f"status={self.status.value}, priority={self.priority.name})")


@dataclass
class ProcessingTask(Task):
    """Task for data processing operations."""
    
    def __post_init__(self):
        self.task_type = "processing"


@dataclass
class AnalysisTask(Task):
    """Task for data analysis operations."""
    
    def __post_init__(self):
        self.task_type = "analysis"


@dataclass
class ComputationTask(Task):
    """Task for computational operations."""
    
    def __post_init__(self):
        self.task_type = "computation"