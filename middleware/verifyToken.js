const jwt = require('jsonwebtoken');
const dotEnv = require('dotenv');
dotEnv.config();

const verifyToken = (req, res, next) => {
    // Get token from authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send({ message: 'Authorization token is required', success: false });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    try {
        const decoded = jwt.verify(token, process.env.TOKEN_KEY);
        req.user = decoded; // Add decoded user to request object
        next();
    } catch (error) {
        return res.status(401).send({ message: 'Invalid token', success: false });
    }
};

module.exports = verifyToken;
