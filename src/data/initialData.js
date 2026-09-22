// Default sample data for the Library Management System
// This data is loaded into localStorage when the app runs for the first time

export const initialBooks = [
  {
    id: '1',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    genre: 'Fiction',
    isbn: '978-0-06-112008-4',
    quantity: 4
  },
  {
    id: '2',
    title: '1984',
    author: 'George Orwell',
    genre: 'Dystopian',
    isbn: '978-0-452-28423-4',
    quantity: 1 // Low stock: < 2 copies
  },
  {
    id: '3',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    genre: 'Classic',
    isbn: '978-0-7432-7356-5',
    quantity: 5
  },
  {
    id: '4',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    genre: 'Technology',
    isbn: '978-0-13-235088-4',
    quantity: 2
  },
  {
    id: '5',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    genre: 'Romance',
    isbn: '978-0-14-143951-8',
    quantity: 0 // Out of stock / Low stock
  }
];

export const initialUsers = [
  {
    id: '1',
    membershipId: 'LIB-001',
    name: 'Sarah Mofolo',
    role: 'Librarian',
    password: 'admin123'
  },
  {
    id: '2',
    membershipId: 'ADM-100',
    name: 'System Admin',
    role: 'Admin',
    password: 'admin123'
  },
  {
    id: '3',
    membershipId: 'STU-101',
    name: 'Kabelo Thabane',
    role: 'Member',
    password: 'student123'
  }
];

export const initialTransactions = [
  {
    id: 'TXN-101',
    date: '2026-09-20 10:15',
    bookTitle: '1984',
    type: 'Borrow',
    quantity: 1,
    member: 'Kabelo Thabane (STU-101)',
    notes: 'Borrowed for class reading'
  },
  {
    id: 'TXN-102',
    date: '2026-09-21 14:30',
    bookTitle: 'The Great Gatsby',
    type: 'Add Stock',
    quantity: 3,
    member: 'Sarah Mofolo (LIB-001)',
    notes: 'New copies received from community donation'
  }
];
