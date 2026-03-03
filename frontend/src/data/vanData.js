// frontend/src/data/vanData.js
// Shared van fleet data used by Booking page and VanDetail page

// S3 image base URL
export const S3_BASE = 'https://ntxvanrentals.s3.us-east-2.amazonaws.com';
export const s3 = (folder, file) => `${S3_BASE}/${encodeURIComponent(folder)}/${encodeURIComponent(file)}`;

// Van 1: American Coach Patriot (21 images)
const van1Images = [
  '084952', '085051', '085105', '085119', '085139', '085154', '085213',
  '085226', '085240', '085254', '085309', '085323', '085339', '085358',
  '085412', '085459', '085514', '085529', '085546', '085600', '085638',
].map(t => s3('2019 Mercedes Benz Sprinter 3500 - American Coach', `Screenshot 2025-12-26 ${t}.png`));

// Van 2: Executive Custom Build (20 images)
const van2Images = [
  'Capture.JPG', ...Array.from({ length: 19 }, (_, i) => `Capture${i + 1}.JPG`),
].map(f => s3('2022 Mercedes Benz Sprinter W1X8ED3Y7NP477617', f));

// Van 3: Legends Executive (17 images)
const van3Images = [
  '094834', '094904', '094938', '094955', '095018', '095032', '095046',
  '095102', '095120', '095134', '095148', '095213', '095226', '095242',
  '095305', '095319', '095343',
].map(t => s3('Legends Executive', `Screenshot 2025-12-26 ${t}.png`));

// Van 4: Legends All Terrain Executive (20 images)
const van4Images = [
  '174620', '174700', '174717', '174805', '174821', '174837', '174854',
  '174917', '174953', '175007', '175021', '175037', '175052', '175106',
  '175121', '175142', '175156', '175215', '175229', '175257',
].map(t => s3('LEGENDS ALL TERRAIN EXECUTIVE', `Screenshot 2026-02-06 ${t}.png`));

// Van 5: Executive Shuttle (13 images)
const van5Images = [
  '092609', '092636', '092650', '092705', '092718', '092734', '092757',
  '092834', '092848', '092902', '092916', '092936', '092956',
].map(t => s3('WDZPF0CD6KP126126 U12MDc', `Screenshot 2026-01-31 ${t}.png`));

// Van 6: Kirk Johnson X4 Shuttle (19 images)
const van6Images = [
  'Capture.JPG', ...Array.from({ length: 18 }, (_, i) => `Capture${i + 1}.JPG`),
].map(f => s3('kirkjohnsonX4 ', f));

