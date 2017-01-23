const Item = require('../dbmodels/item'),
      querystring = require('querystring'),
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
        Item.create(querystring.parse(req.body.item), (doc) => {
            res.end();
        }) 
    })
    
    router.post('/new/multi', (req, res) => {
        let category = req.body.category,
            items = req.body.items,
            numItems = items.length,
            savesCompleted = 0;
        items.forEach((string, index) => {
            let item = querystring.parse(string);
            item.category = category;
            Item.create(item, () => {
                savesCompleted++
                if (savesCompleted === numItems) {
                    res.end();
                }
            })
        })
    })

    router.post('/logs/multi', (req, res) => {
        let itemLogs = req.body.itemLogs,
            date = req.body.date,
            numLogs = itemLogs.length,
            savesCompleted = 0;
        itemLogs.forEach((string, index) => {
            let item = querystring.parse(string),
                log = {
                    date: date,
                    added: item.added,
                    removed: item.removed,
                };
            Item.push(false, item.name, log, () => {
                savesCompleted++
                if (savesCompleted === numLogs) {
                    res.end();
                }
            })
        })
    })

    router.get('/:itemId', (req, res) => {
        Item.get(req.params.itemId, (doc) => {
            Item.getCurrentCategory(doc.category, (docs) => {
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
        Item.push(true, req.params.itemId, querystring.parse(req.body.log), (affected) => {
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
