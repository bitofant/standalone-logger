"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
class LogFile {
    constructor(filename) {
        this.filename = filename;
    }
    load(finished) {
        fs_1.default.exists(this.filename, exists => {
            if (!exists) {
                var fileCreatedEntry = {
                    t: Date.now(),
                    n: 'logger',
                    c: 'blue',
                    m: `log file created at "${this.filename}"`
                };
                fs_1.default.writeFile(this.filename, JSON.stringify(fileCreatedEntry), 'utf8', err => {
                    finished([fileCreatedEntry]);
                });
            }
            else {
                fs_1.default.readFile(this.filename, 'utf8', (err, data) => {
                    if (err)
                        throw err;
                    var entries = JSON.parse('[' + data + ']');
                    finished(entries);
                });
            }
        });
    }
    append(entries, done) {
        var data = [];
        entries.forEach(entry => {
            data.push(JSON.stringify(entry));
        });
        fs_1.default.appendFile(this.filename, ',\n' + data.join(',\n'), 'utf8', err => {
            done(err);
        });
    }
}
exports.LogFile = LogFile;
exports.default = LogFile;
//# sourceMappingURL=file-persistance.js.map