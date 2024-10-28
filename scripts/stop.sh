#!/bin/bash

source .env

WORKSPACE_TIMER_ID=$(cat ~/.workspace_timer_id)

if [ -z "$WORKSPACE_TIMER_ID" ]; then
    echo "workspaceTimerId not found. Aborting project stop."
    exit 1
fi

URL="$SCRIPT_BASE_URL/workspace-timer/$WORKSPACE_TIMER_ID"
WORKSPACE_ID="$SCRIPT_WORKSPACE_ID"

BODY='{ "workspace_id": "'$WORKSPACE_ID'", "time_zone": "America/Sao_Paulo", "end_time": "auto" }'

echo "URL: $URL"
echo "BODY: $BODY"
echo "WORKSPACE_ID: $WORKSPACE_ID"
echo "WORKSPACE_TIMER_ID: $WORKSPACE_TIMER_ID"

response=$(curl -s -o /dev/null -w "%{http_code}" -X PUT $URL -d "$BODY" -H "Content-Type: application/json")
echo $response

if [ "$response" -ne 200 ]; then
    echo "POST request failed with status $response. Aborting project stop."
    exit 1
fi

echo "POST request successful!!"
