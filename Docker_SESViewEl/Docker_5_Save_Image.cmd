@echo off
REM save the image
cd %HOMEPATH%
docker save -o SESViewEl_Docker_Image.tar hf/sesviewel

pause
