# Item Flow

**Item Flow** is a full-stack web application for managing an item inventory. It has been fully migrated to **TypeScript** to demonstrate a modern, type-safe approach to web development using React and Node.js.

This project serves as a comprehensive example covering REST API development, state management, form validation, filtering, pagination, file uploads, automated testing, and internationalization with AI-powered features.

---
## 🚀 Key Features

* **✅ Full TypeScript Migration:** All frontend, backend, and test code is fully typed for enhanced reliability and a superior developer experience.
* **📦 Item & Category CRUD:** Full create, read, update, and delete operations for both items and categories.
* **🤖 AI-Powered Suggestions:** Utilizes Google's Gemini AI to suggest creative names for new items based on their category.
* **🔗 Relational Data:** Items are linked to categories via a dropdown selection.
* **🔍 Real-time Search:** Filter items by both item name and category name, with a clear button.
* **📄 Pagination:** Divides long lists into pages with a total item count.
* **🖼️ Image Uploads:** Attach images to items with a file preview.
* **🛡️ Form Validation:** Checks for empty fields and duplicate entries.
* **🔔 User Notifications (Toasts):** Pop-up messages indicating the success or failure of operations.
* **🌐 Localization (i18n):** Multi-language support (EN, DE, RU, UK) with automatic browser language detection.
* **✨ Polished UI:** The interface is built with the Material-UI (MUI) component library.
* **🧪 Comprehensive Testing:** Includes backend API tests and full end-to-end (E2E) tests using Playwright.

---
## 🛠️ Tech Stack

| Category      | Technologies                                                                 |
| :------------ | :--------------------------------------------------------------------------- |
| **Frontend** | React, **TypeScript**, Vite, Material-UI (MUI), Axios, react-toastify, i18next |
| **Backend** | Node.js, Express, **TypeScript**, SQLite, Multer, Google Generative AI       |
| **Testing** | Playwright (for both API and E2E tests)                                      |
| **Tooling** | **tsx** (for running TypeScript on-the-fly), nodemon, cross-env                |
| **CI/CD** | GitHub Actions                                                               |

---
## 📁 Project Structure

The project is organized as a monorepo with two primary directories:

* `backend/`: Contains the Node.js server application, including all API logic, now fully written in TypeScript.
* `frontend/`: Contains the React client application and all UI components, also fully written in TypeScript.

---
## ⚙️ Installation and Setup

### Prerequisites

* **Node.js** (v20.x or higher)
* **npm** (typically installed with Node.js)
* A **Google AI API Key** (for the AI suggestion feature)

### Backend Setup

1.  **Navigate to the `backend` folder**
    ```bash
    cd backend
    ```

2.  **Install all dependencies**
    ```bash
    npm install
    ```

3.  **Create the environment file**

    In the `backend` folder, create a file named `.env.development` and add the following, replacing `your-gemini-api-key-here` with your actual key:
    ```env
    PORT=3001
    DATABASE_PATH=./database.sqlite
    GEMINI_API_KEY="your-gemini-api-key-here"
    ```

4.  **Create and seed the development database**

    This command creates the `database.sqlite` file and populates it with initial data.
    ```bash
    npm run db:init
    ```

### Frontend Setup

1.  **Navigate to the `frontend` folder** (in a separate terminal window)
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
    VITE_API_URL=http://localhost:3001
    ```
    
---
## 🚀 Running the Application in Development Mode

You need to run two servers simultaneously in two separate terminals.

### Running the Backend

In your first terminal (inside the `backend` folder):

```bash
  npm run dev
```

The server will be available at http://localhost:3001.

### Running the Frontend
In your second terminal (inside the frontend folder):

```bash
  npm run dev
```

The application will open in your browser at http://localhost:5173.

🧪 Testing
The project is covered by two types of tests using Playwright. A separate, isolated database is used for all test runs.

1. Running API Tests (Backend)
These tests check the API endpoints directly without a UI.

In your first terminal (inside the backend folder), start the server in test mode:

```bash
  npm run dev:test
```

In your second terminal (inside the backend folder), run the test command:

```bash
  npm run test:api
```

2. Running End-to-End (E2E) Tests (Frontend)
These tests simulate real user interactions in a browser.

In your first terminal (inside the backend folder), start the server in test mode:

```bash
  npm run dev:test
```

In your second terminal (inside the frontend folder), run the test command:

```bash
  npx playwright test
```

Playwright will automatically launch the frontend server, open a browser, and run the tests.

3. Viewing Reports
After running either test suite, you can view a detailed HTML report. In the corresponding folder (backend or frontend), run:

```bash
  npx playwright show-report
```