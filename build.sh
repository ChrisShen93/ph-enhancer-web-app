#########################################################################
# File Name: build.sh
# Author: ma6174
# mail: ma6174@163.com
# Created Time: Tue 19 Sep 2017 11:38:35 PM DST
#########################################################################
#!/bin/bash
ng build; scp -r dist root@www.xsaoh.com:/opt/tomcat/webapps/ph
