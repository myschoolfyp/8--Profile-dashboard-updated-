  Profile Dashboard + Authentication (Login & Registration)
Overview
This module includes user authentication (login & registration) and a Profile Dashboard where users (students) can view and manage their profile information. The dashboard supports CRUD operations on student data stored in the database.

File Structure
/register – User registration page.
/login – User login page.
/dashboard/profile – Profile dashboard for users.
/api/register – API for user registration.
/api/login – API for user authentication.
/api/profile – API for fetching, updating, and managing user profiles.
Features
User Authentication: Secure login & registration system.
Profile Dashboard:
Displays user profile data fetched from the Student table.
Users can view, update, and manage their profile details.
Supports CRUD operations (Create, Read, Update, Delete) on student records.
Profile Picture Support: Users can upload or update their profile picture.
Database-Driven: Data is stored and retrieved using a structured Student model.
Models
Student Model (Student Table)
The Student model represents user profile data in the system. It includes:

id (Primary Key) – Unique identifier for each student.
name – Full name of the student.
email – Unique email address (used for login).
password – Hashed password for authentication.
profile_picture – Path/URL to the user’s profile picture.
created_at – Timestamp when the profile was created.
updated_at – Timestamp when the profile was last updated.
Technologies Used
Frontend: Next.js, TypeScript
Backend: API Routes in Next.js
Database: PostgreSQL / MySQL (or any chosen database)
Authentication: JWT-based authentication
File Handling: Cloud storage or local file system for profile pictures
Usage
Register a new user via the registration page.
Login using valid credentials.
After login, navigate to the Profile Dashboard.
View and manage user details stored in the Student Table.
Perform CRUD operations (Edit ,delete,update the student ,  update details).
Setup
Ensure environment variables (e.g., database connection, JWT secret, file storage config) are properly set.
Run database migrations to create the Student table.

