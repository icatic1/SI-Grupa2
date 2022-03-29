## Project Initiation
#### Task
 - Create database (smarterasp.com)
 - Create new branch and switch to it
 - Adding the necessary tables (possible expansion in the continuation of the project)
 - Create an ASP.NET Core app with React in Visual Studio
 - Create models in accordance with the database
 - Create routes for user information
 - Create routes for changing user information
 - Create routes for adding user (possible expansion in the continuation of the project)
 - Commit and push on your branch
 - Create a pull request

## Items based on user stories
### Item
The application must provide secure access (JWT) for the user, which contains the necessary authorization for modules and TFA.
#### Task
 - Create new branch and switch to it
 - Create Login Component
 - Edit user interface
 - Integrate JWT in the system
 - Create function for Login
 - Implement 2FA
 - Commit and push on your branch
 - Create a pull request
 - Merge branches

### Item
The admin should have full access to each individual part of the system (module) and functions.
#### Task
 - Create new branch and switch to it
 - Create authorization for individual parts of the system
 - Adjust the frontend
 - Commit and push on your branch
 - Create a pull request
 - Merge branches

### Item
The user should be able to log out of the application.
#### Task
 - Create new branch and switch to it
 - Create a logout button on the form
 - Create route for logout action
 - Redirect user on login form
 - Commit and push on your branch
 - Create a pull request
 - Merge branches

### Item
The admin should be able to add a new user.
#### Task 
- Create new branch and switch to it
- Create AddUser component
- Create a route to retrieve and create security questions
- Create a route to retrieve and create a user role
- Connect the frontend component to the backend
- Commit and push on your branch
- Create a pull request
- Merge branches

### Item
The admin should be able to manage each individual user and his settings, change the password.
#### Task 
- Create new branch and switch to it
- Create UserList and UserCard components as the starting Admin view
- Create UpdateUser component
- Create a function to change User settings
- Commit and push on your branch
- Create a pull request
- Merge branches

### Item
The user should have a special way to change the password (questions and email / link).
#### Task 
- Create new branch and switch to it
- Create ForgotPassword component
- Adjust the frontend
- Create route for pass token
- Email reset implementation
- Secutiry questions implementation
- Commit and push on your branch
- Create a pull request
- Merge branches

### Item 
The admin should be able to delete users
#### Task 
- Create new branch and switch to it
- Create a Delete button on the UserList component
- Create funtion to delete User
- Commit and push on your branch
- Create a pull request
- Merge branches

### Item 
The admin should be able to control access rights for all types of users of this system.
#### Task 
- Create new branch and switch to it
- Create a Change Access button on the UserList component
- Create route to change a user role
- Create a function to change user access rights
- Commit and push on your branch
- Create a pull request
- Merge branches

### Item 
Logging
#### Task 
- Create new branch and switch to it
- Configure Serilog
- Add an entry to the log table for: adding user, login, changing password (forgot password), updating user, deleting user
- Commit and push on your branch
- Create a pull request
- Merge branches