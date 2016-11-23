exports.schema = {
    _id: Number,
    category: String,
    name: {type: String, unique: true},
    inStock: Number,
    lowAt: Number,
    log: [
        {
            added: Number,
            removed: Number,
            balance: Number,
        },
        {
            _id: false,
            timestamps: {
                createdAt: 'date',
                updatedAt: 'lastModified'
            }
        }
    ]
};
