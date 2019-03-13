import { LogEntry } from "./log";
declare class LogFile {
    readonly filename: string;
    constructor(filename: string);
    load(finished: (entries: LogEntry[]) => void): void;
    append(entries: LogEntry[], done: (err: Error) => void): void;
}
export default LogFile;
export { LogFile };
