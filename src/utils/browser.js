import puppeteer from 'puppeteer';
import { logger } from './logger.js';

export async function setupBrowser() {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    logger.info('Browser launched successfully');
    return browser;
  } catch (error) {
    logger.error('Failed to launch browser:', error);
    throw error;
  }
}