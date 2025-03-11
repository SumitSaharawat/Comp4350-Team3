import debug from 'debug';

// server scope loggin
const serverLog = debug('server');
export const controlLog = debug('server:controller');
export const dbLog = debug('server:db');

// log the received request
export const requestLog = (req, res, next) => {
    serverLog(
        `${req.method} from ${req.protocol}://${req.get('host')}${req.originalUrl} body ${JSON.stringify(req.body)}`    
    );
    next();
}