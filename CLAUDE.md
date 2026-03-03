# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**NTX Luxury Van Rentals** — a MERN stack web app for luxury Mercedes Sprinter van rentals in the Dallas area. Rebranded from "YLU Ride" to "NTX Luxury Van Rentals" (some package.json names still reference the old name).

## Commands

```bash
# Install all dependencies (root + backend + frontend)
npm run install-all

# Run both frontend and backend concurrently (development)
npm run dev

# Run backend only (Express on port 5000, uses nodemon)
npm run server

# Run frontend only (Vite dev server)
npm run client

# Build frontend for production
npm run build

# Lint frontend
cd frontend && npm run lint
```

## Architecture

### Frontend (`frontend/`)
- **React 19** with Vite, React Router v6
- **UI Libraries**: MUI (Material UI v7) + React Bootstrap + custom CSS
- **Styling**: MUI ThemeProvider wraps the app; each component has a matching CSS file in `frontend/src/styles/`
- **Pages**: Home, Fleet, VanDetail, Booking, BookingSuccess, About, Contact, Login, Register, Dashboard
- **Key Components**: Header, Footer, Hero, OurServices, VanCard, VanGrid, BookingModal

### Backend (`backend/`)
- **Express.js** with MongoDB/Mongoose
- **API prefix**: All routes under `/api/` — auth, vans, bookings, payments, upload, contact
- **Integrations**:
  - **Stripe** — checkout sessions, webhooks, refunds (`/api/payments`)
  - **AWS S3** — driver's license image uploads via multer + multer-s3 (`/api/upload`), static site images served from `s3://ntxvanrentals/siteimages/`
  - **Nodemailer** — SendGrid SMTP for booking confirmations, admin notifications, contact form (`backend/utils/emailService.js`)
- **Auth**: JWT-based (`backend/middleware/auth.js`)
- **Models**: User, Van, Booking, Payment

### Production
Server serves the Vite build from `frontend/dist/` with a catch-all route for SPA routing.

## Brand & Styling

- **Navy Blue**: `#002244` (primary) | **Orange**: `#FB4F14` (accent)
- Theme defined in `frontend/src/styles/theme.js` — use `theme.palette.brand.navy` / `theme.palette.brand.orange`
- Font: Poppins (primary), Roboto (fallback)
- Mobile-first responsive design with breakpoints at 360px, 480px, 600px, 768px, 1024px, 1200px
- Minimum 44px touch targets for mobile

## Environment Variables (backend/.env)

Required: `MONGODB_URI`, `JWT_SECRET`, `EMAIL_USER`, `SENDGRID_API_KEY`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `S3_BUCKET_NAME`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `FRONTEND_URL`

## Conventions

- Always use unique className IDs to avoid CSS collisions
- Record all edits in `editsummary.txt` with date and description of changes
- Each component's styles live in a separate CSS file under `frontend/src/styles/`
