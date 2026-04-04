# Nutrition Plan Manager

A full-stack MERN application for managing nutrition plans and tracking meals. Built with Node.js, Express, React, and MongoDB.

## Features

- User authentication (register, login, JWT)
- Create, read, update, delete nutrition plans
- Add and remove meals within plans
- Track calories, protein, carbs, and fats
- Filter and search plans
- Responsive UI with Tailwind CSS

## Tech Stack

- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Frontend**: React.js, Tailwind CSS, Axios
- **Auth**: JWT, bcrypt
- **CI/CD**: GitHub Actions, AWS EC2, PM2

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- npm

### Setup

1. Clone the repo
```bash
git clone https://github.com/Karol-969/sampleapp_IFQ636.git
cd sampleapp_IFQ636
```

2. Install dependencies
```bash
npm run install-all
```

3. Configure environment variables
```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your MongoDB URI and JWT secret
```

4. Run in development mode
```bash
npm run dev
```

Backend runs on `http://localhost:5001`
Frontend runs on `http://localhost:3000`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/profile | Get user profile |
| PUT | /api/auth/profile | Update user profile |
| GET | /api/plans | Get all plans (auth required) |
| POST | /api/plans | Create a plan |
| GET | /api/plans/:id | Get single plan |
| PUT | /api/plans/:id | Update a plan |
| DELETE | /api/plans/:id | Delete a plan |
| POST | /api/plans/:id/meals | Add meal to plan |
| DELETE | /api/plans/:id/meals/:mealId | Remove meal |

## Branching Strategy

- `main` - production branch
- `feature/backend-crud` - backend CRUD operations
- `feature/frontend-ui` - frontend pages and components
- `feature/cicd-pipeline` - CI/CD and deployment config

## Author

Karol Bhandari - IFN636 Assessment 1.2
