# MERN Stack Application

A full-stack application built with MongoDB, Express, React, and Node.js.

## Features

- User Authentication (JWT)
- Product Management
- Theme Switching (Light/Dark)
- Component Logging System
- Docker Support
- Code Quality Tools (ESLint, Prettier)

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

## Project Structure

```
.
├── backend/             # Express backend
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Custom middleware
│   ├── models/        # Mongoose models
│   └── routes/        # Express routes
├── frontend/           # React frontend
│   ├── src/
│   │   ├── components/ # Reusable components
│   │   ├── contexts/   # React contexts
│   │   ├── hooks/     # Custom hooks
│   │   ├── pages/     # Page components
│   │   └── utils/     # Utility functions
│   └── public/        # Static files
└── docker-compose.yml  # Docker compose config
```

## Available Scripts

Backend:

- `npm run dev`: Start development server
- `npm start`: Start production server

Frontend:

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run lint`: Run ESLint

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
