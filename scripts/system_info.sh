#!/bin/bash

echo "=========================================="
echo "Hello from Script Execution Manager!"
echo "=========================================="
echo "Current date and time: $(date)"
echo "Current user: $(whoami)"
echo "Current directory: $(pwd)"
echo "System information:"
uname -a
echo "=========================================="
echo "Disk usage:"
df -h
echo "=========================================="
echo "Memory usage:"
free -h
echo "=========================================="
echo "Script completed successfully!"