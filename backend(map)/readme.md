# CivicPulse — Dashboard Setup

## Project Structure

```
civicpulse/
├── server.js             ← Dummy Express backend
├── package.json
└── src/
    ├── pages/
    │   └── dashboard.html
    ├── CSS/
    │   └── dashboard.css
    ├── JS/
    │   ├── dashboard.js
    │   └── map.js
    └── services/
        └── complaintService.js
```

---

## Step 1 — Start the Backend Server

Make sure [Node.js](https://nodejs.org) is installed (v14+), then:

```bash
# Install dependencies
npm install

# Start the server
node server.js
```

You should see:
```
✅  CivicPulse backend running at http://localhost:3000
   GET  http://localhost:3000/api/complaints
```

Test it in your browser or with curl:
```bash
curl http://localhost:3000/api/complaints
```

---

## Step 2 — Open the Dashboard

> **Important:** The dashboard uses `fetch()` to call the backend.  
> Because of browser CORS rules, you **cannot** just double-click `dashboard.html`.  
> You need to serve the frontend from a local HTTP server.

### Option A — VS Code Live Server (recommended)

1. Install the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) in VS Code.
2. Right-click `src/pages/dashboard.html` → **Open with Live Server**.
3. It opens at something like `http://127.0.0.1:5500/src/pages/dashboard.html`.

### Option B — Python HTTP Server

```bash
# From the project root
python3 -m http.server 5500
```
Then visit: `http://localhost:5500/src/pages/dashboard.html`

### Option C — Node http-server

```bash
npx http-server . -p 5500
```
Then visit: `http://localhost:5500/src/pages/dashboard.html`

---

## How It Works

| File | Role |
|---|---|
| `server.js` | Express backend, serves `GET /api/complaints` |
| `dashboard.html` | Page shell — navbar, map container, list container |
| `dashboard.css` | All layout and visual styling |
| `dashboard.js` | Loads data, renders cards, wires buttons |
| `map.js` | Leaflet map init, marker rendering, click events |
| `complaintService.js` | `fetch()` wrapper for the API |

### Map interaction
- **Markers** — Each complaint from the API appears as a pin on the map. Click a pin to see a popup with complaint details.
- **List cards** — Click a card in the sidebar to fly the map to that complaint.
- **Click on map** — Drops a blue pin and captures the lat/lng (shown below the map). This location is pre-filled when you navigate to "File Complaint".

### Auth
The `complaintService.js` reads a JWT from `localStorage.getItem('token')` and sends it as a `Bearer` token. For this dummy backend the token check is commented out — just log in via your existing login page and the token will be picked up automatically.

---

## Adding More Complaints (dev)

```bash
curl -X POST http://localhost:3000/api/complaints \
  -H "Content-Type: application/json" \
  -d '{"title":"Broken Footpath","description":"Tiles lifted","latitude":30.2860,"longitude":78.0305}'
```

> Note: POST data resets when you restart `server.js` (in-memory only).