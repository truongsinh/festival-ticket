#! /bin/bash

# move pid if exists
if [ -f pid ]
then
  mv pid pid.old
fi

# throw error if port invalid
if [ ! $1 -gt 1023 ]
then
  echo 'Port must be greater than 1023' >&2
  exit 1
fi
echo 'continue'
export NODE_APP_PORT=$1
export NODE_ENV=production
nohup node backend/index.js > log.out 2> log.err < /dev/null & echo $! > pid
