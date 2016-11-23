const queryString = require('querystring');

exports.schema = {
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

exports.statics = {

    getAll: (callback) => {
        Item.find({})
            .select('_id category name inStock lowAt')
            .sort('category name')
            .exec((err, docs) => {
                handlers.onError(err);
                callback(docs)
            })
    },

    getCategories: (callback) => {
        Item.distinct('category', (err, categories) => {
            handlers.onError(err);
            if (callback !== undefined) callback(categories);
        })
    },

    get: (itemId, callback)  => {
        Item.findOne({ _id: itemId})
            .select('_id name inStock log')
            .exec((err, doc) => {
                handlers.onError(err);
                if (callback !== undefined) callback(doc)
            })
    },

    create: (string, callback) => {
        let item = queryString.parse(string);
        let newItem = new Item(item);
        console.log(item);
        newItem.save((err, insertedId) => {
            handlers.onError(err);
            Item
        })
    },

    push: (itemId, logObject, callback) => {
        Item.findOneAndUpdate(
            {name: itemName},
            {
                $inc: {inStock: logObject.added - logObject.removed},
                $push: {
                    log: logObject
                }
            },
            { upsert: true },
            (err, id) => {
                handlers.onError(err);
                if (callback !== undefined) callback(id)
            }
        )
    },

    remove: (itemId) => {
        Item.where({name: itemName})
            .remove((err) => { this.onError(err) })
    },

    onError: (err) => {
        if (err) {
            console.error(err.toString());
        }
    }
}
