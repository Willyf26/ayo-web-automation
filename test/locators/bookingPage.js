export const BookingPage = {
  // Login Page
  loginEmailInput: '#email',
  loginPasswordInput: '#password',
  loginButton: 'button[type="submit"]',

  // Booking Page
  sewaLapanganButton: '//div[contains(text(), "Sewa Lapangan")]',
  kotaInput: '//input[@id="country_name"]',
  sportDropdown: '//span[@id="cabor"]',
  cariVenueButton: '//button[@id="submitSearchSparring"]',
  venueFirstResult: '//div[@id="venue-1369"]',
  cekKetersediaanButton: '//button[contains(text(), "Cek Ketersediaan")]',
  lapanganOption: (name) => `//div[@field-name="${name}"]`,
  notificationFull: '//div[contains(text(), "sudah full")]'
};
