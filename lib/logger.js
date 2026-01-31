/**
 * Logger utilities
 */

// Log levels
const LOG_LEVELS = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3
  };
  
  // Current log level (can be changed at runtime)
  let currentLevel = LOG_LEVELS.INFO;
  
  /**
   * Set the current log level
   * @param {string} level - Log level (DEBUG, INFO, WARN, ERROR)
   */
  export function setLogLevel(level) {
    if (LOG_LEVELS[level] !== undefined) {
      currentLevel = LOG_LEVELS[level];
    }
  }
  
  /**
   * Format log message
   * @param {string} level - Log level
   * @param {string} message - Log message
   * @param {Object} data - Additional data
   * @returns {string} Formatted log message
   */
  function formatLog(level, message, data) {
    const timestamp = new Date().toISOString();
    const dataStr = data ? ` ${JSON.stringify(data)}` : '';
    return `[${timestamp}] [${level}] ${message}${dataStr}`;
  }
  
  /**
   * Log debug message
   * @param {string} message - Log message
   * @param {Object} data - Additional data
   */
  export function debug(message, data) {
    if (currentLevel <= LOG_LEVELS.DEBUG) {
      console.debug(formatLog('DEBUG', message, data));
    }
  }
  
  /**
   * Log info message
   * @param {string} message - Log message
   * @param {Object} data - Additional data
   */
  export function info(message, data) {
    if (currentLevel <= LOG_LEVELS.INFO) {
      console.info(formatLog('INFO', message, data));
    }
  }
  
  /**
   * Log warning message
   * @param {string} message - Log message
   * @param {Object} data - Additional data
   */
  export function warn(message, data) {
    if (currentLevel <= LOG_LEVELS.WARN) {
      console.warn(formatLog('WARN', message, data));
    }
  }
  
  /**
   * Log error message
   * @param {string} message - Log message
   * @param {Object} data - Additional data
   */
  export function error(message, data) {
    if (currentLevel <= LOG_LEVELS.ERROR) {
      console.error(formatLog('ERROR', message, data));
    }
  }