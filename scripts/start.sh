#!/bin/bash

source .env

URL="$SCRIPT_BASE_URL/workspace-timer"
WORKSPACE_ID="$SCRIPT_WORKSPACE_ID"

BODY='{ "workspace_id": "'$WORKSPACE_ID'", "time_zone": "America/Sao_Paulo", "start_time": "auto" }'

echo "URL: $URL"
echo "BODY: $BODY"
echo "WORKSPACE_ID: $WORKSPACE_ID"

response=$(curl -s -X POST $URL -d "$BODY" -H "Content-Type: application/json")

workspaceTimerId=$(echo $response | jq -r '.timer.id')

if [ -z "$workspaceTimerId" ] || [ -n "$workspaceTimerId" ] && [ "$workspaceTimerId" = "null" ]; then
    echo "Failed to retrieve workspaceTimerId."
    exit 1
fi

echo $workspaceTimerId > ~/.workspace_timer_id

echo "POST request successful (workspaceTimerId: $workspaceTimerId)"