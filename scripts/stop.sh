#!/bin/bash

# Read the workspaceTimerId from the file
workspaceTimerId=$(cat ~/.workspace_timer_id)

# Check if workspaceTimerId is not empty
if [ -z "$workspaceTimerId" ]; then
    echo "workspaceTimerId not found. Aborting project stop."
    exit 1
fi

echo "workspaceTimerId: $workspaceTimerId"

# Make a POST request and capture the HTTP response status
response=$(curl -s -o /dev/null -w "%{http_code}" -X POST https://working-timer-record.onrender.com/workspace-timer/end -d "{\"workspaceTimerId\": \"$workspaceTimerId\"}" -H "Content-Type: application/json")
echo $response

# Check if the response status is 204
if [ "$response" -ne 204 ]; then
    echo "POST request failed with status $response. Aborting project stop."
    exit 1
fi

echo "POST request successful. Stopping project..."

# Stop Redis and MariaDB Docker containers
docker stop reune-redis reune-db

# Kill all instances of yarn processes (adjust command if needed)
pkill -f "yarn dev:tsc"
pkill -f "yarn dev:serve"
pkill -f "yarn dev"