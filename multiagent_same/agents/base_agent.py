"""Base Agent class for the multi-agent system."""

import threading
import time
from abc import ABC, abstractmethod
from typing import Any, Dict, Optional
from enum import Enum


class AgentStatus(Enum):
    """Status of an agent."""
    IDLE = "idle"
    BUSY = "busy"
    STOPPED = "stopped"


class Agent(ABC):
    """Base class for all agents in the multi-agent system."""
    
    def __init__(self, agent_id: str, name: str):
        """
        Initialize an agent.
        
        Args:
            agent_id: Unique identifier for the agent
            name: Human-readable name for the agent
        """
        self.agent_id = agent_id
        self.name = name
        self.status = AgentStatus.IDLE
        self._thread: Optional[threading.Thread] = None
        self._stop_event = threading.Event()
        self._current_task = None
        self._result_queue = []
        self._lock = threading.Lock()
    
    @abstractmethod
    def process_task(self, task: Any) -> Any:
        """
        Process a task. Must be implemented by subclasses.
        
        Args:
            task: The task to process
            
        Returns:
            The result of processing the task
        """
        pass
    
    def assign_task(self, task: Any) -> bool:
        """
        Assign a task to this agent.
        
        Args:
            task: The task to assign
            
        Returns:
            True if task was assigned successfully, False otherwise
        """
        with self._lock:
            if self.status == AgentStatus.BUSY:
                return False
            
            self._current_task = task
            self.status = AgentStatus.BUSY
            return True
    
    def start(self):
        """Start the agent's processing thread."""
        if self._thread is None or not self._thread.is_alive():
            self._stop_event.clear()
            self._thread = threading.Thread(target=self._run, daemon=True)
            self._thread.start()
    
    def stop(self):
        """Stop the agent's processing thread."""
        self._stop_event.set()
        if self._thread and self._thread.is_alive():
            self._thread.join(timeout=5)
        self.status = AgentStatus.STOPPED
    
    def _run(self):
        """Main loop for the agent's processing thread."""
        while not self._stop_event.is_set():
            with self._lock:
                if self._current_task is not None:
                    task = self._current_task
                    self._current_task = None
                else:
                    task = None
            
            if task is not None:
                try:
                    result = self.process_task(task)
                    with self._lock:
                        self._result_queue.append(result)
                    self.status = AgentStatus.IDLE
                except Exception as e:
                    with self._lock:
                        self._result_queue.append({"error": str(e)})
                    self.status = AgentStatus.IDLE
            
            time.sleep(0.1)  # Small sleep to prevent busy waiting
    
    def get_result(self) -> Optional[Any]:
        """
        Get the next available result from the result queue.
        
        Returns:
            The next result, or None if no results available
        """
        with self._lock:
            if self._result_queue:
                return self._result_queue.pop(0)
            return None
    
    def get_status(self) -> AgentStatus:
        """Get the current status of the agent."""
        return self.status
    
    def __repr__(self) -> str:
        return f"Agent(id={self.agent_id}, name={self.name}, status={self.status.value})"