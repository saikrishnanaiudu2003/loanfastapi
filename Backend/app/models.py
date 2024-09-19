from pydantic import BaseModel


class LoanBase(BaseModel):
    amount: float
    interest_rate: float
    term: int
    loan_type: str

class LoanCreate(LoanBase):
    pass

class Loan(BaseModel):
    id: int
    amount: float
    interest_rate: float
    term: int
    loan_type: str
    monthly_payment: float

    class Config:
        # For Pydantic v2
        from_attributes = True
