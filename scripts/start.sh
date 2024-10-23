#!/bin/bash

WORKSPACE_ID=1727368941748

# Make a POST request and capture the response (assuming the response contains JSON with a field "workspaceTimerId")
response=$(curl -s -X POST https://working-timer-record.onrender.com/workspace-timer/start -d '{"workspaceId": "'$WORKSPACE_ID'"}' -H "Content-Type: application/json")

# Extract the workspaceTimerId from the response using jq (make sure jq is installed)
workspaceTimerId=$(echo $response | jq -r '.timer.id')

# Check if workspaceTimerId is not empty
if [ -z "$workspaceTimerId" ]; then
    echo "Failed to retrieve workspaceTimerId."
    exit 1
fi

# Store the workspaceTimerId in a file for later use
echo $workspaceTimerId > ~/.workspace_timer_id

echo "POST request successful. Received workspaceTimerId: $workspaceTimerId. Starting project..."