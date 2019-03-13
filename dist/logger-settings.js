"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const log_1 = __importDefault(require("./log"));
const file_persistance_1 = __importDefault(require("./file-persistance"));
const defaultColorOrder = [
    'white',
    'cyan',
    'red',
    'yellow',
    'magenta',
    'green',
    'blue'
];
class LoggerSettings {
    constructor() {
        this.chopSize = 1000;
        this.logfileWriteInterval = 5000;
        this.useSystemStringification = false;
        this._linesInMemory = 50000;
        this._logfile = null;
        this._defaultColor = null;
        this.defaultColorIndex = 0;
        this.pendingLogfileEntries = [];
    }
    get defaultColor() {
        var c = defaultColorOrder[this.defaultColorIndex++];
        if (this.defaultColorIndex >= defaultColorOrder.length)
            this.defaultColorIndex = 0;
        return c;
    }
    set defaultColor(color) {
        this._defaultColor = color;
    }
    get logfile() {
        return this._logfile.filename;
    }
    set logfile(file) {
        if (file === null) {
            this._logfile = null;
        }
        else {
            if (this._logfile === null) {
                setTimeout(() => this.logfileWriter(), this.logfileWriteInterval);
            }
            this._logfile = new file_persistance_1.default(file);
            this._logfile.load(entries => {
                if (entries.length > this._linesInMemory) {
                    entries.splice(0, entries.length - this._linesInMemory);
                }
                log_1.default.unshift(...entries);
            });
        }
    }
    get linesInMemory() {
        return this._linesInMemory;
    }
    set linesInMemory(num) {
        this._linesInMemory = num;
    }
    appendToLogfile(entry) {
        if (this._logfile === null)
            return;
    }
    logfileWriter() {
        if (this._logfile === null)
            return;
        if (this.pendingLogfileEntries.length === 0) {
            setTimeout(() => this.logfileWriter(), this.logfileWriteInterval);
        }
        else {
            const numberOfEntriesToPersist = this.pendingLogfileEntries.length;
            this._logfile.append(this.pendingLogfileEntries, err => {
                if (err) {
                    console.error('could not persist log entries ' + err.stack);
                }
                else {
                    this.pendingLogfileEntries.splice(0, numberOfEntriesToPersist);
                }
                setTimeout(() => this.logfileWriter(), this.logfileWriteInterval);
            });
        }
    }
}
exports.LoggerSettings = LoggerSettings;
const settings = new LoggerSettings();
exports.settings = settings;
exports.default = settings;
//# sourceMappingURL=logger-settings.js.map