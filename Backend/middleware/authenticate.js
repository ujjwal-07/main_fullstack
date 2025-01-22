const jwt = require('jsonwebtoken');

// Middleware to authenticate JWT
const authenticate = (req, res, next) => {
    const token = req.cookies.authToken;  // Retrieve token from cookies

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;  // Attach user info to request object
        next();  // Proceed to the next route or middleware
    } catch (err) {
        res.status(400).json({ message: 'Invalid or expired token' });
    }
};

module.exports = authenticate;
