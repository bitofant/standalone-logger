/// <reference types="node" />
import settings from "./logger-settings";
declare const colors: {
    black: string;
    red: string;
    green: string;
    yellow: string;
    blue: string;
    magenta: string;
    cyan: string;
    white: string;
    dim: string;
    reset: string;
};
declare function Logger(loggerID: string | NodeJS.Module | {
    toString: () => string;
}, defaultColor?: 'black' | 'red' | 'green' | 'yellow' | 'blue' | 'magenta' | 'cyan' | 'white'): (msg: string | number | object | Error, color?: "black" | "red" | "green" | "yellow" | "blue" | "magenta" | "cyan" | "white") => void;
declare function loggerExpressEndpoint(req: any, res: any, next: any): void;
export { Logger, loggerExpressEndpoint, colors as LoggingColor, settings as LoggerSettings };
export default Logger;
