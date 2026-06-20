#!/bin/bash

echo "=========================================="
echo "Long Running Task Simulation"
echo "=========================================="
echo "Started at: $(date)"
echo ""

echo "This script simulates a long-running task with progress updates."
echo "It will sleep for 20 seconds with progress indicators."
echo ""

total_steps=10
for i in $(seq 1 $total_steps); do
    echo "Progress: [$i/$total_steps] - $(date '+%H:%M:%S')"
    sleep 2
done

echo ""
echo "Task completed successfully!"
echo "Finished at: $(date)"
echo "Total duration: 20 seconds"
echo "=========================================="