# MERN Stack Application for Car Management

This is a MERN stack application for managing cars and categories, featuring authentication, email notifications, and secure CRUD operations.

# Features:
  - User authentication with JWT.
  - Welcome email and randomly generated password on sign-up.
  - CRUD operations for categories and cars.
  - Secure and XSS-protected application.
  - Paginated and sortable tables.

# Tech Stack:
  - Frontend: React, Axios, Bootstrap, or Material-UI.
  - Backend: Node.js, Express.js.
  - Database: MongoDB.
  - Email Service: Nodemailer (using Gmail/SMTP).

# Installation Instructions:
  ## Installation
    1. Clone the repository.
    2. Navigate to the backend directory and install dependencies: cd backend npm install
    3. Navigate to the frontend directory and install dependencies: cd frontend npm install
    4. Configure environment variables:
      - `backend/.env`: Add DB_URI, JWT_SECRET, and SMTP details.
      - `frontend/.env`: Add API base URL.
    5. Start the application: cd backend npm start cd ../frontend npm start

# API Documentation
  ### Endpoints
  #### Authentication
    - `POST /api/auth/signup`: Registers a user and sends a welcome email.
    - `POST /api/auth/login`: Authenticates a user and returns a JWT.
    
    #### Categories
    - `GET /api/categories`: Fetch all categories.
    - `POST /api/categories`: Create a new category.
    
    #### Cars
    - `GET /api/cars`: Fetch all cars with pagination.
    - `POST /api/cars`: Add a new car.




