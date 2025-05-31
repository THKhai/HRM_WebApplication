# HRM Web Application

A Human Resource Management (HRM) web application built with C# and ASP.NET Core.  
Includes API endpoints for employee management, authentication, and leave requests, with automated stress tests.

## Features

- Employee registration and authentication
- Role-based access control
- Business features
   - Profile Management
   - Employee Request Management
   - Employee Activity Management
   - Reward Management
- Bulk employee registration and stress testing
- RESTful API design
## Project Structure

- `ptudhttthd-web-hrm.Server/` — ASP.NET Core Web API backend
- `ptudhttthd-web-hrm.Server/Test/` — NUnit test suite for API endpoints
- `[ptudhttthd-web-hrm.Client/](https://github.com/THKhai/HRM_Front_End)` —  Frontend client application

## Prerequisites
- .NET 6.0 SDK or later
- [NUnit](https://nunit.org/) for testing
- JetBrains Rider or Visual Studio
- (Optional) SQL Server or other configured database
- Docker and Docker Compose are installed on your system.
## Getting Started

1. **Clone the repository:**
Or use the test runner in Rider/Visual Studio.

2. **Configure the API:**
   - Update `appsettings.json` with your database connection string and JWT settings.
   - 
4. **Set up the services**
    Step 1: Change the direction
   `cd ptudhttthd-web-hrm.Server`
    Step 2: Start the Databases
    Run the `dbup.bat` script to start the Docker containers and initialize the databases:
    ```bash
      dbup.bat
    ```
     Step 3: Run the Application
      1. Open the project in your IDE (e.g., JetBrains Rider).

      2. Build the solution to ensure all dependencies are resolved.
         
      3. Run the `Program.cs` file to start the Web Application.
     Step 4: Stop and Clean Up
    To stop the containers and clean up the data, run the `dbdown.bat` script:
    ```bash
      dbdown.bat
    ```
6. The API will be available at `http://localhost:5160` or `https://localhost:7050`.
   
## Run the tests:
 ### Step 1: Run the application
 ### Step 2: Open the hrm_test.cs in the Test folder
 ### Step 3: Click the running button on the left of the class `BulkEmployeeTests`
   
## Bulk Employee Tests

- Located in `ptudhttthd-web-hrm.Server/Test/500EmployeesTest.cs`
- Simulates mass registration and login of employees to stress-test the API.
- Adjust the number of employees and parallelism as needed.

## Notes

- Ensure your server and database can handle the load for high concurrency tests.
- Test users are created with predictable usernames and emails for easy cleanup.
- Update API URLs in tests if you change the server port or address.

## License

This project is for educational and testing purposes.
