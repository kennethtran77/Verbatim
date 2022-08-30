export interface Logger {
    info: (...log: any) => void;
    warn: (...log: any) => void;
    error: (...log: any) => void;
}

const useConsoleLogger = (env: 'dev' | 'prod'): Logger => ({
    info: (...log: any) => env === 'dev' ? console.info(...log) : {},
    warn: (...log: any) => env === 'dev' ? console.warn(...log) : {},
    error: (...log: any) => console.error(...log),
});

export default useConsoleLogger;