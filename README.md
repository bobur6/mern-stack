# MERN Stack Application

A full-stack application built with MongoDB, Express, React, and Node.js.

## Features

- User Authentication (JWT)
- Product Management (CRUD)
- MongoDB Aggregation: product statistics (total, average price)
- Theme Switching (Light/Dark, persists in localStorage)
- Component Logging System (mount/unmount/re-render, can be enabled/disabled)
- Docker & Docker Compose Support
- Nginx Load Balancer (multiple backend containers)
- Dynamic Import (React.lazy) for Login/Register pages
- useMemo for optimized filtering/calculations
- Node-cache for backend caching
- Code Quality Tools (ESLint, Prettier, Stylelint)
- Git Hooks: Husky, Lint-staged, Commitlint

## Prerequisites

- Node.js 18+
- Docker and Docker Compose
- MongoDB (if running locally)

## Quick Start

1. Clone the repository:

```bash
git clone <repository-url>
cd mern-project
```

2. Copy environment files:

```bash
cp .env.example .env
```

3. Start with Docker:

```bash
docker-compose up --build
```

Or run locally:

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (in another terminal)
cd frontend
npm install
npm run dev
```

4. Access the application:

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Environment Variables

See `.env.example` for required environment variables.

## Load Balancer

This project uses an Nginx load balancer (via docker-compose) to distribute API requests between two backend containers. All `/api/*` requests are automatically balanced in round-robin fashion.

- Load balancer config: `docker-compose.yml` and `nginx.conf` (see project root)
- Both backend containers share the same MongoDB instance, so all API features (login, register, product management, aggregation, etc.) work seamlessly.
- To check balancing, send multiple requests to `/api/products` or `/api/ping` and observe logs for both containers.

## Project Structure

```
.
├── backend/             # Express backend
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers (includes aggregation, async fs)
│   ├── middleware/     # Auth, error logging, etc.
│   ├── models/         # Mongoose models
│   ├── routes/         # Express routes
│   ├── cache.js        # Node-cache instance
├── frontend/           # React frontend
│   ├── src/
│   │   ├── components/ # Reusable components
│   │   ├── contexts/   # ThemeContext, AuthContext
│   │   ├── hooks/      # Custom hooks (useComponentLogger, useAuth)
│   │   ├── pages/      # Page components (dynamic imports)
│   │   └── utils/      # logger.js (logging system)
│   └── public/         # Static files
├── nginx.conf          # Nginx load balancer config
└── docker-compose.yml  # Docker compose config
```

## Code Quality & Git Hooks

- **ESLint**: Lints JavaScript/JSX code
- **Prettier**: Auto-formats code
- **Stylelint**: Lints CSS/SCSS
- **Husky**: Runs git hooks (pre-commit, pre-push)
- **Lint-staged**: Runs linters only on staged files
- **Commitlint**: Enforces commit message conventions

## Advanced Features

- **Theme Context**: Theme is managed globally and persisted in localStorage
- **Component Logging**: All mounts/unmounts/re-renders are logged (can be toggled in Navbar)
- **Dynamic Import**: Login/Register pages loaded via React.lazy
- **Node-cache**: Backend uses node-cache for product caching
- **MongoDB Aggregation**: `/api/products/stats` endpoint returns total and average price
- **Async File Read**: Example of non-blocking fs.readFile in backend

## Available Scripts

Backend:

- `npm run dev`: Start development server
- `npm start`: Start production server
- `npm run lint`: Run ESLint

Frontend:

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run lint`: Run ESLint
- `npm run format`: Run Prettier
- `npm run style:lint`: Run Stylelint

## Usage Notes

- **Logging**: You can enable/disable component logging in the Navbar (top-right corner).
- **Theme**: Switch between light/dark themes, your choice is saved.
- **Product Stats**: Product statistics (total, average price) are calculated via MongoDB aggregation and shown on the Products page.
- **Dynamic Imports**: Login and Register pages are loaded only when needed for better performance.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
