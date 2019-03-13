const fs = require('fs');


fs.readFile(__dirname + '/html/log.html', 'utf8', (err, logHtml) => {
	if (err) throw err;
	fs.readFile(__dirname + '/html/style.css', 'utf8', (err, styleCss) => {
		if (err) throw err;
		fs.readFile(__dirname + '/html/bit.js', 'utf8', (err, bitJs) => {
			if (err) throw err;
			fs.readFile(__dirname + '/html/java.js', 'utf8', (err, javaJs) => {
				if (err) throw err;
				filesLoaded(logHtml, styleCss, bitJs, javaJs);
			});
		});
	});
});

/**
 * gets called when all the files are loaded from disk
 * @param {string} logHtml 
 * @param {string} styleCss 
 * @param {string} bitJs 
 * @param {string} javaJs 
 */
function filesLoaded (logHtml, styleCss, bitJs, javaJs) {
	const regex = {
		styleCss: /<link[^>]+href="style.css"[^>]*\/>/,
		bitJs: /<script[^>]+src="bit.js"[^>]*>[^<]*<\/script>/,
		javaJs: /<script[^>]+src="java.js"[^>]*>[^<]*<\/script>/
	};
	logHtml = logHtml.replace(regex.styleCss, wrapStyle(styleCss));
	logHtml = logHtml.replace(regex.bitJs,    wrapJs(bitJs));
	logHtml = logHtml.replace(regex.javaJs,   wrapJs(javaJs));
	writeLogHtmlToDistPath(logHtml);
}

/**
 * wraps css style in <style> tags
 * @param {string} style 
 * @returns {string}
 */
function wrapStyle (style) {
	style = style.replace(/\\*.*?\\*/, '');
	style = style.split(/\s/).join(' ');
	for (var i = 0; i < 10; i++) {
		var origLength = style.length;
		style = style.split('  ').join(' ');
		if (origLength === style.length) break;
	}
	// style = style
	// 		.split(' {').join('{')
	// 		.split('{ ').join('{')
	// 		.split(' }').join('}')
	// 		.split('} ').join('}')
	// 		.split(': ').join(':')
	// 		.split(' :').join(':')
	// 		.split('; ').join(';')
	// 		.split(' ;').join(';')
	// 		.split(', ').join(',')
	// 		.split(' ,').join(',')
	// 		.split(';}').join('}');
	return '<style>\n' + style + '\n</style>';
}

/**
 * wraps javascript code in <script> tags
 * @param {string} code 
 * @returns {string}
 */
function wrapJs(code) {
	// code = code.replace(/\\*.*?\\*/, '');
	// code = code.split('\n').map(line => line.startsWith('//') ? '' : line.split('//')[0]).join('\n');
	// code = code.split(/\s/).join(' ');
	// for (var i = 0; i < 20; i++) {
	// 	var origLength = code.length;
	// 	code = code.split('  ').join(' ');
	// 	if (origLength === code.length) break;
	// }
	// for (var i = 0; i < 20; i++) {
	// 	var cl = code.length;
	// 	code = code.replace(/\s?[\{\}\(\)\[\]=\-\+\*<>,;:!\?&|]\s?/g, value => value.trim());
	// 	if (cl === code.length) break;
	// }
	// code = code.split(';}').join('}');
	// if (code.endsWith(';')) code = code.substr(0, code.length - 1);
	return '<script type="application/javascript">\n' + code + '\n</script>';
}


/**
 * called last to write the log.html file to disk (in /dist/ folder)
 * @param {string} logHtml 
 */
function writeLogHtmlToDistPath (logHtml) {
	// logHtml = minify(logHtml);
	fs.mkdir(__dirname + '/../dist/', err => {
		if (err && err.code !== 'EEXIST') throw err;
		fs.writeFile(__dirname + '/../dist/log.html', logHtml, { encoding: 'utf8' }, err => {
			if (err) throw err;
			console.log('[log.html] built successfully');
		});
	});
}
