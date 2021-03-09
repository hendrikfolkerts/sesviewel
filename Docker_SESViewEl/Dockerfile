FROM node:10

MAINTAINER hendrikfolkerts <hendrikmartinfolkerts@gmail.com>

#packets for electron
RUN apt-get update && apt-get install git libx11-xcb1 libxcb-dri3-0 libxtst6 libnss3 libatk-bridge2.0-0 libgtk-3-0 libxss1 libasound2 -yq --no-install-suggests --no-install-recommends && apt-get clean && rm -rf /var/lib/apt/lists

#copy the program in this folder in the /app folder
COPY . /app

#set working directory
WORKDIR /app

#install dependencies
RUN npm install
RUN npm install electron --save-dev --save-exact
