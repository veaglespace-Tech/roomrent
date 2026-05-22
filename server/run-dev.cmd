@echo off
setlocal

set "SCRIPT_DIR=%~dp0"
set "MVN_CMD="

where mvn >nul 2>nul
if %ERRORLEVEL%==0 (
  set "MVN_CMD=mvn"
) else if exist "C:\tmp\apache-maven-3.9.16\bin\mvn.cmd" (
  set "MVN_CMD=C:\tmp\apache-maven-3.9.16\bin\mvn.cmd"
) else if exist "C:\tmp\apache-maven-3.9.9\bin\mvn.cmd" (
  set "MVN_CMD=C:\tmp\apache-maven-3.9.9\bin\mvn.cmd"
)

if "%MVN_CMD%"=="" (
  echo Maven not found.
  echo Install Maven or place it under C:\tmp\apache-maven-3.9.x\bin\mvn.cmd
  exit /b 1
)

pushd "%SCRIPT_DIR%"
call "%MVN_CMD%" spring-boot:run
set "EXIT_CODE=%ERRORLEVEL%"
popd

exit /b %EXIT_CODE%
