# Project Setup Instructions

Follow these steps to get the application running on your local machine.

## 1. Prerequisites
- **Node.js** (v14 or higher)
- **MongoDB** (Local installation or MongoDB Atlas account)

---

## 2. Backend Setup
1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Configure Environment Variables:**
    Create a file named `.env` in the `backend` folder and add the following:
    ```env
    PORT=3000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    ```
4.  **Start the Backend Server:**
    ```bash
    npm run dev
    ```
    *The server will run at `http://localhost:3000`*

---

## 3. Frontend Setup
1.  **Open a new terminal and navigate to the frontend directory:**
    ```bash
    cd frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Configure Environment Variables:**
    Create a file named `.env` in the `frontend` folder and add:
    ```env
    VITE_BASE_URL=http://localhost:3000/api
    ```
4.  **Start the Frontend Application:**
    ```bash
    npm run dev
    ```
    *The app will be available at `http://localhost:5173`*

---

## 4. Running Tests
To run the backend unit tests:
```bash
cd backend
npm test
```
