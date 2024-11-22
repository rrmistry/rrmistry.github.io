# Tag list: https://mcr.microsoft.com/v2/devcontainers/typescript-node/tags/list
FROM mcr.microsoft.com/devcontainers/typescript-node:20

# Specify the user to run as
ARG DEVBOX_USER=node

# Switch to non-root user
USER ${DEVBOX_USER}

# Install Nix in single-user mode
RUN curl -L https://nixos.org/nix/install | sh
# Source Nix profile for the shell
RUN . ~/.nix-profile/etc/profile.d/nix.sh

# Add nix to PATH variable
ENV HOME="/home/${DEVBOX_USER}"
ENV PATH="${HOME}/.nix-profile/bin:$PATH"

# Install devbox silently
ENV DEVBOX_USE_VERSION=$DEVBOX_USE_VERSION
RUN wget --quiet --output-document=/dev/stdout https://get.jetify.com/devbox | bash -s -- -f

# Add devbox completions to bashrc
RUN echo "source <(devbox completion bash)" >> ${HOME}/.bashrc

# Map workspace folder
ARG CONTAINER_WORKSPACE_FOLDER=/workspace
WORKDIR ${CONTAINER_WORKSPACE_FOLDER}

# Copy devbox.json to install dependencies
COPY devbox.json devbox.json
RUN devbox install

# Copy package.json to install dependencies
COPY package.json package.json
RUN devbox run npm-install
