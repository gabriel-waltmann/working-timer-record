#!/bin/bash

WORKSPACE_ID=1727139984980

# Make a POST request and capture the response (assuming the response contains JSON with a field "workspaceTimerId")
response=$(curl -s -X POST http://localhost:3000/workspace-timer/start -d '{"workspaceId": "'$WORKSPACE_ID'"}' -H "Content-Type: application/json")

# Extract the workspaceTimerId from the response using jq (make sure jq is installed)
workspaceTimerId=$(echo $response | jq -r '.timer.id')

# Check if workspaceTimerId is not empty
if [ -z "$workspaceTimerId" ]; then
    echo "Failed to retrieve workspaceTimerId. Aborting project start."
    exit 1
fi

# Store the workspaceTimerId in a file for later use
echo $workspaceTimerId > ~/.workspace_timer_id

echo "POST request successful. Received workspaceTimerId: $workspaceTimerId. Starting project..."

# Start Redis and MariaDB Docker containers
docker start reune-redis reune-db

# Start backend services in separate terminal tabs
gnome-terminal --tab -- bash -c "cd ~/Documents/reune/backend && yarn dev:tsc"
gnome-terminal --tab -- bash -c "cd ~/Documents/reune/backend && yarn dev:serve"

# Start frontend service in a separate terminal tab
gnome-terminal --tab -- bash -c "cd ~/Documents/reune/frontend && yarn dev"
