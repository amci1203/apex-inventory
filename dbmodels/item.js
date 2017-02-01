const mongoose = require('mongoose');

let subSchema = new mongoose.Schema(
    {
        added    : {type: Number, default: 0},
        removed  : {type: Number, default: 0},
        balance  : {type: Number, default: 0},
        comments : {type: String, trim: true, maxlength: 140 }
    },
    {
        timestamps: {
            createdAt : 'date',
            updatedAt : 'lastModified'
        }
    }
)

let schema = new mongoose.Schema(
    {
        category : String,
        name     : {type: String, unique: true},
        inStock  : Number,
        lowAt    : Number,
        log      : [ subSchema ]
    },
    {
        timestamps: {
            createdAt: 'date',
            updatedAt: 'lastModified'
        }
    }
);

schema.statics.getAll = function (callback) {
    return this.aggregate(
        [
            {$project: {
                _id          : 1,
                category     : 1,
                name         : 1,
                inStock      : 1,
                lowAt        : 1,
                lastModified : 1
            }},
            {$group: {
                _id: '$category',
                items: {$push: {
                    _id          : '$_id',
                    name         : '$name',
                    inStock      : '$inStock',
                    lowAt        : '$lowAt',
                    lastModified : '$lastModified'
                }}
            }},
            {$sort: {_id: 1}}
        ], (err, result) => callback(result) );
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
    if (direction == 'next') {
        query = {name: {$gt: escapedName}};
        sort  = {name: 1}
    }
    else if (direction == 'prev') {
        query = {name: {$lt: escapedName}};
        sort  = {name: -1}
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
    return this.findOneAndUpdate({_id: itemId}, data, {upsert: false},
        (err, numAffected) => {
            onError(err)
            if (callback !== undefined) callback(numAffected)
        }
    )
}

schema.statics.editItemLog = function (itemId, logId, newLog, callback) {
    let update = {};
    if (newLog.hasOwnProperty('comments'))  {
        update = {
            $set: {
                "log.$.comments": newLog.comments
            }
        }
    } else {
        update = {
            $set: {
                "inStock"       : newLog.stockBalance,
                "log.$.added"   : newLog.added,
                "log.$.removed" : newLog.removed
            },
            $inc: {"log.$.balance" : newLog.logBalance}
        }
    }
    return this.update(
        {
            "_id"     : itemId,
            "log._id" : logId
        }, update, { upsert : false },
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

schema.statics.getRecordsForDate = function (dateString, callback) {
    let d1 = new Date(dateString),
        d2 = new Date(dateString);
    
    d1.setHours(0);
    d1.setMinutes(0);
    d1.setSeconds(0);
    
    d2.setHours(23);
    d2.setMinutes(59);
    d2.setSeconds(59);
    
    d1 = d1.getUTCMilliseconds();
    d2 = d2.getUTCMilliseconds();
    
    return this.aggregate(
        [
            {$project: {
                name     : 1,
                category : 1,
                log      : 1
            }},
            {$group: {
                _id: '$category',
                items: {$push: {
                    name : '$name',
//                    log  : '$log'
                    log  : {
                        $filter: {
                            input : '$log',
                            as    : 'log',
//                            cond  : {'$lte' : ['$log.date', d1]}
                            cond  : {$and: [ 
                                {$gte: ['$log.date', d1]},
                                {$lte: ['$log.date', d2]}
                            ]}
                        }
                    }
                }}
            }},
            {$sort: {_id: 1}}
        ], (err, result) => {
            onError(err);
            callback(result); 
        }
    )
}

module.exports = mongoose.model('Item', schema)

const onError = (err) => {
    if (err) {
        console.error(err.toString());
    }
}
