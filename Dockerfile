# Use the official Ubuntu 20.04 image as the base image
FROM ubuntu:20.04

# Install essential packages and utilities
RUN apt-get update && \
    apt-get install -y \
    xorg \
    x11-apps \
    curl \
    wget \
    build-essential && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Install nvm (Node Version Manager)
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash

# Load nvm into the shell session
SHELL ["/bin/bash", "--login", "-c"]

# Install Node.js 16 using nvm
RUN nvm install 16

# Set the default Node.js version (optional)
RUN nvm alias default 16

# Verify Node.js and npm installation
RUN node -v
RUN npm -v

# Set the working directory for your application (replace with your app directory)
WORKDIR /app

# Copy package.json and package-lock.json (if available) to the container
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of your application code to the container
COPY . .

# Expose X11 socket
ENV DISPLAY=:0

# Set the working directory in the container
WORKDIR /app

# Expose the port your app is running on (if applicable)
EXPOSE 3000

# Define the command to start your Node.js application
# CMD ["node", "app.js"]

# Run a sample X11 application (xeyes)
CMD [ "xeyes" ]