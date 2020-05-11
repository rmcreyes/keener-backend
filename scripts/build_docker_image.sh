#!/usr/bin/env bash

set -uo pipefail

ROOT_DIR=$(git rev-parse --show-toplevel)
pushd "${ROOT_DIR}"

DEV_IMG_NAME="keener-dev-img"

# Delete any stale images
printf "\nChecking for any stale dev images...\n\n"
docker images | grep ${DEV_IMG_NAME}
STALE_IMAGE_PRESENT=$?
if [ $STALE_IMAGE_PRESENT -eq 0 ]; then
    printf "\nStale dev image exists. Deleting stale image...\n\n"
    docker image rm ${DEV_IMG_NAME}
    STALE_IMAGE_REMOVED=$?

    if [ $STALE_IMAGE_REMOVED -ne 0 ]; then
        printf "\nFailed to delete stale dev image.\n"
        exit 1
    else
        printf "\nSuccessfully deleted stale dev image.\n"
    fi
fi

printf "\nBuilding dev image...\n\n"
docker build -t ${DEV_IMG_NAME} .

popd

printf "\nDev image build successful!\n"
