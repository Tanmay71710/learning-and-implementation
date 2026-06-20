"""Coordinator for managing agents and task distribution."""

import threading
import time
from typing import Dict, List, Optional, Callable
from queue import PriorityQueue
import heapq

from agents.base_agent import Agent, AgentStatus
from tasks.task import Task, TaskPriority, TaskStatus


class Coordinator:
    """Coordinates agents and distributes tasks among them."""
    
    def __init__(self):
        """Initialize the coordinator."""
        self.agents: Dict[str, Agent] = {}
        self.task_queue: List[tuple] = []  # (priority, task) for heapq
        self.assigned_tasks: Dict[str, Task] = {}  # Tasks currently being processed
        self.completed_tasks: Dict[str, Task] = {}
        self.failed_tasks: Dict[str, Task] = {}
        self._lock = threading.Lock()
        self._running = False
        self._thread: Optional[threading.Thread] = None
        self._task_counter = 0  # For tie-breaking in priority queue
    
    def register_agent(self, agent: Agent):
        """
        Register an agent with the coordinator.
        
        Args:
            agent: The agent to register
        """
        with self._lock:
            self.agents[agent.agent_id] = agent
            agent.start()
    
    def unregister_agent(self, agent_id: str):
        """
        Unregister an agent from the coordinator.
        
        Args:
            agent_id: The ID of the agent to unregister
        """
        with self._lock:
            if agent_id in self.agents:
                agent = self.agents[agent_id]
                agent.stop()
                del self.agents[agent_id]
    
    def submit_task(self, task: Task):
        """
        Submit a task to the coordinator.
        
        Args:
            task: The task to submit
        """
        with self._lock:
            # Use negative priority for max-heap behavior with heapq
            priority = -task.priority.value
            self._task_counter += 1
            heapq.heappush(self.task_queue, (priority, self._task_counter, task))
    
    def start(self):
        """Start the coordinator's task distribution loop."""
        if not self._running:
            self._running = True
            self._thread = threading.Thread(target=self._run, daemon=True)
            self._thread.start()
    
    def stop(self):
        """Stop the coordinator's task distribution loop."""
        self._running = False
        if self._thread and self._thread.is_alive():
            self._thread.join(timeout=5)
        
        # Stop all agents
        with self._lock:
            for agent in self.agents.values():
                agent.stop()
    
    def _run(self):
        """Main loop for task distribution."""
        while self._running:
            self._distribute_tasks()
            self._collect_results()
            time.sleep(0.1)
    
    def _distribute_tasks(self):
        """Distribute pending tasks to available agents."""
        with self._lock:
            while self.task_queue:
                # Find an available agent
                available_agent = None
                for agent in self.agents.values():
                    if agent.get_status() == AgentStatus.IDLE:
                        available_agent = agent
                        break
                
                if available_agent is None:
                    break  # No agents available
                
                # Get the highest priority task
                _, _, task = heapq.heappop(self.task_queue)
                
                # Assign the task
                if available_agent.assign_task(task):
                    task.assign(available_agent.agent_id)
                    self.assigned_tasks[task.task_id] = task
                else:
                    # Put task back if assignment failed
                    heapq.heappush(self.task_queue, (task.priority.value, self._task_counter, task))
    
    def _collect_results(self):
        """Collect results from agents."""
        with self._lock:
            for agent in self.agents.values():
                result = agent.get_result()
                if result is not None:
                    # Find the corresponding task in assigned_tasks
                    for task_id, task in list(self.assigned_tasks.items()):
                        if task.assigned_to == agent.agent_id:
                            # Remove from assigned_tasks
                            del self.assigned_tasks[task_id]
                            
                            # Update task status and result
                            if isinstance(result, dict) and "error" in result:
                                task.fail(result["error"])
                                self.failed_tasks[task_id] = task
                            else:
                                task.complete(result)
                                self.completed_tasks[task_id] = task
                            break
    
    def get_agent_status(self) -> Dict[str, str]:
        """
        Get the status of all registered agents.
        
        Returns:
            Dictionary mapping agent IDs to their status
        """
        with self._lock:
            return {agent_id: agent.get_status().value 
                    for agent_id, agent in self.agents.items()}
    
    def get_task_statistics(self) -> Dict[str, int]:
        """
        Get statistics about tasks.
        
        Returns:
            Dictionary with task statistics
        """
        with self._lock:
            return {
                "pending": len(self.task_queue),
                "assigned": len(self.assigned_tasks),
                "completed": len(self.completed_tasks),
                "failed": len(self.failed_tasks),
                "total_agents": len(self.agents)
            }
    
    def get_completed_tasks(self) -> List[Task]:
        """
        Get all completed tasks.
        
        Returns:
            List of completed tasks
        """
        with self._lock:
            return list(self.completed_tasks.values())
    
    def get_failed_tasks(self) -> List[Task]:
        """
        Get all failed tasks.
        
        Returns:
            List of failed tasks
        """
        with self._lock:
            return list(self.failed_tasks.values())