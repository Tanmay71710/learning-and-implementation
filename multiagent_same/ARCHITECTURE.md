# Multi-Agent System Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Coordinator                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Priority Task Queue                     │  │
│  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐     │  │
│  │  │ URG  │ │ HIGH │ │ MED  │ │ LOW  │ │ ...  │     │  │
│  │  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘     │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                 │
│              Task Distribution Logic                       │
│                          ↓                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   Agent 1    │  │   Agent 2    │  │   Agent 3    │    │
│  │  (Worker)    │  │  (Analyzer)  │  │  (Computer)  │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

## Component Interaction

### 1. Task Submission Flow

```
User/Code
    ↓
create Task()
    ↓
coordinator.submit_task(task)
    ↓
Task added to priority queue
    ↓
Coordinator distributes to available agent
    ↓
Agent.process_task(task)
    ↓
Agent returns result
    ↓
Coordinator collects result
    ↓
Task marked as completed
```

### 2. Agent Lifecycle

```
Instantiation
    ↓
Registration with Coordinator
    ↓
IDLE state (waiting for tasks)
    ↓
Task assigned → BUSY state
    ↓
Processing task
    ↓
Result returned
    ↓
IDLE state (ready for next task)
    ↓
Stop called → STOPPED state
```

### 3. Task States

```
PENDING (in queue)
    ↓
ASSIGNED (given to agent)
    ↓
COMPLETED (success) or FAILED (error)
```

## Key Design Patterns

### 1. **Abstract Base Pattern**
- `Agent` is an abstract base class
- Specialized agents inherit and implement `process_task()`
- Enforces consistent interface across agent types

### 2. **Producer-Consumer Pattern**
- Coordinator produces tasks (distributes)
- Agents consume tasks (process)
- Results flow back to coordinator

### 3. **Thread Pool Pattern**
- Each agent runs in its own thread
- Coordinator manages thread lifecycle
- Enables parallel task processing

### 4. **Priority Queue Pattern**
- Tasks ordered by priority
- Higher priority tasks processed first
- Ensures important tasks get attention

## Thread Safety

The system uses threading locks (`threading.Lock`) to ensure:

1. **Safe Task Queue Access**: Only one thread modifies the queue at a time
2. **Atomic State Changes**: Agent status changes are atomic
3. **Consistent Statistics**: Statistics are read/written safely
4. **Result Collection**: Results are collected without race conditions

## Extension Points

### Custom Agents
```python
class MyAgent(Agent):
    def process_task(self, task):
        # Custom logic
        return result
```

### Custom Tasks
```python
class MyTask(Task):
    def __post_init__(self):
        self.task_type = "custom"
```

### Custom Distribution
```python
class MyCoordinator(Coordinator):
    def _distribute_tasks(self):
        # Custom distribution logic
        pass
```

## Data Flow Example

```
Task: ProcessingTask(data=[1,2,3])
    ↓
Coordinator assigns to WorkerAgent
    ↓
WorkerAgent.process_task()
    ↓
Result: {"processed": True, "output": [1,2,3]}
    ↓
Coordinator collects result
    ↓
Task.status = COMPLETED
    ↓
User can retrieve result
```

## Performance Considerations

1. **Parallel Processing**: Multiple agents work simultaneously
2. **Load Balancing**: Tasks distributed to available agents
3. **Priority Handling**: Important tasks processed first
4. **Thread Overhead**: Each agent has its own thread
5. **Lock Contention**: Minimized by keeping critical sections short

## Use Cases

### Data Processing Pipeline
- Filter agents clean data
- Transform agents modify data
- Analyzer agents extract insights

### Computational Tasks
- Computer agents handle calculations
- Parallel processing of independent computations
- Result aggregation

### Workflow Automation
- Different agents handle different workflow stages
- Task dependencies managed through priority
- Error handling and retry logic