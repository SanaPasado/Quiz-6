# Quiz 6 - Notary and Document Services Platform

Full-stack project for a notary/document services marketplace with a React frontend and Django REST backend.

## Tech Stack
- Frontend: Create React App, React Bootstrap, Redux
- Backend: Django, Django REST Framework, SimpleJWT
- Database: SQLite (development)
- Payments: PayPal (one-time order checkout and subscription checkout)
- AI: Gemini API (with strict domain guardrails)

## Project Structure
- `frontend/` - React app, screens, Redux actions/reducers
- `backend/` - Django apps, APIs, business logic, seed command

## Implemented Features
- User auth (email-based), profile, and role system (Admin, Seller, User)
- Seller application and admin approval/decline
- Service listing and detail pages
- Seller dashboard for managing services
- Orders and payment tracking
- Subscription plans for chatbot usage
- Admin subscription list view
- AI chatbot that only answers notary/document-service related questions

## Subscription Pricing
- Tier 1: PHP 150.00 (3 chatbot uses)
- Tier 2: PHP 300.00 (5 chatbot uses)
- Tier 3: PHP 450.00 (10 chatbot uses)

## Backend Setup
1. Open terminal in `backend/`.
2. Create and activate a virtual environment.
   (delete venv and recreate one if there is existing one that has errors)
4. Install dependencies:
   - `pip install -r requirements.txt`
5. Copy environment template:
   - `copy .env.sample .env`
6. Run migrations:
   - `python manage.py migrate`
7. Seed OG data (users, services, subscription tiers):
   - `python manage.py seed_og_data`
   - Optional reset passwords for existing OG users:
   - `python manage.py seed_og_data --reset-passwords`
8. Start backend:
   - `python manage.py runserver`

### Backend API Base Routes
- `/api/v1/users/`
- `/api/v1/applications/`
- `/api/v1/services/`
- `/api/v1/orders/`
- `/api/v1/subscriptions/`
- `/api/v1/chat/`

## Frontend Setup
1. Open terminal in `frontend/`.
2. Install dependencies:
   - `npm install`
3. Copy environment template:
   - `copy .env.sample .env`
4. Start frontend:
   - `npm start`

## OG Seed Data
The `seed_og_data` command creates/updates:
- Admin, User, Seller accounts
- Sample notary/document services
- Service sample images
- Subscription tiers with current pricing

This command is idempotent, so it is safe to run multiple times.

## PayPal Configuration

### Frontend
Set in `frontend/.env`:
- `REACT_APP_PAYPAL_CLIENT_ID=YOUR_CLIENT_ID`

### Backend
Set in `backend/.env`:
- `PAYPAL_CLIENT_ID=YOUR_CLIENT_ID`
- `PAYPAL_CLIENT_SECRET=YOUR_CLIENT_SECRET`
- `PAYPAL_BASE_URL=https://api-m.sandbox.paypal.com` (sandbox)

If these are missing, PayPal subscription checkout will not proceed.

## AI Chatbot Scope Rules
The chatbot is intentionally restricted to this project domain:
- Notary and document services
- Service listings and seller concerns
- Subscriptions, usage, and chatbot access
- Orders and payment workflow on this platform

Out-of-scope prompts are politely refused.

## Important Notes
- Do not commit `.env` files.
- Use sandbox PayPal credentials for development.
- Run `python manage.py seed_og_data` after changing seed values.
