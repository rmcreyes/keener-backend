#!/usr/bin/env bash

set -eu

printf "\nCollecting code coverage...\n\n"

ROOT_DIR=$(git rev-parse --show-toplevel)
pushd "${ROOT_DIR}"

npm run coverage

printf "\nUploading coverage results to codecov.io...\n\n"

codecov

popd

printf "\nSuccessfully uploaded coverage successful!\n"
