import debug from 'debug';

const BASE = 'app';
const STORAGE_KEY = 'app_logging_enabled';

// Initialize logging state from localStorage if available
const getInitialState = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      return stored === 'true';
    }
  }
  // Default to enabled in development, disabled in production
  return process.env.NODE_ENV === 'development';
};

let isEnabled = getInitialState();

// Configure debug based on initial state
if (isEnabled) {
  debug.enable(`${BASE}:*`);
} else {
  debug.disable();
}

const logger = {
  // Namespaced loggers
  component: debug(`${BASE}:component`),
  auth: debug(`${BASE}:auth`),
  api: debug(`${BASE}:api`),
  state: debug(`${BASE}:state`),
  router: debug(`${BASE}:router`),
  error: debug(`${BASE}:error`),

  // Enable all logging
  enable() {
    isEnabled = true;
    debug.enable(`${BASE}:*`);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(STORAGE_KEY, 'true');
    }
    this.component('Logging enabled');
  },

  // Disable all logging
  disable() {
    isEnabled = false;
    debug.disable();
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(STORAGE_KEY, 'false');
    }
    console.log('Logging disabled'); // Use console.log since debug is disabled
  },

  // Check if logging is enabled
  isEnabled() {
    return isEnabled;
  },

  // Log with timestamp and additional context
  log(namespace, message, data) {
    if (!isEnabled) return;

    const logger = this[namespace] || this.component;
    if (data) {
      logger(`${message}`, data);
    } else {
      logger(message);
    }
  },
};

export default logger;
