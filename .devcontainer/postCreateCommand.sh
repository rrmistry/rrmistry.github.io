#!/bin/bash

# Stop on errors
set -e

# Print commands
set -x

# Install DevBox packages
devbox install

# Run setup script
devbox run npm-install
