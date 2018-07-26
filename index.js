import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import session from 'express-session'
import authRoutes from './routes/authRouter'
import petRoutes from './routes/petRouter'

// fdsajoifjsifodjfojfiojo
const app = express();
const MongoStore = require('connect-mongo')(session);

// connect to MongoDB
mongoose.connect('mongodb://localhost/boardMe');
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', () => {console.log('Connection established');})

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
app.use((req, res, next) => {
	let err = new Error('File Not Found');
	err.status = 404;
	next(err)
});

// Error handlers
app.use((err, req, res, next) => {
	res.status(err.status || 500).json({error: err.message})
});

app.listen(3000, () => {
	console.log('Express app listening on port 3000');
})