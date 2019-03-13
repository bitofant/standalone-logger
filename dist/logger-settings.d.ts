import { LogEntry } from "./log";
declare class LoggerSettings {
    chopSize: number;
    logfileWriteInterval: number;
    useSystemStringification: boolean;
    private _linesInMemory;
    private _logfile;
    private _defaultColor;
    private defaultColorIndex;
    private readonly pendingLogfileEntries;
    defaultColor: 'black' | 'red' | 'green' | 'yellow' | 'blue' | 'magenta' | 'cyan' | 'white';
    logfile: string;
    linesInMemory: number;
    appendToLogfile(entry: LogEntry): void;
    private logfileWriter;
}
declare const settings: LoggerSettings;
export default settings;
export { settings, LoggerSettings };
