#!/bin/bash

echo "=========================================="
echo "Parameter Processing Script"
echo "=========================================="
echo "This script demonstrates parameter handling"
echo ""
echo "Script started at: $(date)"
echo "Arguments received: $@"
echo "Number of arguments: $#"
echo ""

if [ $# -eq 0 ]; then
    echo "No arguments provided. Usage: ./parameters.sh arg1 arg2 ..."
else
    echo "Processing arguments:"
    for arg in "$@"; do
        echo "  - $arg"
    done
fi

echo ""
echo "Environment variables:"
env | sort

echo ""
echo "=========================================="
echo "Script completed at: $(date)"