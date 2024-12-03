import notifier from 'node-notifier';
import { logger } from './logger.js';

export function notify(title, message) {
  notifier.notify({
    title,
    message,
    sound: true
  });
  
  logger.info('Notification sent:', { title, message });
}