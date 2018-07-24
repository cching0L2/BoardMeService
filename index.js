import express from 'express'
import bodyParser from 'body-parser'

var app = express();
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var authRoutes = require('./routes/authRouter');
var petRoutes = require('./routes/petRouter');

// connect to MongoDB
mongoose.connect('mongodb://localhost/boardMe');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function() {console.log('Connection established');})

// Session tracking
app.use(session({
	secret: 'board me',
	resave: true,
	saveUninitialized: false,
	store: new MongoStore({
		mongooseConnection: db
	})
}));

app.use(express.static(__dirname + '/template'));
app.use(bodyParser.json());

app.use('/', authRoutes);
app.use('/pets', petRoutes);

// Catch not found errors
app.use(function(req, res, next) {
	var err = new Error('File Not Found');
	err.status = 404;
	next(err)
});

// Error handlers
app.use(function(err, req, res, next) {
	res.status(err.status || 500).json({error: err.message})
});

app.listen(3000, function() {
	console.log('Express app listening on port 3000');
})