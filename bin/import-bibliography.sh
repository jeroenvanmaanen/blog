#!/bin/bash

set -e

BIN="$(cd "$(dirname "$0")" ; pwd)"
PROJECT="$(dirname "${BIN}")"
WORK_AREA="$(dirname "${PROJECT}")"

source "${BIN}/lib-verbose.sh"

FIRST='true'

exec > "${PROJECT}/docs/bibliography.json"

echo '['
for ENTRY in "${WORK_AREA}/notes/Literatuur"/*
do
  if "${FIRST}"
  then
    FIRST='false'
  else
    echo ','
  fi
  KEY="$(basename "${ENTRY}" '.md')"
  log "${KEY}"
  tail +2 "${ENTRY}" | \
    sed -e '/^---/,$d' |
    yq.sh -o json '.lang = .language | del(.language)'" | .key = \"${KEY}\""
done
echo ']'
