# RoomRent Maharashtra

Full-stack room and PG rental marketplace built for a Maharashtra-wide rollout, built with:

- Frontend: Next.js App Router, TypeScript, Tailwind CSS, DaisyUI, Redux Toolkit, Axios, Lucide React
- Backend: Spring Boot, Spring Security, JWT, JPA/Hibernate
- Database: MySQL

## Structure

- `client/` Next.js client application
- `server/` Spring Boot REST API
- `database/schema.sql` MySQL schema

## Run

### Frontend

1. `cd client`
2. `npm install`
3. `npm run dev`

### Backend

1. Install Maven 3.9+
2. `cd server`
3. `mvn spring-boot:run`

If Maven is not installed globally, use:

- PowerShell: `.\run-dev.ps1`
- CMD/PowerShell: `.\run-dev.cmd`

MySQL defaults are configured for:

- username: `root`
- password: `YBpmk@2702`
- database: `roomrent_maharashtra`

## Demo Accounts

- Admin: `admin@roomrent.in` / `admin123`
- Owner: `owner@roomrent.in` / `owner123`
- User: `user@roomrent.in` / `user123`
