import fs = require ('fs');
import { log, LogEntry } from "./log";
import settings from "./logger-settings";


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

var maxNameLength: number = 0;



function logEntry (name : string, timestamp : number, msg : string, color? : 'black' | 'red' | 'green' | 'yellow' | 'blue' | 'magenta' | 'cyan' | 'white') {
	if (!color) color = 'white';
	const entry : LogEntry = {
		n: name,
		t: timestamp,
		m: msg,
		c: color
	};
	log.push (entry);
	settings.appendToLogfile (entry);
	if (log.length > settings.linesInMemory) {
		log.splice (0, settings.chopSize);
	}
}

function isNodeJSModule (obj : NodeJS.Module|any) : obj is NodeJS.Module {
	var keys = Object.keys (obj);
	return keys.includes ('filename') && keys.includes ('id') && keys.includes ('exports');
}

function isError (obj : Error|any) : obj is Error {
	var e = new Error ('asdf');
	if (typeof (obj) !== 'object') return false;
	if (obj instanceof Error) return true;
	var keys = Object.keys (obj);
	return keys.includes ('message') && keys.includes ('name');
}

function Logger (loggerID: string|NodeJS.Module|{toString: ()=>string}, defaultColor : 'black'|'red'|'green'|'yellow'|'blue'|'magenta'|'cyan'|'white' = null) {
	var name = '';
	if (typeof (loggerID) === 'string') name = loggerID;
	else if (isNodeJSModule (loggerID)) {
		name = loggerID.filename;
		name = name.substr (name.lastIndexOf ('/') + 1);
		if (name.endsWith ('.js')) name = name.substr (0, name.length - 3);
	} else if (loggerID.toString) {
		name = loggerID.toString ();
	} else {
		name = loggerID + '';
	}
	if (name.length > maxNameLength) maxNameLength = name.length;
	var defaultCol = defaultColor || settings.defaultColor;
	var defaultC = colors[defaultCol];

	function Log (msg: string|number|Error|object, color: 'black'|'red'|'green'|'yellow'|'blue'|'magenta'|'cyan'|'white' = null) {
		var d = new Date ();
		var c = color ? colors[color] : defaultC;
		if (!color) color = defaultCol;
		logEntry (name, d.getTime (), strMsg, color);
		if (!settings.useColorsInProduction && settings.isProductionMode) {
			console.log (msg);
		} else {
			var cr = c === '' ? '' : colors.reset;
			var strMsg : string;
			if (typeof (msg) === 'string') {
				strMsg = msg;
			} else if (isError (msg)) {
				strMsg = msg.name + ': ' + msg.message + (msg.stack ? ('\n' + msg.stack) : '');
			} else {
				strMsg = String (msg);
				if (typeof (strMsg) !== 'string' || strMsg.startsWith ('[object ')) {
					strMsg = JSON.stringify (msg);
				}
			}
			if (settings.useSystemStringification) {
				console.log (c + timestamp (d) + cr + c + '|' + fixedLengthString (name, maxNameLength, '.') + cr + c + ': ', msg, cr);
			} else {
				console.log (c + timestamp (d) + cr + c + '|' + fixedLengthString (name, maxNameLength, '.') + cr + c + ': ' + strMsg + cr);
			}
		}
	}
	return Log;
}

function timestamp (d) {
	return digits (d.getHours (), 2) + ':' +
		digits (d.getMinutes (), 2) + ':' +
		digits (d.getSeconds (), 2) + colors.dim + '.' +
		digits (d.getMilliseconds (), 3) + colors.reset;
}

function digits (n, digits) {
	var sn = ('' + n);
	while (sn.length < digits) sn = '0' + sn;
	return sn;
}

function fixedLengthString (str, len, fillChar) {
	if (!fillChar) fillChar = ' ';
	var s = ('' + str);
	var se = '';
	for (var i = s.length; i < len; i++) se += fillChar;
	if (fillChar !== ' ') se = colors.dim + se + colors.reset;
	return s + se;
}





function loggerExpressEndpoint (req, res, next) {
	if (req.url === '/') {
		res.sendFile (__dirname + '/log.html');
	} else if (req.url.startsWith ('/since/')) {
		var t1 = parseInt (req.url.substr ('/since/'.length));
		for (var i = 0; i < log.length; i++) {
			if (log[i].t > t1) {
				res.json (log.slice (i));
				return;
			}
		}
		res.json ([]);
	} else {
		next ();
	}
};

export { Logger, loggerExpressEndpoint, colors as LoggingColor, settings as LoggerSettings };
export default Logger;
