import { env } from './common/env.js';
import { logger } from './common/logger.js';
import { app } from './server.js';

const { PORT, NODE_ENV } = env;

const server = app.listen(PORT, () => {
  logger.info(`Server (${NODE_ENV}) started on ${PORT} port`);
});

const onCloseSignal = (): void => {
  logger.info('SIGTERM received, shutting down gracefully');

  // Stop accepting incoming requests. Existing in-flight requests are allowed to finish
  server.close(() => {
    logger.info('Server closed');
    process.exit(0); // Success
  });

  // Force shutdown after 30s if requests are still hanging
  setTimeout(() => {
    logger.error('Forcing shutdown after timeout');
    process.exit(1); // Error due to forced shutdown
  }, 30_000).unref();
};

process.on('SIGTERM', onCloseSignal);
process.on('SIGINT', onCloseSignal);
