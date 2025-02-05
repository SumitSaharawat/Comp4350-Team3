import express from 'express';
import { AddressInfo } from "net";
// import * as path from 'path';
import debug from 'debug'

import routes from './routes/index.js';
import profile from './routes/profile.js';

const debugLog = debug('server');
const app = express();

// ==================================
// routes
app.use('/', routes);
app.use('/profile', profile);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err[ 'status' ] = 404;
    next(err);
});


// ============================
// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use((err, req, res, next) => { // eslint-disable-line @typescript-eslint/no-unused-vars
        res.status(err[ 'status' ] || 500);
        res.json({
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => { // eslint-disable-line @typescript-eslint/no-unused-vars
    res.status(err.status || 500);
    res.json({
        message: err.message,
    });
});


// =========================================
app.set('port', process.env.PORT || 3000);

const server = app.listen(app.get('port'), function () {
    debugLog(`Express server listening on port ${(server.address() as AddressInfo).port}`);
});