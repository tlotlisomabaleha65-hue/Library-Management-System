import React, { useState } from 'react';

// Transactions component for stock management (add stock / borrow) and transaction history
function Transactions({ books, transactions, onRecordTransaction, currentUser }) {
  // Form state
  const [selectedBookId, setSelectedBookId] = useState(books[0]?.id || '');
  const [transactionType, setTransactionType] = useState('Borrow'); // 'Borrow' or 'Add Stock'
  const [quantity, setQuantity] = useState(1);
  const [memberName, setMemberName] = useState(currentUser ? `${currentUser.name} (${currentUser.membershipId})` : '');
  const [notes, setNotes] = useState('');
  const [feedback, setFeedback] = useState(null);

  // Selected book details
  const selectedBook = books.find((b) => b.id === selectedBookId);

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedBook) {
      setFeedback({ type: 'error', text: 'Please select a book.' });
      return;
    }

    const qtyNumber = parseInt(quantity, 10);
    if (isNaN(qtyNumber) || qtyNumber <= 0) {
      setFeedback({ type: 'error', text: 'Please enter a valid quantity greater than 0.' });
      return;
    }

    if (!memberName.trim()) {
      setFeedback({ type: 'error', text: 'Please enter the member or librarian name.' });
      return;
    }

    // Check stock if borrowing
    if (transactionType === 'Borrow') {
      if (selectedBook.quantity < qtyNumber) {
        setFeedback({
          type: 'error',
          text: `Cannot borrow ${qtyNumber} copies! Only ${selectedBook.quantity} copies are available in stock.`
        });
        return;
      }
    }

    // Now execute transaction
    const now = new Date();
    const formattedDate = now.toISOString().slice(0, 16).replace('T', ' ');

    const newTxn = {
      id: `TXN-${Date.now().toString().slice(-5)}`,
      date: formattedDate,
      bookId: selectedBook.id,
      bookTitle: selectedBook.title,
      type: transactionType,
      quantity: qtyNumber,
      member: memberName.trim(),
      notes: notes.trim() || (transactionType === 'Borrow' ? 'Regular book borrow' : 'Stock replenishment')
    };

    onRecordTransaction(newTxn);

    setFeedback({
      type: 'success',
      text: transactionType === 'Borrow'
        ? `Successfully borrowed ${qtyNumber} copy/copies of "${selectedBook.title}". Remaining stock: ${selectedBook.quantity - qtyNumber}.`
        : `Successfully added ${qtyNumber} copy/copies to "${selectedBook.title}". New stock: ${selectedBook.quantity + qtyNumber}.`
    });

    // Reset inputs
    setQuantity(1);
    setNotes('');
  };

  // Quick Action Handler (Borrow 1 or Add 1 directly)
  const handleQuickAction = (book, actionType) => {
    if (actionType === 'Borrow' && book.quantity <= 0) {
      setFeedback({ type: 'error', text: `Cannot borrow "${book.title}" because it is out of stock.` });
      return;
    }

    const now = new Date();
    const formattedDate = now.toISOString().slice(0, 16).replace('T', ' ');

    const newTxn = {
      id: `TXN-${Date.now().toString().slice(-5)}`,
      date: formattedDate,
      bookId: book.id,
      bookTitle: book.title,
      type: actionType,
      quantity: 1,
      member: currentUser ? `${currentUser.name} (${currentUser.membershipId})` : 'Quick Action',
      notes: actionType === 'Borrow' ? 'Quick 1-copy borrow' : 'Quick 1-copy restock'
    };

    onRecordTransaction(newTxn);

    setFeedback({
      type: 'success',
      text: actionType === 'Borrow'
        ? `Borrowed 1 copy of "${book.title}".`
        : `Added 1 copy to "${book.title}".`
    });
  };

  return (
    <div>
      <div className="page-header">
        <h1>🔄 Stock & Availability Transactions</h1>
        <p>Record book borrowing, add new stock shipments, and track inventory history.</p>
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

      {/* Transaction Form Panel */}
      <div className="content-panel">
        <h2 className="panel-title">📝 Record New Stock Transaction</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Select Book *</label>
              <select
                value={selectedBookId}
                onChange={(e) => setSelectedBookId(e.target.value)}
                required
              >
                {books.map((book) => (
                  <option key={book.id} value={book.id}>
                    {book.title} (In Stock: {book.quantity})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Transaction Type *</label>
              <select
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value)}
                required
              >
                <option value="Borrow">Borrow Book (Deduct Stock)</option>
                <option value="Add Stock">Add Stock (Restock Books)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Quantity *</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Member / Librarian Name *</label>
              <input
                type="text"
                placeholder="e.g., Kabelo Thabane (STU-101)"
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label>Transaction Notes / Reason</label>
              <input
                type="text"
                placeholder="e.g., Assigned for semester project / Received new shipment"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className={transactionType === 'Borrow' ? 'btn btn-primary' : 'btn btn-success'}
            >
              {transactionType === 'Borrow' ? '📤 Confirm Book Borrow' : '📥 Confirm Stock Addition'}
            </button>
          </div>
        </form>
      </div>

      {/* Quick Stock Controls Panel */}
      <div className="content-panel">
        <h2 className="panel-title">⚡ Quick Stock Actions</h2>
        <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '15px' }}>
          Use these quick buttons to instantly borrow or restock 1 copy of any book.
        </p>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Book Title</th>
                <th>Author</th>
                <th>Current Stock</th>
                <th style={{ textAlign: 'center' }}>Quick Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => {
                const qty = Number(book.quantity);
                const isLow = qty < 2;
                return (
                  <tr key={book.id} className={isLow ? 'row-low-stock' : ''}>
                    <td>
                      <strong>{book.title}</strong>
                      {isLow && <span style={{ color: '#ef4444', fontSize: '12px' }}> (Low)</span>}
                    </td>
                    <td>{book.author}</td>
                    <td>
                      <span className={isLow ? 'badge badge-danger' : 'badge badge-success'}>
                        {qty} in stock
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        className="btn btn-warning btn-sm"
                        style={{ marginRight: '8px' }}
                        onClick={() => handleQuickAction(book, 'Borrow')}
                        disabled={qty <= 0}
                      >
                        📤 Borrow ( -1 )
                      </button>
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleQuickAction(book, 'Add Stock')}
                      >
                        📥 Restock ( +1 )
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction History Log */}
      <div className="content-panel">
        <h2 className="panel-title">📋 Transaction History Log ({transactions.length})</h2>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Txn ID</th>
                <th>Date & Time</th>
                <th>Book Title</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Member / User</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
                    No transactions recorded yet.
                  </td>
                </tr>
              ) : (
                transactions.map((txn) => (
                  <tr key={txn.id}>
                    <td><code>{txn.id}</code></td>
                    <td>{txn.date}</td>
                    <td><strong>{txn.bookTitle}</strong></td>
                    <td>
                      <span className={txn.type === 'Borrow' ? 'badge badge-warning' : 'badge badge-success'}>
                        {txn.type === 'Borrow' ? '📤 Borrowed' : '📥 Stock Added'}
                      </span>
                    </td>
                    <td><strong>{txn.quantity}</strong></td>
                    <td>{txn.member}</td>
                    <td style={{ color: '#64748b', fontSize: '13px' }}>{txn.notes}</td>
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

export default Transactions;
