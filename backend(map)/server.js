/**
 * server.js — CityFix Dummy Backend
 *
 * Run:   node server.js
 * Needs: npm install express cors
 *
 * Endpoints:
 *   GET  /                      → health check
 *   POST /api/login             → returns a dummy JWT token
 *   POST /api/signup            → dummy signup
 *   GET  /api/complaints        → returns all complaints (supports ?lat=&lng= filter)
 *   POST /api/complaints        → add a new complaint
 */

const express = require('express');
const cors    = require('cors');

const app  = express();
const PORT = 3000;

// ── Middleware ───────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static('../src'));  // serves your frontend files

// ── Hardcoded complaint data ─────────────────────────────────
// Coordinates are near Dehradun (based on your original server).
// status can be: "pending" | "in-progress" | "resolved"
// area is the neighbourhood label shown on the complaint card.
const COMPLAINTS = [
  {
    _id: "1",
    title: 'Pothole on Main Road',
    description: 'Large pothole near the bus stop causing damage to bikes and vehicles. Has been here for over 2 weeks.',
    status: 'pending',
    area: 'Rajpur Road',
    lat: 30.2856,
    lng: 78.0300,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    _id: "2",
    title: 'Garbage Not Collected',
    description: 'Garbage has not been collected for several days. It is causing a bad smell and is a health hazard for nearby residents.',
    status: 'in-progress',
    area: 'Clock Tower',
    lat: 30.2864,
    lng: 78.0312,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
  },
  {
    _id: "3",
    title: 'Broken Street Light',
    description: 'Street light near the main road has not been working for 4 days. The area is very dark and unsafe at night.',
    status: 'resolved',
    area: 'Paltan Bazaar',
    lat: 30.2849,
    lng: 78.0294,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
  },
  {
    _id: "4",
    title: 'Water Pipe Leakage',
    description: 'Water pipe is leaking on the street. Water is being wasted and the road is slippery, causing risk of accidents.',
    status: 'pending',
    area: 'Dalanwala',
    lat: 30.2869,
    lng: 78.0287,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
  {
    _id: "5",
    title: 'Footpath Blocked by Stalls',
    description: 'Illegal stalls have encroached onto the footpath. Pedestrians are forced to walk on the road, which is dangerous.',
    status: 'in-progress',
    area: 'Nehru Colony',
    lat: 30.2840,
    lng: 78.0320,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
  },
  {
    _id: "6",
    title: 'Stray Dogs Near Market',
    description: 'A pack of stray dogs near the market area is posing a safety risk, especially to children and elderly people.',
    status: 'pending',
    area: 'Gandhi Road',
    lat: 30.2875,
    lng: 78.0308,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
  },
];

// ── Routes ───────────────────────────────────────────────────

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'CityFix backend running', port: PORT });
});

// ── Auth: Signup ─────────────────────────────────────────────
app.post('/api/signup', (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  console.log('Signup:', username, email);

  // Dummy response — no real DB
  res.json({
    message: 'Signup successful',
    user: { username, email },
  });
});

// ── Auth: Login ──────────────────────────────────────────────
// Returns a dummy JWT token so the dashboard's checkAuth() passes.
// In a real app you'd verify credentials and use jsonwebtoken to sign a real token.
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  console.log('Login:', email);

  // Dummy token — any string works here since the dashboard just checks it exists.
  // Format looks like a JWT so your frontend code won't break if it checks structure.
  const dummyToken = "dummy.jwt.token_cityfix_" + Date.now();

  // Extract a username from the email (e.g. "alex@gmail.com" → "alex")
  const username = email.split('@')[0];

  res.json({
    message: 'Login successful',
    token: dummyToken,
    username: username,
  });
});

// ── Complaints: GET all ──────────────────────────────────────
// Supports optional ?lat=&lng= query params (for future filtering by distance).
// For now it just returns all complaints regardless of location.
app.get('/api/complaints', (req, res) => {
  const { lat, lng } = req.query;

  // 💡 Future improvement: filter complaints within X km of lat/lng.
  // For now just log that we received the coords and return everything.
  if (lat && lng) {
    console.log(`Complaints requested near: lat=${lat}, lng=${lng}`);
  }

  res.json(COMPLAINTS);
});

// ── Complaints: POST new ─────────────────────────────────────
app.post('/api/complaints', (req, res) => {
  const { title, description, lat, lng, area } = req.body;

  if (!title || !description || lat == null || lng == null) {
    return res.status(400).json({
      error: 'Missing required fields: title, description, lat, lng',
    });
  }

  const newComplaint = {
    _id: String(COMPLAINTS.length + 1),
    title,
    description,
    status: 'pending',           // new complaints always start as pending
    area: area || 'Unknown Area',
    lat: parseFloat(lat),
    lng: parseFloat(lng),
    createdAt: new Date().toISOString(),
  };

  COMPLAINTS.push(newComplaint);
  console.log('New complaint added:', newComplaint.title);

  res.status(201).json(newComplaint);
});

// ── Start ────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n✅  CityFix dummy backend running at http://localhost:${PORT}`);
  console.log(`   POST http://localhost:${PORT}/api/signup`);
  console.log(`   POST http://localhost:${PORT}/api/login`);
  console.log(`   GET  http://localhost:${PORT}/api/complaints`);
  console.log(`   POST http://localhost:${PORT}/api/complaints\n`);
  console.log(`   Loaded ${COMPLAINTS.length} hardcoded complaints.\n`);
});