// Import Yarn
const mongoose = require('mongoose');

// Build schema
const Schema = mongoose.Schema;
const MessageSchema = new Schema({
    author: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
});

// export
module.exports = mongoose.model('Message', MessageSchema);