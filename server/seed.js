/**
 * Seeds the database with the demo staff/guest accounts and a starter set of
 * rooms so the application can be demonstrated end to end.
 *
 *   npm run seed          - adds anything missing, leaves existing data alone
 *   npm run seed -- --reset  - wipes users/rooms/bookings/guests first
 */
require('dotenv').config();
const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('./models/User');
const Room = require('./models/Room');
const Booking = require('./models/Booking');
const Guest = require('./models/Guest');

const DEMO_USERS = [
  {
    firstName: 'Amelia',
    lastName: 'Hart',
    username: 'admin',
    email: 'admin@luxurystay.com',
    password: 'AdminPassword123!',
    role: 'admin',
    phone: '+15551110001',
  },
  {
    firstName: 'Daniel',
    lastName: 'Cole',
    username: 'manager',
    email: 'manager@luxurystay.com',
    password: 'ManagerPassword123!',
    role: 'manager',
    phone: '+15551110002',
  },
  {
    firstName: 'Sofia',
    lastName: 'Reyes',
    username: 'reception',
    email: 'reception@luxurystay.com',
    password: 'StaffPassword123!',
    role: 'receptionist',
    phone: '+15551110003',
  },
  {
    firstName: 'Marta',
    lastName: 'Novak',
    username: 'housekeeping',
    email: 'housekeeping@luxurystay.com',
    password: 'HousekeepingPass123!',
    role: 'housekeeping',
    phone: '+15551110004',
  },
  {
    firstName: 'James',
    lastName: 'Whitfield',
    username: 'guest',
    email: 'guest@luxurystay.com',
    password: 'GuestPassword123!',
    role: 'guest',
    phone: '+15551110005',
  },
];

const DEMO_ROOMS = [
  {
    roomNumber: '101',
    name: 'Basic Queen Room',
    roomType: 'single',
    floor: 1,
    capacity: 1,
    size: 20,
    bedType: 'Queen',
    view: 'Courtyard',
    price: 120,
    status: 'available',
    description:
      'A calm, light-filled room with a queen bed, writing desk and rainfall shower - ideal for the solo traveller.',
    amenities: ['High-speed Wi-Fi', 'Air Conditioning', 'Smart TV', 'Kettle', 'Safe'],
    images: ['/images/rooms/room-01.jpg'],
  },
  {
    roomNumber: '102',
    name: 'Standard Double Room',
    roomType: 'double',
    floor: 1,
    capacity: 2,
    size: 26,
    bedType: 'King',
    view: 'Garden',
    price: 165,
    status: 'available',
    description:
      'Contemporary comfort with a king bed, seating nook and garden outlook, finished in warm natural materials.',
    amenities: ['High-speed Wi-Fi', 'Air Conditioning', 'Smart TV', 'Mini Bar', 'Coffee Machine'],
    images: ['/images/rooms/room-02.jpg'],
  },
  {
    roomNumber: '201',
    name: 'Deluxe Ocean Room',
    roomType: 'deluxe',
    floor: 2,
    capacity: 2,
    size: 34,
    bedType: 'King',
    view: 'Ocean',
    price: 245,
    status: 'available',
    description:
      'Floor-to-ceiling windows framing the bay, a king bed dressed in linen, and a marble bath with soaking tub.',
    amenities: ['High-speed Wi-Fi', 'Balcony', 'Ocean View', 'Mini Bar', 'Bathtub', 'Room Service'],
    images: ['/images/rooms/room-03.jpg'],
  },
  {
    roomNumber: '202',
    name: 'Deluxe Family Room',
    roomType: 'deluxe',
    floor: 2,
    capacity: 4,
    size: 42,
    bedType: 'King + Twin',
    view: 'Garden',
    price: 290,
    status: 'available',
    description:
      'A generous family retreat with a separate twin alcove, family bathroom and direct access to the garden terrace.',
    amenities: ['High-speed Wi-Fi', 'Air Conditioning', 'Smart TV', 'Family Bathroom', 'Terrace'],
    images: ['/images/rooms/room-04.jpg'],
  },
  {
    roomNumber: '301',
    name: 'Executive Suite',
    roomType: 'suite',
    floor: 3,
    capacity: 3,
    size: 58,
    bedType: 'King + Sofa Bed',
    view: 'Skyline',
    price: 420,
    status: 'available',
    description:
      'A suite with a separate lounge, dining table for four and a private balcony overlooking the skyline.',
    amenities: ['High-speed Wi-Fi', 'Separate Lounge', 'Balcony', 'Nespresso Bar', 'Bathtub', 'Butler Service'],
    images: ['/images/rooms/room-05.jpg'],
  },
  {
    roomNumber: '401',
    name: 'Penthouse Suite',
    roomType: 'suite',
    floor: 4,
    capacity: 4,
    size: 96,
    bedType: 'Master King + Queen',
    view: 'Panoramic Coast',
    price: 780,
    status: 'available',
    description:
      'The top floor in its entirety: wrap-around terrace, plunge pool, chef-ready kitchen and panoramic coastal views.',
    amenities: ['Private Plunge Pool', 'Wrap-around Terrace', 'Butler Service', 'Kitchenette', 'Wine Cooler'],
    images: ['/images/rooms/room-06.jpg'],
  },
];

async function seed() {
  const uri = process.env.MONGO_URI || process.env.DBURI;
  if (!uri) {
    console.error('MONGO_URI is not set. Add it to server/.env first.');
    process.exit(1);
  }

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
  console.log(`Connected to ${mongoose.connection.host}/${mongoose.connection.name}`);

  const reset = process.argv.includes('--reset');
  if (reset) {
    await Promise.all([
      User.deleteMany({}),
      Room.deleteMany({}),
      Booking.deleteMany({}),
      Guest.deleteMany({}),
    ]);
    console.log('Cleared users, rooms, bookings and guests.');
  }

  for (const demo of DEMO_USERS) {
    const existing = await User.findOne({ email: demo.email });
    const hashed = await bcrypt.hash(demo.password, 10);

    if (existing) {
      // Keep demo logins usable even if someone changed them while testing.
      existing.password = hashed;
      existing.role = demo.role;
      existing.isActive = true;
      await existing.save();
      console.log(`Updated ${demo.role.padEnd(13)} ${demo.email}`);
    } else {
      await User.create({
        ...demo,
        password: hashed,
        contact: demo.phone,
        isActive: true,
      });
      console.log(`Created ${demo.role.padEnd(13)} ${demo.email}`);
    }
  }

  for (const room of DEMO_ROOMS) {
    const existing = await Room.findOne({ roomNumber: room.roomNumber });
    if (existing) {
      console.log(`Room ${room.roomNumber} already exists - skipped`);
      continue;
    }
    await Room.create({
      ...room,
      availability: room.status === 'available',
      image: room.images[0],
    });
    console.log(`Created room ${room.roomNumber} (${room.name})`);
  }

  console.log('\nDemo accounts:');
  DEMO_USERS.forEach((u) => console.log(`  ${u.role.padEnd(13)} ${u.email.padEnd(32)} ${u.password}`));

  await mongoose.disconnect();
  console.log('\nSeed complete.');
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
