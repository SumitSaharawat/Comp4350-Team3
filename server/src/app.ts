import express from 'express';
import cors from 'cors';
import { AddressInfo } from "net";
// import * as path from 'path';
import debug from 'debug';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import index from './routes/index.js';
import user from './routes/user.js';
import login from './routes/login.js';
import { devError, prodError } from './middleware/errorHandler.js';
import { requestLog } from './middleware/loggers.js';

const debugLog = debug('server');
const app = express();

// we might want to do things differently for dev and prod
const environment = process.env.NODE_ENV;
const isDevelopment = environment === 'development';

app.use(cors({
    origin: process.env.REACT_ORIGIN,
    credentials: true
}));


// ================================
// body parsers for accessing request body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

// ==============================
// logs setting
if (isDevelopment) {
    app.use(requestLog);
}



// ==================================
// routes
app.use('/', index);
app.use('/api/user', user);
app.use('/api/login', login);


// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err[ 'status' ] = 404;
    next(err);
});


// ============================
// error handlers

// development error handler
if (isDevelopment) {
    app.use(devError);
}

// production error handler
app.use(prodError);


// =========================================
app.set('port', process.env.SERVER_PORT || 3000);

const server = app.listen(app.get('port'), function () {
    debugLog(`Express server listening on port ${(server.address() as AddressInfo).port}`);
});