from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.app.controllers.user_controller import router as user_router
from src.app.controllers.account_controller import router as account_router
from src.app.controllers.transaction_controller import router as transaction_router
from src.app.controllers.category_controller import router as category_router
from src.app.controllers.budget_controller import router as budget_router
from src.app.controllers.analytics_controller import router as analytics_router
from src.core.settings import settings

app = FastAPI(title=settings.PROJECT_NAME)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.get_cors_origins_list(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(user_router)
app.include_router(account_router)
app.include_router(transaction_router)
app.include_router(category_router)
app.include_router(budget_router)
app.include_router(analytics_router)

@app.get("/")
async def root():
    """Root endpoint."""
    return {"message": "Personal Finance API", "version": "1.0.0"}

 