const Item              = require('../dbmodels/item'),
      querystring       = require('querystring'),
      currentDepartment = "Housekeeping";

module.exports = (router) => {
    
    router.get('/', (req, res) => {
        Item.getAll((err, docs) => {
            const categories = docs.map(group => group._id)
            res.render('index', {
                date       : new Date().toDateString(),
                allItems   : docs,
                department : currentDepartment,
                categories : categories,
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
        else Item.create(item, (err) => {
            if (err) res.json({success: false, message: err.toString});
            res.end()
        })
    })
    
    router.post('/multi-items', (req, res) => {
        let category       = req.body.category,
            items          = req.body.items,
            numItems       = items.length,
            savesCompleted = 0;
        items.forEach((obj) => {
            let item       = obj;
            item.category  = category;
            item.added     = item.added   || 0;
            item.removed   = item.removed || 0;
            Item.create(item, (err) => {
                if (err) res.json({success: false, message: err.toString});
                savesCompleted++;
                if (savesCompleted === numItems) res.end()
                
            })
        })
    })

    router.post('/multi-logs', (req, res) => {
        const itemLogs       = req.body.itemLogs,
              date           = req.body.date || new Date,
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
            
            Item.push(false, item.name, log, (err) => {
                if (err) res.json({success: false, message: err.toString});
                savesCompleted++
                if (savesCompleted === numLogs) res.end();
            })
        })
    })

    // SPECIAL ROUTE TO ADD LOG BALANCES TO PAST RECORDS 
    router.get('/utils/fix-logs', (req, res) => {
        Item.find().select('_id log').exec((err, docs) => {
            const numItems     = docs.length;
            let savesCompleted = 0
            docs.forEach((item) => {
                const id        = item._id;
                let prevBalance = 0,
                    logBalances = {};
                item.log.forEach((log, index) => {
                    const thisLogBalance = prevBalance + log.added - log.removed;
                    logBalances[`log.${index}.balance`] = thisLogBalance;
                    prevBalance += thisLogBalance;
                })
                Item.update({_id: id}, {$set: logBalances }, {upsert: true}, err =>  {
                    if (err) console.error(err)
                    else {
                        savesCompleted++
                        if (savesCompleted == numItems) res.end('Done')
                    }
                })
            })
        })
    })
    
    router.get('/print/:date', (req, res) => {
        Item.getRecordsForDate(req.params.date, (err, docs) => {
            res.render('day-record', {
                date    : new Date( req.params.date),
                records : docs
            })
        })
    })

    router.get('/:itemId', (req, res) => {
        Item.get(req.params.itemId, (err, item) => {
            if (err) res.status(401).end(err.toString());
            if (item == undefined) res.status(404).end();
            Item.getCurrentCategory(item.category, (err, categoryItems) => {
                res.render('item', {
                    department: currentDepartment,
                    date: new Date().toDateString(),
                    categoryItems: categoryItems,
                    item: item
                })
            })
        })
    })


    router.post('/:itemId', (req, res) => {
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
            else res.json({error: 'An item already has that name.'})
        })
    })
    
    router.put('/:itemId/:logId', (req, res) => {
        let _ = req.params;
        Item.editItemLog(_.itemId, _.logId, req.body.uLog, (affected) => {
            if (affected !== null && affected !== undefined) {
                res.end();
            }
            else res.json({error: 'The record does not exist to be edited.'})
        })
    })
    
    router.delete('/:itemId', (req, res) => {
        Item.remove(req.params.itemId, (id) => {
            if ([null, undefined].indexOf(id) == -1) {
                res.end();
            }
            else res.status(401).send('The requested resource does not exist to be deleted.')
        })
    })

    return router;
}
