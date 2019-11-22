INTRODUCTION

The software SESViewEl - System Entity Structure View Electron has been developed by the research group Computational
Engineering and Automation (CEA) at Wismar University of Applied Sciences.
The app SESViewEl starts a socket server on port 54545.
When a System Entity Structure (SES) coded as XML is sent to the server (e.g. from SESToPy), the SES is presented as tree.
See the documentation of SESToPy for details on the description of the SES in the XML format.
SESViewEl is developed with Node.js 10.15.3 and electron as UI.
Visual Studio Code 1.38.0 is used as development editor.
All dependencies and their versions can be seen in the package.json / package-lock.json .

EXECUTE

Install Node.js, open a shell, change at the shell into the directory of SESViewEl and execute the command
- npm install

All necessary packages are installed in the program directory of SESViewEl.

Then SESViewEl can be started with the shell command
- npm start

In case there is an error, please reinstall electron with the shell command
- npm install electron --save-dev --save-exact

SESViewEl can be built for a platform with the command
- npm run dist