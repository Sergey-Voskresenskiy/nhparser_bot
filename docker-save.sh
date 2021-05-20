#!/bin/sh
docker save nhparser-bot | zstd - -o "nhparser-$(git rev-parse --short HEAD)-docker.tar.zst"

