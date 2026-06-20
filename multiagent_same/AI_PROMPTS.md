# AI Prompt for Multi-Agent System Creation

## Primary Prompt

```
Create a comprehensive multi-agent system in Python that demonstrates distributed task processing, agent coordination, and parallel execution. The system should be educational, well-documented, and easy to extend.

## Core Requirements

### 1. Agent System
- Create an abstract base Agent class that supports:
  - Threading-based execution
  - Status tracking (IDLE, BUSY, STOPPED)
  - Task assignment and result collection
  - Automatic lifecycle management
  
- Implement specialized agent types:
  - WorkerAgent: For data processing tasks
  - AnalyzerAgent: For data analysis tasks  
  - ComputerAgent: For computational tasks

### 2. Task System
- Create a base Task class with:
  - Unique task IDs
  - Task types and descriptions
  - Priority levels (LOW, MEDIUM, HIGH, URGENT)
  - Status tracking (PENDING, ASSIGNED, COMPLETED, FAILED)
  - Data payload support
  - Result and error tracking

- Implement specialized task types:
  - ProcessingTask: For data processing operations
  - AnalysisTask: For data analysis operations
  - ComputationTask: For computational operations

### 3. Coordinator System
- Create a Coordinator class that manages:
  - Agent registration and lifecycle
  - Priority-based task queue
  - Automatic task distribution to available agents
  - Result collection and task completion tracking
  - Thread-safe operations using locks
  - Statistics and monitoring capabilities

### 4. Project Structure
Organize the project with proper package structure:
```
multiagent_system/
├── agents/           # Agent implementations
├── tasks/            # Task definitions
├── coordinator/      # Coordination logic
├── examples/         # Usage examples
└── documentation/    # README and guides
```

### 5. Documentation
- Create comprehensive README with architecture overview
- Write quick start guide for immediate usage
- Include architecture documentation with diagrams
- Add inline code comments and docstrings

### 6. Examples
- Basic example showing:
  - Creating multiple agents
  - Submitting various task types
  - Monitoring progress
  - Collecting results
  
- Custom agent example showing:
  - Creating custom agent classes
  - Implementing custom processing logic
  - Building data processing pipelines

### 7. Technical Requirements
- Use Python standard library only (no external dependencies)
- Implement proper thread safety with locks
- Use type hints throughout
- Follow Python best practices and PEP 8
- Make the system extensible and easy to customize

### 8. Key Features
- Parallel task processing across multiple agents
- Priority-based task queue
- Automatic load balancing
- Comprehensive error handling
- Real-time progress monitoring
- Result aggregation and reporting

## Expected Deliverables

1. Complete working implementation
2. Two runnable examples demonstrating usage
3. Comprehensive documentation
4. Clean, well-commented code
5. Extension points for custom agents and tasks
6. Quick start guide for immediate use

## Quality Standards

- Code should be production-quality (though educational)
- All examples should run without errors
- Documentation should be clear and comprehensive
- Architecture should be logical and extensible
- Thread safety should be properly implemented
- Error handling should be robust
```

## Alternative Prompts for Specific Use Cases

### Prompt for Quick Version
```
Create a simple multi-agent system in Python with:
1. A base Agent class with threading support
2. A Coordinator for task distribution
3. Example agents and tasks
4. Basic documentation
Focus on core functionality and keep it minimal but working.
```

### Prompt for Advanced Version
```
Create an advanced multi-agent system with:
1. Multiple agent types with specialized capabilities
2. Sophisticated task scheduling algorithms
3. Agent communication and messaging
4. Distributed execution support
5. Persistence and state management
6. Comprehensive monitoring and logging
7. Performance optimization
8. Production-ready error handling
```

### Prompt for Educational Focus
```
Create an educational multi-agent system that teaches:
1. Concurrent programming concepts
2. Design patterns (abstract factory, strategy, observer)
3. Thread safety and synchronization
4. Distributed systems fundamentals
5. Software architecture principles
Include extensive comments, documentation, and learning resources.
```

