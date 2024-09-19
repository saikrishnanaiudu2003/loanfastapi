from fastapi import APIRouter, HTTPException
from app.models import LoanCreate, Loan
from app.database import get_loan_collection
from typing import Optional
from typing import List

import math

router = APIRouter()



def calculate_monthly_payment(amount: float, interest_rate: float, term: int) -> float:
    if interest_rate == 0:
        return amount / term
    monthly_rate = interest_rate / 100 / 12
    return amount * (monthly_rate * math.pow(1 + monthly_rate, term)) / (math.pow(1 + monthly_rate, term) - 1)

@router.post("/loans/", response_model=Loan)
async def add_loan(loan: LoanCreate):
    loan_collection = get_loan_collection()
    loan_id = loan_collection.count_documents({}) + 1
    monthly_payment = calculate_monthly_payment(loan.amount, loan.interest_rate, loan.term)
    new_loan = loan.dict()
    new_loan.update({"id": loan_id, "monthly_payment": monthly_payment})
    loan_collection.insert_one(new_loan)
    return new_loan

@router.get("/loans/", response_model=List[Loan])
async def get_loans():
    loan_collection = get_loan_collection()
    loans = list(loan_collection.find({}, {"_id": 0}))
    return loans

@router.get("/loans/{loan_id}", response_model=Loan)
async def get_loan(loan_id: int):
    loan_collection = get_loan_collection()
    loan = loan_collection.find_one({"id": loan_id})
    if loan is None:
        raise HTTPException(status_code=404, detail="Loan not found")
    return loan

@router.get("/loans/filter/")
async def filter_loans(loan_type: Optional[str] = None, max_interest_rate: Optional[float] = None):
    loan_collection = get_loan_collection()
    query = {}
    if loan_type:
        query["loan_type"] = loan_type
    if max_interest_rate is not None:
        query["interest_rate"] = {"$lte": max_interest_rate}
    loans = list(loan_collection.find(query, {"_id": 0}))
    return loans

@router.delete("/loans/{loan_id}", response_model=dict)
async def delete_loan(loan_id: int):
    loan_collection = get_loan_collection()
    result = loan_collection.delete_one({"id": loan_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Loan not found")
    return {"detail": "Loan deleted successfully"}