// Real fleet data
const mockVans = [
  {
    _id: '1',
    name: 'American Coach Patriot',
    type: 'Sprinter',
    year: 2019,
    seating: 6,
    description: '2019 Mercedes Benz Sprinter 3500 — RV-style luxury coach with full living amenities including kitchen, bathroom, and entertainment system.',
    features: [
      'Overhead Cabinets', 'HD LED TV', 'Lagun Table', 'Rear Lounge Couch with Jack Knife Couches',
      'Swiveling Captains Chairs', 'Microwave', 'Fridge', 'Cooktop with Pantry',
      'Shower & Toilet', 'Entry Step', 'Mosquito Netting Close Door', 'Flip Up Computer Tables',
      'Wardrobe Closet', 'Heat & Massage for All Captains Chairs', 'Molded Low Profile Spoiler',
      'Wireless Internet & Apple TV', 'Air Ride Suspension', 'Hot Water Heater',
      'Window Shades', 'Upgraded Flooring',
    ],
    thumbnailImage: van1Images[0],
    images: van1Images.slice(1),
    pricing: {
      hourlyRate: 69,
      dailyRate: 549,
      weeklyRate: 2745,
      deposit: 750,
      insuranceFee: 100,
      destinationFee: 50,
      minimumHours: 4,
    },
    availability: true,
  },
  {
    _id: '2',
    name: 'Executive Custom Build',
    type: 'Sprinter',
    year: 2022,
    seating: 10,
    description: '2022 Mercedes Benz Sprinter custom executive build with dual entertainment screens and convertible sleeping configuration.',
    features: [
      '2 Jack Knife Couches (fold to bed)', '4 Swivel Captains', '2 Front Swivel Captains (swivel to back)',
      '32" + 50" Smart TVs', 'Surround Sound', 'Ambient Lighting',
      'Fiberglass Running Boards & Body Kit', 'Starlink WiFi',
      'Tray Tables', 'Removable Mounted Tables',
    ],
    thumbnailImage: van2Images[0],
    images: van2Images.slice(1),
    pricing: {
      hourlyRate: 59,
      dailyRate: 469,
      weeklyRate: 2345,
      deposit: 500,
      insuranceFee: 75,
      destinationFee: 50,
      minimumHours: 4,
    },
    availability: true,
  },
  {
    _id: '3',
    name: 'Legends Executive',
    type: 'Sprinter',
    year: 2024,
    seating: 12,
    description: 'Mercedes Benz Sprinter with AWD, 360 camera, and seating for 12 — built for executive group travel with premium driver-assist technology.',
    features: [
      '4 Swiveling Captains Chairs', '2 Power Recline Captains', 'Pull Out Dometic Coolers',
      '2 Smart TVs 4K', '2 Jack Knife Couches', 'Power Running Boards', 'AWD',
      'Storage for 15 Large Suitcases', 'Rear Couches Fold to Bed', 'Heated Front Seating (swivels to back)',
      'Removable Floor Mounted Tables', 'Tray Tables (Laptop Tables)', 'Power Door', '360 Cam',
      'Driver Assist', 'Blind Spot', 'Wolf Rear View Camera', 'Apple Car Play', 'Starlink WiFi',
    ],
    thumbnailImage: van3Images[0],
    images: van3Images.slice(1),
    pricing: {
      hourlyRate: 62,
      dailyRate: 497,
      weeklyRate: 2485,
      deposit: 500,
      insuranceFee: 75,
      destinationFee: 50,
      minimumHours: 4,
    },
    availability: true,
  },
  {
    _id: '4',
    name: 'Legends All Terrain Executive',
    type: 'Sprinter',
    year: 2025,
    seating: 10,
    description: '2025 Mercedes Benz Sprinter AWD — brand new with only 15 total miles. Starlight headliner, off-road wheels, and full towing capability.',
    features: [
      'Starlight Headliner', 'Power Captains with Power Recline', 'USB Ports Throughout',
      'Privacy Shades', 'Ambient Lighting', 'Rear HVAC', 'Heated Front Seating', 'AWD',
      'Black Rhino Wheels', '32" Smart TV 4K', '43" Smart TV 4K', 'Rear Storage',
      'Ladder Rack', 'Roof Rack', 'Rear Tire Holder & Rack', 'Tow Hitch & HD Towing',
      'Kicker Surround Sound', 'Streaming', 'Starlink WiFi', 'Apple Car Play',
    ],
    thumbnailImage: van4Images[0],
    images: van4Images.slice(1),
    pricing: {
      hourlyRate: 59,
      dailyRate: 469,
      weeklyRate: 2345,
      deposit: 500,
      insuranceFee: 75,
      destinationFee: 50,
      minimumHours: 4,
    },
    availability: true,
  },
  {
    _id: '5',
    name: 'Executive Shuttle',
    type: 'Sprinter',
    year: 2020,
    seating: 15,
    description: 'Mercedes Benz Sprinter 15-passenger shuttle — professional shuttle configuration ideal for group transport. x4 units available.',
    features: [
      '15-Passenger Capacity', 'Professional Shuttle Configuration',
      'Climate Control', 'Comfortable Seating',
    ],
    thumbnailImage: van5Images[0],
    images: van5Images.slice(1),
    pricing: {
      hourlyRate: 38,
      dailyRate: 300,
      weeklyRate: 1500,
      deposit: 500,
      insuranceFee: 75,
      destinationFee: 50,
      minimumHours: 4,
    },
    availability: true,
  },
  {
    _id: '6',
    name: 'Executive Sprinter Shuttle',
    type: 'Sprinter',
    year: 2020,
    seating: 15,
    description: 'Mercedes Benz Sprinter 15-passenger shuttle with diamond-stitched seating, premium wood flooring, and entertainment system. x4 units available.',
    features: [
      'Diamond-Stitched Executive Seating', 'Premium Wood Flooring',
      'Ambient LED Lighting', 'Surround Sound', '24" Entertainment Screen',
      'USB Charging Throughout', 'AMG-Style Grille', 'Upgraded LED Lighting',
      'Premium Running Boards', 'Wolfbox Backup Camera',
    ],
    thumbnailImage: van6Images[0],
    images: van6Images.slice(1),
    pricing: {
      hourlyRate: 52,
      dailyRate: 419,
      weeklyRate: 2095,
      deposit: 500,
      insuranceFee: 75,
      destinationFee: 50,
      minimumHours: 4,
    },
    availability: true,
  },
];

export default mockVans;
