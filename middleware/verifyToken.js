// middleware/verifyToken.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'queenoftears'; // Replace with your actual secret

function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (token == null) return res.sendStatus(401); // No token

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Invalid toke
        req.user = user; // Attach user information 
        next(); 
    });
}

module.exports = verifyToken;
