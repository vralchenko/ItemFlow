---
title: ItemFlow
emoji: 📦
colorFrom: green
colorTo: blue
sdk: docker
app_port: 7860
pinned: false
---

# Item Flow

**Item Flow** is a full-stack web application for managing an item inventory, demonstrating a modern, type-safe, and professional approach to web development. The entire project, from frontend to backend and tests, is written in TypeScript.

---
## 🌐 Live Demo

* **Live App (Hugging Face Spaces):** [vralchenko-itemflow.hf.space](https://vralchenko-itemflow.hf.space/)

_Note: The app is hosted on a free Hugging Face Spaces instance and may take up to 50 seconds to "wake up" on the first request._

---
## 🚀 Key Features

* **✅ Full TypeScript Migration:** All frontend, backend, and test code is fully typed for enhanced reliability and a superior developer experience.
* **🏗️ Refactored Architecture:** Decomposed a monolithic "God hook" into smaller, specialized hooks (`useItems`, `useCategories`) following the Single Responsibility Principle.
* **📱 Responsive Design:** The UI is fully responsive and adapts seamlessly to mobile, tablet, and desktop screens.
* **☁️ Cloud Image Uploads:** Utilizes **Cloudinary** for robust, cloud-based image storage and delivery, with a file preview.
* **🤖 AI-Powered Suggestions:** Integrates Google's Gemini AI to suggest creative names for new items based on their category.
* **📦 Item & Category CRUD:** Full create, read, update, and delete operations for both items and categories.
* **🔍 Real-time Search:** Filter items by both item name and category name.
* **📄 Pagination:** Divides long lists into pages with a total item count.
* **🌐 Localization (i18n):** Multi-language support (EN, DE, RU, UK) with automatic browser language detection.
* **✨ Polished UI:** The interface is built with the Material-UI (MUI) component library.
* **🧪 Comprehensive Testing:** Includes backend API tests and full end-to-end (E2E) tests using Playwright.

---
## 🛠️ Tech Stack

| Category      | Technologies                                                                                       |
| :------------ |:---------------------------------------------------------------------------------------------------|
| **Frontend** | React, TypeScript, Vite, Material-UI (MUI), Axios, react-toastify, i18next                         |
| **Backend** | Node.js, Express, TypeScript, SQLite, Cloudinary (for image storage), Multer, Google Generative AI |
| **Testing** | Playwright (for both API and E2E tests)                                                            |
| **Tooling** | tsx (for running TypeScript on-the-fly), nodemon, cross-env, `wait-on`                             |
| **Deployment**| [Hugging Face Spaces](https://vralchenko-itemflow.hf.space/) (Docker), GitHub Actions (CI/CD)      |

---
## 📁 Project Structure

The project is organized as a monorepo with two primary directories:

* `backend/`: Contains the Node.js server application, including all API logic, now fully written in TypeScript.
* `frontend/`: Contains the React client application and all UI components, also fully written in TypeScript.

---
## ⚙️ Installation and Setup

### Prerequisites

* Node.js (v20.x or higher)
* npm (typically installed with Node.js)
* Google AI API Key
* Cloudinary Account (for Cloud Name, API Key, and API Secret)

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

    In the `backend` folder, create a file named `.env.development` and add the following, replacing placeholders with your actual keys:
    ```env
    PORT=3001
    DATABASE_PATH=./database.sqlite
    GEMINI_API_KEY="your-gemini-api-key"
    CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud-name"
    CLOUDINARY_API_KEY="your-cloudinary-api-key"
    CLOUDINARY_API_SECRET="your-cloudinary-api-secret"
    ```

4.  **Create and seed the development database**
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

    In the `frontend` folder, create a file named `.env.local` for local development:
    ```env
    VITE_API_URL=http://localhost:3001
    ```

    For production deployment on Hugging Face Spaces, `VITE_API_URL=""` is set in the Dockerfile so API calls use relative paths (same origin).

---
## 🚀 Running the Application in Development Mode

You need to run two servers simultaneously in two separate terminals.

### Running the Backend

In your first terminal (inside the `backend` folder):
```bash
  npm run dev
```

The server will be available at http://localhost:3001.

Running the Frontend
In your second terminal (inside the frontend folder):

```bash
  npm run dev
```

The application will open in your browser at http://localhost:5173.

🧪 Testing
The project is covered by two types of tests using Playwright. A separate, isolated database is used for all test runs. Note: You must add your GEMINI_API_KEY and CLOUDINARY_* keys to a .env.test file in the backend directory for tests to pass locally.

1. Running API Tests (Backend)
These tests check the API endpoints directly without a UI.

In your first terminal (inside the backend folder), start the server in test mode:

```bash
  npm run start:test
```
In your second terminal (inside the backend folder), run the test command:

```bash
  npm run test:api
```

2. Running End-to-End (E2E) Tests (Frontend)
These tests simulate real user interactions in a browser.

In your first terminal (inside the backend folder), start the server in test mode:

```bash
  npm run start:test
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