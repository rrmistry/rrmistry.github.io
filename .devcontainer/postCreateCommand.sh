#!/bin/bash

# Stop on errors
set -e

# Print commands
set -x

# Install Jekyll
gem install bundler jekyll

# Check Ruby version
ruby -v
