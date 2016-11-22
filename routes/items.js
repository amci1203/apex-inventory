const Item = require('../dbmodels/item'),
      currentDepartment = "Housekeeping",
      queryString = require('querystring');


const handlers = {
    handlers: this,

    getAll: (callback) => {
        Item.find()
            .select('category name inStock lowAt')
            .sort('category name')
            .exec((err, docs) => {
                handlers.onError(err);
                callback(docs)
            })
    },

    get: (itemName, callback)  => {
        Item.findOne({name: itemName})
            .select('inStock lowAt log')
            .exec((err, doc) => {
                handlers.onError(err);
                callback(doc)
            })
    },

    create: (string, callback) => {
        let item = queryString.parse(string)
        let newItem = new Item(item);
        console.log(item);
        newItem.save((err, insertedId) => {
            handlers.onError(err);
            callback(insertedId)
        })
    },

    push: (itemName, logObject) => {
        Item.findOneAndUpdate(
            {name: itemName},
            { $push: {
                log: logObject
            }},
            { upsert: true },
            (err, doc) => {
                handlers.onError(err);
                return doc
            }
        )
    },

    remove: (itemName) => {
        Item.where({name: itemName})
            .remove((err) => { this.onError(err) })
    },

    onError: (err) => {
        if (err) {
            console.error(err.toString());
        }
    }
}

module.exports = (router) => {
    let _ = handlers;
    
    router.get('/', (req, res) => { 
        _.getAll((docs) => {
            res.render('index', {
                department: currentDepartment,
                date: new Date().toDateString(),
                items: docs
            })
        });
             
    })
    
    router.get('/:item', (req, res) => { _.get(req.params.item) })
    
    router.post('/', (req, res) => {
        _.create(req.body.item, (id) => {
            res.send(id);
        }) 
    })
    
    router.post('/:item', (req, res) => { _.push(req.body.item, req.body.log) })
    
    router.delete('/:item', (req, res) => { _.remove(req.params.item) })

    return router;
}
