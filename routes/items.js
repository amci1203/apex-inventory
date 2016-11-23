const Item = require('mongoose-simpledb').db.Item,
      currentDepartment = "Housekeeping";

module.exports = (router) => {
    
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
//            Item.push(doc.name, {})
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
    
    router.delete('/itemId', (req, res) => { Item.remove(req.params.itemId) })

    return router;
}
