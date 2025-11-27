from fastapi import FastAPI
from app.routers import users, accounts, transactions, categories, budgets

app = FastAPI(title="Personal Finance API")

# app.include_router(accounts.router)
# app.include_router(budgets.router)
# app.include_router(categories.router)
# app.include_router(transactions.router)
app.include_router(users.router)

 