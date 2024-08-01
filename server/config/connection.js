const mongoose = require('mongoose');

// MONGODB_URI is from MongoDB Atlas and set in Render as environment variable
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/googlebooks');

module.exports = mongoose.connection;
