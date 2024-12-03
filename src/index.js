import { setupBrowser } from './utils/browser.js';
import { EmbassyBookingBot } from './bot/embassyBot.js';
import { logger } from './utils/logger.js';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  try {
    const browser = await setupBrowser();
    const bot = new EmbassyBookingBot(browser);
    
    await bot.initialize();
    await bot.login();
    await bot.searchForSlots();
    
    await browser.close();
  } catch (error) {
    logger.error('Error in main execution:', error);
    process.exit(1);
  }
}

main();