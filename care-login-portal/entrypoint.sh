#!/bin/bash

# Define the base image name
base_image="swedcon18com/carelyo"

# Delete older versions of images
docker images --format "{{.Repository}}:{{.Tag}}" | while read image; do
  if [[ $image =~ ^$base_image ]]; then
    tag_latest=$(docker images "$image:latest" --format "{{.ID}}")
    tag_previous=$(docker images "$image:latest" --format "{{.ID}}" | xargs -n 1 docker history --format "{{.ID}}" | sed -n 2p)

    # Delete all versions except the latest and the immediately older version
    docker images --format "{{.ID}}" | grep -v "$tag_latest\|$tag_previous" | xargs -I {} docker rmi {}
  fi
done