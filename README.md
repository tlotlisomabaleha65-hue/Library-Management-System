# Web Application Development - BIWA2110
## Individual Assignment 2 (15%)
**Department:** Faculty of Information Communication Technology  
**Course:** Degree in Business Information Technology / Degree in Information Technology  
**Semester:** 2  

---

## 1. Project Overview
This project is a web-based **Library Management System** for a community library built using **React** and **Local Storage**.

The system enables librarians and users to:
1. **Manage Books:** Add new books, update existing details, and delete books.
2. **Track Availability & Stock:** Track real-time book quantities, add stock when new shipments arrive, and deduct stock when books are borrowed.
3. **Manage User Accounts:** User login system, register new users, update user profiles, and delete accounts.
4. **Dashboard:** View summary statistics, search books, and easily see low-stock warnings (fewer than 2 copies).
5. **Data Persistence:** All books, transactions, and users are automatically saved in browser **Local Storage** so nothing is lost when the page refreshes.

---

## 2. Technical Implementation & Assignment Criteria

This application demonstrates all required React competencies:

### A. React Hooks (`useState`, `useEffect`)
- **`useState`**: Used throughout the app to manage:
  - Book catalog list and form inputs.
  - Active transactions and stock counters.
  - User accounts and authentication session.
  - Search filters and editing states.
- **`useEffect`**: Used for lifecycle synchronization:
  - Loads saved books, users, and transactions from `localStorage` on initial mount.
  - Automatically updates `localStorage` whenever books, transactions, or users change.

### B. Component Composition (Reusable UI Architecture)
The UI is broken down into structured, clean components:
- **`src/components/Navbar.jsx`**: Reusable navigation bar with active page links and current logged-in user indicator.
- **`src/components/Footer.jsx`**: Standardized footer with course and assignment details.
- **`src/pages/Dashboard.jsx`**: Overview screen with summary cards, search filter, and availability table highlighting low stock.
- **`src/pages/BookManagement.jsx`**: Controlled form to add new books, edit existing books, and delete books.
- **`src/pages/Transactions.jsx`**: Stock transactions (Add Stock / Borrow Book) with validation and transaction history log.
- **`src/pages/UserManagement.jsx`**: User login authentication form, demo login shortcuts, and admin table to add, update, and delete users.

### C. Forms & Controlled Components
- All form inputs use controlled state (`value={...}` and `onChange={...}`).
- Validation ensures:
  - Required fields cannot be empty.
  - Quantities must be valid numbers (cannot be negative).
  - Borrowing cannot exceed available stock.
  - User duplicate IDs are prevented.

### D. React Router Navigation
- Configured using **`react-router-dom`** (`BrowserRouter`, `Routes`, `Route`, `NavLink`).
- Routes:
  - `/` &rarr; Dashboard
  - `/books` &rarr; Book Management
  - `/transactions` &rarr; Availability & Transactions
  - `/users` &rarr; User Management & Login

### E. Styling & Responsiveness
- Clean, modern, responsive layout written in `src/App.css` and `src/index.css`.
- Rows with low stock (fewer than 2 copies) are highlighted with a soft red background and red warning badges.

---

## 3. Preloaded Demo Accounts & Data

The system comes preloaded with sample data so it can be tested immediately:

### Demo Logins:
| Role | Membership ID | Password | Notes |
| :--- | :--- | :--- | :--- |
| **Librarian** | `LIB-001` | `admin123` | Staff account |
| **Admin** | `ADM-100` | `admin123` | System Administrator |
| **Member** | `STU-101` | `student123` | Student reader |

*(You can also click the quick demo buttons on the Users page to log in instantly).*

---

## 4. How to Run the Project Locally

### Prerequisites
Make sure you have **Node.js** installed on your computer.

### Steps to Run:
1. Open your terminal or Command Prompt in the project folder:
   ```bash
   cd library-management-react
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open the displayed URL in your browser (usually `http://localhost:3000` or `http://localhost:5173`).

