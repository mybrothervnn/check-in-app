# Check-in App — Server

This is a minimal Express + MongoDB backend used by the check-in app frontend.

Default configuration is provided in `.env.example`. The server will read MONGO_URI and PORT from environment variables.

API endpoints:

- GET /health -> { ok: true }
- GET /api/customers -> list reward milestones
- POST /api/customers -> create/register a customer { name, phone }
- GET /api/customers/:phone -> get customer by phone (last 6 digits accepted)
- POST /api/customers/:phone/checkin -> increments visits, returns reward if milestone reached
- GET /api/customers/:phone/rewards -> get next milestone and remaining visits

Run locally:

```bash
cd Server
npm install
# edit .env or set MONGO_URI env var
npm start
```

By default the server listens on PORT (default 3000). CORS is allowed to the Angular dev server origin (http://localhost:4201) by default.
