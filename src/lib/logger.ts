type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
  private isProduction = process.env.NODE_ENV === 'production';

  private formatMessage(level: LogLevel, message: string, data?: any) {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}] ${message} ${data ? JSON.stringify(data) : ''}`;
  }

  info(message: string, data?: any) {
    if (!this.isProduction) {
      console.info(this.formatMessage('info', message, data));
    }
    // In production, integrate with Sentry/Logtail here
  }

  warn(message: string, data?: any) {
    console.warn(this.formatMessage('warn', message, data));
  }

  error(message: string, error?: Error | unknown, data?: any) {
    const errorData = {
      ...data,
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name
      } : error
    };
    
    console.error(this.formatMessage('error', message, errorData));
    
    // Fallback: Sentry.captureException(error)
  }

  debug(message: string, data?: any) {
    if (!this.isProduction) {
      console.debug(this.formatMessage('debug', message, data));
    }
  }
}

export const logger = new Logger();
