
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// In-memory array
let books = [];

// Task 2: Add a new book - POST /api/books
app.post('/api/books', (req, res) => {

    const { id, title, author, category, quantity, available } = req.body;

    // Validate required fields
    if (id === undefined || !title || !author || !category ||
        quantity === undefined || available === undefined) {
        return res.status(400).json({
            message: 'All fields are required'
        });
    }

    // Validate quantity
    if (!Number.isInteger(quantity) || quantity < 0 ||
        !Number.isInteger(available) || available < 0 ||
        available > quantity) {
        return res.status(400).json({
            message: 'Invalid quantity values'
        });
    }

    // Check duplicate ID
    const existingBook = books.find(book => book.id === id);

    if (existingBook) {
        return res.status(400).json({
            message: 'Book ID already exists'
        });
    }

    // Store book
    const newBook = {
        id,
        title,
        author,
        category,
        quantity,
        available
    };

    books.push(newBook);

    res.status(201).json({
        message: 'Book added successfully',
        book: newBook
    });
});


// Task 3: Retrieve all books - GET /api/books
app.get('/api/books', (req, res) => {

    res.status(200).json(books);

});


// Task 3: Retrieve book by ID - GET /api/books/:id
app.get('/api/books/:id', (req, res) => {

    const book = books.find(b => String(b.id) === req.params.id);

    if (!book) {
        return res.status(404).json({
            message: 'Book not found'
        });
    }

    res.status(200).json(book);

});


// Task 4: Update book details - PUT /api/books/:id
app.put('/api/books/:id', (req, res) => {

    const book = books.find(b => String(b.id) === req.params.id);

    // Check if book exists
    if (!book) {
        return res.status(404).json({
            message: 'Book not found'
        });
    }

    // Prevent ID modification
    const { id, ...updates } = req.body;

    const allowedFields = [
        'title',
        'author',
        'category',
        'quantity',
        'available'
    ];

    // Check permitted fields
    for (let key of Object.keys(updates)) {
        if (!allowedFields.includes(key)) {
            return res.status(400).json({
                message: 'Invalid field: ' + key
            });
        }
    }

    // Validate quantity
    const quantity = updates.quantity ?? book.quantity;
    const available = updates.available ?? book.available;

    if (!Number.isInteger(quantity) || quantity < 0 ||
        !Number.isInteger(available) || available < 0 ||
        available > quantity) {
        return res.status(400).json({
            message: 'Invalid quantity values'
        });
    }

    // Update book
    Object.assign(book, updates);

    res.status(200).json({
        message: 'Book updated successfully',
        book: book
    });

});


// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
