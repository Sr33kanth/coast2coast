# Coast2Coast

A visually rich, interactive web app to chronicle an epic coast-to-coast road trip across the United States—from the Golden Gate Bridge in San Francisco to the Empire State Building in New York City.

Track the journey, view check-ins and photos on an interactive map, and leave messages in the guestbook!

---

## Tech Stack

- **Frontend:** React (with Vite), TypeScript, Tailwind CSS, Framer Motion
- **Backend/Data:** Supabase (Postgres, Auth, Storage)
- **Mapping:** Leaflet.js
- **Deployment:** Netlify

---

## Getting Started

1. **Clone the repo:**
   ```bash
   git clone https://github.com/Sr33kanth/coast2coast.git
   cd coast2coast
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure environment variables:**
   - Copy `.env.example` to `.env` and fill in your Supabase credentials:
     ```
     VITE_SUPABASE_URL=your-supabase-url
     VITE_SUPABASE_ANON_KEY=your-anon-key
     ```
4. **Run locally:**
   ```bash
   npm run dev
   ```
   App will be at [http://localhost:5173](http://localhost:5173)

---

## Deployment (Netlify)

- Environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) must be set in Netlify dashboard.
- Ensure the `public/_redirects` file exists with:
  ```
  /*    /index.html   200
  ```
- Build command: `npm run build`
- Publish directory: `dist`

---

## Testing

- **Lint:**
  ```bash
  npm run lint
  ```
- **Unit/Integration tests:** (If tests exist)
  ```bash
  npm run test
  ```
- **Manual testing:**
  - Check navigation, login, map, photo upload, and guestbook features in browser.

---

## Features

- Animated hero section and parallax background
- Interactive map with check-ins and photo markers
- Road trip stats and about section
- Admin route for managing stops and uploading photos
- Guestbook for visitors

---

## License

MIT
