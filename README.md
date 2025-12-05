# Personal Finance Management System

A full-stack personal finance management application built with FastAPI (backend) and React (frontend).

## Project Structure

```
personal_finance_app/
├── backend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── routers/        # API route handlers (legacy - can be removed)
│   │   │   ├── controllers/     # Request handlers
│   │   │   ├── services/        # Business logic layer
│   │   │   ├── models/          # Database models (for future SQLAlchemy migration)
│   │   │   ├── utils/           # Utility functions
│   │   │   └── main.py          # FastAPI application entry point
│   │   ├── config/               # Configuration files
│   │   ├── schemas/             # Pydantic schemas for request/response validation
│   │   └── core/                # Core functionality (database, security, settings)
│   ├── Database/                # SQL files and database migrations
│   ├── requirements.txt         # Python dependencies
│   ├── .env.example             # Environment variables template
│   └── README.md                # Backend documentation
│
├── frontend/
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── pages/               # Page components
│   │   ├── hooks/               # Custom React hooks
│   │   ├── services/            # API service layer
│   │   ├── context/             # React context providers
│   │   ├── assets/              # Static assets
│   │   └── App.jsx              # Main App component
│   ├── public/                  # Public assets
│   ├── package.json             # Node.js dependencies
│   ├── vite.config.js           # Vite configuration
│   └── README.md                # Frontend documentation
│
├── docker-compose.yml           # Docker Compose configuration
├── .gitignore                   # Git ignore rules
└── README.md                    # This file
```

## Features

- **User Management**: Create and manage users
- **Account Management**: Track multiple accounts (checking, savings, credit cards, cash)
- **Category Management**: Organize transactions by categories (income/expense)
- **Transaction Tracking**: Record and query financial transactions
- **Budget Management**: Set and track budgets by category and month
- **Analytics**: View spending summaries, budget progress, and net worth

## Getting Started

### Quick Start (Khuyến nghị)

**Windows:**

```bash
start_all.bat
```

**Linux/Mac:**

```bash
chmod +x start_all.sh
./start_all.sh
```

Xem chi tiết trong [HOW_TO_RUN.md](./HOW_TO_RUN.md)

### Prerequisites

- Python 3.12+
- Node.js 18+
- PostgreSQL 15+
- Docker and Docker Compose (optional)

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Create a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Copy environment variables:

```bash
cp .env.example .env
```

5. Update `.env` with your database credentials.

6. Set up the database (run SQL files in `Database/` folder).

7. Run the backend:

```bash
uvicorn src.app.main:app --reload
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Copy environment variables:

```bash
cp .env.example .env
```

4. Run the development server:

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Docker Setup

1. Start all services:

```bash
docker-compose up -d
```

2. Stop all services:

```bash
docker-compose down
```

## API Documentation

Once the backend is running, visit:

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Architecture

### Backend Architecture

- **Controllers**: Handle HTTP requests and responses
- **Services**: Contain business logic and database operations
- **Schemas**: Define data models and validation rules
- **Core**: Core functionality (database connection, security, settings)

### Frontend Architecture

- **Components**: Reusable UI components
- **Pages**: Page-level components
- **Services**: API communication layer
- **Hooks**: Custom React hooks for shared logic
- **Context**: Global state management

## Development

### Backend Development

The backend follows a layered architecture:

1. **Routers/Controllers** receive HTTP requests
2. **Services** handle business logic
3. **Database** layer handles data persistence

### Frontend Development

The frontend uses:

- React 18 for UI
- Vite for build tooling
- React Router for navigation (to be implemented)

## License

MIT
