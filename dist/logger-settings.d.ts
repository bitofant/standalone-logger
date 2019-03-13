import { LogEntry } from "./log";
declare class LoggerSettings {
    chopSize: number;
    logfileWriteInterval: number;
    useSystemStringification: boolean;
    private _linesInMemory;
    private _logfile;
    private readonly pendingLogfileEntries;
    logfile: string;
    linesInMemory: number;
    appendToLogfile(entry: LogEntry): void;
    private logfileWriter;
}
declare const settings: LoggerSettings;
export default settings;
export { settings, LoggerSettings };
