Or use the test runner in Rider/Visual Studio.

## Bulk Employee Tests

- Located in `ptudhttthd-web-hrm.Server/Test/500EmployeesTest.cs`
- Simulates mass registration and login of employees to stress-test the API.
- Adjust the number of employees and parallelism as needed.

## Notes

- For high concurrency tests, ensure your server and database can handle the load.
- Test users are created with predictable usernames and emails for easy cleanup.
- Update API URLs in tests if you change the server port or address.

## License

This project is for educational and testing purposes.
