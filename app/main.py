from fastapi import FastAPI
from app.routers import users, accounts, transactions, categories, budgets

app = FastAPI(title="Personal Finance API")


 