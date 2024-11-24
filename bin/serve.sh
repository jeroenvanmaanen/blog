#!/bin/bash

set -e

BIN="$(cd "$(dirname "$0")" ; pwd)"
PROJECT="$(dirname "${BIN}")"

docker run --rm --detach -p 8080:80 --name blog -v "${PROJECT}/docs:/usr/share/nginx/html:ro" nginx
