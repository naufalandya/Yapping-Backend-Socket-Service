'use strict'

const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET_KEY

const verifyToken = (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
        return res.status(401).json({
            status: false,
            message: 'Token tidak disediakan!',
            data: null
        });
    }

    const token = authorization.split(' ')[1];

    // Verifikasi token dengan algoritma HS512
    jwt.verify(token, SECRET_KEY, { algorithms: ['HS512'] }, (err, decoded) => {
        if (err) {
            return res.status(401).json({ 
                status: false,
                message: 'Gagal mengautentikasi token',
                data: null 
            });
        }

        console.log(decoded)

        req.token = token;
        req.user = decoded;
        next();
    });
};

module.exports = { verifyToken }