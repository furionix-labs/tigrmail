declare class Logger {
    private static prefix;
    static info(message: any, ...optionalParams: any[]): void;
    static error(message: any, ...optionalParams: any[]): void;
}
export default Logger;
