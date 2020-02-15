#!/bin/sh

# Invoke script for extra initializations to the generic MongoDB docker image entrypoint
exec /usr/local/bin/init.sh &

# Run DockerHub's "official image" entrypoint now
exec /usr/local/bin/docker-entrypoint.sh "$@"
