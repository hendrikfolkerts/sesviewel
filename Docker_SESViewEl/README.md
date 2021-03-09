Docker scripts for Linux shell *.sh and Windows Power Shell *.cmd

In case there are errors executing the shellscripts for Linux, see notes below the instructions.

Instructions:

-> Place this folder in the home directory of the current user ( /home/\<Username> or C:\Users\\\<Username> ) (and do not rename it).

-> Place the SESViewEl files ... main.js etc. ... in this folder, but delete the file "extract_here.zip" (if it is placed in the SESViewEl directory).

-> "Docker_0_Build_Image" builds an image with the help of the dockerfile, which loads an existing node image, installs libraries for electron, copies the SESViewEl files into the /app directory of the image, and installs the dependencies of SESViewEl according to the package*.json files. 

-> "Docker_1_Start_Container" starts a container from this image. SESViewEl ist started with the command "npm start".

-> "Docker_2_Show_All_Infos": Shows all infos of images, started containers, ports, etc.

-> "Docker_3_Enter_Container_Shell": Executing in a shell, it gives access to a shell in the container.

-> "Docker_4_Stop_Remove_Container" stops and deletes the container.

-> "Docker_5_Save_Image" saves the image in the home directory of the current user.

-> "Docker_6_Delete_Image" deletes the image.

-> "Docker_7_Load_Image" loads the saved image back.

-> "Docker_8_Remove_All_Containers_and_Images" removes all containers and images from a Docker registry on the computer.

Notes for Linux shellscripts:

-> If the shellscript(s) cannot be executed, make sure they are marked as executable. Furthermore they need to be owned by the current user and need to be in the group of the current user.

-> Error: /bin/sh^M: Broken interpreter: File or directory not found  
   The ^M is a carriage return character. Linux uses the line feed character to mark the end of a line, whereas Windows uses the two-character sequence CR LF. Your file has Windows line endings, which is confusing Linux. Correct with the command:
   sed -i -e 's/\r$//' scriptname.sh

-> It might help to change the directory in the shell to the directory of this file using cd before executing the Docker shellscripts.
