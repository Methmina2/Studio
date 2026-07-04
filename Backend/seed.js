const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');
const Rental = require('./models/Rental');

// Load .env from the current directory
dotenv.config({ path: path.join(__dirname, '.env') });

// Also fallback to process.env if already set
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ MONGO_URI is not defined in .env');
  console.error('Please create a .env file with MONGO_URI=mongodb+srv://...');
  process.exit(1);
}

console.log('🔗 Connecting to MongoDB...');

const Admin = require('./models/Admin');
const Service = require('./models/Service');
const Crew = require('./models/Crew');
const crewSeedData = require('./data/crewSeedData');

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Admin.deleteMany({});
    await Service.deleteMany({});

    // Create admin
    const admin = new Admin({
      email: 'admin@hotmello.com',
      password: await bcrypt.hash('admin123', 10),
    });
    await admin.save();
    console.log('✅ Admin created (admin@hotmello.com / admin123)');

    // Create services
    const services = [
        {
          type: 'wedding',
          title: 'Wedding',
          description: 'Capture every laugh, tear, and dance floor moment.',
          imageUrls: ['/images/wedding.png'],
          price: 'From $1,200',
          details: { bullets: ['Unlimited coverage', 'Print rights included'] },
        },
        {
          type: 'production',
          title: 'Production',
          description: 'Professional coverage for conferences and events.',
          imageUrls: ['/images/event.png'],
          price: 'From $800',
          details: { bullets: ['4-hour coverage', 'Digital gallery'] },
        },
        {
          type: 'rentals',
          title: 'Camera Rentals',
          description: 'Access top-tier gear.',
          imageUrls: ['/images/rental-camara.png'],
          price: 'From $150/day',
          details: { bullets: ['Latest models', 'Cleaning & inspection'] },
        },
        {
          type: 'studiolabs',
          title: 'Studio Rentals',
          description: 'Spacious studio with lighting and backdrops.',
          imageUrls: ['/images/studio.png'],
          price: 'From $200/hr',
          details: { bullets: ['Cyclorama wall', 'Lighting kit included'] },
        },
      ];

      await Crew.deleteMany({});
      await Rental.deleteMany({});

      const rentalItems = [
        {
      id: 1,
      name: '120cm Rectangular Softbox',
      category: 'Modifier',
      image: '/equipments/120cm rectangular.jpg',
      pricePerDay: 1900,
      description: 'Large rectangular softbox ideal for full-body portraits and product photography. Provides even, diffused light with a Bowens mount.',
      specs: ['120cm Width', 'Bowens Mount', 'Quick Setup', 'Diffuser Included'],
      available: true,
    },
    // 2. 1m reflector.webp
    {
      id: 2,
      name: '1m 5-in-1 Reflector',
      category: 'Modifier',
      image: '/equipments/1m reflector.webp',
      pricePerDay: 1000,
      description: 'Collapsible 5-in-1 reflector with white, silver, gold, black, and translucent surfaces for light manipulation.',
      specs: ['100cm Diameter', '5-in-1', 'Lightweight', 'Carrying Case'],
      available: true,
    },
    // 3. 24 IPS monitor.webp
    {
      id: 3,
      name: '24" IPS Monitor',
      category: 'Streaming',
      image: '/equipments/24 IPS monitor.webp',
      pricePerDay: 2000,
      description: 'Professional 24" IPS display for color-accurate monitoring and editing. 100% sRGB coverage.',
      specs: ['24" IPS Panel', 'Color Accurate', '100% sRGB', 'USB Hub'],
      available: true,
    },
    // 4. 360 photobooth.webp
    {
      id: 4,
      name: '360° Photobooth (5 Hours)',
      category: 'Photobooth',
      image: '/equipments/360 photobooth.webp',
      pricePerDay: 30000,
      description: 'Professional 360° motorized turntable with 5-person disk, ring light, and phone clamp. Includes operator and instant video delivery.',
      specs: ['100cm 5-person', '1 Operator', 'Instant Videos', 'Motorized 360° Spin'],
      available: true,
    },
    // 5. 60cm quick release parabolic.jpg
    {
      id: 5,
      name: '60cm Quick Release Parabolic Softbox',
      category: 'Modifier',
      image: '/equipments/60cm quick release parabolic.jpg',
      pricePerDay: 1500,
      description: 'Parabolic softbox with quick-release mechanism for fast setup. Creates flattering, directional light.',
      specs: ['60cm Diameter', 'Quick Release', 'Bowens Mount', 'Deep Parabolic'],
      available: true,
    },
    // 6. 65cm lantern soft box.jpg
    {
      id: 6,
      name: '65cm Lantern Softbox',
      category: 'Modifier',
      image: '/equipments/65cm lantern soft box.jpg',
      pricePerDay: 1400,
      description: 'Spherical 270° beam lantern softbox for omnidirectional, soft lighting – ideal for room fills and interviews.',
      specs: ['60cm', '270° Beam', 'Omnidirectional', 'Bowens Mount'],
      available: true,
    },
    // 7. 70-200mm f2.8  DG DN OS Sports.jpg
    {
      id: 7,
      name: 'Sigma 70-200mm f/2.8 DG DN OS Sports',
      category: 'Lens',
      image: '/equipments/70-200mm f2.8  DG DN OS Sports.jpg',
      pricePerDay: 7500,
      description: 'Pro-grade telephoto zoom lens with weather-sealed construction and optical stabilization for sports and wildlife.',
      specs: ['70-200mm', 'f/2.8', 'Optical Stabilizer', 'Weather Sealed'],
      available: true,
    },
    // 8. 85cm parabolic DL Diffuser.jpg
    {
      id: 8,
      name: '85cm Parabolic DL Diffuser',
      category: 'Modifier',
      image: '/equipments/85cm parabolic DL Diffuser.jpg',
      pricePerDay: 1500,
      description: 'Large parabolic softbox with integrated diffuser for ultra-soft, wrap‑around studio light.',
      specs: ['85cm Diameter', 'Deep Parabolic', 'DL Diffuser', 'Bowens Mount'],
      available: true,
    },
    // 9. 85mm f1.4 DG DN.jpg
    {
      id: 9,
      name: 'Sigma 85mm f/1.4 DG DN Art',
      category: 'Lens',
      image: '/equipments/85mm f1.4 DG DN.jpg',
      pricePerDay: 4500,
      description: 'Legendary portrait lens with massive f/1.4 aperture for razor-sharp details and breathtaking bokeh.',
      specs: ['85mm', 'f/1.4', 'DG DN Art', 'Razor Sharp'],
      available: true,
    },
    // 10. 85mm f1.4 DG HSM.jpg
    {
      id: 10,
      name: 'Sigma 85mm f/1.4 DG HSM Art',
      category: 'Lens',
      image: '/equipments/85mm f1.4 DG HSM.jpg',
      pricePerDay: 3400,
      description: 'Premium portrait lens with silky bokeh and sharp rendering, optimized for DSLRs.',
      specs: ['85mm', 'f/1.4', 'HSM AF', 'Weather Sealed'],
      available: true,
    },
    // 11. 90cm octagon.webp
    {
      id: 11,
      name: '90cm Octagon Softbox',
      category: 'Modifier',
      image: '/equipments/90cm octagon.webp',
      pricePerDay: 1000,
      description: 'Octagonal softbox for even, soft light distribution with attractive catchlights – great for group portraits.',
      specs: ['90cm Diameter', 'Octagonal Shape', 'Bowens Mount', 'Grid Available'],
      available: true,
    },
    // 12. A7 iv.jpg
    {
      id: 12,
      name: 'Sony A7 IV',
      category: 'Camera',
      image: '/equipments/A7 iv.jpg',
      pricePerDay: 7500,
      description: 'Full-frame 33MP mirrorless camera with advanced autofocus, 4K 60fps video, and weather-sealed body.',
      specs: ['33MP Full Frame', '4K 60fps', '693 AF Points', 'Weather Sealed'],
      available: true,
    },
    // 13. A7 S iii.jpg
    {
      id: 13,
      name: 'Sony A7S III',
      category: 'Camera',
      image: '/equipments/A7 S iii.jpg',
      pricePerDay: 9500,
      description: 'Ultra‑high‑sensitivity 12MP full‑frame camera optimized for low‑light and 4K 120fps video.',
      specs: ['12MP Full Frame', '4K 120fps', 'ISO 409600', '10‑stop ND Built‑in'],
      available: true,
    },
    // 14. AvMatrix Shark S6 HDMI SDI.jpg
    {
      id: 14,
      name: 'AvMatrix Shark S6 HDMI/SDI',
      category: 'Streaming',
      image: '/equipments/AvMatrix Shark S6 HDMI SDI.jpg',
      pricePerDay: 9000,
      description: 'Professional 6‑channel video mixer with HDMI and SDI inputs for multi‑camera live streaming.',
      specs: ['6 Input Channels', 'HDMI/SDI', 'Streaming Ready', 'USB Output'],
      available: true,
    },
    // 15. BM Atem Mini Pro ISO.jpg
    {
      id: 15,
      name: 'Blackmagic ATEM Mini Pro ISO',
      category: 'Streaming',
      image: '/equipments/BM Atem Mini Pro ISO.jpg',
      pricePerDay: 8000,
      description: 'Compact 4‑channel live production switcher with hardware controls and ISO recording for each input.',
      specs: ['4 HDMI Inputs', 'Hardware Controls', 'ISO Recording', 'Streaming Ready'],
      available: true,
    },
    // 16. DJI Mavic 4 Pro Drone with Fly More Combo.jpg
    {
      id: 16,
      name: 'DJI Mavic 3 Pro',
      category: 'Drone',
      image: '/equipments/DJI Mavic 4 Pro Drone with Fly More Combo.jpg',
      pricePerDay: 25000,
      description: 'Flagship triple‑lens drone with 4/3" Hasselblad sensor, 7x zoom, and 46‑minute flight time.',
      specs: ['Triple‑Lens Camera', '4/3" Hasselblad Sensor', '5.1K Video', '46 mins Flight Time'],
      available: true,
    },
    // 17. DJI Mavic 5 PRO Fly more.jpg
    {
      id: 17,
      name: 'DJI Mini 5 Pro',
      category: 'Drone',
      image: '/equipments/DJI Mavic 5 PRO Fly more.jpg',
      pricePerDay: 15000,
      description: 'Ultra‑portable drone with 1/1.3" CMOS, 4K/60fps HDR, and omnidirectional obstacle avoidance.',
      specs: ['4K/60fps HDR', '48MP Photos', 'Omnidirectional Obstacle Avoidance', '28 mins Flight Time'],
      available: true,
    },
    // 18. DJI Mic 2 2.jpg
    {
      id: 18,
      name: 'DJI Mic 2 Wireless Kit',
      category: 'Audio',
      image: '/equipments/DJI Mic 2 2.jpg',
      pricePerDay: 3000,
      description: 'Premium 2‑channel wireless mic system with intelligent noise canceling and 32‑bit float audio.',
      specs: ['2 Transmitters', 'Intelligent Noise Canceling', 'Charging Case', '32‑bit Float Audio'],
      available: true,
    },
    // 19. DJI Osmo Pocket 3.jpg
    {
      id: 19,
      name: 'DJI Osmo Pocket 3',
      category: 'Camera',
      image: '/equipments/DJI Osmo Pocket 3.jpg',
      pricePerDay: 4500,
      description: 'Pocket‑sized 4K gimbal camera with 1" CMOS sensor and rotatable touchscreen.',
      specs: ['1" CMOS Sensor', '4K/120fps', 'ActiveTrack 6.0', '2" Touchscreen'],
      available: true,
    },
    // 20. DJI RC pro ( Live controller ).jpg
    {
      id: 20,
      name: 'DJI RC Pro Live Controller',
      category: 'Drone',
      image: '/equipments/DJI RC pro ( Live controller ).jpg',
      pricePerDay: 16000,
      description: 'Advanced remote controller with integrated display for intelligent flight and 5G video.',
      specs: ['Integrated Display', 'Long Range', 'Intelligent Flight', '5G Video'],
      available: true,
    },
    // 21. DJI Ronin S4.jpg
    {
      id: 21,
      name: 'DJI Ronin S4 Gimbal',
      category: 'Gimbal',
      image: '/equipments/DJI Ronin S4.jpg',
      pricePerDay: 6000,
      description: 'Carbon fibre 3‑axis stabilizer with 4.5kg payload, automated axis locks, and SuperSmooth mode.',
      specs: ['4.5kg Payload', 'Automated Axis Locks', 'Carbon Fiber', 'SuperSmooth Mode'],
      available: true,
    },
    // 22. Feel-world F5 Pro V4 on camera screen.jpg
    {
      id: 22,
      name: 'Feelworld F5 Pro V4 Monitor',
      category: 'Monitor',
      image: '/equipments/Feel-world F5 Pro V4 on camera screen.jpg',
      pricePerDay: 2000,
      description: 'Lightweight 5.5" 4K HDMI field monitor with focus peaking, false colour, and histogram tools.',
      specs: ['5.5" IPS', '1920x1080', '4K HDMI', 'Focus Peaking'],
      available: true,
    },
    // 23. Go Pro black 12.jpg
    {
      id: 23,
      name: 'GoPro Hero 12 Black',
      category: 'Camera',
      image: '/equipments/Go Pro black 12.jpg',
      pricePerDay: 4000,
      description: 'Rugged action camera with 5.3K video, advanced stabilization, and waterproof design.',
      specs: ['5.3K Video', 'Rugged Build', 'Advanced Stabilization', 'Waterproof'],
      available: true,
    },
    // 24. Godox 380F Heavy-Duty Light Stand.jpg
    {
      id: 24,
      name: 'Heavy Duty Light Stand',
      category: 'Tripod',
      image: '/equipments/Godox 380F Heavy-Duty Light Stand.jpg',
      pricePerDay: 800,
      description: 'Heavy‑duty 380cm stand with 5kg payload, locking knobs, and counterweight ready.',
      specs: ['380cm Height', '5kg Payload', 'Locking Knobs', 'Counterweight Ready'],
      available: true,
    },
    // 25. Godox AD600BM II.jpg
    {
      id: 25,
      name: 'Godox AD600 Pro',
      category: 'Lighting',
      image: '/equipments/Godox AD600BM II.jpg',
      pricePerDay: 3200,
      description: 'Powerful 600Ws portable strobe with Bowens mount, built‑in X system, and fast recycling.',
      specs: ['600Ws', 'Bowens Mount', 'Built‑in X System', 'Fast Recycling'],
      available: true,
    },
    // 26. Godox LC500 mini.jpg
    {
      id: 26,
      name: 'Godox LC500 Mini LED',
      category: 'Lighting',
      image: '/equipments/Godox LC500 mini.jpg',
      pricePerDay: 2500,
      description: 'Compact 500W bi‑color LED panel with DMX control – portable yet powerful.',
      specs: ['500W Output', 'Bi‑Color', '2800‑6500K', 'DMX Control'],
      available: true,
    },
    // 27. Godox LC500 pro.jpg
    {
      id: 27,
      name: 'Godox LC500 Pro LED',
      category: 'Lighting',
      image: '/equipments/Godox LC500 pro.jpg',
      pricePerDay: 3500,
      description: 'Professional 500W bi‑color LED panel with advanced wireless and DMX control.',
      specs: ['500W Output', 'Bi‑Color', 'Wireless Control', 'DMX Support'],
      available: true,
    },
    // 28. Godox LEDP260C continuous.jpg
    {
      id: 28,
      name: 'Godox LEDP260C Continuous LED',
      category: 'Lighting',
      image: '/equipments/Godox LEDP260C continuous.jpg',
      pricePerDay: 1400,
      description: 'Slim 260W continuous LED panel with smooth dimming and colour temperature adjustment.',
      specs: ['260W Power', 'Smooth Dimming', 'Color Adjustable', 'Ultra Slim'],
      available: true,
    },
    // 29. Godox LiteMons square Light mini.webp
    {
      id: 29,
      name: 'Godox LiteMons Square Light Mini',
      category: 'Lighting',
      image: '/equipments/Godox LiteMons square Light mini.webp',
      pricePerDay: 500,
      description: 'Portable square RGBWW LED light with app control and built‑in battery for creative colour effects.',
      specs: ['RGBWW Colors', 'Portable Design', 'App Control', 'Built‑in Battery'],
      available: true,
    },
    // 30. Godox SK 400.jpg
    {
      id: 30,
      name: 'Godox SK400 Studio Flash',
      category: 'Lighting',
      image: '/equipments/Godox SK 400.jpg',
      pricePerDay: 2400,
      description: '400Ws compact flash head with modelling lamp and built‑in radio receiver for silent operation.',
      specs: ['400Ws Power', 'Modeling Lamp', 'Radio Receiver', 'Silent Operation'],
      available: true,
    },
    // 31. Godox SL 300.jpg
    {
      id: 31,
      name: 'Godox SL 300 Bi LED',
      category: 'Lighting',
      image: '/equipments/Godox SL 300.jpg',
      pricePerDay: 4000,
      description: 'High‑output 300W bi‑colour LED spotlight with Bowens mount, flicker‑free and efficient cooling.',
      specs: ['300W', '2800‑6500K', 'Bowens Mount', 'Flicker‑Free'],
      available: true,
    },
    // 32. Godox V860III [S].jpg
    {
      id: 32,
      name: 'Godox V860III [S] Speedlight',
      category: 'Lighting',
      image: '/equipments/Godox V860III [S].jpg',
      pricePerDay: 1400,
      description: 'TTL/HSS speedlite with 2600mAh battery, 2.4G wireless, and modelling lamp – perfect for events.',
      specs: ['TTL/HSS', '2600mAh Battery', '2.4G Wireless', 'LED Modeling Lamp'],
      available: true,
    },
    // 33. Godox X3 [S].jpg
    {
      id: 33,
      name: 'Godox X3 Wireless Flash Trigger [S]',
      category: 'Lighting',
      image: '/equipments/Godox X3 [S].jpg',
      pricePerDay: 1500,
      description: '2.4G wireless trigger for Sony cameras with HSS and TTL support.',
      specs: ['2.4G Wireless', 'HSS/TTL', 'Radio Receiver', 'Fast Sync'],
      available: true,
    },
    // 34. GoPro Enduro Battery charger.jpg
    {
      id: 34,
      name: 'GoPro Enduro Battery Charger',
      category: 'Battery',
      image: '/equipments/GoPro Enduro Battery charger.jpg',
      pricePerDay: 200,
      description: 'Official dual‑charger for GoPro Enduro batteries – charges two simultaneously with LED indicators.',
      specs: ['Dual Charger', 'Fast Charging', 'LED Indicators'],
      available: true,
    },
    // 35. GoPro Enduro Battery.jpg
    {
      id: 35,
      name: 'GoPro Enduro Battery',
      category: 'Battery',
      image: '/equipments/GoPro Enduro Battery.jpg',
      pricePerDay: 300,
      description: 'Extended‑capacity battery for GoPro cameras – 2x longer in cold weather.',
      specs: ['Extended Capacity', 'Cold Weather', 'Long Life'],
      available: true,
    },
    // 36. Hollyland Cosmo C2 - U1.jpg
    {
      id: 36,
      name: 'Hollyland Cosmo C2 U1',
      category: 'Streaming',
      image: '/equipments/Hollyland Cosmo C2 - U1.jpg',
      pricePerDay: 8000,
      description: 'Professional 1080p wireless video transmission system with 300m range and low latency.',
      specs: ['1080p Video', '300m Range', 'Low Latency', 'Dual Antenna'],
      available: true,
    },
    // 37. Hollyland Intercom Pro X6.jpg
    {
      id: 37,
      name: 'Hollyland Intercom Pro X6',
      category: 'Streaming',
      image: '/equipments/Hollyland Intercom Pro X6.jpg',
      pricePerDay: 10000,
      description: 'Wireless 6‑channel intercom system with 500m range for professional crew communication.',
      specs: ['6 Channels', 'Wireless', '500m Range', 'Professional Grade'],
      available: true,
    },
    // 38. Hollyland PYRO H.jpg
    {
      id: 38,
      name: 'Hollyland PYRO H Wireless Video',
      category: 'Streaming',
      image: '/equipments/Hollyland PYRO H.jpg',
      pricePerDay: 7500,
      description: 'Lightweight 4K wireless video transmitter with 1000m range and ultra‑low latency.',
      specs: ['4K Capable', '1000m Range', 'Low Latency', 'Compact'],
      available: true,
    },
    // 39. Hollyland Tally Unit X4.jpg
    {
      id: 39,
      name: 'Hollyland Tally Unit X4',
      category: 'Streaming',
      image: '/equipments/Hollyland Tally Unit X4.jpg',
      pricePerDay: 2500,
      description: 'Wireless tally light system with 4 units for multi‑camera on‑air indication.',
      specs: ['4 Units', 'Wireless', 'Low Power', 'Professional'],
      available: true,
    },
    // 40. LS 360 AT Light Stand.jpg
    {
      id: 40,
      name: 'Light Weight Light Stand',
      category: 'Tripod',
      image: '/equipments/LS 360 AT Light Stand.jpg',
      pricePerDay: 500,
      description: 'Air‑cushioned 360cm light stand with smooth height adjustment – lightweight and portable.',
      specs: ['360cm Height', 'Air Cushioned', 'Lightweight', 'Smooth Operation'],
      available: true,
    },
    // 41. Product Photography Box.webp
    {
      id: 41,
      name: 'Product Photography Box',
      category: 'Accessories',
      image: '/equipments/Product Photography Box.webp',
      pricePerDay: 2000,
      description: 'Portable lightbox with diffused LED lighting, multiple backdrops, and quick setup for product photography.',
      specs: ['Portable', 'Diffused Light', 'Multiple Backdrops', 'Quick Setup'],
      available: true,
    },
    // 42. Rode VideoMic NTG Shotgun Mic.jpg
    {
      id: 42,
      name: 'Rode VideoMic NTG Shotgun Mic',
      category: 'Audio',
      image: '/equipments/Rode VideoMic NTG Shotgun Mic.jpg',
      pricePerDay: 1000,
      description: 'Professional on‑camera shotgun mic with supercardioid pattern, Rycote shock mount, and internal battery.',
      specs: ['Supercardioid', 'Rycote Shockmount', '3.5mm Output', 'Internal Battery'],
      available: true,
    },
    // 43. sigma 14-24mm f2.8 DG HSM.jpg
    {
      id: 43,
      name: 'Sigma 14-24mm f/2.8 DG HSM Art',
      category: 'Lens',
      image: '/equipments/sigma 14-24mm f2.8 DG HSM.jpg',
      pricePerDay: 4000,
      description: 'Ultra‑wide zoom with constant f/2.8 aperture – perfect for landscapes and interiors.',
      specs: ['14-24mm', 'f/2.8', 'HSM AF', 'Weather Sealed'],
      available: true,
    },
    // 44. Sigma 24-70mm f2.8 DG DN II Art.jpg
    {
      id: 44,
      name: 'Sigma 24-70mm f/2.8 DG DN Art',
      category: 'Lens',
      image: '/equipments/Sigma 24-70mm f2.8 DG DN II Art.jpg',
      pricePerDay: 4800,
      description: 'Premium fast‑aperture standard zoom with exceptional sharpness and beautiful bokeh.',
      specs: ['24-70mm', 'f/2.8', 'DG DN Art', 'Fast AF'],
      available: true,
    },
    // 45. Sigma 35mm f1.4 DG DN Art.jpg
    {
      id: 45,
      name: 'Sigma 35mm f/1.4 DG DN Art',
      category: 'Lens',
      image: '/equipments/Sigma 35mm f1.4 DG DN Art.jpg',
      pricePerDay: 4000,
      description: 'Wide‑angle prime with silent AF and compact design – excellent for environmental portraits.',
      specs: ['35mm', 'f/1.4', 'Compact Design', 'Silent AF'],
      available: true,
    },
    // 46. Sigma 35mm f1.4 DG HSM Art.jpg
    {
      id: 46,
      name: 'Sigma 35mm f/1.4 DG HSM Art',
      category: 'Lens',
      image: '/equipments/Sigma 35mm f1.4 DG HSM Art.jpg',
      pricePerDay: 3500,
      description: 'Professional‑grade 35mm prime with robust build and exceptional optical quality.',
      specs: ['35mm', 'f/1.4', 'Weather Sealed', 'HSM AF'],
      available: true,
    },
    // 47. sigma 50mm f1.4 DG DN.jpg
    {
      id: 47,
      name: 'Sigma 50mm f/1.4 DG DN Art',
      category: 'Lens',
      image: '/equipments/sigma 50mm f1.4 DG DN.jpg',
      pricePerDay: 4000,
      description: 'Versatile fast 50mm prime with high‑thrust AF motor for documentary and portraiture.',
      specs: ['50mm', 'f/1.4', 'High‑Thrust AF', 'Classic FOV'],
      available: true,
    },
    // 48. Sirui Heavy-duty tripod + Fluid head.jpg
    {
      id: 48,
      name: 'Sirui Heavy-Duty Tripod with Fluid Head',
      category: 'Tripod',
      image: '/equipments/Sirui Heavy-duty tripod + Fluid head.jpg',
      pricePerDay: 4500,
      description: 'Heavy‑duty tripod with fluid drag head, adjustable pan/tilt friction, and mid‑level spreader for smooth video panning.',
      specs: ['Fluid Head', 'Adjustable Friction', 'Heavy Duty', 'Mid‑Level Spreader'],
      available: true,
    },
    // 49. Sony NPF970 charger.jpg
    {
      id: 49,
      name: 'Sony NP-F970 Charger',
      category: 'Battery',
      image: '/equipments/Sony NPF970 charger.jpg',
      pricePerDay: 200,
      description: 'Dual‑channel charger for Sony NP‑F batteries with fast charging and LCD display.',
      specs: ['Dual Channel', 'Fast Charging', 'LCD Display'],
      available: true,
    },
    // 50. Sony NPFZ100 charger.jpg
    {
      id: 50,
      name: 'Sony NP-FZ100 Charger',
      category: 'Battery',
      image: '/equipments/Sony NPFZ100 charger.jpg',
      pricePerDay: 200,
      description: 'Charger for Sony NP‑FZ100 batteries – dual‑slot for simultaneous charging.',
      specs: ['NPFZ100 Compatible', 'Dual Slot', 'Fast Charging'],
      available: true,
    },
    // 51. Sony NPFZ100.jpg
    {
      id: 51,
      name: 'Sony NP-FZ100 Battery',
      category: 'Battery',
      image: '/equipments/Sony NPFZ100.jpg',
      pricePerDay: 300,
      description: 'Genuine 2280mAh InfoLITHIUM Z‑series battery for Sony Alpha cameras with charge indicator.',
      specs: ['2280mAh', 'InfoLITHIUM', 'Z‑Series'],
      available: true,
    },
    // 52. Sony PXW Z200.jpg
    {
      id: 52,
      name: 'Sony PXW-Z200 Camcorder',
      category: 'Camera',
      image: '/equipments/Sony PXW Z200.jpg',
      pricePerDay: 25000,
      description: 'Professional 4K camcorder with Exmor R sensor, compact design, and XQD card support.',
      specs: ['4K DCI', 'Compact Design', 'Image Stabilization', 'XQD Card Support'],
      available: true,
    },
    // 53. Sony PXW Z280.jpg
    {
      id: 53,
      name: 'Sony PXW-Z280 Camcorder',
      category: 'Camera',
      image: '/equipments/Sony PXW Z280.jpg',
      pricePerDay: 30000,
      description: 'Advanced 4K camcorder with enhanced zoom, low‑light performance, and SSD recording.',
      specs: ['4K DCI', 'Enhanced Zoom', 'Low‑Light Performance', 'SSD Recording'],
      available: true,
    },
    // 54. Sony-NP-F970.webp
    {
      id: 54,
      name: 'Sony NP-F970 Battery',
      category: 'Battery',
      image: '/equipments/Sony-NP-F970.webp',
      pricePerDay: 500,
      description: 'High‑capacity 7800mAh battery compatible with Sony cameras and accessories.',
      specs: ['7800mAh', 'High Capacity', 'Compatible'],
      available: true,
    },
    // 55. Telycam 4K PTZ Camera.jpg
    {
      id: 55,
      name: 'Telycam 4K PTZ Camera',
      category: 'Streaming',
      image: '/equipments/Telycam 4K PTZ Camera.jpg',
      pricePerDay: 15000,
      description: 'Professional 4K pan‑tilt‑zoom camera with remote control – ideal for streaming and conferences.',
      specs: ['4K Resolution', 'PTZ Control', 'USB 3.0', 'Remote Operation'],
      available: true,
    },
    // 56. Universal Tripod Dolly.jpg
    {
      id: 56,
      name: 'Universal Tripod Dolly',
      category: 'Tripod',
      image: '/equipments/Universal Tripod Dolly.jpg',
      pricePerDay: 500,
      description: 'Wheeled dolly with locking casters for smooth, precision tripod and light stand movements.',
      specs: ['360° Wheels', 'Universal Fit', 'Smooth Motion', 'Locking Casters'],
      available: true,
    },
    // 57. Walkie Talkie.jpg
    {
      id: 57,
      name: 'Walkie Talkie Set',
      category: 'Streaming',
      image: '/equipments/Walkie Talkie.jpg',
      pricePerDay: 2000,
      description: 'Professional‑grade UHF/VHF walkie talkies for clear crew communication on set.',
      specs: ['UHF/VHF', 'Professional Range', 'Clear Audio', 'Durable'],
      available: true,
    },
    // 58. ZSYB 500W RGBW Plug in light.webp
    {
      id: 58,
      name: 'ZSYB 500W RGBW Plug‑in Light',
      category: 'Lighting',
      image: '/equipments/ZSYB 500W RGBW Plug in light.webp',
      pricePerDay: 4000,
      description: 'High‑power 500W RGBW LED panel with full colour control – studio‑grade performance.',
      specs: ['500W Output', 'RGBW Colors', 'Full Control', 'Professional Grade'],
      available: true,
    },
    // 59. ZSYB 50W RGB.webp
    {
      id: 59,
      name: 'ZSYB 50W RGB Light',
      category: 'Lighting',
      image: '/equipments/ZSYB 50W RGB.webp',
      pricePerDay: 3000,
      description: 'Versatile handheld RGBWW tube light with barn doors for precise light shaping and creative colour.',
      specs: ['RGBWW', 'Full Color Control', 'Barn Doors', 'Internal Battery'],
      available: true,
    },
    // 60. ZSYB Curtain 150W.webp
    {
      id: 60,
      name: 'ZSYB Curtain 150W LED',
      category: 'Lighting',
      image: '/equipments/ZSYB Curtain 150W.webp',
      pricePerDay: 3500,
      description: 'Flexible curtain‑style LED panel with full RGB control for large area lighting effects.',
      specs: ['150W Output', 'Flexible Design', 'RGB Colors', 'Dimmable'],
      available: true,
    },
    // 61. ZSYB YB200 stick Light.webp
    {
      id: 61,
      name: 'ZSYB YB200 Stick Light',
      category: 'Lighting',
      image: '/equipments/ZSYB YB200 stick Light.webp',
      pricePerDay: 1500,
      description: 'Handheld RGBW stick light for creative lighting, light painting, and location work.',
      specs: ['RGBW Colors', 'Handheld', 'Wireless Control', 'Internal Battery'],
      available: true,
    },
    {
      id: 62,
      name: 'DJI Ronin S5 Gimbal',
      category: 'Gimbal',
      image: '/equipments/DJI Ronin S5.jpg',
      pricePerDay: 6000,
      description: 'Professional 3-axis handheld gimbal stabilizer with carbon fiber construction, a 4.5kg payload capacity, and a detachable sling grip for ultra-low angle shots. Features SuperSmooth stabilization and automated axis locks.',
      specs: ['4.5kg Payload', 'Detachable Sling Grip', 'Carbon Fiber', 'SuperSmooth Mode', 'Automated Axis Locks'],
      available: true,
    },
    ];


    for (const svc of services) {
      const service = new Service(svc);
      await service.save();
    }
    console.log('✅ Services seeded (4 types)');

    for (const item of rentalItems) {
      const rental = new Rental(item);
      await rental.save();
    }
    console.log('✅ Rentals seeded');

    for (const member of crewSeedData) {
      const crew = new Crew(member);
      await crew.save();
    }
    console.log('✅ Crew seeded');

    console.log('✅ Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();