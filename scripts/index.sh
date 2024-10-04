#!/bin/bash

SCRIPT_DIR=$(dirname "$0")

WORKSPACE_NAME=reune

WORKSPACE_NAME=$1
ACTION=$2

if [ -z "$WORKSPACE_NAME" ] || [ -z "$ACTION" ]; then
    echo "Usage: workspaces-cli workspace-name {start|stop}"
    exit 1
fi

case "$WORKSPACE_NAME" in
    "$WORKSPACE_NAME")
        case "$ACTION" in
            start)
                "$SCRIPT_DIR/start.sh"
                ;;
            stop)
                "$SCRIPT_DIR/stop.sh"
                ;;
            status)
                "$SCRIPT_DIR/status.sh"
                ;;
            *)
                echo "Usage: workspaces-cli reune {start|stop}"
                exit 1
                ;;
        esac
        ;;
    *)
        echo "Usage: workspaces-cli reune {start|stop}"
        exit 1
        ;;
esac
