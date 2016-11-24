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
    
    router.post('/new', (req, res) => {
        Item.create(req.body.item, (doc) => {
            console.log(doc);
        }) 
    })
    
    router.get('/:itemId', (req, res) => {
        Item.get(req.params.itemId, (doc) => {
            res.render('item', {
                department: currentDepartment,
                date: new Date().toDateString(),
                item: doc
            })
        })
    })

    router.post('/:itemId/push', (req, res) => { Item.push(req.params.itemId, req.body.log) })
    
    router.delete('/:itemId', (req, res) => {
        Item.remove(req.params.itemId, (id) => {
            if (id !== null && id !== undefined) {
                res.end();
            }
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
            .select('_id name inStock log')
            .exec((err, doc) => {
                handlers.onError(err);
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
