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
6. Start backend server:
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
   - `copy .env.sample .env` (Windows)
4. Start app:
   - `npm start`

## Default Dummy Accounts
- Admin: `admin@notaryhub.local` / `Admin1234!`
- User: `user@notaryhub.local` / `User12345!`
- Seller: `seller@notaryhub.local` / `Seller123!`

## Notes
- This quiz build uses local dummy data/state in frontend to demonstrate flows quickly.
- PayPal is wired with placeholder environment variables and includes fallback demo actions.
- Do not commit `.env`; use `.env.sample` only.

## Suggested Commit Message Sequence
- `feat(backend): add role-based auth apps and API routes`
- `feat(frontend): implement screens, redux, and protected routing`
- `docs: add setup guide and env samples`
