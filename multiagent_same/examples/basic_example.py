"""Example usage of the multi-agent system."""

import sys
import os
import time

# Add the parent directory to the path to import modules
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from agents import WorkerAgent, AnalyzerAgent, ComputerAgent
from tasks import ProcessingTask, AnalysisTask, ComputationTask, TaskPriority
from coordinator import Coordinator


def print_separator():
    """Print a visual separator."""
    print("\n" + "=" * 60 + "\n")


def main():
    """Demonstrate the multi-agent system."""
    
    print("Multi-Agent System Demo")
    print_separator()
    
    # Create coordinator
    coordinator = Coordinator()
    print("✓ Coordinator created")
    
    # Create and register agents
    print("\nCreating agents...")
    worker1 = WorkerAgent("worker-1", "Worker 1")
    worker2 = WorkerAgent("worker-2", "Worker 2")
    analyzer1 = AnalyzerAgent("analyzer-1", "Analyzer 1")
    computer1 = ComputerAgent("computer-1", "Computer 1")
    
    coordinator.register_agent(worker1)
    coordinator.register_agent(worker2)
    coordinator.register_agent(analyzer1)
    coordinator.register_agent(computer1)
    
    print("✓ Registered 4 agents:")
    print(f"  - {worker1}")
    print(f"  - {worker2}")
    print(f"  - {analyzer1}")
    print(f"  - {computer1}")
    
    # Start the coordinator
    coordinator.start()
    print("\n✓ Coordinator started")
    
    # Submit various tasks
    print("\nSubmitting tasks...")
    tasks = [
        ProcessingTask(
            description="Process text data",
            data={"input": ["hello", "world", "multi", "agent"]},
            priority=TaskPriority.HIGH
        ),
        ProcessingTask(
            description="Process numbers",
            data={"input": [1, 2, 3, 4, 5]},
            priority=TaskPriority.MEDIUM
        ),
        AnalysisTask(
            description="Analyze number sequence",
            data={"data": [10, 20, 30, 40, 50]},
            priority=TaskPriority.HIGH
        ),
        ComputationTask(
            description="Compute factorial",
            data={"operation": "factorial", "operands": [5]},
            priority=TaskPriority.MEDIUM
        ),
        ComputationTask(
            description="Multiply numbers",
            data={"operation": "multiply", "operands": [2, 3, 4]},
            priority=TaskPriority.LOW
        ),
        AnalysisTask(
            description="Analyze mixed data",
            data={"data": {"name": "test", "value": 42}},
            priority=TaskPriority.MEDIUM
        ),
        ProcessingTask(
            description="Process more text",
            data={"input": ["agent", "system", "demo"]},
            priority=TaskPriority.URGENT
        ),
    ]
    
    for task in tasks:
        coordinator.submit_task(task)
        print(f"  Submitted: {task}")
    
    # Monitor progress
    print("\nMonitoring task progress...")
    print_separator()
    
    max_wait_time = 10  # seconds
    start_time = time.time()
    
    while time.time() - start_time < max_wait_time:
        stats = coordinator.get_task_statistics()
        agent_status = coordinator.get_agent_status()
        
        print(f"\rProgress: {stats['completed']} completed, {stats['assigned']} assigned, "
              f"{stats['pending']} pending, {stats['failed']} failed | Agents: {list(agent_status.values())}", end="")
        
        if stats['pending'] == 0 and stats['assigned'] == 0:
            break
        
        time.sleep(0.5)
    
    print("\n")
    print_separator()
    
    # Final statistics
    final_stats = coordinator.get_task_statistics()
    print("Final Statistics:")
    print(f"  Total tasks: {final_stats['completed'] + final_stats['failed'] + final_stats['pending'] + final_stats['assigned']}")
    print(f"  Completed: {final_stats['completed']}")
    print(f"  Failed: {final_stats['failed']}")
    print(f"  Assigned: {final_stats['assigned']}")
    print(f"  Pending: {final_stats['pending']}")
    print(f"  Total agents: {final_stats['total_agents']}")
    
    # Show completed tasks
    print_separator()
    print("Completed Tasks:")
    completed_tasks = coordinator.get_completed_tasks()
    for task in completed_tasks:
        print(f"\n  Task: {task.description}")
        print(f"  Type: {task.task_type}")
        print(f"  Assigned to: {task.assigned_to}")
        print(f"  Result: {task.result}")
    
    # Show failed tasks (if any)
    failed_tasks = coordinator.get_failed_tasks()
    if failed_tasks:
        print_separator()
        print("Failed Tasks:")
        for task in failed_tasks:
            print(f"\n  Task: {task.description}")
            print(f"  Error: {task.error}")
    
    # Show agent performance
    print_separator()
    print("Agent Performance:")
    print(f"  Worker 1: {worker1.processed_count} tasks processed")
    print(f"  Worker 2: {worker2.processed_count} tasks processed")
    print(f"  Analyzer 1: {analyzer1.analysis_count} tasks analyzed")
    print(f"  Computer 1: {computer1.computation_count} tasks computed")
    
    # Stop the coordinator
    print_separator()
    print("Stopping coordinator...")
    coordinator.stop()
    print("✓ Coordinator stopped")
    
    print("\nDemo completed successfully!")


if __name__ == "__main__":
    main()