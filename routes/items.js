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
    
    router.post('/', (req, res) => {
        let item      = req.body.item;
        item.category = item.category || 'Uncategorized';
        item.inStock  = item.inStock  || 0;
        item.lowAt    = item.lowAt    || 0;
        if (!item.name) {
            res.json({error: 'A name MUST be entered' })
        }
        else Item.create(item, () => res.end())
    })
    
    router.post('/multi', (req, res) => {
        let category       = req.body.category,
            items          = req.body.items,
            numItems       = items.length,
            savesCompleted = 0;
        items.forEach((obj) => {
            let item       = obj;
            item.category  = category;
            item.added     = item.added   || 0;
            item.removed   = item.removed || 0;
            Item.create(item, () => {
                savesCompleted++
                if (savesCompleted === numItems) res.end()
                
            })
        })
    })

    router.post('/logs/multi', (req, res) => {
        const itemLogs       = req.body.itemLogs,
              date           = req.body.date,
              numLogs        = itemLogs.length,
            savesCompleted = 0;
        itemLogs.forEach((obj, index) => {
            let item       = obj;
            item.added     = item.added   || 0;
            item.removed   = item.removed || 0;
            
            let log = {
                date    : date,
                added   : item.added,
                removed : item.removed,
            };
            
            Item.push(false, item.name, log, () => {
                savesCompleted++
                if (savesCompleted === numLogs) res.end();
            })
        })
    })

    router.get('/:itemId', (req, res) => {
        Item.get(req.params.itemId, (item) => {
            Item.getCurrentCategory(item.category, (categoryItems) => {
                res.render('item', {
                    department: currentDepartment,
                    date: new Date().toDateString(),
                    categoryItems: categoryItems,
                    item: item
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
        let item = req.body.log;
        if (item.date    == '') item.date    = new Date();
        if (item.added   == '') item.added   = 0;
        if (item.removed == '') item.removed = 0;
        Item.push(true, req.params.itemId, item, (affected) => {
            if ([null, undefined].indexOf(affected) == -1) {
                res.end();
            }
            else res.status(401)
        })
    })
    
    router.delete('/:itemId', (req, res) => {
        Item.remove(req.params.itemId, (id) => {
            if ([null, undefined].indexOf(affected) == -1) {
                res.end();
            }
            else res.status(401)
        })
    })

    return router;
}