### Prompt for Specific Domain
```
Create a multi-agent system for [SPECIFIC DOMAIN] with:
1. Domain-specific agent types
2. Custom task types for domain operations
3. Specialized coordination logic
4. Domain-appropriate examples
5. Relevant documentation and use cases
```

## Prompt Variations for Different AI Models

### For GPT-4/Claude
```
You are an expert software architect. Design and implement a multi-agent system in Python that demonstrates best practices in concurrent programming, software architecture, and system design. The system should be educational yet production-quality, with comprehensive documentation and examples. Focus on clean code, extensibility, and proper error handling.
```

### For Code-Specific Models
```
Write Python code for a multi-agent system with:
- Base Agent class (abstract, threading support)
- Task classes with priority system
- Coordinator for task distribution
- 3 specialized agent types
- 2 working examples
- Thread-safe implementation
- Type hints and docstrings
```

### For Tutorial Generation
```
Create a tutorial-style multi-agent system implementation. Each component should be explained clearly, with comments that teach the concepts. Include step-by-step examples and explain the design decisions. The code should be simple enough to understand but sophisticated enough to demonstrate real multi-agent patterns.
```

## Testing and Validation Prompts

### Prompt for Testing
```
After creating the multi-agent system, provide:
1. Unit tests for core components
2. Integration tests for the full system
3. Performance benchmarks
4. Edge case handling tests
5. Thread safety validation tests
```

### Prompt for Validation
```
Validate the multi-agent system by:
1. Running both examples successfully
2. Demonstrating parallel task execution
3. Showing proper error handling
4. Verifying thread safety
5. Testing with high task loads
6. Validating priority queue behavior
```

## Extension Prompts

### Prompt for Adding Features
```
Extend the multi-agent system with:
1. Agent communication and messaging
2. Task dependencies and workflows
3. Persistent task storage
4. Web API interface
5. Real-time monitoring dashboard
6. Agent pooling and scaling
7. Retry logic for failed tasks
8. Task timeout handling
```

### Prompt for Different Implementations
```
Recreate the multi-agent system using:
1. Asyncio instead of threading
2. Multiprocessing for CPU-bound tasks
3. Message queues (RabbitMQ/Redis)
4. gRPC for distributed agents
5. Kubernetes for orchestration
```

## Usage Tips

### When to Use These Prompts
- Learning multi-agent concepts
- Building distributed systems
- Understanding concurrent programming
- Creating task processing pipelines
- Implementing parallel processing

### Customization Guidelines
- Adjust complexity based on your needs
- Specify preferred Python version
- Indicate any specific dependencies
- Mention target use cases
- Specify performance requirements

### Expected Outcomes
- Working multi-agent system
- Understanding of core concepts
- Foundation for extension
- Best practices reference
- Educational resource

## Prompt Engineering Best Practices

1. **Be Specific**: Clearly define requirements and constraints
2. **Provide Context**: Explain the purpose and target audience
3. **Set Quality Standards**: Specify code quality and documentation levels
4. **Include Examples**: Mention desired functionality and use cases
5. **Allow Flexibility**: Leave room for AI to suggest improvements
6. **Request Validation**: Ask for testing and verification
7. **Specify Deliverables**: List exactly what should be produced

## Common Modifications

### For Different Languages
Replace "Python" with your preferred language:
- "Create a multi-agent system in Java..."
- "Implement a multi-agent system in Go..."
- "Build a multi-agent system in JavaScript..."

### For Specific Frameworks
Add framework requirements:
- "Use FastAPI for web interface..."
- "Implement with Django integration..."
- "Use Celery for task queue..."

### For Performance Focus
Add performance requirements:
- "Optimize for high throughput..."
- "Minimize latency in task processing..."
- "Support thousands of concurrent tasks..."