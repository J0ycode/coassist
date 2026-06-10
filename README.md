# 🩺 Coassist: Personal Health & Finance Companion

Coassist is a modern, responsive, and secure full-stack web application designed to help individuals monitor their daily health vitals and manage their financial transactions in one place.

---

## 🚀 Key Features

### 👤 Secure Authentication
*   **User Registration & Login:** Email-based secure authentication system.
*   **Token-Based Security:** JSON Web Tokens (JWT) used for session authorization.
*   **Password Encryption:** Strong password hashing implemented via `bcryptjs`.
*   **Protected Routes:** Private dashboards and modules accessible only to authenticated users.

### 🩺 Health Tracking
*   **Vitals Logger:** Log daily vital signs:
    *   **Blood Pressure:** Systolic and diastolic readings.
    *   **Body Temperature:** Daily temperature records.
    *   **Blood Oxygen (SpO2):** Oxygen saturation levels.
    *   **Notes:** Short memos for symptoms, medication, or wellness notes.
*   **Interactive Logs:** A tabular view of all recorded vitals with sorting support.
*   **Visual Analytics:** Interactive charts mapping health trends over time.

### 💰 Financial Management
*   **Transaction Tracker:** Easy logging of daily cash flow (Income and Expenses).
*   **Categorization:** Classify your funds under custom categories (e.g., salary, food, rent, entertainment).
*   **Dynamic Dashboard:** Real-time calculation of total income, total expenses, and current net balance.
*   **Rich Visualizations:** Multi-colored bar charts and data tables representing transaction distributions.

---

## 👥 Demo Credentials

To test the application without creating a new account, you can use the following pre-configured demo credentials:

*   **Username:** `demo_user`
*   **Password:** `password123`

---

## 🛠️ Technology Stack

| Layer | Technology Used |
| :--- | :--- |
| **Frontend** | React (Vite), Material-UI (MUI v5), Recharts, React Router DOM, Axios |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose ORM |
| **Authentication** | JSON Web Tokens (JWT), BcryptJS |

---

## 📁 Project Structure

```text
Companion/
├── backend/                   # Node.js + Express backend
│   ├── middleware/            # Auth middleware for verifying JWT
│   ├── models/                # MongoDB/Mongoose schemas (User, HealthRecord, Transaction)
│   ├── routes/                # API route handlers (auth, health, finance)
│   └── server.js              # Application entry point & database connection
├── frontend/                  # React + Vite frontend
│   ├── public/                # Static assets
│   └── src/
│       ├── components/        # Reusable components (layout, dashboard, auth, health, finance, report)
│       ├── context/           # Global Authentication Context
│       ├── pages/             # Page components (Home, Health, Finance, Login, Register)
│       ├── theme/             # Custom MUI theme palette and typography
│       ├── App.jsx            # Routing and core providers
│       └── main.jsx           # Entry mount
├── package.json               # Root scripts and dev dependencies
└── README.md                  # Project documentation
```

---

## ⚙️ Installation & Configuration

### Prerequisites
*   [Node.js](https://nodejs.org/) installed on your machine.
*   A running instance of [MongoDB](https://www.mongodb.com/) (Local or MongoDB Atlas).

### 1. Environment Configuration

Create a `.env` file in the root directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/coassist
JWT_SECRET=your_jwt_secret_key_here
```

### 2. Install Dependencies

Install root, backend, and frontend dependencies:

```bash
# Install root/backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

---

## 🏃 Run the Application

### Development Mode

Run the backend and frontend concurrently or separately.

**To run the backend with nodemon:**
```bash
npm run dev
```

**To run the frontend dev server (from `frontend/` directory):**
```bash
cd frontend
npm run dev
```

The frontend will run on [http://localhost:5173/](http://localhost:5173/) (or your configured Vite port).

---

## 🛡️ License

This project is licensed under the MIT License.
