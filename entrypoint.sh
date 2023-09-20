#!/bin/sh

# service dbus start
# /usr/lib/systemd/systemd-logind &
# node app.js &
# service lightdm start
# -f x11grab -s 1024x768 -i :1 -t 10 output.mp4

export DISPLAY=:1
Xvfb $DISPLAY -screen 0 1920x1080x24 &

firefox &
/chrome/chrome --disable-gpu --no-sandbox &

ffmpeg -y -f x11grab -s 1920x1080 -i $DISPLAY -vcodec libx264 -preset ultrafast -t 15 output.mp4
node app.js
