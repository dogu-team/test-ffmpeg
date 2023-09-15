FROM ubuntu:20.04

ARG DEBIAN_FRONTEND=noninteractive

RUN apt update
RUN apt install -y \
    # xorg \
    # x11-apps \
    curl \
    # wget \
    # build-essential \
    ffmpeg \
    # ubuntu-desktop \
    # lightdm \ 
    xvfb
RUN apt install -y firefox
RUN apt install -y unzip
RUN apt install -y libnss3-dev
RUN apt install -y libgbm-dev

RUN curl -o chrome-linux64.zip https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/116.0.5791.0/linux64/chrome-linux64.zip
RUN unzip chrome-linux64.zip
RUN mv chrome-linux64 chrome

# RUN rm /run/reboot-required*
# RUN echo "/usr/sbin/lightdm" > /etc/X11/default-display-manager
# RUN echo "\
# [LightDM]\n\
# [Seat:*]\n\
# type=xremote\n\
# xserver-hostname=host.docker.internal\n\
# xserver-display-number=0\n\
# autologin-user=root\n\
# autologin-user-timeout=0\n\
# " > /etc/lightdm/lightdm.conf.d/lightdm.conf

# ENV DISPLAY=host.docker.internal:0.0

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

ENTRYPOINT [ "/app/entrypoint.sh" ]
