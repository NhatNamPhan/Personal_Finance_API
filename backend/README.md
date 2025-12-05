# Personal Finance API - Backend

FastAPI-based backend for Personal Finance Management System.

## Project Structure

```
backend/
├── src/
│   ├── app/
│   │   ├── controllers/     # HTTP request handlers
│   │   ├── services/        # Business logic layer
│   │   ├── models/          # Database models (for future SQLAlchemy migration)
│   │   ├── utils/           # Utility functions
│   │   └── main.py          # FastAPI application entry point
│   ├── core/                # Core functionality
│   │   ├── db.py           # Database connection
│   │   ├── security.py     # Security utilities (JWT, password hashing)
│   │   └── settings.py     # Application settings
│   ├── schemas/             # Pydantic schemas for validation
│   │   ├── user.py
│   │   ├── account.py
│   │   ├── category.py
│   │   ├── transaction.py
│   │   └── budget.py
│   └── config/              # Configuration files
├── Database/                # SQL files and database migrations
├── requirements.txt         # Python dependencies
├── .env.example            # Environment variables template
└── README.md               # This file
```

## Features

- **RESTful API** with FastAPI
- **PostgreSQL** database support
- **Pydantic** schemas for request/response validation
- **Layered Architecture**: Controllers → Services → Database
- **JWT Authentication** (ready for implementation)
- **CORS** support for frontend integration
- **Auto-generated API Documentation** (Swagger UI)

## Getting Started

### Prerequisites

- Python 3.12+
- PostgreSQL 15+
- pip

### Installation

1. **Create virtual environment**:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. **Install dependencies**:

```bash
pip install -r requirements.txt
```

3. **Set up environment variables**:

```bash
cp .env.example .env
```

4. **Update `.env`** with your database credentials:

```env
DB_HOST=localhost
DB_NAME=personal_finance
DB_USER=postgres
DB_PASS=your_password
DB_PORT=5432
```

5. **Set up database**:

   - Create PostgreSQL database
   - Run SQL files from `Database/` folder

6. **Run the application** (make sure you're in the `backend` directory):

```bash
uvicorn src.app.main:app --reload
```

**Important**: Run the command from the `backend` directory. The imports use `src.` prefix which requires the current directory to be `backend`.

The API will be available at:

- API: `http://localhost:8000`
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## API Endpoints

### Users

- `POST /users` - Create a new user
- `GET /users/{user_id}` - Get user by ID

### Accounts

- `POST /accounts` - Create a new account
- `GET /accounts?user_id={user_id}` - Get accounts for a user

### Categories

- `POST /categories` - Create a new category
- `GET /categories?user_id={user_id}&type={type}` - Get categories
- `GET /categories/{category_id}` - Get category by ID
- `PUT /categories/{category_id}` - Update category
- `DELETE /categories/{category_id}` - Delete category

### Transactions

- `POST /transactions` - Create a new transaction
- `GET /transactions?user_id={user_id}&start_date={date}&end_date={date}` - Get transactions
- `GET /transactions/{transaction_id}` - Get transaction by ID

### Budgets

- `POST /budgets` - Create a new budget
- `GET /budgets?user_id={user_id}&month={date}` - Get budgets
- `GET /budgets/{budget_id}` - Get budget by ID
- `PUT /budgets/{budget_id}` - Update budget
- `DELETE /budgets/{budget_id}` - Delete budget

### Analytics

- `GET /analytics/users/{user_id}/spending?start_date={date}&end_date={date}` - Get spending analytics
- `GET /analytics/users/{user_id}/budgets/progress?month={date}` - Get budget progress
- `GET /analytics/users/{user_id}/net-worth` - Get net worth

## Architecture

### Controllers

Handle HTTP requests and responses. They delegate business logic to services.

### Services

Contain business logic and database operations. They are independent of HTTP layer.

### Schemas

Pydantic models for request/response validation and serialization.

### Core

Core functionality including database connection, security utilities, and application settings.

## Development

### Running Tests

```bash
# Add tests in tests/ directory
pytest
```

### Code Style

Follow PEP 8 style guide. Consider using:

- `black` for code formatting
- `flake8` for linting
- `mypy` for type checking

## Migration from Old Structure

See [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) for details on migrating from the old structure.

## License

MIT
