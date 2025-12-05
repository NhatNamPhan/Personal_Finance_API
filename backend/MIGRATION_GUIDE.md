# Migration Guide

This document explains the new project structure and how to migrate from the old structure.

## New Structure

The project has been restructured to follow a cleaner architecture:

```
backend/src/
├── app/
│   ├── controllers/     # HTTP request handlers (replaces routers/)
│   ├── services/        # Business logic layer
│   ├── models/          # Database models (for future SQLAlchemy migration)
│   ├── utils/           # Utility functions
│   └── main.py          # FastAPI app entry point
├── core/                # Core functionality
│   ├── db.py           # Database connection (moved from app/database.py)
│   ├── security.py     # Security utilities (JWT, password hashing)
│   └── settings.py     # Application settings
├── schemas/             # Pydantic schemas (moved from app/models.py)
│   ├── user.py
│   ├── account.py
│   ├── category.py
│   ├── transaction.py
│   └── budget.py
└── config/              # Configuration files
```

## Changes

### 1. Database Connection

- **Old**: `app/database.py`
- **New**: `app/core/db.py`
- **Update**: Imports changed from `from app.database import get_db` to `from app.core.db import get_db`

### 2. Models/Schemas

- **Old**: `app/models.py` (single file with all models)
- **New**: `app/schemas/` (separate files for each schema)
- **Update**: Imports changed from `from app.models import User` to `from app.schemas.user import User`

### 3. Routers → Controllers

- **Old**: `app/routers/` (contained business logic)
- **New**: `app/controllers/` (thin layer, delegates to services)
- **Update**: Controllers now use services for business logic

### 4. Services Layer

- **New**: `app/services/` (contains all business logic)
- **Purpose**: Separates business logic from HTTP handling

### 5. Settings

- **New**: `app/core/settings.py` (centralized configuration)
- **Benefits**: Type-safe settings, environment variable management

## Old Files (Can be Removed)

The following files are no longer used and can be safely removed:

- `app/database.py` → Use `core/db.py` instead
- `app/models.py` → Use `schemas/` directory instead
- `app/utils.py` → Use `app/utils/validators.py` instead
- `app/routers/` → Use `app/controllers/` instead

## Migration Steps

1. **Update imports in your code** (if you have custom code):

   - Change `from app.database import get_db` → `from app.core.db import get_db`
   - Change `from app.models import *` → `from app.schemas import *`

2. **Update environment variables**:

   - Copy `.env.example` to `.env`
   - Fill in your database credentials

3. **Test the application**:

   ```bash
   uvicorn src.app.main:app --reload
   ```

4. **Remove old files** (optional):
   ```bash
   rm app/database.py
   rm app/models.py
   rm app/utils.py
   rm -r app/routers/
   ```

## Benefits of New Structure

1. **Separation of Concerns**: Clear separation between HTTP handling, business logic, and data access
2. **Testability**: Services can be tested independently
3. **Maintainability**: Easier to find and modify code
4. **Scalability**: Easy to add new features following the same pattern
5. **Type Safety**: Better type hints and validation with Pydantic schemas
