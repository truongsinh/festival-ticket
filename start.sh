#! /bin/bash
export NODE_APP_PORT=$1 \
  && export NODE_ENV=production \
  && nohup node backend/index.js > log.out 2> log.err < /dev/null &
