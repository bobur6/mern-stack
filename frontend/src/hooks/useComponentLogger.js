import { useEffect, useRef } from 'react';
import logger from '../utils/logger';

/**
 * Hook for logging component lifecycle events
 * @param {string} componentName - Name of the component
 * @param {Object} props - Optional props to log
 */
const useComponentLogger = (componentName, props = {}) => {
  const mountTimeRef = useRef(Date.now());
  const renderCountRef = useRef(0);

  // Log initial render
  useEffect(() => {
    if (logger.isEnabled()) {
      renderCountRef.current += 1;
      logger.component(`${componentName} mounted`, {
        timestamp: new Date().toISOString(),
        props: Object.keys(props).length > 0 ? props : undefined,
      });
    }

    // Log unmount and calculate component lifespan
    return () => {
      if (logger.isEnabled()) {
        const unmountTime = Date.now();
        const lifespan = unmountTime - mountTimeRef.current;

        logger.component(`${componentName} unmounted`, {
          timestamp: new Date().toISOString(),
          lifespan: `${lifespan}ms`,
          renderCount: renderCountRef.current,
        });
      }
    };
  }, [componentName, props]);

  // Log re-renders
  useEffect(() => {
    if (renderCountRef.current > 0 && logger.isEnabled()) {
      logger.component(`${componentName} re-rendered`, {
        renderCount: renderCountRef.current + 1,
      });
    }
    renderCountRef.current += 1;
  });
};

export default useComponentLogger;
