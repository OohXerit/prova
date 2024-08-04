const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { SECRET_KEY } = require('../authMiddleware');

// In un'applicazione reale, questi dati sarebbero memorizzati in un database
const users = [
    {
        id: 1,
        username: 'admin',
        password: bcrypt.hashSync('password', 10)
    }
];

exports.login = async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);

    if (user && bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
};