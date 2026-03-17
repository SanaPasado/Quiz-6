# Quiz 6 - Notary and Document Services Platform

Combined repository for a React frontend and Django REST backend.

## Tech Stack
- Frontend: Create React App + React Bootstrap + Bootswatch + Redux
- Backend: Django + Django REST Framework + JWT (SimpleJWT)
- Database: SQLite (development)

## Repository Structure
- `frontend/`: User interface and Redux state
- `backend/`: REST API and business logic

## Key Features Implemented
- Service list and details pages with card design
- Sign in (email-based) and sign up with required fields and validation
- Role model: Admin, Seller, User
- Seller application flow with Admin approve/decline and modal inputs
- Admin users management table (edit/delete)
- Seller dashboard for add/manage services
- Orders logging flow with PayPal button integration placeholders
- User profile page with user details and orders table
- Subscription tiers (3/5/10 chatbot usage) and admin subscription transactions table
- AI chatbot limited to notary/document domain and gated by subscription usage
- Protected routes (redirect to login when not signed in)

## Backend Setup
1. Open terminal in `backend/`.
2. Create and activate virtual environment (recommended).
3. Install packages:
   - `pip install -r requirements.txt`
4. Copy env template:
   - `copy .env.sample .env` (Windows)
5. Run migrations:
   - `python manage.py migrate`
6. Seed OG development data (users, services, tiers):
   - `python manage.py seed_og_data`
   - Optional password reset for existing seeded users: `python manage.py seed_og_data --reset-passwords`
7. Start backend server:
   - `python manage.py runserver`

Backend base routes:
- `/api/v1/users/`
- `/api/v1/applications/`
- `/api/v1/services/`
- `/api/v1/orders/`
- `/api/v1/chat/`
- `/api/v1/subscriptions/`

## Frontend Setup
1. Open terminal in `frontend/`.
2. Install dependencies:
   - `npm install`
3. Copy env template:
   - `copy .env.example .env` (Windows)
4. Start app:
   - `npm start`

## Notes
- Frontend is wired to backend APIs (`/api/v1/*`) and no longer depends on dummy seed reducers.
- Service checkout uses one-time PayPal payment in the service detail screen.
- Subscription is used for AI chatbot usage gating only.
- Do not commit `.env`; use `.env.example` only.

## PayPal Client ID (for one-time service payment)
1. Go to the PayPal Developer Dashboard.
2. Create or open a REST app under **Sandbox** for development.
3. Copy the app **Client ID**.
4. Paste into [frontend/.env](frontend/.env):
   - `REACT_APP_PAYPAL_CLIENT_ID=YOUR_CLIENT_ID`
5. Restart the frontend dev server after editing `.env`.

## PayPal Subscription Requirements
1. Frontend requires `REACT_APP_PAYPAL_CLIENT_ID` in `frontend/.env`.
2. Backend requires these in `backend/.env` for subscription verification:
   - `PAYPAL_CLIENT_ID=YOUR_CLIENT_ID`
   - `PAYPAL_CLIENT_SECRET=YOUR_CLIENT_SECRET`
   - Optional sandbox override: `PAYPAL_BASE_URL=https://api-m.sandbox.paypal.com`
3. Ensure tiers have PayPal plan IDs (already set by subscription migrations) and rerun migrations if needed.

## Suggested Commit Message Sequence
- `feat(backend): add role-based auth apps and API routes`
- `feat(frontend): implement screens, redux, and protected routing`
- `docs: add setup guide and env samples`
