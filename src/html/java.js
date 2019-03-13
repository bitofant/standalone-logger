var basePath = location.href;
if (basePath.indexOf('#') > 0) basePath = basePath.substr(0, basePath.indexOf('#'));
if (basePath.endsWith('.html')) basePath = basePath.substr(0, basePath.length - 5);
if (!basePath.endsWith('/')) basePath += '/';

function nDigits(n, digits) {
	var sn = '' + n;
	while (sn.length < digits) sn = '0' + sn;
	return sn;
}

function twoDigits(n) {
	return nDigits(n, 2);
}

var content = document.getElementById('content');
var wrapper = document.getElementById('wrapper'); //document.body.parentElement;
var se = wrapper;
var latest = Date.now() - 10 * 60 * 1000;
var offsetTop = 5;
var numChildren = 0;
var rowCount = 1;
var allRows = [];
ajax.callbackArgs = [2, 4]; // (err, json)
function refresh() {
	ajax.get(basePath + 'since/' + latest, (err, data) => {
		// if (data.length > 100) data.splice (0, data.length - 100);
		if (err) throw err;
		if (data.length < 1) return;

		var hash = (document.location.hash || '').substr(1);
		if (hash) {
			if (hash.startsWith('logger=')) {
				hash = hash.substr('logger='.length);
				for (var i = data.length - 1; i >= 0; i--) {
					if (data[i].n !== hash) data.splice(i, 1);
				}
			} else {
				var pattern = (hash.startsWith('/') && hash.endsWith('/')) ? new RegExp(hash.substr(1, hash.length - 2)) : new RegExp('.+' + hash + '.+');
				for (var i = data.length - 1; i >= 0; i--) {
					if (pattern.exec(data[i].m) === null) data.splice(i, 1);
				}
			}
			if (data.length < 1) return;
		}

		var shouldStep = (se.scrollHeight - se.scrollTop - window.innerHeight === 0);
		latest = data[data.length - 1].t;
		var rows = [];
		data.forEach(item => {
			var d = new Date(item.t);
			var date = d.getFullYear() + '-' + twoDigits(d.getMonth() + 1) + '-' + twoDigits(d.getDate());
			var time = twoDigits(d.getHours()) + ':' + twoDigits(d.getMinutes()) + ':' + twoDigits(d.getSeconds()) + '<span style="opacity:.66">.' + nDigits(d.getMilliseconds(), 3) + '</span>';
			var lineCount = item.m.split('\n').length;
			rows.push(elem({
				appendTo: content,
				className: 'fadingrow ' + (((numChildren++) & 1) === 1 ? 'odd-row' : 'even-row') + ' color-' + item.c,
				style: {
					opacity: data.length > 50 ? 1 : 0,
					zIndex: numChildren + 2,
					height: 'calc(1.5em * ' + lineCount + ')',
					top: 'calc(1.3em * ' + rowCount + ' + 0.3em + ' + (numChildren - 1 << 1) + 'px)' //(offsetTop += 20) + 'px'
				},
				children: [
					elem({
						style: { position: 'relative' },
						children: [
							elem({ className: 'col col-1', innerHTML: date }),
							elem({ className: 'col col-2', innerHTML: time }),
							elem({ className: 'col col-3', innerHTML: item.n }),
							elem({ className: 'col col-4', innerText: item.m })
						]
					})
				]
			}));
			rowCount += lineCount;
		});
		if (shouldStep) {
			if (se.scrollHeight - se.scrollTop - window.innerHeight > 1000) {
				se.scrollTop = se.scrollHeight - window.innerHeight - 1000;
			}
			var scroll = se.scrollTop, step = 1;
			function stepIt() {
				if (scroll > se.scrollTop) {
					return;
				} else if (scroll < se.scrollTop) {
					scroll = se.scrollTop;
				}
				scroll += step | 0;
				if (step < 20) step = step * 1.15;
				se.scrollTop = scroll;
				window.requestAnimationFrame(stepIt);
			}
			stepIt();
		}
		//var = rows[rows.length - 1].offsetTop + 1000;
		var visStep = 500 / (rows.length + 2) | 0;
		rows.forEach((row, i) => {
			allRows.push({
				row: row,
				top: row.offsetTop,
				bottom: row.offsetTop + row.offsetHeight,
				attached: true
			});
			setTimeout(() => {
				row.style.opacity = 1;
			}, (i + 1) * visStep);
		});
	});
}
setInterval(refresh, 500);

se.addEventListener('scroll', ev => {
	var screen = {
		top: wrapper.scrollTop + 5,
		bottom: wrapper.scrollTop + window.innerHeight
	};
	allRows.forEach((item, i) => {
		if (i === 0 || i === allRows.length - 1) return;
		if (item.top < screen.top && !item.attached) return;
		var vis = (item.bottom > screen.top && item.top < screen.bottom);
		if (vis !== item.attached) {
			item.attached = vis;
			if (vis) {
				content.appendChild(item.row);
			} else {
				content.removeChild(item.row);
			}
		}
	});
}, false);

window.addEventListener('hashchange', ev => {
	latest = 0;
	offsetTop = 5;
	numChildren = 0;
	rowCount = 1;
	allRows = [];
	content.innerHTML = '';
}, false);

document.getElementById('headline').addEventListener('click', ev => {
	se.scrollTop = se.scrollHeight;
}, false);