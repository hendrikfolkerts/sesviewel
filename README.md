INTRODUCTION

The software SESViewEl - System Entity Structure View Electron has been developed by the research group Computational
Engineering and Automation (CEA) at Wismar University of Applied Sciences.
The app SESViewEl starts a socket server on port 54545. The socket server's IP-address can be retrieved with the shell
command 'ipconfig' in Windows or 'ifconfig' in Linux.
When a System Entity Structure (SES) coded as XML is sent to the server (e.g. from SESToPy), the SES is presented as tree.
The presented tree can be saved in the *.svg vector graphics format.
Saved figures in the *.svg format can be manipulated e.g. with the GravitDesigner vector graphics program.
See the documentation of SESToPy for details on the description of the SES in the XML format.
SESViewEl is developed with Node.js 10.15.3 and electron as UI.
Visual Studio Code 1.38.0 is used as development editor.
All dependencies and their versions can be seen in the package.json / package-lock.json .

EXECUTE

There are three ways to execute SESViewEl. In the first two ways SESViewEl is executed from source. Node.js needs to be
installed in a compatible version (see text before). The third way makes use of Docker.

1st way (tested in Windows with Node.js 10.15.3): There is a file called "extract_here.zip" in the SESViewEl directory.
Extract it in this directory (do not place it in a subdirectory) and a directory with the name "node_modules"
is created. This directory contains all dependencies of SESViewEl in the correct versions.
Open a shell and change at the shell into the directory of SESViewEl. SESViewEl can then be started with the shell command
- npm start

SESViewEl can be built for a platform with the command
- npm run dist

2nd way: Dependencies are collected online before running SESViewEl. Therefore:

1. Open a shell, change at the shell into the directory of SESViewEl and execute the commands
- npm install
- npm install electron --save-dev --save-exact

2. Now that all necessary packages and electron are installed in the program directory of SESViewEl,
SESViewEl can be started with the shell command
- npm start

SESViewEl can be built for a platform with the command
- npm run dist

3rd way: The program can be executed in a Docker container. Instructions are in the README file in the Docker
directory of this program.

KNOWN BUGS, NOTES, TODO

- Tooltips do not function any more when the program window is resized and an SES tree is loaded -> Maximize the SESViewEl
window before loading an SES tree

LICENSE

This application is licensed under GNU GPLv3.