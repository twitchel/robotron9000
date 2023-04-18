#!/usr/bin/env bash

set -ex

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
BASE_DIR="${SCRIPT_DIR}/../.."

cp ${BASE_DIR}/.env.dist ${BASE_DIR}/.env
docker-compose build
