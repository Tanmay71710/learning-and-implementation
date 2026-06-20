# Multi-Agent System

A simple, educational multi-agent system implementation in Python that demonstrates the core concepts of distributed task processing and agent coordination.

## Overview

This project implements a basic multi-agent system where:
- **Agents** are autonomous workers that process tasks
- **Tasks** are units of work that need to be completed
- **Coordinator** manages agents and distributes tasks among them

## Architecture

```
multiagent_same/
├── agents/
│   ├── __init__.py
│   ├── base_agent.py          # Base Agent class
│   └── specialized_agents.py  # Pre-built agent implementations
├── tasks/
│   ├── __init__.py
│   └── task.py               # Task classes and types
├── coordinator/
│   ├── __init__.py
│   └── coordinator.py        # Coordinator for agent management
├── examples/
│   ├── __init__.py
│   ├── basic_example.py      # Basic usage demonstration
│   └── custom_agent_example.py  # Custom agent implementation
└── README.md
```

## Core Components

### 1. Agent (Base Class)

The `Agent` class is the foundation for all agents in the system:

```python
from agents import Agent, AgentStatus

class CustomAgent(Agent):
    def process_task(self, task):
        # Implement your task processing logic
        result = do_something(task)
        return result
```

**Key Features:**
- Threading-based execution
- Status tracking (IDLE, BUSY, STOPPED)
- Task assignment and result collection
- Automatic lifecycle management

### 2. Task Classes

Tasks represent units of work to be processed:

```python
from tasks import Task, TaskPriority, ProcessingTask, AnalysisTask

# Create a basic task
task = Task(
    description="My task",
    data={"key": "value"},
    priority=TaskPriority.HIGH
)

# Or use specialized task types
processing_task = ProcessingTask(
    description="Process data",
    data={"input": [1, 2, 3]},
    priority=TaskPriority.MEDIUM
)
```

**Task Types:**
- `Task`: Generic task
- `ProcessingTask`: For data processing operations
- `AnalysisTask`: For data analysis operations
- `ComputationTask`: For computational operations

**Priority Levels:**
- `LOW`, `MEDIUM`, `HIGH`, `URGENT`

### 3. Coordinator

The coordinator manages agents and distributes tasks:

```python
from coordinator import Coordinator

# Create coordinator
coordinator = Coordinator()

# Register agents
coordinator.register_agent(my_agent)

# Submit tasks
coordinator.submit_task(task)

# Start processing
coordinator.start()

# Get statistics
stats = coordinator.get_task_statistics()

# Stop when done
coordinator.stop()
```

**Key Features:**
- Priority-based task queue
- Automatic task distribution to available agents
- Result collection and tracking
- Agent status monitoring

## Pre-built Agents

The system includes several ready-to-use agent types:

### WorkerAgent
Handles data processing tasks:
```python
from agents import WorkerAgent

worker = WorkerAgent("worker-1", "Worker 1")
```

### AnalyzerAgent
Handles data analysis tasks:
```python
from agents import AnalyzerAgent

analyzer = AnalyzerAgent("analyzer-1", "Analyzer 1")
```

### ComputerAgent
Handles computational tasks:
```python
from agents import ComputerAgent

computer = ComputerAgent("computer-1", "Computer 1")
```

## Usage Examples

### Basic Example

Run the basic demonstration:

```bash
cd multiagent_same
python examples/basic_example.py
```

This example shows:
- Creating multiple specialized agents
- Submitting various task types
- Monitoring task progress
- Collecting results

### Custom Agent Example

Run the custom agent demonstration:

```bash
python examples/custom_agent_example.py
```

This example demonstrates:
- Creating custom agent classes
- Implementing custom processing logic
- Building data processing pipelines

## Creating Custom Agents

To create your own agent, inherit from the `Agent` base class:

```python
from agents import Agent
from tasks import Task

class MyCustomAgent(Agent):
    def __init__(self, agent_id: str, name: str):
        super().__init__(agent_id, name)
        self.processed_count = 0
    
    def process_task(self, task: Task):
        # Your custom logic here
        result = {
            "processed": True,
            "data": task.data
        }
        self.processed_count += 1
        return result
```

Then register and use it:

```python
from coordinator import Coordinator

coordinator = Coordinator()
my_agent = MyCustomAgent("custom-1", "Custom Agent")
coordinator.register_agent(my_agent)
coordinator.start()
```

## Key Concepts

### Task Distribution

The coordinator uses a priority queue to distribute tasks:
1. Tasks are submitted with priority levels
2. Higher priority tasks are processed first
3. Tasks are assigned to the first available agent
4. If no agents are available, tasks wait in the queue

### Agent Lifecycle

1. **Creation**: Agent is instantiated
2. **Registration**: Agent is registered with coordinator
3. **Idle**: Agent waits for tasks
4. **Busy**: Agent processes assigned task
5. **Result**: Agent returns result to coordinator
6. **Idle**: Agent returns to idle state

### Thread Safety

The system uses threading locks to ensure:
- Safe task queue access
- Thread-safe agent state management
- Proper result collection

## Running the Examples

### Prerequisites

- Python 3.7 or higher
- No external dependencies required (uses only standard library)

### Basic Example

```bash
cd multiagent_same
python examples/basic_example.py
```

Expected output:
```
Multi-Agent System Demo
============================================================

✓ Coordinator created

Creating agents...
✓ Registered 4 agents:
  - Agent(id=worker-1, name=Worker 1, status=idle)
  - Agent(id=worker-2, name=Worker 2, status=idle)
  - Agent(id=analyzer-1, name=Analyzer 1, status=idle)
  - Agent(id=computer-1, name=Computer 1, status=idle)

✓ Coordinator started

Submitting tasks...
  Submitted: Task(id=abc123..., type=processing, status=pending, priority=HIGH)
  ...
```

### Custom Agent Example

```bash
python examples/custom_agent_example.py
```

## Extending the System

### Adding New Task Types

```python
from tasks import Task

@dataclass
class MyCustomTask(Task):
    def __post_init__(self):
        self.task_type = "custom"
```

### Adding New Priority Levels

```python
from tasks import TaskPriority
# Add new enum value if needed
```

### Custom Task Distribution Logic

Extend the `Coordinator` class to implement custom distribution strategies:

```python
class CustomCoordinator(Coordinator):
    def _distribute_tasks(self):
        # Your custom distribution logic
        pass
```

## Best Practices

1. **Agent Design**: Keep agents focused on single responsibility
2. **Task Granularity**: Make tasks appropriately sized for parallel processing
3. **Error Handling**: Implement proper error handling in `process_task` methods
4. **Resource Management**: Stop coordinators and agents when done
5. **Priority Usage**: Use task priorities to ensure important tasks are processed first

## Limitations

This is a simplified educational implementation. For production use, consider:
- Adding persistence for tasks and results
- Implementing more sophisticated scheduling algorithms
- Adding support for distributed execution across machines
- Implementing proper logging and monitoring
- Adding authentication and authorization
- Handling network communication for distributed agents

## License

This is an educational project. Feel free to use and modify as needed.

## Contributing

This is a sample project for learning purposes. Suggestions for improvements are welcome!