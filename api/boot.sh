#!/bin/sh

source venv/bin/activate

source wait-for.sh $ELASTICSEARCH_URL

exec gunicorn -b :5000 --timeout 90 --access-logfile - --error-logfile - server:app
