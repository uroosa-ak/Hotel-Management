/* End-to-end smoke test driven through the real UI against the real API. */
const { chromium } = require('playwright');

const OUT = process.argv[2];
const BASE = process.argv[3] || 'http://localhost:5173';

const ACCOUNTS = {
  guest: ['guest@luxurystay.com', 'GuestPassword123!'],
  housekeeping: ['housekeeping@luxurystay.com', 'HousekeepingPass123!'],
  receptionist: ['reception@luxurystay.com', 'StaffPassword123!'],
  manager: ['manager@luxurystay.com', 'ManagerPassword123!'],
  admin: ['admin@luxurystay.com', 'AdminPassword123!'],
};

const results = [];
const record = (name, pass, detail = '') => {
  results.push({ name, pass, detail });
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? ' :: ' + detail : ''}`);
};

async function login(page, role) {
  const [email, password] = ACCOUNTS[role];
  await page.goto(BASE + '/login', { waitUntil: 'networkidle' });
  await page.fill('#login-email', email);
  await page.fill('#login-password', password);
  await Promise.all([
    page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 15000 }).catch(() => {}),
    page.click('button[type="submit"]'),
  ]);
  await page.waitForTimeout(1200);
  return page.url();
}

async function logout(page) {
  await page.evaluate(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  });
}

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push('CONSOLE: ' + m.text().slice(0, 160));
  });

  // ---- public pages -------------------------------------------------------
  for (const [name, path] of [
    ['01-home', '/'],
    ['02-rooms', '/rooms'],
    ['03-about', '/about'],
    ['04-services', '/services'],
    ['05-contact', '/contact'],
    ['06-login', '/login'],
    ['07-register', '/register'],
  ]) {
    await page.goto(BASE + path, { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(900);
    await page.screenshot({ path: `${OUT}\\${name}.png` });
  }

  const roomCards = await page.goto(BASE + '/rooms', { waitUntil: 'networkidle' })
    .then(() => page.waitForTimeout(1200))
    .then(() => page.locator('.e-loop-item').count());
  record('Rooms listing shows seeded rooms', roomCards === 6, `${roomCards} cards`);

  // ---- guest booking flow -------------------------------------------------
  const afterLogin = await login(page, 'guest');
  record('Guest can log in', !afterLogin.includes('/login'), afterLogin);

  await page.goto(BASE + '/rooms', { waitUntil: 'networkidle' });
  await page.waitForTimeout(900);
  await page.locator('.e-loop-item a').first().click();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${OUT}\\08-roomdetail.png` });

  const reserve = page.locator('button:has-text("Reserve this room")');
  const canReserve = await reserve.count();
  record('Room detail offers reservation', canReserve > 0);

  if (canReserve) {
    await reserve.click();
    await page.waitForTimeout(1800);

    // Unique dates per run so a repeat run isn't rejected by the (correct)
    // double-booking guard.
    const offset = 30 + Math.floor(Math.random() * 300);
    const day = (n) => new Date(Date.now() + n * 86400000).toISOString().split('T')[0];
    const dateInputs = page.locator('input[type="date"]');
    if (await dateInputs.count()) {
      await dateInputs.nth(0).fill(day(offset));
      await dateInputs.nth(1).fill(day(offset + 3));
    }
    await page.screenshot({ path: `${OUT}\\09-booking-form.png` });

    const submit = page.locator('form button[type="submit"]').last();
    if (await submit.count()) {
      await submit.click();
      await page.waitForTimeout(2600);
      await page.screenshot({ path: `${OUT}\\10-booking-result.png` });
      const confirmed = await page.locator('text=Reservation Confirmed').count();
      record('Booking submits and confirms', confirmed > 0, page.url());
    } else {
      record('Booking submits and confirms', false, 'no submit button');
    }
  }

  await page.goto(BASE + '/my-bookings', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1600);
  await page.screenshot({ path: `${OUT}\\11-my-bookings.png` });
  const bookingRows = await page.locator('text=/Check-In/i').count();
  record('My Bookings lists the reservation', bookingRows > 0, `${bookingRows} matches`);

  // guest must not reach the staff portal
  await page.goto(BASE + '/admin', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  record('Guest is blocked from /admin', !page.url().includes('/admin'), page.url());

  await logout(page);

  // ---- staff portals ------------------------------------------------------
  for (const role of ['housekeeping', 'receptionist', 'manager', 'admin']) {
    const url = await login(page, role);
    record(`${role} can log in`, !url.includes('/login'), url);

    await page.goto(BASE + '/admin', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1800);
    await page.screenshot({ path: `${OUT}\\20-admin-${role}.png` });
    const onAdmin = page.url().includes('/admin');
    record(`${role} reaches the staff portal`, onAdmin, page.url());
    await logout(page);
  }

  // ---- admin sections -----------------------------------------------------
  await login(page, 'admin');
  for (const [name, path] of [
    ['21-admin-dashboard', '/admin'],
    ['22-admin-rooms', '/admin/rooms'],
    ['23-admin-bookings', '/admin/bookings'],
    ['24-admin-users', '/admin/users'],
    ['25-admin-checkin', '/admin/check-in-out'],
    ['26-admin-housekeeping', '/admin/housekeeping'],
  ]) {
    await page.goto(BASE + path, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1800);
    await page.screenshot({ path: `${OUT}\\${name}.png` });
  }

  const userRows = await page.goto(BASE + '/admin/users', { waitUntil: 'networkidle' })
    .then(() => page.waitForTimeout(1500))
    .then(() => page.locator('tbody tr').count());
  record('Admin user directory lists accounts', userRows >= 5, `${userRows} rows`);

  const adminRoomRows = await page.goto(BASE + '/admin/rooms', { waitUntil: 'networkidle' })
    .then(() => page.waitForTimeout(1500))
    .then(() => page.locator('tbody tr').count());
  record('Admin room list shows rooms', adminRoomRows >= 6, `${adminRoomRows} rows`);

  const adminBookingRows = await page.goto(BASE + '/admin/bookings', { waitUntil: 'networkidle' })
    .then(() => page.waitForTimeout(1500))
    .then(() => page.locator('tbody tr').count());
  record('Admin bookings list shows the guest booking', adminBookingRows >= 1, `${adminBookingRows} rows`);

  console.log('\n===== SUMMARY =====');
  const failed = results.filter((r) => !r.pass);
  console.log(`${results.length - failed.length}/${results.length} checks passed`);
  if (failed.length) console.log('FAILED: ' + failed.map((f) => f.name).join(' | '));
  const uniqueErrors = [...new Set(errors)];
  console.log('CONSOLE/PAGE ERRORS:', JSON.stringify(uniqueErrors.slice(0, 10), null, 2));

  await browser.close();
})();
