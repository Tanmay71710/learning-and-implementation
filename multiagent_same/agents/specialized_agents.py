"""Specialized agent implementations."""

import time
import random
from typing import Any
from agents.base_agent import Agent
from tasks.task import Task, ProcessingTask, AnalysisTask, ComputationTask


class WorkerAgent(Agent):
    """Agent specialized for processing tasks."""
    
    def __init__(self, agent_id: str, name: str):
        super().__init__(agent_id, name)
        self.processed_count = 0
    
    def process_task(self, task: Task) -> Any:
        """Process a processing task."""
        if isinstance(task, ProcessingTask):
            # Simulate processing work
            data = task.data.get("input", [])
            
            # Simulate variable processing time
            processing_time = random.uniform(0.1, 0.5)
            time.sleep(processing_time)
            
            # Process the data (simple transformation)
            result = {
                "processed": True,
                "input_count": len(data) if isinstance(data, list) else 1,
                "output": [item.upper() if isinstance(item, str) else item for item in (data if isinstance(data, list) else [data])],
                "processing_time": processing_time
            }
            
            self.processed_count += 1
            return result
        
        return {"error": "WorkerAgent only handles ProcessingTask"}


class AnalyzerAgent(Agent):
    """Agent specialized for analysis tasks."""
    
    def __init__(self, agent_id: str, name: str):
        super().__init__(agent_id, name)
        self.analysis_count = 0
    
    def process_task(self, task: Task) -> Any:
        """Process an analysis task."""
        if isinstance(task, AnalysisTask):
            # Simulate analysis work
            data = task.data.get("data", {})
            
            # Simulate variable analysis time
            analysis_time = random.uniform(0.2, 0.8)
            time.sleep(analysis_time)
            
            # Perform simple analysis
            if isinstance(data, (list, tuple)):
                result = {
                    "analyzed": True,
                    "count": len(data),
                    "sum": sum(data) if all(isinstance(x, (int, float)) for x in data) else None,
                    "average": sum(data) / len(data) if data and all(isinstance(x, (int, float)) for x in data) else None,
                    "analysis_time": analysis_time
                }
            else:
                result = {
                    "analyzed": True,
                    "type": type(data).__name__,
                    "analysis_time": analysis_time
                }
            
            self.analysis_count += 1
            return result
        
        return {"error": "AnalyzerAgent only handles AnalysisTask"}


class ComputerAgent(Agent):
    """Agent specialized for computation tasks."""
    
    def __init__(self, agent_id: str, name: str):
        super().__init__(agent_id, name)
        self.computation_count = 0
    
    def process_task(self, task: Task) -> Any:
        """Process a computation task."""
        if isinstance(task, ComputationTask):
            # Simulate computation work
            operation = task.data.get("operation", "add")
            operands = task.data.get("operands", [])
            
            # Simulate variable computation time
            computation_time = random.uniform(0.05, 0.3)
            time.sleep(computation_time)
            
            # Perform computation
            result = {
                "computed": True,
                "operation": operation,
                "computation_time": computation_time
            }
            
            try:
                if operation == "add" and len(operands) >= 2:
                    result["result"] = sum(operands)
                elif operation == "multiply" and len(operands) >= 2:
                    product = 1
                    for num in operands:
                        product *= num
                    result["result"] = product
                elif operation == "factorial" and len(operands) == 1:
                    n = operands[0]
                    if isinstance(n, int) and n >= 0:
                        result["result"] = self._factorial(n)
                    else:
                        result["error"] = "Factorial requires non-negative integer"
                else:
                    result["error"] = f"Unsupported operation or invalid operands: {operation}"
                
                self.computation_count += 1
            except Exception as e:
                result["error"] = str(e)
            
            return result
        
        return {"error": "ComputerAgent only handles ComputationTask"}
    
    def _factorial(self, n: int) -> int:
        """Compute factorial of n."""
        if n <= 1:
            return 1
        return n * self._factorial(n - 1)