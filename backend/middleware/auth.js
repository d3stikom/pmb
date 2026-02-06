const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    const bearerToken = token.split(' ')[1]; // Bearer <token>

    if (!bearerToken) {
        return res.status(403).json({ message: 'Invalid token format' });
    }

    jwt.verify(bearerToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.userId = decoded.id;
        req.userRole = decoded.role;
        req.studyProgramId = decoded.studyProgramId; // Add this if needed for PRODI filters
        next();
    });
};

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.userRole)) {
            return res.status(403).json({ message: `Access denied. Requires one of these roles: ${roles.join(', ')}` });
        }
        next();
    };
};

module.exports = { verifyToken, authorizeRoles };
