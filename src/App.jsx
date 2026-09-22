import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import BookManagement from './pages/BookManagement';
import Transactions from './pages/Transactions';
import UserManagement from './pages/UserManagement';
import { initialBooks, initialUsers, initialTransactions } from './data/initialData';
import './App.css';

function App() {
  // 1. React Hook: useState for Books (loads from localStorage or uses default initialBooks)
  const [books, setBooks] = useState(() => {
    const saved = localStorage.getItem('library_books');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing books from localStorage', e);
      }
    }
    return initialBooks;
  });

  // 2. React Hook: useState for Transactions history
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('library_transactions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing transactions from localStorage', e);
      }
    }
    return initialTransactions;
  });

  // 3. React Hook: useState for Users list
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('library_users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing users from localStorage', e);
      }
    }
    return initialUsers;
  });

  // 4. React Hook: useState for Active/Logged In User
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('library_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing currentUser from localStorage', e);
      }
    }
    // Default logged-in user is Sarah Mofolo (Librarian) for easy testing
    return initialUsers[0];
  });

  // 5. React Hook: useEffect for syncing Books to localStorage
  useEffect(() => {
    localStorage.setItem('library_books', JSON.stringify(books));
  }, [books]);

  // 6. React Hook: useEffect for syncing Transactions to localStorage
  useEffect(() => {
    localStorage.setItem('library_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // 7. React Hook: useEffect for syncing Users to localStorage
  useEffect(() => {
    localStorage.setItem('library_users', JSON.stringify(users));
  }, [users]);

  // 8. React Hook: useEffect for syncing Current User session to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('library_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('library_current_user');
    }
  }, [currentUser]);

  // --- BOOK ACTIONS ---
  // Add a new book
  const handleAddBook = (newBook) => {
    setBooks((prev) => [newBook, ...prev]);
  };

  // Update an existing book
  const handleUpdateBook = (updatedBook) => {
    setBooks((prev) =>
      prev.map((b) => (b.id === updatedBook.id ? updatedBook : b))
    );
  };

  // Delete a book
  const handleDeleteBook = (bookId) => {
    setBooks((prev) => prev.filter((b) => b.id !== bookId));
  };

  // --- TRANSACTION ACTIONS (Stock management) ---
  const handleRecordTransaction = (txn) => {
    // 1. Add to transactions list
    setTransactions((prev) => [txn, ...prev]);

    // 2. Adjust book quantity in stock
    setBooks((prevBooks) =>
      prevBooks.map((book) => {
        if (book.id === txn.bookId || book.title === txn.bookTitle) {
          const currentQty = Number(book.quantity || 0);
          const changeQty = Number(txn.quantity || 0);
          const newQty =
            txn.type === 'Borrow'
              ? Math.max(0, currentQty - changeQty)
              : currentQty + changeQty;

          return {
            ...book,
            quantity: newQty
          };
        }
        return book;
      })
    );
  };

  // --- USER ACTIONS ---
  const handleLogin = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleAddUser = (newUser) => {
    setUsers((prev) => [...prev, newUser]);
  };

  const handleUpdateUser = (updatedUser) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
    if (currentUser && currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
  };

  const handleDeleteUser = (userId) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  return (
    <BrowserRouter>
      <div className="app-layout">
        {/* Navigation Bar */}
        <Navbar currentUser={currentUser} onLogout={handleLogout} />

        {/* Main Routed Page Content */}
        <main className="main-content">
          <Routes>
            <Route
              path="/"
              element={
                <Dashboard
                  books={books}
                  transactions={transactions}
                  users={users}
                />
              }
            />
            <Route
              path="/books"
              element={
                <BookManagement
                  books={books}
                  onAddBook={handleAddBook}
                  onUpdateBook={handleUpdateBook}
                  onDeleteBook={handleDeleteBook}
                />
              }
            />
            <Route
              path="/transactions"
              element={
                <Transactions
                  books={books}
                  transactions={transactions}
                  onRecordTransaction={handleRecordTransaction}
                  currentUser={currentUser}
                />
              }
            />
            <Route
              path="/users"
              element={
                <UserManagement
                  users={users}
                  currentUser={currentUser}
                  onLogin={handleLogin}
                  onLogout={handleLogout}
                  onAddUser={handleAddUser}
                  onUpdateUser={handleUpdateUser}
                  onDeleteUser={handleDeleteUser}
                />
              }
            />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
