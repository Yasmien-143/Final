# Student Information Management System

A cloud-ready Node.js application demonstrating CRUD operations with MySQL, built for IT318 final practical examination.

## Features
- Add student records
- View all student records
- Update student information
- Delete student records
- Responsive navigation and forms
- Cloud database-ready configuration via environment variables

## Files Included
- `package.json`
- `crud_final_exam.js`
- `README.md`
- `views/` (EJS templates)
- `public/styles.css`

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file in the project root with your Aiven MySQL credentials:
   ```env
   DB_HOST=your-db-host
   DB_PORT=your-db-port
   DB_USER=your-db-user
   DB_PASSWORD=your-db-password
   DB_NAME=your-db-name
   PORT=10000
   ```
3. Start the application:
   ```bash
   npm start
   ```
4. Open the app in your browser at `http://localhost:10000`

## Deployment Notes
- Use Render to deploy the application.
- Configure environment variables in Render rather than storing credentials in GitHub.
- The app will automatically create the `students` table if it does not already exist.

## Database Schema
The application uses a `students` table with the following columns:
- `id` (INT, AUTO_INCREMENT)
- `student_id` (VARCHAR(50))
- `full_name` (VARCHAR(255))
- `course` (VARCHAR(255))
- `year_level` (VARCHAR(50))
- `email` (VARCHAR(255))

## Required Links
- GitHub Repository Link: https://github.com/Yasmien-143/Final.git
- Render Deployment Link: https://final-1-w3i9.onrender.com
## Presentation Checklist
- Add student record
- Update student information
- Delete student record
- View stored data in student table
