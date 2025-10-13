# Item Flow

**Item Flow** is a full-stack web application demonstrating a complete CRUD (Create, Read, Update, Delete) implementation. The application consists of a Node.js/Express backend and a React frontend.

This project serves as a comprehensive example covering API development, state management, form validation, filtering, pagination, file uploads, automated testing, and internationalization with AI-powered features.

---
## 🚀 Key Features

* **Item CRUD:** Full create, read, update, and delete operations for items.
* **Category CRUD:** Separate management for categories, including creation, editing, and deletion.
* **AI-Powered Suggestions:** Utilizes Google's Gemini AI to suggest creative names for new items based on their category.
* **Relational Data:** Items are linked to categories via a dropdown selection.
* **Filtering:** Real-time search for items by name with a "clear" button.
* **Pagination:** Division of long lists into multiple pages with a total item count.
* **Image Uploads:** Ability to attach images to items with a preview.
* **Form Validation:** Checks for empty fields and duplicate entries.
* **User Notifications (Toasts):** Pop-up messages indicating the success or failure of an operation.
* **Localization (i18n):** Multi-language support (EN, DE, RU, UK) with automatic browser language detection.
* **Polished UI:** The interface is built with the Material-UI component library.
* **Comprehensive Testing:** Includes backend API tests and full end-to-end (E2E) tests.

---
## 🛠️ Tech Stack

### Backend
* **Node.js**
* **Express** — Web framework.
* **SQLite** — File-based relational database.
* **Multer** — Middleware for handling file uploads.
* **Google Generative AI** — For AI-powered name suggestions via the Gemini API.
* **dotenv** — For managing environment variables.
* **Playwright** — For API testing.

### Frontend
* **React**
* **Vite** — Build tool and development server.
* **Material-UI (MUI)** — UI component library.
* **Axios** — For making HTTP requests.
* **react-toastify** — For toast notifications.
* **react-i18next** & **i18next** — For internationalization.
* **Playwright** — For End-to-End testing.

---
## 🌍 Localization

The application supports multiple languages and will automatically detect the user's browser language on the first visit. Users can also manually switch between supported languages using the language selector in the header.

* **Supported Languages:** English (en), German (de), Russian (ru), Ukrainian (uk).
* **Implementation:** Achieved using the `react-i18next` library.
* **Translation Files:** All text strings are stored in JSON format located in the `frontend/src/locales/` directory.

---
## 📁 Project Structure

The project is structured as a monorepo with two primary directories:

* `backend/`: Contains the Node.js server application, including all API logic.
* `frontend/`: Contains the React client application and all UI components.

---
## ⚙️ Installation and Setup

### Prerequisites

* **Node.js** (v18.x or higher)
* **npm** (typically installed with Node.js)
* **Google AI API Key** (for the AI suggestion feature)

### Backend Setup

1.  **Navigate to the backend folder**
    ```bash
    cd backend
    ```

2.  **Install all dependencies**
    ```bash
    npm install
    ```

3.  **Create the environment file**

    In the `backend` folder, create a file named `.env.development` and add the following content, replacing `your-gemini-api-key-here` with your actual key:
    ```env
    PORT=3001
    API_BASE_URL=http://localhost:3001
    DATABASE_PATH=./database.sqlite
    GEMINI_API_KEY="your-gemini-api-key-here"
    ```

4.  **Create and seed the development database**

    This command creates the `database.sqlite` file and populates it with initial data.
    ```bash
    npm run db:init
    ```

### Frontend Setup

1.  **Navigate to the frontend folder** (in a separate terminal window)
    ```bash
    cd frontend
    ```

2.  **Install all dependencies**
    ```bash
    npm install
    ```

3.  **Create the environment file**

    In the `frontend` folder, create a file named `.env` and add the following content:
    ```env
    VITE_API_BASE_URL=http://localhost:3001
    ```

---
## 🚀 Running the Application

You need to run two servers simultaneously in two separate terminals.

### Running the Backend

# In your /backend terminal
```bash
    npm start
```
The server will be available at http://localhost:3001.

### Running the Frontend

# In your /frontend terminal
```bash
  npm run dev
```
The application will open in your browser at http://localhost:5173.

🧪 Testing
The project is covered by two types of tests using Playwright. A separate, isolated database is used for all test runs.

1. Preparing the Test Environment
Before running tests for the first time, you must create the test database.

# In the /backend terminal
```bash
  npm run test:init-db
```
This command will create and seed the test-database.sqlite file.

2. Running API Tests (Backend)
These tests check the API endpoints directly without a UI.

Start the backend in test mode (in your first terminal):

# In the /backend folder
```bash
  npm run start:test
```
Run the tests (in a second terminal):

# In the /backend folder
```bash
  npm run test:api
```
3. Running End-to-End (E2E) Tests (Frontend)
These tests simulate real user interactions in a browser.

Start the backend in test mode (in your first terminal):

# In the /backend folder
```bash
  npm run start:test
```
Run the tests (in a second terminal):

# In the /frontend folder
```bash
  npx playwright test
```

4. Viewing Reports
After running either Playwright test suite, you can view a detailed HTML report:

For API tests:

# In the /backend folder
```bash
  npx playwright show-report
```

For E2E tests:

# In the /frontend folder
```bash
  npx playwright show-report
```

The report will open in your browser, showing all test steps, screenshots, and network trace information.