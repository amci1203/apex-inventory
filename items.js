const Item = require('./dbmodels/item');

const handlers = {
    handlers: this,

    getAll: () => {
        Item.find()
            .select('category name inStock lowAt')
            .sort('category name')
            .exec((err, docs) => {
                handlers.onError(err);
                return docs;
            })
    },

    get: (itemName)  => {
        Item.findOne({name: itemName})
            .select('inStock lowAt log')
            .exec((err, doc) => {
                handlers.onError(err);
                return doc;
            })
    },

    create: (itemObject, callback) => {
        let newItem = new Item(itemObject);
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
            return false;
        }
        else return true
    }
}

module.exports = (router) => {
    let _ = handlers;

    router.get('/', (req, res) => { _.getAll() })
    router.get('/:item', (req, res) => { _.get(req.params.item) })
    router.post('/', (req, res) => { _.create(req.body.item) })
    router.post('/:item', (req, res) => { _.push(req.body.item, req.body.log) })
    router.delete('/:item', (req, res) => { _.remove(req.params.item) })

    return router;
}
