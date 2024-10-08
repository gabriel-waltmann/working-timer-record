#!/bin/bash

# Make a GET request and capture the response STATUS
response=$(curl -s -o /dev/null -w "%{http_code}" https://working-timer-record.onrender.com)

# Check if the response status is 200
if [ "$response" -ne 200 ]; then
  echo "GET request failed with status $response. Aborting project status."
  exit 1
fi

echo "GET request successful. Project is running."