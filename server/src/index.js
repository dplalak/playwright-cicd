import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import cors from 'cors';
import logger from './util/logger';
import config from './config';
import Middlewares from './api/middlewares'
import Authentication from './api/authentication'
import UserRouter from './user/router'

if(!process.env.JWT_SECRET) {
    const err = new Error('No JWT_SECRET in env variable, check instructions: https://github.com/amazingandyyy/mern#prepare-your-secret');
    logger.warn(err.message);
}

const app = express();

mongoose.connect(config.mongoose.uri, { useNewUrlParser: true, useUnifiedTopology: true })
.catch(err=>console.error(err));

mongoose.Promise = global.Promise;

// App Setup
app.use(cors({
    origin: ['http://localhost:3000']
}));
app.use(morgan('dev'));
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.get('/ping', (req, res) => res.send('pong'))
app.get('/', (req, res) => res.json({'source': 'https://github.com/amazingandyyy/mern'}))
app.post('/signup', Authentication.signup)
app.post('/signin', Authentication.signin)
app.get('/auth-ping', Middlewares.loginRequired, (req, res) => res.send('connected'))
app.use('/user', Middlewares.loginRequired, UserRouter)

app.use((err, req, res, next) => {
    logger.error(err.message);
    const isDbError = err.name === 'MongoServerError' || err.message && /connect|network|ECONNREFUSED/i.test(err.message);
    const status = isDbError ? 503 : 422;
    res.status(status).json({ error: err.message || 'Server error' });
});

// Server Setup – start dopiero po połączeniu z MongoDB (unikamy "buffering timed out")
const port = process.env.PORT || 8000;
const uri = config.mongoose.uri;
const uriSafe = uri.replace(/:[^:@]+@/, ':****@');
logger.info('Connecting to MongoDB: ' + uriSafe);
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    logger.info('MongoDB connected');
    app.listen(port, () => logger.info(`Server listening on: ${port}`));
  })
  .catch((err) => {
    logger.error('MongoDB connection failed: ' + err.message);
    console.error(err);
    process.exit(1);
  });
