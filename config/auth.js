require('dotenv').config();
module.exports = {
    secret: process.env.AUTH_SECRET || 'zA23RtfLoPP', //KEY TO ENCRYPT
    expires: process.env.AUTH_EXPIRES || '24h', //TOKEN EXPIRATION TIME
    rounds: process.env.AUTH_ROUNDS || 10, //TIMES THE PASS WILL BE ENCRYPTED
};
