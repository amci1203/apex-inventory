const mongoose = require('mongoose');

let subSchema = new mongoose.Schema(
    {
        added:   {type: Number, default: 0},
        removed: {type: Number, default: 0},
        comments: String
    },
    {
        timestamps: {
            createdAt: 'date',
            updatedAt: 'lastModified'
        }
    }
)

let schema = new mongoose.Schema({
    category: String,
    name: {type: String, unique: true},
    inStock: Number,
    lowAt: Number,
    log: [ subSchema ]
});

schema.statics.getAll = function (callback) {
    return this.find({})
        .select('_id category name inStock lowAt')
        .sort('category name')
        .exec((err, docs) => {
            onError(err);
            callback(docs)
        })
}

schema.statics.getCategories = function (callback) {
    return this.distinct('category', (err, categories) => {
        onError(err);
        if (callback !== undefined) callback(categories);
    })
}

schema.statics.get = function (itemId, callback) {
    return this.findOne({ _id: itemId})
        .select('_id category name inStock log')
        .sort('date')
        .exec((err, doc) => {
            onError(err);
            if (callback !== undefined) callback(doc)
        })
}

schema.statics.getCurrentCategory = function (category, callback) {
    return this.find({category: category})
        .select('_id name')
        .sort('name')
        .exec((err, docs) => {
            onError(err);
            if (callback !== undefined) callback(docs)
        })
}

schema.statics.getAdjacent = function (itemName, direction, callback) {
    let query = {}, sort = {};
    let escapedName = itemName.replace('%20', ' ');
    if (direction === 'next') {
        query = {name: {$gt: escapedName}};
        sort = {name: 1}
    }
    else if (direction === 'prev') {
        query = {name: {$lt: escapedName}};
        sort = {name: -1}
    }
    else {
        rest.status(401).send('Unknown paramater for direction.');
    }
    return this.findOne(query)
        .select('_id category name inStock log')
        .sort(sort)
        .exec((err, doc) => {
            onError(err);
            console.log(doc);
            if (callback !== undefined) callback(doc)
        })
}

schema.statics.create = function (item, callback) {
    item.log = [{added: item.inStock, comments: `Added ${item.name} to inventory`}];
    let newItem = new this(item);
    return newItem.save((err, insertedId) => {
        onError(err);
        if (callback !== undefined) callback(newItem)
    })
}

schema.statics.push = function (isById, item, logObject, callback) {
    let query = isById ? {_id: item}  :  {name: item},
        balance = logObject.added - logObject.removed;
    return this.findOneAndUpdate(
        query,
        {
            $inc:  { inStock: balance },
            $push: { log: logObject   }
        },
        { upsert: true },
        (err, id) => {
            onError(err);
            if (callback !== undefined) callback(id)
        }
    )
}

schema.statics.editItem = function (itemId, data, callback) {
    return this.update({_id: itemId}, data, {upsert: false},
        (err, numAffected) => {
            onError(err)
            if (callback !== undefined) callback(numAffected)
        }
    )
}

schema.statics.editItemLog = function (itemId, logId, newLog, callback) {
    return this.update(
        {
            "_id": itemId,
            "log._id": logId
        },
        {$set : { "log.$": newLog }},
        {upsert: false},
        (err, numAffected) => {
            onError(err)
            if (callback !== undefined) callback(numAffected)
        }
    )
}

schema.statics.remove = function (itemId, callback) {
    return this.where({_id: itemId}).remove((err, removedId) => {
        onError(err);
        if (callback !== undefined) callback(removedId)
    })
}

module.exports = mongoose.model('Item', schema)

const onError = (err) => {
    if (err) {
        console.error(err.toString());
    }
}
