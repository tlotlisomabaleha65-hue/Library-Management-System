import React, { useState } from 'react';

// BookManagement component handles Adding, Updating, and Deleting books
function BookManagement({ books, onAddBook, onUpdateBook, onDeleteBook }) {
  // Form state for controlled inputs
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    isbn: '',
    quantity: ''
  });

  // State to track if we are editing an existing book
  const [editingBookId, setEditingBookId] = useState(null);

  // State for success/error feedback banner
  const [feedback, setFeedback] = useState(null);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission (Add or Update)
  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic form validation
    if (!formData.title.trim() || !formData.author.trim() || !formData.isbn.trim()) {
      setFeedback({ type: 'error', text: 'Please fill in Title, Author, and ISBN.' });
      return;
    }

    const qty = parseInt(formData.quantity, 10);
    if (isNaN(qty) || qty < 0) {
      setFeedback({ type: 'error', text: 'Initial quantity must be a non-negative number (0 or more).' });
      return;
    }

    if (editingBookId) {
      // Update existing book
      onUpdateBook({
        id: editingBookId,
        title: formData.title.trim(),
        author: formData.author.trim(),
        genre: formData.genre.trim() || 'General',
        isbn: formData.isbn.trim(),
        quantity: qty
      });
      setFeedback({ type: 'success', text: `Book "${formData.title}" was updated successfully!` });
      resetForm();
    } else {
      // Add new book
      const newBook = {
        id: Date.now().toString(), // Simple unique ID
        title: formData.title.trim(),
        author: formData.author.trim(),
        genre: formData.genre.trim() || 'General',
        isbn: formData.isbn.trim(),
        quantity: qty
      };
      onAddBook(newBook);
      setFeedback({ type: 'success', text: `Book "${newBook.title}" added to the library!` });
      resetForm();
    }
  };

  // Start editing a book
  const startEdit = (book) => {
    setEditingBookId(book.id);
    setFormData({
      title: book.title,
      author: book.author,
      genre: book.genre,
      isbn: book.isbn,
      quantity: book.quantity.toString()
    });
    setFeedback({ type: 'info', text: `Editing book "${book.title}". Modify details below and click "Save Changes".` });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cancel edit mode
  const resetForm = () => {
    setEditingBookId(null);
    setFormData({
      title: '',
      author: '',
      genre: '',
      isbn: '',
      quantity: ''
    });
  };

  // Handle book deletion with confirmation
  const handleDelete = (book) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${book.title}"? This cannot be undone.`);
    if (confirmDelete) {
      onDeleteBook(book.id);
      if (editingBookId === book.id) {
        resetForm();
      }
      setFeedback({ type: 'success', text: `Book "${book.title}" was removed from the library.` });
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>📖 Book Management</h1>
        <p>Add new books to the catalog, update existing details, or remove books.</p>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div className={`alert-box ${feedback.type === 'error' ? 'alert-error' : 'alert-success'}`}>
          <span>{feedback.text}</span>
          <button
            onClick={() => setFeedback(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Book Form (Add / Edit) */}
      <div className="content-panel">
        <h2 className="panel-title">
          {editingBookId ? '✏️ Edit Book Details' : '➕ Add New Book'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Book Title *</label>
              <input
                type="text"
                name="title"
                placeholder="e.g., The Catcher in the Rye"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Author *</label>
              <input
                type="text"
                name="author"
                placeholder="e.g., J.D. Salinger"
                value={formData.author}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Genre / Category</label>
              <input
                type="text"
                name="genre"
                placeholder="e.g., Fiction, Classic, Science"
                value={formData.genre}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>ISBN *</label>
              <input
                type="text"
                name="isbn"
                placeholder="e.g., 978-0-316-76948-0"
                value={formData.isbn}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Quantity in Stock *</label>
              <input
                type="number"
                name="quantity"
                min="0"
                placeholder="e.g., 5"
                value={formData.quantity}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className={editingBookId ? 'btn btn-warning' : 'btn btn-primary'}>
              {editingBookId ? '💾 Save Changes' : '➕ Add Book'}
            </button>
            {editingBookId && (
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Book List Table */}
      <div className="content-panel">
        <h2 className="panel-title">📚 All Library Books ({books.length})</h2>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Genre</th>
                <th>ISBN</th>
                <th>Stock</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
                    No books in the library yet. Use the form above to add your first book.
                  </td>
                </tr>
              ) : (
                books.map((book) => (
                  <tr key={book.id}>
                    <td><strong>{book.title}</strong></td>
                    <td>{book.author}</td>
                    <td><span className="badge badge-info">{book.genre}</span></td>
                    <td><code>{book.isbn}</code></td>
                    <td>
                      <span className={Number(book.quantity) < 2 ? 'badge badge-danger' : 'badge badge-success'}>
                        {book.quantity} copies
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        className="btn btn-warning btn-sm"
                        style={{ marginRight: '8px' }}
                        onClick={() => startEdit(book)}
                      >
                        Update
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(book)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default BookManagement;
