::======================
::以后台方式清理构建
::======================
@echo off
echo [INFO] build and install modules.
cd ..\
call mvn clean
pause
