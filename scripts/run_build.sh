#!/usr/bin/env bash

set -eu

printf "\nStarting build...\n\n"

ROOT_DIR=$(git rev-parse --show-toplevel)
pushd "${ROOT_DIR}"

# TODO: Add docker image build check here
npm run build
npm run lint
npm run test

popd

printf "\nBuild successful!\n"
