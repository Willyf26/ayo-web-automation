import fs from 'fs';
import path from 'path';
import allure from '@wdio/allure-reporter';

export const afterStep = async function(test, scenario, { error, duration, passed }) {
  if (!passed) {
    const screenshotPath = path.resolve('./screenshots/error.png');
    await browser.saveScreenshot(screenshotPath);
    allure.addAttachment('Screenshot Gagal', fs.readFileSync(screenshotPath), 'image/png');
  }
};
