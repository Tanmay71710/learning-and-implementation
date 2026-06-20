"""Advanced example showing custom agent implementation."""

import sys
import os
import time

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from agents import Agent, AgentStatus
from tasks import Task, TaskPriority
from coordinator import Coordinator


class DataFilterAgent(Agent):
    """Custom agent that filters data based on criteria."""
    
    def __init__(self, agent_id: str, name: str, filter_func=None):
        super().__init__(agent_id, name)
        self.filter_func = filter_func or (lambda x: True)
        self.filtered_count = 0
    
    def process_task(self, task: Task) -> dict:
        """Filter data based on the filter function."""
        data = task.data.get("items", [])
        
        # Apply filter
        filtered_items = [item for item in data if self.filter_func(item)]
        
        self.filtered_count += 1
        
        return {
            "filtered": True,
            "original_count": len(data),
            "filtered_count": len(filtered_items),
            "filtered_items": filtered_items
        }


class DataTransformAgent(Agent):
    """Custom agent that transforms data."""
    
    def __init__(self, agent_id: str, name: str, transform_func=None):
        super().__init__(agent_id, name)
        self.transform_func = transform_func or (lambda x: x)
        self.transformed_count = 0
    
    def process_task(self, task: Task) -> dict:
        """Transform data based on the transform function."""
        data = task.data.get("items", [])
        
        # Apply transformation
        transformed_items = [self.transform_func(item) for item in data]
        
        self.transformed_count += 1
        
        return {
            "transformed": True,
            "original_count": len(data),
            "transformed_items": transformed_items
        }


def main():
    """Demonstrate custom agents."""
    
    print("Advanced Multi-Agent System Demo")
    print("Custom Agents for Data Processing Pipeline")
    print("=" * 60 + "\n")
    
    # Create coordinator
    coordinator = Coordinator()
    
    # Create custom agents with specific functions
    # Agent 1: Filter even numbers
    even_filter = DataFilterAgent(
        "filter-even",
        "Even Number Filter",
        filter_func=lambda x: isinstance(x, int) and x % 2 == 0
    )
    
    # Agent 2: Filter positive numbers
    positive_filter = DataFilterAgent(
        "filter-positive",
        "Positive Number Filter",
        filter_func=lambda x: isinstance(x, (int, float)) and x > 0
    )
    
    # Agent 3: Square numbers
    square_transform = DataTransformAgent(
        "transform-square",
        "Square Transform",
        transform_func=lambda x: x ** 2 if isinstance(x, (int, float)) else x
    )
    
    # Agent 4: Convert to string
    string_transform = DataTransformAgent(
        "transform-string",
        "String Transform",
        transform_func=str
    )
    
    # Register agents
    coordinator.register_agent(even_filter)
    coordinator.register_agent(positive_filter)
    coordinator.register_agent(square_transform)
    coordinator.register_agent(string_transform)
    
    print("✓ Registered 4 custom agents")
    
    # Start coordinator
    coordinator.start()
    print("✓ Coordinator started\n")
    
    # Submit data processing tasks
    print("Submitting data processing tasks...")
    tasks = [
        Task(
            task_type="filter",
            description="Filter even numbers",
            data={"items": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]},
            priority=TaskPriority.HIGH
        ),
        Task(
            task_type="filter",
            description="Filter positive numbers",
            data={"items": [-5, -3, -1, 0, 1, 3, 5, 7]},
            priority=TaskPriority.HIGH
        ),
        Task(
            task_type="transform",
            description="Square numbers",
            data={"items": [1, 2, 3, 4, 5]},
            priority=TaskPriority.MEDIUM
        ),
        Task(
            task_type="transform",
            description="Convert to strings",
            data={"items": [1, 2, 3, "hello", 4.5]},
            priority=TaskPriority.MEDIUM
        ),
    ]
    
    for task in tasks:
        coordinator.submit_task(task)
        print(f"  Submitted: {task.description}")
    
    # Wait for completion
    print("\nProcessing...")
    time.sleep(3)
    
    # Get results
    print("\n" + "=" * 60)
    print("Results:")
    print("=" * 60)
    
    completed_tasks = coordinator.get_completed_tasks()
    for task in completed_tasks:
        print(f"\nTask: {task.description}")
        print(f"Agent: {task.assigned_to}")
        print(f"Result: {task.result}")
    
    # Show agent statistics
    print("\n" + "=" * 60)
    print("Agent Statistics:")
    print("=" * 60)
    print(f"Even Filter: {even_filter.filtered_count} tasks processed")
    print(f"Positive Filter: {positive_filter.filtered_count} tasks processed")
    print(f"Square Transform: {square_transform.transformed_count} tasks processed")
    print(f"String Transform: {string_transform.transformed_count} tasks processed")
    
    # Cleanup
    coordinator.stop()
    print("\n✓ Demo completed")


if __name__ == "__main__":
    main()