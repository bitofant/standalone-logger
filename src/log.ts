interface LogEntry {
	n: string;
	t: number;
	m: string;
	c: 'black' | 'red' | 'green' | 'yellow' | 'blue' | 'magenta' | 'cyan' | 'white';
}

const log : Array<LogEntry> = [];

export default log;
export { log, LogEntry };
