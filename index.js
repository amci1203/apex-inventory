const db = require('mongoose'),
      bodyParser = require('body-parser'),
      express = require('express'),
      pug = require('pug');

const department = "housekeeping",
      dbconn = 'mongodb://localhost:27017/' + department,
      port = 3000,
      items = require('./routes/items')(express.Router()),
      app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

app.set('views', './views');
app.set('view engine', 'pug');

app.get('/', (req, res) => { res.redirect('/items') })
app.use('/items', items);

db.connect(dbconn, (err, db) => {
        if (err) console.error(err.toString())
        else console.info("Successfully connected to %s department.", department)
    }
)

app.listen(port, (err) => {
    if (err) console.error(err.toString())
    else console.info("Listening on port %s", port)
})
