import { logger } from '../utils/logger.js';
import { notify } from '../utils/notifications.js';

export class EmbassyBookingBot {
  constructor(browser) {
    this.browser = browser;
    this.page = null;
  }

  async initialize() {
    this.page = await this.browser.newPage();
    await this.page.setViewport({ width: 1280, height: 800 });
    logger.info('Bot initialized');
  }

  async login() {
    try {
      await this.page.goto(process.env.EMBASSY_URL);
      
      // Wait for login form
      await this.page.waitForSelector('#username');
      await this.page.waitForSelector('#password');
      
      // Fill login credentials
      await this.page.type('#username', process.env.USERNAME);
      await this.page.type('#password', process.env.PASSWORD);
      
      // Click login button
      await this.page.click('button[type="submit"]');
      
      logger.info('Login successful');
    } catch (error) {
      logger.error('Login failed:', error);
      throw error;
    }
  }

  async searchForSlots() {
    try {
      // Wait for appointment page to load
      await this.page.waitForSelector('.appointment-calendar');
      
      // Check for available slots
      const slots = await this.page.evaluate(() => {
        const availableSlots = document.querySelectorAll('.available-slot');
        return Array.from(availableSlots).map(slot => ({
          date: slot.getAttribute('data-date'),
          time: slot.getAttribute('data-time')
        }));
      });

      if (slots.length > 0) {
        logger.info('Available slots found:', slots);
        notify('Embassy Appointment Bot', 'Available appointment slots found!');
        
        // Attempt to book the first available slot
        await this.bookSlot(slots[0]);
      } else {
        logger.info('No available slots found');
      }
    } catch (error) {
      logger.error('Error searching for slots:', error);
      throw error;
    }
  }

  async bookSlot(slot) {
    try {
      // Click on the available slot
      await this.page.click(`[data-date="${slot.date}"][data-time="${slot.time}"]`);
      
      // Wait for confirmation button and click it
      await this.page.waitForSelector('.confirm-booking');
      await this.page.click('.confirm-booking');
      
      logger.info('Slot booked successfully:', slot);
      notify('Embassy Appointment Bot', 'Appointment booked successfully!');
    } catch (error) {
      logger.error('Error booking slot:', error);
      throw error;
    }
  }
}