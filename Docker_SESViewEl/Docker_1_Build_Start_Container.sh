#!/bin/sh
xhost local:root
#run a container from the image -> the program is in the /app folder where it is started from
docker run --name=sesviewelcontainer -it -v /tmp/.X11-unix:/tmp/.X11-unix -e DISPLAY=$DISPLAY -p 54545:54545 hf/sesviewel npm start
