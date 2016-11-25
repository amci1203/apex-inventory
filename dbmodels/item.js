exports.schema = {
    _id: Number,
    category: String,
    name: {type: String, unique: true},
    inStock: Number,
    lowAt: Number,
    log: [
        {
            _id: Number,
            date: { type: Date, default: new Date().toDateString() },
            added: { type:Number, default: 0 },
            removed: { type:Number, default: 0 }
        }
    ]
};
