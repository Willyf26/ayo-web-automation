import { Given, When, Then } from '@wdio/cucumber-framework';
import { BookingPage } from '../locators/bookingPage.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { addAttachment } from '@wdio/allure-reporter';

// Setup path untuk JSON
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const bookingDataPath = path.resolve(__dirname, '../data/bookingData.json');
const bookingData = JSON.parse(fs.readFileSync(bookingDataPath, 'utf-8'));

// Pastikan folder screenshots lokal ada
const screenshotsDir = path.resolve(__dirname, '../screenshots');
if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir);

// Helper function untuk screenshot ke Allure
async function attachScreenshot(name) {
    const screenshot = await browser.takeScreenshot();
    addAttachment(name, Buffer.from(screenshot, 'base64'), 'image/png');
}

Given('user membuka website AYO', async () => {
    await browser.url('https://ayo.co.id');
    await browser.pause(2000);
    await attachScreenshot('Buka Website AYO');
});

When('user login menggunakan data dari JSON', async () => {
    const { email, password } = bookingData.user;
    await $(BookingPage.loginEmailInput).setValue(email);
    await $(BookingPage.loginPasswordInput).setValue(password);
    await $(BookingPage.loginButton).click();
    await browser.pause(3000);
    await attachScreenshot('Login Berhasil');
});

Then('user melakukan booking lapangan berdasarkan JSON', async () => {
    for (const booking of bookingData.booking) {
        console.log(`🔍 Booking untuk ${booking.sport} di ${booking.city} pada ${booking.time} tanggal ${booking.date}`);

        // --- Pilih kota ---
        await $(BookingPage.sewaLapanganButton).click();
        await $(BookingPage.kotaInput).setValue(booking.city);
        await browser.keys('Enter');
        await attachScreenshot(`Pilih Kota: ${booking.city}`);

        // --- Pilih olahraga ---
        await $(BookingPage.sportDropdown).click();
        await browser.pause(1000);
        const sportOption = await $(
            `//a[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '${booking.sport.toLowerCase()}')]`
        );
        await sportOption.waitForDisplayed({ timeout: 5000 });
        await sportOption.click();
        console.log(`✅ Olahraga dipilih: ${booking.sport}`);
        await attachScreenshot(`Pilih Olahraga: ${booking.sport}`);

        // --- Cari venue ---
        await $(BookingPage.cariVenueButton).click();
        await browser.pause(2000);
        await $(BookingPage.venueFirstResult).click();
        await $(BookingPage.cekKetersediaanButton).click();
        await browser.pause(2000);
        await attachScreenshot(`Venue & Ketersediaan`);

        // --- Klik kalender dan pilih tanggal ---
        await $('//img[@id="field-full-calendar-btn"]').click();
        await browser.pause(1000);

        const [year, month, day] = booking.date.split('-');
        const dateSelector = `//div[@id='ffci-${year}-${month}-${day}' and @is-available='1']`;
        const dateElement = await $(dateSelector);

        if (await dateElement.isExisting()) {
            await dateElement.scrollIntoView({ block: 'center' });
            await dateElement.click();
            console.log(`📅 Tanggal dipilih: ${booking.date}`);
            await attachScreenshot(`Pilih Tanggal: ${booking.date}`);
        } else {
            const reason = `❌ Tanggal ${booking.date} tidak tersedia (full booked)`;
            console.log(reason);
            await attachScreenshot(reason);
            continue; // skip booking berikutnya
        }

        // --- Pilih lapangan ---
        const lapanganName = booking.fieldName || 'Lapangan 1';
        const lapangan = await $(BookingPage.lapanganOption(lapanganName));
        if (!(await lapangan.isExisting())) {
            const reason = `❌ ${lapanganName} tidak tersedia (full booked)`;
            console.log(reason);
            await attachScreenshot(reason);
            continue;
        }
        await lapangan.scrollIntoView({ block: 'center' });
        await browser.pause(500);
        await lapangan.click();
        await browser.pause(1000);
        await attachScreenshot(`Pilih Lapangan: ${lapanganName}`);

        // --- Cek jam ---
        const jamSelector = `.//div[contains(text(),"${booking.time}")]`;
        const jamElement = await lapangan.$(jamSelector);

        if (!(await jamElement.isExisting())) {
            const reason = `❌ Jam ${booking.time} tidak tersedia di ${lapanganName} (full booked)`;
            console.log(reason);
            await attachScreenshot(reason);
            continue;
        }

        const jamClass = await jamElement.getAttribute('class');
        if (jamClass && jamClass.includes('booked')) {
            const reason = `❌ ${lapanganName} di ${booking.date} pada jam ${booking.time} sudah dibooking (full booked)`;
            console.log(reason);
            await attachScreenshot(reason);
            continue;
        }

        // --- Booking berhasil ---
        await jamElement.scrollIntoView({ block: 'center' });
        await jamElement.click();
        console.log(`✅ Berhasil booking ${lapanganName} pada jam ${booking.time}`);
        await attachScreenshot(`Booking Berhasil: ${lapanganName} - ${booking.time}`);

        await browser.pause(1500);
    }
});
