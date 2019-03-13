import { LogEntry } from "./log";
import fs from "fs";


class LogFile {
	constructor (public readonly filename : string) { }

	public load (finished : (entries : LogEntry[]) => void) {
		fs.exists(this.filename, exists => {
			if (!exists) {
				var fileCreatedEntry : LogEntry = {
					t: Date.now(),
					n: 'logger',
					c: 'blue',
					m: `log file created at "${this.filename}"`
				}
				fs.writeFile(this.filename, JSON.stringify(fileCreatedEntry), 'utf8', err => {
					finished([fileCreatedEntry]);
				});
			} else {
				fs.readFile(this.filename, 'utf8', (err, data) => {
					if (err) throw err;
					var entries = JSON.parse('[' + data + ']');
					finished(entries);
				});
			}
		});
	}

	public append (entries : LogEntry[], done : (err : Error) => void) {
		var data = [];
		entries.forEach (entry => {
			data.push(JSON.stringify(entry));
		});
		fs.appendFile(this.filename, ',\n' + data.join(',\n'), 'utf8', err => {
			done(err);
		});
	}
}

export default LogFile;
export { LogFile };
