const mongoose = require('mongoose');

const subSchema = new mongoose.Schema({
        date     : {type: String, unique: true},
        added    : {type: Number, default: 0},
        removed  : {type: Number, default: 0},
        balance  : {type: Number, default: 0},
        comments : {type: String, trim: true, maxlength: 140 }
})

const schema = new mongoose.Schema({
        name     : {type: String, trim: true, unique: true},
        category : {type: String, trim: true, unique: false},
        inStock  : Number,
        lowAt    : Number,
        log      : [ subSchema ]
    }, {
        timestamps: {
            createdAt: 'date',
            updatedAt: 'lastModified'
        }
    }
);

schema.statics.getAll = function (callback) {
    return this.aggregate([
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
    ], (err, result) => callback(err, result) 
)}

schema.statics.getCategories = function (callback) {
    return this.distinct('category', (err, categories) => {
        isError(err);
        if (callback !== undefined) callback(err, categories);
    })
}

schema.statics.get = function (itemId, callback) {
    return this.findOne({ _id: itemId})
        .select('_id category name inStock log')
        .sort('log.date')
        .exec((err, doc) => {
            isError(err);
            if (callback !== undefined) callback(err, doc)
        })
}

schema.statics.getCurrentCategory = function (category, callback) {
    return this.find({category: category})
        .select('_id name')
        .sort('name')
        .exec((err, docs) => {
            isError(err);
            if (callback !== undefined) callback(err, docs)
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
            isError(err);
            console.log(doc);
            if (callback !== undefined) callback(err, doc)
        })
}

schema.statics.create = function (item, callback) {
    const d     = new Date(),
          today = d.toISOString().substring(0,10);
    item.name = item.name.trim();
    item.log  = [{
        date     : item.date || today,
        added    : item.inStock,
        balance  : item.inStock,
        comments : `Added ${item.name} to inventory`
    }];
    let newItem = new this(item);
    return newItem.save((err, insertedId) => {
        isError(err);
        if (callback !== undefined) callback(err, newItem)
    })
}

schema.statics.push = function (isById, item, log, callback) {
    let query   = isById ? {_id: item}  :  {name: new RegExp(`${item}`)},
        balance = log.added - log.removed;
    this.findOne(query).select('_id inStock log').exec((err, doc) => {
        if (!doc) callback(`${item} not found.`);
        else {
            const itemId = doc._id;
            isError(err);
            doc.log.forEach(item => {
                if (item.date == log.date) return callback('Log with that date is already in the database.');
            })
            log.balance = doc.inStock + balance;
            return this.findOneAndUpdate(
                {_id: doc._id},
                {
                    $inc:  { inStock  : balance },
                    $push: { log : {
                        $each: [ log ],
                        $sort: { date:1 }
                    }}
                },
                { upsert: true },
                (err, id) => {
                    if (isError(err)) callback(err);
                    else callback(err, id);
                }
            )
        }
    })
}

schema.statics.editItem = function (itemId, data, callback) {
    return this.findOneAndUpdate({_id: itemId}, data, {upsert: false},
        (err, numAffected) => {
            isError(err)
            if (callback !== undefined) callback(err, numAffected)
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
            $inc: {
                "inStock"       : newLog.stockDiff,
            },
            $set: {
                "log.$.added"   : newLog.added,
                "log.$.removed" : newLog.removed,
                "log.$.balance" : newLog.balance,
            }
        }
    }
    return this.update(
        {
            "_id"     : itemId,
            "log._id" : logId
        }, update, { upsert : false },
        (err, numAffected) => {
            if (isError(err)) callback(err)
//            else if (!newLog.hasOwnProperty('comments')) this.checkBalances(itemId, newLog, callback);
            callback(err, numAffected);
        }
    )
}

schema.statics.remove = function (itemId, callback) {
    return this.where({_id: itemId}).remove((err, removedId) => {
        isError(err);
        if (callback !== undefined) callback(removedId)
    })
}

schema.statics.getRecordsForDate = function (dateString, callback) {
    return this.aggregate(
        [
            {$project: {
                name     : 1,
                category : 1,
                log      : 1,
            }},
            {$group: {
                _id   : '$category',
                items : {$push: {
                    name : '$name',
                    log  : {
                        $filter: {
                            input : '$log',
                            as    : 'log',
                            cond  : {$eq: ['$$log.date', dateString]}
                        }
                    },
                }},
            }},
            {$sort: {_id: 1}}
        ], (err, result) => {
            isError(err);
            callback(err, result); 
        }
    )
}

schema.statics.checkBalances = function (id, log, callback) {
    const query = {_id:id};
    this.findOne(query).select('log inStock').exec((err, doc) => {
        const allLogs   = doc.log,
              logsLen   = allLogs.length;
        let startFrom   = 0;
        allLogs.forEach((item, index) => {
            if (item.date == log.date) startFrom = index;
        })
        if (startFrom == logsLen - 1) callback(null)
        else {
            let newBalances = {$set: {}},
                i           = startFrom;
            for (i; i < logsLen; i++) {
                if (i == 0) {
                    newBalances['log.0.balance'] = allLogs[i].added - allLogs[i].removed;
                    allLogs[i].balance = newBalances['log.0.balance'];
                } else {
                    const prev = i - 1;
                    newBalances.$set[`log.${i}.balance`] = newBalances.$set[`log.${prev}.balance`] + allLogs[i].added - allLogs[i].removed;
                }
            }
            this.update(query, newBalances, {upsert: false}, err => {
                callback(err)
            })
        }
        callback(null)
    })
}

module.exports = mongoose.model('Item', schema)

const isError = (err) => {
    if (err) {
        console.error(err.toString());
        return true;
    } else return false;
}
