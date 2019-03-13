"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const log_1 = require("./log");
const logger_settings_1 = __importDefault(require("./logger-settings"));
exports.LoggerSettings = logger_settings_1.default;
const colors = {
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    dim: '\x1b[2m',
    reset: '\x1b[0m'
};
exports.LoggingColor = colors;
var maxNameLength = 0;
function logEntry(name, timestamp, msg, color) {
    if (!color)
        color = 'white';
    const entry = {
        n: name,
        t: timestamp,
        m: msg,
        c: color
    };
    log_1.log.push(entry);
    logger_settings_1.default.appendToLogfile(entry);
    if (log_1.log.length > logger_settings_1.default.linesInMemory) {
        log_1.log.splice(0, logger_settings_1.default.chopSize);
    }
}
function isNodeJSModule(obj) {
    var keys = Object.keys(obj);
    return keys.includes('filename') && keys.includes('id') && keys.includes('exports');
}
function isError(obj) {
    var e = new Error('asdf');
    if (typeof (obj) !== 'object')
        return false;
    if (obj instanceof Error)
        return true;
    var keys = Object.keys(obj);
    return keys.includes('message') && keys.includes('name');
}
function Logger(loggerID, defaultColor = null) {
    var name = '';
    if (typeof (loggerID) === 'string')
        name = loggerID;
    else if (isNodeJSModule(loggerID)) {
        name = loggerID.filename;
        name = name.substr(name.lastIndexOf('/') + 1);
        if (name.endsWith('.js'))
            name = name.substr(0, name.length - 3);
    }
    else if (loggerID.toString) {
        name = loggerID.toString();
    }
    else {
        name = loggerID + '';
    }
    if (name.length > maxNameLength)
        maxNameLength = name.length;
    var defaultCol = defaultColor || logger_settings_1.default.defaultColor;
    var defaultC = colors[defaultCol];
    function Log(msg, color = null) {
        var d = new Date();
        var c = color ? colors[color] : defaultC;
        if (!color)
            color = defaultCol;
        var cr = c === '' ? '' : colors.reset;
        var strMsg;
        if (typeof (msg) === 'string') {
            strMsg = msg;
        }
        else if (isError(msg)) {
            strMsg = msg.name + ': ' + msg.message + (msg.stack ? ('\n' + msg.stack) : '');
        }
        else {
            let tmptstr;
            if (msg.toString)
                tmptstr = msg.toString();
            if (typeof (tmptstr) === 'string') {
                strMsg = tmptstr;
            }
            else {
                strMsg = JSON.stringify(msg);
            }
        }
        logEntry(name, d.getTime(), strMsg, color);
        if (logger_settings_1.default.useSystemStringification) {
            console.log(c + timestamp(d) + cr + c + '|' + fixedLengthString(name, maxNameLength, '.') + cr + c + ': ', msg, cr);
        }
        else {
            console.log(c + timestamp(d) + cr + c + '|' + fixedLengthString(name, maxNameLength, '.') + cr + c + ': ' + strMsg + cr);
        }
    }
    return Log;
}
exports.Logger = Logger;
function timestamp(d) {
    return digits(d.getHours(), 2) + ':' +
        digits(d.getMinutes(), 2) + ':' +
        digits(d.getSeconds(), 2) + colors.dim + '.' +
        digits(d.getMilliseconds(), 3) + colors.reset;
}
function digits(n, digits) {
    var sn = ('' + n);
    while (sn.length < digits)
        sn = '0' + sn;
    return sn;
}
function fixedLengthString(str, len, fillChar) {
    if (!fillChar)
        fillChar = ' ';
    var s = ('' + str);
    var se = '';
    for (var i = s.length; i < len; i++)
        se += fillChar;
    if (fillChar !== ' ')
        se = colors.dim + se + colors.reset;
    return s + se;
}
function loggerExpressEndpoint(req, res, next) {
    if (req.url === '/') {
        res.sendFile(__dirname + '/log.html');
    }
    else if (req.url.startsWith('/since/')) {
        var t1 = parseInt(req.url.substr('/since/'.length));
        for (var i = 0; i < log_1.log.length; i++) {
            if (log_1.log[i].t > t1) {
                res.json(log_1.log.slice(i));
                return;
            }
        }
        res.json([]);
    }
    else {
        next();
    }
}
exports.loggerExpressEndpoint = loggerExpressEndpoint;
;
exports.default = Logger;
//# sourceMappingURL=logger.js.map