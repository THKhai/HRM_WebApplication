@echo off
cd ..

echo [STEP]: Stopping MSSQL container...
docker-compose down -v

echo [STEP]: Removing MSSQL volume...
docker volume rm mssql_data >nul 2>&1

echo [STEP]: Removing MSSQL database files if present...
if EXIST "Repository\mssql_data" (
    echo [STATUS]: Removing local MSSQL data directory...
    rmdir /s /q "Repository\mssql_data"
)

echo [STATUS]: MSSQL container and data removed successfully.
