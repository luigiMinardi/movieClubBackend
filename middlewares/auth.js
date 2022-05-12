const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');

module.exports = (req, res, next) => {
    // If you have the token
    if (!req.headers.authorization) {
        res.status(401).json({ msg: 'Unauthorized.' });
    } else {
        // Remove the "Bearer " from the token (Below I have a comment explaining better)
        let token = req.headers.authorization.split(' ')[1];

        // Check if token is valid
        jwt.verify(token, authConfig.secret, (err, decoded) => {
            if (err) {
                res.status(500).json({ msg: 'Token error', err });
            } else {
                req.user = decoded;
                next();
            }
        });
    }
};

/*
token -> Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxMCwibmFtZSI6IkphaXIiLCJhZ2UiOjE5LCJzdXJuYW1lIjoiRGEgU2lsdmEiLCJlbWFpbCI6Imphc2FvQGdtYWlsLmNvbSIsIm5pY2tuYW1lIjoiSmFzaXIiLCJwYXNzd29yZCI6IiQyYiQxMCRrNGxuY3hkY0QxdFZHWTRKR01kQmMuR3ovTEYyRVpvYjBHakpiSzZ3Ry5KcU5ValpjV2xWZSIsImNyZWF0ZWRBdCI6IjIwMjItMDItMjJUMTQ6MzM6MDcuMDAwWiIsInVwZGF0ZWRBdCI6IjIwMjItMDItMjJUMTQ6MzM6MDcuMDAwWiJ9LCJpYXQiOjE2NDU1NDE1MjEsImV4cCI6MTY0NTYyNzkyMX0.4fYND8V8cX7k2i3FHZui8Ff8ojbqmioDgmuXcr5ov7k
token after split -> ["Bearer", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxMCwibmFtZSI6IkphaXIiLCJhZ2UiOjE5LCJzdXJuYW1lIjoiRGEgU2lsdmEiLCJlbWFpbCI6Imphc2FvQGdtYWlsLmNvbSIsIm5pY2tuYW1lIjoiSmFzaXIiLCJwYXNzd29yZCI6IiQyYiQxMCRrNGxuY3hkY0QxdFZHWTRKR01kQmMuR3ovTEYyRVpvYjBHakpiSzZ3Ry5KcU5ValpjV2xWZSIsImNyZWF0ZWRBdCI6IjIwMjItMDItMjJUMTQ6MzM6MDcuMDAwWiIsInVwZGF0ZWRBdCI6IjIwMjItMDItMjJUMTQ6MzM6MDcuMDAwWiJ9LCJpYXQiOjE2NDU1NDE1MjEsImV4cCI6MTY0NTYyNzkyMX0.4fYND8V8cX7k2i3FHZui8Ff8ojbqmioDgmuXcr5ov7k"]
token[1] -> "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxMCwibmFtZSI6IkphaXIiLCJhZ2UiOjE5LCJzdXJuYW1lIjoiRGEgU2lsdmEiLCJlbWFpbCI6Imphc2FvQGdtYWlsLmNvbSIsIm5pY2tuYW1lIjoiSmFzaXIiLCJwYXNzd29yZCI6IiQyYiQxMCRrNGxuY3hkY0QxdFZHWTRKR01kQmMuR3ovTEYyRVpvYjBHakpiSzZ3Ry5KcU5ValpjV2xWZSIsImNyZWF0ZWRBdCI6IjIwMjItMDItMjJUMTQ6MzM6MDcuMDAwWiIsInVwZGF0ZWRBdCI6IjIwMjItMDItMjJUMTQ6MzM6MDcuMDAwWiJ9LCJpYXQiOjE2NDU1NDE1MjEsImV4cCI6MTY0NTYyNzkyMX0.4fYND8V8cX7k2i3FHZui8Ff8ojbqmioDgmuXcr5ov7k"
*/
