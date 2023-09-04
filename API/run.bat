@echo off

REM Change the path to the location of your virtual environment
set VENV_PATH=C:\path\to\api-env

REM Activate the virtual environment
call %VENV_PATH%\Scripts\activate.bat

REM Open a CMD window with the activated virtual environment
start cmd.exe