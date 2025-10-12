Item Flow
Item Flow is a full-stack web application demonstrating a complete CRUD (Create, Read, Update, Delete) implementation. The application consists of a Node.js/Express backend and a React frontend.

This project serves as a comprehensive example covering API development, state management, form validation, filtering, pagination, file uploads, and two different types of automated testing.

🚀 Key Features
Item CRUD: Full create, read, update, and delete operations for items.

Category CRUD: Separate management for categories, including creation, editing, and deletion.

Relational Data: Items are linked to categories via a dropdown selection.

Filtering: Real-time search for items by name.

Pagination: Division of long lists into multiple pages.

Image Uploads: Ability to attach images to items.

Form Validation: Checks for empty fields and duplicate entries.

User Notifications (Toasts): Pop-up messages indicating the success or failure of an operation.

Polished UI: The interface is built with the Material-UI component library.

Comprehensive Testing: Includes backend API tests and full end-to-end (E2E) tests.

🛠️ Tech Stack
Backend
Node.js

Express — Web framework.

SQLite — File-based relational database.

Multer — Middleware for handling file uploads.

dotenv — For managing environment variables.

Playwright — For API testing.

Frontend
React

Vite — Build tool and development server.

Material-UI (MUI) — UI component library.

Axios — For making HTTP requests.

react-toastify — For toast notifications.

Playwright — For End-to-End testing.

📁 Project Structure
The project is structured as a monorepo with two primary directories:

backend/: Contains the Node.js server application.

frontend/: Contains the React client application.

⚙️ Installation and Setup
Prerequisites
Node.js (v18.x or higher)

npm (typically installed with Node.js)

Backend Setup
Navigate to the backend folder

Bash

cd backend
Install all dependencies

Bash

npm install
Create the environment file

In the backend folder, create a file named .env.development and add the following content:

Code snippet

PORT=3001
API_BASE_URL=http://localhost:3001
DATABASE_PATH=./database.sqlite
Create and seed the development database

This command creates the database.sqlite file and populates it with initial data.

Bash

npm run db:init
Frontend Setup
Navigate to the frontend folder (in a separate terminal window)

Bash

cd frontend
Install all dependencies

Bash

npm install
Create the environment file

In the frontend folder, create a file named .env and add the following content:

Code snippet

VITE_API_BASE_URL=http://localhost:3001
🚀 Running the Application
You need to run two servers simultaneously in two separate terminals.

Running the Backend
Bash

# In your /backend terminal
npm start
The server will be available at http://localhost:3001.

Running the Frontend
Bash

# In your /frontend terminal
npm run dev
The application will open in your browser at http://localhost:5173.

🧪 Testing
The project is covered by two types of tests using Playwright. A separate, isolated database is used for all test runs.

1. Preparing the Test Environment
   Before running tests for the first time, you must create the test database.

Bash

# In the /backend terminal
npm run test:init-db
This command will create and seed the test-database.sqlite file.

2. Running API Tests (Backend)
   These tests check the API endpoints directly without a UI.

Start the backend in test mode (in your first terminal):

Bash

# In the /backend folder
npm run start:test
Run the tests (in a second terminal):

Bash

# In the /backend folder
npm run test:api
3. Running End-to-End (E2E) Tests (Frontend)
   These tests simulate real user interactions in a browser.

Start the backend in test mode (in your first terminal):

Bash

# In the /backend folder
npm run start:test
Run the tests (in a second terminal):

Bash

# In the /frontend folder
npx playwright test
4. Viewing Reports
   After running either Playwright test suite, you can view a detailed HTML report:

Bash

# For API tests (in the /backend folder)
npx playwright show-report

# For E2E tests (in the /frontend folder)
npx playwright show-report
The report will open in your browser, showing all test steps, screenshots, and network trace information.