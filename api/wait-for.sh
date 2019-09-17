#!/bin/bash

# Source: https://github.com/elastic/elasticsearch-py/issues/778

set -e

host="$1"
shift
cmd="$@"


until $(curl --output /dev/null --silent --head --fail "$host"); do
    printf '.'
    sleep 1
done

# First wait for ES to start...
response=$(curl $host)

until [ "$response" = "200" ]; do
    response=$(curl --write-out %{http_code} --silent --output /dev/null "$host")
    >&2 echo "Elastic Search is unavailable - sleeping"
    sleep 1
done


# next wait for ES status to turn to yellow or green (for development with single-node case, generally yellow. In production, wait only for green status)
health="$(curl -fsSL "$host/_cat/health?h=status")"
health="$(echo "$health" | sed -r 's/^[[:space:]]+|[[:space:]]+$//g')" # trim whitespace (otherwise we'll have "green ")

until [ "$health" = 'yellow' ] || [ "$health" = 'green' ]; do
    health="$(curl -fsSL "$host/_cat/health?h=status")"
    health="$(echo "$health" | sed -r 's/^[[:space:]]+|[[:space:]]+$//g')" # trim whitespace (otherwise we'll have "green ")
    >&2 echo "Elastic Search is unavailable - sleeping"
    sleep 1
done

>&2 echo "Elastic Search is up"
exec $cmd