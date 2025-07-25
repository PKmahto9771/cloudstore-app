const jwt = require('jsonwebtoken');

const checkAuth = (req, res, next) =>{
    console.log('Cookies:', req.cookies);
    const token = req.cookies?.uid;
    console.log('🔐 Authentication check for:', req.method, req.path);
    
    if(!token){
        console.warn('⚠️ No authentication token found');
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    
    try{
        console.log('🔍 Verifying JWT token...');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        console.log('✅ Authentication successful for user:', decoded._id);
        next();
    }
    catch(err){
        console.error('❌ JWT verification failed:', {
            error: err.message,
            path: req.path,
            hasSecret: !!process.env.JWT_SECRET
        });
        return res.status(400).json({ message: 'Invalid token.' });
    }
}

module.exports = checkAuth;