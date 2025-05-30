@echo off
setlocal enabledelayedexpansion

echo [STEP]: Starting docker containers,,,,
docker-compose up -d
if !errorlevel! neq 0 (
    echo [ERROR]: Failed to start docker containers.
    exit /b %errorlevel%
)

echo [STATUS]: Waiting for the services to be ready...
SET MAX_ATTEMPTS=30
SET INTERVAL=10

for /L %%i in (1,1,%MAX_ATTEMPTS%) do (
    SET "all_ready=true"
        
    REM Check MSSQL
    docker exec -it MSSQL /opt/mssql-tools18/bin/sqlcmd -C -S localhost -U sa -P "YourStrong#Passw0rd123" -Q "SELECT 1" >nul 2>&1
    if !errorlevel! neq 0 (
        echo [STATUS]: Waiting for MSSQL...
        set "all_ready=false"
    )
    REM Exit if all services are ready
       if "!all_ready!"=="true" (
           echo [STATUS]: All services are ready!
           goto all_ready
       )
       echo [STATUS]: Retrying in %INTERVAL% seconds...
       timeout /t %INTERVAL% >nul
)

echo [ERR]: Timeout waiting for services.
exit /b 1



:all_ready

echo [STEP]: Update database schema...
@echo off
dotnet ef database update --context AuthContext >nul

if !errorlevel! neq 0 (
    echo [ERROR]: Failed to update database schema.
    exit /b %errorlevel%
)

echo [STATUS]: Database schema updated successfully.