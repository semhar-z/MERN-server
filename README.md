# MERN-server- BookWizards app

 - It is a web application that allows users to search for books using the Open Library API,
 - It saves their favorite books, and manage tasks for kids. 
 - The application features a user authentication system, book management, and a task scheduler.

# Technologies Used (Backend)

*Node.js:* JavaScript runtime for backend development.

*Express.js:* Web framework for building APIs.

*MongoDB:* NoSQL database for storing user and book data.

*Mongoose:* ODM library for MongoDB.

*JWT:* JSON Web Tokens for user authentication.

*Dotenv:* For managing environment variables.

*Axios:* HTTP client for making API requests.

# Endpoints

*Authentication Endpoints*

- Register a User: POST /api/users/auth/register

- Login: POST /api/users/auth/login

*Book Management Endpoints*

- Search Books: GET /api/books/search

- Save a Book: POST /api/savedBooks/save

- Get Saved Books: GET /api/savedBooks/all

- Delete a Saved Book: DELETE /api/savedBooks/delete/:isbn

*Task Scheduler Endpoints*

- Add Task: POST /api/users/tasks/add

- Get Tasks: GET /api/users/tasks/all

- Delete Task: DELETE /api/users/tasks/delete/:id



