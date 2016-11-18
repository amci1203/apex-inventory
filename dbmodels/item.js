const mongoose = require('mongoose');

let schema = new mongoose.Schema({
    category: String,
    name: {type: String, unique: true},
    inStock: Number,
    lowAt: Number,
    log: [
        {
            added: Number,
            removed: Number
        },
        {
            timestamps: {
                createdAt: 'date',
                updatedAt: 'lastModified'
            }
        }
    ]
});

module.exports = mongoose.model('Item', schema)
