import log, { LogEntry } from "./log";
import LogFile from './file-persistance';

class LoggerSettings {
	public chopSize : number = 1000;
	public logfileWriteInterval : number = 5000;
	public useSystemStringification : boolean = false;
	private _linesInMemory : number = 50000;
	private _logfile : LogFile = null;

	private readonly pendingLogfileEntries : LogEntry[] = [];

	get logfile () : string {
		return this._logfile.filename;
	}
	set logfile (file : string) {
		if (file === null) {
			this._logfile = null;
		} else {
			if (this._logfile === null) {
				setTimeout(() => this.logfileWriter(), this.logfileWriteInterval);
			}
			this._logfile = new LogFile(file);
			this._logfile.load(entries => {
				if (entries.length > this._linesInMemory) {
					entries.splice(0, entries.length - this._linesInMemory);
				}
				log.unshift(...entries);
			});
		}
	}

	get linesInMemory () : number {
		return this._linesInMemory;
	}
	set linesInMemory (num : number) {
		this._linesInMemory = num;
	}

	public appendToLogfile (entry : LogEntry) {
		if (this._logfile === null) return;
	}

	private logfileWriter () {
		if (this._logfile === null) return;
		if (this.pendingLogfileEntries.length === 0) {
			setTimeout(() => this.logfileWriter(), this.logfileWriteInterval);
		} else {
			const numberOfEntriesToPersist = this.pendingLogfileEntries.length;
			this._logfile.append(this.pendingLogfileEntries, err => {
				if (err) {
					console.error('could not persist log entries ' + err.stack);
				} else {
					this.pendingLogfileEntries.splice(0, numberOfEntriesToPersist);
				}
				setTimeout(() => this.logfileWriter(), this.logfileWriteInterval);
			});
		}
	}

}


const settings = new LoggerSettings();
export default settings;
export { settings, LoggerSettings };
