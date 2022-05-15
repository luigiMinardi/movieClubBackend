const db = require('./db.js');
const PORT = process.env.PORT || 3000;
const app = require('./server');

db.then(() => {
    app.listen(PORT, () => console.log(`Server on port ${PORT}`)); // Connected to the db
}).catch((err) => console.log(err.message));
