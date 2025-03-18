const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(cors());

// Secret key for JWT
const JWT_SECRET = 'your-secret-key';

// In-memory database for users and events
let users = [];
let events = [];

// Middleware to authenticate JWT
const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'Access denied' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
    });
};

// User Registration
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (users.find(user => user.username === username)) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const user = { username, password };
    users.push(user);
    res.status(201).json({ message: 'User registered successfully' });
});

// User Login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username && user.password === password);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});

// Create Event
app.post('/events', authenticateJWT, (req, res) => {
    const { name, description, date, time, category } = req.body;
    const event = {
        id: events.length + 1,
        username: req.user.username,
        name,
        description,
        date,
        time,
        category,
    };
    events.push(event);
    res.status(201).json({ message: 'Event created successfully', event });
});

// View Events
app.get('/events', authenticateJWT, (req, res) => {
    const userEvents = events.filter(event => event.username === req.user.username);
    res.json(userEvents);
});

// View Events by Category
app.get('/events/category/:category', authenticateJWT, (req, res) => {
    const { category } = req.params;
    const userEvents = events.filter(
        event => event.username === req.user.username && event.category === category
    );
    res.json(userEvents);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});