# Quick Start Guide

Get started with the Multi-Agent System in 5 minutes!

## Installation

No installation required! The system uses only Python standard library.

```bash
cd multiagent_same
```

## Run Your First Example

### Basic Example
```bash
python examples/basic_example.py
```

This will demonstrate:
- Creating multiple agents
- Submitting various tasks
- Monitoring progress
- Collecting results

### Custom Agent Example
```bash
python examples/custom_agent_example.py
```

This will demonstrate:
- Creating custom agents
- Implementing custom logic
- Building data pipelines

## Create Your First Agent

```python
from agents import Agent
from tasks import Task

class MyAgent(Agent):
    def process_task(self, task):
        # Your custom logic here
        data = task.data.get("input", "default")
        result = f"Processed: {data}"
        return result

# Use your agent
from coordinator import Coordinator

coordinator = Coordinator()
my_agent = MyAgent("my-agent-1", "My Custom Agent")
coordinator.register_agent(my_agent)
coordinator.start()

# Submit a task
from tasks import Task, TaskPriority

task = Task(
    description="My first task",
    data={"input": "Hello World"},
    priority=TaskPriority.MEDIUM
)
coordinator.submit_task(task)

# Wait for processing
import time
time.sleep(2)

# Get results
completed_tasks = coordinator.get_completed_tasks()
for task in completed_tasks:
    print(f"Result: {task.result}")

# Clean up
coordinator.stop()
```

## Common Patterns

### 1. Simple Task Processing
```python
# Create a worker agent
from agents import WorkerAgent
worker = WorkerAgent("worker-1", "Worker")
coordinator.register_agent(worker)

# Submit a processing task
from tasks import ProcessingTask, TaskPriority
task = ProcessingTask(
    description="Process data",
    data={"input": [1, 2, 3, 4, 5]},
    priority=TaskPriority.HIGH
)
coordinator.submit_task(task)
```

### 2. Data Analysis
```python
# Create an analyzer agent
from agents import AnalyzerAgent
analyzer = AnalyzerAgent("analyzer-1", "Analyzer")
coordinator.register_agent(analyzer)

# Submit an analysis task
from tasks import AnalysisTask
task = AnalysisTask(
    description="Analyze numbers",
    data={"data": [10, 20, 30, 40, 50]},
    priority=TaskPriority.MEDIUM
)
coordinator.submit_task(task)
```

### 3. Computation
```python
# Create a computer agent
from agents import ComputerAgent
computer = ComputerAgent("computer-1", "Computer")
coordinator.register_agent(computer)

# Submit a computation task
from tasks import ComputationTask
task = ComputationTask(
    description="Calculate factorial",
    data={"operation": "factorial", "operands": [5]},
    priority=TaskPriority.HIGH
)
coordinator.submit_task(task)
```

### 4. Custom Filter Agent
```python
class FilterAgent(Agent):
    def __init__(self, agent_id, name, filter_func):
        super().__init__(agent_id, name)
        self.filter_func = filter_func
    
    def process_task(self, task):
        items = task.data.get("items", [])
        filtered = [item for item in items if self.filter_func(item)]
        return {"filtered_items": filtered}

# Use it
even_filter = FilterAgent(
    "filter-even",
    "Even Filter",
    lambda x: isinstance(x, int) and x % 2 == 0
)
coordinator.register_agent(even_filter)
```

## Monitoring

### Check Agent Status
```python
status = coordinator.get_agent_status()
print(status)
# Output: {'worker-1': 'idle', 'analyzer-1': 'busy', ...}
```

### Check Task Statistics
```python
stats = coordinator.get_task_statistics()
print(stats)
# Output: {'pending': 5, 'assigned': 2, 'completed': 10, 'failed': 0, 'total_agents': 3}
```

### Get Completed Tasks
```python
completed = coordinator.get_completed_tasks()
for task in completed:
    print(f"Task: {task.description}, Result: {task.result}")
```

### Get Failed Tasks
```python
failed = coordinator.get_failed_tasks()
for task in failed:
    print(f"Task: {task.description}, Error: {task.error}")
```

## Best Practices

1. **Always stop the coordinator when done**
   ```python
   coordinator.stop()
   ```

2. **Use appropriate task priorities**
   ```python
   TaskPriority.URGENT  # For critical tasks
   TaskPriority.HIGH    # For important tasks
   TaskPriority.MEDIUM  # For normal tasks
   TaskPriority.LOW     # For background tasks
   ```

3. **Handle errors in your agents**
   ```python
   def process_task(self, task):
       try:
           # Your logic
           return result
       except Exception as e:
           return {"error": str(e)}
   ```

4. **Choose the right agent type**
   - `WorkerAgent`: For data processing
   - `AnalyzerAgent`: For data analysis
   - `ComputerAgent`: For calculations
   - Custom: For specific needs

## Troubleshooting

### Tasks not completing
- Check if coordinator is started: `coordinator.start()`
- Verify agents are registered
- Check agent status
- Ensure tasks are being submitted

### Wrong agent types
- Make sure you're using the right agent for your task type
- Check error messages in failed tasks

### Performance issues
- Add more agents for parallel processing
- Use appropriate priorities
- Avoid long-running tasks in single agents

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Check [ARCHITECTURE.md](ARCHITECTURE.md) for system design
- Explore the examples in the `examples/` directory
- Create your own custom agents and tasks

## Support

This is an educational project. For questions or issues:
1. Check the documentation
2. Review the examples
3. Experiment with the code