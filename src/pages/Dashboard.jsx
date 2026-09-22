import React, { useState } from 'react';

// Dashboard component displaying system overview and book availability
function Dashboard({ books, transactions, users }) {
  // State for search filter
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate summary metrics
  const totalTitles = books.length;
  const totalCopies = books.reduce((sum, book) => sum + Number(book.quantity || 0), 0);
  const lowStockBooks = books.filter(book => Number(book.quantity) < 2);
  const totalTransactions = transactions.length;

  // Filter books based on search term
  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.genre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.isbn.includes(searchTerm)
  );

  return (
    <div>
      <div className="page-header">
        <h1>📊 Library Dashboard</h1>
        <p>Real-time overview of library book stock, availability, and alerts.</p>
      </div>

      {/* Summary Cards */}
      <div className="stats-grid">
        <div className="stat-card card-blue">
          <h3>Total Book Titles</h3>
          <div className="stat-number">{totalTitles}</div>
        </div>
        <div className="stat-card card-green">
          <h3>Total Copies in Stock</h3>
          <div className="stat-number">{totalCopies}</div>
        </div>
        <div className="stat-card card-amber">
          <h3>Low Stock Alert (&lt; 2 copies)</h3>
          <div className="stat-number" style={{ color: lowStockBooks.length > 0 ? '#ef4444' : '#10b981' }}>
            {lowStockBooks.length}
          </div>
        </div>
        <div className="stat-card card-purple">
          <h3>Total Transactions</h3>
          <div className="stat-number">{totalTransactions}</div>
        </div>
      </div>

      {/* Low stock alert banner if any book has low stock */}
      {lowStockBooks.length > 0 && (
        <div className="alert-box alert-error">
          <span>
            ⚠️ <strong>Attention:</strong> There are <strong>{lowStockBooks.length}</strong> books with low stock (fewer than 2 copies). Please check stock availability below or restock in the Transactions page.
          </span>
        </div>
      )}

      {/* Book Availability Table */}
      <div className="content-panel">
        <div className="panel-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <span>Current Book Availability</span>
          <span style={{ fontSize: '13px', color: '#64748b' }}>
            Showing {filteredBooks.length} of {books.length} books
          </span>
        </div>

        {/* Search Bar */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by title, author, genre, or ISBN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Genre</th>
                <th>ISBN</th>
                <th>Copies in Stock</th>
                <th>Availability Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
                    No books found matching "{searchTerm}".
                  </td>
                </tr>
              ) : (
                filteredBooks.map((book) => {
                  const qty = Number(book.quantity);
                  const isLowStock = qty < 2;

                  return (
                    <tr key={book.id} className={isLowStock ? 'row-low-stock' : ''}>
                      <td>
                        <strong>{book.title}</strong>
                        {isLowStock && (
                          <span style={{ color: '#ef4444', marginLeft: '6px', fontSize: '12px' }}>
                            (Low Stock!)
                          </span>
                        )}
                      </td>
                      <td>{book.author}</td>
                      <td>
                        <span className="badge badge-info">{book.genre}</span>
                      </td>
                      <td><code>{book.isbn}</code></td>
                      <td>
                        <strong style={{ fontSize: '16px' }}>{qty}</strong>
                      </td>
                      <td>
                        {qty === 0 ? (
                          <span className="badge badge-danger">Out of Stock</span>
                        ) : qty < 2 ? (
                          <span className="badge badge-danger">Low Stock (Only {qty})</span>
                        ) : (
                          <span className="badge badge-success">Available ({qty})</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
