const db = require('mongoose-simpledb').db,
      queryString = require('querystring');
      currentDepartment = "Housekeeping";

module.exports = (router) => {
    
    let Item = handlers;

    router.get('/', (req, res) => {
        Item.getAll((docs) => {
            Item.getCategories((categories) => {
                res.render('index', {
                    department: currentDepartment,
                    date: new Date().toDateString(),
                    items: docs,
                    numItems: docs.length,
                    categories: categories
                })
            })
        });
    })
    
    router.post('/', (req, res) => {
        Item.create(req.body.item, (doc) => {
            res.end();
        }) 
    })
    
    router.get('/:itemId', (req, res) => {
        Item.get(req.params.itemId, (doc) => {
            let thisItem = doc;
            Item.getCurrentCategory(thisItem.category, (docs) => {
                res.render('item', {
                    department: currentDepartment,
                    date: new Date().toDateString(),
                    categoryItems: docs,
                    item: doc
                })
            })
        })
    })

    router.get('/:itemName/:direction', (req, res) => {
        Item.getAdjacent(req.params.itemName, req.params.direction, (doc) => {
            let thisItem = doc;
            Item.getCurrentCategory(thisItem.category, (docs) => {
                res.render('item', {
                    department: currentDepartment,
                    date: new Date().toDateString(),
                    categoryItems: docs,
                    item: doc
                })
            })
        })
    })
    
    router.put('/:itemId', (req, res) => {
        Item.editItem(req.params.itemId, req.body.update, (affected) => {
            if (affected !== null && affected !== undefined) {
                res.end();
            }
            else res.status(401)
        })
    })

    router.post('/:itemId/push', (req, res) => {
        Item.push(req.params.itemId, req.body.log, (affected) => {
            if (affected !== null && affected !== undefined) {
                res.end();
            }
            else res.status(401)
        })
    })
    
    router.delete('/:itemId', (req, res) => {
        Item.remove(req.params.itemId, (id) => {
            if (id !== null && id !== undefined) {
                res.end();
            }
            else res.status(401)
        })
    })

    return router;
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

const handlers = {

    getAll: (callback) => {
        db.Item.find({})
            .select('_id category name inStock lowAt')
            .sort('category name')
            .exec((err, docs) => {
                handlers.onError(err);
                callback(docs)
            })
    },

    getCategories: (callback) => {
        db.Item.distinct('category', (err, categories) => {
            handlers.onError(err);
            if (callback !== undefined) callback(categories);
        })
    },

    get: (itemId, callback)  => {
        db.Item.findOne({ _id: itemId})
            .select('_id category name inStock log')
            .sort('date')
            .exec((err, doc) => {
                handlers.onError(err);
                if (callback !== undefined) callback(doc)
            })
    },

    getCurrentCategory: (category, callback) => {
        db.Item.find({category: category})
            .select('_id name')
            .sort('name')
            .exec((err, docs) => {
                handlers.onError(err);
                if (callback !== undefined) callback(docs)
            })
    },

    getAdjacent: (itemName, direction, callback) => {
        let query = {}, sort = {};
        let escItemName = itemName.replace('%20', ' ');
        if (direction === 'next') {
            query = {name: {$gt: escItemName}};
            sort = {name: 1}
        }
        else if (direction === 'prev') {
            query = {name: {$lt: escItemName}};
            sort = {name: -1}
        }
        else {
            rest.status(401).send('Unknown paramater for direction.');
        }
        db.Item.findOne(query)
            .select('_id category name inStock log')
            .sort(sort)
            .exec((err, doc) => {
                handlers.onError(err);
                console.log(doc);
                if (callback !== undefined) callback(doc)
            })
    },

    create: (string, callback) => {
        let item = queryString.parse(string);
        item.log = [{added: item.inStock, balance: item.inStock}];
        let newItem = new db.Item(item);
        newItem.save((err, insertedId) => {
            handlers.onError(err);
            if (callback !== undefined) callback(newItem)
        })
    },

    push: (itemId, logObject, callback) => {
        db.Item.findOneAndUpdate(
            {_id: itemId},
            {
                inStock: logObject.balance,
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
    
    editItem: (itemId, data, callback) => {
        console.log(data);
        db.Item.update({_id: itemId}, data, {upsert: false},
            (err, numAffected) => {
                handlers.onError(err)
                if (callback !== undefined) callback(numAffected)
            }
        )
    },
    
    editItemLog: (itemId, logId, newLog, callback)  => {
        db.Item(
            {
                "_id": itemId,
                "log._id": logId
            },
            {$set : { "log.$": newLog }},
            {upsert: false},
            (err, numAffected) => {
                handlers.onError(err)
                if (callback !== undefined) callback(id)
            }
        )
    },

    remove: (itemId, callback) => {
        db.Item.where({_id: itemId})
            .remove((err, removedId) => {
            handlers.onError(err);
            if (callback !== undefined) callback(removedId)
        })
    },

    onError: (err) => {
        if (err) {
            console.error(err.toString());
        }
    }
}
