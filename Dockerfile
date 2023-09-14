FROM ubuntu:20.04

ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update && \
    apt-get install -y \
    xorg \
    x11-apps \
    curl \
    wget \
    build-essential && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

SHELL ["/bin/bash", "-c"]

ENV NODE_VERSION 16.20.1
ENV NVM_DIR /root/.nvm

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash

RUN source ${NVM_DIR}/nvm.sh && \
    nvm install ${NODE_VERSION} && \
    nvm alias default ${NODE_VERSION} && \
    nvm use default

ENV NODE_PATH   ${NVM_DIR}/v${NODE_VERSION}/lib/node_modules
ENV PATH        ${NVM_DIR}/versions/node/v${NODE_VERSION}/bin:${PATH}

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "app.js"]
# CMD [ "xeyes" ]