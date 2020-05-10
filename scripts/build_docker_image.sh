#!/usr/bin/env bash

# Delete any stale images and build a new one
docker image rm keener-img
docker build -t keener-img .
